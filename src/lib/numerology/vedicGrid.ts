/**
 * Vedic Ank Kundli — 3×3 numeroscope (not Lo Shu).
 * Unique DOB digits only; century year ignored; no stacked repeats.
 */

import { parseDob } from "./reduce";
import { assertSafeCopy } from "./safety";

export type GridStatus = "Amazing" | "Good" | "Neutral" | "Bad" | "Defeat";

export type GridPatternKind = "yoga" | "trikon" | "drishti" | "yuti" | "void";

export type GridPattern = {
  id: string;
  kind: GridPatternKind;
  name: string;
  numbers: number[];
  status: GridStatus;
  trait: string;
};

export type VedicGridCell = {
  number: number;
  sanskrit: string;
  english: string;
};

/** Fixed Ank Kundli layout: rows top → bottom. */
export const VEDIC_GRID_ORDER: number[][] = [
  [3, 6, 2],
  [1, 7, 8],
  [9, 5, 4],
];

export const VEDIC_GRID_CELL: Record<number, VedicGridCell> = {
  1: { number: 1, sanskrit: "Surya", english: "Sun" },
  2: { number: 2, sanskrit: "Chandra", english: "Moon" },
  3: { number: 3, sanskrit: "Guru", english: "Jupiter" },
  4: { number: 4, sanskrit: "Rahu", english: "Rahu" },
  5: { number: 5, sanskrit: "Budha", english: "Mercury" },
  6: { number: 6, sanskrit: "Shukra", english: "Venus" },
  7: { number: 7, sanskrit: "Ketu", english: "Ketu" },
  8: { number: 8, sanskrit: "Shani", english: "Saturn" },
  9: { number: 9, sanskrit: "Mangal", english: "Mars" },
};

export const GRID_STATUS_ORDER: GridStatus[] = [
  "Amazing",
  "Good",
  "Neutral",
  "Bad",
  "Defeat",
];

export const GRID_KIND_LABEL: Record<GridPatternKind, string> = {
  yoga: "Yoga",
  trikon: "Trikon",
  drishti: "4th Drishti",
  yuti: "Yuti",
  void: "Gap",
};

const LINEAR_YOGAS: GridPattern[] = [
  {
    id: "yoga-intellectual",
    kind: "yoga",
    name: "Intellectual Plane",
    numbers: [3, 6, 2],
    status: "Amazing",
    trait:
      "Visionary capacity, mental clarity, conceptual strategy, and aesthetic wisdom.",
  },
  {
    id: "yoga-will",
    kind: "yoga",
    name: "Will / Resilience Plane",
    numbers: [1, 7, 8],
    status: "Neutral",
    trait:
      "Endurance under strain and unyielding determination. Isolation can show up too—treat that as a cue to rest and reconnect, not a verdict.",
  },
  {
    id: "yoga-practical",
    kind: "yoga",
    name: "Practical / Action Plane",
    numbers: [9, 5, 4],
    status: "Good",
    trait:
      "Execution drive, real-world problem-solving, and stamina for getting things done.",
  },
  {
    id: "yoga-soul",
    kind: "yoga",
    name: "Soul / Sovereignty Plane",
    numbers: [3, 1, 9],
    status: "Amazing",
    trait:
      "Leadership presence, a strong moral code, respect from others, and governance traits.",
  },
  {
    id: "yoga-commercial",
    kind: "yoga",
    name: "Commercial / Trade Plane",
    numbers: [6, 7, 5],
    status: "Good",
    trait:
      "Diplomacy, communication, and business or negotiation instincts.",
  },
  {
    id: "yoga-material",
    kind: "yoga",
    name: "Material / Asset Plane",
    numbers: [2, 8, 4],
    status: "Neutral",
    trait:
      "Assets tend to gather through steady labor. Obstacles are common; patience is part of the pattern.",
  },
  {
    id: "yoga-kalsarp",
    kind: "yoga",
    name: "Kalsarp / Success Plane",
    numbers: [3, 7, 4],
    status: "Amazing",
    trait:
      "Sudden breakthroughs in work or research, with skill at complex analytical models.",
  },
  {
    id: "yoga-volatility",
    kind: "yoga",
    name: "Volatility Plane",
    numbers: [2, 7, 9],
    status: "Defeat",
    trait:
      "Inner unrest and stop-start paths. Mood can swing; pace yourself and keep one steady anchor.",
  },
];

