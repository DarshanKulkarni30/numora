/**
 * Mobile-only 1–9 alignment of a number’s root vs a person’s birth or destiny.
 * Researched from a last-page mapping; never labeled with source names in the UI.
 */

import { reduceToSingleDigit } from "./dateNumbers";

export type RootFitTone = "Favourable" | "Steady" | "Heavy";

const FAVOURABLE: Record<number, number[]> = {
  1: [1, 2, 3, 9],
  2: [1, 2, 3, 7],
  3: [1, 2, 3, 9],
  4: [2, 4, 5, 6, 7],
  5: [1, 4, 5, 6, 7],
  6: [4, 5, 6, 8],
  7: [4, 7, 8],
  8: [4, 5, 6],
  9: [1, 2, 3, 9],
};

const STEADY: Record<number, number[]> = {
  1: [5, 7],
  2: [6, 8, 9],
  3: [4, 7, 8],
  4: [9],
  5: [3, 8, 9],
  6: [3, 7, 9],
  7: [3, 5, 6],
  8: [3, 7],
  9: [6, 8],
};

export function rootFitTone(
  selfRaw: number,
  partnerRaw: number,
): RootFitTone {
  const self = reduceToSingleDigit(selfRaw);
  const partner = reduceToSingleDigit(partnerRaw);
  if (FAVOURABLE[self]?.includes(partner)) return "Favourable";
  if (STEADY[self]?.includes(partner)) return "Steady";
  return "Heavy";
}

export function rootFitScore(tone: RootFitTone): number {
  if (tone === "Favourable") return 1;
  if (tone === "Steady") return 0.5;
  return 0;
}

/** Digits that sit heavy vs this birth number or destiny (union). */
export function strainDigitsForChart(
  birthNumber: number,
  destinyNumber: number,
): Set<number> {
  const heavy = new Set<number>();
  for (let d = 1; d <= 9; d++) {
    if (rootFitTone(birthNumber, d) === "Heavy") heavy.add(d);
    if (rootFitTone(destinyNumber, d) === "Heavy") heavy.add(d);
  }
  return heavy;
}
