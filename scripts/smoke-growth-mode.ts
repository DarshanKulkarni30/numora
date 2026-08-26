/**
 * Growth Mode: development number vs wedge index, and no "catalyst" titles.
 */
import {
  contextMixLine,
  growthDevelopmentLine,
  growthFocusKicker,
  howToUseFocusThisWeek,
  synthesizeGrowthAreas,
} from "../src/lib/numerology/growthAreas";
import type { LoShuResult, NumerologySnapshot } from "../src/lib/numerology/types";

function assert(cond: unknown, label: string) {
  if (!cond) {
    console.error("FAIL", label);
    process.exit(1);
  }
  console.log("ok", label);
}

function mockLoShu(missing: number[]): LoShuResult {
  const grid: Record<number, number> = {};
  for (let n = 1; n <= 9; n++) grid[n] = missing.includes(n) ? 0 : 1;
  return {
    present_numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      (n) => !missing.includes(n),
    ),
    missing_numbers: missing,
    repeated_numbers: [],
    mental_plane: "",
    emotional_plane: "",
    practical_plane: "",
    present_arrows: [],
    missing_arrows: [],
    analysis: "",
    grid,
  };
}

function mockSnap(): NumerologySnapshot {
  return {
    life_path: "11",
    birth_day: "3",
    expression_number: "3",
    soul_urge_number: "6",
    personality_number: "5",
    maturity_number: "5",
    chaldean_name_number: "5",
    compound_number: "23",
    vedic_psychic: "3",
    vedic_destiny: "9",
    vedic_name: "5",
    personal_year: "7",
    personal_month: "6",
  };
}

const areas = synthesizeGrowthAreas({
  snap: mockSnap(),
  loShu: mockLoShu([4, 5, 8]),
  fullName: "Test Person",
  growthBank: [],
});

const ambition = areas.find((a) => a.id === "lo-shu-catalyst-8");
assert(ambition, "missing 8 produces an Ambition seat");
assert(ambition?.title === "Ambition", "title is Ambition, not Ambition catalyst");
assert(ambition?.focusNumber === 8, "development number is 8");
assert(
  growthDevelopmentLine(ambition!) === "Development number 8",
  "development line names 8",
);
assert(growthFocusKicker() === "This week's focus", "kicker has no catalyst index");
assert(
  !growthFocusKicker().toLowerCase().includes("catalyst"),
  "kicker does not say catalyst",
);

const blob = JSON.stringify(areas);
assert(!blob.includes("Catalyst 3"), "no wedge-index Catalyst 3 string");
assert(
  !blob.toLowerCase().includes("ambition catalyst"),
  "no Ambition catalyst title in the bank",
);

const third = areas[2];
assert(
  third?.id === "lo-shu-catalyst-8" && third.focusNumber === 8,
  "third wedge is still missing 8, not a 'catalyst 3'",
);

const deploy = howToUseFocusThisWeek(ambition!, 7, 6);
assert(
  deploy.toLowerCase().includes("study") && deploy.toLowerCase().includes("tend"),
  "7/6 week line connects year STUDY to month TEND",
);
assert(
  contextMixLine(7, 6).toLowerCase().includes("care"),
  "7/6 mix is plain learn-then-care language",
);

const lp = areas.find((a) => a.origin === "life-path");
assert(
  areas.every((a) => !/catalyst/i.test(a.title)),
  "no user-facing title contains catalyst",
);
assert(lp?.focusNumber === 11, "Life Path seat keeps 11, not a Lo Shu 8");
assert(
  growthDevelopmentLine(lp!) === "Life Path 11",
  "Life Path seat does not claim development number 8",
);

console.log("smoke:growth-mode passed");
