/**
 * Recompute birthday-cycle Personal Year / Month / Day at view time.
 * Saved reports stay a snapshot; the HTML reading is living.
 */

import {
  formatCycleRange,
  personalMonth,
  personalYearCycleAt,
} from "./cycles";
import { yearMonthMeaning } from "./meanings";
import { LAND_LABEL, westernYearOutlook } from "./personalYearOutlook";
import { personalDayNumber } from "./pythagoreanChart";
import type { NumerologyReport } from "./types";
import { isValidDob } from "@/lib/profile/date";

export function livingAsOfLabel(asOf = new Date()): string {
  return asOf.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function applyLivingTiming(
  report: NumerologyReport,
  asOf = new Date(),
): NumerologyReport {
  const dob = report.person.date_of_birth;
  if (!isValidDob(dob)) return report;

  const cycle = personalYearCycleAt(dob, asOf);
  const outlook = westernYearOutlook({
    dob,
    fullName: report.person.full_name,
    anchor: "birthday",
    year: cycle.calendarYearUsed,
    asOf,
  });
  const pm = personalMonth(cycle.number, asOf);
  const pd = personalDayNumber(cycle.number, asOf);

  return {
    ...report,
    numerology_snapshot: {
      ...report.numerology_snapshot,
      personal_year: String(cycle.number),
      personal_month: String(pm),
      personal_day: String(pd),
    },
    personal_year: {
      ...report.personal_year,
      number: String(outlook.number),
      theme: outlook.nature.typical,
      advice: outlook.nature.practice,
      nature: outlook.nature.nature,
      land: LAND_LABEL[outlook.land.band],
      range_label: outlook.rangeLabel ?? formatCycleRange(cycle),
      resonance: outlook.land.resonanceLine,
      moment_note: outlook.land.momentNote ?? undefined,
    },
    personal_month: {
      number: String(pm),
      theme: yearMonthMeaning(pm),
      advice:
        "Let the Personal Month refine this year's climate into this month's weather — habits, not events. This number updates when you open the live reading.",
    },
  };
}
