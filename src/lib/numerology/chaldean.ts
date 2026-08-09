import { CHALDEAN, sumMappedLetters } from "./mappings";
import { reduceNumber, reduceWithCompound } from "./reduce";

export type ChaldeanResult = {
  compound: number;
  reduced: number;
  nameNumber: number;
};

export function calculateChaldean(fullName: string): ChaldeanResult {
  const total = sumMappedLetters(fullName, CHALDEAN);
  const { compound, reduced } = reduceWithCompound(total, [11, 22]);
  // In Chaldean practice, the name number is often the reduced single digit / master
  const nameNumber = reduceNumber(compound, [11, 22]);
  return { compound, reduced: nameNumber, nameNumber };
}
