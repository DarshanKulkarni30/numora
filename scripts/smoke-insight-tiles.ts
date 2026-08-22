/**
 * Smoke: insight tiles for Detailed reading (Life Path 6 sample + safety).
 */
import { generateReport } from "../src/lib/numerology/report";
import {
  buildDetailedInsightCards,
  buildInsightCard,
} from "../src/lib/numerology/insightTiles";

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

const lp6 = buildInsightCard({
  topic: "life-path",
  label: "Life Path",
  value: "6",
  systemTag: "Pythagorean",
  geometry: "hexagon",
  snap: {
    life_path: "6",
    birth_day: "4",
    expression_number: "3",
    soul_urge_number: "7",
    personality_number: "5",
    maturity_number: "9",
    chaldean_name_number: "2",
    compound_number: "29",
    vedic_psychic: "4",
    vedic_destiny: "6",
    vedic_name: "3",
    personal_year: "1",
    personal_month: "8",
  },
});

eq(lp6.glyph, "❦", "life path 6 glyph is heart-leaf");
eq(lp6.geometry, "hexagon", "life path uses hexagon watermark");
has(lp6.keyword, "Care", "keyword care");
has(lp6.core, "care", "core meaning names care");
has(lp6.showsUp, "you thrive", "shows-up is second person");
has(lp6.growth, "keep one hour that is for you", "growth cue from life-path 6 practice");
// The narrative must carry a concrete try and watch, not an abstract summary.
has(lp6.narrative, "Try ", "mini-narrative for 6 offers something to try");
has(lp6.narrative, "watch ", "mini-narrative for 6 names what to watch");
eq(lp6.connections.length >= 3, true, "three cross-system connections");
eq(lp6.strengths.length >= 1, true, "strength tie-ins present");
eq(lp6.growthTies.length >= 1, true, "growth-mode catalyst tie-in");
has(
  lp6.connections.map((c) => c.body).join(" "),
  "tend to support each other",
  "complementary copy says how the pair helps",
);
has(
  lp6.connections.map((c) => c.body).join(" "),
  "Use them in the same task",
  "complementary copy ends with an action",
);

const su7 = buildInsightCard({
  topic: "soul-urge",
  label: "Soul Urge",
  value: "7",
  systemTag: "Pythagorean",
  geometry: "crescent",
  snap: lp6.related.reduce(
    (acc, row) => acc,
    {
      life_path: "6",
      birth_day: "4",
      expression_number: "3",
      soul_urge_number: "7",
      personality_number: "5",
      maturity_number: "9",
      chaldean_name_number: "2",
      compound_number: "29",
      vedic_psychic: "4",
      vedic_destiny: "6",
      vedic_name: "3",
      personal_year: "1",
      personal_month: "8",
    },
  ),
});
has(su7.showsUp, "underneath", "soul urge shows-up is inner want");
has(su7.narrative, "quiet time to think", "soul urge 7 narrative names the need");
has(
  su7.narrative,
  "researching instead of deciding",
  "soul urge 7 narrative names the failure mode",
);

const report = generateReport({
  fullName: "Aarav Mehta",
  preferredName: "Aarav",
  dateOfBirth: "15/08/1995",
  purpose: "Self-reflection",
});
const pack = buildDetailedInsightCards(report);
eq(pack.pythagorean.length, 6, "six Pythagorean tiles");
eq(pack.chaldean.length, 1, "one Chaldean tile");
eq(pack.vedic.length, 3, "three Vedic tiles");
eq(pack["core-personality"].length, 1, "one core atmosphere tile");
eq(pack["lo-shu"].length >= 1, true, "Lo Shu tiles from present/missing");

const blob = JSON.stringify(pack);
lacks(blob, "guaranteed success", "no guaranteed-success language");
lacks(blob, "will become", "no predictive will-become");
lacks(blob, "born bad", "no born-bad language");

console.log("insight tiles smoke passed");
