export type SchoolRow = {
  topic: string;
  pythagorean: string;
  chaldean: string;
  vedic: string;
};

export const SCHOOL_COMPARE: SchoolRow[] = [
  {
    topic: "Focus",
    pythagorean: "Identity layers (path, expression, inner/outer, maturity)",
    chaldean: "Name number (letter total, then one digit)",
    vedic: "Destiny path, day temperament, planets",
  },
  {
    topic: "Numbers",
    pythagorean: "1–9; 11/22/33 kept when they appear",
    chaldean: "Letter map 1–8; compounds often 10–52+",
    vedic: "1–9 with planetary rulers; name map aligned to Chaldean-style 1–8",
  },
  {
    topic: "Date work",
    pythagorean: "Life Path from reduced day, month, year parts",
    chaldean: "Date is secondary; name is the main instrument",
    vedic: "Psychic from birth day; Destiny from full date (no masters)",
  },
  {
    topic: "Strength of the lens",
    pythagorean: "Modern personality and contribution language",
    chaldean: "Traditional name atmosphere",
    vedic: "Karmic pacing, planets, and path language",
  },
  {
    topic: "How Numora uses it",
    pythagorean: "Core cards, identity layers, compatibility compass",
    chaldean: "Name compound + reduced; bookends; karmic compounds as growth pressure",
    vedic: "Psychic / Destiny / Name triad, Unit System note, projected year",
  },
];
