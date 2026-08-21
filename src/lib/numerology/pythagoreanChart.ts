/**
 * Pythagorean chart extras: Challenges, Period Cycles, Balance,
 * Hidden Passion, name-letter Karmic Lessons, Planes of Expression,
 * Attitude, Subconscious Self, Personal Day, and Essence transits.
 *
 * Birth-certificate spelling is the chart of record for name seats.
 * Personal Day and Essence are as-of the viewing date.
 * Name-letter planes are not Lo Shu date-grid planes.
 */

import { personalMonth, personalYearCycleAt } from "./cycles";
import { reduceToSingleDigit } from "./dateNumbers";
import { PYTHAGOREAN } from "./mappings";
import { CORE_TRAIT, coreTraitFor, yearMonthMeaning } from "./meanings";
import { pinnacleAtAge, pinnaclesForDob } from "./pinnacles";
import {
  calculateAge,
  lettersOnly,
  parseDob,
  reduceNumber,
} from "./reduce";
import { assertSafeCopy, assertSafeList } from "./safety";
import type { NumerologyReport } from "./types";

export const NAME_PLANE_LETTERS = {
  physical: "DEMW",
  mental: "AGHJLP",
  emotional: "BINORSTXZ",
  intuitive: "CFKQUVY",
} as const;

export type NamePlaneId = keyof typeof NAME_PLANE_LETTERS;

export type ChartChallenge = {
  id: 1 | 2 | 3 | 4;
  number: number;
  ageStart: number;
  ageEnd: number | null;
  isCurrent: boolean;
  title: string;
  practice: string;
};

export type PeriodCycle = {
  id: 1 | 2 | 3;
  label: "Formative" | "Productive" | "Harvest";
  number: number;
  source: "month" | "day" | "year";
  ageStart: number;
  ageEnd: number | null;
  isCurrent: boolean;
  title: string;
  practice: string;
};

export type NamePlane = {
  id: NamePlaneId;
  label: string;
  compound: number;
  reduced: number;
  letterCount: number;
  summary: string;
};

export type LetterTransit = {
  role: "physical" | "mental" | "spiritual";
  partLabel: string;
  letter: string;
  value: number;
};

export type PythagoreanChart = {
  nameUsed: string;
  methodNote: string;
  balance: { number: number; initials: string; summary: string; practice: string };
  hiddenPassion: {
    numbers: number[];
    counts: { number: number; count: number }[];
    summary: string;
    practice: string;
  };
  karmicLessons: {
    numbers: number[];
    softened: number[];
    summary: string;
    items: { number: number; softened: boolean; practice: string }[];
  };
  planes: NamePlane[];
  planeNote: string;
  challenges: ChartChallenge[];
  periodCycles: PeriodCycle[];
  personalDay: {
    number: number;
    asOf: string;
    summary: string;
    practice: string;
  };
  /** Month + day of birth, reduced. First-impression tone of a season. */
  attitude: { number: number; summary: string; practice: string };
  /** Count of letter-values 1–9 present in the natal name (0–9). */
  subconsciousSelf: {
    number: number;
    present: number[];
    summary: string;
    practice: string;
  };
  essence: {
    compound: number;
    reduced: number;
    transits: LetterTransit[];
    summary: string;
    practice: string;
  };
};

const CHALLENGE_COPY: Record<
  number,
  { title: string; practice: string }
> = {
  0: {
    title: "Open window",
    practice: "No extra Challenge digit here — let the Pinnacle set the weather and keep one simple habit.",
  },
  1: {
    title: "Self-trust under pressure",
    practice: "When this window is on, choose one independent step before asking the room to decide.",
  },
  2: {
    title: "Patience with others",
    practice: "Slow the reply. Name what you heard before you add what you want.",
  },
  3: {
    title: "Scattered expression",
    practice: "Finish one small piece of communication instead of starting three.",
  },
  4: {
    title: "Resistance to structure",
    practice: "Keep one weekly container (a list, a slot, a tool) even when mood argues otherwise.",
  },
  5: {
    title: "Restlessness",
    practice: "Give change a craft: one new input a week, not a new life every day.",
  },
  6: {
    title: "Over-responsibility",
    practice: "Let one yes wait. Care lands better when it is chosen, not automatic.",
  },
  7: {
    title: "Withdrawal vs insight",
    practice: "Protect study time, then bring one finding back to ordinary conversation.",
  },
  8: {
    title: "Force vs stewardship",
    practice: "Measure one result honestly. Authority grows from clean accounts, not speed.",
  },
  9: {
    title: "Holding on past the close",
    practice: "Name one ending that is already done and stop reopening it this week.",
  },
};

