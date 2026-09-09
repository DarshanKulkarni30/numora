/**
 * Shared 1–9 pair bands for Soul ↔ Birth ↔ Name (and Tri-Identity soft edges).
 * Derived percents are labels, not scientific scores.
 */

import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import type { TrioBand } from "@/lib/numerology/trioMatrix";

/** Soft pairwise affinity when no dedicated pair table. */
export const SOFT_FAV: Record<number, number[]> = {
  1: [1, 3, 5, 9],
  2: [2, 4, 6, 8],
  3: [1, 3, 5, 6, 9],
  4: [2, 4, 6, 8],
  5: [1, 3, 5, 7, 9],
  6: [2, 3, 4, 6, 8, 9],
  7: [1, 4, 5, 7],
  8: [2, 4, 6, 8],
  9: [1, 3, 5, 6, 9],
};

export const SOFT_CARE: Record<number, number[]> = {
  1: [4, 8],
  2: [1, 9],
  3: [4, 7],
  4: [1, 5],
  5: [4],
  6: [1, 7],
  7: [3, 8],
  8: [1, 9],
  9: [4, 8],
};

/** Derived bar percents — band first, percent second. */
export const BAND_PERCENT: Record<TrioBand, number> = {
  amazing: 90,
  favourable: 80,
  neutral: 65,
  friction: 55,
  block: 45,
};

export const BAND_COMPAT_LABEL: Record<TrioBand, string> = {
  amazing: "High compatibility",
  favourable: "Strong compatibility",
  neutral: "Moderate compatibility",
  friction: "Mixed compatibility",
  block: "Challenging compatibility",
};

export function pairDigit(n: number): number {
  const d = reduceToSingleDigit(n);
  return d >= 1 && d <= 9 ? d : 9;
}

export function softPairBand(aRaw: number, bRaw: number): TrioBand {
  const a = pairDigit(aRaw);
  const b = pairDigit(bRaw);
  if (a === b) return "favourable";
  if (SOFT_FAV[a]?.includes(b) && SOFT_FAV[b]?.includes(a)) return "amazing";
  if (SOFT_FAV[a]?.includes(b) || SOFT_FAV[b]?.includes(a)) return "favourable";
  if (SOFT_CARE[a]?.includes(b) || SOFT_CARE[b]?.includes(a)) return "friction";
  return "neutral";
}

export function pairPercent(a: number, b: number): number {
  return BAND_PERCENT[softPairBand(a, b)];
}
