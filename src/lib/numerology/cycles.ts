import { parseDob, reduceNumber } from "./reduce";

export type PersonalYearBreakdown = {
  year: number;
  month: number;
  day: number;
  compound: number;
  number: number;
};

export function personalYearBreakdown(
  dob: string,
  year: number,
): PersonalYearBreakdown {
  const { day, month } = parseDob(dob);
  const y = Math.trunc(year);
  const compound = day + month + y;
  const number = reduceNumber(compound, [11, 22, 33]);
  return { year: y, month, day, compound, number };
}

export function personalYearForCalendarYear(dob: string, year: number): number {
  return personalYearBreakdown(dob, year).number;
}

export function personalYear(
  dob: string,
  now = new Date(),
): number {
  return personalYearCycleAt(dob, now).number;
}

/** School A: this calendar year's PY activates on that year's birthday. */
export type PersonalYearCycle = PersonalYearBreakdown & {
  rangeStart: Date;
  rangeEnd: Date;
  calendarYearUsed: number;
};

function atNoon(year: number, month: number, day: number): Date {
  const d = new Date(year, month - 1, day, 12, 0, 0);
  if (d.getMonth() !== month - 1) {
    return new Date(year, month, 0, 12, 0, 0);
  }
  return d;
}

function dayBefore(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, 12, 0, 0);
}

export function personalYearCycleAt(
  dob: string,
  asOf = new Date(),
): PersonalYearCycle {
  const { day, month } = parseDob(dob);
  const y = asOf.getFullYear();
  const birthdayThisYear = atNoon(y, month, day);
  const afterOrOnBirthday =
    asOf.getMonth() > birthdayThisYear.getMonth() ||
    (asOf.getMonth() === birthdayThisYear.getMonth() &&
      asOf.getDate() >= birthdayThisYear.getDate());
  const calendarYearUsed = afterOrOnBirthday ? y : y - 1;
  const rangeStart = afterOrOnBirthday
    ? birthdayThisYear
    : atNoon(y - 1, month, day);
  const nextBirthday = atNoon(calendarYearUsed + 1, month, day);
  const breakdown = personalYearBreakdown(dob, calendarYearUsed);
  return {
    ...breakdown,
    year: calendarYearUsed,
    rangeStart,
    rangeEnd: dayBefore(nextBirthday),
    calendarYearUsed,
  };
}

/** Cycle that starts on the birthday in `startYear` (School A: PY of that calendar year). */
export function personalYearCycleStarting(
  dob: string,
  startYear: number,
): PersonalYearCycle {
  const { day, month } = parseDob(dob);
  const y = Math.trunc(startYear);
  const rangeStart = atNoon(y, month, day);
  const nextBirthday = atNoon(y + 1, month, day);
  const breakdown = personalYearBreakdown(dob, y);
  return {
    ...breakdown,
    rangeStart,
    rangeEnd: dayBefore(nextBirthday),
    calendarYearUsed: y,
  };
}

export function formatCycleRange(cycle: PersonalYearCycle): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return `${fmt(cycle.rangeStart)} – ${fmt(cycle.rangeEnd)}`;
}

export function personalMonth(
  personalYearNumber: number,
  now = new Date(),
): number {
  const month = now.getMonth() + 1;
  return reduceNumber(personalYearNumber + month, [11, 22]);
}
