/**
 * Smoke checks for Pythagorean chart extras (P0).
 */
import { generateReport } from "../src/lib/numerology/report";
import {
  buildPythagoreanChart,
  resolvePythagoreanChart,
} from "../src/lib/numerology/pythagoreanChart";
import { buildEnhancedReading } from "../src/lib/numerology/enhanced";
import { buildPythagoreanIdentityLayers } from "../src/lib/numerology/pythagoreanIdentityLayers";
import {
  buildInnerOuterPattern,
  INNER_OUTER_DIGITS,
  microForTensionStop,
} from "../src/lib/numerology/innerOuterPairs";

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected ${e}\n  actual   ${a}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function assert(cond: unknown, label: string) {
  if (!cond) {
    console.error("FAIL", label);
    process.exit(1);
  }
  console.log("ok", label);
}

const asOf = new Date(2026, 7, 21);
const chart = buildPythagoreanChart({
  natalName: "Darshan Kulkarni",
  dateOfBirth: "10/10/1980",
  coreNumbers: [11, 1, 1],
  asOf,
});

eq(chart.balance.number, 6, "D+K balance 4+2=6");
eq(chart.hiddenPassion.numbers, [1], "Hidden Passion 1 (four A's/S values)");
assert(chart.karmicLessons.numbers.includes(6), "missing 6 is a lesson");
assert(chart.karmicLessons.numbers.includes(7), "missing 7 is a lesson");
assert(!chart.karmicLessons.numbers.includes(1), "1 is present so not a lesson");
eq(
  chart.challenges.map((c) => c.number),
  [0, 8, 8, 8],
  "challenges |1-1|, |1-9|, |0-8|, |1-9|",
);
eq(chart.periodCycles.map((p) => p.number), [1, 1, 9], "period month/day/year");
assert(chart.challenges.length === 4, "four challenges");
assert(chart.periodCycles.length === 3, "three period cycles");
assert(chart.planes.length === 4, "four name planes");
assert(chart.planes.every((p) => typeof p.summary === "string"), "plane copy");
assert(chart.personalDay.number >= 1, "personal day present");
eq(chart.attitude.number, 2, "attitude 10+10=20→2");
assert(
  !chart.attitude.summary.toLowerCase().includes("door"),
  "attitude copy is plain",
);
assert(
  chart.challenges.some((c) => c.practice.toLowerCase().includes("from about age") || c.practice.toLowerCase().includes("from age")),
  "challenge names the age range in plain words",
);
assert(
  !chart.challenges.some((c) => c.practice.toLowerCase().includes("window is on")),
  "challenge does not say window is on",
);
assert(
  chart.karmicLessons.summary.toLowerCase().includes("does not judge") ||
    chart.karmicLessons.summary.toLowerCase().includes("every number from 1"),
  "karmic lesson summary is plain",
);
eq(chart.subconsciousSelf.number, 7, "subconscious self = 9 minus two lessons");
assert(chart.essence.transits.length >= 1, "essence transits");
assert(
  !chart.hiddenPassion.summary.toLowerCase().includes("native appetite"),
  "passion copy is plain",
);
assert(
  chart.hiddenPassion.summary.toLowerCase().includes("letter number") ||
    chart.hiddenPassion.summary.toLowerCase().includes("habit in the name"),
  "passion explains the number in simple words",
);
assert(
  !chart.essence.practice.toLowerCase().includes("colour the year"),
  "essence copy is plain",
);
assert(
  chart.personalDay.summary.toLowerCase().includes("today"),
  "personal day names today",
);

