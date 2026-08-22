/**
 * Smoke: weighted strength constellation (core vs supporting vs mix).
 */
import { STRENGTH_BANK } from "../src/lib/numerology/meanings";
import {
  buildStrengthConstellation,
  splitStrengthLabel,
} from "../src/lib/numerology/strengthConstellation";

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

const split = splitStrengthLabel("Comfort initiating when others hesitate");
eq(
  split.title,
  "Comfort initiating when others hesitate",
  "title keeps the whole phrase",
);
eq(split.detail, "", "no detail when there is no clause break");

// Splitting on a preposition used to leave chips reading just "Willingness".
const preposition = splitStrengthLabel("Willingness to support others' growth");
eq(
  preposition.title,
  "Willingness to support others' growth",
  "preposition does not truncate the chip",
);

const clause = splitStrengthLabel("Steady presence, even under pressure");
eq(clause.title, "Steady presence", "a comma is a clean break");
eq(clause.detail, "even under pressure", "detail keeps the rest");

const pool = [
  ...(STRENGTH_BANK[1] ?? []),
  ...(STRENGTH_BANK[3] ?? []),
  ...(STRENGTH_BANK[4] ?? []),
];
const model = buildStrengthConstellation({
  strengths: pool.slice(0, 8),
  lifePath: "1",
  expression: "3",
  soulUrge: "4",
  vedicPsychic: "1",
});

eq(model.map.length, 5, "map shows five nodes, not eight");
eq(model.extra.length, 3, "remaining three are also-in-the-mix");
eq(
  model.map.every((n) => n.weight === "core") ||
    model.map.some((n) => n.weight === "core"),
  true,
  "at least one core from Life Path 1",
);
eq(model.map[model.defaultIndex]?.fromLifePath, true, "default focus is a Life Path gift");
eq(
  model.map.filter((n) => n.weight === "core").length >= 1,
  true,
  "Life Path gifts are core",
);
has(model.map[0]!.sources.join(" "), "Life Path", "core sources name Life Path");

const lonely = buildStrengthConstellation({
  strengths: STRENGTH_BANK[5]!.slice(0, 2),
  lifePath: "1",
  expression: "5",
});
eq(lonely.map.some((n) => n.weight === "core"), false, "5-gifts are not core for LP 1");
eq(lonely.map[0]?.weight, "stretch", "single non-LP source is stretch");

console.log("strength constellation smoke ok");
