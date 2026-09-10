/**
 * Chaldean-first personal numbers for the Comprehensive report.
 * Soul and Personality use the Chaldean letter table (not Pythagorean).
 * Birth and Destiny stay the day and full-date sums (1–9).
 */

import { calculateChaldean } from "@/lib/numerology/chaldean";
import { CHALDEAN, sumMappedLetters } from "@/lib/numerology/mappings";
import { extractFirstNameLetters } from "@/lib/numerology/nameBookends";
import { isVowel, parseDob, reduceWithCompound } from "@/lib/numerology/reduce";
import { fortunaFrom } from "@/lib/numerology/alignment/tagged";
import {
  calculateKua,
  yearNumberFromDob,
  type KuaResult,
  type YearNumberResult,
} from "@/lib/numerology/hiddenYear";

export const CHALDEAN_METHOD = "CHALDEAN-NUMORA-1.0";

export type CompoundRoot = {
  compound: number;
  root: number;
  /** e.g. 43/7 or 3 */
  label: string;
};

export type ChaldeanProfile = {
  method: typeof CHALDEAN_METHOD;
  fullName: string;
  dob: string;
  birth: CompoundRoot;
  destiny: CompoundRoot;
  soul: CompoundRoot;
  personality: CompoundRoot;
  name: CompoundRoot;
  firstLetter: { letter: string; value: number } | null;
  fortuna: { delta: number; label: string };
  yearNumber: YearNumberResult;
  kua: KuaResult;
};

export function formatLongRoot(compound: number, root: number): string {
  if (compound === root) return String(root);
  return `${compound}/${root}`;
}

function fromSum(sum: number, keepMasters: number[] = []): CompoundRoot {
  const { compound, reduced } = reduceWithCompound(sum, keepMasters);
  const root = reduced || 9;
  return { compound, root, label: formatLongRoot(compound, root) };
}

export function calculateChaldeanProfile(
  fullName: string,
  dob: string,
  gender?: string | null,
): ChaldeanProfile {
  const { day, month, year } = parseDob(dob);
  const birthDaySum = day;
  const destinySum = day + month + year;
  const soulSum = sumMappedLetters(fullName, CHALDEAN, (ch) => isVowel(ch));
  const persSum = sumMappedLetters(fullName, CHALDEAN, (ch) => !isVowel(ch));
  const name = calculateChaldean(fullName);
  const firstLetters = extractFirstNameLetters(fullName);
  const firstCh = firstLetters[0] ?? "";
  const firstVal = firstCh ? CHALDEAN[firstCh] ?? 0 : 0;

  const birth = fromSum(birthDaySum, []);
  const destiny = fromSum(destinySum, []);
  const soul = fromSum(soulSum, []);
  const personality = fromSum(persSum, []);
  const nameCR: CompoundRoot = {
    compound: name.compound,
    root: name.nameNumber,
    label: formatLongRoot(name.compound, name.nameNumber),
  };

  const fortunaDelta = destiny.root - birth.root;

  return {
    method: CHALDEAN_METHOD,
    fullName,
    dob,
    birth,
    destiny,
    soul,
    personality,
    name: nameCR,
    firstLetter: firstCh && firstVal ? { letter: firstCh, value: firstVal } : null,
    fortuna: {
      delta: fortunaDelta,
      label:
        fortunaDelta === 0
          ? "0 — Destiny and Birth match on this date"
          : String(fortunaDelta),
    },
    yearNumber: yearNumberFromDob(dob),
    kua: calculateKua(dob, gender),
  };
}

export function chaldeanFortunaTagged(profile: ChaldeanProfile) {
  return fortunaFrom(profile.destiny.root, profile.birth.root);
}
