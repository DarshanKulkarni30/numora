import { parseDob, reduceNumber } from "./reduce";

export function personalYear(
  dob: string,
  now = new Date(),
): number {
  const { day, month } = parseDob(dob);
  const year = now.getFullYear();
  return reduceNumber(day + month + year, [11, 22, 33]);
}

export function personalMonth(
  personalYearNumber: number,
  now = new Date(),
): number {
  const month = now.getMonth() + 1;
  return reduceNumber(personalYearNumber + month, [11, 22]);
}
