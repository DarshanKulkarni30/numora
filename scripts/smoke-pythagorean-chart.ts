/**
 * Smoke checks for Pythagorean chart extras (P0).
 */
import { generateReport } from "../src/lib/numerology/report";
import {
  buildPythagoreanChart,
  resolvePythagoreanChart,
} from "../src/lib/numerology/pythagoreanChart";
import { buildEnhancedReading } from "../src/lib/numerology/enhanced";

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected ${e}\n  actual   ${a}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function assert(cond: unknown, label: string) {
  if (!cond) {
    console.error("FAIL", label);
    process.exit(1);
  }
  console.log("ok", label);
}

const asOf = new Date(2026, 7, 21);
const chart = buildPythagoreanChart({
  natalName: "Darshan Kulkarni",
  dateOfBirth: "10/10/1980",
  coreNumbers: [11, 1, 1],
  asOf,
});

eq(chart.balance.number, 6, "D+K balance 4+2=6");
eq(chart.hiddenPassion.numbers, [1], "Hidden Passion 1 (four A's/S values)");
assert(chart.karmicLessons.numbers.includes(6), "missing 6 is a lesson");
assert(chart.karmicLessons.numbers.includes(7), "missing 7 is a lesson");
assert(!chart.karmicLessons.numbers.includes(1), "1 is present so not a lesson");
eq(
  chart.challenges.map((c) => c.number),
  [0, 8, 8, 8],
  "challenges |1-1|, |1-9|, |0-8|, |1-9|",
);
eq(chart.periodCycles.map((p) => p.number), [1, 1, 9], "period month/day/year");
assert(chart.challenges.length === 4, "four challenges");
assert(chart.periodCycles.length === 3, "three period cycles");
assert(chart.planes.length === 4, "four name planes");
assert(chart.planes.every((p) => typeof p.summary === "string"), "plane copy");
assert(chart.personalDay.number >= 1, "personal day present");
assert(chart.essence.transits.length >= 1, "essence transits");
assert(
  chart.planeNote.toLowerCase().includes("lo shu"),
  "planes distinguished from Lo Shu",
);
assert(!chart.methodNote.toLowerCase().includes("decoz"), "no third-party brand");

const report = generateReport(
  {
    fullName: "Darshan Kulkarni",
    dateOfBirth: "10/10/1980",
    purpose: "Self-reflection",
  },
  asOf,
);
assert(report.numerology_snapshot.balance_number === "6", "snapshot balance");
assert(
  (report.numerology_snapshot.hidden_passion ?? "").includes("1"),
  "snapshot hidden passion",
);
const resolved = resolvePythagoreanChart(report, asOf);
eq(resolved.balance.number, 6, "resolve matches engine");

const enhanced = buildEnhancedReading(report, { now: asOf });
assert(enhanced.pythagoreanChart.challenges.length === 4, "enhanced has challenges");
assert(
  enhanced.coreStrip.some((c) => c.label === "Balance"),
  "enhanced core strip includes Balance",
);
assert(
  enhanced.coreStrip.some((c) => c.label === "Personal Day"),
  "enhanced core strip includes Personal Day",
);

const emptyish = buildPythagoreanChart({
  natalName: "李",
  dateOfBirth: "10/10/1980",
  coreNumbers: [1],
  asOf,
});
assert(emptyish.balance.number === 0, "non-Latin name has no balance digit");
assert(emptyish.karmicLessons.numbers.length === 9, "all letter-values missing");

console.log("smoke:pythagorean-chart passed");