const TRIKON_YOGAS: GridPattern[] = [
  {
    id: "trikon-advisory",
    kind: "trikon",
    name: "Advisory Master",
    numbers: [3, 7, 5],
    status: "Amazing",
    trait:
      "Conceptual wisdom with sharp analysis and clear public presentation.",
  },
  {
    id: "trikon-wealth",
    kind: "trikon",
    name: "Wealth Catalyst",
    numbers: [6, 7, 4],
    status: "Amazing",
    trait:
      "Unconventional asset-building and a knack for scaling outside the usual path.",
  },
  {
    id: "trikon-sovereign",
    kind: "trikon",
    name: "Sovereign Shield",
    numbers: [1, 7, 9],
    status: "Good",
    trait:
      "Protective leadership under pressure; less easily boxed in by red tape.",
  },
  {
    id: "trikon-karmic",
    kind: "trikon",
    name: "Karmic Anchor",
    numbers: [2, 7, 8],
    status: "Neutral",
    trait:
      "A high threshold for long efforts. Early delays are common; stability often arrives later.",
  },
  {
    id: "trikon-chaos",
    kind: "trikon",
    name: "Chaos Vortex",
    numbers: [9, 7, 4],
    status: "Defeat",
    trait:
      "Heat, unpredictability, and conflict risk in work or life patterns. Pace yourself and keep clear boundaries—not a prediction of harm.",
  },
  {
    id: "trikon-budhaditya",
    kind: "trikon",
    name: "Budhaditya Core",
    numbers: [3, 1, 5],
    status: "Amazing",
    trait:
      "Intellectual authority, a love of learning, and commanding communication.",
  },
  {
    id: "trikon-material",
    kind: "trikon",
    name: "Material Matrix",
    numbers: [6, 8, 4],
    status: "Good",
    trait:
      "Drive to build physical assets and operate at a large, practical scale.",
  },
];

const DRISHTI: GridPattern[] = [
  {
    id: "drishti-3-7",
    kind: "drishti",
    name: "Illuminator Gate (3 → 7)",
    numbers: [3, 7],
    status: "Amazing",
    trait:
      "Jupiter onto Ketu: wisdom checks raw analysis and eases isolated overthinking.",
  },
  {
    id: "drishti-1-5",
    kind: "drishti",
    name: "Budhaditya Execution (1 → 5)",
    numbers: [1, 5],
    status: "Amazing",
    trait:
      "Sun onto Mercury: identity fuels communication—clear pitches and public presence.",
  },
  {
    id: "drishti-9-8",
    kind: "drishti",
    name: "Structural Gridlock (9 → 8)",
    numbers: [9, 8],
    status: "Defeat",
    trait:
      "Mars onto Saturn: drive meeting delay. Bottlenecks ask for pacing and simpler plans.",
  },
  {
    id: "drishti-6-1",
    kind: "drishti",
    name: "Ego-Luxury Fracture (6 → 1)",
    numbers: [6, 1],
    status: "Bad",
    trait:
      "Venus onto Sun: aesthetics pulling against strict rules—inner identity tension.",
  },
  {
    id: "drishti-7-4",
    kind: "drishti",
    name: "Karmic Severance (7 → 4)",
    numbers: [7, 4],
    status: "Defeat",
    trait:
      "Ketu onto Rahu: inner research detaching from outer execution—aim can drift.",
  },
  {
    id: "drishti-5-2",
    kind: "drishti",
    name: "Elastic Synthesis (5 → 2)",
    numbers: [5, 2],
    status: "Good",
    trait:
      "Mercury onto Moon: logic supporting feeling—adaptive, composed responses.",
  },
  {
    id: "drishti-2-8",
    kind: "drishti",
    name: "Moon–Saturn Strain (2 → 8)",
    numbers: [2, 8],
    status: "Bad",
    trait:
      "Moon onto Saturn: soft needs meeting rigid blocks. Fatigue is a cue to rest and structure.",
  },
  {
    id: "drishti-8-4",
    kind: "drishti",
    name: "Hidden Limitation (8 → 4)",
    numbers: [8, 4],
    status: "Defeat",
    trait:
      "Saturn onto Rahu: heavy limits on shadow desires—constraints that stay out of view.",
  },
];

const YUTIS: GridPattern[] = [
  {
    id: "yuti-1-2",
    kind: "yuti",
    name: "Sun + Moon",
    numbers: [1, 2],
    status: "Bad",
    trait:
      "Psychological friction and mood swings; tension with parental figures can be a theme.",
  },
  {
    id: "yuti-1-9",
    kind: "yuti",
    name: "Sun + Mars",
    numbers: [1, 9],
    status: "Amazing",
    trait:
      "Inner fire, courage, a hunger to learn, and dynamic public leadership.",
  },
  {
    id: "yuti-3-8",
    kind: "yuti",
    name: "Jupiter + Saturn",
    numbers: [3, 8],
    status: "Good",
    trait:
      "Strategic advisory skill and affinity for hidden sciences; success often after delay.",
  },
  {
    id: "yuti-5-9",
    kind: "yuti",
    name: "Mercury + Mars",
    numbers: [5, 9],
    status: "Good",
    trait: "Fast execution and quick problem-solving under pressure.",
  },
  {
    id: "yuti-6-9",
    kind: "yuti",
    name: "Venus + Mars",
    numbers: [6, 9],
    status: "Bad",
    trait:
      "Relational heat and intense routines. Closeness may run hot and cold—care and pacing help.",
  },
  {
    id: "yuti-8-4",
    kind: "yuti",
    name: "Saturn + Rahu",
    numbers: [8, 4],
    status: "Defeat",
    trait:
      "Environmental stress and uphill effort. Life can feel like constant processing.",
  },
  {
    id: "yuti-3-6",
    kind: "yuti",
    name: "Jupiter + Venus",
    numbers: [3, 6],
    status: "Neutral",
    trait:
      "Inner pull between moral ideals and material comfort; high creative capacity.",
  },
  {
    id: "yuti-1-7",
    kind: "yuti",
    name: "Sun + Ketu",
    numbers: [1, 7],
    status: "Bad",
    trait:
      "Identity detachment; a preference for quiet, behind-the-scenes work.",
  },
  {
    id: "yuti-5-6",
    kind: "yuti",
    name: "Mercury + Venus",
    numbers: [5, 6],
    status: "Amazing",
    trait:
      "Charm, ease with beauty or luxury, and a communication style people warm to.",
  },
];

