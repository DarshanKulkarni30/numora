import { parseDob, reduceNumber } from "./reduce";

/** Pythagorean Life Path from DOB only (preserves 11/22/33). */
export function lifePathFromDob(dob: string): number {
  const { day, month, year } = parseDob(dob);
  const d = reduceNumber(day);
  const m = reduceNumber(month);
  const y = reduceNumber(year);
  return reduceNumber(d + m + y);
}

/** Vedic Psychic (birth day reduced 1–9). */
export function vedicPsychicFromDob(dob: string): number {
  const { day } = parseDob(dob);
  return reduceNumber(day, []);
}

/** Vedic Destiny (day+month+year reduced 1–9). */
export function vedicDestinyFromDob(dob: string): number {
  const { day, month, year } = parseDob(dob);
  return reduceNumber(day + month + year, []);
}

/** Collapse master numbers for 1–9 compatibility tables. */
export function reduceToSingleDigit(n: number): number {
  if (n === 11 || n === 22 || n === 33) {
    return String(n)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  let x = Math.abs(Math.trunc(n));
  while (x > 9) {
    x = String(x)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return x || 9;
}

export function masterNumberNote(raw: number | string): string | null {
  const n = Number(raw);
  if (n === 11 || n === 22 || n === 33) {
    return `Your number is ${n} (a master number). Compatibility tables use 1–9 partners, so ${n} is traced as ${reduceToSingleDigit(n)} in the matrix below.`;
  }
  return null;
}