const LESSON_PRACTICE: Record<number, string> = {
  1: "Practise a clean ask: one preference stated without apology.",
  2: "Practise pairing — share a draft before it feels finished.",
  3: "Practise light expression: a note, a sketch, a spoken thanks.",
  4: "Practise one durable routine that survives a messy day.",
  5: "Practise a bounded experiment — change with a start and end.",
  6: "Practise care with a boundary: help, then rest.",
  7: "Practise quiet study that is allowed to stay unfinished overnight.",
  8: "Practise stewardship of one resource (time, money, or attention).",
  9: "Practise a small completion — close a loop you have been circling.",
};

const PLANE_LABEL: Record<NamePlaneId, string> = {
  physical: "Physical",
  mental: "Mental",
  emotional: "Emotional",
  intuitive: "Intuitive",
};

const PLANE_SUMMARY: Record<NamePlaneId, string> = {
  physical: "Hands, body pace, and making things real.",
  mental: "Analysis, plans, and how ideas get ordered.",
  emotional: "Feeling-tone, rapport, and response to people.",
  intuitive: "Hunches, pattern-sense, and quiet knowing.",
};

function partDigit(n: number): number {
  return reduceNumber(n, []);
}

function letterValue(ch: string): number {
  return PYTHAGOREAN[ch] ?? 0;
}

function nameParts(name: string): string[] {
  return name
    .toUpperCase()
    .split(/[\s-]+/)
    .map((p) => p.replace(/[^A-Z]/g, ""))
    .filter(Boolean);
}

function letterCounts(name: string): number[] {
  const counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const ch of lettersOnly(name).split("")) {
    const v = letterValue(ch);
    if (v >= 1 && v <= 9) counts[v] += 1;
  }
  return counts;
}

function coreDigits(cores: number[]): number[] {
  const out = new Set<number>();
  for (const n of cores) {
    if (!Number.isFinite(n)) continue;
    out.add(reduceToSingleDigit(n));
  }
  return [...out];
}

function challengeCopy(n: number): { title: string; practice: string } {
  return CHALLENGE_COPY[n] ?? CHALLENGE_COPY[0];
}

