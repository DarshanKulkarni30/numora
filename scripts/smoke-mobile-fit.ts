/**
 * Smoke: hierarchical mobile fit, pair grades, multiplicity, hard-stop.
 */
import { evaluateMobileFit } from "../src/lib/numerology/mobileFit";
import {
  isSeverePair,
  pairKind,
  slidingPairs,
} from "../src/lib/numerology/mobileCompoundPairs";
import { alignmentPoints, rootFitTone } from "../src/lib/numerology/mobileRootFit";
import { parseMobile } from "../src/lib/numerology/mobileNumber";
import { classifyLoShuCells, scoreLoShu } from "../src/lib/numerology/mobileLoShu";
import {
  analyzeLastFour,
  scorePurposeSuitability,
} from "../src/lib/numerology/mobileLastFour";

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected ${e}\n  actual   ${a}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function ok(cond: unknown, label: string) {
  if (!cond) {
    console.error(`FAIL ${label}`);
    process.exit(1);
  }
  console.log("ok", label);
}

eq(rootFitTone(1, 9), "Favourable", "1 vs 9 favourable");
eq(rootFitTone(1, 8), "Heavy", "1 vs 8 heavy");
eq(alignmentPoints(3, 3), 25, "exact match 25");
eq(alignmentPoints(1, 9), 22, "favourable 22");
eq(alignmentPoints(1, 4), 13, "steady 13");
eq(alignmentPoints(1, 8), 3, "heavy 3");

eq(pairKind("48"), "severeConflict", "48 severe");
eq(pairKind("84"), "severeConflict", "84 severe");
eq(pairKind("36"), "neutral", "36 not automatic severe");
eq(pairKind("63"), "strongConflict", "63 high conflict, not severe");
eq(isSeverePair("28"), true, "28 severe");
eq(isSeverePair("36"), false, "36 not in hard-stop set");
eq(pairKind("15"), "highlyFavourable", "15 highly favourable");
eq(pairKind("12"), "highlyFavourable", "12 lift");
eq(pairKind("66"), "favourable", "66 lift");

const windows = slidingPairs("98765");
eq(
  windows.map((p) => p.pair),
  ["98", "87", "76", "65"],
  "sliding adjacent pairs",
);

eq(
  slidingPairs("6666").filter((p) => p.pair === "66").length,
  3,
  "6666 has three 66 windows",
);

eq(
  slidingPairs("9876543210").length,
  9,
  "10 digits = 9 adjacent pairs",
);

const parsed = parseMobile("98765 43210");
ok(parsed.ok && parsed.core === 9 && parsed.compound === 45, "9876543210 → 45 → 9");

const easy = evaluateMobileFit("01/01/1990", "1915173513", "personal");
ok(easy.ok, "easy number parses");
if (easy.ok) {
  eq(easy.fit.birthNumber, 1, "BN 1");
  eq(easy.fit.destinyNumber, 3, "DN 3");
  eq(easy.fit.core, 9, "root 9");
  eq(easy.fit.compound, 36, "compound 36 → 9");
  eq(easy.fit.bnTone, "Favourable", "BN 1 vs 9");
  eq(easy.fit.dnTone, "Favourable", "DN 3 vs 9");
  eq(easy.fit.pairs.length, 9, "easy number has 9 pairs");
  ok(!easy.fit.hasSevereConflict, "lift sequence has no hard-stop pair");
  ok(easy.fit.score >= 60, `easy score ${easy.fit.score} >= 60`);
  ok(
    easy.fit.verdict !== "Avoid" && easy.fit.verdict !== "Weak",
    `easy verdict ${easy.fit.verdict} is not weak`,
  );
  ok(easy.fit.pillars.sequence > 0, "sequence pillar");
  ok(easy.fit.pillars.pairing.base > 0, "pair base points");
  ok(easy.fit.loShuImpact.line.length > 10, "Lo Shu impact line");
}

const severe = evaluateMobileFit("01/01/1990", "9848123456", "personal");
ok(severe.ok, "severe-pair number parses");
if (severe.ok) {
  ok(severe.fit.hasSevereConflict, "48 detected as high-conflict");
  ok(severe.fit.score <= 79, `hard-stop score ${severe.fit.score} <= 79`);
  ok(
    severe.fit.verdict !== "Exceptional" && severe.fit.verdict !== "Excellent",
    `hard-stop verdict ${severe.fit.verdict}`,
  );
}

