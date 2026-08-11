/**
 * Core-number × partner tone matrix (1–9).
 * Four reflective tiers shared by Pythagorean and Vedic tabs.
 */

import { reduceToSingleDigit } from "./dateNumbers";

export type CompatTone =
  | "Amazing"
  | "Favourable"
  | "Neutral"
  | "Challenging";

export type CompatChannel = "romantic" | "business" | "friendship";

/**
 * Pair key "a-b" with a <= b.
 * Amazing = especially easy affinity in tradition
 * Favourable = generally supportive
 * Neutral = mixed / depends on effort
 * Challenging = may need more patience and clarity (not “bad”)
 */
const PAIR_TONE: Record<string, CompatTone> = {
  "1-1": "Challenging",
  "1-2": "Favourable",
  "1-3": "Favourable",
  "1-4": "Neutral",
  "1-5": "Amazing",
  "1-6": "Neutral",
  "1-7": "Challenging",
  "1-8": "Favourable",
  "1-9": "Neutral",
  "2-2": "Amazing",
  "2-3": "Favourable",
  "2-4": "Favourable",
  "2-5": "Neutral",
  "2-6": "Amazing",
  "2-7": "Neutral",
  "2-8": "Challenging",
  "2-9": "Favourable",
  "3-3": "Amazing",
  "3-4": "Neutral",
  "3-5": "Favourable",
  "3-6": "Favourable",
  "3-7": "Neutral",
  "3-8": "Neutral",
  "3-9": "Amazing",
  "4-4": "Favourable",
  "4-5": "Challenging",
  "4-6": "Favourable",
  "4-7": "Neutral",
  "4-8": "Amazing",
  "4-9": "Neutral",
  "5-5": "Challenging",
  "5-6": "Neutral",
  "5-7": "Favourable",
  "5-8": "Neutral",
  "5-9": "Favourable",
  "6-6": "Amazing",
  "6-7": "Neutral",
  "6-8": "Neutral",
  "6-9": "Favourable",
  "7-7": "Favourable",
  "7-8": "Challenging",
  "7-9": "Favourable",
  "8-8": "Challenging",
  "8-9": "Neutral",
  "9-9": "Amazing",
};

function pairKey(a: number, b: number): string {
  const x = Math.min(a, b);
  const y = Math.max(a, b);
  return `${x}-${y}`;
}

function baseTone(a: number, b: number): CompatTone {
  return PAIR_TONE[pairKey(a, b)] ?? "Neutral";
}

/** Slight channel nuance without harsh negatives */
export function channelTone(
  base: CompatTone,
  channel: CompatChannel,
  a: number,
  b: number,
): CompatTone {
  if (channel === "business" && (a === 8 || b === 8) && base === "Neutral") {
    return "Favourable";
  }
  if (channel === "romantic" && (a === 2 || b === 2 || a === 6 || b === 6)) {
    if (base === "Challenging") return "Neutral";
  }
  if (channel === "friendship" && (a === 3 || b === 3 || a === 5 || b === 5)) {
    if (base === "Neutral") return "Favourable";
  }
  return base;
}

export type CompatCell = {
  partnerLifePath: number;
  romantic: CompatTone;
  business: CompatTone;
  friendship: CompatTone;
};

export function buildCompatibilityMatrix(coreNumber: number): CompatCell[] {
  const self = reduceToSingleDigit(coreNumber);
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((partner) => {
    const base = baseTone(self, partner);
    return {
      partnerLifePath: partner,
      romantic: channelTone(base, "romantic", self, partner),
      business: channelTone(base, "business", self, partner),
      friendship: channelTone(base, "friendship", self, partner),
    };
  });
}

export const COMPAT_DISCLAIMER =
  "This is a generic numerology compatibility snapshot for reflection only. Real compatibility depends on many other factors—upbringing, culture, values, location, communication habits, timing, and lived experience. It is not relationship advice, matchmaking, hiring guidance, or a prediction of love, partnership success, or conflict.";

export const TONE_HINT: Record<CompatTone, string> = {
  Amazing:
    "In tradition, this pairing is often described as an especially natural affinity—rapport may feel easy to start. Still needs care and communication; not a guarantee.",
  Favourable:
    "Generally supportive in tradition: cooperation and goodwill may come more readily when both people show up with respect.",
  Neutral:
    "Mixed or situational: some ease and some stretch. Outcomes depend heavily on effort, timing, and mutual respect.",
  Challenging:
    "May highlight differences that ask for patience, clear boundaries, and honest talk—growth potential, not a “bad match” verdict.",
};

/** Map older saved-report labels if present */
export function normalizeCompatTone(tone: string): CompatTone | string {
  const map: Record<string, CompatTone> = {
    Supportive: "Favourable",
    Balanced: "Neutral",
    "Growth-oriented": "Challenging",
  };
  return map[tone] ?? tone;
}

export const CHANNEL_HINT = {
  romantic:
    "Personal / romantic connection tone in tradition—how easy closeness may feel to start, not a prediction of love success.",
  business:
    "Work and collaboration tone—how teamwork, projects, or professional partnership may feel in tradition.",
  friendship:
    "Friendship and social tone—how easy camaraderie and mutual support may feel in tradition.",
  team: "Team / class tone—how easy group cooperation may feel in tradition (for child readings).",
} as const;
