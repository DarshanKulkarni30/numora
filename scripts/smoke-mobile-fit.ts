/**
 * Smoke: hierarchical mobile fit (35/25/20/20), pair grades, hard-stop.
 */
import { evaluateMobileFit } from "../src/lib/numerology/mobileFit";
import {
  isSeverePair,
  pairKind,
  slidingPairs,
} from "../src/lib/numerology/mobileCompoundPairs";
import { alignmentPoints, rootFitTone } from "../src/lib/numerology/mobileRootFit";
import { parseMobile } from "../src/lib/numerology/mobileNumber";

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
eq(pairKind("36"), "severeConflict", "36 severe");
eq(pairKind("63"), "severeConflict", "63 severe");
eq(isSeverePair("28"), true, "28 severe");
eq(pairKind("15"), "highlyFavourable", "15 highly favourable");
eq(pairKind("12"), "neutral", "12 neutral");

const windows = slidingPairs("98765");
eq(
  windows.map((p) => p.pair),
  ["98", "87", "76", "65"],
  "sliding adjacent pairs",
);

const parsed = parseMobile("98765 43210");
ok(parsed.ok && parsed.core === 9 && parsed.compound === 45, "9876543210 → 45 → 9");

const easy = evaluateMobileFit("01/01/1990", "9876543210", "personal");
ok(easy.ok, "easy number parses");
if (easy.ok) {
  eq(easy.fit.birthNumber, 1, "BN 1");
  eq(easy.fit.destinyNumber, 3, "DN 3");
  eq(easy.fit.core, 9, "root 9");
  eq(easy.fit.compound, 45, "compound 45 kept");
  eq(easy.fit.bnTone, "Favourable", "BN 1 vs 9");
  eq(easy.fit.dnTone, "Favourable", "DN 3 vs 9");
  ok(easy.fit.score >= 60, `easy score ${easy.fit.score} >= 60`);
  ok(
    easy.fit.verdict !== "Avoid" && easy.fit.verdict !== "Weak",
    `easy verdict ${easy.fit.verdict} is not weak`,
  );
  ok(easy.fit.pillars.sequence > 0, "sequence pillar");
  ok(easy.fit.pillars.ending > 0, "ending pillar");
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

const oneSevere = evaluateMobileFit("01/01/1990", "1234563670", "personal");
ok(oneSevere.ok, "mixed sequence parses");
if (oneSevere.ok) {
  ok(
    oneSevere.fit.pairs.some((p) => p.pair === "36"),
    "36 present but does not zero the number",
  );
  ok(oneSevere.fit.score > 20, "one high-conflict pair is not a total fail");
}

const over = evaluateMobileFit("01/01/1990", "1111111113", "personal");
ok(over.ok, "over-repeat number parses");
if (over.ok) {
  ok(
    over.fit.flags.some((f) => f.kind === "overCount" && f.digit === 1),
    "1 over-count flag",
  );
}

console.log("smoke-mobile-fit passed");
