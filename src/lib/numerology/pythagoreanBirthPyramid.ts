/**
 * Pythagorean Birth Pyramid — upright 4-base cascade (DD·MM·YY·YY).
 * Distinct from inverted Trigonum (Day·Month·Year). Reflective only.
 *
 * Rule: foundation compounds = reduced segment digits.
 * Higher rows: compound = left.compound + right.compound; digit = reduce(compound).
 */

import { reduceToSingleDigit } from "./dateNumbers";
import { CORE_TRAIT } from "./meanings";
import { parseDob } from "./reduce";

export type PyramidLevelId =
  | "foundation"
  | "interaction"
  | "polarity"
  | "synthesis";

export type PyramidNode = {
  id: string;
  level: PyramidLevelId;
  levelIndex: number;
  index: number;
  compound: number;
  value: number;
  label: string;
  formula: string;
  archetype: string;
  narrative: string;
};

export type PyramidLevel = {
  id: PyramidLevelId;
  label: string;
  blurb: string;
  nodes: PyramidNode[];
};

export type BirthPyramidSegment = {
  label: string;
  raw: number;
  reduced: number;
};

export type PythagoreanBirthPyramid = {
  day: number;
  month: number;
  year: number;
  segments: BirthPyramidSegment[];
  levels: PyramidLevel[];
  /** Flat list bottom→top for rendering */
  nodes: PyramidNode[];
  edges: { from: string; to: string }[];
  apex: { compound: number; value: number; archetype: string };
  polarity: { left: number; right: number };
  dominant: number[];
  keyTheme: string;
  disclaimer: string;
  blueprintLines: string[];
};

const ARCHETYPE: Record<number, { name: string; short: string }> = {
  1: { name: "Leadership", short: "Independence, initiative" },
  2: { name: "Cooperation", short: "Harmony, diplomacy" },
  3: { name: "Expression", short: "Creativity, communication" },
  4: { name: "Structure", short: "Discipline, stability" },
  5: { name: "Freedom", short: "Adaptability, change" },
  6: { name: "Care", short: "Responsibility, nurture" },
  7: { name: "Insight", short: "Analysis, reflection" },
  8: { name: "Power", short: "Authority, ambition" },
  9: { name: "Humanitarian", short: "Compassion, wisdom" },
};

const LEVEL_META: Record<
  PyramidLevelId,
  { label: string; blurb: string }
> = {
  foundation: {
    label: "Foundation",
    blurb: "Birth-date building blocks (day, month, year halves).",
  },
  interaction: {
    label: "Interaction",
    blurb: "How adjacent foundation tones combine.",
  },
  polarity: {
    label: "Polarity",
    blurb: "Core balance pair before synthesis.",
  },
  synthesis: {
    label: "Synthesis",
    blurb: "Apex life-synthesis tone of this pyramid (not Life Path).",
  },
};

