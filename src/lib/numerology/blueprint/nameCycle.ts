/**
 * Chaldean Name Cycle: one first-name letter per Personal Year.
 * Birth year = first letter, then the name loops.
 * Not Pythagorean Essence (letter duration = letter value).
 */

import { calculateChaldean } from "@/lib/numerology/chaldean";
import { formatCompoundRoot } from "@/lib/numerology/chaldeanName";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { CHALDEAN } from "@/lib/numerology/mappings";
import { splitGivenAndSurname } from "@/lib/numerology/nameParts";
import { parseDob } from "@/lib/numerology/reduce";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import { formatSlashDate } from "@/lib/profile/date";
import { resolveNameInForce } from "@/lib/profile/nameHistory";

export type NameCycleLetter = {
  letter: string;
  value: number;
  index: number;
};

export type NameCycle = {
  firstName: string;
  spellingUsed: string;
  letters: NameCycleLetter[];
  active: NameCycleLetter;
  calendarYearUsed: number;
  birthYear: number;
  nameCompound: number;
  nameRoot: number;
  nameDisplay: string;
  echoLetters: NameCycleLetter[];
  calcLines: string[];
};

export function chaldeanLettersOf(name: string): NameCycleLetter[] {
  return name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((letter, index) => ({
      letter,
      value: CHALDEAN[letter] ?? 0,
      index,
    }))
    .filter((row) => row.value > 0)
    .map((row, index) => ({ ...row, index }));
}

export function firstNameForCycle(fullName: string): string {
  const { given } = splitGivenAndSurname(fullName);
  return (given || fullName.split(/\s+/)[0] || "").trim();
}

function birthdayInYear(dob: string, year: number): string {
  const { day, month } = parseDob(dob);
  return formatSlashDate(day, month, year);
}

/**
 * Name Cycle for a Personal Year calendar year (birthday-cycle year used).
 */
export function nameCycleForYear(opts: {
  natalName: string;
  dob: string;
  calendarYearUsed: number;
  history?: unknown;
  preferredName?: string;
  /** Personal Year digit — used only for echo-letter chips. */
  personalYear?: number;
}): NameCycle | null {
  const { year: birthYear } = parseDob(opts.dob);
  const asOf = birthdayInYear(opts.dob, opts.calendarYearUsed);
  const inForce = resolveNameInForce({
    natalName: opts.natalName,
    dateOfBirth: opts.dob,
    history: opts.history,
    preferredName: opts.preferredName,
    asOf,
  });
  const firstName =
    inForce.operatingSpelling.trim().split(/\s+/)[0] ||
    firstNameForCycle(inForce.givenSpelling || inForce.operatingSpelling);
  const letters = chaldeanLettersOf(firstName);
  if (!letters.length) return null;

  const offset = opts.calendarYearUsed - birthYear;
  const index = ((offset % letters.length) + letters.length) % letters.length;
  const active = letters[index]!;
  const chald = calculateChaldean(inForce.operatingSpelling);
  const py = opts.personalYear ? reduceToSingleDigit(opts.personalYear) : 0;
  const echoLetters = chaldeanLettersOf(inForce.operatingSpelling).filter(
    (row) => py > 0 && py <= 8 && row.value === py && row.letter !== active.letter,
  );
  const uniqueEcho: NameCycleLetter[] = [];
  for (const row of echoLetters) {
    if (!uniqueEcho.some((e) => e.letter === row.letter)) uniqueEcho.push(row);
  }

  const calcLines = assertSafeList(
    [
      `First name in force in ${opts.calendarYearUsed}: ${firstName.toUpperCase()}.`,
      `Chaldean letter walk, one letter per Personal Year. Birth year ${birthYear} is letter 1 (${letters[0]!.letter}).`,
      `${opts.calendarYearUsed} − ${birthYear} = ${offset}. ${offset} mod ${letters.length} = ${index} → ${active.letter} = ${active.value}.`,
      `Permanent name number (whole spelling) is ${formatCompoundRoot(chald.compound, chald.nameNumber)}. That is not the cycle.`,
    ],
    "blueprint.cycle.calc",
  );

  return {
    firstName,
    spellingUsed: inForce.operatingSpelling,
    letters,
    active,
    calendarYearUsed: opts.calendarYearUsed,
    birthYear,
    nameCompound: chald.compound,
    nameRoot: chald.nameNumber,
    nameDisplay: formatCompoundRoot(chald.compound, chald.nameNumber),
    echoLetters: uniqueEcho,
    calcLines,
  };
}

export function cycleCaption(cycle: NameCycle): string {
  return assertSafeCopy(
    `You are currently in ${cycle.active.letter} / ${cycle.active.value} — the identity vibration active in this year’s cycle.`,
    "blueprint.cycle.caption",
  );
}
