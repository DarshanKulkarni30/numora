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
import { coreTraitFor } from "./meanings";
import { pinnacleAtAge, pinnaclesForDob } from "./pinnacles";
import {
  calculateAge,
  lettersOnly,
  parseDob,
  reduceNumber,
} from "./reduce";
import { assertSafeCopy, assertSafeList } from "./safety";
import type { NumerologyReport } from "./types";
import { ageSpan, plainTrait } from "./layeredCopy";

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
  student?: string;
  expert?: string;
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
    student?: string;
    expert?: string;
  };
  karmicLessons: {
    numbers: number[];
    softened: number[];
    summary: string;
    student?: string;
    expert?: string;
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
    student?: string;
    expert?: string;
  };
  /** Month + day of birth, reduced. First-impression tone of a season. */
  attitude: {
    number: number;
    summary: string;
    practice: string;
    student?: string;
    expert?: string;
  };
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
    student?: string;
    expert?: string;
  };
};

const CHALLENGE_COPY: Record<
  number,
  { title: string; doThis: string; student: string }
> = {
  0: {
    title: "No extra lesson number",
    doThis: "There is no extra Challenge number here. Keep one simple habit and follow the Pinnacle theme for these years.",
    student: "Challenge 0 means the month / day / year difference reduced to 0. Some teachers skip a special lesson and point you to the Pinnacle instead.",
  },
  1: {
    title: "Learning to trust yourself",
    doThis: "Practice deciding one small thing on your own before you ask other people what to do.",
    student: "Challenge 1 is about self-trust. The skill is starting without waiting for the group. It is a practice period, not a punishment.",
  },
  2: {
    title: "Learning patience with people",
    doThis: "Wait a few seconds before you answer. First say what you heard. Then say what you want.",
    student: "Challenge 2 is about patience and listening. The skill is not “being quiet forever.” It is hearing the other person before you add your point.",
  },
  3: {
    title: "Learning to finish what you say",
    doThis: "Finish one short message, note, or talk before you start three new ones.",
    student: "Challenge 3 is scattered speech or ideas. The practice is one finished piece of communication.",
  },
  4: {
    title: "Learning to keep a simple plan",
    doThis: "Keep one weekly list or time slot, even when you do not feel like it.",
    student: "Challenge 4 is resistance to structure. A small routine is enough. You do not need a perfect system.",
  },
  5: {
    title: "Learning to change without chaos",
    doThis: "Try one new thing this week — not a whole new life every day.",
    student: "Challenge 5 is restlessness. The skill is giving change a start and an end.",
  },
  6: {
    title: "Learning not to over-help",
    doThis: "Let one “yes” wait. Help when you choose to, then rest.",
    student: "Challenge 6 is too much duty. Care is still good. Automatic yes is the strain.",
  },
  7: {
    title: "Learning to think, then share",
    doThis: "Keep study or quiet time. Then tell one trusted person one thing you learned.",
    student: "Challenge 7 is hiding in thought. Insight needs a small return to ordinary talk.",
  },
  8: {
    title: "Learning honest results",
    doThis: "Check one number or result honestly (time, money, or a promise). Do not only work faster.",
    student: "Challenge 8 is force versus clean accounts. Authority here means clear facts, not speed.",
  },
  9: {
    title: "Learning to let an ending stay ended",
    doThis: "Name one thing that is already finished. Do not reopen it this week.",
    student: "Challenge 9 is holding on after a close. The practice is one clean ending.",
  },
};

const CHALLENGE_EXPERT =
  "Pythagorean Challenges are reduced differences: C1 = |month − day|, C2 = |day − year|, C3 = |C1 − C2|, C4 = |month − year| (each part first reduced). Age windows match the four Pinnacles. The same digit can return later. Reflective practice only — not a forecast.";

