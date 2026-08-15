/**
 * Vedic Square helpers — Numora-original synthesis of traditional 9×9 digital-root patterns.
 */

/** Digital root 1–9 (multiples of 9 → 9). */
export function digitalRoot(n: number): number {
  const abs = Math.abs(Math.trunc(n));
  if (abs === 0) return 9;
  const mod = abs % 9;
  return mod === 0 ? 9 : mod;
}

/** 9×9 Vedic Square: cell[r][c] = digitalRoot((r+1)*(c+1)), 0-index. */
export function buildVedicSquare(): number[][] {
  const grid: number[][] = [];
  for (let i = 1; i <= 9; i++) {
    const row: number[] = [];
    for (let j = 1; j <= 9; j++) {
      row.push(digitalRoot(i * j));
    }
    grid.push(row);
  }
  return grid;
}

export const VEDIC_SQUARE = buildVedicSquare();

export type OppositePair = {
  a: number;
  b: number;
  planets: string;
  theme: string;
  practice: string;
};

/** Opposite pairs in the square’s mirror play (Numora wording). */
export const OPPOSITE_PAIRS: OppositePair[] = [
  {
    a: 1,
    b: 8,
    planets: "Sun · Saturn",
    theme: "Visibility and structure—light meeting long-form discipline.",
    practice: "Pair a bold start with one patient follow-through habit.",
  },
  {
    a: 2,
    b: 7,
    planets: "Moon · Ketu",
    theme: "Closeness and detachment—feeling meeting inward clarity.",
    practice: "Name the need for connection, then protect quiet study time.",
  },
  {
    a: 3,
    b: 6,
    planets: "Jupiter · Venus",
    theme: "Counsel and charm—teaching warmth meeting relational grace.",
    practice: "Offer guidance with consent; keep beauty from becoming over-giving.",
  },
  {
    a: 4,
    b: 5,
    planets: "Rahu · Mercury",
    theme: "Disruption and clarity—edge meeting quick, useful mind.",
    practice: "Channel restless novelty into one clear message or skill.",
  },
];

export function oppositeOf(n: number): number | null {
  const d = digitalRoot(n);
  if (d === 9) return null;
  const pair = OPPOSITE_PAIRS.find((p) => p.a === d || p.b === d);
  if (!pair) return null;
  return pair.a === d ? pair.b : pair.a;
}

export function oppositePairFor(n: number): OppositePair | null {
  const d = digitalRoot(n);
  return OPPOSITE_PAIRS.find((p) => p.a === d || p.b === d) ?? null;
}

export function squarePositions(digit: number): { row: number; col: number }[] {
  const d = digitalRoot(digit);
  const out: { row: number; col: number }[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (VEDIC_SQUARE[r][c] === d) out.push({ row: r + 1, col: c + 1 });
    }
  }
  return out;
}

export function countInSquare(digit: number): number {
  return squarePositions(digit).length;
}

export const REDUCTION_TIP =
  "Large totals reduce to 1–9 by adding digits (or skipping groups that already make 9). The single digit is the tone Numora uses in Vedic layers.";

export const NINE_NOTE =
  "In the Vedic Square, 9 is persistent—multiples of 9 stay 9, and the outer rim is lined with 9s. Digits 1–8 shift as they multiply; 9 keeps its identity.";

/** How often each digit appears in the fixed 9×9 square (1→6 … 9→21). */
export function frequencyBand(count: number): {
  label: string;
  meaning: string;
} {
  if (count >= 18) {
    return {
      label: "Highest footprint",
      meaning:
        "This digit saturates the square more than any other. Traditions often read that as persistence, completion pressure, or a tone that “won’t leave the rim”—useful as emphasis, not as fate.",
    };
  }
  if (count >= 10) {
    return {
      label: "High footprint",
      meaning:
        "This digit repeats often in the grid’s weave. That usually reads as a familiar rhythm you may notice in expression or relationships—still reflective, not a prediction.",
    };
  }
  return {
    label: "Moderate footprint",
    meaning:
      "This digit appears less often than 3, 6, or 9. A thinner footprint can mean the tone is clearer when it shows up—spot it, then practice it deliberately rather than assuming it dominates.",
  };
}

