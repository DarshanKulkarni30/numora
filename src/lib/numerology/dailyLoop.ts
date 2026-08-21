/**
 * Daily Personal Day habit loop (7-day strip + Essence).
 * The number already exists on reports; this is the returning surface.
 */

import { personalMonth, personalYearCycleAt } from "./cycles";
import { coreTraitFor } from "./meanings";
import {
  buildPythagoreanChart,
  personalDayNumber,
  type PythagoreanChart,
} from "./pythagoreanChart";
import { assertSafeCopy, assertSafeList } from "./safety";

export type DailyCell = {
  asOf: string;
  weekday: string;
  isToday: boolean;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  trait: string;
  practice: string;
};

export type DailyLoop = {
  nameUsed: string;
  today: DailyCell;
  week: DailyCell[];
  essence: PythagoreanChart["essence"];
  checkInPrompt: string;
  disclaimer: string;
};

const DAY_PRACTICE: Record<number, string> = {
  1: "Start one thing that is yours. Do not wait for a committee.",
  2: "Slow the reply. Name what you heard.",
  3: "Say or make one small true thing.",
  4: "Keep one container. Lists count.",
  5: "Change one input, not the whole map.",
  6: "Care with a boundary: help, then stop.",
  7: "Protect a quiet hour. Bring one finding back.",
  8: "Count one result. Stewardship over hurry.",
  9: "Close a loop that is already done.",
  11: "Write the insight down, then rest the nervous system.",
  22: "Take one practical step on a long build.",
};

const DISCLAIMER =
  "Personal Day is weather for a calendar date inside the birthday-cycle Personal Year. It is not a daily product of events, and it does not predict outcomes.";

function addDays(asOf: Date, offset: number): Date {
  return new Date(
    asOf.getFullYear(),
    asOf.getMonth(),
    asOf.getDate() + offset,
    12,
    0,
    0,
  );
}

function formatDay(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function weekday(d: Date): string {
  return d.toLocaleDateString("en-GB", { weekday: "short" });
}

function cellFor(dob: string, d: Date, isToday: boolean): DailyCell {
  const py = personalYearCycleAt(dob, d).number;
  const pm = personalMonth(py, d);
  const pd = personalDayNumber(py, d);
  const trait = coreTraitFor(pd);
  return {
    asOf: formatDay(d),
    weekday: weekday(d),
    isToday,
    personalYear: py,
    personalMonth: pm,
    personalDay: pd,
    trait,
    practice: assertSafeCopy(
      DAY_PRACTICE[pd] ?? DAY_PRACTICE[1],
      `daily.${pd}`,
    ),
  };
}

export function buildDailyLoop(opts: {
  natalName: string;
  dateOfBirth: string;
  asOf?: Date;
}): DailyLoop {
  const asOf = opts.asOf ?? new Date();
  const chart = buildPythagoreanChart({
    natalName: opts.natalName,
    dateOfBirth: opts.dateOfBirth,
    coreNumbers: [],
    asOf,
  });
  const week = Array.from({ length: 7 }, (_, i) =>
    cellFor(opts.dateOfBirth, addDays(asOf, i), i === 0),
  );
  const today = week[0];
  return {
    nameUsed: opts.natalName,
    today,
    week,
    essence: chart.essence,
    checkInPrompt: assertSafeCopy(
      `Today is Personal Day ${today.personalDay} (${today.trait.toLowerCase()}) inside Personal Month ${today.personalMonth} and Personal Year ${today.personalYear}. One practice: ${today.practice}`,
      "daily.prompt",
    ),
    disclaimer: assertSafeCopy(DISCLAIMER, "daily.disclaimer"),
  };
}

export function dailyLoopPdfLines(loop: DailyLoop): string[] {
  return assertSafeList(
    [
      loop.checkInPrompt,
      loop.essence.summary,
      ...loop.week.map(
        (d) =>
          `${d.weekday} ${d.asOf}${d.isToday ? " (today)" : ""} · Day ${d.personalDay} · ${d.practice}`,
      ),
      loop.disclaimer,
    ],
    "daily.pdf",
  );
}
