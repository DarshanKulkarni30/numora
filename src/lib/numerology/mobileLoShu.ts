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
import { findConsecutiveRuns } from "./mobileNumber";
import type { LoShuResult } from "./types";

export type LoShuBreakdown = {
  raw: number;
  integrity: number;
  total: number;
  filledMissing: number[];
  remedialDigits: number[];
  contaminatedBy: string[];
  integrityNote: string;
  cells: Record<number, LoShuCellView>;
};

/** Position sets significance; sequence/repetition/conflict set clean vs flagged. */
export type LoShuCellTone =
  | "quiet"
  | "present"
  | "cleanRemedy"
  | "watchRemedy"
  | "patternFlag"
  | "conflictRemedy"
  | "pileUp";

export type LoShuCellView = {
  digit: number;
  tone: LoShuCellTone;
  note: string;
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
  digits: string,
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
    cells: classifyLoShuCells(person, counts, pairs, digits),
  };
}

const CENTER = 5;

/** ABAB blocks such as 5656 / 6565 (length ≥ 4). */
export function findAlternatingBlocks(
  digits: string,
): { pair: string; start: number; length: number }[] {
  const blocks: { pair: string; start: number; length: number }[] = [];
  let i = 0;
  while (i <= digits.length - 4) {
    const a = digits[i];
    const b = digits[i + 1];
    if (a !== b && digits[i + 2] === a && digits[i + 3] === b) {
      let length = 4;
      while (
        i + length + 1 < digits.length &&
        digits[i + length] === a &&
        digits[i + length + 1] === b
      ) {
        length += 2;
      }
      blocks.push({ pair: `${a}${b}`, start: i, length });
      i += length;
    } else {
      i += 1;
    }
  }
  return blocks;
}

function longestRun(digits: string, digit: number): number {
  const runs = findConsecutiveRuns(digits, 2).filter((r) => r.digit === String(digit));
  return runs.reduce((m, r) => Math.max(m, r.length), 0);
}

function adversePairsFor(
  pairs: CompoundPair[],
  digit: number,
): CompoundPair[] {
  const ch = String(digit);
  return pairs.filter((p) => isAdverseKind(p.kind) && p.pair.includes(ch));
}

function centerNote(pattern: string): string {
  return `Because 5 occupies the central Lo Shu position, repeated or strongly patterned use of 5 receives additional structural scrutiny. In this number, the ${pattern} sequence prevents the ×2 presence of 5 from being treated as a simple clean remedy.`;
}

export function classifyLoShuCells(
  person: Pick<LoShuResult, "grid">,
  counts: number[],
  pairs: CompoundPair[],
  digits: string,
): Record<number, LoShuCellView> {
  const alts = findAlternatingBlocks(digits);
  const cells: Record<number, LoShuCellView> = {};
  for (let n = 1; n <= 9; n++) {
    const personC = person.grid[n] ?? 0;
    const mobileC = counts[n] ?? 0;
    const missing = personC === 0;
    const run = longestRun(digits, n);
    const alt = alts.find((b) => b.pair.includes(String(n)));
    const adverse = adversePairsFor(pairs, n);
    const isCenter = n === CENTER;

    if (mobileC === 0) {
      cells[n] = {
        digit: n,
        tone: "quiet",
        note: missing ? "Quiet on both grids." : "Quiet in this number.",
      };
      continue;
    }

    if (!missing && mobileC >= 2) {
      cells[n] = {
        digit: n,
        tone: "pileUp",
        note: `${n} is already on the birth grid; this number adds more — examine further.`,
      };
      continue;
    }

    if (missing && alt) {
      const shown = digits.slice(alt.start, alt.start + alt.length);
      cells[n] = {
        digit: n,
        tone: "patternFlag",
        note: isCenter
          ? centerNote(shown)
          : `${n} covers a quiet cell, but it arrives through ${shown}, so this is flagged for sequence intensity — not because of its Lo Shu seat.`,
      };
      continue;
    }

    if (missing && isCenter && run >= 2) {
      cells[n] = {
        digit: n,
        tone: "patternFlag",
        note: centerNote("5".repeat(run)),
      };
      continue;
    }

    if (missing && !isCenter && run >= 3) {
      cells[n] = {
        digit: n,
        tone: "patternFlag",
        note: `${n} covers a quiet cell, but a ${String(n).repeat(run)} run is intense enough to examine further.`,
      };
      continue;
    }

    if (missing && adverse.length) {
      const labels = [...new Set(adverse.map((p) => p.pair))].join(", ");
      cells[n] = {
        digit: n,
        tone: "conflictRemedy",
        note: `${n} covers a quiet cell, but it arrives through ${labels}. Rose means examine further — not that the digit is inherently unhelpful.`,
      };
      continue;
    }

    if (missing && !isCenter && run === 2) {
      cells[n] = {
        digit: n,
        tone: "watchRemedy",
        note: `${n} covers a quiet cell. A short ${String(n).repeat(2)} run is worth a look, not an automatic problem.`,
      };
      continue;
    }

    if (missing) {
      cells[n] = {
        digit: n,
        tone: "cleanRemedy",
        note: isCenter
          ? "Covers the central 5 cleanly. The center has higher structural significance, but this introduction is not a patterned run."
          : `Covers quiet ${n} with no intense run or conflicting join.`,
      };
      continue;
    }

    cells[n] = {
      digit: n,
      tone: "present",
      note: `Already on the birth grid; this number adds ×${mobileC}.`,
    };
  }
  return cells;
}
