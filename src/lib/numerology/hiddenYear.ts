/**
 * Year number: last two digits of the birth year, added until 1–9.
 * Kua: Lo Shu compass from year + gender, only Male/Female and year before 2000.
 */

import { parseDob, reduceNumber } from "@/lib/numerology/reduce";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";

export type KuaSkipReason =
  | "need_gender"
  | "year_2000_or_later"
  | "invalid_dob";

export type YearNumberResult = {
  year: number;
  lastTwo: number;
  compound: number;
  root: number;
};

export type KuaResult =
  | {
      ok: true;
      number: number;
      gender: "male" | "female";
      yearRoot: number;
    }
  | {
      ok: false;
      reason: KuaSkipReason;
      note: string;
    };

export function yearNumberFromDob(dob: string): YearNumberResult {
  const { year } = parseDob(dob);
  const lastTwo = year % 100;
  const tens = Math.floor(lastTwo / 10);
  const ones = lastTwo % 10;
  const compound = tens + ones;
  const root = reduceNumber(compound || 9, []);
  return { year, lastTwo, compound, root: root || 9 };
}

export function kuaGender(gender: string | undefined | null): "male" | "female" | null {
  const g = String(gender ?? "")
    .trim()
    .toLowerCase();
  if (g === "male") return "male";
  if (g === "female") return "female";
  return null;
}

export function calculateKua(
  dob: string,
  gender: string | undefined | null,
): KuaResult {
  let year: number;
  try {
    year = parseDob(dob).year;
  } catch {
    return {
      ok: false,
      reason: "invalid_dob",
      note: "Need a full date of birth to work out this extra number.",
    };
  }
  const sex = kuaGender(gender);
  if (!sex) {
    return {
      ok: false,
      reason: "need_gender",
      note: "This extra number is only worked out when the profile is Male or Female.",
    };
  }
  if (year >= 2000) {
    return {
      ok: false,
      reason: "year_2000_or_later",
      note: "This extra number is only worked out for birth years before 2000 in this reading.",
    };
  }
  const S = yearNumberFromDob(dob).root;
  const raw = sex === "male" ? 10 - S : 5 + S;
  const number = reduceToSingleDigit(raw) || 9;
  return { ok: true, number, gender: sex, yearRoot: S };
}
