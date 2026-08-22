/**
 * Unit System Vedic numerology reference (NumoraWisdom rewrite).
 * Used for enrichment + dual name number; does not replace medical advice.
 */

import { sumMappedLetters } from "./mappings";
import { parseDob, reduceNumber, reduceWithCompound } from "./reduce";

/** Book “Unit System” for Vedic name letters (differs from Chaldean). */
export const UNIT_SYSTEM_NAME_MAP: Record<string, number> = {
  A: 1,
  I: 1,
  J: 1,
  Q: 1,
  Y: 1,
  B: 2,
  C: 2,
  K: 2,
  R: 2,
  G: 3,
  L: 3,
  S: 3,
  D: 4,
  M: 4,
  T: 4,
  N: 5,
  E: 5,
  U: 6,
  V: 6,
  W: 6,
  X: 6,
  O: 7,
  Z: 7,
  F: 8,
  H: 8,
  P: 8,
};

export type Dosha = "Pitta" | "Kapha" | "Vata";
export type Guna = "Sattva" | "Rajas" | "Tamas";
export type Ease = "easier" | "mixed" | "more_demanding";

export type UnitNumberMeta = {
  planet: string;
  traits: string[];
  guna: Guna;
  behavioralGuna: string;
  dosha: Dosha;
  polarity: "odd-dynamic" | "even-static";
  psychicEase: Ease;
  destinyEase: Ease;
  psychicNote: string;
  destinyNote: string;
};

export const UNIT_NUMBER_META: Record<number, UnitNumberMeta> = {
  1: {
    planet: "Sun",
    traits: ["Authoritative", "Original", "Disciplined", "Royal presence"],
    guna: "Sattva",
    behavioralGuna: "Rajas (active)",
    dosha: "Pitta",
    polarity: "odd-dynamic",
    psychicEase: "more_demanding",
    destinyEase: "easier",
    psychicNote:
      "As Psychic, solar drive can feel intense to live with day to day.",
    destinyNote:
      "As Destiny, solar themes are often read as more fortunate outer path.",
  },
  2: {
    planet: "Moon",
    traits: ["Attractive", "Ever-changing", "Delicate", "Receptive"],
    guna: "Tamas",
    behavioralGuna: "Sattva (calm)",
    dosha: "Kapha",
    polarity: "even-static",
    psychicEase: "easier",
    destinyEase: "more_demanding",
    psychicNote: "As Psychic, lunar sensitivity often feels natural.",
    destinyNote: "As Destiny, lunar changeability may ask more patience.",
  },
  3: {
    planet: "Jupiter",
    traits: ["Counseling", "Friendly", "Spiritual bent", "Self-focused growth"],
    guna: "Rajas",
    behavioralGuna: "Sattva (calm)",
    dosha: "Kapha",
    polarity: "odd-dynamic",
    psychicEase: "easier",
    destinyEase: "more_demanding",
    psychicNote: "As Psychic, Jupiterian warmth often supports daily self-image.",
    destinyNote: "As Destiny, expansion themes may bring tests with growth.",
  },
  4: {
    planet: "Rahu",
    traits: ["Unconventional", "Impulsive edge", "Secretive drive", "Restless"],
    guna: "Rajas",
    behavioralGuna: "Rajas (active)",
    dosha: "Vata",
    polarity: "even-static",
    psychicEase: "easier",
    destinyEase: "more_demanding",
    psychicNote: "As Psychic, Rahu edge can feel workable as personal style.",
    destinyNote: "As Destiny, unconventional path themes may feel heavier.",
  },
  5: {
    planet: "Mercury",
    traits: ["Intelligent", "Entertaining", "Sensitive", "Quick-witted"],
    guna: "Rajas",
    behavioralGuna: "Rajas (active)",
    dosha: "Vata",
    polarity: "odd-dynamic",
    psychicEase: "mixed",
    destinyEase: "easier",
    psychicNote: "As Psychic, Mercurial mind needs grounding habits.",
    destinyNote: "As Destiny, Mercury themes are often read as supportive.",
  },
  6: {
    planet: "Venus",
    traits: ["Diplomatic", "Sensual", "Sweet-spoken", "Harmony-seeking"],
    guna: "Tamas",
    behavioralGuna: "Rajas (active)",
    dosha: "Kapha",
    polarity: "even-static",
    psychicEase: "mixed",
    destinyEase: "mixed",
    psychicNote:
      "As Psychic, Venus care often reads gently (traditionally noted especially in feminine framing).",
    destinyNote:
      "As Destiny, 6 draws help as a “universal friend,” yet still asks balance.",
  },
  7: {
    planet: "Ketu",
    traits: ["Mystical", "Intuitive", "Inventive", "Inward"],
    guna: "Tamas",
    behavioralGuna: "Rajas (active)",
    dosha: "Kapha",
    polarity: "odd-dynamic",
    psychicEase: "more_demanding",
    destinyEase: "easier",
    psychicNote:
      "As Psychic, Ketu can feel dreamy, self-focused, and hard to reach.",
    destinyNote: "As Destiny, Ketu themes are often read as more workable.",
  },
  8: {
    planet: "Saturn",
    traits: ["Laborious", "Enduring", "Serious", "Slow-built wisdom"],
    guna: "Rajas",
    behavioralGuna: "Tamas (heavy)",
    dosha: "Vata",
    polarity: "even-static",
    psychicEase: "easier",
    destinyEase: "more_demanding",
    psychicNote: "As Psychic, Saturn discipline can feel familiar.",
    destinyNote: "As Destiny, Saturn path themes often ask long endurance.",
  },
  9: {
    planet: "Mars",
    traits: ["Forceful", "Perfectionist", "Protective", "Discriminating"],
    guna: "Sattva",
    behavioralGuna: "Tamas (heated)",
    dosha: "Pitta",
    polarity: "odd-dynamic",
    psychicEase: "more_demanding",
    destinyEase: "easier",
    psychicNote:
      "As Psychic, Martian heat can strain close relationships if unpaced.",
    destinyNote: "As Destiny, Mars drive is often read as more constructive.",
  },
};

