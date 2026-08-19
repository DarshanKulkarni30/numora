/**
 * BN→DN path + two name-map copy.
 */
import {
  bnDnTransition,
  nameOnBnDnPath,
  twoNameMapsCopy,
} from "../src/lib/numerology/bnDnPath";

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
console.log("ok 7→3 feel", t73.feel);

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

console.log("vedic path smoke ok");
