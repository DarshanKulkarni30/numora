/**
 * Smoke checks for Ank Kundli digits (century ignored) and yoga/void lookup.
 */
import {
  VEDIC_GRID_ORDER,
  calculateVedicGrid,
  cellCenter,
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

eq(
  VEDIC_GRID_ORDER,
  [
    [3, 1, 9],
    [6, 7, 5],
    [2, 8, 4],
  ],
  "visual cell order 3-1-9 / 6-7-5 / 2-8-4",
);
eq(cellCenter(3).x < 20 && cellCenter(3).y < 20, true, "3 is top-left");
eq(cellCenter(9).x > 80 && cellCenter(9).y < 20, true, "9 is top-right");
eq(cellCenter(4).x > 80 && cellCenter(4).y > 80, true, "4 is bottom-right");
eq(cellCenter(2).x < 20 && cellCenter(2).y > 80, true, "2 is bottom-left");
eq(cellCenter(7).x > 40 && cellCenter(7).x < 60, true, "7 is center");

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
