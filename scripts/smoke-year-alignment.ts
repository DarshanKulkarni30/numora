/**
 * Career / life year alignment: core stays still; Personal Year changes the approach.
 */
import {
  buildYearAlignment,
  scoreYearAlignment,
} from "../src/lib/numerology/blueprint/yearAlignment";

function assert(cond: unknown, label: string) {
  if (!cond) {
    console.error("FAIL", label);
    process.exit(1);
  }
  console.log("ok", label);
}

const py3 = scoreYearAlignment({
  calendarYear: 2026,
  personalYear: 3,
  bn: 3,
  dn: 3,
  nameRoot: 7,
  nameCompound: 43,
  cycleLetter: "S",
  cycleNumber: 3,
});
const py7 = scoreYearAlignment({
  calendarYear: 2023,
  personalYear: 7,
  bn: 3,
  dn: 3,
  nameRoot: 7,
  nameCompound: 43,
  cycleLetter: "D",
  cycleNumber: 4,
});

assert(py3.bn === 3 && py3.dn === 3 && py3.nameDisplay === "43/7", "core strip");
assert(py3.cycleLetter === "S" && py3.cycleNumber === 3, "2026 name cycle S/3");
assert(!JSON.stringify(py3).includes("%"), "no percent grades");
assert(!JSON.stringify(py7).includes("%"), "no percent grades in PY7");

const venture3 = py3.careers.find((r) => r.id === "venture");
const venture7 = py7.careers.find((r) => r.id === "venture");
assert(venture3 && venture7, "entrepreneurship row exists");
assert(venture3!.core === venture7!.core, "core fit does not change with the year");
assert(venture3!.year !== venture7!.year, "year fit changes with Personal Year");
assert(venture3!.verdict === "strong-now", "PY 3 entrepreneurship is strong now");
assert(venture7!.verdict === "better-later", "PY 7 entrepreneurship is better later");
assert(
  venture3!.approach !== venture7!.approach,
  "best approach changes with year mode",
);

const research7 = py7.careers.find((r) => r.id === "research");
assert(research7 && research7.year >= 4, "PY 7 supports research");

assert(
  py3.priorities[0] && py3.priorityLine.includes(py3.priorities[0].title),
  "priority line names the top life area",
);
assert(
  py3.careers.every((r) => r.why.bn.includes("Birth Number")),
  "each career row explains BN",
);

const live = buildYearAlignment({
  dob: "10/10/1980",
  natalName: "Darshan Kulkarni",
  calendarYear: 2026,
  bn: 1,
  dn: 2,
  nameRoot: 7,
  nameCompound: 43,
  yearAnchor: "birthday",
});
assert(live.calendarYear === 2026, "live outlook year");
assert(live.careers.length >= 5, "career rows");
assert(live.life.length >= 5, "life rows");
assert(live.personalYear >= 1 && live.personalYear <= 9, "personal year 1–9");
assert(
  py3.starKey.core.toLowerCase().includes("does not change"),
  "star key explains core stays still",
);
assert(
  py3.careers.every((r) => r.starRead.length > 20),
  "each career row says how to read the stars",
);
assert(
  venture7!.starRead.toLowerCase().includes("approach") ||
    venture7!.starRead.toLowerCase().includes("method"),
  "weaker year stars explain method, not quitting",
);

console.log("smoke:year-alignment passed");
