/**
 * Annual rhythm — Personal Year, Year outlook, Personal Month, and sun sign.
 * Weather language only: not events, health, or a calendar of incidents.
 */

import { SUN_SIGNS, isSunSignId, type SunSignInfo } from "@/lib/astrology/sunSign";
import { reduceToSingleDigit } from "./dateNumbers";
import { PY_NATURE } from "./personalYearOutlook";

export type RhythmLayerId = "year" | "outlook" | "month";

export type DigitSeason = {
  season: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  keyword: string;
  visual: string;
  glyph: string;
  stroke: string;
  fill: string;
};

export const DIGIT_SEASON: Record<number, DigitSeason> = {
  1: {
    season: "Spark season",
    element: "Fire",
    keyword: "Beginnings",
    visual: "rising lines",
    glyph: "△",
    stroke: "rgba(217, 119, 6, 0.7)",
    fill: "#F59E0B",
  },
  2: {
    season: "Tide season",
    element: "Water",
    keyword: "Cooperation",
    visual: "soft waves",
    glyph: "☽",
    stroke: "rgba(100, 116, 139, 0.7)",
    fill: "#94A3B8",
  },
  3: {
    season: "Voice season",
    element: "Air",
    keyword: "Expression",
    visual: "open sky",
    glyph: "✧",
    stroke: "rgba(14, 116, 144, 0.65)",
    fill: "#7DD3FC",
  },
  4: {
    season: "Earth season",
    element: "Earth",
    keyword: "Structure",
    visual: "a quiet grid",
    glyph: "□",
    stroke: "rgba(120, 53, 15, 0.65)",
    fill: "#A8A29E",
  },
  5: {
    season: "Wind season",
    element: "Air",
    keyword: "Movement",
    visual: "flowing lines",
    glyph: "⬠",
    stroke: "rgba(15, 118, 110, 0.7)",
    fill: "#2DD4BF",
  },
  6: {
    season: "Hearth season",
    element: "Earth",
    keyword: "Care",
    visual: "warm enclosure",
    glyph: "♡",
    stroke: "rgba(190, 24, 93, 0.55)",
    fill: "#F9A8D4",
  },
  7: {
    season: "Still-water season",
    element: "Water",
    keyword: "Insight",
    visual: "deep quiet",
    glyph: "◇",
    stroke: "rgba(67, 56, 202, 0.6)",
    fill: "#818CF8",
  },
  8: {
    season: "Summit season",
    element: "Earth",
    keyword: "Stewardship",
    visual: "long ridges",
    glyph: "⬡",
    stroke: "rgba(30, 58, 107, 0.7)",
    fill: "#1E3A5F",
  },
  9: {
    season: "Harvest season",
    element: "Fire",
    keyword: "Completion",
    visual: "ember glow",
    glyph: "○",
    stroke: "rgba(185, 28, 28, 0.6)",
    fill: "#E07A5F",
  },
};

const YEAR_MONTH: Record<string, string> = {
  "5-4":
    "A wind-year (5) meets an earth-month (4). Movement wants a frame — exploration with one boundary. Weather for pacing, not a forecast of events.",
  "4-5":
    "An earth-year (4) meets a wind-month (5). The long build gets a breath of variety — one experiment inside the structure.",
  "1-4":
    "A spark-year (1) meets an earth-month (4). New chapters land better when one foundation is tended this month.",
  "9-4":
    "A harvest-year (9) meets an earth-month (4). Completing wants a shelf to sit on — sort and close, don’t reopen ten doors.",
  "5-5":
    "Wind on wind — year and month both ask for movement. Choose one change so the breeze doesn’t scatter.",
  "4-4":
    "Earth on earth — year and month both ask for building. Keep the load honest; rest is part of the scaffold.",
  "7-5":
    "Still water (7) beside wind (5): inner study with a little outer motion. Alternate quiet and a small outing.",
  "3-6":
    "Voice (3) beside hearth (6): share, then tend the near circle. Expression with care.",
};

export type RhythmLayer = {
  id: RhythmLayerId;
  label: string;
  role: string;
  raw: string;
  digit: number;
  season: DigitSeason;
  nature?: string;
  insight: string;
};

export type YearRhythm = {
  layers: RhythmLayer[];
  yearMonth: string;
  sun: SunSignInfo | null;
  sunInfluence: string;
  summary: string;
  seasonal: string;
  practice: string;
};

function digitOf(raw: string | number | undefined | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return reduceToSingleDigit(n);
}

function yearMonthCopy(year: number, month: number): string {
  const hit = YEAR_MONTH[`${year}-${month}`];
  if (hit) return hit;
  const ys = DIGIT_SEASON[year];
  const ms = DIGIT_SEASON[month];
  if (year === month) {
    return `Year and month share ${year} (${ys.season}). The climate and the tempo currently rhyme — still weather, not a schedule.`;
  }
  return `The year’s ${ys.season.toLowerCase()} (${ys.keyword.toLowerCase()}) sits beside this month’s ${ms.season.toLowerCase()} (${ms.keyword.toLowerCase()}). Let the month set tempo; let the year set climate. Not a forecast.`;
}

