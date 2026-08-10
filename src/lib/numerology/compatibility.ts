/**
 * Simple core-number × partner tone matrix (1–9).
 * Levels are constructive labels — not “good/bad destiny”.
 */

import { reduceToSingleDigit } from "./dateNumbers";

export type CompatTone = "Supportive" | "Balanced" | "Growth-oriented";

export type CompatChannel = "romantic" | "business" | "friendship";

/** Pair key "a-b" with a <= b for symmetry lookup helpers */
const PAIR_TONE: Record<string, CompatTone> = {
  "1-1": "Growth-oriented",
  "1-2": "Supportive",
  "1-3": "Supportive",
  "1-4": "Balanced",
  "1-5": "Supportive",
  "1-6": "Balanced",
  "1-7": "Growth-oriented",
  "1-8": "Supportive",
  "1-9": "Balanced",
  "2-2": "Supportive",
  "2-3": "Supportive",
  "2-4": "Supportive",
  "2-5": "Balanced",
  "2-6": "Supportive",
  "2-7": "Balanced",
  "2-8": "Growth-oriented",
  "2-9": "Supportive",
  "3-3": "Supportive",
  "3-4": "Balanced",
  "3-5": "Supportive",
  "3-6": "Supportive",
  "3-7": "Balanced",
  "3-8": "Balanced",
  "3-9": "Supportive",
  "4-4": "Supportive",
  "4-5": "Growth-oriented",
  "4-6": "Supportive",
  "4-7": "Balanced",
  "4-8": "Supportive",
  "4-9": "Balanced",
  "5-5": "Growth-oriented",
  "5-6": "Balanced",
  "5-7": "Supportive",
  "5-8": "Balanced",
  "5-9": "Supportive",
  "6-6": "Supportive",
  "6-7": "Balanced",
  "6-8": "Balanced",
  "6-9": "Supportive",
  "7-7": "Supportive",
  "7-8": "Growth-oriented",
  "7-9": "Supportive",
  "8-8": "Growth-oriented",
  "8-9": "Balanced",
  "9-9": "Supportive",
};

function pairKey(a: number, b: number): string {
  const x = Math.min(a, b);
  const y = Math.max(a, b);
  return `${x}-${y}`;
}

function baseTone(a: number, b: number): CompatTone {
  return PAIR_TONE[pairKey(a, b)] ?? "Balanced";
}

/** Slight channel nuance without harsh negatives */
function channelTone(
  base: CompatTone,
  channel: CompatChannel,
  a: number,
  b: number,
): CompatTone {
  if (channel === "business" && (a === 8 || b === 8) && base === "Balanced") {
    return "Supportive";
  }
  if (channel === "romantic" && (a === 2 || b === 2 || a === 6 || b === 6)) {
    if (base === "Growth-oriented") return "Balanced";
  }
  if (channel === "friendship" && (a === 3 || b === 3 || a === 5 || b === 5)) {
    if (base === "Balanced") return "Supportive";
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
  "Compatibility tones are optional numerology reflections for conversation only. They are not relationship advice, matchmaking, hiring guidance, or predictions of love, partnership success, or conflict.";

export const TONE_HINT: Record<CompatTone, string> = {
  Supportive:
    "In numerology tradition, this pairing is often described as easier day-to-day rapport—conversation and cooperation may take less effort. Still needs real communication; not a guarantee.",
  Balanced:
    "A mix of ease and stretch: some areas feel natural, others need mutual effort, timing, and respect.",
  "Growth-oriented":
    "May highlight differences that invite patience, clear boundaries, and learning together—growth potential, not a “bad match” verdict.",
};

export const CHANNEL_HINT = {
  romantic:
    "Personal / romantic connection tone in tradition—how easy closeness may feel to start, not a prediction of love success.",
  business:
    "Work and collaboration tone—how teamwork, projects, or professional partnership may feel in tradition.",
  friendship:
    "Friendship and social tone—how easy camaraderie and mutual support may feel in tradition.",
  team: "Team / class tone—how easy group cooperation may feel in tradition (for child readings).",
} as const;
