import { chaldeanCompoundMeaning } from "@/lib/numerology/meanings";
import { assertSafeCopy } from "@/lib/numerology/safety";
import type { NumerologyReport } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";
import { plainTrait } from "@/lib/numerology/layeredCopy";

export type ChaldeanStory = {
  compound: number;
  reduced: number;
  pythagoreanExpression: number;
  texture: string;
  essence: string;
  combined: string;
  compare: string;
};

export function buildChaldeanStory(report: NumerologyReport): ChaldeanStory {
  const compound = parseChartNumber(report.chaldean?.compound_number) ?? 0;
  const reduced =
    parseChartNumber(report.chaldean?.reduced_number) ??
    parseChartNumber(report.numerology_snapshot.chaldean_name_number) ??
    9;
  const expr = parseChartNumber(report.numerology_snapshot.expression_number) ?? 9;

  const texture = assertSafeCopy(
    compound
      ? `${chaldeanCompoundMeaning(compound)} First the letters add to ${compound}. That larger number is the texture of the name — the grain before it becomes one digit.`
      : "The larger name total is not stored on this older report; the reduced name number is shown as essence.",
    "enhanced.chaldean.texture",
  );

  const essence = assertSafeCopy(
    `Then the name becomes ${reduced}. People may notice this sooner: ${plainTrait(reduced)}. Texture and essence belong together. Neither replaces the other.`,
    "enhanced.chaldean.essence",
  );

  const combined = assertSafeCopy(
    `Read together, the name may lean toward ${nameBlend(reduced)} — as a mood, not as a job title.`,
    "enhanced.chaldean.combined",
  );

  const compare = assertSafeCopy(
    expr === reduced
      ? `Chaldean reduced ${reduced} and Pythagorean Expression ${expr} agree on this spelling. Two letter maps arrived at the same digit. Worth noticing. Still not a prediction.`
      : `Same letters, two jobs. Chaldean ${reduced} (${plainTrait(reduced)}) is the older map’s keyword. Pythagorean Expression ${expr} (${plainTrait(expr)}) is how the name builds and speaks. Hold both: how the spelling may feel, and how you make things. Not a fight over which is correct.`,
    "enhanced.chaldean.compare",
  );

  return {
    compound,
    reduced,
    pythagoreanExpression: expr,
    texture,
    essence,
    combined,
    compare,
  };
}

function nameBlend(n: number): string {
  const map: Record<number, string> = {
    1: "starting things and a clear voice",
    2: "working with others and careful timing",
    3: "talking and sharing ideas",
    4: "plans, routines, and steady care",
    5: "movement and flexible speech",
    6: "care, home, and keeping promises",
    7: "quiet thinking and a preference for depth",
    8: "plans, money, and measured duty",
    9: "finishing things and helping a wider group",
  };
  return map[n] ?? "a mixed name mood";
}
