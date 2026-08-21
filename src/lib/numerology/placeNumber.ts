/**
 * Address and phone vibration (digits + optional Pythagorean letters).
 * Playful global tool — not geomancy, feng shui, or telecom advice.
 */

import { PYTHAGOREAN, sumMappedLetters } from "./mappings";
import { coreTraitFor } from "./meanings";
import { reduceNumber } from "./reduce";
import { assertSafeCopy } from "./safety";

export type PlaceKind = "phone" | "address";

export type PlaceReading = {
  kind: PlaceKind;
  raw: string;
  digits: string;
  digitCompound: number;
  digitReduced: number;
  letterReduced: number | null;
  combined: number;
  summary: string;
  practice: string;
  disclaimer: string;
};

const DISCLAIMERS: Record<PlaceKind, string> = {
  phone:
    "A phone vibration is a digit reduction of the number you typed. It is not a network, legal, or luck claim, and it does not predict calls or outcomes.",
  address:
    "An address vibration mixes letter values (Pythagorean) with the digits in the line. It is reflective play, not property, legal, or safety advice.",
};

function extractDigits(raw: string): string {
  return raw.replace(/\D+/g, "");
}

function digitSum(digits: string): number {
  let n = 0;
  for (const ch of digits) n += Number(ch);
  return n;
}

export function analyzePlace(
  raw: string,
  kind: PlaceKind,
): PlaceReading | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const digits = extractDigits(trimmed);
  const digitCompound = digitSum(digits);
  const digitReduced =
    digitCompound > 0 ? reduceNumber(digitCompound, [11, 22]) : 0;
  const letterSum = sumMappedLetters(trimmed, PYTHAGOREAN);
  const letterReduced =
    kind === "address" && letterSum > 0
      ? reduceNumber(letterSum, [11, 22])
      : null;
  const combined = reduceNumber(
    (digitReduced || 0) + (letterReduced || 0) || digitReduced,
    [11, 22],
  );
  const focus = combined || digitReduced;
  if (!focus) return null;
  const trait = coreTraitFor(focus);

  const summary = assertSafeCopy(
    kind === "phone"
      ? `Phone digits ${digits} reduce ${digitCompound} → ${digitReduced}. Tone: ${trait.toLowerCase()}.`
      : `Address letters ${letterReduced ?? "—"} and digits ${digitReduced || "—"} combine to ${combined}. Tone: ${trait.toLowerCase()}.`,
    `place.${kind}.summary`,
  );
  const practice = assertSafeCopy(
    `Let ${trait.toLowerCase()} be a room-tone for this ${kind === "phone" ? "number" : "place"} — a reminder, not a rule for who lives there or who you call.`,
    `place.${kind}.practice`,
  );

  return {
    kind,
    raw: trimmed,
    digits,
    digitCompound,
    digitReduced,
    letterReduced,
    combined,
    summary,
    practice,
    disclaimer: assertSafeCopy(DISCLAIMERS[kind], `place.${kind}.disclaimer`),
  };
}
