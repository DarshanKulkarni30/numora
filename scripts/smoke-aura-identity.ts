/**
 * Smoke checks for the tri-aura identity engine (Path / Destiny / Name).
 */
import {
  auraIdentityPdfLines,
  buildAuraIdentity,
  synergyKind,
} from "../src/lib/numerology/auraIdentity";

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

eq(synergyKind(4, 4), "aligned", "4/4 aligned");
eq(synergyKind(4, 2), "complementary", "4/2 complementary (Favourable pair)");
eq(synergyKind(1, 7), "contrasting", "1/7 contrasting");

const darshan = buildAuraIdentity({
  lifePath: "4",
  vedicDestiny: "4",
  chaldeanName: "2",
});

eq(darshan.layers.map((l) => l.digit), [4, 4, 2], "4 / 4 / 2 digits");
eq(darshan.pairs[0].kind, "aligned", "path × destiny aligned");
eq(darshan.pairs[1].kind, "complementary", "path × name complementary");
eq(darshan.synergyScore, 67, "aligned+complementary+complementary = 67");
has(darshan.synergyLabel, "Aligned path", "label names aligned path");
eq(darshan.palette.primary.name, "Blue-grey", "primary blue-grey");
eq(darshan.palette.secondary.name, "Earth brown", "secondary earth brown");
eq(darshan.palette.highlight.name, "Silver", "highlight prefers silver");
has(darshan.narrative, "softens", "name 2 softens the 4 aura");
has(darshan.crystals.map((c) => c.name).join(","), "Hessonite", "hessonite present");
has(darshan.crystals.map((c) => c.keyword).join(","), "Grounding", "hessonite grounding");
has(darshan.anchors.map((a) => a.name).join(","), "Iron", "iron anchor");
has(darshan.anchors.map((a) => a.name).join(","), "Silver", "silver anchor");
eq(
  darshan.rhythms.map((r) => r.weekday).sort(),
  ["Monday", "Saturday"],
  "Monday + Saturday rhythm days",
);
eq(
  darshan.rhythms.find((r) => r.weekday === "Saturday")?.planet.id,
  "saturn",
  "Saturday is Saturn",
);
eq(
  darshan.rhythms.find((r) => r.weekday === "Monday")?.planet.id,
  "moon",
  "Monday is Moon",
);

const blob = [
  darshan.narrative,
  darshan.insight,
  ...darshan.rhythms.map((r) => r.invitation),
  ...darshan.crystals.map((c) => c.body),
  ...auraIdentityPdfLines(darshan),
].join(" ");
lacks(blob, "karmic", "no karmic jargon");
lacks(blob, "avoid", "no avoid-activities");
lacks(blob, "least supportive", "no least-supportive stone");
lacks(blob, "purchase", "crystal bodies are not purchase prompts");
has(auraIdentityPdfLines(darshan).join(" "), "Aura identity", "pdf banner line");

console.log("aura identity smoke ok");
