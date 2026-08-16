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
  return personalYearForCalendarYear(dob, now.getFullYear());
}

export function personalMonth(
  personalYearNumber: number,
  now = new Date(),
): number {
  const month = now.getMonth() + 1;
  return reduceNumber(personalYearNumber + month, [11, 22]);
}
