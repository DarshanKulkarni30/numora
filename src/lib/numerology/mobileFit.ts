import {
  lifePathFromDob,
  reduceToSingleDigit,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "./dateNumbers";
import { calculateLoShu, loShuFromGrid } from "./loShu";
import type { ConsecutiveRun } from "./mobileNumber";
import {
  findConsecutiveRuns,
  parseMobile,
  type MobileParseOk,
} from "./mobileNumber";
import {
  pairScore,
  slidingPairs,
  type CompoundPair,
} from "./mobileCompoundPairs";
import {
  rootFitScore,
  rootFitTone,
  strainDigitsForChart,
  type RootFitTone,
} from "./mobileRootFit";
import type { LoShuResult } from "./types";

export type MobileUse = "personal" | "business";

export type MobileVerdict = "Supportive" | "Mixed" | "Caution";

export type DigitFlagKind =
  | "overCount"
  | "alreadyInGrid"
  | "strainRepeat"
  | "strainSequence";

export type DigitFlag = {
  digit: number;
  kind: DigitFlagKind;
  count: number;
};

export type MobilePillars = {
  root: number;
  gaps: number;
  pairs: number;
  repeats: number;
};

export type MobileFit = {
  use: MobileUse;
  parsed: MobileParseOk;
  birthNumber: number;
  destinyNumber: number;
  lifePath: number;
  core: number;
  bnTone: RootFitTone;
  dnTone: RootFitTone;
  lpTone: RootFitTone;
  personLoShu: LoShuResult;
  mobileLoShu: LoShuResult;
  digitCounts: number[];
  flags: DigitFlag[];
  strainRuns: ConsecutiveRun[];
  pairs: CompoundPair[];
  filledMissing: number[];
  pillars: MobilePillars;
  score: number;
  verdict: MobileVerdict;
  line: string;
};

function mobileGridFromCounts(counts: number[]): Record<number, number> {
  const grid: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };
  for (let d = 1; d <= 9; d++) {
    grid[d] = counts[d] ?? 0;
  }
  return grid;
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function weakestPillar(p: MobilePillars): keyof MobilePillars {
  const keys = ["root", "gaps", "pairs", "repeats"] as const;
  return keys.reduce((a, b) => (p[b] < p[a] ? b : a));
}

function verdictLine(
  verdict: MobileVerdict,
  pillars: MobilePillars,
  bnTone: RootFitTone,
  dnTone: RootFitTone,
): string {
  const weak = weakestPillar(pillars);
  const rootNote =
    bnTone === "Favourable" && dnTone === "Favourable"
      ? "The total sits easily with birth number and destiny"
      : bnTone === "Heavy" && dnTone === "Heavy"
        ? "The total sits heavy with both birth number and destiny"
        : "The total is mixed against birth number and destiny";

  const extra =
    weak === "root"
      ? ""
      : weak === "gaps"
        ? "; missing chart digits are only partly covered"
        : weak === "pairs"
          ? "; the adjacent pairs lean heavy"
          : "; some digits repeat more than this chart likes";

  if (verdict === "Supportive") {
    return `${rootNote}.`;
  }
  if (verdict === "Caution") {
    return `${rootNote}${extra || "; treat this number as a careful check"}.`;
  }
  return `${rootNote}${extra}.`;
}

export function evaluateMobileFit(
  dob: string,
  raw: string,
  use: MobileUse = "personal",
): { ok: false; error: string } | { ok: true; fit: MobileFit } {
  const parsed = parseMobile(raw);
  if (!parsed.ok) return parsed;

  const birthNumber = vedicPsychicFromDob(dob);
  const destinyNumber = vedicDestinyFromDob(dob);
  const lifePath = reduceToSingleDigit(lifePathFromDob(dob));
  const core = parsed.core;

  const bnTone = rootFitTone(birthNumber, core);
  const dnTone = rootFitTone(destinyNumber, core);
  const lpTone = rootFitTone(lifePath, core);

  const personLoShu = calculateLoShu(dob);
  const mobileLoShu = loShuFromGrid(
    mobileGridFromCounts(parsed.digitCounts),
    "Mobile digit grid from the national number (1–9 only).",
  );

  const strainDigits = strainDigitsForChart(birthNumber, destinyNumber);
  const strainRuns = findConsecutiveRuns(parsed.digits, 2).filter((run) => {
    const d = Number(run.digit);
    return d >= 1 && d <= 9 && strainDigits.has(d);
  });

  const flags: DigitFlag[] = [];
  for (let d = 0; d <= 9; d++) {
    const count = parsed.digitCounts[d] ?? 0;
    if (count > 2) {
      flags.push({ digit: d, kind: "overCount", count });
    }
    if (d >= 1 && count > 1 && (personLoShu.grid[d] ?? 0) > 0) {
      flags.push({ digit: d, kind: "alreadyInGrid", count });
    }
    if (d >= 1 && count > 1 && strainDigits.has(d)) {
      flags.push({ digit: d, kind: "strainRepeat", count });
    }
  }
  for (const run of strainRuns) {
    flags.push({
      digit: Number(run.digit),
      kind: "strainSequence",
      count: run.length,
    });
  }

  const missing = personLoShu.missing_numbers;
  const filledMissing = missing.filter(
    (n) => (parsed.digitCounts[n] ?? 0) > 0,
  );
  const gaps =
    missing.length === 0 ? 1 : filledMissing.length / missing.length;

  const pairs = slidingPairs(parsed.digits);
  const pairPillar =
    pairs.length === 0
      ? 0.5
      : pairs.reduce((s, p) => s + pairScore(p.polarity), 0) / pairs.length;

  const overCountDigits = new Set(
    flags.filter((f) => f.kind === "overCount").map((f) => f.digit),
  );
  const strainRepeatDigits = new Set(
    flags.filter((f) => f.kind === "strainRepeat").map((f) => f.digit),
  );
  let repeats = 1;
  repeats -= overCountDigits.size * 0.25;
  repeats -= strainRepeatDigits.size * 0.25;
  repeats -= strainRuns.length * 0.35;
  repeats = clamp01(repeats);

  const root = (rootFitScore(bnTone) + rootFitScore(dnTone)) / 2;
  const pillars: MobilePillars = {
    root,
    gaps,
    pairs: pairPillar,
    repeats,
  };

  let score = Math.round(
    100 * (0.5 * root + 0.2 * gaps + 0.2 * pairPillar + 0.1 * repeats),
  );
  const bothHeavy = bnTone === "Heavy" && dnTone === "Heavy";
  const hasStrainSeq = strainRuns.length > 0;
  if (hasStrainSeq || bothHeavy) {
    score = Math.min(score, 44);
  }

  let verdict: MobileVerdict;
  if (score < 45) verdict = "Caution";
  else if (score >= 70 && root >= 0.75 && !hasStrainSeq) verdict = "Supportive";
  else verdict = "Mixed";

  return {
    ok: true,
    fit: {
      use,
      parsed,
      birthNumber,
      destinyNumber,
      lifePath,
      core,
      bnTone,
      dnTone,
      lpTone,
      personLoShu,
      mobileLoShu,
      digitCounts: parsed.digitCounts,
      flags,
      strainRuns,
      pairs,
      filledMissing,
      pillars,
      score,
      verdict,
      line: verdictLine(verdict, pillars, bnTone, dnTone),
    },
  };
}

export function flaggedDigits(flags: DigitFlag[]): Set<number> {
  return new Set(flags.map((f) => f.digit));
}

export function flagKindsForDigit(
  flags: DigitFlag[],
  digit: number,
): DigitFlagKind[] {
  return flags.filter((f) => f.digit === digit).map((f) => f.kind);
}
