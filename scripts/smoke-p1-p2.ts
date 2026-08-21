/**
 * Smoke checks for P1 + selected P2 engines.
 */
import { buildCoupleReport } from "../src/lib/numerology/coupleReport";
import { buildYearForecast } from "../src/lib/numerology/yearForecast";
import {
  rankNameSpellings,
  spellingVariants,
} from "../src/lib/numerology/nameAdvisor";
import { analyzePlace } from "../src/lib/numerology/placeNumber";
import { buildDailyLoop } from "../src/lib/numerology/dailyLoop";
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

function assert(cond: unknown, label: string) {
  if (!cond) {
    console.error("FAIL", label);
    process.exit(1);
  }
  console.log("ok", label);
}

const asOf = new Date(2026, 7, 21);

const forecast = buildYearForecast("10/10/1980", asOf);
eq(forecast.months.length, 12, "twelve months");
assert(forecast.months[0].isCurrent, "first month is current");
assert(forecast.personalYear >= 1, "year present");
assert(!forecast.disclaimer.toLowerCase().includes("decoz"), "forecast copy original");

const couple = buildCoupleReport(
  { label: "A", fullName: "Darshan Kulkarni", dateOfBirth: "10/10/1980" },
  { label: "B", fullName: "Maya Sharma", dateOfBirth: "15/03/1985" },
  asOf,
);
assert(couple.score >= 0 && couple.score <= 100, "score 0–100");
eq(couple.axes.length, 5, "five seats");
eq(couple.months.length, 12, "couple year overlay");
assert(couple.axes.every((x) => x.weight > 0), "weights");
assert(!couple.summary.toLowerCase().includes("decoz"), "couple copy original");

const variants = spellingVariants("Darshan");
assert(variants.includes("Darshan"), "keeps current given");
assert(variants.length >= 2, "mutates spelling");

const advisor = rankNameSpellings({
  fullName: "Darshan Kulkarni",
  dateOfBirth: "10/10/1980",
  gender: "Male",
});
assert(advisor.ranked.length >= 1, "ranked rows");
assert(advisor.ranked.some((r) => r.source === "current"), "current spelling ranked");
assert(!advisor.disclaimer.toLowerCase().includes("decoz"), "advisor copy original");

const phone = analyzePlace("9876543210", "phone");
assert(phone && phone.digitReduced >= 1, "phone reduces");
const address = analyzePlace("14 Oak Lane", "address");
assert(address && address.combined >= 1, "address combines");
assert(address && address.letterReduced != null, "address has letters");

const daily = buildDailyLoop({
  natalName: "Darshan Kulkarni",
  dateOfBirth: "10/10/1980",
  asOf,
});
eq(daily.week.length, 7, "seven-day strip");
assert(daily.today.isToday, "today flagged");
assert(daily.today.personalDay >= 1, "personal day");
assert(daily.checkInPrompt.startsWith("Today is"), "today prompt");
assert(
  daily.week[1] && !daily.week[1].isToday,
  "later cells are not today",
);

const report = generateReport(
  {
    fullName: "Darshan Kulkarni",
    dateOfBirth: "10/10/1980",
    purpose: "Self-reflection",
  },
  asOf,
);
assert(report.numerology_snapshot.minor_expression_number, "minor expression snapshot");
assert(report.numerology_snapshot.attitude_number === "2", "snapshot attitude");
assert(report.numerology_snapshot.subconscious_self === "7", "snapshot ss");

console.log("smoke:p1-p2 passed");