function formatAsOf(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function letterAtAge(
  part: string,
  ageYears: number,
): { letter: string; value: number } | null {
  const letters = lettersOnly(part)
    .split("")
    .map((letter) => ({ letter, value: letterValue(letter) }))
    .filter((l) => l.value > 0);
  if (!letters.length) return null;
  const cycle = letters.reduce((s, l) => s + l.value, 0);
  if (cycle <= 0) return null;
  let t = ((Math.max(0, Math.trunc(ageYears)) % cycle) + cycle) % cycle;
  for (const l of letters) {
    if (t < l.value) return l;
    t -= l.value;
  }
  return letters[0] ?? null;
}

export function personalDayNumber(
  personalYearNumber: number,
  asOf = new Date(),
): number {
  const month = personalMonth(personalYearNumber, asOf);
  const day = asOf.getDate();
  return reduceNumber(month + day, [11, 22]);
}

export function buildPythagoreanChart(opts: {
  natalName: string;
  dateOfBirth: string;
  coreNumbers: number[];
  asOf?: Date;
}): PythagoreanChart {
  const asOf = opts.asOf ?? new Date();
  const name = opts.natalName.trim() || "Name";
  const dob = opts.dateOfBirth;
  const { day, month, year } = parseDob(dob);
  const age = calculateAge(dob, asOf);
  const m = partDigit(month);
  const d = partDigit(day);
  const y = partDigit(year);
  const pinSet = pinnaclesForDob(dob);
  const currentPin = pinnacleAtAge(pinSet, age);
  const cores = coreDigits(opts.coreNumbers);

  const c1 = Math.abs(m - d);
  const c2 = Math.abs(d - y);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);
  const challenges: ChartChallenge[] = pinSet.pinnacles.map((p) => {
    const number = p.id === 1 ? c1 : p.id === 2 ? c2 : p.id === 3 ? c3 : c4;
    const copy = challengeCopy(number);
    return {
      id: p.id,
      number,
      ageStart: p.ageStart,
      ageEnd: p.ageEnd,
      isCurrent: currentPin.id === p.id,
      title: copy.title,
      practice: assertSafeCopy(copy.practice, `pyth.challenge.${p.id}`),
    };
  });

  const firstEnd = pinSet.firstEndsAtAge;
  const secondEnd = firstEnd + 27;
  const periodSpecs: Omit<PeriodCycle, "isCurrent" | "title" | "practice">[] = [
    {
      id: 1,
      label: "Formative",
      number: m,
      source: "month",
      ageStart: 0,
      ageEnd: firstEnd,
    },
    {
      id: 2,
      label: "Productive",
      number: d,
      source: "day",
      ageStart: firstEnd + 1,
      ageEnd: secondEnd,
    },
    {
      id: 3,
      label: "Harvest",
      number: y,
      source: "year",
      ageStart: secondEnd + 1,
      ageEnd: null,
    },
  ];
  const periodCycles: PeriodCycle[] = periodSpecs.map((p) => {
    const isCurrent =
      p.ageEnd == null ? age >= p.ageStart : age >= p.ageStart && age <= p.ageEnd;
    const trait = coreTraitFor(p.number);
    return {
      ...p,
      isCurrent,
      title: trait,
      practice: assertSafeCopy(
        `This ${p.label.toLowerCase()} cycle carries ${trait.toLowerCase()} as a long climate — pair it with the current Pinnacle, do not treat it as a daily mood.`,
        `pyth.period.${p.id}`,
      ),
    };
  });

  const parts = nameParts(name);
  const initials = parts.map((p) => p[0]!).join("");
  const initialSum = initials
    .split("")
    .reduce((s, ch) => s + letterValue(ch), 0);
  const balanceNumber = initialSum > 0 ? reduceNumber(initialSum) : 0;
  const balanceTrait = balanceNumber ? coreTraitFor(balanceNumber) : "stillness";
  const balance = {
    number: balanceNumber,
    initials: initials || "—",
    summary: assertSafeCopy(
      balanceNumber
        ? `Balance ${balanceNumber} (${balanceTrait}) is the tone to bring forward when the week tilts — initials ${initials.split("").join(" + ")}.`
        : "Balance needs at least one Latin initial from the birth-certificate name.",
      "pyth.balance.summary",
    ),
    practice: assertSafeCopy(
      balanceNumber
        ? `In a hard hour, ask: what would ${balanceTrait.toLowerCase()} look like in the next ten minutes?`
        : "Add a Latin spelling of the birth name to calculate Balance.",
      "pyth.balance.practice",
    ),
  };

  const counts = letterCounts(name);
  const present = counts
    .map((count, number) => ({ number, count }))
    .filter((x) => x.number >= 1 && x.count > 0);
  const max = present.reduce((m, x) => Math.max(m, x.count), 0);
  const passionNums = present.filter((x) => x.count === max).map((x) => x.number);
  const hiddenPassion = {
    numbers: passionNums,
    counts: present,
    summary: assertSafeCopy(
      passionNums.length
        ? `Hidden Passion ${passionNums.join(" / ")} is the letter-value you repeat most (${max}×) — a native appetite, not a grade.`
        : "Hidden Passion needs Latin letters in the birth-certificate name.",
      "pyth.passion.summary",
    ),
    practice: assertSafeCopy(
      passionNums.length
        ? `Give ${passionNums.map((n) => coreTraitFor(n).toLowerCase()).join(" and ")} a weekly outlet so the repeated pattern has somewhere honest to go.`
        : "Add a Latin spelling to map Hidden Passion.",
      "pyth.passion.practice",
    ),
  };

  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => counts[n] === 0);
  const softened = missing.filter((n) => cores.includes(n));
  const karmicLessons = {
    numbers: missing,
    softened,
    summary: assertSafeCopy(
      missing.length === 0
        ? "Every letter-value 1–9 appears in the birth name — there is no missing-letter Karmic Lesson on this spelling."
        : `Karmic Lessons (missing letter-values): ${missing.join(", ")}. ${
            softened.length
              ? `Softened by a core seat: ${softened.join(", ")}.`
              : "None of these are already sitting in a core number, so they ask for extra practice."
          } This is Pythagorean name math, not a verdict on character.`,
      "pyth.lessons.summary",
    ),
    items: missing.map((number) => ({
      number,
      softened: cores.includes(number),
      practice: assertSafeCopy(
        `${LESSON_PRACTICE[number] ?? "Give this missing tone a small weekly practice."}${
          cores.includes(number)
            ? " A core number already carries this digit, so treat the lesson as lighter homework."
            : ""
        }`,
        `pyth.lesson.${number}`,
      ),
    })),
  };

  const letters = lettersOnly(name).split("");
  const planes: NamePlane[] = (
    Object.keys(NAME_PLANE_LETTERS) as NamePlaneId[]
  ).map((id) => {
    const group = NAME_PLANE_LETTERS[id];
    const used = letters.filter((ch) => group.includes(ch));
    const compound = used.reduce((s, ch) => s + letterValue(ch), 0);
    const reduced = compound > 0 ? reduceNumber(compound, []) : 0;
    return {
      id,
      label: PLANE_LABEL[id],
      compound,
      reduced,
      letterCount: used.length,
      summary: assertSafeCopy(
        used.length
          ? `${PLANE_LABEL[id]} plane ${compound}/${reduced} from ${used.length} letter${used.length === 1 ? "" : "s"} — ${PLANE_SUMMARY[id]}`
          : `${PLANE_LABEL[id]} plane is quiet on this spelling — ${PLANE_SUMMARY[id]} You can still practise it; absence is not a ban.`,
        `pyth.plane.${id}`,
      ),
    };
  });
  const planeNote = assertSafeCopy(
    "These four planes come from letters in the birth-certificate name. Lo Shu mental / emotional / practical planes come from the date grid and are a different map.",
    "pyth.plane.note",
  );

  const pyCycle = personalYearCycleAt(dob, asOf);
  const dayNumber = personalDayNumber(pyCycle.number, asOf);
  const dayTrait = CORE_TRAIT[dayNumber] ?? coreTraitFor(reduceToSingleDigit(dayNumber));
  const personalDay = {
    number: dayNumber,
    asOf: formatAsOf(asOf),
    summary: assertSafeCopy(
      `Personal Day ${dayNumber} (${dayTrait}) on ${formatAsOf(asOf)} — today’s weather inside Personal Month ${personalMonth(pyCycle.number, asOf)} and Personal Year ${pyCycle.number}.`,
      "pyth.day.summary",
    ),
    practice: assertSafeCopy(
      yearMonthMeaning(reduceToSingleDigit(dayNumber)),
      "pyth.day.practice",
    ),
  };

  const physicalPart = parts[0] ?? "";
  const spiritualPart = parts.length >= 2 ? parts[parts.length - 1]! : "";
  const mentalPart = parts.length >= 3 ? parts.slice(1, -1).join("") : "";
  const transits: LetterTransit[] = [];
  const phys = letterAtAge(physicalPart, age);
  if (phys) {
    transits.push({
      role: "physical",
      partLabel: physicalPart,
      letter: phys.letter,
      value: phys.value,
    });
  }
  if (mentalPart) {
    const men = letterAtAge(mentalPart, age);
    if (men) {
      transits.push({
        role: "mental",
        partLabel: mentalPart,
        letter: men.letter,
        value: men.value,
      });
    }
  }
  if (spiritualPart && spiritualPart !== physicalPart) {
    const spi = letterAtAge(spiritualPart, age);
    if (spi) {
      transits.push({
        role: "spiritual",
        partLabel: spiritualPart,
        letter: spi.letter,
        value: spi.value,
      });
    }
  }
  const essenceCompound = transits.reduce((s, t) => s + t.value, 0);
  const essenceReduced =
    essenceCompound > 0 ? reduceNumber(essenceCompound) : 0;
  const essenceTrait = essenceReduced ? coreTraitFor(essenceReduced) : "quiet";
  const transitLine = transits
    .map((t) => `${t.role} ${t.letter}=${t.value}`)
    .join(" · ");
  const essence = {
    compound: essenceCompound,
    reduced: essenceReduced,
    transits,
    summary: assertSafeCopy(
      transits.length
        ? `Essence ${essenceCompound}/${essenceReduced} (${essenceTrait}) from this year’s name transits: ${transitLine}. Each letter lasts as many years as its Pythagorean value, looping the birth-certificate name.`
        : "Essence needs Latin letters in the birth-certificate name.",
      "pyth.essence.summary",
    ),
    practice: assertSafeCopy(
      essenceReduced
        ? `Let ${essenceTrait.toLowerCase()} colour the year-long name weather — it is slower than Personal Day and should not override the Life Path.`
        : "Add a Latin spelling to read Essence transits.",
      "pyth.essence.practice",
    ),
  };

  const attitudeNumber = reduceNumber(month + day, [11, 22]);
  const attitudeTrait = coreTraitFor(attitudeNumber);
  const attitude = {
    number: attitudeNumber,
    summary: assertSafeCopy(
      `Attitude ${attitudeNumber} is the month+day of birth reduced — how a season often meets you at the door, not the Life Path itself. Tone: ${attitudeTrait.toLowerCase()}.`,
      "pyth.attitude.summary",
    ),
    practice: assertSafeCopy(
      `When a first impression of a month feels off, ask what ${attitudeTrait.toLowerCase()} would do in the next ten minutes — then return to the Life Path.`,
      "pyth.attitude.practice",
    ),
  };

  const presentDigits = present.map((x) => x.number).sort((a, b) => a - b);
  const ssNumber = presentDigits.length;
  const subconsciousSelf = {
    number: ssNumber,
    present: presentDigits,
    summary: assertSafeCopy(
      ssNumber === 0
        ? "Subconscious Self needs Latin letters in the birth-certificate name."
        : `Subconscious Self ${ssNumber} means ${ssNumber} of the nine letter-values appear in the birth name${
            ssNumber === 9
              ? " — a complete letter toolkit."
              : ` (${presentDigits.join(", ")} present).`
          }`,
      "pyth.ss.summary",
    ),
    practice: assertSafeCopy(
      ssNumber === 0
        ? "Add a Latin spelling to read Subconscious Self."
        : ssNumber === 9
          ? "Every letter-value is present — practise choosing which tool, not hunting a missing one."
          : "Subconscious Self counts what the name already holds. Missing letter-values are the Karmic Lessons on this spelling.",
      "pyth.ss.practice",
    ),
  };

  const methodNote = assertSafeCopy(
    "Pythagorean extras on the birth-certificate spelling. Challenges share Pinnacle age windows. Period Cycles use month / day / year digits (Formative / Productive / Harvest). Attitude is month+day. Subconscious Self counts which of 1–9 appear as letters. Personal Day and Essence are dated to today.",
    "pyth.method",
  );

  assertSafeList(
    challenges.map((c) => c.title),
    "pyth.challenge.titles",
  );

  return {
    nameUsed: name,
    methodNote,
    balance,
    hiddenPassion,
    karmicLessons,
    planes,
    planeNote,
    challenges,
    periodCycles,
    personalDay,
    attitude,
    subconsciousSelf,
    essence,
  };
}

