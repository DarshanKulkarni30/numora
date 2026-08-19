/**
 * Year Outlook Mandala — seasonal metaphors + Year Dynamics tiles.
 * Builds on projectedYearCycle + PROJECTED_YEAR_META. Reflective only.
 */

import { personalYearForCalendarYear } from "./cycles";
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
      summary: `Personal Year ${personalYear} and Year Outlook ${outlook} rhyme — Western pacing and Vedic birthday tone support one story.`,
    };
  }
  const gap = Math.abs(outlook - personalYear);
  if (gap === 1 || gap === 8) {
    return {
      personalYear,
      outlook,
      mode: "near",
      label: "Near tones",
      summary: `Personal Year ${personalYear} sits beside Outlook ${outlook} — related pacing with a soft shift in emphasis.`,
    };
  }
  return {
    personalYear,
    outlook,
    mode: "contrast",
    label: "Contrast",
    summary: `Personal Year ${personalYear} and Year Outlook ${outlook} differ — hold both as mirrors: monthly Western pacing vs birthday-cycle Vedic tone.`,
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
  const synergy = synergyFor(cycle.number, personalYear);

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
      headline: `${planet.name} · stamina & responsibility`,
      glyph: planet.symbol,
      insight: `${planet.name} emphasizes ${meta.strengths[0]?.toLowerCase() ?? "durable pacing"} — patience and responsible action over haste.`,
    },
    {
      id: "practice",
      title: "Practice Cue",
      headline: meta.practice.split(/[.。]/)[0] ?? meta.practice,
      glyph: "→",
      insight: meta.practice,
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

  const reflectivePractice = `Reflective practice for ${season.name}: ${meta.practice}`;

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
    calcCapsules,
    reflectivePractice,
    blueprintLines,
  };
}
