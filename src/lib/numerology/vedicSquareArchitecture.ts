import {
  countInSquare,
  digitalRoot,
  frequencyBand,
  oppositeOf,
  oppositePairFor,
  squareDigitGuide,
  squarePositions,
  type OppositePair,
} from "./vedicSquare";
import { planetForVedic } from "./planets";

export type FootprintMetrics = {
  frequency: number;
  frequencyLabel: string;
  frequencyScore: number; // 0–1
  distribution: "spread" | "clustered" | "mixed";
  distributionScore: number; // 0 = clustered, 1 = spread
  symmetry: "balanced" | "skewed" | "diagonal" | "rim";
  symmetryScore: number; // 0–1 balanced
  reactionStyle: "intuitive" | "structured" | "relational" | "mixed";
  oppositeTension: number; // 0–1
  oppositeCount: number;
  clarity: "thin" | "moderate" | "thick";
};

export type PatternArchetype = {
  id: string;
  name: string;
  behavioral: string;
  emotional: string;
  growth: string;
};

export type ReflectivePractice = {
  micro: string;
  awareness: string;
  oppositeBalance: string;
  meditation: string;
};

export type VedicSquareArchitecture = {
  digit: number;
  planetLabel: string;
  planetSymbol: string;
  positions: { row: number; col: number }[];
  oppositeDigit: number | null;
  oppositePositions: { row: number; col: number }[];
  oppositePair: OppositePair | null;
  metrics: FootprintMetrics;
  archetype: PatternArchetype;
  practice: ReflectivePractice;
  footprintNarrative: string;
  oppositeNarrative: string;
  narrative: string;
  blueprint: { title: string; lines: string[] };
};

const ARCHETYPES: Record<number, PatternArchetype> = {
  1: {
    id: "spear",
    name: "Spear pattern",
    behavioral: "Clear starts and directional drive across the lattice.",
    emotional: "Pride and visibility when the tone lands cleanly.",
    growth: "Pair each bold start with one structure habit.",
  },
  2: {
    id: "proximity",
    name: "Proximity arcs",
    behavioral: "Relational timing—pairing, waiting, and soft pacing.",
    emotional: "Sensitivity to closeness and mirroring.",
    growth: "Name a preference before merging into the group plan.",
  },
  3: {
    id: "expansion",
    name: "Expansion triangles",
    behavioral: "Counsel, teaching, and cyclic expression.",
    emotional: "Warmth that wants an audience and a lesson.",
    growth: "Finish one idea before opening the next thread.",
  },
  4: {
    id: "edge",
    name: "Edge squares",
    behavioral: "Unconventional routes and break-pattern courage.",
    emotional: "Restless edge seeking a constructive lane.",
    growth: "Give novelty one experiment with a rebuild plan.",
  },
  5: {
    id: "zigzag",
    name: "Movement zigzags",
    behavioral: "Quick links, adaptable mind, useful curiosity.",
    emotional: "Stimulation hunger that can scatter.",
    growth: "Deepen one skill inside the versatility.",
  },
  6: {
    id: "petal",
    name: "Harmony petals",
    behavioral: "Bridge-building, care, and aesthetic sense.",
    emotional: "Desire for beauty and mutual ease.",
    growth: "Offer care with a clear end time.",
  },
  7: {
    id: "spiral",
    name: "Detachment spirals",
    behavioral: "Study, discernment, inward clarity.",
    emotional: "Need for quiet that can tip into isolation.",
    growth: "Share one insight with a trusted person this week.",
  },
  8: {
    id: "wave",
    name: "Dissolution waves",
    behavioral: "Long-game duty, accountability, endurance.",
    emotional: "Weight of responsibility seeking recovery.",
    growth: "Schedule recovery as part of the build plan.",
  },
  9: {
    id: "burst",
    name: "Action bursts",
    behavioral: "Completion pressure and persistent rim identity.",
    emotional: "Wholeness drive that may hold chapters open too long.",
    growth: "Close one loop cleanly before collecting a new cause.",
  },
};

