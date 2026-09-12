/**
 * Year Interpreter v1.0 — Personal Year × Name Cycle × core profile.
 * Reflective pacing copy. Never claims events will happen.
 */

import { pairTone, type CompatTone } from "@/lib/numerology/compatibility";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainJob, plainTrait, plainWatch } from "@/lib/numerology/layeredCopy";
import { pyNatureMeta } from "@/lib/numerology/personalYearOutlook";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import type { NameCycle } from "./nameCycle";

export const YEAR_INTERPRETATION_VERSION = "1.0";

export type YearMode = {
  verb: string;
  title: string;
};

export type YearInterpretation = {
  interpretationVersion: typeof YEAR_INTERPRETATION_VERSION;
  calendarYear: number;
  personalYear: number;
  cycleLetter: string | null;
  cycleNumber: number | null;
  cyclePosition: number | null;
  pyMode: YearMode;
  cycleMode: YearMode;
  signatureCode: string;
  signatureTitle: string;
  theme: string;
  strength: string;
  risk: string;
  bestMove: string;
  energyFlow: string;
  feel: string;
  asking: string[];
  career: { strong: string[]; watch: string };
  money: string;
  relationships: string;
  growth: string;
  dos: string[];
  donts: string[];
  oneSentence: string;
  prepare: string[];
  tableDo: string;
  numbers: Record<string, string | number | null>;
};

const LETTER_TINT: Record<number, string> = {
  1: "put your name on the first step",
  2: "do it with one other person",
  3: "say the finding out loud once",
  4: "put the step on a repeating list",
  5: "do not swap the rest of the plan",
  6: "keep the promise attached to it",
  7: "think for ten minutes, then stop",
  8: "tie it to one number you can count",
  9: "close it; do not reopen it the same day",
};

/** One weekly move for a Personal Year, optionally tinted by Name Cycle. */
export const YEAR_WEEKLY: Record<number, string> = {
  1: "Start one real piece and put your name on it.",
  2: "Finish one task with one other person.",
  3: "Share one small finished thing — not ten drafts.",
  4: "Fix one repeating system and keep it all week.",
  5: "Change one thing on purpose. Leave the other four alone.",
  6: "Keep one promise. Put one hour on the calendar that is only yours.",
  7: "Block two quiet hours. Write one page of what you actually think.",
  8: "Pick one result you can count. Put a date and a rest day beside it.",
  9: "Finish or hand over one loop. Do not start its replacement the same day.",
};

export function yearPracticeLine(
  personalYear: number,
  cycleNumber: number | null,
): string {
  const py = reduceToSingleDigit(personalYear);
  const base = YEAR_WEEKLY[py] ?? YEAR_WEEKLY[9]!;
  const cycle =
    cycleNumber != null ? reduceToSingleDigit(cycleNumber) : null;
  if (cycle == null || cycle === py) {
    return assertSafeCopy(base, "blueprint.year.practice");
  }
  const tint = LETTER_TINT[cycle] ?? "keep the showing-up style small";
  return assertSafeCopy(`${base} Name letter: ${tint}.`, "blueprint.year.practice.tint");
}

const DIGIT_MODE: Record<number, YearMode> = {
  1: { verb: "INITIATE", title: "Start" },
  2: { verb: "CONNECT", title: "Connect" },
  3: { verb: "EXPRESS", title: "Express" },
  4: { verb: "BUILD", title: "Build" },
  5: { verb: "EXPAND", title: "Change" },
  6: { verb: "NURTURE", title: "Care" },
  7: { verb: "REFLECT", title: "Deepen" },
  8: { verb: "ACHIEVE", title: "Steward" },
  9: { verb: "COMPLETE", title: "Finish" },
};

const FLOW_VERB: Record<number, string> = {
  1: "Start",
  2: "Connect",
  3: "Express",
  4: "Build",
  5: "Change",
  6: "Care",
  7: "Deepen",
  8: "Steward",
  9: "Finish",
};

