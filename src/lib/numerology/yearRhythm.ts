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
  /** Everyday word for this digit's pace. Safe to show to a first-time reader. */
  phase: string;
  visual: string;
  glyph: string;
  stroke: string;
  fill: string;
  scan: string;
  /** One thing to watch while this digit runs the window. */
  watch: string;
};

export const DIGIT_SEASON: Record<number, DigitSeason> = {
  1: {
    season: "Spark season",
    element: "Fire",
    keyword: "Beginnings",
    verb: "BEGIN",
    phase: "starting",
    visual: "rising lines",
    glyph: "△",
    stroke: "rgba(217, 119, 6, 0.7)",
    fill: "#F59E0B",
    scan: "Start one small thing. Not ten openings.",
    watch: "Opening ten things and finishing none.",
  },
  2: {
    season: "Tide season",
    element: "Water",
    keyword: "Cooperation",
    verb: "RELATE",
    phase: "slow",
    visual: "soft waves",
    glyph: "☽",
    stroke: "rgba(100, 116, 139, 0.7)",
    fill: "#94A3B8",
    scan: "Go slow with people. Wait before you push.",
    watch: "Waiting so long that nothing gets decided.",
  },
  3: {
    season: "Voice season",
    element: "Air",
    keyword: "Expression",
    verb: "EXPRESS",
    phase: "sharing",
    visual: "open sky",
    glyph: "✧",
    stroke: "rgba(14, 116, 144, 0.65)",
    fill: "#7DD3FC",
    scan: "Finish and share one thing. Not ten drafts.",
    watch: "Talking about the work instead of doing it.",
  },
  4: {
    season: "Earth season",
    element: "Earth",
    keyword: "Structure",
    verb: "BUILD",
    phase: "planning",
    visual: "a quiet grid",
    glyph: "□",
    stroke: "rgba(120, 53, 15, 0.65)",
    fill: "#A8A29E",
    scan: "Write one repeating plan and keep it this week.",
    watch: "Planning so much that nothing actually starts.",
  },
  5: {
    season: "Wind season",
    element: "Air",
    keyword: "Movement",
    verb: "MOVE",
    phase: "changing",
    visual: "flowing lines",
    glyph: "⬠",
    stroke: "rgba(15, 118, 110, 0.7)",
    fill: "#2DD4BF",
    scan: "Try one small change. Do not rewrite the whole plan.",
    watch: "Changing again before the last change had time to work.",
  },
  6: {
    season: "Hearth season",
    element: "Earth",
    keyword: "Care",
    verb: "TEND",
    phase: "caring",
    visual: "warm enclosure",
    glyph: "♡",
    stroke: "rgba(190, 24, 93, 0.55)",
    fill: "#F9A8D4",
    scan: "Keep one promise to someone else. Set aside one hour that is only for you.",
    watch: "Saying yes until you have no rest left.",
  },
  7: {
    season: "Still-water season",
    element: "Water",
    keyword: "Insight",
    verb: "STUDY",
    phase: "quiet",
    visual: "deep quiet",
    glyph: "◇",
    stroke: "rgba(67, 56, 202, 0.6)",
    fill: "#818CF8",
    scan: "Take quiet time. Do not force a loud push.",
    watch: "Going so quiet that people cannot reach you.",
  },
  8: {
    season: "Summit season",
    element: "Earth",
    keyword: "Stewardship",
    verb: "STEWARD",
    phase: "finishing",
    visual: "long ridges",
    glyph: "⬡",
    stroke: "rgba(30, 58, 107, 0.7)",
    fill: "#1E3A5F",
    scan: "Finish one real result, then rest.",
    watch: "Working with no rest until the result runs you.",
  },
  9: {
    season: "Harvest season",
    element: "Fire",
    keyword: "Completion",
    verb: "HARVEST",
    phase: "closing",
    visual: "ember glow",
    glyph: "○",
    stroke: "rgba(185, 28, 28, 0.6)",
    fill: "#E07A5F",
    scan: "Close one loop before you open another.",
    watch: "Holding on to something that is already over.",
  },
};

