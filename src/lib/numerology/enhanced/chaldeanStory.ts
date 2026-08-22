import { chaldeanCompoundMeaning, coreTraitFor } from "@/lib/numerology/meanings";
import { assertSafeCopy } from "@/lib/numerology/safety";
import type { NumerologyReport } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";

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
      ? `${chaldeanCompoundMeaning(compound)} In this reading, compound ${compound} is the texture of the spelling—the grain of the name before it settles.`
      : "Compound name total is not stored on this older report; the reduced name number is shown as essence.",
    "enhanced.chaldean.texture",
  );

  const essence = assertSafeCopy(
    `Reduced ${reduced} is the essence others may meet more quickly: ${coreTraitFor(reduced).toLowerCase()}. Texture and essence belong together—neither replaces the other.`,
    "enhanced.chaldean.essence",
  );

  const combined = assertSafeCopy(
    `Read together, the name vibration may emphasize ${nameBlend(reduced)}—as atmosphere, not as a job title.`,
    "enhanced.chaldean.combined",
  );

  const compare = assertSafeCopy(
    expr === reduced
      ? `Chaldean reduced ${reduced} and Pythagorean Expression ${expr} agree on this spelling. Two letter maps arrived at the same digit—worth noticing, still not a prediction.`
      : `Same letters, two jobs. Chaldean ${reduced} (${coreTraitFor(reduced)}) is the older map’s keyword; Pythagorean Expression ${expr} (${coreTraitFor(expr)}) is how the name builds and speaks. Hold both: how the spelling may feel, and how you make things. Not a fight over which is correct.`,
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
    1: "initiative and a clear voice",
    2: "cooperation and careful timing",
    3: "communication and imaginative warmth",
    4: "reliability and ordered care",
    5: "movement and adaptable speech",
    6: "responsibility, family-minded care, and harmony-seeking",
    7: "thoughtful speech and a preference for depth",
    8: "stewardship and measured authority",
    9: "breadth, mentoring, and completion",
  };
  return map[n] ?? "a mixed name atmosphere";
}
