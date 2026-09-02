/**
 * Mobile-only 1–9 alignment of a number’s root vs a person’s birth or destiny.
 * UI uses Favourable / Steady / Heavy only.
 */

import { reduceToSingleDigit } from "./dateNumbers";

export type RootFitTone = "Favourable" | "Steady" | "Heavy";

/** Self number → digits that sit easily with it. */
const FAVOURABLE: Record<number, number[]> = {
  1: [2, 3, 5, 6, 9],
  2: [1, 3, 5, 7],
  3: [1, 2, 5, 6, 9],
  4: [1, 4, 6, 8],
  5: [1, 2, 3, 5, 6, 8],
  6: [1, 4, 5, 6, 8],
  7: [2, 7, 9],
  8: [4, 5, 6, 8],
  9: [1, 3, 7, 9],
};

/** Self number → digits that sit in the middle. Unlisted self-pairs (1, 2, 3) sit here. */
const STEADY: Record<number, number[]> = {
  1: [1, 4, 7],
  2: [2, 4, 6],
  3: [3, 4, 7],
  4: [2, 3],
  5: [4, 7],
  6: [2, 3, 9],
  7: [1, 4],
  8: [2, 3],
  9: [2, 4, 5, 6],
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
