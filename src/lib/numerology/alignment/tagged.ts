/**
 * Tagged numbers: every digit carries system + source + role.
 * Reports keep Pythagorean Soul vs Chaldean Name. Mobile uses Chaldean Soul too.
 */

import { calculateChaldean } from "@/lib/numerology/chaldean";
import {
  reduceToSingleDigit,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import { parseChartNumber } from "@/lib/numerology/enhanced/digits";
import { CHALDEAN, PYTHAGOREAN, sumMappedLetters } from "@/lib/numerology/mappings";
import { calculatePythagorean } from "@/lib/numerology/pythagorean";
import { isVowel, reduceWithCompound } from "@/lib/numerology/reduce";
import type { NumerologySnapshot } from "@/lib/numerology/types";

export type NumberSystem = "Pythagorean" | "Vedic" | "Chaldean" | "derived";

export type NumberSource =
  | "vowels"
  | "consonants"
  | "day-of-month"
  | "date-sum"
  | "all-letters"
  | "derived";

export type NumberRole =
  | "soul"
  | "birth"
  | "destiny"
  | "name"
  | "personality"
  | "fortuna";

export type TaggedNumber = {
  /** Chart display value (masters kept when the method keeps them). */
  number: number;
  system: NumberSystem;
  source: NumberSource;
  role: NumberRole;
  compound: number;
  /** 1–9 used for pair tables. */
  root: number;
};

export type TaggedChart = {
  soul: TaggedNumber;
  birth: TaggedNumber;
  destiny: TaggedNumber;
  name: TaggedNumber;
  personality: TaggedNumber;
  fortuna: TaggedNumber;
};

function tag(
  role: NumberRole,
  system: NumberSystem,
  source: NumberSource,
  display: number,
  compound?: number,
): TaggedNumber {
  const n = Number.isFinite(display) && display !== 0 ? display : 9;
  const compoundN =
    compound != null && Number.isFinite(compound) ? compound : n;
  return {
    number: n,
    system,
    source,
    role,
    compound: compoundN,
    root: pairRoot(n),
  };
}

function pairRoot(n: number): number {
  if (n === 0) return 0;
  return reduceToSingleDigit(Math.abs(n));
}

function snapDigit(raw: string | undefined, fallback = 9): number {
  return parseChartNumber(raw) ?? fallback;
}

export function fortunaFrom(destinyRoot: number, birthRoot: number): TaggedNumber {
  const delta = destinyRoot - birthRoot;
  return {
    number: delta,
    system: "derived",
    source: "derived",
    role: "fortuna",
    compound: delta,
    root: delta === 0 ? 0 : pairRoot(Math.abs(delta)),
  };
}

export function taggedChartFromParts(parts: {
  soul: number;
  birth: number;
  destiny: number;
  name: number;
  personality: number;
  soulCompound?: number;
  nameCompound?: number;
  personalityCompound?: number;
  soulSystem?: NumberSystem;
  personalitySystem?: NumberSystem;
}): TaggedChart {
  const soul = tag(
    "soul",
    parts.soulSystem ?? "Pythagorean",
    "vowels",
    parts.soul,
    parts.soulCompound,
  );
  const birth = tag("birth", "Vedic", "day-of-month", parts.birth);
  const destiny = tag("destiny", "Vedic", "date-sum", parts.destiny);
  const name = tag(
    "name",
    "Chaldean",
    "all-letters",
    parts.name,
    parts.nameCompound,
  );
  const personality = tag(
    "personality",
    parts.personalitySystem ?? "Pythagorean",
    "consonants",
    parts.personality,
    parts.personalityCompound,
  );
  return {
    soul,
    birth,
    destiny,
    name,
    personality,
    fortuna: fortunaFrom(destiny.root, birth.root),
  };
}

/** Report snapshot: Soul Urge, Vedic Psychic, Vedic Destiny, Chaldean name. */
export function taggedChartFromSnapshot(snap: NumerologySnapshot): TaggedChart {
  return taggedChartFromParts({
    soul: snapDigit(snap.soul_urge_number),
    birth: snapDigit(snap.vedic_psychic || snap.birth_day),
    destiny: snapDigit(snap.vedic_destiny),
    name: snapDigit(snap.chaldean_name_number),
    personality: snapDigit(snap.personality_number),
    nameCompound: snapDigit(snap.compound_number, snapDigit(snap.chaldean_name_number)),
  });
}

/** Live person (mobile): Chaldean Soul + Name, Vedic Birth/Destiny. */
export function taggedChartFromPerson(fullName: string, dob: string): TaggedChart {
  const pyth = calculatePythagorean(fullName, dob);
  const chal = calculateChaldean(fullName);
  const soulVowels = reduceWithCompound(
    sumMappedLetters(fullName, CHALDEAN, (ch) => isVowel(ch)),
    [],
  );
  const persCompound = reduceWithCompound(
    sumMappedLetters(fullName, PYTHAGOREAN, (ch) => !isVowel(ch)),
  ).compound;
  return taggedChartFromParts({
    soul: soulVowels.reduced || 9,
    birth: vedicPsychicFromDob(dob),
    destiny: vedicDestinyFromDob(dob),
    name: chal.nameNumber,
    personality: pyth.personality,
    soulCompound: soulVowels.compound,
    nameCompound: chal.compound,
    personalityCompound: persCompound,
    soulSystem: "Chaldean",
  });
}
