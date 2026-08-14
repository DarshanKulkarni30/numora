/**
 * Vedic (Anank-style) relationship tones from an AstroSage-style
 * Best / Friend / Average / Enemy table, mapped to Numora tones only.
 * Directional: tone(self → partner) may differ from tone(partner → self).
 */

import {
  channelTone,
  type CompatCell,
  type CompatTone,
} from "./compatibility";
import { reduceToSingleDigit } from "./dateNumbers";

type Tier = "best" | "friend" | "average" | "enemy";

/** AstroSage marriage-numerology rows (self number → partner sets). */
const ASTROSAGE_ROWS: Record<
  number,
  { best: number[]; friend: number[]; average: number[]; enemy: number[] }
> = {
  1: { best: [], friend: [2, 3, 6, 7, 9], average: [1, 8], enemy: [4, 5] },
  2: { best: [2, 6, 9], friend: [1, 4, 7], average: [3, 8], enemy: [5] },
  3: { best: [6, 9], friend: [1, 5], average: [2, 4, 7], enemy: [3, 8] },
  4: { best: [4, 6], friend: [2, 7, 8, 9], average: [3, 5], enemy: [1] },
  5: { best: [], friend: [3], average: [4, 6, 7, 8, 9], enemy: [1, 2, 5] },
  6: { best: [2, 3, 4, 6, 9], friend: [1], average: [5, 7, 8], enemy: [] },
  7: { best: [7, 9], friend: [1, 2, 4, 6], average: [3, 5, 8], enemy: [] },
  8: { best: [], friend: [4, 6], average: [1, 2, 5, 7, 8, 9], enemy: [3] },
  9: { best: [2, 3, 6, 7, 9], friend: [1, 4], average: [5, 8], enemy: [] },
};

const TIER_TO_TONE: Record<Tier, CompatTone> = {
  best: "Amazing",
  friend: "Favourable",
  average: "Neutral",
  enemy: "Challenging",
};

function tierFor(self: number, partner: number): Tier {
  const row = ASTROSAGE_ROWS[self];
  if (!row) return "average";
  if (row.best.includes(partner)) return "best";
  if (row.friend.includes(partner)) return "friend";
  if (row.enemy.includes(partner)) return "enemy";
  if (row.average.includes(partner)) return "average";
  return "average";
}

/** Directional Vedic pair tone (self → partner), Numora labels only. */
export function vedicPairTone(
  selfRaw: number,
  partnerRaw: number,
): CompatTone {
  const self = reduceToSingleDigit(selfRaw);
  const partner = reduceToSingleDigit(partnerRaw);
  return TIER_TO_TONE[tierFor(self, partner)];
}

export function buildVedicCompatibilityMatrix(
  coreNumber: number,
): CompatCell[] {
  const self = reduceToSingleDigit(coreNumber);
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((partner) => {
    const base = vedicPairTone(self, partner);
    return {
      partnerLifePath: partner,
      romantic: channelTone(base, "romantic", self, partner),
      business: channelTone(base, "business", self, partner),
      friendship: channelTone(base, "friendship", self, partner),
    };
  });
}

export const VEDIC_COMPAT_NOTE =
  "Vedic layers: Psychic (Moolank) reflects day-to-day temperament themes; Destiny (Bhagyank) reflects longer-path themes; Name (Namank) reflects the name spelling used in this reading. Partner tones use a traditional 1–9 relationship table mapped to Amazing / Favourable / Neutral / Challenging. Johari-style note: 3–6–9 often read as mutually friendly; Number 6 as a universal friend; name↔destiny harmony supports social ease.";
