/**
 * 12-month Personal Year / Month chapter from a date of birth.
 * Birthday-cycle Personal Year; calendar month for Personal Month.
 */

import { personalMonth, personalYearCycleAt } from "./cycles";
import { coreTraitFor, yearMonthMeaning } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import { assertSafeCopy, assertSafeList } from "./safety";

export type MonthForecast = {
  calendarYear: number;
  calendarMonth: number;
  label: string;
  isCurrent: boolean;
  personalYear: number;
  personalMonth: number;
  summary: string;
  practice: string;
};

export type YearForecast = {
  asOfLabel: string;
  personalYear: number;
  yearSummary: string;
  months: MonthForecast[];
  disclaimer: string;
};

const DISCLAIMER =
  "A twelve-month chapter is reflective pacing from Personal Year and Personal Month digits. It is not a calendar of events, and it does not predict outcomes.";

const MONTH_PRACTICE: Record<number, string> = {
  1: "Start one small thing this month. Do not wait for a perfect week.",
  2: "Decide with one other person. Repeat what you heard before you add what you want.",
  3: "Finish one note, talk, or piece of work. Do not open three new ones.",
  4: "Write one repeating plan — a list, a weekly slot, or a tool — and keep it this week.",
  5: "Change one input. Give it a start date and an end date.",
  6: "Keep one promise to someone, then rest. A yes is not the same as care.",
  7: "Protect one study hour, then tell one person what you found.",
  8: "Finish one result you can count. Do not make speed the goal.",
  9: "Close one loop that is already done. Do not reopen it this month.",
};

function addMonths(asOf: Date, offset: number): Date {
  return new Date(asOf.getFullYear(), asOf.getMonth() + offset, 12, 12, 0, 0);
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function asOfLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function buildYearForecast(
  dateOfBirth: string,
  asOf = new Date(),
): YearForecast {
  const currentCycle = personalYearCycleAt(dateOfBirth, asOf);
  const yearTrait = coreTraitFor(currentCycle.number);

  const months: MonthForecast[] = [];
  for (let i = 0; i < 12; i++) {
    const d = addMonths(asOf, i);
    const cycle = personalYearCycleAt(dateOfBirth, d);
    const pm = personalMonth(cycle.number, d);
    const digit = reduceToSingleDigit(pm);
    const trait = coreTraitFor(pm);
    months.push({
      calendarYear: d.getFullYear(),
      calendarMonth: d.getMonth() + 1,
      label: monthLabel(d),
      isCurrent: i === 0,
      personalYear: cycle.number,
      personalMonth: pm,
      summary: assertSafeCopy(
        `${monthLabel(d)}: Personal Month ${pm} (${trait.toLowerCase()}) inside Personal Year ${cycle.number}. ${yearMonthMeaning(pm)}`,
        `forecast.m.${i}.summary`,
      ),
      practice: assertSafeCopy(
        MONTH_PRACTICE[digit] ?? MONTH_PRACTICE[1],
        `forecast.m.${i}.practice`,
      ),
    });
  }

  // The window is 12 rolling months from today, so it crosses the birthday and
  // the year digit changes partway down the list. Say where, or the header
  // contradicts the rows.
  const switchAt = months.find((m) => m.personalYear !== currentCycle.number);
  const yearSummary = assertSafeCopy(
    switchAt
      ? `The next twelve months, starting from today. You are in Personal Year ${currentCycle.number} (${yearTrait}) until your birthday; from ${switchAt.label} the rows move into Personal Year ${switchAt.personalYear} (${coreTraitFor(switchAt.personalYear)}). Personal Month is the year digit plus the calendar month.`
      : `Personal Year ${currentCycle.number} (${yearTrait}) is the climate for every month below. Personal Month is the year digit plus the calendar month.`,
    "forecast.year",
  );

  return {
    asOfLabel: asOfLabel(asOf),
    personalYear: currentCycle.number,
    yearSummary,
    months,
    disclaimer: assertSafeCopy(DISCLAIMER, "forecast.disclaimer"),
  };
}

export function yearForecastPdfLines(forecast: YearForecast): string[] {
  return assertSafeList(
    [
      forecast.yearSummary,
      ...forecast.months.map(
        (m) =>
          `${m.label}${m.isCurrent ? " (now)" : ""} · PY ${m.personalYear} · PM ${m.personalMonth}. ${m.practice}`,
      ),
      forecast.disclaimer,
    ],
    "forecast.pdf",
  );
}
