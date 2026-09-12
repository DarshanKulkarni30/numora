/**
 * Personal Blueprint reading: who you are + how this year may feel.
 * Chaldean Name Cycle is timing. Pythagorean Essence is not used here.
 */

import { parseChartNumber } from "@/lib/numerology/enhanced/digits";
import { personalYearCycleAt, personalYearForCalendarYear } from "@/lib/numerology/cycles";
import { pinnacleAtDate, pinnacleTheme } from "@/lib/numerology/pinnacles";
import type { NumerologyReport } from "@/lib/numerology/types";
import { yearsHrefForPerson } from "@/lib/numerology/yearPage";
import { buildCareerCompass, buildLifeCompass } from "./compass";
import { buildInteractionMap } from "./interactions";
import { buildLifeAreaScores } from "./lifeAreas";
import { nameCycleForYear, type NameCycle } from "./nameCycle";
import { buildNextMoves } from "./nextMoves";
import { buildOperatingManual } from "./operatingManual";
import { buildYearTransition } from "./transitions";
import { interpretYear, YEAR_INTERPRETATION_VERSION } from "./yearInterpreter";

export { YEAR_INTERPRETATION_VERSION };

export function coreSeatsFromReport(report: NumerologyReport) {
  const snap = report.numerology_snapshot;
  const bn = parseChartNumber(snap.vedic_psychic) ?? 9;
  const dn = parseChartNumber(snap.vedic_destiny) ?? 9;
  const nameRoot =
    parseChartNumber(snap.chaldean_name_number) ??
    parseChartNumber(snap.vedic_name) ??
    9;
  const soul = parseChartNumber(snap.soul_urge_number) ?? bn;
  const nameCompound = parseChartNumber(snap.compound_number) ?? nameRoot;
  return { bn, dn, nameRoot, soul, nameCompound };
}

export function cycleForReportYear(
  report: NumerologyReport,
  calendarYearUsed: number,
  personalYear?: number,
  history?: unknown,
): NameCycle | null {
  return nameCycleForYear({
    natalName: report.numerology_snapshot.natal_name || report.person.full_name,
    dob: report.person.date_of_birth,
    calendarYearUsed,
    history,
    preferredName: report.person.preferred_name,
    personalYear,
  });
}

export function buildBlueprintReading(
  report: NumerologyReport,
  opts?: { reportId?: string; now?: Date; history?: unknown },
) {
  const now = opts?.now ?? new Date();
  const dob = report.person.date_of_birth;
  const { bn, dn, nameRoot, soul, nameCompound } = coreSeatsFromReport(report);
  const pyCycle = personalYearCycleAt(dob, now);
  const py = pyCycle.number;
  const year = pyCycle.calendarYearUsed;
  const cycle = cycleForReportYear(report, year, py, opts?.history);
  const interpretation = interpretYear({
    calendarYear: year,
    personalYear: py,
    cycle,
    bn,
    dn,
    nameRoot,
  });

  const prevYear = year - 1;
  const nextYear = year + 1;
  const prevPy = personalYearForCalendarYear(dob, prevYear);
  const nextPy = personalYearForCalendarYear(dob, nextYear);
  const prevCycle = cycleForReportYear(report, prevYear, prevPy, opts?.history);
  const nextCycle = cycleForReportYear(report, nextYear, nextPy, opts?.history);

  const journeyYears = [year - 3, year - 2, year - 1, year, year + 1, year + 2, year + 3];
  const journey = journeyYears.map((y) => {
    const yPy = personalYearForCalendarYear(dob, y);
    const yCycle = cycleForReportYear(report, y, yPy, opts?.history);
    const reading = interpretYear({
      calendarYear: y,
      personalYear: yPy,
      cycle: yCycle,
      bn,
      dn,
      nameRoot,
      isPast: y < year,
      isFuture: y > year,
    });
    return { year: y, py: yPy, cycle: yCycle, reading, isCurrent: y === year };
  });

  const interactions = buildInteractionMap({ bn, dn, nameRoot, soul });
  const areas = buildLifeAreaScores({
    bn,
    dn,
    soul,
    nameRoot,
    personalYear: py,
    loShu: report.lo_shu,
  });
  const manual = buildOperatingManual({ bn, dn, soul, nameRoot });
  const career = buildCareerCompass({ bn, dn, nameRoot, year: interpretation });
  const life = buildLifeCompass({
    purpose: report.person.purpose || "Self-reflection",
    growthTitles: (report.growth_areas ?? []).map((g) => g.title),
    year: interpretation,
  });
  const transition = buildYearTransition({
    prevYear,
    currentYear: year,
    nextYear,
    prevPy,
    currentPy: py,
    nextPy,
    prevCycle,
    currentCycle: cycle,
  });
  const nextMoves = buildNextMoves({
    career,
    life,
    year: interpretation,
    nextYear,
    nextPy,
    nextCycleLabel: nextCycle
      ? `${nextCycle.active.letter}/${nextCycle.active.value}`
      : null,
  });
  const pin = pinnacleAtDate(dob, now);
  const pinCopy = pinnacleTheme(pin.number);
  const yearsHref = yearsHrefForPerson({
    dateOfBirth: dob,
    fullName: report.person.operating_name || report.person.full_name,
  });

  return {
    interpretationVersion: YEAR_INTERPRETATION_VERSION,
    displayName:
      report.person.preferred_name?.trim() || report.person.full_name,
    bn,
    dn,
    soul,
    nameRoot,
    nameCompound,
    nameDisplay: cycle?.nameDisplay ?? String(nameRoot),
    py,
    year,
    cycle,
    interpretation,
    interactions,
    areas,
    manual,
    career,
    life,
    transition,
    nextMoves,
    journey,
    pinnacle: { ...pin, ...pinCopy },
    yearsHref,
    detailedHref: opts?.reportId ? `/report/${opts.reportId}` : "/dashboard",
    numbersUsed: interpretation.numbers,
  };
}

export type BlueprintReading = ReturnType<typeof buildBlueprintReading>;
