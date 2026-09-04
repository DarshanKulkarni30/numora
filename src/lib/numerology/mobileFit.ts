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
  compoundPairKey,
  isSeverePair,
  normalizePairRaw,
  pairDirectionNote,
  pairFrequencies,
  pairRawScore,
  type CompoundPair,
} from "./mobileCompoundPairs";
import {
  chartNoteForPair,
  scoreSequence,
  type PairInsight,
  type SequenceBreakdown,
} from "./mobileSequence";
import {
  alignmentPoints,
  rootFitTone,
  strainDigitsForChart,
  type RootFitTone,
} from "./mobileRootFit";
import type { LoShuResult } from "./types";

export type MobileUse = "personal" | "business";

export type MobileVerdict =
  | "Exceptional"
  | "Excellent"
  | "Good"
  | "Acceptable"
  | "Weak"
  | "Avoid";

export type DigitFlagKind =
  | "overCount"
  | "alreadyInGrid"
  | "strainRepeat"
  | "strainSequence"
  | "severePair";

export type DigitFlag = {
  digit: number;
  kind: DigitFlagKind;
  count: number;
};

export type LoShuImpact = {
  covers: number[];
  stillQuiet: number[];
  pilesOn: number[];
  overdose: number[];
  line: string;
};

export type MobilePillars = {
  sequence: number;
  ending: number;
  destiny: number;
  birth: number;
  loShu: number;
  pairing: SequenceBreakdown;
};

