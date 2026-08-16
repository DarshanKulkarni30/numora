/**
 * Unit System–style Projected Year Number (NumoraWisdom-original meanings).
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

export type YearTag = "Favourable" | "Neutral" | "Challenging";

export type ProjectedYearMeta = {
  planet: string;
  tag: YearTag;
  shortMeaning: string;
  theme: string;
  strengths: string[];
  watchouts: string[];
  details: string[];
  practice: string;
};

/** Reflective themes only — no remedies, fixed outcomes, or medical claims. */
export const PROJECTED_YEAR_META: Record<number, ProjectedYearMeta> = {
  1: {
    planet: "Sun",
    tag: "Favourable",
    shortMeaning:
      "A year that may ease prior friction and favor visible, organized starts.",
    theme:
      "A year that may favor fresh starts, clearer visibility, and steadier confidence after prior friction.",
    strengths: [
      "Initiative and organizing",
      "Support from mentors or authority figures",
      "Creative and competitive focus",
    ],
    watchouts: ["Pushing pace without rest", "Over-identifying with status"],
    details: [
      "Health and focus may feel easier to organize toward a path of progress—still not a medical forecast.",
      "Work and ventures may respond better when you plan ahead rather than improvise every week.",
      "Helpful introductions, including people with authority, may appear if you stay reachable.",
      "Study, writing, competitions, and carefully chosen new financial experiments may fit the tone.",
      "Makers—writers, musicians, visual work—may find a clearer lane for new pieces.",
    ],
    practice:
      "Start one meaningful project and protect sleep while you build momentum.",
  },
  2: {
    planet: "Moon",
    tag: "Favourable",
    shortMeaning:
      "A year that may raise warmth and favor patient, practical partnership.",
    theme:
      "A year that may emphasize partnership, timing, and emotional rhythm over solo force.",
    strengths: ["Collaboration", "Listening", "Adaptive pacing"],
    watchouts: ["Mood-led decisions", "Losing your preference in the group"],
    details: [
      "New acquaintances may become useful later if you stay consistent and kind.",
      "Worry and hurry tend to cost more this year than a slower, practical plan.",
      "Emotion can sit beside realism—name needs without flooding the room.",
      "Home and property themes may feel more workable with patience, not force.",
      "Thinking patterns may shift; give new views time before you lock them in.",
    ],
    practice: "Name one need clearly before agreeing to shared plans.",
  },
  3: {
    planet: "Jupiter",
    tag: "Favourable",
    shortMeaning:
      "A year that may open learning, expression, and a more generous public tone.",
    theme:
      "A year that may open teaching, growth conversations, and generous expression.",
    strengths: ["Counsel and learning", "Optimism with structure", "Storytelling"],
    watchouts: ["Overpromising", "Talking past completion"],
    details: [
      "A useful window to finish older projects and start well-planned work.",
      "Writing and speaking may carry more weight—stay precise; frankness can overshoot.",
      "Recognition and role growth may be available if the craft is actually ready.",
      "New friends are likely; test trust before leaning on them.",
      "Formal papers and contracts deserve a second read—this is caution, not legal advice.",
    ],
    practice: "Finish one idea before opening three new ones.",
  },
  4: {
    planet: "Rahu",
    tag: "Neutral",
    shortMeaning:
      "A year that may bring progress through difficulty, not around it.",
    theme:
      "A year that may bring unconventional paths, disruption, and rebuilt foundations.",
    strengths: ["Original routes", "Break-pattern courage", "Practical redesign"],
    watchouts: ["Chaos without a rebuild plan", "Restlessness as identity"],
    details: [
      "Success may arrive with friction; steadiness is the skill, not speed.",
      "Stay alert and calm when unforeseen obstacles show up.",
      "Income sources may widen if you keep a practical rebuild plan.",
      "New ventures, including housing themes, may be possible with extra diligence.",
      "Give novelty one constructive lane and review it weekly.",
    ],
    practice: "Give novelty one constructive lane with a weekly review.",
  },
  5: {
    planet: "Mercury",
    tag: "Favourable",
    shortMeaning:
      "A year that may favor communication, travel, trade, and a wider circle.",
    theme:
      "A year that may favor quick learning, messaging, trade, and flexible movement.",
    strengths: ["Curiosity", "Useful communication", "Adaptability"],
    watchouts: ["Scattered attention", "Impulse deals"],
    details: [
      "Media, writing, partnership, and study may feel more fluid.",
      "Travel and movement—for work or rest—may fit the year’s pace.",
      "Competitions and calculated experiments may be timely; scatter is the risk.",
      "Relations with officials or mentors may be easier if you stay clear and brief.",
      "Speak and sign with care. Romance may need extra honesty; nothing here promises marriage or children.",
    ],
    practice: "Choose one skill to deepen inside your versatility.",
  },
  6: {
    planet: "Venus",
    tag: "Favourable",
    shortMeaning:
      "A year that may highlight beauty, family ease, and creative craft.",
    theme:
      "A year that may highlight care, beauty, harmony, and relational responsibility.",
    strengths: ["Bridge-building", "Aesthetic sense", "Supportive presence"],
    watchouts: ["Over-giving", "Avoiding hard boundaries"],
    details: [
      "Household friction may be easier to settle when care has a clear edge.",
      "Creative and aesthetic work—design, performance, making—may find support.",
      "Enjoyment and decoration can be part of the year without turning into excess.",
      "Job search energy may move if you keep showing up; still not a hiring guarantee.",
      "Romance and family care belong inside consent, rest, and boundaries.",
    ],
    practice: "Offer care with a clear end time and a rest day.",
  },
  7: {
    planet: "Ketu",
    tag: "Challenging",
    shortMeaning:
      "A year that may test patience, profit, and inner clarity more than display.",
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
    details: [
      "Misunderstandings and heavier work for lighter return may appear.",
      "Formal disputes need careful, documented handling—not a legal forecast.",
      "Study, healing crafts, and quiet skill-building may be the better use of energy.",
      "Take fewer speculative risks; test helpers before leaning on them.",
      "Stay patient and optimistic enough to keep going; friction here is often a filter.",
    ],
    practice:
      "Test commitments gently; keep fewer risks; protect quiet study time.",
  },
  8: {
    planet: "Saturn",
    tag: "Neutral",
    shortMeaning:
      "A year that may reward independence and public effort while asking for recovery.",
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
    details: [
      "Structure, service, and long-game public work may find traction.",
      "Self-reliance and your own judgment matter more than borrowed certainty.",
      "Creative use of energy may help worldly tasks land cleaner.",
      "Stress needs scheduled rest; do not treat stamina as infinite.",
      "Health themes are a reminder to recover—see a clinician for care, not this page.",
    ],
    practice:
      "Build one durable habit and schedule recovery as part of the plan.",
  },
  9: {
    planet: "Mars",
    tag: "Favourable",
    shortMeaning:
      "A year that may favor completion, courage, and closing loops cleanly.",
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
    details: [
      "Projects and desires may reach a finish line if you organize the close.",
      "Support from people in authority may appear—keep speech measured.",
      "Competitions and public recognition tend to follow completed work, not unfinished drafts.",
      "Unexpected resources can show up in ordinary ways; this is not a lottery promise.",
      "Soften doubt and perfectionism; reflective practice may help the year land.",
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