export function layerContextLine(
  source: "psychic" | "destiny" | "name" | "unit" | "manual",
  digit: number,
): string | null {
  const d = digitalRoot(digit);
  if (source === "psychic") {
    return `You’re highlighting Psychic ${d} (birth day)—how this tone may show in temperament and first reactions.`;
  }
  if (source === "destiny") {
    return `You’re highlighting Destiny ${d} (full birth date)—how this tone may color longer-arc direction.`;
  }
  if (source === "name") {
    return `You’re highlighting Vedic Name ${d}—how the written name may echo this tone beside day and destiny.`;
  }
  if (source === "unit") {
    return `You’re highlighting Unit-map Name ${d}—a second letter map of the same name for comparison, not a replacement.`;
  }
  return `You’re browsing digit ${d} on the square—generic pattern notes only until you tie it to Psychic, Destiny, or Name.`;
}

export type ReportOpposite = OppositePair & {
  inPsychic: boolean;
  inDestiny: boolean;
  inName: boolean;
};

/** Pairs that touch any of the user’s core Vedic digits. */
export function oppositesForReport(
  psychic: number | string,
  destiny: number | string,
  name: number | string,
): ReportOpposite[] {
  const p = digitalRoot(Number(psychic));
  const d = digitalRoot(Number(destiny));
  const n = digitalRoot(Number(name));
  const set = new Set([p, d, n]);
  return OPPOSITE_PAIRS.filter((pair) => set.has(pair.a) || set.has(pair.b)).map(
    (pair) => ({
      ...pair,
      inPsychic: p === pair.a || p === pair.b,
      inDestiny: d === pair.a || d === pair.b,
      inName: n === pair.a || n === pair.b,
    }),
  );
}

export function squareDigitGuide(n: number): {
  theme: string;
  strengths: string[];
  watchouts: string[];
  practice: string;
  opposite: OppositePair | null;
  count: number;
} {
  const d = digitalRoot(n);
  const opposite = oppositePairFor(d);
  const count = countInSquare(d);
  const themes: Record<number, { theme: string; strengths: string[]; watchouts: string[]; practice: string }> = {
    1: {
      theme: "Initiating line across the square—starts and self-direction",
      strengths: ["Clear beginnings", "Visible intent"],
      watchouts: ["Forcing pace without structure"],
      practice: "Mark one start this week and one boundary that protects it.",
    },
    2: {
      theme: "Relational rhythm in the square—pairing and timing",
      strengths: ["Cooperative pattern awareness", "Soft pacing"],
      watchouts: ["Losing self in the mirror of others"],
      practice: "State one preference before agreeing to a shared plan.",
    },
    3: {
      theme: "Repeating counsel pattern—expression in cycles of three",
      strengths: ["Teaching warmth", "Pattern recognition"],
      watchouts: ["Talking past completion"],
      practice: "Finish one idea before opening the next conversation.",
    },
    4: {
      theme: "Edge pattern—unconventional paths through the grid",
      strengths: ["Original routes", "Break-pattern courage"],
      watchouts: ["Disruption without a rebuild plan"],
      practice: "Give restless energy one constructive experiment lane.",
    },
    5: {
      theme: "Mercurial weave—quick links across the square",
      strengths: ["Adaptability", "Useful curiosity"],
      watchouts: ["Scattering attention"],
      practice: "Choose one skill to deepen inside your versatility.",
    },
    6: {
      theme: "Harmony weave—care and beauty in the grid’s rhythm",
      strengths: ["Bridge-building", "Aesthetic sense"],
      watchouts: ["Over-responsibility"],
      practice: "Offer care with a clear end time.",
    },
    7: {
      theme: "Inward diagonal of insight—study and detachment tones",
      strengths: ["Depth", "Discernment"],
      watchouts: ["Isolation"],
      practice: "Share one insight with a trusted person this week.",
    },
    8: {
      theme: "Descending structure line—duty and endurance",
      strengths: ["Long-game stamina", "Accountability"],
      watchouts: ["Heaviness without rest"],
      practice: "Schedule recovery as part of the build plan.",
    },
    9: {
      theme: "Persistent rim—completion and unchanging identity in the square",
      strengths: ["Wholeness", "Completion energy"],
      watchouts: ["Holding on when a chapter is done"],
      practice: "Close one loop cleanly before collecting a new cause.",
    },
  };
  const base = themes[d] ?? themes[1];
  return { ...base, opposite, count };
}
