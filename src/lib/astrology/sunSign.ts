/** Tropical sun sign from calendar month/day (no birth time). */

export type SunSignId =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type SunSignInfo = {
  id: SunSignId;
  name: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Cardinal" | "Fixed" | "Mutable";
  symbol: string;
  theme: string;
  strengths: string[];
  watchouts: string[];
  practice: string;
};

const SIGNS: SunSignInfo[] = [
  {
    id: "aries",
    name: "Aries",
    element: "Fire",
    modality: "Cardinal",
    symbol: "♈",
    theme: "Initiating courage and honest momentum",
    strengths: ["Direct action", "Competitive spark", "Fresh starts"],
    watchouts: ["Impatience", "Starting without finishing"],
    practice: "Channel heat into one clear weekly challenge.",
  },
  {
    id: "taurus",
    name: "Taurus",
    element: "Earth",
    modality: "Fixed",
    symbol: "♉",
    theme: "Steady building and sensory loyalty",
    strengths: ["Persistence", "Practical taste", "Reliable presence"],
    watchouts: ["Stubborn comfort zones", "Resistance to needed change"],
    practice: "Keep one beauty ritual while allowing one small change.",
  },
  {
    id: "gemini",
    name: "Gemini",
    element: "Air",
    modality: "Mutable",
    symbol: "♊",
    theme: "Curious exchange and mental agility",
    strengths: ["Communication", "Learning speed", "Social versatility"],
    watchouts: ["Scattered attention", "Talking past depth"],
    practice: "Finish one conversation thread in writing each week.",
  },
  {
    id: "cancer",
    name: "Cancer",
    element: "Water",
    modality: "Cardinal",
    symbol: "♋",
    theme: "Protective care and emotional memory",
    strengths: ["Nurture", "Intuitive bonding", "Home-making instinct"],
    watchouts: ["Mood tides", "Clinging to the past"],
    practice: "Name feelings early; care includes your own shell.",
  },
  {
    id: "leo",
    name: "Leo",
    element: "Fire",
    modality: "Fixed",
    symbol: "♌",
    theme: "Warm visibility and creative heart",
    strengths: ["Generosity", "Leadership presence", "Playful creativity"],
    watchouts: ["Pride bruises", "Needing constant spotlight"],
    practice: "Create for joy once without an audience.",
  },
  {
    id: "virgo",
    name: "Virgo",
    element: "Earth",
    modality: "Mutable",
    symbol: "♍",
    theme: "Discerning craft and useful service",
    strengths: ["Detail care", "Improvement instinct", "Practical help"],
    watchouts: ["Over-critique", "Worry loops"],
    practice: "Ship “good enough” then refine—perfection is iterative.",
  },
  {
    id: "libra",
    name: "Libra",
    element: "Air",
    modality: "Cardinal",
    symbol: "♎",
    theme: "Balance, beauty, and fair relating",
    strengths: ["Diplomacy", "Aesthetic sense", "Partnership skill"],
    watchouts: ["Indecision", "Peace at self-cost"],
    practice: "Choose one preference aloud before polling the room.",
  },
  {
    id: "scorpio",
    name: "Scorpio",
    element: "Water",
    modality: "Fixed",
    symbol: "♏",
    theme: "Depth, loyalty, and transformative focus",
    strengths: ["Emotional honesty", "Research intensity", "Resilience"],
    watchouts: ["Control habits", "All-or-nothing trust"],
    practice: "Share one vulnerability with a safe person this month.",
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    element: "Fire",
    modality: "Mutable",
    symbol: "♐",
    theme: "Expansive meaning and adventurous truth-seeking",
    strengths: ["Optimism", "Teaching bent", "Big-picture courage"],
    watchouts: ["Overpromising", "Restless escape"],
    practice: "Commit to one study path long enough to teach it.",
  },
  {
    id: "capricorn",
    name: "Capricorn",
    element: "Earth",
    modality: "Cardinal",
    symbol: "♑",
    theme: "Ambitious structure and long-game integrity",
    strengths: ["Discipline", "Strategic patience", "Responsible leadership"],
    watchouts: ["Harsh self-standards", "Work as only identity"],
    practice: "Schedule rest as a milestone, not a reward after collapse.",
  },
  {
    id: "aquarius",
    name: "Aquarius",
    element: "Air",
    modality: "Fixed",
    symbol: "♒",
    theme: "Original ideals and community-minded innovation",
    strengths: ["Independent thought", "Friendship networks", "Future focus"],
    watchouts: ["Emotional distance", "Rebellion without roots"],
    practice: "Pair a big idea with one human conversation.",
  },
  {
    id: "pisces",
    name: "Pisces",
    element: "Water",
    modality: "Mutable",
    symbol: "♓",
    theme: "Empathic imagination and compassionate flow",
    strengths: ["Creativity", "Spiritual sensitivity", "Kind intuition"],
    watchouts: ["Boundary blur", "Escapist fog"],
    practice: "Protect creative time; say no to one drain weekly.",
  },
];

export const SUN_SIGNS: Record<SunSignId, SunSignInfo> = Object.fromEntries(
  SIGNS.map((s) => [s.id, s]),
) as Record<SunSignId, SunSignInfo>;

/** month 1–12, day 1–31 */
export function sunSignFromMonthDay(month: number, day: number): SunSignInfo {
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return SUN_SIGNS.aries;
  if (md >= 420 && md <= 520) return SUN_SIGNS.taurus;
  if (md >= 521 && md <= 620) return SUN_SIGNS.gemini;
  if (md >= 621 && md <= 722) return SUN_SIGNS.cancer;
  if (md >= 723 && md <= 822) return SUN_SIGNS.leo;
  if (md >= 823 && md <= 922) return SUN_SIGNS.virgo;
  if (md >= 923 && md <= 1022) return SUN_SIGNS.libra;
  if (md >= 1023 && md <= 1121) return SUN_SIGNS.scorpio;
  if (md >= 1122 && md <= 1221) return SUN_SIGNS.sagittarius;
  if (md >= 1222 || md <= 119) return SUN_SIGNS.capricorn;
  if (md >= 120 && md <= 218) return SUN_SIGNS.aquarius;
  return SUN_SIGNS.pisces; // 219–320
}

/** DOB as DD/MM/YYYY */
export function sunSignFromDob(dob: string): SunSignInfo | null {
  const m = dob.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return sunSignFromMonthDay(month, day);
}

export function isSunSignId(value: string): value is SunSignId {
  return value in SUN_SIGNS;
}
