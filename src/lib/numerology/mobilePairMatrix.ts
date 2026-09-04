/**
 * Shared directional 00–99 pair table for the 9-pair sequence and Last-4 joins.
 */

import raw from "./data/mobilePairMatrix.json";

export type PairClass =
  | "strong_positive"
  | "positive"
  | "neutral"
  | "contextual"
  | "caution"
  | "strong_caution"
  | "conflict"
  | "strong_conflict"
  | "severe_conflict";

export type PairPurposeAffinities = {
  business: number;
  career: number;
  relationship: number;
  wealth: number;
  networking: number;
};

export type PairMatrixEntry = {
  class: PairClass;
  base_score: number;
  risk: string;
  purpose: PairPurposeAffinities;
  source_type: "traditional_numerology";
};

type PairMatrixFile = {
  version: string;
  methodology: string;
  pair_count: number;
  directional: boolean;
  pairs: Record<string, PairMatrixEntry>;
};

const matrix = raw as PairMatrixFile;

export function pairKey(n: number): string {
  return String(n).padStart(2, "0");
}

export function missingPairMatrixKeys(
  data: PairMatrixFile = matrix,
): string[] {
  const missing: string[] = [];
  for (let i = 0; i < 100; i++) {
    const key = pairKey(i);
    if (!data.pairs[key]) missing.push(key);
  }
  return missing;
}

export function assertMobilePairMatrix(data: PairMatrixFile = matrix): void {
  const missing = missingPairMatrixKeys(data);
  if (missing.length > 0) {
    throw new Error(
      `mobilePairMatrix.json missing keys: ${missing.join(", ")}`,
    );
  }
}

assertMobilePairMatrix();

export function getPairMatrixEntry(pair: string): PairMatrixEntry {
  const entry = matrix.pairs[pair];
  if (!entry) {
    throw new Error(`mobilePairMatrix.json has no entry for ${pair}`);
  }
  return entry;
}

export function pairPurposeAffinities(pair: string): PairPurposeAffinities {
  return getPairMatrixEntry(pair).purpose;
}

export function pairMatrixClass(pair: string): PairClass {
  return getPairMatrixEntry(pair).class;
}
