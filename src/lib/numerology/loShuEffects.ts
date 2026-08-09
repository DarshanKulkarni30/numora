/** Reflective Lo Shu number themes and effects for repeats / gaps. */

export const LO_SHU_NUMBER_META: Record<
  number,
  { trait: string; vedic: string; theme: string; growth: string }
> = {
  1: {
    trait: "Initiative",
    vedic: "King",
    theme: "initiative, independence, and drive to begin",
    growth: "practicing small self-starts",
  },
  2: {
    trait: "Cooperation",
    vedic: "Queen",
    theme: "cooperation, sensitivity, and partnership awareness",
    growth: "listening and cooperative habits",
  },
  3: {
    trait: "Expression",
    vedic: "Guru",
    theme: "expression, creativity, and social communication",
    growth: "creative expression in low-pressure ways",
  },
  4: {
    trait: "Structure",
    vedic: "Rebel",
    theme: "structure, planning, and steady follow-through",
    growth: "simple routines and planning",
  },
  5: {
    trait: "Freedom",
    vedic: "Prince",
    theme: "change, curiosity, and adaptable energy",
    growth: "safe variety and new experiences",
  },
  6: {
    trait: "Care",
    vedic: "Lover",
    theme: "care, responsibility, and harmony-seeking",
    growth: "acts of care with healthy boundaries",
  },
  7: {
    trait: "Insight",
    vedic: "Mystic",
    theme: "analysis, reflection, and inward focus",
    growth: "quiet reflection or study time",
  },
  8: {
    trait: "Ambition",
    vedic: "Judge",
    theme: "ambition, stewardship, and practical power",
    growth: "organized goal-setting",
  },
  9: {
    trait: "Compassion",
    vedic: "Commander",
    theme: "compassion, completion, and broad vision",
    growth: "generous completion of small cycles",
  },
};

export function repeatedNumberEffect(n: number, count: number): string {
  const meta = LO_SHU_NUMBER_META[n];
  const theme = meta?.theme ?? "related personal themes";
  if (count >= 3) {
    return `Number ${n} appears ${count} times, which traditions may read as a strongly emphasized pattern around ${theme}. Balance with rest and other planes so the emphasis stays constructive.`;
  }
  return `Number ${n} appears ${count} times, which may gently amplify themes of ${theme}—an emphasis to notice, not a fixed label.`;
}

export function missingNumberEffect(n: number): string {
  const tip = LO_SHU_NUMBER_META[n]?.growth ?? "balanced habits";
  return `Missing ${n} may invite growth through ${tip}—a development area, not a deficit.`;
}

export function loShuEffectNotes(
  repeated: { number: number; count: number }[],
  missing: number[],
): { repeated: string[]; missing: string[] } {
  return {
    repeated: repeated.map((r) => repeatedNumberEffect(r.number, r.count)),
    missing: missing.map((n) => missingNumberEffect(n)),
  };
}
