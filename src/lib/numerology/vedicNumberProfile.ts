/**
 * Unit System number profile — Numora-synthesized affinity and association notes.
 * Separate from AstroSage-style compatibility tiers in vedicCompatibility.ts.
 */

export type VedicNumberProfile = {
  planet: string;
  friendly: number[];
  challenging: number[];
  neutral: number[];
  exaltationCompound: number;
  favorableDates: number[];
  weekday: string;
  direction: string;
  color: string;
  gem: string;
  behavior: string;
  karmicLesson: string;
  outlook: string;
  professionsHint: string[];
};

export const VEDIC_NUMBER_PROFILES: Record<number, VedicNumberProfile> = {
  1: {
    planet: "Sun",
    friendly: [2, 3, 9],
    challenging: [4, 6, 8],
    neutral: [5],
    exaltationCompound: 28,
    favorableDates: [1, 19, 28],
    weekday: "Sunday",
    direction: "East",
    color: "Gold",
    gem: "Ruby",
    behavior: "Assertive presence",
    karmicLesson: "Learning when to release control",
    outlook: "Open to modern ideas with a leadership bent",
    professionsHint: [
      "Administration",
      "Team leadership",
      "Public-facing roles",
    ],
  },
  2: {
    planet: "Moon",
    friendly: [1, 3],
    challenging: [5, 4],
    neutral: [6, 8, 9],
    exaltationCompound: 29,
    favorableDates: [2, 20, 29],
    weekday: "Monday",
    direction: "Southwest",
    color: "White / silver",
    gem: "Pearl",
    behavior: "Responsive and noncommittal until trust builds",
    karmicLesson: "Steady individuality inside partnership",
    outlook: "Devotional and idealistic tones",
    professionsHint: [
      "Diplomacy",
      "Teaching",
      "Research and mediation",
    ],
  },
  3: {
    planet: "Jupiter",
    friendly: [1, 2, 9],
    challenging: [5, 6],
    neutral: [8, 4],
    exaltationCompound: 12,
    favorableDates: [3, 12, 21, 30],
    weekday: "Thursday",
    direction: "Northeast",
    color: "Yellow",
    gem: "Yellow sapphire",
    behavior: "Optimistic and opportunity-seeking",
    karmicLesson: "Selfless service without performance",
    outlook: "Giving new meaning to familiar values",
    professionsHint: [
      "Teaching and scholarship",
      "Advisory work",
      "Creative performance",
    ],
  },
  4: {
    planet: "Rahu",
    friendly: [5, 6, 8],
    challenging: [1, 2, 9],
    neutral: [3],
    exaltationCompound: 31,
    favorableDates: [4, 13, 22, 31],
    weekday: "Saturday-adjacent study day",
    direction: "Southeast",
    color: "Earth gold / grey-gold",
    gem: "Hessonite",
    behavior: "Protective and sometimes antagonistic under stress",
    karmicLesson: "Satisfaction without endless edge-seeking",
    outlook: "Unconventional routes",
    professionsHint: [
      "Planning and systems",
      "Technical craft",
      "Policy or legal study",
    ],
  },
  5: {
    planet: "Mercury",
    friendly: [1, 4, 6],
    challenging: [2],
    neutral: [9, 3, 8],
    exaltationCompound: 23,
    favorableDates: [5, 14, 23],
    weekday: "Wednesday",
    direction: "North",
    color: "Green",
    gem: "Emerald",
    behavior: "Playful, quick, sometimes restless",
    karmicLesson: "Sobriety of focus inside versatility",
    outlook: "Practical curiosity",
    professionsHint: [
      "Trade and markets",
      "Communication",
      "Investment learning",
    ],
  },
  6: {
    planet: "Venus",
    friendly: [4, 5, 8],
    challenging: [1, 2],
    neutral: [3, 9],
    exaltationCompound: 24,
    favorableDates: [6, 15, 24],
    weekday: "Friday",
    direction: "Southeast",
    color: "Silver",
    gem: "Diamond",
    behavior: "Warm, attractive, responsibility-leaning",
    karmicLesson: "Discipline around caretaking",
    outlook: "Material grace with relational intelligence",
    professionsHint: [
      "Care and wellness support",
      "Arts criticism",
      "Journalism and design",
    ],
  },
  7: {
    planet: "Ketu",
    friendly: [8, 6, 5],
    challenging: [1, 2, 9],
    neutral: [3],
    exaltationCompound: 25,
    favorableDates: [7, 16, 25],
    weekday: "Monday",
    direction: "Northwest",
    color: "White / soft light",
    gem: "Cat’s eye",
    behavior: "Reflective and philosophic",
    karmicLesson: "Bringing insight into practical form",
    outlook: "Idealistic, sometimes utopian",
    professionsHint: [
      "Teaching and arts",
      "Film and storytelling",
      "Contemplative craft",
    ],
  },
  8: {
    planet: "Saturn",
    friendly: [4, 5, 6],
    challenging: [1, 2, 9],
    neutral: [3],
    exaltationCompound: 26,
    favorableDates: [8, 17, 26],
    weekday: "Saturday",
    direction: "West",
    color: "Black / deep indigo",
    gem: "Blue sapphire",
    behavior: "Sober endurance",
    karmicLesson: "Kindness and forgiveness under duty",
    outlook: "Materialist with a mystic streak",
    professionsHint: [
      "Public service",
      "Operations leadership",
      "Long-horizon management",
    ],
  },
  9: {
    planet: "Mars",
    friendly: [1, 2, 3],
    challenging: [5, 4],
    neutral: [6, 8],
    exaltationCompound: 27,
    favorableDates: [9, 18, 27],
    weekday: "Tuesday",
    direction: "South",
    color: "Red",
    gem: "Coral",
    behavior: "Decisive and energetic",
    karmicLesson: "Patience inside drive",
    outlook: "Idealistic and inwardly guided",
    professionsHint: [
      "Organizing and management",
      "Campaign or project leadership",
      "Competitive fields with ethics",
    ],
  },
};

export function vedicNumberProfile(n: number | string): VedicNumberProfile {
  const d = Math.abs(Math.trunc(Number(n))) % 9 || 9;
  return VEDIC_NUMBER_PROFILES[d] ?? VEDIC_NUMBER_PROFILES[1];
}

export const UNIT_AFFINITY_NOTE =
  "Unit System affinity notes (friendly / challenging / neutral) are a reflective overlay. Compatibility Matrix tiers use a separate traditional pairing table—treat differences as nuance, not conflict.";