/** Short user-facing cue for a Personal Year / Month digit. */
const SEASON_USER_CUE: Record<number, string> = {
  1: "Start, decide, open one thing",
  2: "Go slow with people and wait before you push",
  3: "Share and finish one idea",
  4: "Plan, structure, keep a routine",
  5: "Try one small change",
  6: "Care, maintain, support",
  7: "Learn, analyse, understand",
  8: "Finish one real result, then rest",
  9: "Close one loop before opening another",
};

export function seasonUserCue(n: number): string {
  return SEASON_USER_CUE[n] ?? DIGIT_SEASON[n]?.keyword ?? `Tone ${n}`;
}

export function yearMonthMixLine(yearN: number, monthN: number): string {
  if (yearN === monthN) {
    return "Your year and month share the same pace. This month is a good window to make the year's main move — still as one small practice.";
  }
  if (yearN === 7 && monthN === 6) {
    return "Learn deeply, then apply what you learn with care.";
  }
  const yearCue = seasonUserCue(yearN);
  const monthCue = seasonUserCue(monthN);
  if (!yearCue || !monthCue) return "";
  return `${yearCue}. Then ${monthCue.charAt(0).toLowerCase()}${monthCue.slice(1)}.`;
}

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
    "The year is about change and this month is about plans. Try one new thing inside one routine.",
  "4-5":
    "The year is about plans and this month is about change. Try one experiment without dropping the plan.",
  "1-4":
    "The year is about starting and this month is about plans. A new start holds better with one routine behind it.",
  "9-4":
    "The year is about closing things and this month is about plans. Sort and finish, rather than reopening old ones.",
  "5-5":
    "Change in the year and change in the month. Pick one change, so the rest does not scatter you.",
  "4-4":
    "Plans in the year and plans in the month. Rest counts as part of the plan.",
  "7-5":
    "The year is quiet and this month wants a little movement. Take turns: one quiet block, then one small outing.",
  "3-6":
    "The year is about sharing and this month is about care. Share something, then look after the people close to you.",
};

type ElementMix = {
  tension: string;
  opportunity: string;
  bestUse: string;
  watchFor: string;
};

const SAME_ELEMENT: Record<DigitElement, ElementMix> = {
  Air: {
    tension: "The year and this month both push you to move and talk.",
    opportunity: "Pick one thing to move on and it can go a long way this month.",
    bestUse: "Choose one change, or one thing to share, and finish that one.",
    watchFor: "Starting many things and finishing none.",
  },
  Earth: {
    tension: "The year and this month both ask for steady work.",
    opportunity: "Slow work still counts, as long as the load stays honest.",
    bestUse: "Keep one routine going, and count rest as part of the work.",
    watchFor: "Planning so much that nothing starts, or calling slow progress failure.",
  },
  Fire: {
    tension: "The year and this month both push you to act.",
    opportunity: "The push can finish one real thing — not two at once.",
    bestUse: "Put the energy into one start, or one ending, and see it through.",
    watchFor: "Pushing every door open or shut until you are worn out.",
  },
  Water: {
    tension: "The year and this month both turn inward.",
    opportunity: "A good time for one honest talk and for thinking things through, as long as you are not rushing a decision.",
    bestUse: "Keep one quiet block, and have one honest talk.",
    watchFor: "Going so quiet that nothing gets finished.",
  },
};

