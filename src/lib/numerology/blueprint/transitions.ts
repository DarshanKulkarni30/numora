import { pyNatureMeta } from "@/lib/numerology/personalYearOutlook";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import { pyModeFor, type YearMode } from "./yearInterpreter";
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
  const fromMode = pyModeFor(opts.prevPy);
  const toMode = pyModeFor(opts.currentPy);
  const nextMode = pyModeFor(opts.nextPy);
  const fromNat = pyNatureMeta(opts.prevPy);
  const toNat = pyNatureMeta(opts.currentPy);
  const nextNat = pyNatureMeta(opts.nextPy);
  const fromCycle = opts.prevCycle
    ? `${opts.prevCycle.active.letter}/${opts.prevCycle.active.value}`
    : null;
  const toCycle = opts.currentCycle
    ? `${opts.currentCycle.active.letter}/${opts.currentCycle.active.value}`
    : null;

  return {
    fromYear: opts.prevYear,
    toYear: opts.currentYear,
    fromPy: opts.prevPy,
    toPy: opts.currentPy,
    nextPy: opts.nextPy,
    fromMode,
    toMode,
    nextMode,
    fromCycle,
    toCycle,
    changes: assertSafeCopy(
      `From ${fromMode.verb}${fromCycle ? ` × ${fromCycle}` : ""} toward ${toMode.verb}${toCycle ? ` × ${toCycle}` : ""}. ${fromNat.short} is giving way to ${toNat.short}`,
      "blueprint.tr.change",
    ),
    doMore: assertSafeCopy(toNat.practice, "blueprint.tr.do"),
    stopCarrying: assertSafeCopy(
      `Stop carrying the previous year’s default (${fromNat.practice}) as if it were still this year’s job.`,
      "blueprint.tr.stop",
    ),
    prepareNext: assertSafeCopy(
      `Prepare for ${opts.nextYear} (${nextMode.verb}): ${nextNat.practice}`,
      "blueprint.tr.next",
    ),
  };
}

export function transitionNotes(tr: YearTransition): string[] {
  return assertSafeList([tr.doMore, tr.stopCarrying, tr.prepareNext], "blueprint.tr.notes");
}
