/**
 * Annual rhythm — Personal Year climate, Year Outlook mirror, Personal Month
 * weather, and sun-sign backdrop. Weather language only: not events or health.
 */

import { SUN_SIGNS, isSunSignId, type SunSignInfo } from "@/lib/astrology/sunSign";
import { reduceToSingleDigit } from "./dateNumbers";
import { PY_NATURE } from "./personalYearOutlook";
import { parseDob } from "./reduce";
import { assertSafeCopy } from "./safety";

export type RhythmLayerId = "year" | "outlook" | "month";
export type DigitElement = "Fire" | "Earth" | "Air" | "Water";

export type DigitSeason = {
  season: string;
  element: DigitElement;
  keyword: string;
  verb: string;
  visual: string;
  glyph: string;
  stroke: string;
  fill: string;
  scan: string;
};

export const DIGIT_SEASON: Record<number, DigitSeason> = {
  1: {
    season: "Spark season",
    element: "Fire",
    keyword: "Beginnings",
    verb: "BEGIN",
    visual: "rising lines",
    glyph: "△",
    stroke: "rgba(217, 119, 6, 0.7)",
    fill: "#F59E0B",
    scan: "One clear start may serve better than ten openings.",
  },
  2: {
    season: "Tide season",
    element: "Water",
    keyword: "Cooperation",
    verb: "RELATE",
    visual: "soft waves",
    glyph: "☽",
    stroke: "rgba(100, 116, 139, 0.7)",
    fill: "#94A3B8",
    scan: "Patience and partnership may set a slower, useful tempo.",
  },
  3: {
    season: "Voice season",
    element: "Air",
    keyword: "Expression",
    verb: "EXPRESS",
    visual: "open sky",
    glyph: "✧",
    stroke: "rgba(14, 116, 144, 0.65)",
    fill: "#7DD3FC",
    scan: "Sharing one finished thing may beat ten drafts.",
  },
  4: {
    season: "Earth season",
    element: "Earth",
    keyword: "Structure",
    verb: "BUILD",
    visual: "a quiet grid",
    glyph: "□",
    stroke: "rgba(120, 53, 15, 0.65)",
    fill: "#A8A29E",
    scan: "Practical structure and routine may be the useful tempo.",
  },
  5: {
    season: "Wind season",
    element: "Air",
    keyword: "Movement",
    verb: "MOVE",
    visual: "flowing lines",
    glyph: "⬠",
    stroke: "rgba(15, 118, 110, 0.7)",
    fill: "#2DD4BF",
    scan: "Exploration may fit better than rigid plans.",
  },
  6: {
    season: "Hearth season",
    element: "Earth",
    keyword: "Care",
    verb: "TEND",
    visual: "warm enclosure",
    glyph: "♡",
    stroke: "rgba(190, 24, 93, 0.55)",
    fill: "#F9A8D4",
    scan: "Care and duty may ask for a protected rest beside the yeses.",
  },
  7: {
    season: "Still-water season",
    element: "Water",
    keyword: "Insight",
    verb: "STUDY",
    visual: "deep quiet",
    glyph: "◇",
    stroke: "rgba(67, 56, 202, 0.6)",
    fill: "#818CF8",
    scan: "Quiet study may serve better than forcing loud expansion.",
  },
  8: {
    season: "Summit season",
    element: "Earth",
    keyword: "Stewardship",
    verb: "STEWARD",
    visual: "long ridges",
    glyph: "⬡",
    stroke: "rgba(30, 58, 107, 0.7)",
    fill: "#1E3A5F",
    scan: "One durable result plus recovery may be the honest load.",
  },
  9: {
    season: "Harvest season",
    element: "Fire",
    keyword: "Completion",
    verb: "HARVEST",
    visual: "ember glow",
    glyph: "○",
    stroke: "rgba(185, 28, 28, 0.6)",
    fill: "#E07A5F",
    scan: "Closing and consolidating may be the climate of this window.",
  },
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Signature pair lines — element table covers the rest. */
const YEAR_MONTH_LINE: Record<string, string> = {
  "5-4":
    "A wind-year (5) meets an earth-month (4). Movement may want a frame — exploration with one boundary.",
  "4-5":
    "An earth-year (4) meets a wind-month (5). The long build may get a breath of variety — one experiment inside the structure.",
  "1-4":
    "A spark-year (1) meets an earth-month (4). New chapters may land better when one foundation is tended this month.",
  "9-4":
    "A harvest-year (9) meets an earth-month (4). Completing may want a shelf to sit on — sort and close, rather than reopen ten doors.",
  "5-5":
    "Wind on wind — year and month both lean toward movement. One chosen change may keep the breeze from scattering.",
  "4-4":
    "Earth on earth — year and month both lean toward building. Rest may still be part of the scaffold.",
  "7-5":
    "Still water (7) beside wind (5): inner study with a little outer motion. Quiet and a small outing may take turns.",
  "3-6":
    "Voice (3) beside hearth (6): share, then tend the near circle. Expression with care.",
};

type ElementMix = {
  tension: string;
  opportunity: string;
  bestUse: string;
  watchFor: string;
};

const SAME_ELEMENT: Record<DigitElement, ElementMix> = {
  Air: {
    tension: "Climate and tempo both move.",
    opportunity: "One chosen change may keep the breeze from scattering.",
    bestUse: "Repeat one experiment until it becomes a small habit.",
    watchFor: "Starting many threads and finishing none.",
  },
  Earth: {
    tension: "Climate and tempo both ask for building.",
    opportunity: "A slower pace may still be productive if the load stays honest.",
    bestUse: "Keep one foundation steady; rest is part of the scaffold.",
    watchFor: "Over-planning or treating slow progress as failure.",
  },
  Fire: {
    tension: "Climate and tempo both run hot.",
    opportunity: "Heat may serve one real start or one real close — not both at once.",
    bestUse: "Channel the spark into one finished gesture.",
    watchFor: "Burnout from forcing every door open or shut.",
  },
  Water: {
    tension: "Climate and tempo both turn inward.",
    opportunity: "Feeling and pacing may rhyme if you do not rush the tide.",
    bestUse: "Protect one quiet block and one honest conversation.",
    watchFor: "Withdrawing so far that nothing can complete.",
  },
};

const CROSS_ELEMENT: Record<string, ElementMix> = {
  "Air-Earth": {
    tension: "Movement may want a frame.",
    opportunity: "Exploration can become something repeatable this month.",
    bestUse: "Turn one experiment into a small system.",
    watchFor: "Restlessness when the frame feels slow.",
  },
  "Earth-Air": {
    tension: "The long build may want a breath of variety.",
    opportunity: "One experiment can sit inside the structure without dismantling it.",
    bestUse: "Try one variation while keeping the scaffold.",
    watchFor: "Abandoning the build because progress feels slow.",
  },
  "Fire-Earth": {
    tension: "Spark may want a hearth.",
    opportunity: "A new chapter may land better on one tended foundation.",
    bestUse: "Start or close one thing, then give it a shelf.",
    watchFor: "Lighting ten fires and building none.",
  },
  "Earth-Fire": {
    tension: "Structure may meet a push to begin or finish.",
    opportunity: "The scaffold can host one decisive move.",
    bestUse: "Use the heat to complete one practical piece.",
    watchFor: "Scattering the build for a dramatic restart.",
  },
  "Water-Earth": {
    tension: "The tide may want a shore.",
    opportunity: "Feeling can settle into a routine that holds it.",
    bestUse: "Give inner weather one practical container.",
    watchFor: "Waiting for perfect mood before any structure.",
  },
  "Earth-Water": {
    tension: "The scaffold may want more feeling in it.",
    opportunity: "A check-in can keep the build from going dry.",
    bestUse: "Keep the system, and name what it is for.",
    watchFor: "Grinding past the point of honest rest.",
  },
  "Air-Fire": {
    tension: "Motion and spark may amplify each other.",
    opportunity: "Change can stay kind if one aim stays chosen.",
    bestUse: "Pick one opening and let the rest wait.",
    watchFor: "Excitement without a place to land.",
  },
  "Fire-Air": {
    tension: "Spark may want more room to move.",
    opportunity: "A beginning can travel if it stays one beginning.",
    bestUse: "Take the start on a short, honest outing.",
    watchFor: "Talking the spark into ten directions.",
  },
  "Air-Water": {
    tension: "Movement may meet a need to feel first.",
    opportunity: "A small pause can keep change from going hollow.",
    bestUse: "Move, then notice the inner weather once.",
    watchFor: "Pivoting to avoid sitting with a feeling.",
  },
  "Water-Air": {
    tension: "Inward weather may want a little outer motion.",
    opportunity: "A short outing can refresh study without scattering it.",
    bestUse: "Alternate a quiet block with one small contact.",
    watchFor: "Using busyness to skip the inner work.",
  },
  "Fire-Water": {
    tension: "Heat may meet a slower emotional tide.",
    opportunity: "A start or close can stay human if feeling is named.",
    bestUse: "Do the decisive thing, then give it a cooling hour.",
    watchFor: "Pushing through mood until something snaps.",
  },
  "Water-Fire": {
    tension: "The inner tide may meet a call to act.",
    opportunity: "Feeling can become one clear gesture.",
    bestUse: "Let insight choose one start or one release.",
    watchFor: "Staying in reflection until the window passes.",
  },
};

export const WEATHER_PRINCIPLE =
  "These cycles describe the quality of the period — weather for pacing, not events written in advance.";

export type RhythmLayer = {
  id: RhythmLayerId;
  label: string;
  role: string;
  job: string;
  raw: string;
  digit: number;
  season: DigitSeason;
  nature?: string;
  insight: string;
  scan: string;
};

export type RhythmClockSector = {
  index: number;
  month: number;
  label: string;
  isStart: boolean;
  isNow: boolean;
  startDeg: number;
  endDeg: number;
};

export type RhythmClock = {
  startMonth: number;
  nowMonth: number;
  nowIndex: number;
  fromBirthday: boolean;
  sectors: RhythmClockSector[];
};

export type RhythmMix = {
  mixLabel: string;
  yearVerb: string;
  monthVerb: string;
  tension: string;
  opportunity: string;
  bestUse: string;
  watchFor: string;
  outlookNote: string;
  sunVerb: string | null;
};

export type YearRhythm = {
  layers: RhythmLayer[];
  yearMonth: string;
  sun: SunSignInfo | null;
  sunInfluence: string;
  sunVerb: string | null;
  summary: string;
  seasonal: string;
  practice: string;
  mix: RhythmMix;
  clock: RhythmClock;
  weatherPrinciple: string;
};

function digitOf(raw: string | number | undefined | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return reduceToSingleDigit(n);
}

function elementMix(year: number, month: number): ElementMix {
  const ye = DIGIT_SEASON[year].element;
  const me = DIGIT_SEASON[month].element;
  if (year === month || ye === me) return SAME_ELEMENT[ye];
  return (
    CROSS_ELEMENT[`${ye}-${me}`] ?? {
      tension: "Climate and tempo currently differ.",
      opportunity: "Let the month set tempo; let the year set climate.",
      bestUse: "Hold both as weather, and pick one small pacing habit.",
      watchFor: "Treating either number as a forecast of events.",
    }
  );
}

function yearMonthCopy(year: number, month: number): string {
  const hit = YEAR_MONTH_LINE[`${year}-${month}`];
  if (hit) return hit;
  const ys = DIGIT_SEASON[year];
  const ms = DIGIT_SEASON[month];
  if (year === month) {
    return `Year and month share ${year} (${ys.season}). The climate and the tempo currently rhyme.`;
  }
  return `The year’s ${ys.season.toLowerCase()} (${ys.keyword.toLowerCase()}) sits beside this month’s ${ms.season.toLowerCase()} (${ms.keyword.toLowerCase()}). Let the month set tempo; let the year set climate.`;
}

export function sunVerbFor(sign: SunSignInfo): string {
  if (sign.element === "Earth" && sign.modality === "Mutable") return "REFINE";
  if (sign.modality === "Mutable") return "ADAPT";
  if (sign.modality === "Cardinal") return "INITIATE";
  return "STEADY";
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

export function buildRhythmClock(opts: {
  cycleStartMonth?: number | null;
  asOf?: Date;
}): RhythmClock {
  const asOf = opts.asOf ?? new Date();
  const nowMonth = asOf.getMonth() + 1;
  const fromBirthday =
    typeof opts.cycleStartMonth === "number" &&
    opts.cycleStartMonth >= 1 &&
    opts.cycleStartMonth <= 12;
  const startMonth = fromBirthday ? opts.cycleStartMonth! : 1;
  const sectors: RhythmClockSector[] = Array.from({ length: 12 }, (_, index) => {
    const month = ((startMonth - 1 + index) % 12) + 1;
    return {
      index,
      month,
      label: MONTH_LABELS[month - 1]!,
      isStart: index === 0,
      isNow: month === nowMonth,
      startDeg: index * 30,
      endDeg: (index + 1) * 30,
    };
  });
  const nowIndex = sectors.findIndex((s) => s.isNow);
  return {
    startMonth,
    nowMonth,
    nowIndex: nowIndex < 0 ? 0 : nowIndex,
    fromBirthday,
    sectors,
  };
}

function cycleStartMonthFromDob(dob?: string | null): number | null {
  if (!dob) return null;
  try {
    return parseDob(dob).month;
  } catch {
    return null;
  }
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
  dateOfBirth?: string | null;
  asOf?: Date;
}): YearRhythm {
  const yearDigit = digitOf(opts.personalYear) ?? 1;
  const monthDigit = digitOf(opts.personalMonth) ?? yearDigit;
  const outlookDigit = digitOf(opts.outlook ?? undefined);

  const yearSeason = DIGIT_SEASON[yearDigit];
  const monthSeason = DIGIT_SEASON[monthDigit];
  const outlookSeason = DIGIT_SEASON[outlookDigit ?? yearDigit];
  const mixTone = elementMix(yearDigit, monthDigit);
  const clock = buildRhythmClock({
    cycleStartMonth: cycleStartMonthFromDob(opts.dateOfBirth),
    asOf: opts.asOf,
  });

  const layers: RhythmLayer[] = [
    {
      id: "year",
      label: "Personal Year",
      role: "Climate",
      job: "Overall rhythm of this birthday-to-birthday window",
      raw: opts.personalYear,
      digit: yearDigit,
      season: yearSeason,
      nature: opts.yearNature ?? undefined,
      insight:
        opts.yearTheme ??
        PY_NATURE[yearDigit]?.typical ??
        `${yearSeason.season} — ${yearSeason.keyword.toLowerCase()} as this year’s climate.`,
      scan: yearSeason.scan,
    },
    {
      id: "outlook",
      label: "Year outlook",
      role: "Mirror",
      job: "Second climate for the same window (different formula)",
      raw: opts.outlook || String(yearDigit),
      digit: outlookDigit ?? yearDigit,
      season: outlookSeason,
      insight:
        outlookDigit != null && outlookDigit !== yearDigit
          ? `A second birthday-cycle mirror at ${opts.outlook} (${outlookSeason.season}). Same clock as Personal Year, different formula — two weathers, not a vote.`
          : `Outlook currently rhymes with Personal Year ${yearDigit} (${yearSeason.season}). Two methods, similar climate this cycle.`,
      scan: outlookSeason.scan,
    },
    {
      id: "month",
      label: "Personal Month",
      role: "Weather",
      job: "This calendar month’s pacing",
      raw: opts.personalMonth,
      digit: monthDigit,
      season: monthSeason,
      insight:
        opts.monthTheme ??
        PY_NATURE[monthDigit]?.typical ??
        `${monthSeason.season} — this month’s pacing.`,
      scan: monthSeason.scan,
    },
  ];

  const sun =
    opts.sunSignId && isSunSignId(opts.sunSignId)
      ? SUN_SIGNS[opts.sunSignId]
      : null;
  const sunVerb = sun ? sunVerbFor(sun) : null;

  const yearMonth = yearMonthCopy(yearDigit, monthDigit);
  const sunInfluence = sun
    ? sunCopy(sun, yearDigit)
    : "Sun sign is read from month and day only — add a complete date to place the astro season.";

  const summary = sun
    ? `A year of ${yearSeason.season.toLowerCase()}, shaped by a month of ${monthSeason.season.toLowerCase()}, expressed through ${sun.name}’s ${sun.element.toLowerCase()}.`
    : `A year of ${yearSeason.season.toLowerCase()}, shaped by a month of ${monthSeason.season.toLowerCase()}.`;

  const seasonal = `Year ${yearDigit} reads as ${yearSeason.season} (${yearSeason.visual}). Month ${monthDigit} reads as ${monthSeason.season} (${monthSeason.visual}).${
    sun ? ` ${sun.name} adds ${sun.element.toLowerCase()} symmetry as backdrop.` : ""
  }`;

  const practice =
    opts.monthAdvice ||
    PY_NATURE[monthDigit]?.practice ||
    "Pick one small pacing habit this month — weather, not a deadline.";

  const outlookNote =
    outlookDigit != null && outlookDigit !== yearDigit
      ? `Outlook ${opts.outlook} (${outlookSeason.verb}) colors the same window as a second climate — two weathers, not a vote.`
      : `Outlook currently rhymes with Year ${yearDigit} (${yearSeason.verb}).`;

  const mix: RhythmMix = {
    mixLabel: `${yearSeason.verb} → ${monthSeason.verb}`,
    yearVerb: yearSeason.verb,
    monthVerb: monthSeason.verb,
    tension: mixTone.tension,
    opportunity: mixTone.opportunity,
    bestUse: mixTone.bestUse,
    watchFor: mixTone.watchFor,
    outlookNote,
    sunVerb,
  };

  for (const [key, text] of Object.entries({
    yearMonth,
    tension: mix.tension,
    opportunity: mix.opportunity,
    bestUse: mix.bestUse,
    watchFor: mix.watchFor,
    outlookNote,
    summary,
    practice,
  })) {
    assertSafeCopy(text, `yearRhythm.${key}`);
  }

  return {
    layers,
    yearMonth,
    sun,
    sunInfluence,
    sunVerb,
    summary,
    seasonal,
    practice,
    mix,
    clock,
    weatherPrinciple: WEATHER_PRINCIPLE,
  };
}

export function yearRhythmPdfLines(rhythm: YearRhythm): string[] {
  const year = rhythm.layers[0]!;
  const outlook = rhythm.layers[1]!;
  const month = rhythm.layers[2]!;
  const now = rhythm.clock.sectors[rhythm.clock.nowIndex]!;
  const start = rhythm.clock.sectors[0]!;
  return [
    `Annual rhythm — climate PY ${year.raw} ${year.season.verb} · weather Month ${month.raw} ${month.season.verb} · outlook ${outlook.raw} ${outlook.season.verb}${
      rhythm.sun ? ` · astro ${rhythm.sun.symbol} ${rhythm.sun.name} ${rhythm.sunVerb}` : ""
    }.`,
    `Clock: cycle ${rhythm.clock.fromBirthday ? "from birthday" : "calendar"} starting ${start.label} · now ${now.label}.`,
    `Current rhythm ${rhythm.mix.mixLabel}. ${rhythm.mix.tension} ${rhythm.mix.opportunity}`,
    rhythm.yearMonth,
    rhythm.mix.outlookNote,
    `Best use: ${rhythm.mix.bestUse}`,
    `Watch for: ${rhythm.mix.watchFor}`,
    rhythm.sunInfluence,
    `This month’s practice: ${rhythm.practice}`,
    rhythm.weatherPrinciple,
  ];
}