const strain = evaluateMobileFit("01/01/1990", "8888888888", "personal");
ok(strain.ok, "strain number parses");
if (strain.ok) {
  eq(strain.fit.core, 8, "core 8");
  eq(strain.fit.bnTone, "Heavy", "BN 1 vs 8 heavy");
  eq(strain.fit.dnTone, "Heavy", "DN 3 vs 8 heavy");
  ok(strain.fit.strainRuns.length > 0, "sequential strain run on 8");
  ok(
    strain.fit.verdict === "Avoid" || strain.fit.verdict === "Weak",
    `overdose/strain verdict ${strain.fit.verdict}`,
  );
}

const mixed36 = evaluateMobileFit("01/01/1990", "1235365710", "personal");
ok(mixed36.ok, "mixed 36 sequence parses");
if (mixed36.ok) {
  ok(
    mixed36.fit.pairs.some((p) => p.pair === "36"),
    "36 present but does not zero the number",
  );
  ok(!mixed36.fit.hasSevereConflict, "36 is not a hard-stop");
  ok(mixed36.fit.score > 20, "one mixed pair is not a total fail");
}

const over = evaluateMobileFit("01/01/1990", "1111111113", "personal");
ok(over.ok, "over-repeat number parses");
if (over.ok) {
  ok(
    over.fit.flags.some((f) => f.kind === "overCount" && f.digit === 1),
    "1 over-count flag",
  );
}

const venus = evaluateMobileFit("01/01/1990", "1266663510", "personal");
ok(venus.ok, "venus-run number parses");
if (venus.ok) {
  const sixes = venus.fit.pairInsights.find((p) => p.pair === "66");
  ok(sixes && sixes.count === 3, "66 occurs three times in 6666");
  ok(sixes && sixes.inRun && sixes.runLength === 4, "66 sits in a 6666 run");
  ok(venus.fit.loShuImpact.covers.length + venus.fit.loShuImpact.stillQuiet.length >= 0, "impact fields present");
}

const rootOnly = evaluateMobileFit("03/12/1986", "9920931535", "business");
ok(rootOnly.ok, "9920931535 parses");
if (rootOnly.ok) {
  eq(rootOnly.fit.compound, 46, "digit total 46 kept as metadata");
  eq(rootOnly.fit.core, 1, "mobile root is 1");
  eq(rootOnly.fit.birthNumber, 3, "BN 3");
  eq(rootOnly.fit.destinyNumber, 3, "DN 3");
  eq(rootOnly.fit.bnTone, "Favourable", "root 1 vs BN 3");
  eq(rootOnly.fit.dnTone, "Favourable", "root 1 vs DN 3");
  eq(rootOnly.fit.pillars.destiny, 22, "DN scores root only, not pair 46");
  eq(rootOnly.fit.pillars.birth, 17.6, "BN scores root only, scaled to 20");
  ok(rootOnly.fit.hasSevereConflict, "99 is still a sequence hard-stop");
}

const birthLike = {
  grid: { 1: 2, 2: 0, 3: 0, 4: 1, 5: 2, 6: 0, 7: 0, 8: 0, 9: 3 },
};
const cover98 = parseMobile("9833127652");
ok(cover98.ok, "9833127652 parses");
if (cover98.ok) {
  const lo = scoreLoShu(birthLike, cover98.digitCounts, slidingPairs(cover98.digits), cover98.digits);
  eq(lo.filledMissing, [2, 3, 6, 7, 8], "five quiet cells covered");
  eq(lo.raw, 15, "raw cover is full");
  eq(lo.integrity, 2, "98 + cover-digit joins 27/76 → 2/5, not a 50% cut");
  eq(lo.total, 17, "one 98 cluster stays in 16–18 Lo Shu");
  ok(lo.contaminatedBy.includes("98"), "98 marked as remedial contamination");
}

const noTouchGrid = {
  grid: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 1, 8: 1, 9: 1 },
};
const elsewhere = parseMobile("9911111112");
ok(elsewhere.ok, "9911111112 parses");
if (elsewhere.ok) {
  const lo = scoreLoShu(noTouchGrid, elsewhere.digitCounts, slidingPairs(elsewhere.digits), elsewhere.digits);
  eq(lo.integrity, 5, "99 does not cut Lo Shu when it does not touch a cover digit");
}

