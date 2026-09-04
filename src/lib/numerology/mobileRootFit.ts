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

/** Self number → digits that sit in the middle. Same-number pairs are Favourable. */
const STEADY: Record<number, number[]> = {
  1: [4, 7],
  2: [4, 6],
  3: [4, 7],
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
  if (self === partner) return "Favourable";
  if (FAVOURABLE[self]?.includes(partner)) return "Favourable";
  if (STEADY[self]?.includes(partner)) return "Steady";
  return "Heavy";
}

export function rootFitScore(tone: RootFitTone): number {
  if (tone === "Favourable") return 1;
  if (tone === "Steady") return 0.5;
  return 0;
}

/**
 * Graded 0–25 alignment (not a 3-step friend/enemy cliff).
 * Exact match sits at the top; Heavy sits low but not always zero.
 */
export function alignmentPoints(selfRaw: number, partnerRaw: number): number {
  const self = reduceToSingleDigit(selfRaw);
  const partner = reduceToSingleDigit(partnerRaw);
  if (self === partner) return 25;
  const tone = rootFitTone(self, partner);
  if (tone === "Favourable") return 22;
  if (tone === "Steady") return 13;
  return 3;
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

/** Copy for a same-digit run: names BN/DN, not the pair as “heavy”. */
export function strainRunCaption(
  digit: number,
  length: number,
  birthNumber: number,
  destinyNumber: number,
): string {
  const vsBn = rootFitTone(birthNumber, digit);
  const vsDn = rootFitTone(destinyNumber, digit);
  const vs: string[] = [];
  if (vsBn === "Heavy") vs.push(`birth ${birthNumber}`);
  if (vsDn === "Heavy") vs.push(`destiny ${destinyNumber}`);
  const stack = length >= 3 ? `${length} ${digit}s in a row` : `Two ${digit}s in a row`;
  if (vs.length === 0) {
    return `${stack}. Pair ${digit}${digit} is scored on the pair cards, not as a chart conflict.`;
  }
  return `${stack} — digit ${digit} sits uneasy vs ${vs.join(" and ")}. That is not the pair ${digit}${digit} as a high-conflict join.`;
}
