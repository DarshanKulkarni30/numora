import { PYTHAGOREAN, sumMappedLetters } from "./mappings";
import { isVowel, parseDob, reduceNumber, reduceWithCompound } from "./reduce";

export type PythagoreanResult = {
  lifePath: number;
  birthDay: number;
  expression: number;
  soulUrge: number;
  personality: number;
  maturity: number;
};

export function calculatePythagorean(fullName: string, dob: string): PythagoreanResult {
  const { day, month, year } = parseDob(dob);

  const lifePath = reduceNumber(digitReduceParts(day, month, year));
  const birthDay = reduceNumber(day);
  const expression = reduceNumber(sumMappedLetters(fullName, PYTHAGOREAN));
  const soulUrge = reduceNumber(
    sumMappedLetters(fullName, PYTHAGOREAN, (ch) => isVowel(ch)),
  );
  const personality = reduceNumber(
    sumMappedLetters(fullName, PYTHAGOREAN, (ch) => !isVowel(ch)),
  );
  const maturity = reduceNumber(lifePath + expression);

  return {
    lifePath,
    birthDay,
    expression,
    soulUrge,
    personality,
    maturity,
  };
}

/** Life Path: reduce day, month, year separately then sum (preserves masters in parts). */
function digitReduceParts(day: number, month: number, year: number): number {
  const d = reduceNumber(day);
  const m = reduceNumber(month);
  const y = reduceNumber(year);
  return d + m + y;
}

export function expressionCompound(fullName: string): {
  compound: number;
  reduced: number;
} {
  return reduceWithCompound(sumMappedLetters(fullName, PYTHAGOREAN));
}
