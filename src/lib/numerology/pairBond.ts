/**
 * Pair bond + dual Personal Year timeline (before/after a together-since date).
 * Reflective only — marriage does not rewrite either person's Personal Year.
 */

import {
  lifePathFromDob,
  reduceToSingleDigit,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "./dateNumbers";
import { personalYearForCalendarYear } from "./cycles";
import { pairTone, type CompatTone } from "./compatibility";
import { CORE_TRAIT, yearMonthMeaning } from "./meanings";
import { calculateVedic } from "./vedic";
import { parseDob } from "./reduce";

export type PairPersonInput = {
  key: string;
  label: string;
  relationship: string;
  dateOfBirth: string;
  fullName?: string;
};

export type PairYearCell = {
  calendarYear: number;
  aYear: number;
  bYear: number;
  bondYear: number | null;
  pairTone: CompatTone;
  isMarriageYear: boolean;
  phase: "before" | "marriage" | "after";
};

export type PersonYearWindow = {
  dominantBefore: number[];
  dominantAfter: number[];
  onlyBefore: number[];
  onlyAfter: number[];
  marriageYearDigit: number | null;
};

export type PairBondImpact = {
  a: PersonYearWindow;
  b: PersonYearWindow;
  easierAfterCount: number;
  stretchAfterCount: number;
  /** Digit-driven lines (always cite numbers). */
  bullets: string[];
};

export type PairBondModel = {
  a: {
    key: string;
    label: string;
    relationship: string;
    lifePath: number;
    psychic: number;
    destiny: number;
    nameNumber: number | null;
    currentPersonalYear: number;
  };
  b: {
    key: string;
    label: string;
    relationship: string;
    lifePath: number;
    psychic: number;
    destiny: number;
    nameNumber: number | null;
    currentPersonalYear: number;
  };
  hideRomantic: boolean;
  togetherSince: string | null;
  bondNumber: number | null;
  bondTrait: string | null;
  marriageYear: number | null;
  yearsMarried: number | null;
  timeline: PairYearCell[];
  impact: PairBondImpact | null;
  lifePathTone: CompatTone;
  psychicTone: CompatTone;
  destinyTone: CompatTone;
  nameTone: CompatTone | null;
  disclaimer: string;
};

const DISCLAIMER =
  "Marriage or a together-since date does not rewrite either person's Personal Year. This view places both birthday-based year cycles beside a shared milestone and an optional bond cycle from that date—reflective only, not relationship advice or a prediction.";

function trait(n: number): string {
  return CORE_TRAIT[n] ?? CORE_TRAIT[reduceToSingleDigit(n)] ?? `Tone ${n}`;
}

function shortYearTheme(n: number): string {
  const t = trait(reduceToSingleDigit(n));
  return t.split("&")[0]?.trim().toLowerCase() ?? `year ${n}`;
}

function countDigits(nums: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const n of nums) {
    const d = reduceToSingleDigit(n);
    m.set(d, (m.get(d) ?? 0) + 1);
  }
  return m;
}

function topDigits(nums: number[], limit = 2): number[] {
  return [...countDigits(nums).entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, limit)
    .map(([d]) => d);
}

function setDiff(a: number[], b: number[]): number[] {
  const bs = new Set(b);
  return [...new Set(a)].filter((x) => !bs.has(x)).sort((x, y) => x - y);
}

/** Bond number from ceremony / together-since date (full date reduction). */
export function bondNumberFromDate(slashDob: string): number {
  return lifePathFromDob(slashDob);
}

/** Bond year for a calendar year: anniversary month+day + that year. */
export function bondYearForCalendarYear(
  togetherSince: string,
  calendarYear: number,
): number {
  return personalYearForCalendarYear(togetherSince, calendarYear);
}