const magnusLayers = buildPythagoreanIdentityLayers({
  birthDay: "3",
  lifePath: "6",
  expression: "3",
  soulUrge: "1",
  personality: "11",
  maturity: "9",
});
assert(
  !magnusLayers.layers[0]!.micro.gift.toLowerCase().includes("leadership more adaptable"),
  "expression gift does not call Life Path 6 leadership",
);
assert(
  magnusLayers.layers[0]!.micro.gift.toLowerCase().includes("care") ||
    magnusLayers.layers[0]!.micro.gift.toLowerCase().includes("promises"),
  "expression gift names Life Path 6 in plain words",
);
assert(
  magnusLayers.layers[0]!.insight.toLowerCase().includes("talk") ||
    magnusLayers.layers[0]!.insight.toLowerCase().includes("ideas"),
  "expression insight is amateur-plain for 3",
);
assert(
  magnusLayers.layers[2]!.insight
    .toLowerCase()
    .includes("nothing switches on at a birthday"),
  "maturity is not a birthday switch",
);
assert(
  magnusLayers.layers[2]!.insight.includes("reduces to"),
  "maturity shows the sum, so it reads differently from the bridge",
);
assert(
  magnusLayers.expressionPattern.kind === "ex-bd-repeat",
  "Magnus Expression matches Birth Day, Life Path differs",
);

const threeNineThree = buildPythagoreanIdentityLayers({
  birthDay: "3",
  lifePath: "3",
  expression: "9",
  soulUrge: "1",
  personality: "11",
  maturity: "3",
});
const t93 = threeNineThree.layers[0]!;
const t93blob = [
  t93.insight,
  t93.deeper,
  t93.micro.tone,
  t93.micro.tension,
  t93.micro.gift,
  threeNineThree.expressionPattern.birthDetail,
  threeNineThree.expressionPattern.expressionDetail,
  threeNineThree.expressionPattern.pathDetail,
].join(" ");
assert(
  threeNineThree.expressionPattern.kind === "bd-lp-repeat",
  "3-9-3 is a repeated Birth Day / Life Path with Expression as modifier",
);
assert(
  !t93blob.toLowerCase().includes("vehicle"),
  "expression amateur copy does not call Expression a vehicle",
);
assert(
  !t93blob.toLowerCase().includes("colors the walk"),
  "expression amateur copy does not say colors the walk",
);
const trait3 = "talking, play, and sharing ideas";
assert(
  (t93.insight.split(trait3).length - 1) < 2,
  "3-9-3 insight does not repeat the same Birth Day 3 clause for Life Path",
);
assert(
  t93.insight.toLowerCase().includes("finish") ||
    t93.insight.toLowerCase().includes("wider group"),
  "3-9-3 insight names Expression 9 as finishing / a wider group",
);
assert(
  t93.micro.gift.toLowerCase().includes("try"),
  "3-9-3 gift carries a try",
);
assert(
  t93.micro.tension.toLowerCase().includes("talk") ||
    t93.micro.tension.toLowerCase().includes("finish"),
  "3-9-3 watch is concrete",
);
assert(
  threeNineThree.blueprintLines.some((line) => line.includes("Watch:")),
  "PDF blueprint includes the watch line",
);

const sixThree = buildPythagoreanIdentityLayers({
  birthDay: "6",
  lifePath: "6",
  expression: "3",
  soulUrge: "6",
  personality: "3",
  maturity: "9",
});
const sevenEight = buildPythagoreanIdentityLayers({
  birthDay: "7",
  lifePath: "8",
  expression: "7",
  soulUrge: "7",
  personality: "8",
  maturity: "6",
});
const innerSixThree = sixThree.layers[1]!;
const innerSevenEight = sevenEight.layers[1]!;
assert(
  innerSixThree.micro.tension !== innerSevenEight.micro.tension,
  "6x3 and 7x8 inner-outer watch copy differs",
);
assert(
  !innerSixThree.micro.tension.toLowerCase().includes(
    "people may see one thing while you feel another",
  ),
  "6x3 watch is not the old generic line",
);
assert(
  innerSixThree.micro.tone.toLowerCase().includes("care") ||
    innerSixThree.micro.tone.toLowerCase().includes("promise") ||
    innerSixThree.micro.tone.toLowerCase().includes("chat"),
  "6x3 looks-like names the 6 vs 3 pair",
);
assert(
  sixThree.innerOuterPattern.meet.toLowerCase().includes("care") ||
    sixThree.innerOuterPattern.meet.toLowerCase().includes("chat") ||
    sixThree.innerOuterPattern.meet.toLowerCase().includes("warm"),
  "6x3 Meet blend is pair-specific",
);
assert(
  sixThree.blueprintLines.some((line) => line.includes("Meet:")),
  "PDF blueprint includes the Meet line",
);
assert(
  sixThree.innerOuterPattern.kind === "light-face-heavy-want",
  "6x3 is light face, heavier inner want",
);
assert(
  sevenEight.innerOuterPattern.kind === "strong-face-soft-want",
  "7x8 is strong face, gentler inner want",
);

