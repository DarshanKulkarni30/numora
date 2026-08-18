/**
 * Smoke checks for Ank Kundli digits (century ignored) and yoga/void lookup.
 */
import {
  calculateVedicGrid,
  vedicGridDigitsFromDob,
} from "../src/lib/numerology/vedicGrid";

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected ${e}\n  actual   ${a}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function hasId(ids: string[], id: string, label: string) {
  if (!ids.includes(id)) {
    console.error(`FAIL ${label}: missing ${id} in ${ids.join(", ") || "(none)"}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function lacksId(ids: string[], id: string, label: string) {
  if (ids.includes(id)) {
    console.error(`FAIL ${label}: unexpected ${id}`);
    process.exit(1);
  }
  console.log("ok", label);
}

eq(vedicGridDigitsFromDob("21/05/2012"), [1, 2, 5], "21/05/2012 unique digits");

eq(
  vedicGridDigitsFromDob("03/07/2010"),
  [1, 3, 7],
  "03/07/2010 century 20 does not inject 2",
);

const twoThousandTwelve = calculateVedicGrid("21/05/2012");
eq(twoThousandTwelve.present, [1, 2, 5], "2012 present set");
hasId(
  twoThousandTwelve.presentPatterns.map((p) => p.id),
  "yuti-1-2",
  "2012 has Sun+Moon yuti",
);
hasId(
  twoThousandTwelve.presentPatterns.map((p) => p.id),
  "drishti-1-5",
  "2012 has 1→5 drishti",
);
hasId(
  twoThousandTwelve.voids.map((p) => p.id),
  "void-center",
  "2012 empty center void",
);
lacksId(
  twoThousandTwelve.voids.map((p) => p.id),
  "void-action-row",
  "2012 has 5 so action row is not empty",
);

const intellectual = calculateVedicGrid("23/06/1998");
eq(intellectual.present, [2, 3, 6, 8, 9], "23/06/1998 present set");
hasId(
  intellectual.presentPatterns.map((p) => p.id),
  "yoga-intellectual",
  "1998 completes Intellectual 3-6-2",
);
hasId(
  intellectual.voids.map((p) => p.id),
  "void-center",
  "1998 empty center (no 7)",
);
if (!intellectual.mixedReading) {
  console.error("FAIL 1998 should mix Amazing (Intellectual) with Defeat (9→8)");
  process.exit(1);
}
console.log("ok 1998 mixed Amazing + Defeat reading");

const emptyAction = calculateVedicGrid("11/03/2011");
eq(emptyAction.present, [1, 3], "11/03/2011 present set");
hasId(
  emptyAction.voids.map((p) => p.id),
  "void-action-row",
  "2011 empty action row",
);
lacksId(
  emptyAction.voids.map((p) => p.id),
  "void-soul-column",
  "2011 has 1 and 3 so soul column is not empty",
);

console.log("vedic grid smoke ok");
