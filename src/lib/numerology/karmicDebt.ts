/**
 * Karmic debt numbers 13/4, 14/5, 16/7, 19/1.
 *
 * Date positions (birth day, Life Path running total) are fixed for life.
 * Name positions (Expression, Soul Urge, Personality) follow the spelling in
 * force, so they can appear or disappear when someone changes their name.
 */

import { PYTHAGOREAN, sumMappedLetters } from "./mappings";
import { digitSum, isVowel, parseDob, reduceNumber } from "./reduce";

export const KARMIC_DEBT_MAP = {
  13: 4,
  14: 5,
  16: 7,
  19: 1,
} as const;

export type KarmicDebtCode = keyof typeof KARMIC_DEBT_MAP;

export type KarmicDebtSource =
  | "birth-day"
  | "life-path"
  | "expression"
  | "soul-urge"
  | "personality";

export type KarmicDebtSpelling = "operating" | "natal";

export type KarmicDebt = {
  code: KarmicDebtCode;
  reduced: number;
  source: KarmicDebtSource;
  /** Which spelling produced it. Absent for date-derived debts. */
  spelling?: KarmicDebtSpelling;
  label: string;
  lesson: string;
  /** Plain name for the position it came from. */
  positionLabel: string;
  /** Where the total came from, using this person's actual figures. */
  positionMeaning: string;
  /** What it tends to look like in ordinary life. */
  showsUpAs: string;
  /** What to actually do about it. */
  workOn: string;
  /** Date positions never change; name positions follow the spelling in use. */
  fixed: boolean;
};

export const KARMIC_DEBT_INTRO =
  "A karmic debt number is one of four totals — 13, 14, 16 or 19 — that can turn up while one of your numbers is being added up, before it reduces to a single digit. It is not a punishment and it does not predict trouble. It marks one place where the quick version of a skill tends not to work for you, so the ordinary way through is the slower, more deliberate version.";

export const KARMIC_DEBT_NONE =
  "None of the four karmic debt totals (13, 14, 16 or 19) appear in your date or name calculations. Nothing is missing and nothing is wrong — most charts have none. It simply means this particular marker has nothing to add to your reading.";

export const KARMIC_DEBT_NAME_NOTE =
  "Debts found in a name total follow the spelling you currently use. Change the spelling and they can appear or disappear. Debts found in your birth date stay the same for life.";

const LESSON: Record<KarmicDebtCode, string> = {
  13: "Progress through effort and consistency rather than shortcuts.",
  14: "Freedom with self-control; change without scattering.",
  16: "Humility and rebuilding when old structures fall away.",
  19: "Independence without shutting others out.",
};

const SHOWS_UP_AS: Record<KarmicDebtCode, string> = {
  13: "Work that should take one step takes three. Effort and reward feel out of proportion, and shortcuts usually cost more time than they save.",
  14: "Restlessness and over-committing, plans abandoned halfway, or reaching for food, spending or screens when things get dull.",
  16: "Something you had built your sense of self on gets knocked over — a role, a relationship, or a belief. It tends to arrive rather than be chosen, and the rebuild lands on you.",
  19: "You end up carrying it alone, either because you did not ask or because you took over. Credit and blame both land on you.",
};

const WORK_ON: Record<KarmicDebtCode, string> = {
  13: "Finish one thing before starting the next, and keep a plain record of what you actually did. Treat slow, unglamorous progress as the method rather than a sign something has gone wrong.",
  14: "Pick one commitment and hold it for a period you set in advance. Build variety inside the routine instead of escaping the routine.",
  16: "Hold plans loosely and say plainly what you do not know yet. Rebuilding goes faster when your identity is not welded to the thing that fell over.",
  19: "Ask for help before you need it rather than after, and say out loud what other people contributed.",
};

const POSITION_LABEL: Record<KarmicDebtSource, string> = {
  "birth-day": "Birth day",
  "life-path": "Life Path total",
  expression: "Expression number",
  "soul-urge": "Soul Urge number",
  personality: "Personality number",
};

