/**
 * Personal Year outlook: calendar vs birthday (School A), pinnacles, karmic 13/4, land band.
 */
import { personalYearBreakdown, personalYearCycleAt } from "../src/lib/numerology/cycles";
import { karmicDebtsFromDob } from "../src/lib/numerology/karmicDebt";
import { pinnaclesForDob, pinnacleAtAge } from "../src/lib/numerology/pinnacles";
import {
  yearLandScore,
  westernYearOutlook,
} from "../src/lib/numerology/personalYearOutlook";

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected ${e}\n  actual   ${a}`);
    process.exit(1);
  }
  console.log("ok", label);
}

const DOB = "13/10/1990";

eq(personalYearBreakdown(DOB, 2020).number, 9, "calendar 2020 → 9");
eq(personalYearBreakdown(DOB, 2021).number, 1, "calendar 2021 → 1");
eq(personalYearBreakdown(DOB, 2026).number, 6, "calendar 2026 → 6");

eq(
  personalYearCycleAt(DOB, new Date(2021, 2, 1)).number,
  9,
  "birthday School A: 1 Mar 2021 still PY 9",
);
eq(
  personalYearCycleAt(DOB, new Date(2021, 9, 13)).number,
  1,
  "birthday School A: 13 Oct 2021 activates PY 1",
);

const pins = pinnaclesForDob(DOB);
eq(
  pins.pinnacles.map((p) => p.number),
  [5, 5, 1, 2],
  "pinnacles 5, 5, 1, 2",
);
eq(pins.firstEndsAtAge, 30, "first pinnacle ends at age 30");
eq(pinnacleAtAge(pins, 35).number, 5, "age 35 still pinnacle 5");

const debts = karmicDebtsFromDob(DOB);
eq(
  debts.map((d) => d.label),
  ["13/4"],
  "karmic debt 13/4 from birth day",
);

const land = yearLandScore({
  personalYear: 6,
  dob: DOB,
  asOf: new Date(2026, 6, 1),
});
if (land.band === "lighter") {
  console.error("FAIL 2026 PY 6 land should not be lighter", land);
  process.exit(1);
}
console.log("ok 2026 PY 6 land band", land.band, land.score.toFixed(3));

const cal = westernYearOutlook({
  dob: DOB,
  anchor: "calendar",
  year: 2026,
  asOf: new Date(2026, 6, 1),
});
eq(cal.nature.nature, "Responsibility-heavy", "2026 nature is not Good/Amazing");

console.log("personal year smoke ok");
