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
  1: "Plant one clear start. Do not wait for a perfect week.",
  2: "Pair a decision. Name what you heard before you add what you want.",
  3: "Finish one piece of expression instead of opening three.",
  4: "Keep one durable container — a list, a slot, a tool.",
  5: "Give change a craft: one new input, with a start and an end.",
  6: "Choose one act of care, then rest. Automatic yes is not the same as love.",
  7: "Protect a study hour, then bring one finding back to ordinary talk.",
  8: "Measure one result honestly. Stewardship over speed.",
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
  const yearSummary = assertSafeCopy(
    `Personal Year ${currentCycle.number} (${yearTrait}) is the climate for this birthday cycle. The twelve months below are weather inside that climate — Personal Month from the year digit plus the calendar month.`,
    "forecast.year",
  );

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