function asDebt(n: number): KarmicDebtCode | null {
  if (n === 13 || n === 14 || n === 16 || n === 19) return n;
  return null;
}

/**
 * Every debt total the running sum passes through on its way to a single digit.
 *
 * Steps one digit-sum at a time. `reduceNumber` collapses a total all the way
 * down in a single call, which would step straight over the two-digit
 * intermediates that carry the debt.
 */
function chainHits(start: number): KarmicDebtCode[] {
  const hits: KarmicDebtCode[] = [];
  let cursor = start;
  const seen = new Set<number>();
  while (cursor > 9 && !seen.has(cursor)) {
    seen.add(cursor);
    const hit = asDebt(cursor);
    if (hit && !hits.includes(hit)) hits.push(hit);
    cursor = digitSum(cursor);
  }
  return hits;
}

/** The chain written out, e.g. "49 → 13 → 4". */
function chainText(start: number): string {
  const chain = [start];
  let cursor = start;
  while (cursor > 9) {
    cursor = digitSum(cursor);
    chain.push(cursor);
  }
  return chain.join(" → ");
}

function makeDebt(
  code: KarmicDebtCode,
  source: KarmicDebtSource,
  positionMeaning: string,
  spelling?: KarmicDebtSpelling,
): KarmicDebt {
  return {
    code,
    reduced: KARMIC_DEBT_MAP[code],
    source,
    spelling,
    label: `${code}/${KARMIC_DEBT_MAP[code]}`,
    lesson: LESSON[code],
    positionLabel: POSITION_LABEL[source],
    positionMeaning,
    showsUpAs: SHOWS_UP_AS[code],
    workOn: WORK_ON[code],
    fixed: source === "birth-day" || source === "life-path",
  };
}

/** Debts carried by the birth date. These never change. */
export function karmicDebtsFromDob(dob: string): KarmicDebt[] {
  const { day, month, year } = parseDob(dob);
  const out: KarmicDebt[] = [];

  const dayDebt = asDebt(day);
  if (dayDebt) {
    out.push(
      makeDebt(
        dayDebt,
        "birth-day",
        `You were born on the ${day}th, and ${day} is one of the four karmic debt totals. This one is visible from the date alone and does not change.`,
      ),
    );
  }

  // Same sum the Life Path itself is built from: each part reduced, then added.
  const dayPart = reduceNumber(day);
  const monthPart = reduceNumber(month);
  const yearPart = reduceNumber(year);
  const lpCompound = dayPart + monthPart + yearPart;
  for (const hit of chainHits(lpCompound)) {
    out.push(
      makeDebt(
        hit,
        "life-path",
        `Your Life Path is built by reducing each part of the date and adding them: ${dayPart} + ${monthPart} + ${yearPart} = ${chainText(lpCompound)}. The total passes through ${hit} before it settles, which is where the debt sits. This one comes from the date, so it does not change.`,
      ),
    );
  }

  return out;
}

/**
 * Debts carried by a name spelling. Expression uses every letter, Soul Urge the
 * vowels, Personality the consonants.
 */
export function karmicDebtsFromName(
  fullName: string,
  spelling: KarmicDebtSpelling = "operating",
): KarmicDebt[] {
  const name = fullName?.trim();
  if (!name) return [];

  const whose =
    spelling === "natal" ? "your birth-certificate name" : "the name you use now";

  const positions: {
    source: KarmicDebtSource;
    total: number;
    describe: (code: KarmicDebtCode, total: number) => string;
  }[] = [
    {
      source: "expression",
      total: sumMappedLetters(name, PYTHAGOREAN),
      describe: (code, total) =>
        `Every letter of ${whose} adds up to ${chainText(total)}, passing through ${code} on the way to your Expression number. Expression covers how you get things done, so this shows up in your working style.`,
    },
    {
      source: "soul-urge",
      total: sumMappedLetters(name, PYTHAGOREAN, (ch) => isVowel(ch)),
      describe: (code, total) =>
        `The vowels in ${whose} add up to ${chainText(total)}, passing through ${code} on the way to your Soul Urge number. Soul Urge covers what you privately want, so this shows up in what you reach for when nobody is watching.`,
    },
    {
      source: "personality",
      total: sumMappedLetters(name, PYTHAGOREAN, (ch) => !isVowel(ch)),
      describe: (code, total) =>
        `The consonants in ${whose} add up to ${chainText(total)}, passing through ${code} on the way to your Personality number. Personality covers the first impression you give, so this shows up in how you come across before people know you.`,
    },
  ];

  const out: KarmicDebt[] = [];
  for (const position of positions) {
    for (const hit of chainHits(position.total)) {
      out.push(
        makeDebt(
          hit,
          position.source,
          position.describe(hit, position.total),
          spelling,
        ),
      );
    }
  }
  return out;
}