const CROSS_ELEMENT: Record<string, ElementMix> = {
  "Air-Earth": {
    tension: "The year wants movement; this month wants a plan.",
    opportunity: "Something you are trying out can turn into a routine this month.",
    bestUse: "Take one thing you are trying and write it down as a step you can repeat.",
    watchFor: "Getting restless because the plan feels slow.",
  },
  "Earth-Air": {
    tension: "The year wants steady building; this month wants variety.",
    opportunity: "One new thing can fit inside the plan without breaking it.",
    bestUse: "Try one small variation and keep the rest of the plan.",
    watchFor: "Dropping the whole plan because progress feels slow.",
  },
  "Fire-Earth": {
    tension: "The year pushes you to act; this month asks for a plan.",
    opportunity: "A new start holds better when one routine is already in place.",
    bestUse: "Start or finish one thing, then write down how you will keep it.",
    watchFor: "Starting many things and building none.",
  },
  "Earth-Fire": {
    tension: "The year is for steady work; this month pushes you to act.",
    opportunity: "The plan can carry one bold move.",
    bestUse: "Use the push to finish one practical piece of the plan.",
    watchFor: "Throwing out the plan for an exciting restart.",
  },
  "Water-Earth": {
    tension: "The year is slow and inward; this month wants a plan.",
    opportunity: "Feelings settle faster when there is a routine around them.",
    bestUse: "Give the slow year one simple routine to sit inside.",
    watchFor: "Waiting to feel ready before you set anything up.",
  },
  "Earth-Water": {
    tension: "The year is for building; this month is slower and more inward.",
    opportunity: "One check-in keeps the work from feeling empty.",
    bestUse: "Keep the routine, and say out loud what it is for.",
    watchFor: "Working past the point where you need rest.",
  },
  "Air-Fire": {
    tension: "The year wants movement; this month pushes you to act.",
    opportunity: "Change can stay calm if you keep one aim.",
    bestUse: "Pick one opening and let the others wait.",
    watchFor: "Excitement with nowhere to put it.",
  },
  "Fire-Air": {
    tension: "The year pushes you to act; this month wants movement and talk.",
    opportunity: "One start can go a long way if it stays one start.",
    bestUse: "Take that one start out into the world in a small way.",
    watchFor: "Talking one idea into ten directions.",
  },
  "Air-Water": {
    tension: "The year wants movement; this month asks you to feel first.",
    opportunity: "A short pause keeps a change from feeling empty.",
    bestUse: "Make the change, then stop once and notice how it feels.",
    watchFor: "Changing plans to avoid sitting with a feeling.",
  },
  "Water-Air": {
    tension: "The year is slow and inward; this month wants a little movement.",
    opportunity: "A small outing can refresh quiet work without scattering it.",
    bestUse: "Keep one quiet block, and make one small contact with someone.",
    watchFor: "Keeping busy so you do not have to sit still.",
  },
  "Fire-Water": {
    tension: "The year pushes you to act; this month is slower.",
    opportunity: "A big move stays kind if you say how you feel about it.",
    bestUse: "Do the decisive thing, then give yourself an hour to cool down.",
    watchFor: "Pushing through a bad mood until something breaks.",
  },
  "Water-Fire": {
    tension: "The year is slow; this month wants you to start something.",
    opportunity: "Notice first, then start one small thing.",
    bestUse: "Start one small thing this month, then wait and check it.",
    watchFor: "Thinking until the month is gone, or starting ten things.",
  },
};

export const WEATHER_PRINCIPLE =
  "These numbers set your pace for the year and the month. They do not predict events.";

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
  /** True when the second count for the year lands on the same digit. */
  outlookAgrees: boolean;
  sunVerb: string | null;
};

/** All clocks for the current window, said once, in everyday words. */
export type RhythmCombined = {
  headline: string;
  lines: string[];
  tryLine: string;
  watchLine: string;
};

export type YearRhythm = {
  layers: RhythmLayer[];
  /** Display label for the year — keeps 11/22/33 instead of the reduced digit. */
  yearLabel: string;
  /** Set only when the year is a master number that reduces to a different digit. */
  masterGloss: string | null;
  yearMonth: string;
  sun: SunSignInfo | null;
  sunInfluence: string;
  sunVerb: string | null;
  summary: string;
  seasonal: string;
  practice: string;
  mix: RhythmMix;
  combined: RhythmCombined;
  clock: RhythmClock;
  weatherPrinciple: string;
};

function digitOf(raw: string | number | undefined | null): number | null {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return reduceToSingleDigit(n);
}

const MASTERS = new Set([11, 22, 33]);

/**
 * Season tables are keyed 1–9, but a master year must still read as 11/22/33 in
 * copy. Lookups keep the reduced digit; every sentence uses this label.
 */
