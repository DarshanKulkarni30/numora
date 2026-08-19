/**
 * Familiarity scores for trivia ranking — household names beat A–Z accidents.
 * Reflective ordering only, not a fame verdict.
 */

import type { TriviaCountry } from "./countries";
import type { TriviaPerson } from "./people";

/** Lowercase needles; longer names first when matching. */
const HOUSEHOLD = [
  "albert einstein",
  "isaac newton",
  "stephen hawking",
  "nikola tesla",
  "marie curie",
  "charles darwin",
  "galileo galilei",
  "mahatma gandhi",
  "indira gandhi",
  "nelson mandela",
  "martin luther king",
  "winston churchill",
  "abraham lincoln",
  "george washington",
  "franklin d. roosevelt",
  "john f. kennedy",
  "barack obama",
  "margaret thatcher",
  "jawaharlal nehru",
  "swami vivekananda",
  "rabindranath tagore",
  "william shakespeare",
  "leonardo da vinci",
  "pablo picasso",
  "vincent van gogh",
  "wolfgang amadeus mozart",
  "ludwig van beethoven",
  "elvis presley",
  "john lennon",
  "michael jackson",
  "marilyn monroe",
  "charlie chaplin",
  "walt disney",
  "steve jobs",
  "bill gates",
  "alan turing",
  "maya angelou",
  "anne frank",
  "joan of arc",
  "napoleon bonaparte",
  "mother teresa",
  "dalai lama",
  "sachin tendulkar",
  "virat kohli",
  "muhammad ali",
  "a. r. rahman",
  "amitabh bachchan",
  "humphrey bogart",
  "david bowie",
  "freddie mercury",
  "isaac asimov",
  "einstein",
  "shakespeare",
  "newton",
  "hawking",
  "gandhi",
  "mandela",
  "thatcher",
  "nehru",
  "eisenhower",
  "lincoln",
  "washington",
  "mozart",
  "beethoven",
  "picasso",
  "chaplin",
  "darwin",
  "turing",
  "tesla",
  "curie",
  "napoleon",
  "shakespeare",
];

const COUNTRY_FAME: Record<string, number> = {
  us: 100,
  in: 98,
  gb: 96,
  cn: 94,
  jp: 92,
  de: 90,
  fr: 88,
  br: 86,
  ru: 84,
  au: 82,
  ca: 80,
  it: 78,
  es: 76,
  mx: 74,
  kr: 72,
  id: 70,
  pk: 68,
  bd: 66,
  ng: 64,
  za: 62,
  eg: 60,
  tr: 58,
  sa: 56,
  ae: 54,
  sg: 52,
  nz: 50,
  ie: 48,
  nl: 46,
  se: 44,
  ch: 42,
  at: 40,
  pl: 38,
  ar: 36,
  th: 34,
  vn: 32,
  ph: 30,
  my: 28,
  ua: 26,
  gr: 24,
  pt: 22,
  be: 20,
  il: 18,
  ir: 16,
};

function birthYear(dob: string): number | null {
  const m = /\/(\d{4})$/.exec(dob.trim());
  return m ? Number(m[1]) : null;
}

export function personFameScore(person: TriviaPerson): number {
  const nameHay = person.name.toLowerCase();
  const hay = `${nameHay} ${person.note}`.toLowerCase();
  let score = 0;
  for (const needle of HOUSEHOLD) {
    if (needle.includes(" ")) {
      if (hay.includes(needle)) score += 85;
    } else if (nameHay.includes(needle)) {
      score += 70;
    }
  }
  if (/\bnobel\b/.test(hay)) score += 42;
  if (
    /\b(president of the united states|\d+(st|nd|rd|th) us pres|us pres\b)/i.test(
      hay,
    )
  ) {
    score += 48;
  } else if (/\bpresident\b/.test(hay)) {
    score += 28;
  }
  if (/\b(prime minister|p\.m\.|chief minister)\b/.test(hay)) score += 30;
  if (/\b(oscar|academy award|grammy)\b/.test(hay)) score += 32;
  if (/\b(world cup|olympic)\b/.test(hay)) score += 26;
  if (/\b(physicist|playwright|composer|economist)\b/.test(hay)) score += 16;
  if (/\b(actor|actress|singer|musician|statesman)\b/.test(hay)) score += 10;
  if (/notable public figure/.test(hay)) score -= 12;
  const year = birthYear(person.dob);
  if (year != null && year >= 1900) score += 6;
  if (year != null && year >= 1945) score += 3;
  return score;
}

export function countryFameScore(country: TriviaCountry): number {
  return COUNTRY_FAME[country.iso2] ?? 8;
}
