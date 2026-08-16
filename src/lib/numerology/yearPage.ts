import { PERSONAL_CYCLE } from "@/lib/guides/numberMeanings";
import { watchoutsFor } from "@/lib/guides/watchouts";
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
  "Numerology is a reflective tradition, not a forecast of events. Year numbers are pacing themes for how a calendar year may feel to work with. They do not diagnose, treat, or replace medical, legal, financial, or psychological advice.";

export const WESTERN_YEAR_METHOD_NOTE =
  "Personal Year (Western) adds birth month, birth day, and the full calendar year, then reduces—keeping 11, 22, or 33 when they appear. It is a reflective weather theme for pacing, not a guarantee of specific events.";

export const VEDIC_YEAR_METHOD_NOTE =
  "Vedic year number adds birth month, birth day, the year’s last two digits, and the weekday digit of that year’s birthday, then reduces to 1–9. It sits beside Western Personal Year as a second mirror—not a forecast of fixed events.";

export const WESTERN_YEAR_TAG: Record<number, YearTag> = {
  1: "Favourable",
  2: "Neutral",
  3: "Favourable",
  4: "Challenging",
  5: "Favourable",
  6: "Favourable",
  7: "Neutral",
  8: "Favourable",
  9: "Neutral",
  11: "Neutral",
  22: "Neutral",
  33: "Neutral",
};

export function yearsFromBirthToAge70(birthYear: number): number[] {
  const start = Math.trunc(birthYear);
  const end = start + 70;
  const years: number[] = [];
  for (let y = start; y <= end; y += 1) years.push(y);
  return years;
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
  return {
    tag: WESTERN_YEAR_TAG[number] ?? "Neutral",
    shortMeaning: cycle?.theme ?? "A reflective pacing theme for the year.",
    strengths: cycle?.strengths ?? [],
    watchouts: watchoutsFor("personal-year", key),
    practice:
      cycle?.practice ??
      "Treat the number as weather for pacing, not a script of events.",
  };
}
