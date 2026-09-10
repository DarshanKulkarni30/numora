import { assertSafeCopy } from "@/lib/numerology/safety";
import { chaldeanCompoundMeaning } from "@/lib/numerology/meanings";
import type { NumerologyReport } from "@/lib/numerology/types";
import { pythagoreanNameCompare } from "@/lib/numerology/chaldeanName";
import { parseChartNumber } from "@/lib/numerology/enhanced/digits";
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
      ? chaldeanCompoundMeaning(compound)
      : "The long name total is not stored on this older report. The short name number is shown below.",
    "enhanced.chaldean.texture",
  );

  const essence = assertSafeCopy(
    `Then the name reduces to ${reduced}: ${plainTrait(reduced)}.`,
    "enhanced.chaldean.essence",
  );

  const combined = assertSafeCopy(
    `A useful day: ${plainJob(reduced)}. Watch: ${plainWatch(reduced)}.`,
    "enhanced.chaldean.combined",
  );

  const name =
    report.numerology_snapshot.operating_name ||
    report.person.operating_name ||
    report.person.full_name;
  const pythExpr = name.trim()
    ? pythagoreanNameCompare(name, report.person.date_of_birth).expression
    : expr;

  const compare = assertSafeCopy(
    `Expression on this page is the Chaldean name number ${reduced}. The Western sequential letter chart gives Expression ${pythExpr} for the same spelling — shown only as a comparison, not a second engine.`,
    "enhanced.chaldean.compare",
  );

  return {
    compound,
    reduced,
    pythagoreanExpression: pythExpr,
    texture,
    essence,
    combined,
    compare,
  };
}
