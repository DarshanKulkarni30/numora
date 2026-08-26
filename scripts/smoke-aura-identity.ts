/**
 * Smoke checks for the tri-aura identity engine (Path / Destiny / Name).
 */
import { allAssociationColors } from "../src/lib/numerology/associations";
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

for (const color of allAssociationColors()) {
  if (!color.title || color.tags.length !== 3 || !color.line || !color.action || !color.use) {
    console.error(`FAIL colour meaning incomplete: ${color.name}`);
    process.exit(1);
  }
}
console.log("ok", "every 1–9 colour has title/tags/line/action/use");

const darshan = buildAuraIdentity({
  lifePath: "4",
  vedicDestiny: "4",
  chaldeanName: "2",
  personalYear: "5",
  personalMonth: "3",
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
eq(darshan.palette.primary.layers, ["path", "destiny"], "blue-grey from path+destiny");
eq(darshan.palette.highlight.layers, ["name"], "silver highlight is name-only");
has(darshan.paletteSummary, "blue-grey", "summary names primary colour");
has(darshan.paletteSummary, "earth brown", "summary names secondary colour");
has(darshan.paletteSummary, "silver", "summary names highlight colour");
has(darshan.palette.primary.job, "usual setting", "primary role is usual setting");
has(darshan.palette.secondary.action, "Do the next", "secondary has a micro-action");
eq(darshan.climate?.year.name, "Light green", "year 5 first colour");
eq(darshan.climate?.month.name, "Yellow", "month 3 first colour");
has(darshan.climate?.caption ?? "", "not your natal aura", "climate caption");
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

const roshni = buildAuraIdentity({
  lifePath: "11",
  vedicDestiny: "2",
  chaldeanName: "6",
  personalYear: "1",
  personalMonth: "8",
});
eq(roshni.palette.primary.name, "Cream", "11/2/6 primary cream");
eq(roshni.palette.secondary.name, "Soft green", "11/2/6 secondary soft green");
eq(roshni.palette.highlight.name, "White", "11/2/6 highlight white");
eq(
  roshni.palette.primary.layers,
  ["path", "destiny"],
  "cream from path 11 and destiny 2",
);
eq(
  roshni.palette.secondary.layers,
  ["path", "destiny"],
  "soft green from path+destiny, not name",
);
eq(roshni.palette.highlight.layers, ["name"], "white highlight is name 6 only");
eq(
  roshni.palette.primary.sources.map((s) => `${s.id}:${s.raw}`),
  ["path:11", "destiny:2"],
  "cream badges PATH 11 / DESTINY 2",
);
eq(
  roshni.palette.highlight.sources.map((s) => `${s.id}:${s.raw}`),
  ["name:6"],
  "white badge NAME 6",
);
has(roshni.paletteSummary, "calm clarity", "summary uses cream title");
has(roshni.paletteSummary, "care with boundaries", "summary uses soft green title");
has(roshni.paletteSummary, "be clear", "summary uses white title");
const roshniBlob = [
  roshni.paletteSummary,
  ...auraIdentityPdfLines(roshni),
].join(" ");
lacks(roshniBlob, "highest convergence", "name-only highlight is not convergence");

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
has(
  auraIdentityPdfLines(darshan).join(" "),
  "Try this:",
  "pdf includes micro-actions",
);
has(
  auraIdentityPdfLines(darshan).join(" "),
  "Personal Year 5",
  "pdf includes year climate",
);

console.log("aura identity smoke ok");