/** Compound birth-day → reduced psychic with Unit System flavor notes. */
export const BIRTH_DAY_COMPOUND_NOTES: Record<
  number,
  { psychic: number; note: string }
> = {
  1: {
    psychic: 1,
    note: "Pure day-1 solar Psychic—often read as the clearest Number-1 expression.",
  },
  10: {
    psychic: 1,
    note: "10 → 1: solar core with a zero overlay; traditionally calmer / more effortful than pure 1.",
  },
  19: {
    psychic: 1,
    note: "19 → 1: Sun + Mars heat—more assertive impulse in the Psychic mix.",
  },
  28: {
    psychic: 1,
    note: "28 → 1: Moon + Saturn—slower pacing, steadier work than pure 1.",
  },
  2: { psychic: 2, note: "Pure day-2 lunar Psychic." },
  11: {
    psychic: 2,
    note: "11 → 2: double-1 into Moon series—sensitive with solar undertone.",
  },
  20: {
    psychic: 2,
    note: "20 → 2: lunar core with zero—effort themes around receptivity.",
  },
  29: {
    psychic: 2,
    note: "29 → 2: often listed among stronger (exalted-style) Moon compounds.",
  },
  3: { psychic: 3, note: "Pure day-3 Jupiter Psychic." },
  12: {
    psychic: 3,
    note: "12 → 3: 1-series compound; Sun dominates the mix into Jupiter.",
  },
  21: {
    psychic: 3,
    note: "21 → 3: 2-series compound; Moon dominates the mix into Jupiter.",
  },
  30: {
    psychic: 3,
    note: "30 → 3: Jupiter with zero—growth with extra effort notes.",
  },
  4: { psychic: 4, note: "Pure day-4 Rahu Psychic." },
  13: {
    psychic: 4,
    note: "13 → 4: 1-series into Rahu—initiative plus disruption themes.",
  },
  22: {
    psychic: 4,
    note: "22 → 4: 2-series into Rahu—lunar change under unconventional drive.",
  },
  31: {
    psychic: 4,
    note: "31 → 4: often listed among stronger Rahu-style compounds.",
  },
  5: { psychic: 5, note: "Pure day-5 Mercury Psychic." },
  14: {
    psychic: 5,
    note: "14 → 5: 1-series into Mercury—initiative with versatile mind.",
  },
  23: {
    psychic: 5,
    note: "23 → 5: often listed among exalted Mercury compounds.",
  },
  32: {
    psychic: 5,
    note: "32 → 5: often listed among exalted Mercury compounds.",
  },
  6: { psychic: 6, note: "Pure day-6 Venus Psychic." },
  15: {
    psychic: 6,
    note: "15 → 6: 1-series into Venus—solar care / attraction mix.",
  },
  24: {
    psychic: 6,
    note: "24 → 6: often listed among exalted Venus compounds.",
  },
  33: {
    psychic: 6,
    note: "33 → 6: often listed among exalted Venus compounds.",
  },
  7: { psychic: 7, note: "Pure day-7 Ketu Psychic." },
  16: {
    psychic: 7,
    note: "16 → 7: 1-series into Ketu—awakening / rebuild undertones.",
  },
  25: {
    psychic: 7,
    note: "25 → 7: often listed among exalted Ketu compounds.",
  },
  34: {
    psychic: 7,
    note: "34 → 7: often listed among exalted Ketu compounds.",
  },
  8: { psychic: 8, note: "Pure day-8 Saturn Psychic." },
  17: {
    psychic: 8,
    note: "17 → 8: 1-series into Saturn—ambition under duty.",
  },
  26: {
    psychic: 8,
    note: "26 → 8: often listed among exalted Saturn compounds.",
  },
  35: {
    psychic: 8,
    note: "35 → 8: often listed among exalted Saturn compounds.",
  },
  9: { psychic: 9, note: "Pure day-9 Mars Psychic." },
  18: {
    psychic: 9,
    note: "18 → 9: 1-series into Mars—material + heat themes.",
  },
  27: {
    psychic: 9,
    note: "27 → 9: often listed among exalted Mars compounds.",
  },
  36: {
    psychic: 9,
    note: "36 → 9: often listed among exalted Mars compounds.",
  },
};