function labelOf(raw: string | number | undefined | null, digit: number): string {
  const n = Number(raw);
  if (Number.isFinite(n) && MASTERS.has(n)) return String(n);
  return String(digit);
}

function elementMix(year: number, month: number): ElementMix {
  const ye = DIGIT_SEASON[year].element;
  const me = DIGIT_SEASON[month].element;
  if (year === month || ye === me) return SAME_ELEMENT[ye];
  return (
    CROSS_ELEMENT[`${ye}-${me}`] ?? {
      tension: "The year and this month are asking for different things.",
      opportunity:
        "Use the month for the next few weeks and the year for the longer aim.",
      bestUse: "Do this month's job as one step toward the year's.",
      watchFor: "Reading either number as an event that has to happen.",
    }
  );
}

function yearMonthCopy(year: number, month: number): string {
  const hit = YEAR_MONTH_LINE[`${year}-${month}`];
  if (hit) return hit;
  const ys = DIGIT_SEASON[year];
  const ms = DIGIT_SEASON[month];
  if (year === month) {
    return `The year and this month are both ${ys.phase}. The same job applies at both sizes, so what you do this month counts twice — a good month to make the year's main move.`;
  }
  return `The year is the longer aim and the month is how to spend the next few weeks, so they can ask for different things. Do this month's job as one step toward the year's, and let the ${ms.phase} month sit inside the ${ys.phase} year.`;
}

export function sunVerbFor(sign: SunSignInfo): string {
  if (sign.element === "Earth" && sign.modality === "Mutable") return "REFINE";
  if (sign.modality === "Mutable") return "ADAPT";
  if (sign.modality === "Cardinal") return "INITIATE";
  return "STEADY";
}