/** Every debt across date and name positions, date positions first. */
export function allKarmicDebts(
  dob: string,
  fullName: string,
  spelling: KarmicDebtSpelling = "operating",
): KarmicDebt[] {
  return [...karmicDebtsFromDob(dob), ...karmicDebtsFromName(fullName, spelling)];
}

/** One-line summary for a debt, used where a full card will not fit. */
export function karmicDebtLine(debt: KarmicDebt): string {
  return `${debt.label} on your ${debt.positionLabel.toLowerCase()} — ${debt.lesson}`;
}

export type GroupedKarmicDebt = {
  code: KarmicDebtCode;
  reduced: number;
  label: string;
  lesson: string;
  showsUpAs: string;
  workOn: string;
  /** True only when every position carrying this code comes from the date. */
  fixed: boolean;
  positions: {
    source: KarmicDebtSource;
    label: string;
    meaning: string;
    spelling?: KarmicDebtSpelling;
    fixed: boolean;
  }[];
};

/**
 * One entry per debt code, listing every position that carries it, so the
 * same advice is not repeated for a code found in two places.
 */
export function groupKarmicDebts(debts: KarmicDebt[]): GroupedKarmicDebt[] {
  const byCode = new Map<KarmicDebtCode, GroupedKarmicDebt>();
  for (const debt of debts) {
    let entry = byCode.get(debt.code);
    if (!entry) {
      entry = {
        code: debt.code,
        reduced: debt.reduced,
        label: debt.label,
        lesson: debt.lesson,
        showsUpAs: debt.showsUpAs,
        workOn: debt.workOn,
        fixed: true,
        positions: [],
      };
      byCode.set(debt.code, entry);
    }
    entry.positions.push({
      source: debt.source,
      label: debt.positionLabel,
      meaning: debt.positionMeaning,
      spelling: debt.spelling,
      fixed: debt.fixed,
    });
    if (!debt.fixed) entry.fixed = false;
  }
  return [...byCode.values()];
}

/** 13/4 charts often feel extra demand in Personal Years 4, 6, 7, 9. */
export function karmicHeavierYears(debts: KarmicDebt[]): number[] {
  const years = new Set<number>();
  for (const d of debts) {
    if (d.code === 13) {
      [4, 6, 7, 9].forEach((n) => years.add(n));
    } else if (d.code === 14) {
      [5, 7].forEach((n) => years.add(n));
    } else if (d.code === 16) {
      [7, 9].forEach((n) => years.add(n));
    } else if (d.code === 19) {
      [1, 4, 8].forEach((n) => years.add(n));
    }
  }
  return [...years].sort((a, b) => a - b);
}

export function karmicEasierYears(debts: KarmicDebt[]): number[] {
  const years = new Set<number>();
  for (const d of debts) {
    if (d.code === 13) {
      [1, 3, 8].forEach((n) => years.add(n));
    } else if (d.code === 14) {
      [3, 6].forEach((n) => years.add(n));
    } else if (d.code === 16) {
      [3, 6].forEach((n) => years.add(n));
    } else if (d.code === 19) {
      [3, 6, 9].forEach((n) => years.add(n));
    }
  }
  return [...years].sort((a, b) => a - b);
}
