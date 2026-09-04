import {
  isAdverseKind,
  meanNormalizedPairs,
  occurrenceWeight,
  slidingPairs,
  type CompoundPair,
} from "./mobileCompoundPairs";
import { analyzeLastFour, type LastFourAnalysis } from "./mobileLastFour";
import { findConsecutiveRuns, type ConsecutiveRun } from "./mobileNumber";
import { rootFitTone, type RootFitTone } from "./mobileRootFit";

export type SequenceBreakdown = {
  base: number;
  frequency: number;
  run: number;
  ending: number;
  density: number;
  total: number;
  conflictDensity: number;
};

export type PairInsight = {
  pair: string;
  kind: CompoundPair["kind"];
  raw: number;
  motif: string;
  count: number;
  firstIndex: number;
  inRun: boolean;
  runLength: number;
  directionNote: string;
  chartNote: string;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Extra from 2nd+ occurrences. Repeats amplify the pair's own lean —
 * they are not automatically negative.
 */
export function frequencyScore01(pairs: CompoundPair[]): number {
  const seen: Record<string, number> = {};
  let extra = 0;
  let maxAbs = 0;
  for (const p of pairs) {
    const n = (seen[p.pair] ?? 0) + 1;
    seen[p.pair] = n;
    if (n < 2) continue;
    const w = occurrenceWeight(n - 1) - 1;
    extra += w * (p.raw / 5);
    maxAbs += w;
  }
  if (maxAbs === 0) return 0.55;
  return clamp((extra / maxAbs + 1) / 2, 0, 1);
}

function runDelta(length: number, tone: RootFitTone): number {
  if (length < 2) return 0;
  if (length === 2) {
    if (tone === "Favourable") return 1;
    if (tone === "Steady") return 0;
    return -1;
  }
  if (length === 3) {
    if (tone === "Favourable") return 0;
    if (tone === "Steady") return -1;
    return -3;
  }
  if (length === 4) {
    if (tone === "Favourable") return -2;
    if (tone === "Steady") return -3;
    return -5;
  }
  return tone === "Heavy" ? -5 : -4;
}

/** Run intensity, partly person-dependent via BN/DN tone to that digit. */
export function runScore01(
  digits: string,
  birthNumber: number,
  destinyNumber: number,
): { score01: number; runs: ConsecutiveRun[] } {
  const runs = findConsecutiveRuns(digits, 2);
  if (runs.length === 0) return { score01: 0.6, runs };
  let delta = 0;
  for (const run of runs) {
    const d = Number(run.digit);
    if (d < 1 || d > 9) {
      delta -= run.length >= 3 ? 2 : 0.5;
      continue;
    }
    const bn = rootFitTone(birthNumber, d);
    const dn = rootFitTone(destinyNumber, d);
    const worse: RootFitTone =
      bn === "Heavy" || dn === "Heavy"
        ? "Heavy"
        : bn === "Steady" || dn === "Steady"
          ? "Steady"
          : "Favourable";
    delta += runDelta(run.length, worse);
  }
  return { score01: clamp((delta + 5) / 10, 0, 1), runs };
}

export function conflictDensity(pairs: CompoundPair[]): number {
  if (pairs.length === 0) return 0;
  const seen: Record<string, number> = {};
  let adverse = 0;
  let all = 0;
  for (const p of pairs) {
    const n = (seen[p.pair] ?? 0) + 1;
    seen[p.pair] = n;
    const w = occurrenceWeight(n - 1);
    all += w;
    if (isAdverseKind(p.kind)) adverse += w;
  }
  return all === 0 ? 0 : adverse / all;
}

export function scoreSequence(
  digits: string,
  birthNumber: number,
  destinyNumber: number,
): {
  pairs: CompoundPair[];
  endingPairs: CompoundPair[];
  lastFour: LastFourAnalysis | null;
  breakdown: SequenceBreakdown;
  allRuns: ConsecutiveRun[];
} {
  const pairs = slidingPairs(digits);
  const lastFour = analyzeLastFour(digits, birthNumber, destinyNumber);
  const endingPairs = lastFour?.pairs ?? slidingPairs(digits.slice(-4));
  const run = runScore01(digits, birthNumber, destinyNumber);
  const density = conflictDensity(pairs);

  const base = 15 * meanNormalizedPairs(pairs);
  const frequency = 7 * frequencyScore01(pairs);
  const runPts = 5 * run.score01;
  const ending = lastFour?.points ?? 5 * meanNormalizedPairs(endingPairs);
  const densityPts = 3 * (1 - density);

  return {
    pairs,
    endingPairs,
    lastFour,
    allRuns: run.runs,
    breakdown: {
      base,
      frequency,
      run: runPts,
      ending,
      density: densityPts,
      total: base + frequency + runPts + ending + densityPts,
      conflictDensity: density,
    },
  };
}

export function chartNoteForPair(
  pair: string,
  birthNumber: number,
  destinyNumber: number,
): string {
  const a = Number(pair[0]);
  const b = Number(pair[1]);
  const digits = [a, b].filter((d) => d >= 1 && d <= 9);
  if (digits.length === 0) {
    return "Zero does not sit on the birth grid; it only changes the next digit.";
  }
  const heavy = digits.filter(
    (d) =>
      rootFitTone(birthNumber, d) === "Heavy" ||
      rootFitTone(destinyNumber, d) === "Heavy",
  );
  const easy = digits.filter(
    (d) =>
      rootFitTone(birthNumber, d) === "Favourable" &&
      rootFitTone(destinyNumber, d) === "Favourable",
  );
  if (heavy.length === digits.length) {
    return "Both digits sit heavy vs this birth number or destiny — repetition would pile on.";
  }
  if (easy.length === digits.length) {
    return "Both digits sit easily on this chart; a short run can help, a long run still overloads.";
  }
  if (heavy.length) {
    return `Digit ${heavy.join(" and ")} sits heavy on this chart, so stacking it raises caution.`;
  }
  return "Mixed vs this chart — the pair's own lean matters more than the birth grid.";
}