export type MobileFit = {
  use: MobileUse;
  parsed: MobileParseOk;
  birthNumber: number;
  destinyNumber: number;
  lifePath: number;
  core: number;
  compound: number;
  bnTone: RootFitTone;
  dnTone: RootFitTone;
  lpTone: RootFitTone;
  personLoShu: LoShuResult;
  mobileLoShu: LoShuResult;
  digitCounts: number[];
  flags: DigitFlag[];
  strainRuns: ConsecutiveRun[];
  pairs: CompoundPair[];
  pairInsights: PairInsight[];
  filledMissing: number[];
  loShuImpact: LoShuImpact;
  hasSevereConflict: boolean;
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

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function classify(score: number, hasSevere: boolean): MobileVerdict {
  let band: MobileVerdict;
  if (score >= 90) band = "Exceptional";
  else if (score >= 80) band = "Excellent";
  else if (score >= 70) band = "Good";
  else if (score >= 60) band = "Acceptable";
  else if (score >= 50) band = "Weak";
  else band = "Avoid";
  if (hasSevere && (band === "Exceptional" || band === "Excellent")) {
    return "Good";
  }
  return band;
}

function compoundVsChart(compound: number, chartNumber: number): number {
  const key = compoundPairKey(compound);
  const pairPts = normalizePairRaw(pairRawScore(key)) * 25;
  const digits = String(compound)
    .split("")
    .map(Number)
    .filter((d) => d >= 1 && d <= 9);
  const digitPts =
    digits.length === 0
      ? 13
      : digits.reduce((s, d) => s + alignmentPoints(chartNumber, d), 0) /
        digits.length;
  return (pairPts + digitPts) / 2;
}

/**
 * Lo Shu is a controlled bonus: fill quiet cells, do not overdose a strong
 * digit, and do not award a fill that sits inside a high-conflict pair.
 */
function loShuPoints(args: {
  person: LoShuResult;
  counts: number[];
  pairs: CompoundPair[];
  sequenceSafe: boolean;
  alignOk: boolean;
}): { points: number; filledMissing: number[] } {
  const { person, counts, pairs, sequenceSafe, alignOk } = args;
  const allowBonus = sequenceSafe && alignOk;
  let pts = 10;
  const filledMissing: number[] = [];

  for (let n = 1; n <= 9; n++) {
    const personC = person.grid[n] ?? 0;
    const mobileC = counts[n] ?? 0;
    if (mobileC === 0) continue;
    if (personC === 0) filledMissing.push(n);

    const conflictedFill = pairs.some(
      (p) => p.kind === "severeConflict" && p.pair.includes(String(n)),
    );

    let delta = 0;
    if (personC === 0) {
      if (mobileC === 1) delta = 5;
      else if (mobileC === 2) delta = 3;
      else delta = -3;
      if (conflictedFill) delta = Math.min(delta, 0);
    } else if (personC === 1) {
      if (mobileC === 1) delta = 3;
      else if (mobileC === 2) delta = 1;
      else delta = -3;
    } else if (mobileC === 1) {
      delta = 0;
    } else if (mobileC <= 3) {
      delta = -3;
    } else {
      delta = -5;
    }
    if (mobileC >= 4) delta = Math.min(delta, -5);

    if (!allowBonus && delta > 0) delta = 0;
    pts += delta;
  }

  return { points: clamp(pts, 0, 20), filledMissing };
}

function loShuImpactLine(
  person: LoShuResult,
  counts: number[],
  filledMissing: number[],
): LoShuImpact {
  const stillQuiet = person.missing_numbers.filter((n) => (counts[n] ?? 0) === 0);
  const pilesOn: number[] = [];
  const overdose: number[] = [];
  for (let n = 1; n <= 9; n++) {
    const p = person.grid[n] ?? 0;
    const m = counts[n] ?? 0;
    if (p >= 1 && m >= 2) pilesOn.push(n);
    if (p >= 2 && m >= 3) overdose.push(n);
  }
  const bits: string[] = [];
  if (filledMissing.length) {
    bits.push(`covers quiet ${filledMissing.join(", ")}`);
  }
  if (stillQuiet.length) {
    bits.push(`leaves ${stillQuiet.join(", ")} quiet`);
  }
  if (overdose.length) {
    bits.push(`overloads ${overdose.join(", ")} already strong on the birth grid`);
  } else if (pilesOn.length) {
    bits.push(`adds extra ${pilesOn.join(", ")} on cells the birth grid already has`);
  }
  if (bits.length === 0) {
    bits.push("adds little new coverage and little extra pile-up");
  }
  return {
    covers: filledMissing,
    stillQuiet,
    pilesOn,
    overdose,
    line: `This number ${bits.join("; ")}.`,
  };
}

function buildPairInsights(
  pairs: CompoundPair[],
  digits: string,
  birthNumber: number,
  destinyNumber: number,
): PairInsight[] {
  const freq = pairFrequencies(pairs);
  const runs = findConsecutiveRuns(digits, 2);
  const seen = new Set<string>();
  const out: PairInsight[] = [];
  for (const p of pairs) {
    if (seen.has(p.pair)) continue;
    seen.add(p.pair);
    const run = runs.find(
      (r) =>
        r.digit === p.pair[0] &&
        p.pair[0] === p.pair[1] &&
        p.index >= r.start &&
        p.index < r.start + r.length,
    );
    out.push({
      pair: p.pair,
      kind: p.kind,
      raw: p.raw,
      motif: p.motif,
      count: freq.get(p.pair) ?? 1,
      firstIndex: p.index,
      inRun: Boolean(run),
      runLength: run?.length ?? 0,
      directionNote: pairDirectionNote(p.pair),
      chartNote: chartNoteForPair(p.pair, birthNumber, destinyNumber),
    });
  }
  return out;
}

function verdictLine(
  verdict: MobileVerdict,
  pillars: MobilePillars,
  hasSevere: boolean,
): string {
  const parts: string[] = [];
  if (hasSevere) {
    parts.push(
      "A traditionally high-conflict pair is present, so this stays a careful pick",
    );
  }
  if (pillars.sequence < 18) {
    parts.push("the inner sequence is uneven");
  }
  if (pillars.destiny < 12) {
    parts.push("the total sits awkwardly with destiny");
  } else if (pillars.birth < 10) {
    parts.push("the total sits awkwardly with the birth number");
  }
  if (pillars.loShu < 8) {
    parts.push("the grid adds more pile-up than cover");
  } else if (pillars.loShu >= 14 && !hasSevere) {
    parts.push("quiet birth-grid cells get a useful lift");
  }

  const note =
    parts.length > 0
      ? parts.join("; ")
      : "Sequence and chart alignment sit in a workable range";

  if (verdict === "Exceptional" || verdict === "Excellent") {
    return `${note}. Traditional reading only—not a prediction of events.`;
  }
  if (verdict === "Avoid" || verdict === "Weak") {
    return `${note}. Traditional reading only—not a prediction of events.`;
  }
  return `${note}. Traditional reading only—not a prediction of events.`;
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
  const compound = parsed.compound;

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

  const seq = scoreSequence(parsed.digits, birthNumber, destinyNumber);
  const pairs = seq.pairs;
  const hasSevereConflict = pairs.some((p) => isSeverePair(p.pair));
  const pairInsights = buildPairInsights(
    pairs,
    parsed.digits,
    birthNumber,
    destinyNumber,
  );

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
  if (hasSevereConflict) {
    flags.push({ digit: 0, kind: "severePair", count: 1 });
  }

  const sequence = seq.breakdown.total;
  const ending = seq.breakdown.ending;

  const dnRoot = alignmentPoints(destinyNumber, core);
  const dnCompound = compoundVsChart(compound, destinyNumber);
  const destiny = (dnRoot + dnCompound) / 2;

  const bnRoot = alignmentPoints(birthNumber, core);
  const bnCompound = compoundVsChart(compound, birthNumber);
  const birth = ((bnRoot + bnCompound) / 2) * (20 / 25);

  const pairNorm = seq.breakdown.base / 15;
  const alignOk = destiny / 25 >= 0.35 && birth / 20 >= 0.35;
  const sequenceSafe = !hasSevereConflict && pairNorm >= 0.4;
  const loShu = loShuPoints({
    person: personLoShu,
    counts: parsed.digitCounts,
    pairs,
    sequenceSafe,
    alignOk,
  });
  const loShuImpact = loShuImpactLine(
    personLoShu,
    parsed.digitCounts,
    loShu.filledMissing,
  );

  let score = Math.round(sequence + destiny + birth + loShu.points);
  score = clamp(score, 0, 100);
  if (hasSevereConflict) {
    score = Math.min(score, 79);
  }

  const pillars: MobilePillars = {
    sequence,
    ending,
    destiny,
    birth,
    loShu: loShu.points,
    pairing: seq.breakdown,
  };
  const verdict = classify(score, hasSevereConflict);

  return {
    ok: true,
    fit: {
      use,
      parsed,
      birthNumber,
      destinyNumber,
      lifePath,
      core,
      compound,
      bnTone,
      dnTone,
      lpTone,
      personLoShu,
      mobileLoShu,
      digitCounts: parsed.digitCounts,
      flags,
      strainRuns,
      pairs,
      pairInsights,
      filledMissing: loShu.filledMissing,
      loShuImpact,
      hasSevereConflict,
      pillars,
      score,
      verdict,
      line: verdictLine(verdict, pillars, hasSevereConflict),
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
