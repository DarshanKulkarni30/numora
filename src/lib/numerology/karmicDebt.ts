/**
 * Karmic debt numbers 13/4, 14/5, 16/7, 19/1 from birth day and Life Path compound.
 */

import { parseDob, reduceNumber } from "./reduce";

export const KARMIC_DEBT_MAP = {
  13: 4,
  14: 5,
  16: 7,
  19: 1,
} as const;

export type KarmicDebtCode = keyof typeof KARMIC_DEBT_MAP;

export type KarmicDebt = {
  code: KarmicDebtCode;
  reduced: number;
  source: "birth-day" | "life-path";
  label: string;
  lesson: string;
};

const LESSON: Record<KarmicDebtCode, string> = {
  13: "Progress through effort and consistency rather than shortcuts.",
  14: "Freedom with self-control; change without scattering.",
  16: "Humility and rebuilding when old structures fall away.",
  19: "Independence without shutting others out.",
};

function asDebt(n: number): KarmicDebtCode | null {
  if (n === 13 || n === 14 || n === 16 || n === 19) return n;
  return null;
}

export function karmicDebtsFromDob(dob: string): KarmicDebt[] {
  const { day, month, year } = parseDob(dob);
  const out: KarmicDebt[] = [];
  const dayDebt = asDebt(day);
  if (dayDebt) {
    out.push({
      code: dayDebt,
      reduced: KARMIC_DEBT_MAP[dayDebt],
      source: "birth-day",
      label: `${dayDebt}/${KARMIC_DEBT_MAP[dayDebt]}`,
      lesson: LESSON[dayDebt],
    });
  }
  const lpCompound = day + month + year;
  let cursor = lpCompound;
  const seen = new Set<number>();
  while (cursor > 9 && !seen.has(cursor)) {
    seen.add(cursor);
    const hit = asDebt(cursor);
    if (hit && !out.some((d) => d.code === hit && d.source === "life-path")) {
      out.push({
        code: hit,
        reduced: KARMIC_DEBT_MAP[hit],
        source: "life-path",
        label: `${hit}/${KARMIC_DEBT_MAP[hit]}`,
        lesson: LESSON[hit],
      });
    }
    cursor = reduceNumber(cursor, []);
  }
  return out;
}

/** 13/4 charts often feel extra demand in Personal Years 4, 6, 7, 9. */
export function karmicHeavierYears(debts: KarmicDebt[]): number[] {
  const years = new Set<number>();
  for (const d of debts) {
    if (d.code === 13) {
      [4, 6, 7, 9].forEach((n) => years.add(n));
    } else if (d.code === 14) {
      [5, 7].forEach((n) => years.add(n));
    } else if (d.code === 16) {
      [7, 9].forEach((n) => years.add(n));
    } else if (d.code === 19) {
      [1, 4, 8].forEach((n) => years.add(n));
    }
  }
  return [...years].sort((a, b) => a - b);
}

export function karmicEasierYears(debts: KarmicDebt[]): number[] {
  const years = new Set<number>();
  for (const d of debts) {
    if (d.code === 13) {
      [1, 3, 8].forEach((n) => years.add(n));
    } else if (d.code === 14) {
      [3, 6].forEach((n) => years.add(n));
    } else if (d.code === 16) {
      [3, 6].forEach((n) => years.add(n));
    } else if (d.code === 19) {
      [3, 6, 9].forEach((n) => years.add(n));
    }
  }
  return [...years].sort((a, b) => a - b);
}
