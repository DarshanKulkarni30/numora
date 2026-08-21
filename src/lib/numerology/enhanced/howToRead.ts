import { assertSafeList } from "@/lib/numerology/safety";

const SHARED = [
  "Numbers stay visible — story and diagrams never replace the data.",
  "Counts (themes, threads, planet seats) are how many chart positions cite a tone, not scores or percentages.",
  "Timing (Personal Year, Month, Day) is a pacing season as of the date shown, not a prediction of events.",
];

export const HOW_TO_READ_ENHANCED = assertSafeList(
  [
    ...SHARED,
    "This is a live HTML reading: year and month pacing refresh with the calendar. A PDF is a snapshot from download time.",
    "The detailed report is the full catalog of methods; this page is the through-line.",
  ],
  "howto.enhanced",
);

export const HOW_TO_READ_DETAILED = assertSafeList(
  [
    ...SHARED,
    "This page is the full catalog. Open Enhanced for one profile-level story, season, and plan.",
  ],
  "howto.detailed",
);
