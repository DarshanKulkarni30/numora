import { PERSONAL_CYCLE } from "@/lib/guides/numberMeanings";
import { watchoutsFor } from "@/lib/guides/watchouts";
import { pyNatureMeta } from "./personalYearOutlook";
import type { YearTag } from "./vedicYearNumber";

export type YearSystemTab = "western" | "vedic";

/** Deep-link from a report so /years opens that person, not Self by default. */
export function yearsHrefForPerson(opts: {
  dateOfBirth: string;
  fullName?: string;
  tab?: YearSystemTab;
}): string {
  const params = new URLSearchParams();
  if (opts.tab === "vedic") params.set("tab", "vedic");
  if (opts.dateOfBirth) params.set("dob", opts.dateOfBirth);
  if (opts.fullName?.trim()) params.set("name", opts.fullName.trim());
  const q = params.toString();
  return q ? `/years?${q}` : "/years";
}

export const YEAR_PAGE_DISCLAIMER =
  "Numerology is a reflective tradition, not a forecast of events. Year numbers are pacing themes for how a cycle may feel to work with. They do not diagnose, treat, or replace medical, legal, financial, or psychological advice.";

export const WESTERN_YEAR_METHOD_NOTE =
  "Personal Year (Western) adds birth month, birth day, and a calendar year, then reduces—keeping 11, 22, or 33 when they appear. NumoraWisdom defaults to a birthday-to-birthday cycle (this year’s number activates on your birthday). Toggle Calendar year for the 1 Jan–31 Dec version. Nature labels describe typical experience—not Amazing/Good scores.";

export const VEDIC_YEAR_METHOD_NOTE =
  "Vedic year number (Harish Johari) adds birth month, birth day, the year’s last two digits, and the weekday digit of that year’s birthday, then reduces to 1–9. NumoraWisdom defaults to a birthday-to-birthday cycle (this year’s number activates on your birthday). Toggle Calendar year for the 1 Jan–31 Dec version. It sits beside Western Personal Year as a second mirror—not a forecast of fixed events.";

export const VEDIC_BIRTHDAY_NOTE =
  "Birthday cycle (default): this calendar year’s Vedic number uses the weekday of that year’s birthday and runs until the day before the next birthday. It is a pacing theme, not a forecast of events.";

export const VEDIC_CALENDAR_NOTE =
  "Calendar year: Vedic year number is calculated for 1 January–31 December of the chosen year (the Johari “year to examine”). Same formula, different start date — not mixed with the birthday cycle.";

export const WESTERN_YEAR_TAG: Record<number, YearTag> = {
  1: "Neutral",
  2: "Neutral",
  3: "Favourable",
  4: "Challenging",
  5: "Favourable",
  6: "Neutral",
  7: "Challenging",
  8: "Favourable",
  9: "Challenging",
  11: "Neutral",
  22: "Neutral",
  33: "Neutral",
};

export function yearsFromBirthToAge90(birthYear: number): number[] {
  const start = Math.trunc(birthYear);
  const end = start + 90;
  const years: number[] = [];
  for (let y = start; y <= end; y += 1) years.push(y);
  return years;
}

/** @deprecated Use yearsFromBirthToAge90 */
export function yearsFromBirthToAge70(birthYear: number): number[] {
  return yearsFromBirthToAge90(birthYear);
}

export function defaultExpandedYear(years: number[], nowYear: number): number {
  if (years.includes(nowYear)) return nowYear;
  const past = years.filter((y) => y <= nowYear);
  return past[past.length - 1] ?? years[0] ?? nowYear;
}

export function westernYearCopy(number: number): {
  tag: YearTag;
  shortMeaning: string;
  strengths: string[];
  watchouts: string[];
  practice: string;
} {
  const key = String(number);
  const cycle = PERSONAL_CYCLE[key];
  const nature = pyNatureMeta(number);
  return {
    tag: WESTERN_YEAR_TAG[number] ?? "Neutral",
    shortMeaning: nature.short,
    strengths: cycle?.strengths ?? [],
    watchouts: watchoutsFor("personal-year", key),
    practice: nature.practice,
  };
}
