/**
 * Year Outlook Mandala — seasonal metaphors + Year Dynamics tiles.
 * Builds on projectedYearCycle + PROJECTED_YEAR_META. Reflective only.
 */

import { personalYearForCalendarYear } from "./cycles";
import { reduceToSingleDigit } from "./dateNumbers";
import { plainJob, plainTrait } from "./layeredCopy";
import { planetForVedic, type PlanetInfo } from "./planets";
import {
  projectedYearMeta,
  type ProjectedYearCycle,
  type ProjectedYearMeta,
} from "./vedicYearNumber";

export type YearSeason = {
  name: string;
  metaphor: string;
  visualHint: string;
  tint: string;
  stroke: string;
};

export type YearInsightTile = {
  id: "core" | "planet" | "practice";
  title: string;
  headline: string;
  glyph: string;
  insight: string;
};

export type YearSynergy = {
  personalYear: number;
  outlook: number;
  mode: "harmony" | "contrast" | "near";
  label: string;
  summary: string;
};

export type YearOutlookMandalaModel = {
  cycle: ProjectedYearCycle;
  meta: ProjectedYearMeta;
  planet: PlanetInfo;
  season: YearSeason;
  tiles: YearInsightTile[];
  synergy: YearSynergy;
  combined: string;
  calcCapsules: { id: string; label: string; value: string }[];
  reflectivePractice: string;
  blueprintLines: string[];
};

const SEASON_BY_DIGIT: Record<number, YearSeason> = {
  1: {
    name: "Dawn Season",
    metaphor: "Sunrise over open ground",
    visualHint: "Fresh starts and visible initiative",
    tint: "from-amber-50 to-orange-50/80",
    stroke: "rgb(180 100 40)",
  },
  2: {
    name: "Tide Season",
    metaphor: "Moonlit water",
    visualHint: "Partnership and patient rhythm",
    tint: "from-sky-50 to-slate-50",
    stroke: "rgb(70 110 150)",
  },
  3: {
    name: "Garden Season",
    metaphor: "Bloom and conversation",
    visualHint: "Expression, learning, generosity",
    tint: "from-orange-50 to-amber-50/70",
    stroke: "rgb(180 100 50)",
  },
  4: {
    name: "Crossroads Season",
    metaphor: "Rebuild after weather",
    visualHint: "Unconventional paths and foundations",
    tint: "from-violet-50 to-stone-50",
    stroke: "rgb(100 80 140)",
  },
  5: {
    name: "Wind Season",
    metaphor: "Open road and messages",
    visualHint: "Movement, trade, adaptable pace",
    tint: "from-teal-50 to-cyan-50/70",
    stroke: "rgb(45 122 120)",
  },
  6: {
    name: "Hearth Season",
    metaphor: "Care and beauty at home",
    visualHint: "Harmony, craft, relational duty",
    tint: "from-rose-50 to-emerald-50/50",
    stroke: "rgb(45 122 90)",
  },
  7: {
    name: "Cave Season",
    metaphor: "Deep forest quiet",
    visualHint: "Study, discernment, inward clarity",
    tint: "from-indigo-50 to-slate-50",
    stroke: "rgb(79 70 150)",
  },
  8: {
    name: "Mountain Season",
    metaphor: "Long ascent under Saturn",
    visualHint: "Structure, independence, stamina",
    tint: "from-slate-100 to-indigo-50/80",
    stroke: "rgb(45 55 90)",
  },
  9: {
    name: "Harvest Season",
    metaphor: "Closing the field",
    visualHint: "Completion, courage, clean endings",
    tint: "from-red-50 to-orange-50/60",
    stroke: "rgb(150 70 60)",
  },
};

