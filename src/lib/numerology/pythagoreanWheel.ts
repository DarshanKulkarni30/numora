/**
 * Pythagorean Personality Matrix — Western 1–2–3 / 4–5–6 / 7–8–9 planes
 * (not Lo Shu rows). Reflective architecture only — not events, health, or fate.
 */

import { reduceToSingleDigit } from "./dateNumbers";
import { LO_SHU_NUMBER_META } from "./loShuEffects";
import { parseDob, reduceNumber } from "./reduce";
import type { NumerologySnapshot } from "./types";
import { plainJob, plainTrait, plainWatch } from "./layeredCopy";

export type PythAspectTopic =
  | "birth-day"
  | "life-path"
  | "expression"
  | "soul-urge"
  | "personality"
  | "maturity";

export type PythPlaneId = "mental" | "emotional" | "practical";

export type PythEngineStatus = "inPlay" | "partial" | "quiet" | "emphasized";

export type PythAspect = {
  id: string;
  label: string;
  topic: PythAspectTopic;
  raw: string;
  digit: number | null;
  plane: PythPlaneId | null;
};

export type PythPlane = {
  id: PythPlaneId;
  label: string;
  numbers: [number, number, number];
  represents: string;
  score: number;
  chip: string;
  rail: string;
  fill: string;
  stroke: string;
};

export type PythEngine = {
  id: string;
  name: string;
  numbers: [number, number, number];
  origin: PythPlaneId;
  summary: string;
  status: PythEngineStatus;
  strength: number;
  present: number[];
  missing: number[];
};

export type PythGrowth = {
  number: number;
  keyword: string;
  habit: string;
  body: string;
};

export type PythSatellite = {
  id: string;
  short: string;
  label: string;
  raw: string;
  digit: number;
  angle: number;
};

export type PythWheel = {
  aspects: PythAspect[];
  counts: Record<number, number>;
  present: number[];
  missing: number[];
  planes: PythPlane[];
  dominant: PythPlaneId;
  weak: PythPlaneId;
  layerRelation: "synergy" | "tilt" | "contrast";
  engines: PythEngine[];
  growth: PythGrowth[];
  satellites: PythSatellite[];
  tensions: string[];
  architecture: string;
  decisionFlow: string;
  narrative: string;
  contrast: number;
};

export const PYTH_NUMBER_KEYWORD: Record<number, string> = {
  1: "Initiative",
  2: "Cooperation",
  3: "Expression",
  4: "Structure",
  5: "Freedom",
  6: "Care",
  7: "Insight",
  8: "Ambition",
  9: "Compassion",
};

export const WHEEL_CX = 100;
export const WHEEL_CY = 100;
export const NODE_RADIUS = 54;
export const SECTOR_RADIUS = 80;
export const SAT_RADIUS = 92;

/** θ = 0 at 12 o'clock, clockwise, in degrees. */
export const NODE_ANGLE: Record<number, number> = {
  1: 20,
  2: 60,
  3: 100,
  4: 140,
  5: 180,
  6: 220,
  7: 260,
  8: 300,
  9: 340,
};

export function polar(deg: number, r: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return {
    x: WHEEL_CX + r * Math.sin(rad),
    y: WHEEL_CY - r * Math.cos(rad),
  };
}

export function nodePoint(n: number): { x: number; y: number } {
  return polar(NODE_ANGLE[n] ?? 0, NODE_RADIUS);
}

