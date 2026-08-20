/**
 * Pythagorean Trigonum (inverted birth triangle).
 * Cascades day / month / year digits into six nodes A–F (all 1–9).
 * Reflective only — not predictive, medical, or legal advice.
 */

import { reduceToSingleDigit } from "./dateNumbers";
import { CORE_TRAIT } from "./meanings";
import { parseDob } from "./reduce";

export type TrigonumNodeId = "A" | "B" | "C" | "D" | "E" | "F";

export type TrigonumEnergyBand = "action" | "analytical" | "nurturing";

export type TrigonumNode = {
  id: TrigonumNodeId;
  label: string;
  role: string;
  value: number;
  /** Pre-reduce sum when useful for formula display */
  compound?: number;
  formula: string;
  plane: "mental" | "emotional" | "physical" | "apex";
  band: TrigonumEnergyBand;
  archetype: string;
  narrative: string;
};

export type TrigonumPlane = {
  id: "mental" | "emotional" | "physical";
  label: string;
  nodeIds: TrigonumNodeId[];
  values: number[];
  /** 0–100 scannable intensity (avg digit/9) */
  percent: number;
  summary: string;
};

export type PythagoreanTrigonum = {
  day: number;
  month: number;
  year: number;
  nodes: Record<TrigonumNodeId, TrigonumNode>;
  order: TrigonumNodeId[];
  planes: TrigonumPlane[];
  repeats: { digit: number; count: number }[];
  missing: number[];
  apex: number;
  disclaimer: string;
  blueprintLines: string[];
};

const ARCHETYPE: Record<number, { name: string; line: string }> = {
  1: {
    name: "The Leader",
    line: "Independence and initiating action — watch stubbornness when pace runs hot.",
  },
  2: {
    name: "The Diplomat",
    line: "Cooperation and peacemaking — intuition rises; indecision can stall.",
  },
  3: {
    name: "The Creator",
    line: "Expression and social warmth — focus may scatter without a chosen craft.",
  },
  4: {
    name: "The Planner",
    line: "Discipline and stability — rigidity softens when plans stay human.",
  },
  5: {
    name: "The Catalyst",
    line: "Freedom and versatility — bridge others; scatter is the risk.",
  },
  6: {
    name: "The Nurturer",
    line: "Responsibility and care — worry eases when boundaries are clear.",
  },
  7: {
    name: "The Seeker",
    line: "Analysis and solitary wisdom — aloofness softens with shared insight.",
  },
  8: {
    name: "The Executive",
    line: "Authority and stewardship — power works best with recovery built in.",
  },
  9: {
    name: "The Humanist",
    line: "Compassion and wide vision — idealism needs one grounded next step.",
  },
};

function bandFor(n: number): TrigonumEnergyBand {
  if (n === 1 || n === 5 || n === 8) return "action";
  if (n === 3 || n === 7) return "analytical";
  return "nurturing";
}

function reduceParts(value: number): { compound: number; reduced: number } {
  const compound = Math.abs(Math.trunc(value));
  return { compound, reduced: reduceToSingleDigit(compound) };
}

function yearDigitSum(year: number): number {
  return String(Math.abs(Math.trunc(year)))
    .split("")
    .reduce((s, d) => s + Number(d), 0);
}

function planePercent(values: number[]): number {
  if (!values.length) return 0;
  const avg = values.reduce((s, v) => s + v / 9, 0) / values.length;
  return Math.round(Math.min(100, Math.max(0, avg * 100)));
}

function nodeNarrative(
  id: TrigonumNodeId,
  value: number,
  role: string,
): string {
  const arch = ARCHETYPE[value] ?? ARCHETYPE[1];
  const trait = (CORE_TRAIT[value] ?? arch.name).toLowerCase();
  if (id === "F") {
    return `Apex root ${value} (${arch.name}) gathers the triangle into a core destiny tone of this chart — ${trait}. Distinct from Pythagorean Life Path; read as this triangle’s synthesis.`;
  }
  return `${role}: ${value} · ${arch.name}. ${arch.line}`;
}

