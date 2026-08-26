/**
 * Smoke checks for annual rhythm (clock, mix, outlook mirror, weather copy).
 */
import {
  buildRhythmClock,
  buildYearRhythm,
  yearRhythmPdfLines,
} from "../src/lib/numerology/yearRhythm";

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected ${e}\n  actual   ${a}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function has(text: string, needle: string, label: string) {
  if (!text.toLowerCase().includes(needle.toLowerCase())) {
    console.error(`FAIL ${label}: missing "${needle}" in:\n${text}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function lacks(text: string, needle: string, label: string) {
  if (text.toLowerCase().includes(needle.toLowerCase())) {
    console.error(`FAIL ${label}: unexpected "${needle}"`);
    process.exit(1);
  }
  console.log("ok", label);
}

const asOf = new Date(2026, 7, 20);

const clock = buildRhythmClock({ cycleStartMonth: 10, asOf });
eq(clock.sectors[0]?.label, "Oct", "clock starts at birthday month");
eq(clock.sectors[clock.nowIndex]?.label, "Aug", "now marker is August");
eq(clock.fromBirthday, true, "birthday-start clock");
eq(clock.sectors.length, 12, "twelve sectors");

const darshan = buildYearRhythm({
  personalYear: "5",
  personalMonth: "4",
  outlook: "5",
  yearNature: "Dynamic",
  sunSignId: "libra",
  dateOfBirth: "13/10/1990",
  asOf,
});

eq(darshan.layers[0].digit, 5, "PY 5");
eq(darshan.layers[2].digit, 4, "month 4");
eq(darshan.layers[0].season.season, "Changing stretch", "year 5 is wind");
eq(darshan.layers[2].season.season, "Planning stretch", "month 4 is earth");
eq(darshan.layers[0].season.verb, "MOVE", "year verb MOVE");
eq(darshan.layers[2].season.verb, "BUILD", "month verb BUILD");
eq(darshan.mix.mixLabel, "A changing year, a planning month", "hero mix 5×4");
eq(darshan.sun?.name, "Libra", "Libra center");
eq(darshan.sunVerb, "INITIATE", "Libra cardinal → INITIATE");
eq(darshan.layers[0].role, "This year", "year is this year");
eq(darshan.layers[1].role, "Second count for this year", "outlook is second count");
eq(darshan.layers[2].role, "This month", "month is this month");
eq(darshan.clock.sectors[0]?.label, "Oct", "rhythm clock from Oct 13 DOB");
has(darshan.yearMonth, "routine", "5↔4 uses year-change plus month-plan");
has(darshan.mix.bestUse, "repeat", "best use is a repeating step");
has(darshan.mix.watchFor, "restless", "watch-for names restlessness");
has(darshan.mix.outlookNote, "one job for the year", "matching outlook names one job");
has(darshan.sunInfluence, "Libra", "sun influence names Libra");
has(darshan.summary, "Year 5", "summary names the year number");
has(darshan.summary, "Month 4", "summary names the month number");
has(darshan.summary, "libra", "summary names Libra");

// Master years must stay 11 in copy even though the season table is keyed 1-9.
const master = buildYearRhythm({
  personalYear: "11",
  personalMonth: "3",
  dateOfBirth: "30/08/1981",
  asOf,
});
eq(master.yearLabel, "11", "master year keeps 11");
has(master.summary, "Year 11", "summary keeps the master number");
has(master.seasonal, "Year 11", "seasonal keeps the master number");
lacks(master.summary, "Year 2", "reduced digit never reaches user copy");
has(master.masterGloss ?? "", "works like a 2", "gloss explains the reduction");
has(darshan.weatherPrinciple, "do not predict", "weather principle kept");

const mixed = buildYearRhythm({
  personalYear: "5",
  personalMonth: "4",
  outlook: "9",
  sunSignId: "virgo",
  dateOfBirth: "13/10/1990",
  asOf,
});
eq(mixed.sunVerb, "REFINE", "Virgo mutable earth → REFINE");
has(mixed.mix.outlookNote, "reads 9", "differing outlook names its number");
has(
  mixed.mix.outlookNote,
  "same year",
  "outlook not a third timeline",
);
has(
  mixed.mix.outlookNote,
  "calendar year",
  "outlook does not compete with the Personal Year",
);
eq(mixed.mix.mixLabel, "A changing year, a planning month", "hero stays year × month");

const blob = [
  darshan.yearMonth,
  darshan.sunInfluence,
  darshan.summary,
  darshan.mix.bestUse,
  darshan.mix.watchFor,
  darshan.mix.tension,
  darshan.weatherPrinciple,
  ...yearRhythmPdfLines(darshan),
  ...yearRhythmPdfLines(mixed),
].join(" ");
has(blob, "Try:", "pdf includes a try");
has(blob, "Watch:", "pdf includes a watch");
has(blob, "clock starts", "pdf includes clock");
has(blob, "calendar backdrop", "pdf tags astro separately");
lacks(blob, "expect ", "no expect-event language");
lacks(blob, "will happen", "no will-happen");
lacks(blob, "definitely will", "no definitely-will");

console.log("year rhythm smoke ok");
