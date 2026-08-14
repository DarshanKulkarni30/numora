/**
 * Unit System–style Projected Year Number (Numora-original meanings).
 * Formula: month + day + (year % 100) + weekday planet digit → digital root 1–9.
 */

import { parseDob, reduceNumber } from "./reduce";

/** JS getDay() index 0=Sun … 6=Sat → Unit System weekday digits. */
export const WEEKDAY_DIGIT = [1, 2, 9, 5, 3, 6, 8] as const;

export const WEEKDAY_LABEL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type ProjectedYearBreakdown = {
  year: number;
  month: number;
  day: number;
  yearDigits: number;
  weekdayIndex: number;
  weekdayLabel: string;
  weekdayDigit: number;
  compound: number;
  number: number;
};

export function projectedYearBreakdown(
  dob: string,
  year: number,
): ProjectedYearBreakdown {
  const { day, month } = parseDob(dob);
  const y = Math.trunc(year);
  const yearDigits = ((y % 100) + 100) % 100;
  const anniversary = new Date(y, month - 1, day);
  const weekdayIndex = anniversary.getDay();
  const weekdayDigit = WEEKDAY_DIGIT[weekdayIndex] ?? 1;
  const compound = month + day + yearDigits + weekdayDigit;
  const number = reduceNumber(compound, []);
  return {
    year: y,
    month,
    day,
    yearDigits,
    weekdayIndex,
    weekdayLabel: WEEKDAY_LABEL[weekdayIndex] ?? "Sunday",
    weekdayDigit,
    compound,
    number,
  };
}

export function projectedYearNumber(dob: string, year: number): number {
  return projectedYearBreakdown(dob, year).number;
}

export type ProjectedYearMeta = {
  planet: string;
  theme: string;
  strengths: string[];
  watchouts: string[];
  practice: string;
};

/** Reflective themes only — no remedies, fixed outcomes, or medical claims. */
export const PROJECTED_YEAR_META: Record<number, ProjectedYearMeta> = {
  1: {
    planet: "Sun",
    theme:
      "A year that may favor fresh starts, clearer visibility, and steadier confidence after prior friction.",
    strengths: [
      "Initiative and organizing",
      "Support from mentors or authority figures",
      "Creative and competitive focus",
    ],
    watchouts: ["Pushing pace without rest", "Over-identifying with status"],
    practice:
      "Start one meaningful project and protect sleep while you build momentum.",
  },
  2: {
    planet: "Moon",
    theme:
      "A year that may emphasize partnership, timing, and emotional rhythm over solo force.",
    strengths: ["Collaboration", "Listening", "Adaptive pacing"],
    watchouts: ["Mood-led decisions", "Losing your preference in the group"],
    practice: "Name one need clearly before agreeing to shared plans.",
  },
  3: {
    planet: "Jupiter",
    theme:
      "A year that may open teaching, growth conversations, and generous expression.",
    strengths: ["Counsel and learning", "Optimism with structure", "Storytelling"],
    watchouts: ["Overpromising", "Talking past completion"],
    practice: "Finish one idea before opening three new ones.",
  },
  4: {
    planet: "Rahu",
    theme:
      "A year that may bring unconventional paths, disruption, and rebuilt foundations.",
    strengths: ["Original routes", "Break-pattern courage", "Practical redesign"],
    watchouts: ["Chaos without a rebuild plan", "Restlessness as identity"],
    practice: "Give novelty one constructive lane with a weekly review.",
  },
  5: {
    planet: "Mercury",
    theme:
      "A year that may favor quick learning, messaging, trade, and flexible movement.",
    strengths: ["Curiosity", "Useful communication", "Adaptability"],
    watchouts: ["Scattered attention", "Impulse deals"],
    practice: "Choose one skill to deepen inside your versatility.",
  },
  6: {
    planet: "Venus",
    theme:
      "A year that may highlight care, beauty, harmony, and relational responsibility.",
    strengths: ["Bridge-building", "Aesthetic sense", "Supportive presence"],
    watchouts: ["Over-giving", "Avoiding hard boundaries"],
    practice: "Offer care with a clear end time and a rest day.",
  },
  7: {
    planet: "Ketu",
    theme:
      "A year that may feel inward, testing, and clarifying—better for study than loud ambition.",
    strengths: [
      "Depth and discernment",
      "Healing arts and contemplative craft",
      "Patience under friction",
    ],
    watchouts: [
      "Misunderstandings from withdrawal",
      "Risk-taking for distraction",
      "Romance without clear consent and pace",
    ],
    practice:
      "Test commitments gently; keep fewer risks; protect quiet study time.",
  },
  8: {
    planet: "Saturn",
    theme:
      "A year that may reward structure, independence, and responsible public effort.",
    strengths: [
      "Long-game stamina",
      "Self-reliance",
      "Service and organizational work",
    ],
    watchouts: [
      "Stress without recovery",
      "Carrying every load alone",
      "Hardening under pressure",
    ],
    practice:
      "Build one durable habit and schedule recovery as part of the plan.",
  },
  9: {
    planet: "Mars",
    theme:
      "A year that may emphasize completion, courage, and organizing energy toward closure.",
    strengths: [
      "Finishing cycles",
      "Competitive focus",
      "Community recognition for completed work",
    ],
    watchouts: [
      "Harsh words under urgency",
      "Perfectionism delaying closure",
      "Doubt that stalls action",
    ],
    practice:
      "Close one loop cleanly; soften speech with people in authority.",
  },
};

export function projectedYearMeta(n: number): ProjectedYearMeta {
  const d = reduceNumber(n, []);
  return PROJECTED_YEAR_META[d] ?? PROJECTED_YEAR_META[1];
}

export const PROJECTED_YEAR_METHOD_NOTE =
  "Projected Year (Unit System style) adds birth month, birth day, the year’s last two digits, and the weekday digit of that year’s anniversary, then reduces to 1–9. It sits beside Western Personal Year as a second reflective mirror—not a forecast of fixed events.";