const repeat98 = parseMobile("9898127653");
ok(repeat98.ok, "9898127653 parses");
if (repeat98.ok) {
  const lo = scoreLoShu(birthLike, repeat98.digitCounts, slidingPairs(repeat98.digits), repeat98.digits);
  ok(lo.integrity <= 1, `repeated 98/89 integrity ${lo.integrity} <= 1`);
  ok(lo.total < 18, `repeated conflict Lo Shu ${lo.total} < single-98 score`);
}

const miss56 = {
  grid: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 0, 6: 0, 7: 1, 8: 1, 9: 1 },
};

function tones(digits: string) {
  const parsed = parseMobile(digits);
  if (!parsed.ok) {
    console.error("FAIL parse", digits);
    process.exit(1);
  }
  return classifyLoShuCells(
    miss56,
    parsed.digitCounts,
    slidingPairs(parsed.digits),
    parsed.digits,
  );
}

const clean5 = tones("5152371938");
eq(clean5[5]?.tone, "cleanRemedy", "scattered 5 ×2 is teal, not rose for being center");

const run5 = tones("5512371938");
eq(run5[5]?.tone, "patternFlag", "55 run flags central 5");
ok(
  (run5[5]?.note ?? "").includes("central Lo Shu position"),
  "55 note is structural scrutiny, not 5-is-bad",
);

const alt56 = tones("5656371938");
eq(alt56[5]?.tone, "patternFlag", "5656 flags 5 for the pattern");
eq(alt56[6]?.tone, "patternFlag", "5656 also flags 6 for sequence intensity");
ok(
  (alt56[5]?.note ?? "").includes("5656"),
  "5 note names the 5656 sequence",
);

const watch6 = tones("6652371938");
eq(watch6[6]?.tone, "watchRemedy", "66 on a quiet outer cell is amber, not auto-clean");

const miss8 = {
  grid: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 0, 9: 1 },
};
const conflict8 = parseMobile("9812376543");
ok(conflict8.ok, "9812376543 parses");
if (conflict8.ok) {
  const cells = classifyLoShuCells(
    miss8,
    conflict8.digitCounts,
    slidingPairs(conflict8.digits),
    conflict8.digits,
  );
  eq(cells[8]?.tone, "conflictRemedy", "8 via 98 is conflict-affected cover");
}

const tail3651 = analyzeLastFour("1111113651", 3, 3);
ok(tail3651, "3651 last four parses");
if (tail3651) {
  eq(tail3651.digits, "3651", "last four digits");
  eq(tail3651.compound, 15, "last-four total is metadata 15");
  eq(tail3651.root, 6, "last-four root 6");
  eq(tail3651.slots[3]?.digit, 1, "10th is 1");
  ok(!tail3651.slots[3]?.isZero, "3651 last slot is not zero");
  const purpose = scorePurposeSuitability(tail3651, 6, 3, 3);
  ok(purpose.business >= 70, `3651 business ${purpose.business} >= 70`);
  ok(purpose.wealth >= 65, `3651 wealth ${purpose.wealth} >= 65`);
}

const tail3650 = analyzeLastFour("1111113650", 3, 3);
ok(tail3650, "3650 last four parses");
if (tail3651 && tail3650) {
  eq(tail3650.root, 5, "3650 last-four root 5");
  ok(tail3650.slots[3]?.isZero, "10th position 0 is flagged");
  ok(
    tail3650.slots[3]!.raw < tail3651.slots[3]!.raw,
    "0 in last slot weakens more than a 1 there",
  );
  ok(tail3650.points < tail3651.points, "3650 last-four slice < 3651");
  const p0 = scorePurposeSuitability(tail3650, 5, 3, 3);
  const p1 = scorePurposeSuitability(tail3651, 6, 3, 3);
  ok(p0.wealth < p1.wealth, "0 in last slot lowers wealth suitability");
}

const tail5065 = analyzeLastFour("1111115065", 3, 3);
ok(tail5065, "5065 last four parses");
if (tail5065) {
  ok(tail5065.slots[1]?.isZero, "0 in 8th weakens receiver emotion");
  eq(tail5065.pairs.map((p) => p.pair), ["50", "06", "65"], "5065 last-four pairs");
}

console.log("smoke-mobile-fit passed");
