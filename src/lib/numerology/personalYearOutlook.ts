/**
 * Personal Year nature + how the year may land (not Amazing/Good from PY alone).
 */

import { calculateChaldean } from "./chaldean";
import { pairTone, type CompatTone } from "./compatibility";
import {
  formatCycleRange,
  personalYearBreakdown,
  personalYearCycleAt,
  personalYearCycleStarting,
  type PersonalYearCycle,
} from "./cycles";
import { vedicDestinyFromDob, vedicPsychicFromDob, reduceToSingleDigit } from "./dateNumbers";
import {
  karmicDebtsFromDob,
  karmicEasierYears,
  karmicHeavierYears,
  type KarmicDebt,
} from "./karmicDebt";
import { pinnacleAtDate, pinnacleTheme, type Pinnacle } from "./pinnacles";
import { parseDob } from "./reduce";
import { assertSafeCopy } from "./safety";
import { vedicPairTone } from "./vedicCompatibility";

export type PyNature =
  | "Transformational"
  | "Supportive"
  | "Expressive"
  | "Demanding"
  | "Dynamic"
  | "Responsibility-heavy"
  | "Introspective"
  | "Achievement-oriented"
  | "Endings and transitions";

export type LandBand = "lighter" | "mixed" | "heavier";

export type WesternYearAnchor = "birthday" | "calendar";

export type PyNatureMeta = {
  nature: PyNature;
  short: string;
  typical: string;
  later: string | null;
  practice: string;
  /** Internal ease 0–1 for land scoring only — not a public rating. */
  ease: number;
};

export const PY_NATURE: Record<number, PyNatureMeta> = {
  1: {
    nature: "Transformational",
    short: "Often difficult at first, beneficial later — a reset, not a trophy year.",
    typical:
      "New direction after old structures loosen. The start can feel like disruption; the gift is a cleaner beginning.",
    later: "In-the-moment strain can still be a useful launch for the next nine-year cycle.",
    practice: "Start one real chapter. Do not force ten openings while the old one is still closing.",
    ease: 0.38,
  },
  2: {
    nature: "Supportive",
    short: "Cooperative, patient progress — teamwork over solo force.",
    typical:
      "Partnerships, diplomacy, and slower visible results. Patience is the skill.",
    later: null,
    practice: "Measure progress in relationships and prep work, not only headlines.",
    ease: 0.7,
  },
  3: {
    nature: "Expressive",
    short: "Creativity, visibility, and social exchange.",
    typical:
      "Speaking, making, and networking tend to fit. Scatter is the watch-out.",
    later: null,
    practice: "Publish or share one small thing rather than ten drafts.",
    ease: 0.72,
  },
  4: {
    nature: "Demanding",
    short: "Hard work, foundations, and pressure — slow but often productive.",
    typical:
      "Systems, discipline, and building that does not look glamorous yet.",
    later: null,
    practice: "Fix one piece of infrastructure (sleep, budget, tools) and keep it.",
    ease: 0.32,
  },
  5: {
    nature: "Dynamic",
    short: "Change and freedom — exciting, sometimes unstable.",
    typical:
      "Movement, experiments, and less tolerance for staying stuck. Pace the pivots.",
    later: null,
    practice: "Choose one conscious change instead of scattering into five.",
    ease: 0.55,
  },
  6: {
    nature: "Responsibility-heavy",
    short: "Duty, family, and leadership burdens — rarely a year of freedom.",
    typical:
      "Care, obligations, and showing up for others. Responsibility can feel like stress even when it is meaningful.",
    later: "The load is the theme; rest and boundaries keep it from becoming burnout.",
    practice: "Balance yeses with a protected rest day.",
    ease: 0.36,
  },
  7: {
    nature: "Introspective",
    short: "Study, reflection, and slower outer progress — inward growth, not a ‘bad’ year.",
    typical:
      "Learning, reassessment, and quieter social appetite. Forcing loud expansion often backfires.",
    later: null,
    practice: "Protect deep-work blocks; do not treat solitude as failure.",
    ease: 0.3,
  },
  8: {
    nature: "Achievement-oriented",
    short: "Material focus and authority — success possible, pressure included.",
    typical:
      "Work, recognition, and stewardship themes. Recovery is part of the plan.",
    later: null,
    practice: "Build one durable result and schedule recovery beside it.",
    ease: 0.62,
  },
  9: {
    nature: "Endings and transitions",
    short: "Completion and release — often challenging while it is happening.",
    typical:
      "Closing cycles, letting go, and emotional housekeeping before the next 1 year.",
    later: "Endings can be useful even when they do not feel ‘good’ in the moment.",
    practice: "Finish or release one loop cleanly; do not stockpile unfinished endings.",
    ease: 0.34,
  },
};