function coreNumbersFromReport(report: NumerologyReport): number[] {
  const s = report.numerology_snapshot;
  return [
    Number(s.life_path),
    Number(s.birth_day),
    Number(s.expression_number),
    Number(s.soul_urge_number),
    Number(s.personality_number),
    Number(s.maturity_number),
  ].filter((n) => Number.isFinite(n));
}

/** Always computed at view/download time so Personal Day stays current. */
export function resolvePythagoreanChart(
  report: NumerologyReport,
  asOf = new Date(),
): PythagoreanChart {
  const natal =
    report.numerology_snapshot.natal_name || report.person.full_name;
  return buildPythagoreanChart({
    natalName: natal,
    dateOfBirth: report.person.date_of_birth,
    coreNumbers: coreNumbersFromReport(report),
    asOf,
  });
}

export function pythagoreanChartPdfLines(chart: PythagoreanChart): string[] {
  const lines = [
    chart.methodNote,
    `Balance ${chart.balance.number} (initials ${chart.balance.initials}). ${chart.balance.summary}`,
    chart.balance.practice,
    chart.hiddenPassion.summary,
    chart.hiddenPassion.practice,
    chart.karmicLessons.summary,
    ...chart.karmicLessons.items.map(
      (i) => `Lesson ${i.number}${i.softened ? " (softened)" : ""}: ${i.practice}`,
    ),
    chart.planeNote,
    ...chart.planes.map((p) => p.summary),
    ...chart.challenges.map(
      (c) =>
        `Challenge ${c.id} · ${c.number} · ages ${c.ageStart}–${c.ageEnd ?? "on"} ${c.isCurrent ? "(current)" : ""} — ${c.title}. ${c.practice}`,
    ),
    ...chart.periodCycles.map(
      (p) =>
        `${p.label} cycle ${p.number} · ages ${p.ageStart}–${p.ageEnd ?? "on"} ${p.isCurrent ? "(current)" : ""} — ${p.practice}`,
    ),
    chart.personalDay.summary,
    chart.personalDay.practice,
    chart.attitude.summary,
    chart.attitude.practice,
    chart.subconsciousSelf.summary,
    chart.subconsciousSelf.practice,
    chart.essence.summary,
    chart.essence.practice,
  ];
  return assertSafeList(lines, "pyth.pdf");
}
