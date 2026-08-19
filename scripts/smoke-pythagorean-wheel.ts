/**
 * Smoke checks for the Pythagorean personality wheel (Western 1–2–3 / 4–5–6 / 7–8–9).
 */
import type { NumerologySnapshot } from "../src/lib/numerology/types";
import {
  NODE_ANGLE,
  PYTH_NUMBER_KEYWORD,
  buildPythagoreanWheel,
  planeForDigit,
  polar,
  pythagoreanWheelPdfLines,
} from "../src/lib/numerology/pythagoreanWheel";

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

eq(planeForDigit(1), "mental", "1 is mental");
eq(planeForDigit(3), "mental", "3 is mental");
eq(planeForDigit(4), "emotional", "4 is emotional");
eq(planeForDigit(6), "emotional", "6 is emotional");
eq(planeForDigit(7), "practical", "7 is practical");
eq(planeForDigit(9), "practical", "9 is practical");
eq(PYTH_NUMBER_KEYWORD[2], "Cooperation", "missing-2 keyword");
eq(PYTH_NUMBER_KEYWORD[4], "Structure", "missing-4 keyword");

const top = polar(0, 80);
eq(Math.round(top.x), 100, "12 o'clock x");
eq(top.y < 100, true, "12 o'clock is above center");
eq(NODE_ANGLE[1] < NODE_ANGLE[3], true, "mental nodes run clockwise");

const snap: NumerologySnapshot = {
  life_path: "6",
  birth_day: "4",
  expression_number: "3",
  soul_urge_number: "7",
  personality_number: "5",
  maturity_number: "9",
  chaldean_name_number: "3",
  compound_number: "21",
  vedic_psychic: "4",
  vedic_destiny: "6",
  vedic_name: "3",
  personal_year: "1",
  personal_month: "1",
};

const wheel = buildPythagoreanWheel("13/10/1990", snap);
eq(wheel.counts[1], 2, "month 1 + year 1");
eq(wheel.counts[4], 2, "day 4 + birth day 4");
eq(wheel.counts[2], 0, "2 is quiet");
eq(wheel.counts[8], 0, "8 is quiet");
eq(wheel.dominant, "emotional", "emotional leads (4×2 + 5 + 6)");
eq(
  wheel.growth.map((g) => g.number),
  [2, 8],
  "growth halos 2 and 8",
);
has(wheel.growth[0].body, "Cooperation", "2 growth uses Cooperation");
has(wheel.growth[0].body, "invitation", "growth is invitation language");
lacks(wheel.growth.map((g) => g.body).join(" "), "void", "no void language");
lacks(wheel.growth.map((g) => g.body).join(" "), "defect", "no defect language");
lacks(
  wheel.growth.map((g) => g.body).join(" "),
  "difficulty with",
  "no difficulty-with verdict",
);

const creative = wheel.engines.find((e) => e.id === "creative");
eq(creative?.status, "inPlay", "3–6–9 creative engine in play");
const spiritual = wheel.engines.find((e) => e.id === "spiritual");
eq(spiritual?.status, "partial", "7–8–9 quiet 8 is partial");

const pull = buildPythagoreanWheel("13/10/1990", {
  ...snap,
  birth_day: "7",
  life_path: "3",
  soul_urge_number: "7",
  personality_number: "3",
});
has(
  pull.tensions.join(" "),
  "inner",
  "7 vs 3 mentions inner / visibility texture",
);

const pdf = pythagoreanWheelPdfLines(wheel).join(" ");
has(pdf, "1–2–3", "pdf names Western planes");
has(pdf, "not Lo Shu", "pdf distinguishes Lo Shu rows");

console.log("pythagorean wheel smoke ok");
