import { countryFameScore, personFameScore } from "./fame";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { TRIVIA_CITIES, type TriviaCity } from "./cities";
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
    .sort((a, b) => {
      const fame = personFameScore(b) - personFameScore(a);
      if (fame !== 0) return fame;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

export type NumberTriple = {
  lifePath: number;
  destiny: number;
  psychic: number;
};

export type LayerScore = {
  matched: boolean;
  distance: number;
};

export type TripleCompare = {
  exact: number;
  closeness: number;
  layers: {
    lifePath: LayerScore;
    destiny: LayerScore;
    psychic: LayerScore;
  };
};

function asTriple(opts: {
  lifePath: number | string;
  destiny: number | string;
  psychic?: number | string;
}): NumberTriple {
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
export function digitDistance(a: number, b: number): number {
  const x = reduceToSingleDigit(a);
  const y = reduceToSingleDigit(b);
  const d = Math.abs(x - y);
  return Math.min(d, 9 - d);
}

function layerScore(targetRaw: number, candidateRaw: number): LayerScore {
  const t = reduceToSingleDigit(targetRaw);
  const c = reduceToSingleDigit(candidateRaw);
  if (candidateRaw === targetRaw || c === t) {
    return { matched: true, distance: 0 };
  }
  return { matched: false, distance: digitDistance(targetRaw, candidateRaw) };
}

/** Exact-digit overlap plus wheel closeness — used for ranking and gallery rings. */
export function compareTriples(
  target: NumberTriple,
  candidate: NumberTriple,
): TripleCompare {
  const lifePath = layerScore(target.lifePath, candidate.lifePath);
  const destiny = layerScore(target.destiny, candidate.destiny);
  const hasPsychic = Number.isFinite(target.psychic);
  const psychic = hasPsychic
    ? layerScore(target.psychic, candidate.psychic)
    : { matched: false, distance: 0 };

  let exact = (lifePath.matched ? 1 : 0) + (destiny.matched ? 1 : 0);
  let closeness =
    (lifePath.matched ? 0 : lifePath.distance) +
    (destiny.matched ? 0 : destiny.distance);
  if (hasPsychic) {
    exact += psychic.matched ? 1 : 0;
    closeness += psychic.matched ? 0 : psychic.distance;
  }

  return { exact, closeness, layers: { lifePath, destiny, psychic } };
}

function scoreTriple(
  target: NumberTriple,
  candidate: NumberTriple,
): { exact: number; closeness: number } {
  const { exact, closeness } = compareTriples(target, candidate);
  return { exact, closeness };
}

function rankByTriple<T>(
  items: T[],
  target: NumberTriple,
  get: (item: T) => NumberTriple,
  nameOf: (item: T) => string,
  limit: number,
  fameOf: (item: T) => number = () => 0,
): T[] {
  return items
    .map((item) => {
      const { exact, closeness } = scoreTriple(target, get(item));
      return {
        item,
        exact,
        closeness,
        fame: fameOf(item),
        name: nameOf(item),
      };
    })
    .sort((a, b) => {
      if (b.exact !== a.exact) return b.exact - a.exact;
      if (a.closeness !== b.closeness) return a.closeness - b.closeness;
      if (b.fame !== a.fame) return b.fame - a.fame;
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
    personFameScore,
  );
}

export type CountryMatchSet = {
  /** All Life Path + Destiny + Psychic hits, or nearest 2–3 if none. */
  mode: "triad" | "near";
  rows: TriviaCountry[];
};

export function matchCountries(opts: {
  lifePath: number | string;
  destiny: number | string;
  psychic?: number | string;
  /** Used only when no exact triad exists (default 3). */
  nearLimit?: number;
}): CountryMatchSet {
  const target = asTriple(opts);
  const nearLimit = opts.nearLimit ?? 3;
  const scored = TRIVIA_COUNTRIES.map((item) => {
    const { exact, closeness } = scoreTriple(target, {
      lifePath: item.lifePath,
      destiny: item.destiny,
      psychic: item.psychic,
    });
    return { item, exact, closeness, fame: countryFameScore(item) };
  });
  const exactTriad = scored
    .filter((row) => row.exact === 3)
    .sort(
      (a, b) =>
        b.fame - a.fame || a.item.name.localeCompare(b.item.name),
    );
  if (exactTriad.length) {
    return { mode: "triad", rows: exactTriad.map((row) => row.item) };
  }
  const rest = scored.sort((a, b) => {
    if (b.exact !== a.exact) return b.exact - a.exact;
    if (a.closeness !== b.closeness) return a.closeness - b.closeness;
    if (b.fame !== a.fame) return b.fame - a.fame;
    return a.item.name.localeCompare(b.item.name);
  });
  return {
    mode: "near",
    rows: rest.slice(0, nearLimit).map((row) => row.item),
  };
}

function personDigits(opts: {
  lifePath: number | string;
  destiny: number | string;
  psychic?: number | string;
  expression?: number | string;
  vedicName?: number | string;
}): number[] {
  const out: number[] = [];
  const push = (v: number | string | undefined) => {
    if (v == null || v === "") return;
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    out.push(reduceToSingleDigit(n));
  };
  push(opts.lifePath);
  push(opts.destiny);
  push(opts.psychic);
  push(opts.expression);
  push(opts.vedicName);
  return [...new Set(out)];
}

export function citiesMatchingDigit(
  digit: number | string,
  limit = 5,
): TriviaCity[] {
  const d = reduceToSingleDigit(Number(digit));
  if (!Number.isFinite(d) || d < 1) return [];
  return TRIVIA_CITIES.filter(
    (city) => reduceToSingleDigit(city.nameNumber) === d,
  )
    .sort(
      (a, b) =>
        (a.rank ?? 9999) - (b.rank ?? 9999) || a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}

export type CityLayerKey = "psychic" | "destiny" | "name";

export type CityLayerGroup = {
  keys: CityLayerKey[];
  labels: string[];
  digit: number;
  cities: TriviaCity[];
};

/**
 * Five popular cities per Psychic (PN), Destiny (DN), and Name (NN).
 * Same digit is one group so the same five cities are not listed three times.
 */
export function matchCitiesByPnDnNn(opts: {
  psychic: number | string;
  destiny: number | string;
  vedicName: number | string;
  perLayer?: number;
}): CityLayerGroup[] {
  const per = opts.perLayer ?? 5;
  const layers: { key: CityLayerKey; label: string; digit: number }[] = [
    {
      key: "psychic",
      label: "Psychic (PN)",
      digit: reduceToSingleDigit(Number(opts.psychic)),
    },
    {
      key: "destiny",
      label: "Destiny (DN)",
      digit: reduceToSingleDigit(Number(opts.destiny)),
    },
    {
      key: "name",
      label: "Name (NN)",
      digit: reduceToSingleDigit(Number(opts.vedicName)),
    },
  ];
  const byDigit = new Map<number, CityLayerGroup>();
  for (const layer of layers) {
    if (!Number.isFinite(layer.digit) || layer.digit < 1) continue;
    const existing = byDigit.get(layer.digit);
    if (existing) {
      existing.keys.push(layer.key);
      existing.labels.push(layer.label);
    } else {
      byDigit.set(layer.digit, {
        keys: [layer.key],
        labels: [layer.label],
        digit: layer.digit,
        cities: citiesMatchingDigit(layer.digit, per),
      });
    }
  }
  const seen = new Set<number>();
  const out: CityLayerGroup[] = [];
  for (const layer of layers) {
    if (seen.has(layer.digit) || !byDigit.has(layer.digit)) continue;
    seen.add(layer.digit);
    out.push(byDigit.get(layer.digit)!);
  }
  return out;
}

/**
 * Rank cities by how often the city name number lands on the person's
 * core digits (Life Path, Destiny, Psychic, Expression, Vedic name).
 */
export function matchCities(opts: {
  lifePath: number | string;
  destiny: number | string;
  psychic?: number | string;
  expression?: number | string;
  vedicName?: number | string;
  limit?: number;
}): TriviaCity[] {
  const targets = personDigits(opts);
  if (!targets.length) return [];

  return TRIVIA_CITIES.map((city) => {
    const n = reduceToSingleDigit(city.nameNumber);
    const exact = targets.includes(n) ? 1 : 0;
    const closeness = exact
      ? 0
      : Math.min(...targets.map((t) => digitDistance(t, n)));
    return { city, exact, closeness, rank: city.rank ?? 9999 };
  })
    .sort((a, b) => {
      if (b.exact !== a.exact) return b.exact - a.exact;
      if (a.closeness !== b.closeness) return a.closeness - b.closeness;
      if (a.rank !== b.rank) return a.rank - b.rank;
      return a.city.name.localeCompare(b.city.name);
    })
    .slice(0, opts.limit ?? 5)
    .map((x) => x.city);
}