function synergyFor(outlook: number, personalYear: number): YearSynergy {
  if (outlook === personalYear) {
    return {
      personalYear,
      outlook,
      mode: "harmony",
      label: "Aligned",
      summary: `Western year ${personalYear} and this birthday-year ${outlook} match. Same job: ${plainJob(outlook)}.`,
    };
  }
  const gap = Math.abs(outlook - personalYear);
  if (gap === 1 || gap === 8) {
    return {
      personalYear,
      outlook,
      mode: "near",
      label: "Near tones",
      summary: `Western year ${personalYear} sits next to this birthday-year ${outlook}. Do both jobs in small steps: ${plainJob(personalYear)}; ${plainJob(outlook)}.`,
    };
  }
  return {
    personalYear,
    outlook,
    mode: "contrast",
    label: "Contrast",
    summary: `You have two year numbers because two methods count the same year differently. The Western Personal Year ${personalYear} is ${plainTrait(personalYear)} and runs January to December. The birthday-year Outlook ${outlook} is ${plainTrait(outlook)} and runs from one birthday to the next. Neither overrules the other — use the Western one for calendar planning and the birthday one for how the year actually feels as you live it.`,
  };
}

export function buildYearOutlookMandala(
  cycle: ProjectedYearCycle,
  dob: string,
): YearOutlookMandalaModel {
  const meta = projectedYearMeta(cycle.number);
  const planet = planetForVedic(cycle.number);
  const season = SEASON_BY_DIGIT[cycle.number] ?? SEASON_BY_DIGIT[1];
  const personalYear = personalYearForCalendarYear(
    dob,
    cycle.calendarYearUsed,
  );
  const synergy = {
    ...synergyFor(cycle.number, reduceToSingleDigit(personalYear)),
    personalYear,
  };

  const coreGlyph =
    cycle.number === 8
      ? "▲"
      : cycle.number === 5
        ? "∿"
        : cycle.number === 2
          ? "☽"
          : cycle.number === 9
            ? "✦"
            : cycle.number === 7
              ? "◉"
              : "◎";

  const tiles: YearInsightTile[] = [
    {
      id: "core",
      title: "Core Tone",
      headline: meta.strengths.slice(0, 3).join(" · ") || meta.shortMeaning,
      glyph: coreGlyph,
      insight: meta.shortMeaning,
    },
    {
      id: "planet",
      title: "Planet Tone",
      headline: `${planet.name}`,
      glyph: planet.symbol,
      insight: `${planet.name} here points to ${meta.strengths[0]?.toLowerCase() ?? plainTrait(cycle.number)}. Not a purchase or remedy.`,
    },
    {
      id: "practice",
      title: "Try this year",
      headline: meta.practice,
      glyph: "→",
      insight: `Watch: ${meta.watchouts[0] ?? "treating the year as a prediction"}.`,
    },
  ];
  const calcCapsules = [
    { id: "month", label: "Birth Month", value: String(cycle.month) },
    { id: "day", label: "Birth Day", value: String(cycle.day) },
    {
      id: "year",
      label: "Year Digits",
      value: String(cycle.yearDigits).padStart(2, "0"),
    },
    {
      id: "weekday",
      label: `${cycle.weekdayLabel}`,
      value: String(cycle.weekdayDigit),
    },
  ];

  const combined = `Combined: Western year ${personalYear} — ${plainJob(personalYear)}. This birthday-year ${cycle.number} — ${plainJob(cycle.number)}. ${meta.practice} Not a prediction.`;
  // Sits under the derivation table, so it explains the sum rather than
  // repeating the combined line printed under the wheel.
  const reflectivePractice = `Those four parts add to ${cycle.compound}, which reduces to ${cycle.number}. That single digit is the whole point of the table above — the parts are shown so you can check the working, not because each one has its own meaning.`;

  const blueprintLines = [
    `Year Outlook Mandala · ${cycle.rangeLabel} · ${cycle.number} (${planet.name})`,
    `${season.name}: ${season.metaphor} — ${season.visualHint}`,
    synergy.summary,
    ...tiles.map((t) => `${t.title}: ${t.headline} — ${t.insight}`),
    `Calc: ${cycle.month}+${cycle.day}+${cycle.yearDigits}+${cycle.weekdayDigit}=${cycle.compound} → ${cycle.number}`,
    reflectivePractice,
  ];

  return {
    cycle,
    meta,
    planet,
    season,
    tiles,
    synergy,
    combined,
    calcCapsules,
    reflectivePractice,
    blueprintLines,
  };
}
