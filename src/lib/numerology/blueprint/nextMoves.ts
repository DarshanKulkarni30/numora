import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import type { CareerCompass, LifeCompass } from "./compass";
import type { YearInterpretation } from "./yearInterpreter";

export type NextMoves = {
  career: string;
  relationships: string;
  growth: string;
  timing: string;
  prompt: string;
};

export function buildNextMoves(opts: {
  career: CareerCompass;
  life: LifeCompass;
  year: YearInterpretation;
  nextYear: number;
  nextPy: number;
  nextCycleLabel: string | null;
}): NextMoves {
  const topMove = opts.career.moves[0]?.doThis;
  const rel = opts.life.themes.find((t) => t.id === "relationships");
  const growth = opts.life.themes.find((t) => t.id === "growth");
  return {
    career: assertSafeCopy(
      topMove ??
        `Use this year’s ${opts.year.pyMode.verb} mode in the work you already have.`,
      "blueprint.next.career",
    ),
    relationships: assertSafeCopy(
      rel?.doThis ?? opts.year.relationships,
      "blueprint.next.rel",
    ),
    growth: assertSafeCopy(growth?.doThis ?? opts.year.growth, "blueprint.next.growth"),
    timing: assertSafeCopy(
      `${opts.year.calendarYear}: ${opts.year.pyMode.verb} → ${opts.nextYear}: Personal Year ${opts.nextPy}${opts.nextCycleLabel ? ` × ${opts.nextCycleLabel}` : ""}.`,
      "blueprint.next.timing",
    ),
    prompt: opts.year.oneSentence,
  };
}

export function nextMoveLines(moves: NextMoves): string[] {
  return assertSafeList(
    [moves.career, moves.relationships, moves.growth, moves.timing, moves.prompt],
    "blueprint.next.lines",
  );
}