const VOIDS: GridPattern[] = [
  {
    id: "void-center",
    kind: "void",
    name: "The Void Grid",
    numbers: [7],
    status: "Bad",
    trait:
      "Empty center (no 7). Fewer permanent inner anchors—cultivate one steady practice.",
  },
  {
    id: "void-action-row",
    kind: "void",
    name: "Zero Execution",
    numbers: [9, 5, 4],
    status: "Defeat",
    trait:
      "Empty action row (no 9, 5, or 4). Ideas may outrun follow-through—pair vision with small physical steps.",
  },
  {
    id: "void-soul-column",
    kind: "void",
    name: "Broken Authority",
    numbers: [3, 1, 9],
    status: "Defeat",
    trait:
      "Empty soul column (no 3, 1, or 9). Standing firm and protecting boundaries may take more practice.",
  },
];

for (const p of [...LINEAR_YOGAS, ...TRIKON_YOGAS, ...DRISHTI, ...YUTIS, ...VOIDS]) {
  assertSafeCopy(p.trait, `vedicGrid:${p.id}`);
  assertSafeCopy(p.name, `vedicGrid:${p.id}:name`);
}

function digitsFromPart(n: number): number[] {
  return String(Math.abs(Math.trunc(n)))
    .split("")
    .map(Number)
    .filter((d) => d >= 1 && d <= 9);
}

/** Unique 1–9 digits from day, month, and year%100 (century dropped). */
export function vedicGridDigitsFromDob(dob: string): number[] {
  const { day, month, year } = parseDob(dob);
  const shortYear = year % 100;
  const set = new Set<number>();
  for (const d of [
    ...digitsFromPart(day),
    ...digitsFromPart(month),
    ...digitsFromPart(shortYear),
  ]) {
    set.add(d);
  }
  return [...set].sort((a, b) => a - b);
}

function allPresent(set: Set<number>, numbers: number[]): boolean {
  return numbers.every((n) => set.has(n));
}

function allAbsent(set: Set<number>, numbers: number[]): boolean {
  return numbers.every((n) => !set.has(n));
}

export type VedicGridResult = {
  present: number[];
  missing: number[];
  presentPatterns: GridPattern[];
  voids: GridPattern[];
  mixedReading: string | null;
};

export const MIXED_READING =
  "This chart holds both Amazing ease and Defeat friction. Read both—neither cancels the other.";

export const VEDIC_GRID_NOTE =
  "Ank Kundli from unique birth-date digits (century year ignored). This is not Lo Shu, and it is not a kundli of houses or dashas. Reflective pattern notes only.";

export function calculateVedicGrid(dob: string): VedicGridResult {
  const present = vedicGridDigitsFromDob(dob);
  const set = new Set(present);
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !set.has(n));

  const presentPatterns = [
    ...LINEAR_YOGAS,
    ...TRIKON_YOGAS,
    ...DRISHTI,
    ...YUTIS,
  ].filter((p) => allPresent(set, p.numbers));

  const voids = VOIDS.filter((p) => allAbsent(set, p.numbers));

  const hasAmazing = presentPatterns.some((p) => p.status === "Amazing");
  const hasDefeat =
    presentPatterns.some((p) => p.status === "Defeat") ||
    voids.some((p) => p.status === "Defeat");

  return {
    present,
    missing,
    presentPatterns,
    voids,
    mixedReading: hasAmazing && hasDefeat ? MIXED_READING : null,
  };
}

export function patternsForDigit(
  result: VedicGridResult,
  digit: number,
): GridPattern[] {
  return [...result.presentPatterns, ...result.voids].filter((p) =>
    p.numbers.includes(digit),
  );
}

export function cellCenter(n: number): { x: number; y: number } {
  const row = VEDIC_GRID_ORDER.findIndex((r) => r.includes(n));
  const col = VEDIC_GRID_ORDER[row].indexOf(n);
  const slot = 100 / 3;
  return { x: slot * col + slot / 2, y: slot * row + slot / 2 };
}
