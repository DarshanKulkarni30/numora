/**
 * Smoke: Soul → Birth → Name tagged chart, Fortuna, bridge, pair bars.
 */
import {
  buildSoulBirthNameAlignment,
  taggedChartFromParts,
  taggedChartFromPerson,
  taggedChartFromSnapshot,
} from "../src/lib/numerology/alignment";
import { generateReport } from "../src/lib/numerology/report";

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
    console.error("FAIL", label);
    process.exit(1);
  }
  console.log("ok", label);
}

const fixture = taggedChartFromParts({
  soul: 1,
  birth: 3,
  destiny: 3,
  name: 7,
  personality: 5,
  nameCompound: 16,
});

eq(fixture.soul.system, "Pythagorean", "soul system Pythagorean");
eq(fixture.soul.source, "vowels", "soul source vowels");
eq(fixture.soul.role, "soul", "soul role");
eq(fixture.soul.root, 1, "soul root 1");
eq(fixture.birth.system, "Vedic", "birth system Vedic");
eq(fixture.birth.source, "day-of-month", "birth source day");
eq(fixture.name.system, "Chaldean", "name system Chaldean");
eq(fixture.name.source, "all-letters", "name source letters");
eq(fixture.name.compound, 16, "name compound kept");
eq(fixture.fortuna.number, 0, "Fortuna DN − BN = 0");
eq(fixture.fortuna.role, "fortuna", "fortuna role");

const reading = buildSoulBirthNameAlignment(fixture);
eq(reading.flowLabel, "1 → 3 → 7", "flow label");
eq(reading.bridge.number, 3, "Birth is the bridge");
ok(reading.headline.includes("1 → 3 → 7"), "headline includes flow");
eq(reading.pairs.length, 3, "three pairs");
eq(reading.pairs[0].id, "soul-birth", "first pair soul-birth");
ok(reading.pairs[0].percent >= 80, "1→3 high internal");
ok(
  reading.pairs.every((p) => p.percent >= 40 && p.percent <= 95),
  "derived percents in band range",
);
ok(reading.overallLabel.includes("internal"), "overall names internal/external");
ok(!reading.overallLabel.toLowerCase().includes("73% compatible"), "no single fake overall %");
eq(reading.domains.length, 6, "six domains");
ok(
  reading.domains.every((d) => d.why.includes("from") || d.why.includes("From") || d.why.includes("Blend")),
  "each domain states what generated the score",
);
ok(reading.strategy.length > 20, "strategy line");
ok(reading.doMore.length >= 3, "do more list");
ok(reading.watchFor.length >= 3, "watch list");
ok(
  reading.soul.system !== reading.name.system,
  "soul and name systems stay distinct",
);

const live = taggedChartFromPerson("Darshan Kulkarni", "10/10/1980");
eq(live.soul.system, "Chaldean", "live soul Chaldean");
eq(live.soul.compound, 10, "live Chaldean soul compound 10");
eq(live.soul.root, 1, "live Chaldean soul root 1");
eq(live.name.system, "Chaldean", "live name Chaldean");
eq(live.birth.system, "Vedic", "live birth Vedic");
ok(live.soul.role === "soul" && live.name.role === "name", "roles not swapped");

const report = generateReport({
  fullName: "Darshan Kulkarni",
  preferredName: "Darshan",
  dateOfBirth: "10/10/1980",
  purpose: "Self-reflection",
});
const fromSnap = taggedChartFromSnapshot(report.numerology_snapshot);
eq(fromSnap.soul.system, "Chaldean", "snapshot soul is Chaldean");
eq(fromSnap.soul.number, Number(report.numerology_snapshot.soul_urge_number), "snapshot soul");
eq(
  fromSnap.name.number,
  Number(report.numerology_snapshot.chaldean_name_number),
  "snapshot Chaldean name",
);
eq(
  fromSnap.fortuna.number,
  fromSnap.destiny.root - fromSnap.birth.root,
  "snapshot Fortuna is DN − BN",
);

const young = buildSoulBirthNameAlignment(fixture, { young: true });
ok(
  !/\b(romantic|romance|marriage|spouse|lover)\b/i.test(
    young.domains.map((d) => d.insight).join(" "),
  ),
  "young copy avoids romance",
);

console.log("smoke:alignment passed");