export function buildPythagoreanTrigonum(dob: string): PythagoreanTrigonum {
  const { day, month, year } = parseDob(dob);

  const a = reduceParts(day);
  const b = reduceParts(month);
  const c = reduceParts(yearDigitSum(year));
  const d = reduceParts(a.reduced + b.reduced);
  const e = reduceParts(b.reduced + c.reduced);
  const f = reduceParts(d.reduced + e.reduced);

  const make = (
    id: TrigonumNodeId,
    label: string,
    role: string,
    reduced: number,
    compound: number,
    formula: string,
    plane: TrigonumNode["plane"],
  ): TrigonumNode => {
    const arch = ARCHETYPE[reduced] ?? ARCHETYPE[1];
    return {
      id,
      label,
      role,
      value: reduced,
      compound,
      formula,
      plane,
      band: bandFor(reduced),
      archetype: arch.name,
      narrative: nodeNarrative(id, reduced, role),
    };
  };

  const nodes: Record<TrigonumNodeId, TrigonumNode> = {
    A: make(
      "A",
      "Day",
      "Day number — mental tone seed",
      a.reduced,
      a.compound,
      `Day ${day} → ${a.reduced}`,
      "mental",
    ),
    B: make(
      "B",
      "Month",
      "Month number — mental / creative frame",
      b.reduced,
      b.compound,
      `Month ${month} → ${b.reduced}`,
      "mental",
    ),
    C: make(
      "C",
      "Year",
      "Year number — physical / worldly seed",
      c.reduced,
      c.compound,
      `Year ${year} digits → ${c.reduced}`,
      "physical",
    ),
    D: make(
      "D",
      "Mind–Heart",
      "Mind–Heart bridge (A+B)",
      d.reduced,
      d.compound,
      `A(${a.reduced}) + B(${b.reduced}) → ${d.reduced}`,
      "emotional",
    ),
    E: make(
      "E",
      "Heart–World",
      "Heart–World bridge (B+C)",
      e.reduced,
      e.compound,
      `B(${b.reduced}) + C(${c.reduced}) → ${e.reduced}`,
      "emotional",
    ),
    F: make(
      "F",
      "Apex",
      "Root destiny of this triangle (D+E)",
      f.reduced,
      f.compound,
      `D(${d.reduced}) + E(${e.reduced}) → ${f.reduced}`,
      "apex",
    ),
  };

  const order: TrigonumNodeId[] = ["A", "B", "C", "D", "E", "F"];
  const values = order.map((id) => nodes[id].value);

  const count = new Map<number, number>();
  for (const v of values) count.set(v, (count.get(v) ?? 0) + 1);
  const repeats = [...count.entries()]
    .filter(([, n]) => n >= 3)
    .map(([digit, n]) => ({ digit, count: n }))
    .sort((x, y) => y.count - x.count);
  const present = new Set(values);
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !present.has(n));

  const mentalVals = [nodes.A.value, nodes.B.value];
  const emotionalVals = [nodes.D.value, nodes.E.value];
  const physicalVals = [nodes.C.value, nodes.F.value];

  const planes: TrigonumPlane[] = [
    {
      id: "mental",
      label: "Mental",
      nodeIds: ["A", "B"],
      values: mentalVals,
      percent: planePercent(mentalVals),
      summary:
        "Thoughts, creativity, memory, and intellectual processing (Day + Month).",
    },
    {
      id: "emotional",
      label: "Emotional",
      nodeIds: ["D", "E"],
      values: emotionalVals,
      percent: planePercent(emotionalVals),
      summary:
        "Heart, intuition, relationships, and subconscious reaction (inner bridges).",
    },
    {
      id: "physical",
      label: "Physical",
      nodeIds: ["C", "F"],
      values: physicalVals,
      percent: planePercent(physicalVals),
      summary:
        "Worldly execution, career tone, and how plans land (Year + Apex).",
    },
  ];

  const disclaimer =
    "Pythagorean Trigonum is a reflective Western digit-cascade chart from your birth date—not a prediction of events, health, wealth, or destiny. Apex root is distinct from Life Path.";

  const blueprintLines = [
    `Pythagorean Trigonum · DOB ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`,
    `Top: A${nodes.A.value} · B${nodes.B.value} · C${nodes.C.value}`,
    `Inner: D${nodes.D.value} · E${nodes.E.value} → Apex F${nodes.F.value} (${nodes.F.archetype})`,
    ...planes.map(
      (p) =>
        `${p.label} plane ${p.percent}% · nodes ${p.values.join(", ")} — ${p.summary}`,
    ),
    repeats.length
      ? `Amplified: ${repeats.map((r) => `${r.digit}×${r.count}`).join(", ")}`
      : "No digit appears 3+ times.",
    missing.length
      ? `Quiet / missing in triangle: ${missing.join(", ")} — practice tones, not deficits.`
      : "All digits 1–9 appear at least once in this triangle.",
    disclaimer,
  ];

  return {
    day,
    month,
    year,
    nodes,
    order,
    planes,
    repeats,
    missing,
    apex: f.reduced,
    disclaimer,
    blueprintLines,
  };
}

/** Parents / children for highlight isolation */
export const TRIGONUM_EDGES: {
  from: TrigonumNodeId;
  to: TrigonumNodeId;
}[] = [
  { from: "A", to: "D" },
  { from: "B", to: "D" },
  { from: "B", to: "E" },
  { from: "C", to: "E" },
  { from: "D", to: "F" },
  { from: "E", to: "F" },
];

export function trigonumRelated(
  id: TrigonumNodeId,
): { parents: TrigonumNodeId[]; children: TrigonumNodeId[] } {
  const parents = TRIGONUM_EDGES.filter((e) => e.to === id).map((e) => e.from);
  const children = TRIGONUM_EDGES.filter((e) => e.from === id).map((e) => e.to);
  return { parents, children };
}
