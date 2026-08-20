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
eq(darshan.layers[0].season.season, "Wind season", "year 5 is wind");
eq(darshan.layers[2].season.season, "Earth season", "month 4 is earth");
eq(darshan.layers[0].season.verb, "MOVE", "year verb MOVE");
eq(darshan.layers[2].season.verb, "BUILD", "month verb BUILD");
eq(darshan.mix.mixLabel, "MOVE → BUILD", "hero mix 5×4");
eq(darshan.sun?.name, "Libra", "Libra center");
eq(darshan.sunVerb, "INITIATE", "Libra cardinal → INITIATE");
eq(darshan.layers[0].role, "Climate", "year is climate");
eq(darshan.layers[1].role, "Mirror", "outlook is mirror");
eq(darshan.layers[2].role, "Weather", "month is weather");
eq(darshan.clock.sectors[0]?.label, "Oct", "rhythm clock from Oct 13 DOB");
has(darshan.yearMonth, "frame", "5↔4 uses frame / boundary copy");
has(darshan.mix.bestUse, "experiment", "best use is pair-level");
has(darshan.mix.watchFor, "restless", "watch-for names restlessness");
has(darshan.mix.outlookNote, "rhymes", "matching outlook is a rhyme");
has(darshan.sunInfluence, "Libra", "sun influence names Libra");
has(darshan.summary, "wind", "summary names wind year");
has(darshan.summary, "earth", "summary names earth month");
has(darshan.summary, "libra", "summary names Libra");
has(darshan.weatherPrinciple, "not events", "weather principle kept");

const mixed = buildYearRhythm({
  personalYear: "5",
  personalMonth: "4",
  outlook: "9",
  sunSignId: "virgo",
  dateOfBirth: "13/10/1990",
  asOf,
});
eq(mixed.sunVerb, "REFINE", "Virgo mutable earth → REFINE");
has(mixed.mix.outlookNote, "HARVEST", "differing outlook is harvest modifier");
has(mixed.mix.outlookNote, "second climate", "outlook not a third timeline");
eq(mixed.mix.mixLabel, "MOVE → BUILD", "hero stays year × month");

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
has(blob, "Best use", "pdf includes best use");
has(blob, "Watch for", "pdf includes watch for");
has(blob, "Clock:", "pdf includes clock");
has(blob, "ASTRO", "pdf tags astro separately");
lacks(blob, "expect ", "no expect-event language");
lacks(blob, "will happen", "no will-happen");
lacks(blob, "definitely will", "no definitely-will");

console.log("year rhythm smoke ok");