for (const [k, meta] of Object.entries(PY_NATURE)) {
  assertSafeCopy(meta.short, `pyNature:${k}:short`);
  assertSafeCopy(meta.typical, `pyNature:${k}:typical`);
  assertSafeCopy(meta.practice, `pyNature:${k}:practice`);
  if (meta.later) assertSafeCopy(meta.later, `pyNature:${k}:later`);
}

export function pyNatureMeta(n: number): PyNatureMeta {
  const d = reduceToSingleDigit(n);
  return PY_NATURE[d] ?? PY_NATURE[1];
}

const TONE_EASE: Record<CompatTone, number> = {
  Amazing: 0.85,
  Favourable: 0.7,
  Neutral: 0.5,
  Challenging: 0.28,
};

export type YearLandResult = {
  band: LandBand;
  score: number;
  mulankTone: CompatTone;
  bhagyankTone: CompatTone;
  nameTone: CompatTone | null;
  momentNote: string | null;
  resonanceLine: string;
};

function landBand(score: number): LandBand {
  if (score >= 0.58) return "lighter";
  if (score >= 0.45) return "mixed";
  return "heavier";
}

export function yearLandScore(opts: {
  personalYear: number;
  dob: string;
  fullName?: string;
  asOf?: Date;
}): YearLandResult {
  const py = reduceToSingleDigit(opts.personalYear);
  const nature = pyNatureMeta(py);
  const mulank = vedicPsychicFromDob(opts.dob);
  const bhagyank = vedicDestinyFromDob(opts.dob);
  const mulankTone = vedicPairTone(mulank, py);
  const bhagyankTone = vedicPairTone(bhagyank, py);
  let nameTone: CompatTone | null = null;
  const name = opts.fullName?.trim();
  if (name) {
    const ch = calculateChaldean(name);
    nameTone = pairTone(ch.nameNumber, py);
  }

  const wPy = 0.4;
  const wMu = 0.25;
  const wBh = 0.25;
  const wNa = nameTone ? 0.1 : 0;
  const denom = wPy + wMu + wBh + wNa;
  let score =
    (nature.ease * wPy +
      TONE_EASE[mulankTone] * wMu +
      TONE_EASE[bhagyankTone] * wBh +
      (nameTone ? TONE_EASE[nameTone] * wNa : 0)) /
    denom;

  const debts = karmicDebtsFromDob(opts.dob);
  const heavier = karmicHeavierYears(debts);
  const easier = karmicEasierYears(debts);
  if (heavier.includes(py)) score -= 0.12;
  else if (easier.includes(py)) score += 0.06;

  const pin = pinnacleAtDate(opts.dob, opts.asOf ?? new Date());
  const pinN = reduceToSingleDigit(pin.number);
  if (pinN === 5 && (py === 6 || py === 4 || py === 9)) score -= 0.08;
  else if (pinN === py) score += 0.04;
  else if (pinN === 9 && py === 1) score -= 0.05;

  score = Math.min(1, Math.max(0, score));

  const resonanceBits = [
    `Mulank ${mulank} × PY ${py}: ${mulankTone}`,
    `Bhagyank ${bhagyank} × PY ${py}: ${bhagyankTone}`,
  ];
  if (nameTone) resonanceBits.push(`Chaldean name × PY: ${nameTone}`);

  return {
    band: landBand(score),
    score,
    mulankTone,
    bhagyankTone,
    nameTone,
    momentNote: nature.later,
    resonanceLine: resonanceBits.join(" · "),
  };
}