function personSnapshot(p: PairPersonInput, asOfYear: number) {
  const lifePath = lifePathFromDob(p.dateOfBirth);
  const psychic = vedicPsychicFromDob(p.dateOfBirth);
  const destiny = vedicDestinyFromDob(p.dateOfBirth);
  const nameNumber = p.fullName?.trim()
    ? calculateVedic(p.fullName, p.dateOfBirth).nameNumber
    : null;
  const currentPersonalYear = personalYearForCalendarYear(
    p.dateOfBirth,
    asOfYear,
  );
  return {
    key: p.key,
    label: p.label,
    relationship: p.relationship,
    lifePath,
    psychic,
    destiny,
    nameNumber,
    currentPersonalYear,
  };
}

function buildWindow(
  cells: PairYearCell[],
  pick: (c: PairYearCell) => number,
  marriageYear: number,
): PersonYearWindow {
  const before = cells
    .filter((c) => c.calendarYear < marriageYear)
    .map(pick);
  const after = cells
    .filter((c) => c.calendarYear > marriageYear)
    .map(pick);
  const marriage = cells.find((c) => c.calendarYear === marriageYear);
  const beforeTop = topDigits(before);
  const afterTop = topDigits(after);
  return {
    dominantBefore: beforeTop,
    dominantAfter: afterTop,
    onlyBefore: setDiff(beforeTop, afterTop),
    onlyAfter: setDiff(afterTop, beforeTop),
    marriageYearDigit: marriage ? reduceToSingleDigit(pick(marriage)) : null,
  };
}

function toneRank(t: CompatTone): number {
  if (t === "Amazing") return 3;
  if (t === "Favourable") return 2;
  if (t === "Neutral") return 1;
  return 0;
}

function buildImpact(
  aLabel: string,
  bLabel: string,
  cells: PairYearCell[],
  marriageYear: number,
): PairBondImpact {
  const a = buildWindow(cells, (c) => c.aYear, marriageYear);
  const b = buildWindow(cells, (c) => c.bYear, marriageYear);
  const beforeCells = cells.filter((c) => c.calendarYear < marriageYear);
  const afterCells = cells.filter((c) => c.calendarYear > marriageYear);

  let easierAfterCount = 0;
  let stretchAfterCount = 0;
  for (const c of afterCells) {
    if (toneRank(c.pairTone) >= 2) easierAfterCount += 1;
    if (c.pairTone === "Challenging") stretchAfterCount += 1;
  }

  const bullets: string[] = [];
  const marriageCell = cells.find((c) => c.calendarYear === marriageYear);
  if (marriageCell) {
    bullets.push(
      `In ${marriageYear}, ${aLabel} was in Personal Year ${marriageCell.aYear} (${shortYearTheme(marriageCell.aYear)}); ${bLabel} was in Personal Year ${marriageCell.bYear} (${shortYearTheme(marriageCell.bYear)}) — pair tone ${marriageCell.pairTone}.`,
    );
  }
  if (a.dominantBefore.length && a.dominantAfter.length) {
    bullets.push(
      `${aLabel}: year digits before clustered around ${a.dominantBefore.join(", ")}; after around ${a.dominantAfter.join(", ")}.`,
    );
  }
  if (b.dominantBefore.length && b.dominantAfter.length) {
    bullets.push(
      `${bLabel}: year digits before clustered around ${b.dominantBefore.join(", ")}; after around ${b.dominantAfter.join(", ")}.`,
    );
  }
  if (a.onlyAfter.length) {
    bullets.push(
      `${aLabel}: new dominant after the bond — ${a.onlyAfter.map((d) => `${d} (${shortYearTheme(d)})`).join(", ")}.`,
    );
  }
  if (b.onlyAfter.length) {
    bullets.push(
      `${bLabel}: new dominant after the bond — ${b.onlyAfter.map((d) => `${d} (${shortYearTheme(d)})`).join(", ")}.`,
    );
  }
  if (afterCells.length) {
    bullets.push(
      `After ${marriageYear}: ${easierAfterCount} year(s) read Favourable/Amazing between your Personal Years; ${stretchAfterCount} Challenging.`,
    );
  }
  if (beforeCells.length && afterCells.length) {
    const avg = (list: PairYearCell[]) =>
      list.reduce((s, c) => s + toneRank(c.pairTone), 0) /
      Math.max(1, list.length);
    const delta = avg(afterCells) - avg(beforeCells);
    if (delta > 0.25) {
      bullets.push(
        `Pair-year tone between you eased after ${marriageYear} (average affinity up vs the pre-bond window).`,
      );
    } else if (delta < -0.25) {
      bullets.push(
        `Pair-year tone between you asked for more stretch after ${marriageYear} (average affinity down vs the pre-bond window)—patience themes, not a verdict.`,
      );
    } else {
      bullets.push(
        `Pair-year affinity between you stayed roughly similar before and after ${marriageYear}; the shift shows more in each person's digit cluster than in pair tone.`,
      );
    }
  }

  return {
    a,
    b,
    easierAfterCount,
    stretchAfterCount,
    bullets,
  };
}

