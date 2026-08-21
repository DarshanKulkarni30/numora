/**
 * Ranked spelling suggestions for a given + surname against a birth chart.
 * Reflective only — not legal naming advice.
 */

import {
  joinGivenAndSurname,
  splitGivenAndSurname,
} from "./nameParts";
import {
  gendersForProfile,
  SUGGESTED_NAMES,
} from "./nameSuggestions";
import { calculatePythagorean } from "./pythagorean";
import { calculateVedic } from "./vedic";
import { calculateChaldean } from "./chaldean";
import { reduceToSingleDigit } from "./dateNumbers";
import {
  pythagoreanTrio,
  vedicTrio,
  chaldeanTrio,
  type TrioBand,
} from "./trioMatrix";
import { assertSafeCopy, assertSafeList } from "./safety";

export type RankedSpelling = {
  given: string;
  fullName: string;
  source: "current" | "spelling" | "bank";
  vedicName: number;
  expression: number;
  chaldean: number;
  vedicBand: TrioBand;
  pythBand: TrioBand;
  chaldeanBand: TrioBand;
  rank: number;
  note: string;
};

export type NameAdvisorResult = {
  given: string;
  surname: string;
  psychic: number;
  destiny: number;
  lifePath: number;
  ranked: RankedSpelling[];
  disclaimer: string;
};

const BAND_RANK: Record<TrioBand, number> = {
  amazing: 5,
  favourable: 4,
  neutral: 3,
  friction: 2,
  block: 1,
};

const DISCLAIMER =
  "Ranked spellings are a reflective Birth×Destiny×Name overlay. They are not legal, cultural, or religious naming advice, and they do not predict outcomes.";

