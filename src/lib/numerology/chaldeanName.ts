/**
 * Primary name engine: Chaldean letter values → compound (kept) → root.
 * Date numbers are not calculated here.
 */

import { calculateChaldean } from "@/lib/numerology/chaldean";
import { CHALDEAN, PYTHAGOREAN, sumMappedLetters } from "@/lib/numerology/mappings";
import { extractFirstNameLetters } from "@/lib/numerology/nameBookends";
import { isVowel, reduceNumber, reduceWithCompound } from "@/lib/numerology/reduce";

export const CHALDEAN_NAME_METHOD = "CHALDEAN-NUMORA-1.0";

export type NameCalcKind =
  | "expression"
  | "soul"
  | "personality"
  | "first-letter";

export type LetterValue = { letter: string; value: number };

export type NameCalcTrace = {
  calculationType: NameCalcKind;
  sourceInput: string;
  system: "Chaldean";
  method: typeof CHALDEAN_NAME_METHOD;
  filter: "all-letters" | "vowels" | "consonants" | "first-letter";
  letters: LetterValue[];
  compound: number;
  root: number;
  label: string;
};

export type ChaldeanNameSet = {
  method: typeof CHALDEAN_NAME_METHOD;
  fullName: string;
  expression: NameCalcTrace;
  soul: NameCalcTrace;
  personality: NameCalcTrace;
  firstLetter: NameCalcTrace | null;
  traces: NameCalcTrace[];
};

export type PythagoreanNameCompare = {
  system: "Pythagorean";
  expression: number;
  soul: number;
  personality: number;
  note: string;
};

export function formatCompoundRoot(compound: number, root: number): string {
  if (compound === root) return String(root);
  return `${compound}/${root}`;
}

function lettersOf(
  name: string,
  predicate?: (ch: string) => boolean,
): LetterValue[] {
  return name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .filter((ch) => (predicate ? predicate(ch) : true))
    .map((letter) => ({ letter, value: CHALDEAN[letter] ?? 0 }))
    .filter((row) => row.value > 0);
}

function fromLetters(
  kind: NameCalcKind,
  filter: NameCalcTrace["filter"],
  name: string,
  letters: LetterValue[],
  keepMasters: number[],
): NameCalcTrace {
  const sum = letters.reduce((s, row) => s + row.value, 0);
  const { compound, reduced } = reduceWithCompound(sum, keepMasters);
  const root = reduced || 9;
  return {
    calculationType: kind,
    sourceInput: name,
    system: "Chaldean",
    method: CHALDEAN_NAME_METHOD,
    filter,
    letters,
    compound,
    root,
    label: formatCompoundRoot(compound, root),
  };
}

export function calculateChaldeanNameSet(fullName: string): ChaldeanNameSet {
  const name = fullName.trim();
  const all = lettersOf(name);
  const vowels = lettersOf(name, (ch) => isVowel(ch));
  const consonants = lettersOf(name, (ch) => !isVowel(ch));
  const full = calculateChaldean(name);
  const expression: NameCalcTrace = {
    calculationType: "expression",
    sourceInput: name,
    system: "Chaldean",
    method: CHALDEAN_NAME_METHOD,
    filter: "all-letters",
    letters: all,
    compound: full.compound,
    root: full.nameNumber || 9,
    label: formatCompoundRoot(full.compound, full.nameNumber || 9),
  };
  const soul = fromLetters("soul", "vowels", name, vowels, []);
  const personality = fromLetters("personality", "consonants", name, consonants, []);
  const firstChars = extractFirstNameLetters(name);
  const firstCh = firstChars[0] ?? "";
  const firstVal = firstCh ? CHALDEAN[firstCh] ?? 0 : 0;
  const firstLetter: NameCalcTrace | null =
    firstCh && firstVal
      ? {
          calculationType: "first-letter",
          sourceInput: name,
          system: "Chaldean",
          method: CHALDEAN_NAME_METHOD,
          filter: "first-letter",
          letters: [{ letter: firstCh, value: firstVal }],
          compound: firstVal,
          root: firstVal,
          label: `${firstCh} / ${firstVal}`,
        }
      : null;
  const traces = [expression, soul, personality].concat(
    firstLetter ? [firstLetter] : [],
  );
  return {
    method: CHALDEAN_NAME_METHOD,
    fullName: name,
    expression,
    soul,
    personality,
    firstLetter,
    traces,
  };
}

export function pythagoreanNameCompare(fullName: string, _dob?: string): PythagoreanNameCompare {
  return {
    system: "Pythagorean",
    expression: reduceNumber(sumMappedLetters(fullName, PYTHAGOREAN)),
    soul: reduceNumber(sumMappedLetters(fullName, PYTHAGOREAN, (ch) => isVowel(ch))),
    personality: reduceNumber(
      sumMappedLetters(fullName, PYTHAGOREAN, (ch) => !isVowel(ch)),
    ),
    note: "Western sequential letter chart (A=1…I=9). Shown for comparison only. Name numbers in this reading use Chaldean letters.",
  };
}

export function chaldeanLetterSum(
  name: string,
  predicate?: (ch: string) => boolean,
): number {
  return sumMappedLetters(name, CHALDEAN, predicate);
}

export function maturityFrom(lifePath: number, expressionRoot: number): number {
  return reduceNumber(lifePath + expressionRoot);
}
