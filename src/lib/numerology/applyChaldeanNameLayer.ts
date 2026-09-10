/**
 * Recompute name-derived snapshot seats from the stored spelling using Chaldean.
 * Date numbers (Life Path, Birth Day, Destiny, Personal Year) stay as saved.
 */

import {
  calculateChaldeanNameSet,
  maturityFrom,
  type ChaldeanNameSet,
} from "@/lib/numerology/chaldeanName";
import { meaningFor } from "@/lib/numerology/meanings";
import { parseChartNumber } from "@/lib/numerology/enhanced/digits";
import type { NumerologyReport } from "@/lib/numerology/types";

export function applyChaldeanNameLayer(
  report: NumerologyReport,
): NumerologyReport {
  const snap = report.numerology_snapshot;
  const operating =
    snap.operating_name ||
    report.person.operating_name ||
    report.person.full_name;
  const natal = snap.natal_name || report.person.full_name;
  if (!operating?.trim()) return report;

  const op = calculateChaldeanNameSet(operating);
  const differs = Boolean(natal && natal.trim() !== operating.trim());
  const nat = differs ? calculateChaldeanNameSet(natal) : op;
  const lifePath = parseChartNumber(snap.life_path) ?? 9;
  const maturity = maturityFrom(lifePath, op.expression.root);
  const natalMaturity = maturityFrom(
    parseChartNumber(snap.life_path) ?? lifePath,
    nat.expression.root,
  );

  return {
    ...report,
    numerology_snapshot: {
      ...snap,
      expression_number: String(op.expression.root),
      expression_compound: String(op.expression.compound),
      soul_urge_number: String(op.soul.root),
      soul_urge_compound: String(op.soul.compound),
      personality_number: String(op.personality.root),
      personality_compound: String(op.personality.compound),
      maturity_number: String(maturity),
      chaldean_name_number: String(op.expression.root),
      compound_number: String(op.expression.compound),
      minor_expression_number: String(op.expression.root),
      ...(differs
        ? {
            natal_expression_number: String(nat.expression.root),
            natal_soul_urge_number: String(nat.soul.root),
            natal_personality_number: String(nat.personality.root),
            natal_maturity_number: String(natalMaturity),
            natal_chaldean_name_number: String(nat.expression.root),
          }
        : {}),
    },
    pythagorean: {
      ...report.pythagorean,
      expression: {
        number: op.expression.root,
        meaning: meaningFor(op.expression.root),
      },
      soul_urge: {
        number: op.soul.root,
        meaning: meaningFor(op.soul.root),
      },
      personality: {
        number: op.personality.root,
        meaning: meaningFor(op.personality.root),
      },
      maturity: { number: maturity, meaning: meaningFor(maturity) },
    },
    chaldean: {
      ...report.chaldean,
      name_number: String(op.expression.root),
      compound_number: String(op.expression.compound),
      reduced_number: String(op.expression.root),
    },
    name_engine: op,
  };
}

export function nameEngineOf(report: NumerologyReport): ChaldeanNameSet | null {
  return report.name_engine ?? null;
}