/** Exalted-style compounds (Unit System “numbers of exaltation”). */
export const EXALTATION_COMPOUNDS: Record<number, number[]> = {
  1: [28],
  2: [29],
  3: [12],
  4: [31],
  5: [23, 32],
  6: [24, 33],
  7: [25, 34],
  8: [26, 35],
  9: [27, 36],
};

export function isExaltedCompound(
  reduced: number,
  compound: number,
): boolean {
  return (EXALTATION_COMPOUNDS[reduced] ?? []).includes(compound);
}

export function unitSystemNameNumber(fullName: string): {
  compound: number;
  reduced: number;
} {
  const { compound, reduced } = reduceWithCompound(
    sumMappedLetters(fullName, UNIT_SYSTEM_NAME_MAP),
    [],
  );
  return { compound, reduced: reduced === 0 ? 9 : reduced };
}

export function birthDayCompoundInsight(dob: string): {
  day: number;
  psychic: number;
  note: string;
  exalted: boolean;
  leadingDigit: number | null;
} {
  const { day } = parseDob(dob);
  const psychic = reduceNumber(day, []);
  const entry = BIRTH_DAY_COMPOUND_NOTES[day];
  const note =
    entry?.note ??
    `Day ${day} reduces to Psychic ${psychic}; read both the compound digits and the whole.`;
  const leadingDigit = day >= 10 ? Math.floor(day / 10) : null;
  return {
    day,
    psychic,
    note,
    exalted: isExaltedCompound(psychic, day),
    leadingDigit,
  };
}

export type HarmonyTone = "supportive" | "mixed" | "stretch";

/** Soft Unit System triad harmony among psychic, destiny, name. */
export function triadHarmony(
  psychic: number,
  destiny: number,
  name: number,
): {
  tone: HarmonyTone;
  label: string;
  detail: string;
  set369: boolean;
} {
  const nums = [psychic, destiny, name];
  const set369 = nums.every((n) => [3, 6, 9].includes(n));
  const unique = new Set(nums).size;
  const nameDestinyClash =
    Math.abs(name - destiny) >= 3 && name !== destiny && !set369;

  if (set369 || unique === 1) {
    return {
      tone: "supportive",
      label: "Supportive triad",
      detail: set369
        ? "Psychic, Destiny, and Name sit in the classic 3–6–9 friendship set."
        : "All three Vedic layers share the same digit—inner and outer tones align closely.",
      set369,
    };
  }
  if (name === destiny || name === psychic || psychic === destiny) {
    return {
      tone: "mixed",
      label: "Partial harmony",
      detail:
        "Two of the three layers share a digit—useful overlap with one contrasting tone to integrate.",
      set369,
    };
  }
  if (nameDestinyClash) {
    return {
      tone: "stretch",
      label: "Name ↔ Destiny stretch",
      detail:
        "Your Name number and your Destiny number are far enough apart that how people read you may not match where you are actually heading. Expect to have to explain yourself more often than most.",
      set369,
    };
  }
  return {
    tone: "mixed",
    label: "Varied triad",
    detail:
      "Psychic, Destiny, and Name each contribute a distinct tone—use contrast as nuance, not conflict.",
    set369,
  };
}

export function temperamentChips(
  day: number,
  psychic: number,
): { doshas: Dosha[]; summary: string } {
  const primary = UNIT_NUMBER_META[psychic]?.dosha ?? "Vata";
  if (day < 10) {
    return {
      doshas: [primary],
      summary: `Day ${day} → primarily ${primary} temperament themes (reflective Ayurveda framing).`,
    };
  }
  const a = Math.floor(day / 10);
  const b = day % 10 || 9;
  const dA = UNIT_NUMBER_META[a]?.dosha;
  const dB = UNIT_NUMBER_META[b]?.dosha;
  const doshas = [primary];
  if (dA && !doshas.includes(dA)) doshas.push(dA);
  if (dB && !doshas.includes(dB)) doshas.push(dB);
  return {
    doshas,
    summary: `Compound day ${day} mixes ${[a, b].join(" + ")} into Psychic ${psychic}—temperament may blend ${doshas.join(" / ")}.`,
  };
}

export function zeroInDobInsight(dob: string): string | null {
  if (!/[0]/.test(dob.replace(/\D/g, ""))) return null;
  return "A zero appears in the birth date digits—traditionally read as an effort overlay that can mute or slow the material expression of nearby numbers (reflective only).";
}

export function unitSystemCompatNote(): string {
  return "Unit System note: 3–6–9 often read as mutually friendly; harmony among Psychic, Destiny, and Name supports social ease. Number 6 is treated as a universal friend. Enemy pairings can still catalyze growth through alertness.";
}
