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
has(
  darshan.synergyLabel,
  "Two layers share a number",
  "label names the shared pair",
);
// The summary must name the three numbers it is comparing, so a first-time
// reader knows what a "layer" is before being told how the layers interact.
has(darshan.synergySummary, "Life Path", "synergy names Life Path");
has(darshan.synergySummary, "Name number", "synergy names the Name number");
has(
  darshan.synergySummary,
  "counted twice",
  "synergy explains why a shared digit matters",
);
eq(darshan.palette.primary.name, "Blue-grey", "primary blue-grey");
eq(darshan.palette.secondary.name, "Earth brown", "secondary earth brown");
eq(darshan.palette.highlight.name, "Silver", "highlight prefers silver");
// The narrative must say what a matching Life Path and Destiny actually means
// for the reader, and how the Name number relates to them.
has(
  darshan.narrative,
  "Two different methods reaching the same digit",
  "narrative explains the doubled digit",
);
has(
  darshan.narrative,
  "changes the delivery, not the direction",
  "name 2 works with the 4 rather than against it",
);
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
has(
  auraIdentityPdfLines(darshan).join(" "),
  "Your three main numbers",
  "pdf banner line",
);

console.log("aura identity smoke ok");
