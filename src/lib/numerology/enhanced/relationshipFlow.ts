import { assertSafeCopy } from "@/lib/numerology/safety";
import type { NumerologySnapshot } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";
import { traitLabel } from "./themeGraph";

export type FlowNode = {
  id: string;
  label: string;
  number: number;
  trait: string;
};

export type RelationshipFlow = {
  primary: FlowNode[];
  primaryNarrative: string;
  secondary: FlowNode[];
  secondaryNarrative: string;
};

export function buildRelationshipFlow(snap: NumerologySnapshot): RelationshipFlow {
  const bd = must(snap.birth_day);
  const expr = must(snap.expression_number);
  const lp = must(snap.life_path);
  const mat = must(snap.maturity_number);
  const soul = must(snap.soul_urge_number);
  const pers = must(snap.personality_number);

  const primary: FlowNode[] = [
    node("birth", "Birth Day", bd),
    node("expression", "Expression", expr),
    node("path", "Life Path", lp),
    node("maturity", "Maturity", mat),
  ];

  const secondary: FlowNode[] = [
    node("soul", "Soul Urge", soul),
    node("personality", "Personality", pers),
  ];

  const primaryNarrative = assertSafeCopy(
    `Early emphasis (${bd}, ${traitLabel(bd)}) may push toward a working craft (${expr}, ${traitLabel(expr)}). That craft becomes a way of walking the longer path (${lp}, ${traitLabel(lp)}). Maturity ${mat} (${traitLabel(mat)}) may describe how the same material deepens with experience—not a later personality swap.`,
    "enhanced.flow.primary",
  );

  const secondaryNarrative = assertSafeCopy(
    soul === pers
      ? `Soul Urge ${soul} and Personality ${pers} agree, which may feel like inner wish and outer manner sharing a room.`
      : `Soul Urge ${soul} (${traitLabel(soul)}) and Personality ${pers} (${traitLabel(pers)}) differ. Inner and outer are in conversation: neither needs to win.`,
    "enhanced.flow.secondary",
  );

  return { primary, primaryNarrative, secondary, secondaryNarrative };
}

function must(raw: string): number {
  return parseChartNumber(raw) ?? 9;
}

function node(id: string, label: string, number: number): FlowNode {
  return { id, label, number, trait: traitLabel(number) };
}
