import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { TRIVIA_COUNTRIES, type TriviaCountry } from "./countries";
import { TRIVIA_PEOPLE, type TriviaPerson } from "./people";

/** DD/MM prefix from DD/MM/YYYY (year ignored). */
export function dayMonthKey(dob: string): string | null {
  const m = /^(\d{2})\/(\d{2})\//.exec(dob.trim());
  return m ? `${m[1]}/${m[2]}` : null;
}

/** Celebrities sharing the same calendar day & month (ignore year). */
export function matchPeopleByDayMonth(
  dob: string,
  limit = 10,
): TriviaPerson[] {
  const key = dayMonthKey(dob);
  if (!key) return [];
  return TRIVIA_PEOPLE.filter((p) => dayMonthKey(p.dob) === key)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function matchPeople(opts: {
  lifePath: number | string;
  destiny: number | string;
  limit?: number;
}): TriviaPerson[] {
  const lp = Number(opts.lifePath);
  const dest = Number(opts.destiny);
  const lpR = reduceToSingleDigit(lp);
  const destR = reduceToSingleDigit(dest);
  const scored = TRIVIA_PEOPLE.map((p) => {
    let score = 0;
    if (p.lifePath === lp || reduceToSingleDigit(p.lifePath) === lpR) score += 2;
    if (p.destiny === dest || p.destiny === destR) score += 2;
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name));
  return scored.slice(0, opts.limit ?? 12).map((x) => x.p);
}

export function matchCountries(opts: {
  lifePath: number | string;
  destiny: number | string;
  limit?: number;
}): TriviaCountry[] {
  const lp = Number(opts.lifePath);
  const dest = Number(opts.destiny);
  const lpR = reduceToSingleDigit(lp);
  const destR = reduceToSingleDigit(dest);
  const scored = TRIVIA_COUNTRIES.map((c) => {
    let score = 0;
    if (c.lifePath === lp || reduceToSingleDigit(c.lifePath) === lpR) score += 2;
    if (c.destiny === dest || c.destiny === destR) score += 2;
    return { c, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.c.name.localeCompare(b.c.name));
  return scored.slice(0, opts.limit ?? 8).map((x) => x.c);
}