/** Quadratic control so the curve passes through the middle node. */
export function curveThrough(
  a: { x: number; y: number },
  mid: { x: number; y: number },
  b: { x: number; y: number },
): string {
  const cx = 2 * mid.x - 0.5 * (a.x + b.x);
  const cy = 2 * mid.y - 0.5 * (a.y + b.y);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export function planeForDigit(n: number): PythPlaneId | null {
  if (n >= 1 && n <= 3) return "mental";
  if (n >= 4 && n <= 6) return "emotional";
  if (n >= 7 && n <= 9) return "practical";
  return null;
}

const PLANE_META: Record<
  PythPlaneId,
  Omit<PythPlane, "score">
> = {
  mental: {
    id: "mental",
    label: "Mental",
    numbers: [1, 2, 3],
    represents: "cognition, logic, and communication",
    chip: "bg-sky-100 text-sky-900 border-sky-200",
    rail: "bg-sky-100/80 border-sky-200",
    fill: "rgba(186, 230, 253, 0.45)",
    stroke: "rgba(7, 89, 133, 0.35)",
  },
  emotional: {
    id: "emotional",
    label: "Emotional",
    numbers: [4, 5, 6],
    represents: "inner world, relationships, and sensitivity",
    chip: "bg-rose-100 text-rose-900 border-rose-200",
    rail: "bg-rose-100/80 border-rose-200",
    fill: "rgba(254, 205, 211, 0.45)",
    stroke: "rgba(159, 18, 57, 0.32)",
  },
  practical: {
    id: "practical",
    label: "Practical",
    numbers: [7, 8, 9],
    represents: "action, ambition, and execution",
    chip: "bg-emerald-100 text-emerald-900 border-emerald-200",
    rail: "bg-emerald-100/80 border-emerald-200",
    fill: "rgba(167, 243, 208, 0.42)",
    stroke: "rgba(6, 95, 70, 0.32)",
  },
};

const ENGINE_DEFS: Array<{
  id: string;
  name: string;
  numbers: [number, number, number];
  origin: PythPlaneId;
  summary: string;
}> = [
  {
    id: "emotional-current",
    name: "Emotional current",
    numbers: [3, 5, 7],
    origin: "emotional",
    summary:
      "Expression → adaptability → insight. Continuity between speaking, feeling, and reflecting.",
  },
  {
    id: "creative",
    name: "Creative engine",
    numbers: [3, 6, 9],
    origin: "mental",
    summary:
      "Expression → care → compassion. Making and sharing that wants to include others.",
  },
  {
    id: "action",
    name: "Action engine",
    numbers: [1, 4, 7],
    origin: "mental",
    summary:
      "Initiative → structure → insight. Starting, organizing, then checking the work.",
  },
  {
    id: "feeling",
    name: "Feeling engine",
    numbers: [4, 5, 6],
    origin: "emotional",
    summary:
      "Structure → freedom → care. How the inner world holds change and responsibility.",
  },
  {
    id: "spiritual",
    name: "Spiritual engine",
    numbers: [7, 8, 9],
    origin: "practical",
    summary:
      "Insight → ambition → compassion. Inward study meeting outward stewardship.",
  },
];

const DECISION_FLOW: Record<PythPlaneId, string> = {
  mental:
    "This chart often thinks first — name the idea, then check the feeling, then choose a step.",
  emotional:
    "This chart often feels first — notice the inner weather, then give it words, then act.",
  practical:
    "This chart often moves first — take a small step, then review, then name what it meant.",
};

function emptyCounts(): Record<number, number> {
  return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
}

function place(counts: Record<number, number>, raw: string | number) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return;
  const d = reduceToSingleDigit(n);
  if (d >= 1 && d <= 9) counts[d] += 1;
}

function engineStatus(
  numbers: number[],
  counts: Record<number, number>,
): { status: PythEngineStatus; strength: number; present: number[]; missing: number[] } {
  const present = numbers.filter((n) => (counts[n] ?? 0) > 0);
  const missing = numbers.filter((n) => (counts[n] ?? 0) === 0);
  const strength = numbers.reduce((s, n) => s + (counts[n] ?? 0), 0);
  const peak = Math.max(...numbers.map((n) => counts[n] ?? 0));
  let status: PythEngineStatus;
  if (present.length === 0) status = "quiet";
  else if (present.length < 3) status = "partial";
  else if (peak >= 3 || strength >= 6) status = "emphasized";
  else status = "inPlay";
  return { status, strength, present, missing };
}

export function pythagoreanAspects(
  dateOfBirth: string,
  snap: NumerologySnapshot,
): PythAspect[] {
  let dayR = "—";
  let monthR = "—";
  let yearR = "—";
  try {
    const { day, month, year } = parseDob(dateOfBirth);
    dayR = String(reduceNumber(day));
    monthR = String(reduceNumber(month));
    yearR = String(reduceNumber(year));
  } catch {
    /* keep placeholders */
  }

  const rows: Array<{
    id: string;
    label: string;
    topic: PythAspectTopic;
    raw: string;
  }> = [
    { id: "day", label: "Day digit", topic: "birth-day", raw: dayR },
    { id: "month", label: "Month digit", topic: "life-path", raw: monthR },
    { id: "year", label: "Year digit", topic: "life-path", raw: yearR },
    { id: "bn", label: "Birth Day", topic: "birth-day", raw: snap.birth_day },
    { id: "lp", label: "Life Path", topic: "life-path", raw: snap.life_path },
    {
      id: "ex",
      label: "Expression",
      topic: "expression",
      raw: snap.expression_number,
    },
    {
      id: "su",
      label: "Soul Urge",
      topic: "soul-urge",
      raw: snap.soul_urge_number,
    },
    {
      id: "pe",
      label: "Personality",
      topic: "personality",
      raw: snap.personality_number,
    },
    {
      id: "ma",
      label: "Maturity",
      topic: "maturity",
      raw: snap.maturity_number,
    },
  ];

  return rows.map((row) => {
    const n = Number(row.raw);
    const digit =
      Number.isFinite(n) && n > 0 ? reduceToSingleDigit(n) : null;
    return {
      ...row,
      digit,
      plane: digit != null ? planeForDigit(digit) : null,
    };
  });
}

