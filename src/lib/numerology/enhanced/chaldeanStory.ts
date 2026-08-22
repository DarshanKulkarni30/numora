import { chaldeanCompoundMeaning } from "@/lib/numerology/meanings";
import { assertSafeCopy } from "@/lib/numerology/safety";
import type { NumerologyReport } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";
import { plainJob, plainTrait, plainWatch } from "@/lib/numerology/layeredCopy";

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
      ? `${chaldeanCompoundMeaning(compound)} The letters first add to ${compound}. That long total is extra detail, not a second person.`
      : "The long name total is not stored on this older report. The short name number is shown below.",
    "enhanced.chaldean.texture",
  );

  const essence = assertSafeCopy(
    `Then the name reduces to ${reduced}. People may notice this sooner: ${plainTrait(reduced)}. Try: ${plainJob(reduced)}. Watch: ${plainWatch(reduced)}.`,
    "enhanced.chaldean.essence",
  );

  const combined = assertSafeCopy(
    `Together, this spelling points to ${plainTrait(reduced)}. That is a habit, not a job title.`,
    "enhanced.chaldean.combined",
  );

  const compare = assertSafeCopy(
    expr === reduced
      ? `Chaldean ${reduced} and Expression ${expr} landed on the same digit for this spelling. Two letter maps agree. Still not a prediction.`
      : `Same name, two maps. Chaldean ${reduced} is ${plainTrait(reduced)}. Expression ${expr} is ${plainTrait(expr)}. You do not pick a winner. A useful day: ${plainJob(expr)}, then ${plainJob(reduced)}.`,
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