export function yearModeFor(n: number): YearMode {
  return DIGIT_MODE[reduceToSingleDigit(n)] ?? DIGIT_MODE[9]!;
}

function modeFor(n: number): YearMode {
  return yearModeFor(n);
}

export function flowVerbFor(n: number): string {
  return FLOW_VERB[reduceToSingleDigit(n)] ?? "Use";
}

function cycleModifier(py: number, cycle: number): YearMode {
  if (py === cycle) return { verb: "AMPLIFY", title: "Amplify" };
  const tone: CompatTone = pairTone(py, cycle);
  if (tone === "Amazing") return { verb: "SUPPORT", title: "Support" };
  if (tone === "Favourable") return { verb: "EASE", title: "Ease" };
  if (tone === "Neutral") return { verb: "STRETCH", title: "Stretch" };
  return { verb: "COUNTER", title: "Balance" };
}

function signatureTitle(pyVerb: string, cycleVerb: string, py: number, cycle: number): string {
  if (py === cycle) {
    return `Amplified ${modeFor(py).title}`;
  }
  return `${modeFor(py).title} × ${modeFor(cycle).title}`;
}

export function interpretYear(opts: {
  calendarYear: number;
  personalYear: number;
  cycle: NameCycle | null;
  bn: number;
  dn: number;
  nameRoot: number;
  isPast?: boolean;
  isFuture?: boolean;
}): YearInterpretation {
  const py = reduceToSingleDigit(opts.personalYear);
  const cycleN = opts.cycle ? reduceToSingleDigit(opts.cycle.active.value) : null;
  const pyMode = modeFor(py);
  const cycleMode = cycleN != null ? cycleModifier(py, cycleN) : { verb: "HOLD", title: "Hold" };
  const nature = pyNatureMeta(py);
  const letter = opts.cycle?.active.letter ?? null;
  const signatureCode =
    cycleN != null && letter
      ? `${py} × ${letter}/${cycleN}`
      : String(py);

  const amplified = cycleN != null && cycleN === py;
  const theme = amplified
    ? `${pyMode.title} with matching name vibration`
    : cycleN != null
      ? `${pyMode.title} with a ${modeFor(cycleN).title.toLowerCase()} identity tone`
      : pyMode.title;

  const feel = assertSafeCopy(
    amplified
      ? `This year may feel like ${plainTrait(py)} is turned up. The challenge is rarely generating the theme — it is choosing which part of it deserves your attention.`
      : cycleN != null
        ? `This year may feel like a ${plainTrait(py)} season, coloured by ${plainTrait(cycleN)} from the active name letter. You may find yourself mixing both, rather than living only one.`
        : `This year may feel like ${plainTrait(py)}. ${nature.typical}`,
    "blueprint.year.feel",
  );

  const asking = assertSafeList(
    [
      amplified
        ? `Choose. Do not pursue every interesting opening that a ${py} year can invent.`
        : `Choose one ${plainTrait(py)} move and one ${cycleN != null ? plainTrait(cycleN) : "quiet"} check.`,
      `Make the work visible in a small way: ${plainJob(py)}.`,
      `Complete. ${plainJob(cycleN ?? opts.nameRoot)}.`,
    ],
    "blueprint.year.ask",
  );

  const careerStrong = assertSafeList(
    [
      `work that uses ${plainTrait(py)}`,
      cycleN != null ? `roles that also need ${plainTrait(cycleN)}` : `roles that match your name tone ${plainTrait(opts.nameRoot)}`,
      "explaining what you already know",
    ],
    "blueprint.year.career.strong",
  );

  const dos = assertSafeList(
    [
      `Do ${plainJob(py)}`,
      cycleN != null ? `Do ${plainJob(cycleN)}` : `Do ${plainJob(opts.bn)}`,
      "Finish one visible piece of work before starting the next",
    ],
    "blueprint.year.dos",
  );

  const donts = assertSafeList(
    [
      `Watch ${plainWatch(py)}`,
      cycleN != null ? `Watch ${plainWatch(cycleN)}` : `Watch ${plainWatch(opts.nameRoot)}`,
      "Do not treat talking as the same as finishing",
      "Do not wait for a perfect version before a first share",
    ],
    "blueprint.year.donts",
  );

  const oneSentence = assertSafeCopy(
    amplified
      ? `This is not a year to keep ${plainTrait(py)} only in your head — it is a year to give the right piece a visible form.`
      : cycleN != null
        ? `A useful way to work with this year is to let ${plainTrait(py)} set the season, and let ${plainTrait(cycleN)} decide how you show up in it.`
        : `A useful way to work with this year is: ${nature.practice}`,
    "blueprint.year.sentence",
  );

  const prepare = assertSafeList(
    opts.isFuture
      ? [
          `Notice what a ${pyMode.title.toLowerCase()} year would need from you.`,
          "Avoid extra commitments that would block that season.",
          "Keep one experiment small enough to start when the year actually begins.",
        ]
      : [
          nature.practice,
          `Use your longer pattern (${flowVerbFor(opts.bn)} → ${flowVerbFor(opts.dn)} → ${flowVerbFor(opts.nameRoot)}) as the through-line, not a second forecast.`,
        ],
    "blueprint.year.prepare",
  );

  return {
    interpretationVersion: YEAR_INTERPRETATION_VERSION,
    calendarYear: opts.calendarYear,
    personalYear: py,
    cycleLetter: letter,
    cycleNumber: cycleN,
    cyclePosition: opts.cycle?.active.index ?? null,
    pyMode,
    cycleMode,
    signatureCode,
    signatureTitle: assertSafeCopy(
      signatureTitle(pyMode.verb, cycleMode.verb, py, cycleN ?? py),
      "blueprint.year.title",
    ),
    theme: assertSafeCopy(theme, "blueprint.year.theme"),
    strength: assertSafeCopy(plainTrait(amplified ? py : cycleN ?? py), "blueprint.year.str"),
    risk: assertSafeCopy(plainWatch(py), "blueprint.year.risk"),
    bestMove: assertSafeCopy(plainJob(py), "blueprint.year.move"),
    energyFlow: `${flowVerbFor(opts.bn)} → ${flowVerbFor(opts.dn)} → ${flowVerbFor(opts.nameRoot)}`,
    feel,
    asking,
    career: {
      strong: careerStrong,
      watch: assertSafeCopy(
        `Starting more ${plainTrait(py)} than you can finish.`,
        "blueprint.year.career.watch",
      ),
    },
    money: assertSafeCopy(
      `A useful money approach this year is to use what you already know and who you already know, before chasing an entirely new stream. ${plainJob(cycleN ?? opts.nameRoot)}.`,
      "blueprint.year.money",
    ),
    relationships: assertSafeCopy(
      amplified
        ? `You may find conversation easier. A useful check is whether activity is replacing one honest talk.`
        : `Connection may sit beside ${cycleN != null ? plainTrait(cycleN) : "your usual pace"}. Prefer one meaningful exchange over more social noise.`,
      "blueprint.year.rel",
    ),
    growth: assertSafeCopy(
      `Move from “I have the idea” to “I expressed and tested one idea.”`,
      "blueprint.year.growth",
    ),
    dos,
    donts,
    oneSentence,
    prepare,
    tableDo: yearPracticeLine(py, cycleN),
    numbers: {
      py,
      name_cycle_letter: letter,
      name_cycle_number: cycleN,
      name_position: opts.cycle ? opts.cycle.active.index + 1 : null,
      bn: opts.bn,
      dn: opts.dn,
      name_root: opts.nameRoot,
    },
  };
}

export function flowVerbs(bn: number, dn: number, nameRoot: number): string {
  return `${flowVerbFor(bn)} → ${flowVerbFor(dn)} → ${flowVerbFor(nameRoot)}`;
}

export function pyModeFor(n: number): YearMode {
  return modeFor(n);
}
