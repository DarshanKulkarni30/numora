/**
 * Smoke checks for annual rhythm (PY / outlook / month / sun).
 */
import { buildYearRhythm, yearRhythmPdfLines } from "../src/lib/numerology/yearRhythm";

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

const darshan = buildYearRhythm({
  personalYear: "5",
  personalMonth: "4",
  outlook: "5",
  yearNature: "Dynamic",
  sunSignId: "libra",
});

eq(darshan.layers[0].digit, 5, "PY 5");
eq(darshan.layers[2].digit, 4, "month 4");
eq(darshan.layers[0].season.season, "Wind season", "year 5 is wind");
eq(darshan.layers[2].season.season, "Earth season", "month 4 is earth");
eq(darshan.sun?.name, "Libra", "Libra center");
has(darshan.yearMonth, "frame", "5↔4 uses frame / boundary copy");
has(darshan.sunInfluence, "Libra", "sun influence names Libra");
has(darshan.summary, "wind", "summary names wind year");
has(darshan.summary, "earth", "summary names earth month");
has(darshan.summary, "libra", "summary names Libra");

const blob = [
  darshan.yearMonth,
  darshan.sunInfluence,
  darshan.summary,
  ...yearRhythmPdfLines(darshan),
].join(" ");
lacks(blob, "expect ", "no expect-event language");
lacks(blob, "will happen", "no will-happen");

console.log("year rhythm smoke ok");
