/**
 * Adjacent two-digit windows inside a national mobile number.
 * Polarities are researched; motifs are original Numora lines (not book copy).
 */

export type PairPolarity = "supportive" | "mixed" | "caution";

export type CompoundPair = {
  pair: string;
  polarity: PairPolarity;
  motif: string;
};

const SUPPORTIVE = new Set([
  "10", "15", "21", "23", "24", "32", "33", "35", "41", "42", "45", "51",
  "53", "54", "57", "63", "65", "68", "72", "75", "78", "81", "87", "91",
  "92", "93", "96",
]);

const CAUTION = new Set([
  "14", "16", "19", "26", "28", "29", "37", "38", "43", "44", "47", "49",
  "52", "58", "59", "64", "67", "69", "79", "82", "83", "86", "88", "89",
  "94", "98", "99",
]);

export function pairPolarity(pair: string): PairPolarity {
  if (SUPPORTIVE.has(pair)) return "supportive";
  if (CAUTION.has(pair)) return "caution";
  return "mixed";
}

export function pairScore(polarity: PairPolarity): number {
  if (polarity === "supportive") return 1;
  if (polarity === "mixed") return 0.5;
  return 0;
}

const DIGIT_HINT: Record<string, string> = {
  "0": "opens space around the next digit",
  "1": "adds a lead-and-start tone",
  "2": "softens the pace toward people",
  "3": "opens voice and reach",
  "4": "asks for structure and patience",
  "5": "speeds talk and movement",
  "6": "pulls toward ease and company",
  "7": "turns the line more inward",
  "8": "slows results and raises the bar",
  "9": "adds drive and heat",
};

export function pairMotif(pair: string): string {
  const polarity = pairPolarity(pair);
  const a = pair[0] ?? "0";
  const b = pair[1] ?? "0";
  if (polarity === "supportive") {
    return `${DIGIT_HINT[a] ?? "Leads quietly"}; ${DIGIT_HINT[b] ?? "lands softly"}.`;
  }
  if (polarity === "caution") {
    return `${DIGIT_HINT[a] ?? "Leads firmly"} and ${DIGIT_HINT[b] ?? "lands hard"} — use with care.`;
  }
  return `${DIGIT_HINT[a] ?? "Leads evenly"} with ${DIGIT_HINT[b] ?? "a mixed landing"}.`;
}

/** Sliding adjacent pairs: "9876" → 98, 87, 76. */
export function slidingPairs(digits: string): CompoundPair[] {
  const out: CompoundPair[] = [];
  for (let i = 0; i < digits.length - 1; i++) {
    const pair = digits.slice(i, i + 2);
    if (!/^\d{2}$/.test(pair)) continue;
    out.push({
      pair,
      polarity: pairPolarity(pair),
      motif: pairMotif(pair),
    });
  }
  return out;
}