function sunCopy(sign: SunSignInfo, yearDigit: number): string {
  const season = DIGIT_SEASON[yearDigit];
  const airOnWind =
    sign.element === "Air" && season.element === "Air"
      ? `${sign.name} can soften the edges of Year ${yearDigit} — harmony around change, rather than change for its own sake.`
      : sign.element === "Earth" && season.element === "Air"
        ? `${sign.name}’s earth can give Year ${yearDigit} a landing strip — movement with a place to return.`
        : sign.element === "Water"
          ? `${sign.name}’s water adds feeling to Year ${yearDigit}’s ${season.season.toLowerCase()} — notice the inner weather while the outer one shifts.`
          : `${sign.name} (${sign.element.toLowerCase()}) colors Year ${yearDigit}: ${sign.theme.toLowerCase()}.`;
  return `${airOnWind} Reflective tone only.`;
}

export function buildYearRhythm(opts: {
  personalYear: string;
  personalMonth: string;
  outlook?: string | null;
  yearNature?: string | null;
  yearTheme?: string | null;
  monthTheme?: string | null;
  monthAdvice?: string | null;
  sunSignId?: string | null;
}): YearRhythm {
  const yearDigit = digitOf(opts.personalYear) ?? 1;
  const monthDigit = digitOf(opts.personalMonth) ?? yearDigit;
  const outlookDigit = digitOf(opts.outlook ?? undefined);

  const yearSeason = DIGIT_SEASON[yearDigit];
  const monthSeason = DIGIT_SEASON[monthDigit];
  const outlookSeason = DIGIT_SEASON[outlookDigit ?? yearDigit];

  const layers: RhythmLayer[] = [
    {
      id: "year",
      label: "Personal Year",
      role: "Outer ring",
      raw: opts.personalYear,
      digit: yearDigit,
      season: yearSeason,
      nature: opts.yearNature ?? undefined,
      insight:
        opts.yearTheme ??
        PY_NATURE[yearDigit]?.typical ??
        `${yearSeason.season} — ${yearSeason.keyword.toLowerCase()} as this year’s climate.`,
    },
    {
      id: "outlook",
      label: "Year outlook",
      role: "Middle ring",
      raw: opts.outlook || String(yearDigit),
      digit: outlookDigit ?? yearDigit,
      season: outlookSeason,
      insight:
        outlookDigit != null && outlookDigit !== yearDigit
          ? `A second birthday-cycle mirror at ${opts.outlook} (${outlookSeason.season}). Same clock as Personal Year, different formula — two weathers, not a vote.`
          : `Outlook currently rhymes with Personal Year ${yearDigit} (${yearSeason.season}). Two methods, similar climate this cycle.`,
    },
    {
      id: "month",
      label: "Personal Month",
      role: "Inner ring",
      raw: opts.personalMonth,
      digit: monthDigit,
      season: monthSeason,
      insight:
        opts.monthTheme ??
        PY_NATURE[monthDigit]?.typical ??
        `${monthSeason.season} — this month’s pacing.`,
    },
  ];

  const sun =
    opts.sunSignId && isSunSignId(opts.sunSignId)
      ? SUN_SIGNS[opts.sunSignId]
      : null;

  const yearMonth = yearMonthCopy(yearDigit, monthDigit);
  const sunInfluence = sun
    ? sunCopy(sun, yearDigit)
    : "Sun sign is read from month and day only — add a complete date to place it in the center.";

  const summary = sun
    ? `A year of ${yearSeason.season.toLowerCase()}, shaped by a month of ${monthSeason.season.toLowerCase()}, expressed through ${sun.name}’s ${sun.element.toLowerCase()}.`
    : `A year of ${yearSeason.season.toLowerCase()}, shaped by a month of ${monthSeason.season.toLowerCase()}.`;

  const seasonal = `Year ${yearDigit} reads as ${yearSeason.season} (${yearSeason.visual}). Month ${monthDigit} reads as ${monthSeason.season} (${monthSeason.visual}).${
    sun ? ` ${sun.name} adds ${sun.element.toLowerCase()} symmetry at the center.` : ""
  }`;

  const practice =
    opts.monthAdvice ||
    PY_NATURE[monthDigit]?.practice ||
    "Pick one small pacing habit this month — weather, not a deadline.";

  return {
    layers,
    yearMonth,
    sun,
    sunInfluence,
    summary,
    seasonal,
    practice,
  };
}

export function yearRhythmPdfLines(rhythm: YearRhythm): string[] {
  return [
    `Annual rhythm — PY ${rhythm.layers[0].raw} · Outlook ${rhythm.layers[1].raw} · Month ${rhythm.layers[2].raw}${
      rhythm.sun ? ` · ${rhythm.sun.symbol} ${rhythm.sun.name}` : ""
    }.`,
    rhythm.summary,
    rhythm.yearMonth,
    rhythm.sunInfluence,
    `This month’s practice: ${rhythm.practice}`,
  ];
}
