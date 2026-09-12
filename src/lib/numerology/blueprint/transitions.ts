import { plainTrait } from "@/lib/numerology/layeredCopy";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import {
  pyModeFor,
  yearPracticeLine,
  type YearMode,
} from "./yearInterpreter";
import type { NameCycle } from "./nameCycle";

export type YearTransition = {
  fromYear: number;
  toYear: number;
  fromPy: number;
  toPy: number;
  nextPy: number;
  fromMode: YearMode;
  toMode: YearMode;
  nextMode: YearMode;
  fromCycle: string | null;
  toCycle: string | null;
  changes: string;
  doMore: string;
  stopCarrying: string;
  prepareNext: string;
};

const LEAVE_BEHIND: Record<number, string> = {
  1: "Stop opening a new start every week as if that were still the job.",
  2: "Stop waiting for the other person before you protect this year’s time.",
  3: "Stop treating more talking as progress. Last year’s visibility job is closed.",
  4: "Stop adding another system. Keep the one that already works.",
  5: "Stop changing course for novelty. Last year’s experiment season is over.",
  6: "Stop saying yes to every care request as if that were still this year’s main work.",
  7: "Stop hiding in more research as if thinking replaced a visible next step.",
  8: "Stop measuring every week only by last year’s scoreboard.",
  9: "Stop holding endings that already finished. That chapter is closed.",
};

function cycleBit(cycle: NameCycle | null): string | null {
  if (!cycle) return null;
  return `${cycle.active.letter}/${cycle.active.value}`;
}

export function buildYearTransition(opts: {
  prevYear: number;
  currentYear: number;
  nextYear: number;
  prevPy: number;
  currentPy: number;
  nextPy: number;
  prevCycle: NameCycle | null;
  currentCycle: NameCycle | null;
}): YearTransition {
  const fromPy = reduceToSingleDigit(opts.prevPy);
  const toPy = reduceToSingleDigit(opts.currentPy);
  const nextPy = reduceToSingleDigit(opts.nextPy);
  const fromMode = pyModeFor(fromPy);
  const toMode = pyModeFor(toPy);
  const nextMode = pyModeFor(nextPy);
  const fromCycle = cycleBit(opts.prevCycle);
  const toCycle = cycleBit(opts.currentCycle);
  const samePy = fromPy === toPy;

  const changeCore = samePy
    ? `${opts.prevYear} and ${opts.currentYear} share a ${toMode.title.toLowerCase()} year (${toPy}). The weekly job stays ${plainTrait(toPy)} — what changes is the name letter, not the Personal Year digit.`
    : `${opts.prevYear} asked you to practise ${plainTrait(fromPy)} (a ${fromMode.title.toLowerCase()} year). ${opts.currentYear} asks for ${plainTrait(toPy)} (a ${toMode.title.toLowerCase()} year). Treat that as a change of weekly job, not a worse year.`;

  const cycleNote =
    fromCycle || toCycle
      ? ` Last year’s name letter ${fromCycle ?? "—"} coloured how you showed up. This year’s letter ${toCycle ?? "—"} does the same. Neither letter rewrites the Personal Year.`
      : "";

  return {
    fromYear: opts.prevYear,
    toYear: opts.currentYear,
    fromPy,
    toPy,
    nextPy,
    fromMode,
    toMode,
    nextMode,
    fromCycle,
    toCycle,
    changes: assertSafeCopy(`${changeCore}${cycleNote}`, "blueprint.tr.change"),
    doMore: assertSafeCopy(
      yearPracticeLine(toPy, opts.currentCycle?.active.value ?? null),
      "blueprint.tr.do",
    ),
    stopCarrying: assertSafeCopy(
      LEAVE_BEHIND[fromPy] ?? LEAVE_BEHIND[9]!,
      "blueprint.tr.stop",
    ),
    prepareNext: assertSafeCopy(
      `You do not have to do ${opts.nextYear} yet. It will be a ${nextMode.title.toLowerCase()} year: ${yearPracticeLine(nextPy, null)} Notice what would get in the way.`,
      "blueprint.tr.next",
    ),
  };
}

export function transitionNotes(tr: YearTransition): string[] {
  return assertSafeList(
    [tr.doMore, tr.stopCarrying, tr.prepareNext],
    "blueprint.tr.notes",
  );
}