export type WesternYearOutlook = {
  anchor: WesternYearAnchor;
  number: number;
  compound: number;
  calendarYearUsed: number;
  rangeLabel: string | null;
  nature: PyNatureMeta;
  land: YearLandResult;
  pinnacle: Pinnacle;
  pinnacleCopy: ReturnType<typeof pinnacleTheme>;
  debts: KarmicDebt[];
  mulank: number;
  bhagyank: number;
  calcLines: string[];
};

export function westernYearOutlook(opts: {
  dob: string;
  fullName?: string;
  anchor: WesternYearAnchor;
  /** Calendar year (calendar mode) or cycle-start year (birthday mode). */
  year: number;
  asOf?: Date;
}): WesternYearOutlook {
  const { dob, fullName, anchor, year } = opts;
  let cycle: PersonalYearCycle | null = null;
  let number: number;
  let compound: number;
  let calendarYearUsed: number;
  let rangeLabel: string | null = null;
  let calcLines: string[];

  if (anchor === "birthday") {
    cycle = personalYearCycleStarting(dob, year);
    number = cycle.number;
    compound = cycle.compound;
    calendarYearUsed = cycle.calendarYearUsed;
    rangeLabel = formatCycleRange(cycle);
    const { month, day } = parseDob(dob);
    calcLines = [
      `Birthday cycle ${rangeLabel}.`,
      `Month ${month} + day ${day} + ${calendarYearUsed} = ${compound} → ${number} (activates on the birthday in ${calendarYearUsed}).`,
    ];
  } else {
    const bd = personalYearBreakdown(dob, year);
    number = bd.number;
    compound = bd.compound;
    calendarYearUsed = year;
    calcLines = [
      `Calendar year ${year} (1 Jan – 31 Dec).`,
      `Month ${bd.month} + day ${bd.day} + ${year} = ${compound} → ${number}.`,
    ];
  }

  const asOf =
    opts.asOf ??
    (anchor === "birthday" && cycle
      ? cycle.rangeStart
      : new Date(year, 6, 1, 12, 0, 0));
  const nature = pyNatureMeta(number);
  const land = yearLandScore({
    personalYear: number,
    dob,
    fullName,
    asOf,
  });
  const pinnacle = pinnacleAtDate(dob, asOf);
  const debts = karmicDebtsFromDob(dob);

  return {
    anchor,
    number,
    compound,
    calendarYearUsed,
    rangeLabel,
    nature,
    land,
    pinnacle,
    pinnacleCopy: pinnacleTheme(pinnacle.number),
    debts,
    mulank: vedicPsychicFromDob(dob),
    bhagyank: vedicDestinyFromDob(dob),
    calcLines,
  };
}

export function currentWesternOutlook(
  dob: string,
  fullName?: string,
  asOf = new Date(),
): WesternYearOutlook {
  const cycle = personalYearCycleAt(dob, asOf);
  return westernYearOutlook({
    dob,
    fullName,
    anchor: "birthday",
    year: cycle.calendarYearUsed,
    asOf,
  });
}

export const LAND_LABEL: Record<LandBand, string> = {
  lighter: "May land lighter",
  mixed: "Mixed in-the-moment feel",
  heavier: "May land heavier",
};

export const WESTERN_BIRTHDAY_NOTE =
  "Birthday cycle (default): this calendar year’s Personal Year activates on your birthday and runs until the day before the next birthday. It is a pacing theme, not a forecast of events.";

export const WESTERN_CALENDAR_NOTE =
  "Calendar year: Personal Year is calculated from 1 January to 31 December of the chosen year. Same formula, different start date — not mixed with the birthday cycle.";
