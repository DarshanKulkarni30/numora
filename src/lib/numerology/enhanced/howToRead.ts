import { assertSafeList } from "@/lib/numerology/safety";

const SHARED = [
  "Numbers stay visible — story and diagrams never replace the data.",
  "Timing (Personal Year, Month, Day) is a pacing season as of the date shown, not a prediction of events.",
];

export const HOW_TO_READ_ENHANCED = assertSafeList(
  [
    ...SHARED,
    "Pair percents are derived from how two numbers sit together, not a scientific score.",
    "This page is one story: how Soul (vowels — what you want inside), Birth (the day you were born), and Name work together. Name numbers use Chaldean letters (compound kept, then root). Open Detailed for every method, or Comprehensive for the four-node Chaldean story.",
    "Timing on the live HTML page updates when you open it. A saved PDF stays as of the download.",
  ],
  "howto.enhanced",
);

export const HOW_TO_READ_DETAILED = assertSafeList(
  [
    ...SHARED,
    "Counts (themes, threads, planet seats) are how many chart positions cite a tone, not scores or percentages.",
    "The Soul → Birth → Name flow is a relationship check. Tri-Identity Harmony below it is Birth × Destiny × Name — a different trio.",
    "Name seats (Expression, Soul, Personality) use Chaldean letters. The Pythagorean letter totals sit in a short comparison strip. Date seats stay the date method.",
    "This page is the full catalog. Open Enhanced for one story, or Comprehensive for a Chaldean-first story.",
  ],
  "howto.detailed",
);

export const HOW_TO_READ_COMPREHENSIVE = assertSafeList(
  [
    ...SHARED,
    "Soul, Personality, and Name on this page use Chaldean letter values. Birth and Destiny still come from the date.",
    "Soul number: vowels — what you want inside. Birth number: day of the month, 1–9. Destiny number: full date digits, 1–9. Name number: long total / one digit of the whole name.",
    "Percents are Numora’s check of how two numbers sit. They are not extra Chaldean digits and not a promise of luck.",
  ],
  "howto.comprehensive",
);