export function buildPairBondModel(opts: {
  a: PairPersonInput;
  b: PairPersonInput;
  togetherSince?: string | null;
  windowYears?: number;
  asOf?: Date;
}): PairBondModel {
  const asOf = opts.asOf ?? new Date();
  const asOfYear = asOf.getFullYear();
  const windowYears = opts.windowYears ?? 4;
  const a = personSnapshot(opts.a, asOfYear);
  const b = personSnapshot(opts.b, asOfYear);

  const hideRomantic =
    opts.a.relationship === "Child" ||
    opts.b.relationship === "Child" ||
    opts.a.relationship === "Parent" ||
    opts.b.relationship === "Parent";

  const lifePathTone = pairTone(a.lifePath, b.lifePath);
  const psychicTone = pairTone(a.psychic, b.psychic);
  const destinyTone = pairTone(a.destiny, b.destiny);
  const nameTone =
    a.nameNumber != null && b.nameNumber != null
      ? pairTone(a.nameNumber, b.nameNumber)
      : null;

  const togetherSince = opts.togetherSince?.trim() || null;
  let bondNumber: number | null = null;
  let bondTrait: string | null = null;
  let marriageYear: number | null = null;
  let yearsMarried: number | null = null;
  let impact: PairBondImpact | null = null;
  const timeline: PairYearCell[] = [];

  if (togetherSince) {
    bondNumber = bondNumberFromDate(togetherSince);
    bondTrait = trait(reduceToSingleDigit(bondNumber));
    marriageYear = parseDob(togetherSince).year;
    yearsMarried = Math.max(0, asOfYear - marriageYear);

    const startY = marriageYear - windowYears;
    const endY = Math.min(asOfYear, marriageYear + windowYears);
    for (let y = startY; y <= endY; y++) {
      const aYear = personalYearForCalendarYear(opts.a.dateOfBirth, y);
      const bYear = personalYearForCalendarYear(opts.b.dateOfBirth, y);
      const bondYear = bondYearForCalendarYear(togetherSince, y);
      const phase: PairYearCell["phase"] =
        y < marriageYear ? "before" : y === marriageYear ? "marriage" : "after";
      timeline.push({
        calendarYear: y,
        aYear: reduceToSingleDigit(aYear),
        bYear: reduceToSingleDigit(bYear),
        bondYear: reduceToSingleDigit(bondYear),
        pairTone: pairTone(aYear, bYear),
        isMarriageYear: y === marriageYear,
        phase,
      });
    }
    impact = buildImpact(a.label, b.label, timeline, marriageYear);
  }

  return {
    a,
    b,
    hideRomantic,
    togetherSince,
    bondNumber,
    bondTrait,
    marriageYear,
    yearsMarried,
    timeline,
    impact,
    lifePathTone,
    psychicTone,
    destinyTone,
    nameTone,
    disclaimer: DISCLAIMER,
  };
}

export function pairYearThemeLine(digit: number): string {
  return yearMonthMeaning(reduceToSingleDigit(digit));
}

export function pairTraitShort(n: number): string {
  return trait(n);
}
