/**
 * Smoke: Chaldean Soul vs Pythagorean, year number, gated Kua, Comprehensive reading.
 */
import { calculateChaldeanProfile } from "../src/lib/numerology/chaldeanProfile";
import { calculateKua, yearNumberFromDob } from "../src/lib/numerology/hiddenYear";
import { calculatePythagorean } from "../src/lib/numerology/pythagorean";
import { buildComprehensiveReading } from "../src/lib/numerology/comprehensive";
import { lastFourVsTotalRoot } from "../src/lib/numerology/mobileChartExtras";
import { evaluateMobileFit } from "../src/lib/numerology/mobileFit";
import { generateReport } from "../src/lib/numerology/report";
import { applyLivingTiming } from "../src/lib/numerology/livingTiming";

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

const NAME = "Darshan Kulkarni";
const pyth = calculatePythagorean(NAME, "10/10/1980");
const chal = calculateChaldeanProfile(NAME, "10/10/1980", "Male");

eq(chal.soul.label, "10/1", "Chaldean soul vowels 10/1");
eq(pyth.soulUrge, 6, "Pythagorean soul 6 on the same name");
ok(chal.soul.root !== pyth.soulUrge, "Chaldean soul is not the Pythagorean soul");
eq(chal.name.label, "43/7", "Chaldean full name 43/7");
eq(chal.method, "CHALDEAN-NUMORA-1.0", "method version");
eq(chal.firstLetter?.letter, "D", "first letter D");
eq(chal.firstLetter?.value, 4, "D is Chaldean 4");

const y1984 = yearNumberFromDob("15/06/1984");
eq(y1984.lastTwo, 84, "last two 84");
eq(y1984.compound, 12, "8+4=12");
eq(y1984.root, 3, "year number 3");

const y1900 = yearNumberFromDob("01/01/1900");
eq(y1900.lastTwo, 0, "year 00 last two");
eq(y1900.root, 9, "year 00 reads as 9");

const kuaMale = calculateKua("15/06/1984", "Male");
ok(kuaMale.ok && kuaMale.number === 7, "male 1984 Kua 10-3=7");

const kuaFemale = calculateKua("15/06/1984", "Female");
ok(kuaFemale.ok && kuaFemale.number === 8, "female 1984 Kua 5+3=8");

const kua2001 = calculateKua("15/06/2001", "Male");
ok(!kua2001.ok && kua2001.reason === "year_2000_or_later", "skip Kua from 2000");

const kuaOther = calculateKua("15/06/1984", "Prefer not to say");
ok(!kuaOther.ok && kuaOther.reason === "need_gender", "skip Kua without Male/Female");

const report = generateReport({
  fullName: NAME,
  preferredName: "Darshan",
  dateOfBirth: "10/10/1980",
  gender: "Male",
  purpose: "Self-reflection",
});
const reading = buildComprehensiveReading(report);
ok(reading.flowLabel.includes("→"), "four-node flow");
ok(reading.pairs.length >= 5, "relationship pairs");
ok(
  !/vibration|NPLAN|saboteur|will make you|harmonizer/i.test(JSON.stringify(reading)),
  "banned phrases absent",
);
ok(reading.methodNote.toLowerCase().includes("chaldean"), "method note names Chaldean");
ok(reading.profile.soul.label === "10/1", "reading uses Chaldean soul");

const engineReport = generateReport({
  fullName: NAME,
  dateOfBirth: "10/10/1980",
  gender: "Male",
  purpose: "Self-reflection",
});
eq(engineReport.numerology_snapshot.soul_urge_number, "1", "saved report soul is Chaldean root");
eq(
  engineReport.numerology_snapshot.expression_number,
  String(chal.name.root),
  "Expression is the Chaldean name root",
);
eq(
  engineReport.numerology_snapshot.life_path,
  String(pyth.lifePath),
  "Life Path stays the date method",
);
eq(
  engineReport.numerology_snapshot.birth_day,
  String(pyth.birthDay),
  "Birth Day stays the date method",
);
const overwritten = {
  ...engineReport,
  numerology_snapshot: {
    ...engineReport.numerology_snapshot,
    soul_urge_number: "6",
    personality_number: "9",
  },
};
const live = applyLivingTiming(overwritten);
eq(live.numerology_snapshot.soul_urge_number, "1", "open-time layer rewrites Pythagorean soul");
eq(
  live.numerology_snapshot.life_path,
  overwritten.numerology_snapshot.life_path,
  "date Life Path unchanged by name layer",
);
ok(live.name_engine?.method === "CHALDEAN-NUMORA-1.0", "name engine attached");
ok(live.name_engine?.soul.compound === 10, "trace keeps compound 10");

const easy = evaluateMobileFit("01/01/1990", "1915173513", "personal");
ok(easy.ok && easy.fit.lastFour, "mobile fixture parses");
if (easy.ok && easy.fit.lastFour) {
  const scoreBefore = easy.fit.score;
  const extra = lastFourVsTotalRoot(easy.fit.lastFour.root, easy.fit.core);
  const again = evaluateMobileFit("01/01/1990", "1915173513", "personal");
  ok(again.ok && again.fit.score === scoreBefore, "last-four vs total root does not change score");
  ok(extra.lastFourRoot >= 1 && extra.totalRoot === easy.fit.core, "structural compare uses same total root");
}

console.log("smoke:chaldean-comprehensive passed");
console.log("pythagorean soul", pyth.soulUrge, "chaldean soul", chal.soul.label);
console.log("chaldean name", chal.name.label);