function digitSum(n: number): number {
  return String(Math.abs(Math.trunc(n)))
    .split("")
    .reduce((s, d) => s + Number(d), 0);
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function arch(n: number) {
  return ARCHETYPE[n] ?? ARCHETYPE[1];
}

export function buildPythagoreanBirthPyramid(
  dob: string,
): PythagoreanBirthPyramid {
  const { day, month, year } = parseDob(dob);
  const yy = Math.trunc(year);
  const yearHi = Math.floor(yy / 100);
  const yearLo = yy % 100;

  const segmentDefs = [
    { label: "Day", raw: day },
    { label: "Month", raw: month },
    { label: "Year (high)", raw: yearHi },
    { label: "Year (low)", raw: yearLo },
  ];

  const segments: BirthPyramidSegment[] = segmentDefs.map((s) => ({
    label: s.label,
    raw: s.raw,
    reduced: reduceToSingleDigit(digitSum(s.raw)),
  }));

  // Foundation: compound = reduced
  let row: { compound: number; value: number; formula: string; label: string }[] =
    segments.map((s) => ({
      compound: s.reduced,
      value: s.reduced,
      formula: `${pad2(s.raw)} → ${s.reduced}`,
      label: s.label,
    }));

  const levelRows: {
    id: PyramidLevelId;
    row: typeof row;
  }[] = [{ id: "foundation", row }];

  const nextIds: PyramidLevelId[] = [
    "interaction",
    "polarity",
    "synthesis",
  ];
  for (const levelId of nextIds) {
    const next = [];
    for (let i = 0; i < row.length - 1; i++) {
      const compound = row[i].compound + row[i + 1].compound;
      const value = reduceToSingleDigit(compound);
      next.push({
        compound,
        value,
        formula: `${row[i].compound}+${row[i + 1].compound}=${compound}→${value}`,
        label: LEVEL_META[levelId].label,
      });
    }
    levelRows.push({ id: levelId, row: next });
    row = next;
  }

  const nodes: PyramidNode[] = [];
  const levels: PyramidLevel[] = [];
  const edges: { from: string; to: string }[] = [];

  levelRows.forEach((lr, levelIndex) => {
    const meta = LEVEL_META[lr.id];
    const levelNodes: PyramidNode[] = lr.row.map((cell, index) => {
      const id = `${lr.id}-${index}`;
      const a = arch(cell.value);
      const showCompound = cell.compound !== cell.value;
      const node: PyramidNode = {
        id,
        level: lr.id,
        levelIndex,
        index,
        compound: cell.compound,
        value: cell.value,
        label: cell.label,
        formula: cell.formula,
        archetype: a.name,
        narrative: showCompound
          ? `${meta.label}: ${cell.compound}/${cell.value} — ${a.name} (${a.short}).`
          : `${meta.label}: ${cell.value} — ${a.name} (${a.short}).`,
      };
      nodes.push(node);
      return node;
    });
    levels.push({
      id: lr.id,
      label: meta.label,
      blurb: meta.blurb,
      nodes: levelNodes,
    });

    if (levelIndex > 0) {
      const parents = levels[levelIndex - 1].nodes;
      for (let i = 0; i < levelNodes.length; i++) {
        edges.push({ from: parents[i].id, to: levelNodes[i].id });
        edges.push({ from: parents[i + 1].id, to: levelNodes[i].id });
      }
    }
  });

  const apexNode = levels[levels.length - 1].nodes[0];
  const polarity = levels.find((l) => l.id === "polarity")?.nodes ?? [];
  const foundation = levels[0].nodes.map((n) => n.value);
  const dominant = [...new Set(foundation)];

  const themeBits = [
    arch(foundation[0] ?? 1).name,
    polarity.length === 2
      ? `${polarity[0].value}↔${polarity[1].value}`
      : "",
    arch(apexNode.value).name,
  ].filter(Boolean);

  const disclaimer =
    "Birth Pyramid is a reflective upright digit cascade from day, month, and year halves—not Life Path, and not a prediction of events or outcomes.";

  const blueprintLines = [
    `Birth Pyramid · ${pad2(day)}/${pad2(month)}/${year}`,
    `Foundation: ${segments.map((s) => `${pad2(s.raw)}→${s.reduced}`).join(" · ")}`,
    ...levels.slice(1).map(
      (l) =>
        `${l.label}: ${l.nodes.map((n) => (n.compound !== n.value ? `${n.compound}/${n.value}` : String(n.value))).join(" · ")}`,
    ),
    `Apex synthesis ${apexNode.compound}/${apexNode.value} (${apexNode.archetype})`,
    polarity.length === 2
      ? `Polarity balance ${polarity[0].compound}/${polarity[0].value} ↔ ${polarity[1].compound}/${polarity[1].value}`
      : "",
    disclaimer,
  ].filter(Boolean);

  return {
    day,
    month,
    year,
    segments,
    levels,
    nodes,
    edges,
    apex: {
      compound: apexNode.compound,
      value: apexNode.value,
      archetype: apexNode.archetype,
    },
    polarity: {
      left: polarity[0]?.value ?? 0,
      right: polarity[1]?.value ?? 0,
    },
    dominant,
    keyTheme: themeBits.join(" → "),
    disclaimer,
    blueprintLines,
  };
}

/** SVG positions: upright pyramid, foundation at bottom */
export function pyramidNodePositions(
  levels: PyramidLevel[],
  width = 320,
  height = 260,
): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {};
  const top = 36;
  const bottom = height - 28;
  const nLevels = levels.length;
  levels.forEach((level, li) => {
    // li 0 = foundation at bottom
    const y =
      nLevels <= 1
        ? (top + bottom) / 2
        : bottom - (li / (nLevels - 1)) * (bottom - top);
    const count = level.nodes.length;
    const span = width * 0.78;
    const start = (width - span) / 2;
    level.nodes.forEach((node, i) => {
      const x =
        count === 1
          ? width / 2
          : start + (i / (count - 1)) * span;
      pos[node.id] = { x, y };
    });
  });
  return pos;
}
