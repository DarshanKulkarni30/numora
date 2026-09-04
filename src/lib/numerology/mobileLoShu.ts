/**
 * Lo Shu 20 = raw cover 15 + remedial integrity 5.
 * Sequence already penalizes bad pairs. Lo Shu only restricts when a conflict
 * touches a digit used as cover, or when conflict is repeated/concentrated.
 */

import {
  isAdverseKind,
  occurrenceWeight,
  type CompoundPair,
  type PairKind,
} from "./mobileCompoundPairs";
import type { LoShuResult } from "./types";

export type LoShuBreakdown = {
  raw: number;
  integrity: number;
  total: number;
  filledMissing: number[];
  remedialDigits: number[];
  contaminatedBy: string[];
  integrityNote: string;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function severityWeight(kind: PairKind): number {
  if (kind === "mildConflict") return 0.5;
  if (kind === "strongConflict") return 1;
  if (kind === "severeConflict") return 2;
  return 0;
}

function pairTouches(pair: string, digits: Set<number>): boolean {
  const a = Number(pair[0]);
  const b = Number(pair[1]);
  return digits.has(a) || digits.has(b);
}

/** 0–15: how useful the digit mix is vs the birth grid. */
export function rawRemedialPoints(
  person: Pick<LoShuResult, "grid">,
  counts: number[],
): { points: number; filledMissing: number[] } {
  let pts = 6;
  const filledMissing: number[] = [];
  for (let n = 1; n <= 9; n++) {
    const personC = person.grid[n] ?? 0;
    const mobileC = counts[n] ?? 0;
    if (mobileC === 0) continue;
    if (personC === 0) filledMissing.push(n);

    if (personC === 0) {
      if (mobileC === 1) pts += 3;
      else if (mobileC === 2) pts += 2;
      else pts -= 1;
    } else if (personC === 1) {
      if (mobileC === 1) pts += 1;
      else if (mobileC >= 3) pts -= 2;
    } else if (mobileC >= 4) {
      pts -= 3;
    } else if (mobileC >= 2) {
      pts -= 2;
    }
  }
  return { points: clamp(pts, 0, 15), filledMissing };
}

export function conflictExposure(
  pairs: CompoundPair[],
  remedial: Set<number>,
): { remedy: number; other: number; contaminatedBy: string[] } {
  const seen: Record<string, number> = {};
  let remedy = 0;
  let other = 0;
  const contaminatedBy: string[] = [];
  for (const p of pairs) {
    if (!isAdverseKind(p.kind)) continue;
    const n = (seen[p.pair] ?? 0) + 1;
    seen[p.pair] = n;
    const w = severityWeight(p.kind) * occurrenceWeight(n - 1);
    if (pairTouches(p.pair, remedial)) {
      remedy += w;
      if (!contaminatedBy.includes(p.pair)) contaminatedBy.push(p.pair);
    } else {
      other += w;
    }
  }
  return { remedy, other, contaminatedBy };
}

/**
 * 0–5. A single isolated conflict that does not touch a cover digit
 * does not cut Lo Shu. 50% restriction is for repeated remedial contamination.
 */
export function integrityPoints(ceRemedy: number, ceOther: number): number {
  if (ceRemedy <= 0) {
    if (ceOther < 4) return 5;
    if (ceOther < 6) return 3;
    return 2;
  }
  if (ceRemedy < 0.8) return 4.5;
  if (ceRemedy < 1.5) return 4;
  if (ceRemedy < 2.5) return 3;
  if (ceRemedy < 4.5) return 2;
  if (ceRemedy < 7) return 1;
  return 0.5;
}

function integrityNote(
  remedial: number[],
  contaminatedBy: string[],
  ceRemedy: number,
  ceOther: number,
  integrity: number,
): string {
  if (integrity >= 5) {
    if (remedial.length === 0) {
      return "No quiet cells to cover; sequence conflicts stay in the sequence score.";
    }
    if (ceOther > 0) {
      return "Conflicts in this number do not touch the digits used as cover, so Lo Shu stays intact.";
    }
    return "Cover digits arrive through clean joins.";
  }
  if (ceRemedy > 0 && contaminatedBy.length) {
    const digits = remedial.filter((d) =>
      contaminatedBy.some((p) => p.includes(String(d))),
    );
    const who = digits.length ? digits.join(", ") : "a cover digit";
    const pairs = contaminatedBy.join(", ");
    if (ceRemedy >= 4.5) {
      return `${who} ${digits.length > 1 ? "are" : "is"} introduced through repeated ${pairs}, so cover is useful but heavily restricted.`;
    }
    return `${who} ${digits.length > 1 ? "arrive" : "arrives"} through ${pairs}, so cover is useful but not fully clean.`;
  }
  return "Repeated conflict in the sequence restricts Lo Shu even though it does not sit on a cover digit.";
}

export function scoreLoShu(
  person: Pick<LoShuResult, "grid">,
  counts: number[],
  pairs: CompoundPair[],
): LoShuBreakdown {
  const raw = rawRemedialPoints(person, counts);
  const remedial = new Set(raw.filledMissing);
  const exposure = conflictExposure(pairs, remedial);
  const integrity = integrityPoints(exposure.remedy, exposure.other);
  return {
    raw: raw.points,
    integrity,
    total: clamp(raw.points + integrity, 0, 20),
    filledMissing: raw.filledMissing,
    remedialDigits: raw.filledMissing,
    contaminatedBy: exposure.contaminatedBy,
    integrityNote: integrityNote(
      raw.filledMissing,
      exposure.contaminatedBy,
      exposure.remedy,
      exposure.other,
      integrity,
    ),
  };
}