const magnusInner = magnusLayers.layers[1]!;
assert(
  magnusInner.micro.tension.length > 20,
  "inner-outer watch is a real sentence",
);
assert(
  magnusLayers.layers[2]!.micro.tone.toLowerCase().includes("third") ||
    magnusLayers.layers[2]!.micro.tone.toLowerCase().includes("not life path"),
  "maturity micro names the relation to path and expression",
);
assert(
  threeNineThree.layers[2]!.micro.tone.toLowerCase().includes("life path"),
  "3-9-3 maturity lands back on Life Path and the card says so",
);

for (const su of INNER_OUTER_DIGITS) {
  for (const pe of INNER_OUTER_DIGITS) {
    const pair = buildInnerOuterPattern(String(su), String(pe));
    const blob = [
      pair.looksLike,
      pair.watch,
      pair.tryLine,
      pair.meet,
      pair.overInner,
      pair.balanced,
      pair.overOuter,
      pair.overInnerWatch,
      pair.overOuterWatch,
    ];
    assert(
      blob.every((s) => typeof s === "string" && s.trim().length > 0),
      `inner-outer ${su}x${pe} has no empty copy fields`,
    );
    const inner = microForTensionStop(pair, 0);
    const mid = microForTensionStop(pair, 1);
    const outer = microForTensionStop(pair, 2);
    assert(mid.gift === pair.tryLine, `inner-outer ${su}x${pe} centre gift is tryLine`);
    assert(
      inner.gift === pair.overInner && outer.gift === pair.overOuter,
      `inner-outer ${su}x${pe} slider extremes swap the help card`,
    );
  }
}
assert(
  chart.planeNote.toLowerCase().includes("lo shu"),
  "planes distinguished from Lo Shu",
);
assert(!chart.methodNote.toLowerCase().includes("decoz"), "no third-party brand");

const report = generateReport(
  {
    fullName: "Darshan Kulkarni",
    dateOfBirth: "10/10/1980",
    purpose: "Self-reflection",
  },
  asOf,
);
assert(report.numerology_snapshot.balance_number === "6", "snapshot balance");
assert(
  (report.numerology_snapshot.hidden_passion ?? "").includes("1"),
  "snapshot hidden passion",
);
const resolved = resolvePythagoreanChart(report, asOf);
eq(resolved.balance.number, 6, "resolve matches engine");

const enhanced = buildEnhancedReading(report, { now: asOf });
assert(enhanced.pythagoreanChart.challenges.length === 4, "enhanced has challenges");
assert(
  enhanced.coreStrip.some((c) => c.label === "Balance"),
  "enhanced core strip includes Balance",
);
assert(
  enhanced.coreStrip.some((c) => c.label === "Personal Day"),
  "enhanced core strip includes Personal Day",
);
assert(
  enhanced.coreStrip.some((c) => c.label === "Attitude"),
  "enhanced core strip includes Attitude",
);
assert(
  enhanced.coreStrip.some((c) => c.label === "Minor Expression"),
  "enhanced core strip includes Minor Expression",
);

const emptyish = buildPythagoreanChart({
  natalName: "李",
  dateOfBirth: "10/10/1980",
  coreNumbers: [1],
  asOf,
});
assert(emptyish.balance.number === 0, "non-Latin name has no balance digit");
assert(emptyish.karmicLessons.numbers.length === 9, "all letter-values missing");

console.log("smoke:pythagorean-chart passed");
