/**
 * Same Personal Year, different Year Resonance. PY digit is never rewritten.
 */
import { personalYearForCalendarYear } from "../src/lib/numerology/cycles";
import { buildYearResonance } from "../src/lib/numerology/blueprint/yearResonance";

function assert(cond: unknown, label: string) {
  if (!cond) {
    console.error("FAIL", label);
    process.exit(1);
  }
  console.log("ok", label);
}

const pyA = personalYearForCalendarYear("30/08/1981", 2026);
const pyB = personalYearForCalendarYear("30/08/1981", 2026);
assert(pyA === pyB, "same DOB → same Personal Year");

const allFive = buildYearResonance({
  personalYear: 5,
  bn: 5,
  dn: 5,
  soul: 5,
  nameRoot: 5,
  cycleNumber: 5,
  cycleLetter: "E",
});
const mixed = buildYearResonance({
  personalYear: 5,
  bn: 3,
  dn: 3,
  soul: 7,
  nameRoot: 8,
  cycleNumber: 3,
  cycleLetter: "S",
});

assert(allFive.personalYear === 5 && mixed.personalYear === 5, "PY digit stays 5");
assert(allFive.yearClass === "flow", "matching 5s is a flow year");
assert(mixed.yearClass !== "flow", "3/3/7/8 vs PY 5 is not a flow year");
assert(allFive.yearClass !== mixed.yearClass, "same PY, different resonance class");
assert(!JSON.stringify(allFive).includes("%"), "no percent grade");
assert(
  mixed.challenging.length >= 1,
  "mixed profile has at least one challenging year edge",
);
assert(
  mixed.whyDifferent.toLowerCase().includes("never rewrite"),
  "copy says name does not rewrite the year",
);

const expressSeven = buildYearResonance({
  personalYear: 3,
  bn: 3,
  dn: 3,
  soul: 7,
  nameRoot: 7,
  cycleNumber: 3,
  cycleLetter: "S",
});
assert(
  expressSeven.yearClass === "growth" || expressSeven.nameFit === "tension",
  "PY 3 vs Name 7 is productive tension",
);
assert(
  expressSeven.strategy.toLowerCase().includes("deadline"),
  "3 vs 7 strategy time-boxes research",
);

console.log("smoke:year-resonance passed");
