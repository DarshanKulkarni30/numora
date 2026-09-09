import { assertSafeList } from "@/lib/numerology/safety";

const SHARED = [
  "Numbers stay visible — story and diagrams never replace the data.",
  "Timing (Personal Year, Month, Day) is a pacing season as of the date shown, not a prediction of events.",
];

export const HOW_TO_READ_ENHANCED = assertSafeList(
  [
    ...SHARED,
    "Pair percents are derived from how two numbers sit together, not a scientific score.",
    "This page is the through-line: how Soul, Birth, and Name work together. Open the detailed report for method notes and the full catalog.",
  ],
  "howto.enhanced",
);

export const HOW_TO_READ_DETAILED = assertSafeList(
  [
    ...SHARED,
    "Counts (themes, threads, planet seats) are how many chart positions cite a tone, not scores or percentages.",
    "The Soul → Birth → Name flow is a relationship engine. Tri-Identity Harmony below it is Birth × Destiny × Name — a different trio.",
    "This page is the full catalog. Open Enhanced for one profile-level story, season, and plan.",
  ],
  "howto.detailed",
);