function mean(xs: number[]): number {
  if (!xs.length) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function variance(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return mean(xs.map((x) => (x - m) ** 2));
}

function analyzeGeometry(
  positions: { row: number; col: number }[],
): Pick<
  FootprintMetrics,
  "distribution" | "distributionScore" | "symmetry" | "symmetryScore" | "reactionStyle"
> {
  if (!positions.length) {
    return {
      distribution: "mixed",
      distributionScore: 0.5,
      symmetry: "balanced",
      symmetryScore: 0.5,
      reactionStyle: "mixed",
    };
  }
  const rows = positions.map((p) => p.row);
  const cols = positions.map((p) => p.col);
  const rowVar = variance(rows);
  const colVar = variance(cols);
  const spreadScore = Math.min(1, (rowVar + colVar) / 16);
  const distribution: FootprintMetrics["distribution"] =
    spreadScore > 0.55 ? "spread" : spreadScore < 0.28 ? "clustered" : "mixed";

  // Mirror symmetry around center (5,5)
  let mirrorHits = 0;
  const set = new Set(positions.map((p) => `${p.row},${p.col}`));
  for (const p of positions) {
    const mr = 10 - p.row;
    const mc = 10 - p.col;
    if (set.has(`${mr},${mc}`)) mirrorHits++;
  }
  const symmetryScore = mirrorHits / positions.length;

  // Diagonal bias: |row-col| small vs row-heavy vs col-heavy
  const diag = mean(positions.map((p) => Math.abs(p.row - p.col)));
  const rowSpread = variance(rows);
  const colSpread = variance(cols);
  let reactionStyle: FootprintMetrics["reactionStyle"] = "mixed";
  if (diag < 2.2) reactionStyle = "intuitive";
  else if (colSpread > rowSpread * 1.25) reactionStyle = "structured";
  else if (rowSpread > colSpread * 1.25) reactionStyle = "relational";

  // Rim bias for 9-like patterns
  const rimShare =
    positions.filter(
      (p) => p.row === 1 || p.row === 9 || p.col === 1 || p.col === 9,
    ).length / positions.length;

  let symmetry: FootprintMetrics["symmetry"] = "skewed";
  if (symmetryScore >= 0.55) symmetry = "balanced";
  else if (diag < 2.2) symmetry = "diagonal";
  else if (rimShare > 0.55) symmetry = "rim";

  return {
    distribution,
    distributionScore: spreadScore,
    symmetry,
    symmetryScore,
    reactionStyle,
  };
}

function buildPractice(
  digit: number,
  guidePractice: string,
  opposite: OppositePair | null,
): ReflectivePractice {
  const awarenessByDigit: Record<number, string> = {
    1: "Notice when you push start without a container.",
    2: "Notice when you mirror others before naming your need.",
    3: "Notice when expression outruns completion.",
    4: "Notice restless novelty without a rebuild plan.",
    5: "Notice attention scattering across too many links.",
    6: "Notice care that has no end time.",
    7: "Notice withdrawal that skips one trusted share.",
    8: "Notice duty without scheduled recovery.",
    9: "Notice holding a finished chapter open.",
  };
  const meditationByDigit: Record<number, string> = {
    1: "Ten seconds: picture a single spear of light—one start, one line.",
    2: "Ten seconds: two soft arcs meeting, then space between them.",
    3: "Ten seconds: a triangle expanding, then settling into one point.",
    4: "Ten seconds: an edge square that opens one constructive gate.",
    5: "Ten seconds: a zigzag that chooses one path and rests.",
    6: "Ten seconds: a petal closing gently at a clear edge.",
    7: "Ten seconds: a quiet spiral inward, then one outward breath.",
    8: "Ten seconds: a long wave that includes a rest trough.",
    9: "Ten seconds: the outer rim glowing once, then releasing.",
  };
  return {
    micro: guidePractice,
    awareness: awarenessByDigit[digit] ?? "Notice the tone when it appears.",
    oppositeBalance: opposite?.practice ?? "9 stands alone—practice clean completion.",
    meditation: meditationByDigit[digit] ?? "Ten seconds with the lattice pattern in mind.",
  };
}

/** Pure footprint architecture for a Vedic Square digit highlight. */
export function buildVedicSquareArchitecture(
  digitInput: number,
): VedicSquareArchitecture {
  const digit = digitalRoot(digitInput || 1);
  const positions = squarePositions(digit);
  const oppositeDigit = oppositeOf(digit);
  const oppositePositions =
    oppositeDigit != null ? squarePositions(oppositeDigit) : [];
  const oppositePair = oppositePairFor(digit);
  const guide = squareDigitGuide(digit);
  const freq = frequencyBand(guide.count);
  const geometry = analyzeGeometry(positions);
  const oppositeCount = oppositeDigit != null ? countInSquare(oppositeDigit) : 0;
  const oppositeTension =
    oppositeDigit == null
      ? 0
      : Math.min(1, oppositeCount / Math.max(guide.count, 1) / 2);

  const clarity: FootprintMetrics["clarity"] =
    guide.count >= 18 ? "thick" : guide.count >= 10 ? "moderate" : "thin";

  const frequencyScore = Math.min(1, guide.count / 21);

  const metrics: FootprintMetrics = {
    frequency: guide.count,
    frequencyLabel: freq.label,
    frequencyScore,
    ...geometry,
    oppositeTension,
    oppositeCount,
    clarity,
  };

  const archetype = ARCHETYPES[digit] ?? ARCHETYPES[1];
  const practice = buildPractice(digit, guide.practice, oppositePair);
  const planet = planetForVedic(digit);

  const footprintNarrative = [
    `${freq.label} (${guide.count} cells)—${clarity} clarity.`,
    `Distribution reads ${geometry.distribution}; symmetry ${geometry.symmetry}; reaction style ${geometry.reactionStyle}.`,
    freq.meaning,
  ].join(" ");

  const oppositeNarrative =
    oppositeDigit == null
      ? "Digit 9 has no opposite in this square’s mirror play—persistent rim identity."
      : oppositePair
        ? `Opposite ${oppositeDigit} (${oppositePair.planets}): ${oppositePair.theme} Tension score ${Math.round(oppositeTension * 100)}%.`
        : `Opposite ${oppositeDigit} sits as a complementary shadow pattern.`;

  const narrative = [
    `Digit ${digit} · ${archetype.name}.`,
    archetype.behavioral,
    footprintNarrative,
    oppositeNarrative,
    `Practice focus: ${practice.micro}`,
  ].join(" ");

  const blueprint = {
    title: "Vedic Square footprint",
    lines: [
      `Digit ${digit} (${planet.name} ${planet.symbol}) · ${archetype.name}`,
      `Frequency: ${guide.count} · ${freq.label} · clarity ${clarity}`,
      `Distribution: ${geometry.distribution}; symmetry: ${geometry.symmetry}; reaction: ${geometry.reactionStyle}`,
      oppositeDigit != null
        ? `Opposite ${oppositeDigit}: ${oppositePair?.theme ?? "complementary shadow"}`
        : NINE_LINE,
      `Behavioral: ${archetype.behavioral}`,
      `Emotional: ${archetype.emotional}`,
      `Growth: ${archetype.growth}`,
      `Micro-practice: ${practice.micro}`,
      `Awareness: ${practice.awareness}`,
      `Opposite balance: ${practice.oppositeBalance}`,
      `Meditation: ${practice.meditation}`,
    ],
  };

  return {
    digit,
    planetLabel: planet.name,
    planetSymbol: planet.symbol,
    positions,
    oppositeDigit,
    oppositePositions,
    oppositePair,
    metrics,
    archetype,
    practice,
    footprintNarrative,
    oppositeNarrative,
    narrative,
    blueprint,
  };
}

const NINE_LINE = "No opposite—9 persists on the rim.";

/** PDF/helper lines for Psychic, Destiny, Name footprints. */
export function vedicSquareReportBlueprintLines(opts: {
  psychic: number | string;
  destiny: number | string;
  name: number | string;
}): string[] {
  const layers: { label: string; n: number }[] = [
    { label: "Psychic", n: digitalRoot(Number(opts.psychic) || 1) },
    { label: "Destiny", n: digitalRoot(Number(opts.destiny) || 1) },
    { label: "Name", n: digitalRoot(Number(opts.name) || 1) },
  ];
  const lines: string[] = [];
  for (const layer of layers) {
    const a = buildVedicSquareArchitecture(layer.n);
    lines.push(
      `${layer.label} ${a.digit}: ${a.archetype.name}; ${a.metrics.frequencyLabel} (${a.metrics.frequency}); ${a.practice.micro}`,
    );
    if (a.oppositeDigit != null) {
      lines.push(
        `  Opposite ${a.oppositeDigit}: ${a.oppositePair?.theme ?? "shadow pattern"}`,
      );
    }
  }
  return lines;
}