function sunCopy(sign: SunSignInfo): string {
  return `${sign.name} comes from your birth month and day, not from a numerology number. It is only the calendar backdrop, so it does not change what the year or the month is asking for.`;
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

  const yearLabel = labelOf(opts.personalYear, yearDigit);
  const monthLabel = labelOf(opts.personalMonth, monthDigit);
  const outlookLabel = labelOf(
    opts.outlook ?? undefined,
    outlookDigit ?? yearDigit,
  );
  const masterGloss =
    yearLabel !== String(yearDigit)
      ? `Personal Year ${yearLabel} (works like a ${yearDigit}). Both readings are used below: the ${yearLabel} names the year, the ${yearDigit} sets its pacing.`
      : null;

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
      role: "This year",
      job: "The pace of the whole year, birthday to birthday",
      raw: opts.personalYear,
      digit: yearDigit,
      season: yearSeason,
      nature: opts.yearNature ?? undefined,
      insight:
        opts.yearTheme ??
        PY_NATURE[yearDigit]?.typical ??
        `A ${yearSeason.phase} year. ${yearSeason.scan}`,
      scan: yearSeason.scan,
    },
    {
      id: "outlook",
      label: "Year outlook",
      role: "Second count for this year",
      job: "The same year counted a different way",
      raw: opts.outlook || String(yearDigit),
      digit: outlookDigit ?? yearDigit,
      season: outlookSeason,
      insight:
        outlookDigit != null && outlookDigit !== yearDigit
          ? `A second way of numbering the same birthday-to-birthday window gives ${outlookLabel}. It disagrees with your Personal Year ${yearLabel} because the two formulas use different parts of the date. Neither cancels the other: run the Personal Year task across the calendar year and the ${outlookLabel} task from birthday to birthday.`
          : `The second formula for this window also gives ${outlookLabel}, matching your Personal Year. Both methods agree, so there is one pacing theme to follow rather than two.`,
      scan: outlookSeason.scan,
    },
    {
      id: "month",
      label: "Personal Month",
      role: "This month",
      job: "The pace of the next few weeks",
      raw: opts.personalMonth,
      digit: monthDigit,
      season: monthSeason,
      insight:
        opts.monthTheme ??
        PY_NATURE[monthDigit]?.typical ??
        `A ${monthSeason.phase} month. ${monthSeason.scan}`,
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
    ? sunCopy(sun)
    : "The star sign is read from birth month and day only. Add a full date of birth to show it.";

  const summary = `Year ${yearLabel}: ${yearSeason.scan} Month ${monthLabel}: ${monthSeason.scan}${
    sun ? ` ${sun.name} is calendar backdrop only — not a numerology number.` : ""
  }`;

  const seasonal = `Year ${yearLabel}: ${yearSeason.scan} Month ${monthLabel}: ${monthSeason.scan}${
    sun ? ` ${sun.name} is a calendar backdrop, not a numerology number.` : ""
  }`;

  const practice =
    opts.monthAdvice ||
    PY_NATURE[monthDigit]?.practice ||
    "Pick one small habit to run for the rest of this month. It sets your pace, not a deadline you can miss.";

  const outlookAgrees = outlookDigit == null || outlookDigit === yearDigit;
  const outlookNote = outlookAgrees
    ? "This second count agrees with the year above, so there is one job for the year, not two."
    : `This second count reads ${outlookLabel} where the year reads ${yearLabel}. Both count the same year, from different parts of your date. Run the year's job across the calendar year and this one from birthday to birthday.`;

  const mixLabel =
    yearDigit === monthDigit
      ? `A ${yearSeason.phase} year, and a ${monthSeason.phase} month too`
      : `A ${yearSeason.phase} year, a ${monthSeason.phase} month`;

  const mix: RhythmMix = {
    mixLabel,
    yearVerb: yearSeason.verb,
    monthVerb: monthSeason.verb,
    tension: mixTone.tension,
    opportunity: mixTone.opportunity,
    bestUse: mixTone.bestUse,
    watchFor: mixTone.watchFor,
    outlookNote,
    outlookAgrees,
    sunVerb,
  };

  const combined: RhythmCombined = {
    headline: mixLabel,
    lines: [
      ...(yearDigit === monthDigit
        ? [`The year and this month ask for the same thing: ${yearSeason.scan}`]
        : [
            `This year: ${yearSeason.scan}`,
            `This month: ${monthSeason.scan}`,
          ]),
      ...(outlookDigit != null && outlookDigit !== yearDigit
        ? [
            `A second way of counting the same year gives ${outlookLabel}: ${outlookSeason.scan} It does not cancel the year above — it is the same year counted from your birthday instead.`,
          ]
        : []),
      ...(sun
        ? [
            `${sun.name} is only the calendar backdrop from your birth month and day. It is not a numerology number.`,
          ]
        : []),
    ],
    tryLine: mixTone.bestUse,
    watchLine: mixTone.watchFor,
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
    combinedHeadline: combined.headline,
    combinedTry: combined.tryLine,
    combinedWatch: combined.watchLine,
    ...Object.fromEntries(
      combined.lines.map((line, i) => [`combinedLine${i}`, line]),
    ),
  })) {
    assertSafeCopy(text, `yearRhythm.${key}`);
  }

  return {
    layers,
    yearLabel,
    masterGloss,
    yearMonth,
    sun,
    sunInfluence,
    sunVerb,
    summary,
    seasonal,
    practice,
    mix,
    combined,
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
    `Right now — ${rhythm.combined.headline}. Year ${year.raw}, month ${month.raw}, second year count ${outlook.raw}.`,
    ...rhythm.combined.lines,
    `Try: ${rhythm.combined.tryLine}`,
    `Watch: ${rhythm.combined.watchLine}`,
    `The year clock ${rhythm.clock.fromBirthday ? "starts at your birthday" : "starts in January"} (${start.label}); you are in ${now.label}.`,
    rhythm.yearMonth,
    `${rhythm.mix.tension} ${rhythm.mix.opportunity}`,
    ...(rhythm.mix.outlookAgrees ? [rhythm.mix.outlookNote] : []),
    rhythm.sunInfluence,
    `This month’s practice: ${rhythm.practice}`,
    rhythm.weatherPrinciple,
  ];
}
