/**
 * Adjacent two-digit windows inside a national mobile number.
 * Six-way pair quality (not pass/fail). Motifs are original Numora lines.
 * Labels are traditional quality, not claims of accidents or loss.
 */

export type PairKind =
  | "highlyFavourable"
  | "favourable"
  | "neutral"
  | "mildConflict"
  | "strongConflict"
  | "severeConflict";

export type CompoundPair = {
  pair: string;
  kind: PairKind;
  raw: number;
  motif: string;
};

/** Raw pair points before normalizing to 0–1. */
export const PAIR_RAW: Record<PairKind, number> = {
  highlyFavourable: 5,
  favourable: 4,
  neutral: 2,
  mildConflict: 0,
  strongConflict: -3,
  severeConflict: -5,
};

/** Traditionally high-conflict reversals — never a hard fail on their own. */
const SEVERE = new Set(["28", "36", "48", "63", "82", "84"]);

const HIGHLY_FAVOURABLE = new Set([
  "15", "23", "24", "32", "45", "51", "54", "65", "75", "81", "91", "96",
]);

const FAVOURABLE = new Set([
  "10", "21", "33", "35", "41", "42", "53", "57", "68", "72", "78", "87",
  "92", "93",
]);

const STRONG = new Set([
  "26", "38", "44", "49", "59", "64", "88", "89", "99",
]);

const MILD = new Set([
  "14", "16", "19", "29", "37", "43", "47", "52", "58", "67", "69", "79",
  "83", "86", "94", "98",
]);

export function pairKind(pair: string): PairKind {
  if (SEVERE.has(pair)) return "severeConflict";
  if (HIGHLY_FAVOURABLE.has(pair)) return "highlyFavourable";
  if (FAVOURABLE.has(pair)) return "favourable";
  if (STRONG.has(pair)) return "strongConflict";
  if (MILD.has(pair)) return "mildConflict";
  return "neutral";
}

export function pairRawScore(pair: string): number {
  return PAIR_RAW[pairKind(pair)];
}

/** Map −5…+5 onto 0…1. */
export function normalizePairRaw(raw: number): number {
  return (raw + 5) / 10;
}

export function isSeverePair(pair: string): boolean {
  return SEVERE.has(pair);
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
  const kind = pairKind(pair);
  const a = pair[0] ?? "0";
  const b = pair[1] ?? "0";
  const lead = DIGIT_HINT[a] ?? "Leads evenly";
  const land = DIGIT_HINT[b] ?? "lands evenly";
  if (kind === "highlyFavourable" || kind === "favourable") {
    return `${lead}; ${land}.`;
  }
  if (kind === "severeConflict") {
    return `${lead} and ${land} — a traditionally high-conflict pair.`;
  }
  if (kind === "strongConflict" || kind === "mildConflict") {
    return `${lead} and ${land} — a traditionally uneasy pair.`;
  }
  return `${lead} with ${land}.`;
}

export function slidingPairs(digits: string): CompoundPair[] {
  const out: CompoundPair[] = [];
  for (let i = 0; i < digits.length - 1; i++) {
    const pair = digits.slice(i, i + 2);
    if (!/^\d{2}$/.test(pair)) continue;
    const kind = pairKind(pair);
    out.push({
      pair,
      kind,
      raw: PAIR_RAW[kind],
      motif: pairMotif(pair),
    });
  }
  return out;
}

export function meanNormalizedPairs(pairs: CompoundPair[]): number {
  if (pairs.length === 0) return 0.5;
  const sum = pairs.reduce((s, p) => s + normalizePairRaw(p.raw), 0);
  return sum / pairs.length;
}

/** Two-digit key for a full-number compound (45, 108 → 9, etc.). */
export function compoundPairKey(compound: number): string {
  let n = Math.abs(Math.trunc(compound));
  if (n <= 9) return `0${n}`;
  while (n > 99) {
    n = String(n)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return String(n).padStart(2, "0");
}