function titleCaseToken(s: string): string {
  const t = s.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Conservative Latin spelling mutations of a given name. */
export function spellingVariants(given: string): string[] {
  const raw = given.trim();
  if (!raw) return [];
  const out = new Set<string>();
  const tokens = raw.split(/\s+/).filter(Boolean);
  const first = tokens[0] ?? raw;
  const rest = tokens.slice(1).join(" ");

  const consider = (token: string) => {
    const t = token.trim();
    if (t.length < 2) return;
    const forms = new Set<string>([t]);
    const lower = t.toLowerCase();
    const last = lower.slice(-1);
    if (lower.endsWith("e") && t.length > 3) forms.add(t.slice(0, -1));
    if (!lower.endsWith("e") && t.length >= 3) forms.add(`${t}e`);
    if (lower.endsWith("y") && t.length > 2) forms.add(`${t.slice(0, -1)}i`);
    if (lower.endsWith("i") && t.length > 2) forms.add(`${t.slice(0, -1)}y`);
    if (lower.endsWith("ie") && t.length > 3) forms.add(`${t.slice(0, -2)}y`);
    if (lower.endsWith("ey") && t.length > 3) forms.add(`${t.slice(0, -2)}y`);
    if (/[bcdfghjklmnpqrstvwxyz]/.test(last) && !lower.endsWith(last + last)) {
      forms.add(`${t}${last}`);
    }
    if (lower.endsWith(last + last) && /[bcdfghjklmnpqrstvwxyz]/.test(last) && t.length > 3) {
      forms.add(t.slice(0, -1));
    }
    for (const f of forms) {
      const titled = titleCaseToken(f);
      const full = rest ? `${titled} ${rest}` : titled;
      out.add(full);
    }
  };

  consider(first);
  if (tokens.length > 1) consider(raw);

  return [...out];
}

function scoreName(
  given: string,
  surname: string,
  source: RankedSpelling["source"],
  psychic: number,
  destiny: number,
  lifePath: number,
  birthDay: number,
): RankedSpelling {
  const fullName = joinGivenAndSurname(given, surname);
  const pyth = calculatePythagorean(fullName, "01/01/2000");
  const vedic = calculateVedic(fullName, "01/01/2000");
  const chald = calculateChaldean(fullName);
  const vedicName = reduceToSingleDigit(vedic.nameNumber);
  const expression = reduceToSingleDigit(pyth.expression);
  const chaldean = reduceToSingleDigit(chald.nameNumber);
  const vHit = vedicTrio(psychic, destiny, vedicName);
  const pHit = pythagoreanTrio(birthDay, lifePath, expression);
  const cHit = chaldeanTrio(psychic, destiny, chaldean);
  const rank = BAND_RANK[vHit.band] * 10 + BAND_RANK[pHit.band];
  const note = assertSafeCopy(
    source === "current"
      ? `Current spelling. Vedic name ${vedicName} is ${vHit.band} (${vHit.label}); Pythagorean Expression ${expression} is ${pHit.band}.`
      : source === "spelling"
        ? `Spelling variant. Vedic name ${vedicName} is ${vHit.band} (${vHit.label}).`
        : `From the reflective name bank. Vedic name ${vedicName} is ${vHit.band} (${vHit.label}).`,
    `advisor.${given}.${source}`,
  );
  return {
    given,
    fullName,
    source,
    vedicName,
    expression,
    chaldean,
    vedicBand: vHit.band,
    pythBand: pHit.band,
    chaldeanBand: cHit.band,
    rank,
    note,
  };
}

export function rankNameSpellings(opts: {
  fullName: string;
  dateOfBirth: string;
  gender?: string;
  trialGiven?: string;
  trialSurname?: string;
}): NameAdvisorResult {
  const split = splitGivenAndSurname(opts.fullName);
  const given = (opts.trialGiven?.trim() || split.given || opts.fullName).trim();
  const surname = (opts.trialSurname ?? split.surname).trim();
  const natal = calculatePythagorean(opts.fullName, opts.dateOfBirth);
  const vedic = calculateVedic(opts.fullName, opts.dateOfBirth);
  const psychic = reduceToSingleDigit(vedic.psychic);
  const destiny = reduceToSingleDigit(vedic.destiny);
  const lifePath = reduceToSingleDigit(natal.lifePath);
  const birthDay = reduceToSingleDigit(natal.birthDay);

  const currentKey = given.toLowerCase();
  const variants = spellingVariants(given);
  const ranked: RankedSpelling[] = [];
  const seen = new Set<string>();

  for (const g of variants) {
    const key = g.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    ranked.push(
      scoreName(
        g,
        surname,
        key === currentKey ? "current" : "spelling",
        psychic,
        destiny,
        lifePath,
        birthDay,
      ),
    );
  }

  const allowed = new Set(gendersForProfile(opts.gender || ""));
  for (const s of SUGGESTED_NAMES) {
    if (!allowed.has(s.gender)) continue;
    const key = s.name.toLowerCase();
    if (seen.has(key)) continue;
    const row = scoreName(
      s.name,
      surname,
      "bank",
      psychic,
      destiny,
      lifePath,
      birthDay,
    );
    if (row.vedicBand !== "amazing" && row.vedicBand !== "favourable") continue;
    seen.add(key);
    ranked.push(row);
  }

  ranked.sort((a, b) => {
    if (b.rank !== a.rank) return b.rank - a.rank;
    if (a.source === "current") return -1;
    if (b.source === "current") return 1;
    if (a.source === "spelling" && b.source !== "spelling") return -1;
    if (b.source === "spelling" && a.source !== "spelling") return 1;
    return a.given.localeCompare(b.given);
  });

  return {
    given,
    surname,
    psychic,
    destiny,
    lifePath,
    ranked: ranked.slice(0, 24),
    disclaimer: assertSafeCopy(DISCLAIMER, "advisor.disclaimer"),
  };
}

export function nameAdvisorPdfLines(result: NameAdvisorResult): string[] {
  return assertSafeList(
    [
      `Ranked spellings for ${result.given} ${result.surname} · Psychic ${result.psychic} · Destiny ${result.destiny} · Life Path ${result.lifePath}.`,
      ...result.ranked.slice(0, 12).map(
        (r) =>
          `${r.fullName} · Vedic ${r.vedicName} (${r.vedicBand}) · Expression ${r.expression} (${r.pythBand}) · ${r.source}`,
      ),
      result.disclaimer,
    ],
    "advisor.pdf",
  );
}