const LESSON_PRACTICE: Record<number, string> = {
  1: "Practice saying one clear preference: “I would like …”",
  2: "Practice sharing a draft with someone before it feels perfect.",
  3: "Practice one small expression: a note, a sketch, or a thank-you.",
  4: "Practice one daily or weekly routine that still works on a messy day.",
  5: "Practice one change with a start date and an end date.",
  6: "Practice helping, then stopping to rest.",
  7: "Practice quiet study, even if you do not finish it tonight.",
  8: "Practice looking after one resource: time, money, or attention.",
  9: "Practice closing one open loop you keep circling.",
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

function challengeCopy(n: number): { title: string; doThis: string; student: string } {
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
    const current = currentPin.id === p.id;
    const ages = ageSpan(p.ageStart, p.ageEnd);
    const nowBit = current ? " You are in this period now." : "";
    return {
      id: p.id,
      number,
      ageStart: p.ageStart,
      ageEnd: p.ageEnd,
      isCurrent: current,
      title: copy.title,
      practice: assertSafeCopy(
        `${ages}.${nowBit} ${copy.doThis}`,
        `pyth.challenge.${p.id}`,
      ),
      student: assertSafeCopy(copy.student, `pyth.challenge.student.${p.id}`),
      expert: CHALLENGE_EXPERT,
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
        ? `Hidden Passion is the letter number you use most in your birth name. Yours is ${passionNums.join(" / ")} (it appears ${max} time${max === 1 ? "" : "s"}). This is a habit in the name, not a score. It often feels like something you want to do again and again: ${passionNums.map((n) => plainTrait(n)).join(" and ")}.`
        : "Hidden Passion needs Latin letters in the birth-certificate name.",
      "pyth.passion.summary",
    ),
    practice: assertSafeCopy(
      passionNums.length
        ? `This week, give that habit a small honest place to go: ${passionNums.map((n) => plainTrait(n)).join(" and ")}.`
        : "Add a Latin spelling to map Hidden Passion.",
      "pyth.passion.practice",
    ),
    student: assertSafeCopy(
      "We count how often each letter-value 1–9 appears in the birth-certificate name. The highest count is Hidden Passion. If two numbers tie, both stay.",
      "pyth.passion.student",
    ),
    expert: assertSafeCopy(
      "Pythagorean A=1…I=9, then J=1 again. Hidden Passion is the modal letter-value, not a destiny claim or a grade.",
      "pyth.passion.expert",
    ),
  };

  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => counts[n] === 0);
  const softened = missing.filter((n) => cores.includes(n));
  const karmicLessons = {
    numbers: missing,
    softened,
    summary: assertSafeCopy(
      missing.length === 0
        ? "Every number from 1 to 9 appears at least once in the letters of the birth name. In this method there is no missing-letter lesson on this spelling."
        : `We give each letter a number (A=1, B=2, … I=9, then J=1 again). If a number from 1 to 9 never appears in the birth name, this method calls it a Karmic Lesson. Yours are ${missing.join(", ")}. This does not judge your character. It only means those skills may need extra practice.${
            softened.length
              ? ` ${softened.join(" and ")} also appear in your main chart numbers (for example Life Path or Birth Day), so those lessons are usually easier.`
              : " None of these missing numbers already sit in your main chart, so they may need a little more practice."
          }`,
      "pyth.lessons.summary",
    ),
    student: assertSafeCopy(
      "This is Pythagorean name math (letters 1–9), not Vedic or Chaldean. “Easier” means the same digit already appears in a main number such as Life Path, Birth Day, or Expression.",
      "pyth.lessons.student",
    ),
    expert: assertSafeCopy(
      "Traditional Pythagorean Karmic Lessons are the absent letter-values 1–9 in the natal spelling. Softening when the digit is already a core seat is a Numora teaching note, not a universal rule.",
      "pyth.lessons.expert",
    ),
    items: missing.map((number) => ({
      number,
      softened: cores.includes(number),
      practice: assertSafeCopy(
        `${LESSON_PRACTICE[number] ?? "Give this missing number a small weekly practice."}${
          cores.includes(number)
            ? " This number is already in your main chart, so treat the practice as lighter."
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
  const dayReduced = reduceToSingleDigit(dayNumber);
  const monthNumber = personalMonth(pyCycle.number, asOf);
  const personalDay = {
    number: dayNumber,
    asOf: formatAsOf(asOf),
    summary: assertSafeCopy(
      `Personal Day ${dayNumber} is today’s small timing number (as of ${formatAsOf(asOf)}). It sits inside Personal Month ${monthNumber} and Personal Year ${pyCycle.number}. Today’s mood: ${plainTrait(dayReduced)}.`,
      "pyth.day.summary",
    ),
    practice: assertSafeCopy(
      `Try one small step today that matches ${plainTrait(dayReduced)}. Then go back to your longer Life Path work.`,
      "pyth.day.practice",
    ),
    student: assertSafeCopy(
      "Personal Day = reduce(Personal Month + calendar day). Personal Month = reduce(Personal Year + calendar month). It is timing, not character.",
      "pyth.day.student",
    ),
    expert: assertSafeCopy(
      "Same Pythagorean year–month–day stack as classic universal-year cycles. Numora prints the as-of date. Reflective pacing only — not events or luck.",
      "pyth.day.expert",
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
  const transitLine = transits
    .map((t) => `${t.role} ${t.letter}=${t.value}`)
    .join(" · ");
  const essence = {
    compound: essenceCompound,
    reduced: essenceReduced,
    transits,
    summary: assertSafeCopy(
      transits.length
        ? `Essence is a slower name number for this year of your life. We walk through the letters of your birth name; each letter lasts as many years as its number. This year the letters add to ${essenceCompound}, which becomes ${essenceReduced}. That mood is: ${plainTrait(essenceReduced)}. Current letters: ${transitLine}. It is slower than Personal Day. It does not replace Life Path.`
        : "Essence needs Latin letters in the birth-certificate name.",
      "pyth.essence.summary",
    ),
    practice: assertSafeCopy(
      essenceReduced
        ? `Let this year’s slower name mood (${plainTrait(essenceReduced)}) sit beside Life Path. Do not let it replace the longer path.`
        : "Add a Latin spelling to read Essence transits.",
      "pyth.essence.practice",
    ),
    student: assertSafeCopy(
      "Physical, mental, and spiritual name parts can each hold a current letter. Add those letter values for Essence compound, then reduce. Each letter lasts as many years as its Pythagorean value, then the name part loops.",
      "pyth.essence.student",
    ),
    expert: assertSafeCopy(
      "Transit duration = Pythagorean letter value in years, looping each name part. Essence = sum of current transit values, then reduce. Not a forecast and not a Life Path override.",
      "pyth.essence.expert",
    ),
  };

  const attitudeNumber = reduceNumber(month + day, [11, 22]);
  const attitudeTrait = coreTraitFor(attitudeNumber);
  const attitude = {
    number: attitudeNumber,
    summary: assertSafeCopy(
      `Attitude is a small extra number: add your birth month and birth day, then keep adding until you get one digit (sometimes 11 or 22). Yours is ${attitudeNumber}. This is not your Life Path. It is more like a first mood: ${plainTrait(attitudeNumber)}.`,
      "pyth.attitude.summary",
    ),
    practice: assertSafeCopy(
      `If a month feels strange, try one small step that matches this mood (${plainTrait(attitudeNumber)}). Then go back to your main Life Path work.`,
      "pyth.attitude.practice",
    ),
    student: assertSafeCopy(
      `Attitude = reduce(month + day). Teachers use it for first impression or how a season may feel at the start. It does not replace Life Path, Expression, or Soul Urge. The keyword on this chart is “${attitudeTrait}.”`,
      "pyth.attitude.student",
    ),
    expert: assertSafeCopy(
      "Some schools keep 11 or 22 on Attitude before a 1–9 read in tables. Numora reduces with masters 11 and 22 allowed. Reflective only.",
      "pyth.attitude.expert",
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
