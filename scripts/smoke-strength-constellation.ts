/**
 * Smoke: weighted strength constellation (core vs supporting vs mix).
 */
import { STRENGTH_BANK } from "../src/lib/numerology/meanings";
import { plainTrait } from "../src/lib/numerology/layeredCopy";
import {
  STRENGTH_ACTIONS,
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
has(lonely.map[0]!.watchLine, "Watch:", "stretch gifts still get a watch, not a second try");
has(model.extra[0]!.tryLine, "Try:", "overflow gifts carry a try");
has(model.extra[0]!.watchLine, "Watch:", "overflow gifts carry a watch");

const bankLabels = Object.values(STRENGTH_BANK).flat();
eq(bankLabels.length, 36, "STRENGTH_BANK still has 36 gifts");
for (const label of bankLabels) {
  if (!STRENGTH_ACTIONS[label]) {
    console.error(`FAIL missing STRENGTH_ACTIONS for: ${label}`);
    process.exit(1);
  }
}
console.log("ok every bank gift has a try/watch row");

const lp3 = buildStrengthConstellation({
  strengths: STRENGTH_BANK[3]!,
  lifePath: "3",
  vedicPsychic: "3",
});
const tries = new Set(lp3.nodes.map((n) => n.tryLine));
eq(tries.size, 3, "Life Path 3 gifts each get a different try");
const trait3 = plainTrait(3);
for (const n of lp3.nodes) {
  const count = n.sourceLine.split(trait3).length - 1;
  if (count >= 2) {
    console.error(
      `FAIL sourceLine repeats the trait: ${n.sourceLine}`,
    );
    process.exit(1);
  }
}
console.log("ok sourceLine does not repeat the same trait");
has(
  lp3.nodes[0]!.sourceLine,
  "Life Path 3",
  "sourceLine names Life Path",
);
has(
  lp3.nodes[0]!.sourceLine,
  "Psychic 3",
  "sourceLine names Psychic when it matches",
);

console.log("strength constellation smoke ok");