export function buildPythagoreanWheel(
  dateOfBirth: string,
  snap: NumerologySnapshot,
): PythWheel {
  const aspects = pythagoreanAspects(dateOfBirth, snap);
  const counts = emptyCounts();
  for (const a of aspects) {
    if (a.raw !== "—") place(counts, a.raw);
  }

  const present = ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).filter(
    (n) => counts[n] > 0,
  );
  const missing = ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).filter(
    (n) => counts[n] === 0,
  );

  const planes: PythPlane[] = (
    ["mental", "emotional", "practical"] as const
  ).map((id) => {
    const meta = PLANE_META[id];
    const score = meta.numbers.reduce((s, n) => s + counts[n], 0);
    return { ...meta, score };
  });

  const ranked = [...planes].sort((a, b) => b.score - a.score);
  const dominant = ranked[0].id;
  const weak = ranked[2].id;
  const spread = ranked[0].score - ranked[2].score;
  const layerRelation: PythWheel["layerRelation"] =
    spread <= 1 ? "synergy" : spread >= 3 ? "contrast" : "tilt";

  const engines: PythEngine[] = ENGINE_DEFS.map((def) => {
    const extra = engineStatus(def.numbers, counts);
    return { ...def, ...extra };
  });

  const growth: PythGrowth[] = missing.map((n) => {
    const keyword = PYTH_NUMBER_KEYWORD[n];
    const meta = LO_SHU_NUMBER_META[n];
    return {
      number: n,
      keyword,
      habit: meta?.growth ?? "balanced habits",
      body: `A quiet ${n} (${keyword}) is a growth invitation through ${meta?.growth ?? "small practices"} — a practice area, not a missing piece of you.`,
    };
  });

  const satDefs: Array<{
    id: string;
    short: string;
    label: string;
    raw: string;
  }> = [
    { id: "bn", short: "BN", label: "Birth Day", raw: snap.birth_day },
    { id: "lp", short: "LP", label: "Life Path", raw: snap.life_path },
    { id: "ex", short: "EX", label: "Expression", raw: snap.expression_number },
    { id: "su", short: "SU", label: "Soul Urge", raw: snap.soul_urge_number },
    {
      id: "pe",
      short: "PE",
      label: "Personality",
      raw: snap.personality_number,
    },
    { id: "ma", short: "MA", label: "Maturity", raw: snap.maturity_number },
  ];
  const satellites: PythSatellite[] = satDefs.flatMap((s, i) => {
    const n = Number(s.raw);
    if (!Number.isFinite(n) || n <= 0) return [];
    return [
      {
        ...s,
        digit: reduceToSingleDigit(n),
        angle: i * 60,
      },
    ];
  });

  const bn = reduceToSingleDigit(Number(snap.birth_day));
  const lp = reduceToSingleDigit(Number(snap.life_path));
  const su = reduceToSingleDigit(Number(snap.soul_urge_number));
  const pe = reduceToSingleDigit(Number(snap.personality_number));

  const tensions: string[] = [];
  if (Number.isFinite(bn) && Number.isFinite(lp) && bn !== lp) {
    tensions.push(
      `Birth Day ${snap.birth_day} is ${plainTrait(bn)}. Life Path ${snap.life_path} is ${plainTrait(lp)}. Different jobs on the same date — not a second path.`,
    );
  } else if (bn === lp) {
    tensions.push(
      `Your Birth Day and Life Path are both ${snap.life_path}: ${plainTrait(lp)}. That makes you consistent. Watch: treating that one habit as the only option.`,
    );
  }
  if (Number.isFinite(su) && Number.isFinite(pe) && su !== pe) {
    tensions.push(
      `Soul Urge ${snap.soul_urge_number} (${PYTH_NUMBER_KEYWORD[su]}) is the inner want; Personality ${snap.personality_number} (${PYTH_NUMBER_KEYWORD[pe]}) is the face rooms meet first. Use the gap as nuance.`,
    );
  }
  if (layerRelation === "contrast") {
    const d = planes.find((p) => p.id === dominant)!;
    const w = planes.find((p) => p.id === weak)!;
    tensions.push(
      `${d.label} (${d.represents}) currently leads this matrix; ${w.label.toLowerCase()} is quieter. That tilt is a pacing reminder — give the quieter group a little air each week.`,
    );
  } else if (layerRelation === "synergy") {
    tensions.push(
      "Mental, emotional, and practical counts sit close together — a relatively even personality architecture on this chart.",
    );
  }

  const mentalScore = planes.find((p) => p.id === "mental")!.score;
  const practicalScore = planes.find((p) => p.id === "practical")!.score;
  if (counts[7] >= 2 && counts[3] >= 1) {
    tensions.push(
      "Insight (7) is emphasized beside expression (3) — a reflective pull toward solitude can sit next to a wish to be seen. Alternate quiet and sharing, rather than choosing one forever.",
    );
  } else if (mentalScore >= practicalScore + 2) {
    tensions.push(
      "Thinking currently outweighs doing on this chart. Small finished steps help the mental plane land in the room.",
    );
  }

  const contrastParts = [
    bn !== lp ? 1 : 0,
    su !== pe ? 1 : 0,
    layerRelation === "contrast" ? 1 : 0,
  ];
  const contrast = Math.round((contrastParts.reduce((s, n) => s + n, 0) / 3) * 100);

  const dom = planes.find((p) => p.id === dominant)!;
  const wk = planes.find((p) => p.id === weak)!;
  const relationLine =
    layerRelation === "synergy"
      ? "The three layers support one another rather than competing."
      : layerRelation === "contrast"
        ? `${dom.label} is your strongest area; ${wk.label.toLowerCase()} is the one to practise deliberately.`
        : `${dom.label} leans forward, with ${wk.label.toLowerCase()} a step behind.`;

  const inPlay = engines.filter(
    (e) => e.status === "inPlay" || e.status === "emphasized",
  );
  const engineLine = inPlay.length
    ? `In-play currents: ${inPlay.map((e) => e.name.toLowerCase()).join(", ")}.`
    : "No complete three-number current is fully in play — partial paths still count as invitations.";

  const architecture = `${dom.label} is the leading layer (${dom.represents}). ${relationLine} ${engineLine} Weather language only.`;

  const narrative = `Birth Day ${snap.birth_day} (${plainTrait(bn)}) → Life Path ${snap.life_path} (${plainTrait(lp)}). Try: ${plainJob(lp)}. Watch: ${plainWatch(bn)}.`;

  return {
    aspects,
    counts,
    present,
    missing,
    planes,
    dominant,
    weak,
    layerRelation,
    engines,
    growth,
    satellites,
    tensions,
    architecture,
    decisionFlow: DECISION_FLOW[dominant],
    narrative,
    contrast,
  };
}

export function pythagoreanWheelPdfLines(wheel: PythWheel): string[] {
  const planeLine = wheel.planes
    .map((p) => `${p.label} ${p.score}`)
    .join(" · ");
  const missingLine = wheel.missing.length
    ? `Growth halos (quiet numbers): ${wheel.growth.map((g) => `${g.number} ${g.keyword}`).join(", ")}.`
    : "Every digit 1–9 appears at least once on this matrix.";
  const engineLine = wheel.engines
    .filter((e) => e.status === "inPlay" || e.status === "emphasized")
    .map((e) => `${e.name} (${e.numbers.join("–")})`)
    .join("; ");
  return [
    `Pythagorean personality wheel — Western planes 1–2–3 / 4–5–6 / 7–8–9 (not Lo Shu rows). ${planeLine}.`,
    wheel.architecture,
    missingLine,
    engineLine
      ? `Currents in play: ${engineLine}.`
      : "No complete current is fully in play.",
    wheel.decisionFlow,
    wheel.narrative,
  ];
}

export function engineStatusLabel(status: PythEngineStatus): string {
  if (status === "inPlay") return "In play";
  if (status === "emphasized") return "Emphasized";
  if (status === "partial") return "Partial";
  return "Quiet";
}
