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

type Triple = {
  lifePath: number;
  destiny: number;
  psychic: number;
};

function asTriple(opts: {
  lifePath: number | string;
  destiny: number | string;
  psychic?: number | string;
}): Triple {
  return {
    lifePath: Number(opts.lifePath),
    destiny: Number(opts.destiny),
    psychic:
      opts.psychic == null || opts.psychic === ""
        ? NaN
        : Number(opts.psychic),
  };
}

/** Circular distance on 1–9 wheel (e.g. 1 vs 9 = 1). */
function digitDistance(a: number, b: number): number {
  const x = reduceToSingleDigit(a);
  const y = reduceToSingleDigit(b);
  const d = Math.abs(x - y);
  return Math.min(d, 9 - d);
}

function scoreTriple(
  target: Triple,
  candidate: Triple,
): { exact: number; closeness: number } {
  const tLp = reduceToSingleDigit(target.lifePath);
  const tDest = reduceToSingleDigit(target.destiny);
  const hasPsychic = Number.isFinite(target.psychic);
  const tPsy = hasPsychic ? reduceToSingleDigit(target.psychic) : null;

  const cLp = reduceToSingleDigit(candidate.lifePath);
  const cDest = reduceToSingleDigit(candidate.destiny);
  const cPsy = reduceToSingleDigit(candidate.psychic);

  let exact = 0;
  let closeness = 0;

  if (candidate.lifePath === target.lifePath || cLp === tLp) exact += 1;
  else closeness += digitDistance(target.lifePath, candidate.lifePath);

  if (candidate.destiny === target.destiny || cDest === tDest) exact += 1;
  else closeness += digitDistance(target.destiny, candidate.destiny);

  if (tPsy != null) {
    if (candidate.psychic === target.psychic || cPsy === tPsy) exact += 1;
    else closeness += digitDistance(target.psychic, candidate.psychic);
  }

  return { exact, closeness };
}

function rankByTriple<T>(
  items: T[],
  target: Triple,
  get: (item: T) => Triple,
  nameOf: (item: T) => string,
  limit: number,
): T[] {
  return items
    .map((item) => {
      const { exact, closeness } = scoreTriple(target, get(item));
      return { item, exact, closeness, name: nameOf(item) };
    })
    .sort((a, b) => {
      if (b.exact !== a.exact) return b.exact - a.exact;
      if (a.closeness !== b.closeness) return a.closeness - b.closeness;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit)
    .map((x) => x.item);
}

export function matchPeople(opts: {
  lifePath: number | string;
  destiny: number | string;
  psychic?: number | string;
  limit?: number;
}): TriviaPerson[] {
  const target = asTriple(opts);
  return rankByTriple(
    TRIVIA_PEOPLE,
    target,
    (p) => ({
      lifePath: p.lifePath,
      destiny: p.destiny,
      psychic: p.psychic,
    }),
    (p) => p.name,
    opts.limit ?? 12,
  );
}

export function matchCountries(opts: {
  lifePath: number | string;
  destiny: number | string;
  psychic?: number | string;
  limit?: number;
}): TriviaCountry[] {
  const target = asTriple(opts);
  return rankByTriple(
    TRIVIA_COUNTRIES,
    target,
    (c) => ({
      lifePath: c.lifePath,
      destiny: c.destiny,
      psychic: c.psychic,
    }),
    (c) => c.name,
    opts.limit ?? 8,
  );
}
