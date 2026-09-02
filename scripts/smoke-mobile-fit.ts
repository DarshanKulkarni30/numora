/**
 * Smoke: mobile fit weights, root-fit tones, flags, and verdict caps.
 */
import { evaluateMobileFit } from "../src/lib/numerology/mobileFit";
import { slidingPairs } from "../src/lib/numerology/mobileCompoundPairs";
import { rootFitTone } from "../src/lib/numerology/mobileRootFit";
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
eq(rootFitTone(1, 5), "Favourable", "1 vs 5 favourable");
eq(rootFitTone(1, 4), "Steady", "1 vs 4 steady");
eq(rootFitTone(1, 8), "Heavy", "1 vs 8 heavy");
eq(rootFitTone(3, 6), "Favourable", "3 vs 6 favourable");
eq(rootFitTone(3, 8), "Heavy", "3 vs 8 heavy");
eq(rootFitTone(1, 1), "Steady", "1 vs 1 unlisted sits steady");

const windows = slidingPairs("98765");
eq(
  windows.map((p) => p.pair),
  ["98", "87", "76", "65"],
  "sliding adjacent pairs",
);

const parsed = parseMobile("98765 43210");
ok(parsed.ok && parsed.core === 9, "9876543210 reduces to 9");

const easy = evaluateMobileFit("01/01/1990", "9876543210", "personal");
ok(easy.ok, "easy number parses");
if (easy.ok) {
  eq(easy.fit.birthNumber, 1, "BN 1 for 01/01/1990");
  eq(easy.fit.destinyNumber, 3, "DN 3 for 01/01/1990");
  eq(easy.fit.core, 9, "core 9");
  eq(easy.fit.bnTone, "Favourable", "BN 1 vs 9");
  eq(easy.fit.dnTone, "Favourable", "DN 3 vs 9");
  eq(easy.fit.pillars.root, 1, "root pillar 1");
  ok(easy.fit.score >= 70, `easy score ${easy.fit.score} >= 70`);
  eq(easy.fit.verdict, "Supportive", "easy verdict");
}

const strain = evaluateMobileFit("01/01/1990", "8888888888", "personal");
ok(strain.ok, "strain number parses");
if (strain.ok) {
  eq(strain.fit.core, 8, "core 8");
  eq(strain.fit.bnTone, "Heavy", "BN 1 vs 8 heavy");
  eq(strain.fit.dnTone, "Heavy", "DN 3 vs 8 heavy");
  ok(strain.fit.strainRuns.length > 0, "sequential strain run on 8");
  ok(strain.fit.score <= 44, `capped score ${strain.fit.score} <= 44`);
  eq(strain.fit.verdict, "Caution", "capped verdict");
}

const mixed = evaluateMobileFit("01/01/1990", "9876543214", "personal");
ok(mixed.ok, "mixed number parses");
if (mixed.ok) {
  eq(mixed.fit.core, 4, "core 4");
  eq(mixed.fit.bnTone, "Steady", "BN 1 vs 4 steady");
  eq(mixed.fit.dnTone, "Steady", "DN 3 vs 4 steady");
  ok(mixed.fit.verdict !== "Supportive", "steady+steady root is not Supportive");
}

const strainRepeat = evaluateMobileFit("01/01/1990", "8123456780", "personal");
ok(strainRepeat.ok, "two 8s parse");
if (strainRepeat.ok) {
  ok(
    strainRepeat.fit.flags.some(
      (f) => f.kind === "strainRepeat" && f.digit === 8,
    ),
    "8 strain-repeat flag",
  );
}

const over = evaluateMobileFit("01/01/1990", "1111111113", "personal");
ok(over.ok, "over-repeat number parses");
if (over.ok) {
  ok(
    over.fit.flags.some((f) => f.kind === "overCount" && f.digit === 1),
    "1 over-count flag",
  );
  ok(
    over.fit.flags.some((f) => f.kind === "alreadyInGrid" && f.digit === 1),
    "1 already on birth grid",
  );
}

console.log("smoke-mobile-fit passed");
