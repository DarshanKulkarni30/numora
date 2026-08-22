/**
 * BN→DN path + two name-map copy.
 */
import {
  bnDnTransition,
  nameOnBnDnPath,
  twoNameMapsCopy,
} from "../src/lib/numerology/bnDnPath";
import {
  chaldeanInsight,
  pythagoreanInsight,
} from "../src/lib/numerology/westernPath";

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected ${e}\n  actual   ${a}`);
    process.exit(1);
  }
  console.log("ok", label);
}

const t73 = bnDnTransition(7, 3);
eq(t73.bn, 7, "7→3 bn");
eq(t73.dn, 3, "7→3 dn");
if (!t73.feel.toLowerCase().includes("inner")) {
  console.error("FAIL 7→3 feel should mention inner study", t73.feel);
  process.exit(1);
}
if (t73.helps.length < 2 || t73.watch.length < 2 || t73.looksLike.length < 40) {
  console.error("FAIL 7→3 should carry situations + helps/watch", t73);
  process.exit(1);
}
console.log("ok 7→3 feel", t73.feel);

const t36 = bnDnTransition(3, 6);
if (!t36.feel.toLowerCase().includes("container")) {
  console.error("FAIL 3→6 should explain the container, not a slogan", t36.feel);
  process.exit(1);
}
if (!t36.watch.some((w) => w.toLowerCase().includes("resent"))) {
  console.error("FAIL 3→6 watch should name a real friction", t36.watch);
  process.exit(1);
}
console.log("ok 3→6", t36.feel);

const same = bnDnTransition(1, 1);
if (!same.feel.toLowerCase().includes("identity")) {
  console.error("FAIL 1→1", same);
  process.exit(1);
}
console.log("ok 1→1");

const nn = nameOnBnDnPath(7, 3, 6);
if (nn.nnEqualsBn || nn.nnEqualsDn) {
  console.error("FAIL 7-3-6 should be third colour", nn);
  process.exit(1);
}
console.log("ok name third color", nn.headline);

const maps = twoNameMapsCopy("6", "2", "42", "47");
eq(maps?.agree, false, "maps disagree");
if (!maps?.detail.includes("not two destinies") && !maps?.headline.includes("two letter")) {
  console.error("FAIL maps copy", maps);
  process.exit(1);
}
console.log("ok two maps", maps?.headline);

const py = pythagoreanInsight({
  birthDay: "7",
  lifePath: "3",
  expression: "5",
  soulUrge: "7",
  personality: "7",
  maturity: "8",
});
if (!py.path.heading.includes("7") || !py.path.heading.includes("3")) {
  console.error("FAIL py path heading", py.path);
  process.exit(1);
}
console.log("ok pythagorean path", py.path.heading);

const ch = chaldeanInsight({
  compound: "42",
  reduced: "6",
  pythExpression: "5",
});
if (!ch.path.heading.includes("42") || !ch.extras[0]?.body.toLowerCase().includes("pythagorean")) {
  console.error("FAIL chaldean insight", ch);
  process.exit(1);
}
console.log("ok chaldean compound", ch.path.heading);

const mag = chaldeanInsight({
  compound: "44",
  reduced: "8",
  pythExpression: "3",
  birthDay: "3",
  lifePath: "6",
});
if (!mag.path.feel.includes("44") || !mag.path.watch?.length) {
  console.error("FAIL 44→8 should be specific", mag.path);
  process.exit(1);
}
const onChart = mag.extras.find((e) => e.title === "On this chart");
if (!onChart || !onChart.body.includes("3") || !onChart.body.includes("6")) {
  console.error("FAIL 44→8 should sit on the 3→6 date path", mag.extras);
  process.exit(1);
}
console.log("ok chaldean 44→8 on 3→6");

console.log("vedic path smoke ok");
