import { generateReport } from "../src/lib/numerology/report";
import { buildEnhancedReading } from "../src/lib/numerology/enhanced";
import { dualNameChart } from "../src/lib/numerology/nameLayers";

function eq(actual: unknown, expected: unknown, label: string) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    console.error("FAIL", label, { actual, expected });
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

const adult = generateReport({
  fullName: "Darshan Kulkarni",
  preferredName: "Darshan",
  dateOfBirth: "10/10/1980",
  gender: "Male",
  purpose: "Self-reflection",
  nameHistory: [
    {
      id: "e1",
      full_name: "Darshan YYYY",
      started_on: "22/10/2005",
      ended_on: "",
      reason: "marriage",
    },
  ],
});

const names = dualNameChart({
  natalName: "Darshan Kulkarni",
  dateOfBirth: "10/10/1980",
  history: [
    {
      id: "e1",
      full_name: "Darshan YYYY",
      started_on: "22/10/2005",
      ended_on: "",
      reason: "marriage",
    },
  ],
  preferredName: "Darshan",
  asOf: new Date("2026-08-21"),
});
assert(names.differs, "name history differs for adult fixture");

const enhanced = buildEnhancedReading(adult, {
  reportId: "test-id",
  now: new Date("2026-08-21"),
});

eq(enhanced.detailedHref, "/report/test-id", "links back to detailed");
assert(enhanced.hero.displayName.includes("Darshan"), "hero uses preferred name");
assert(enhanced.coreStrip.length >= 10, "core strip shows the numbers");
assert(
  enhanced.coreStrip.every((c) => c.value && c.value !== ""),
  "core strip values present",
);
assert(enhanced.themes.length >= 1, "at least one theme");
assert(
  enhanced.themes.every((t) => t.count === t.appearsIn.length),
  "theme count equals unique seats",
);
assert(
  enhanced.narrative.wordCount >= 500 && enhanced.narrative.wordCount <= 1100,
  `narrative length ${enhanced.narrative.wordCount}`,
);
assert(
  !enhanced.narrative.full.toLowerCase().includes("working poem"),
  "enhanced story is not high-english poetry",
);
assert(
  !enhanced.narrative.full.toLowerCase().includes("rhyme"),
  "enhanced story does not say rhyme",
);
assert(enhanced.season.asOf.includes("2026"), "season as-of date");
assert(enhanced.season.doThis.length >= 1, "season practise list");
assert(enhanced.flow.primary.length === 4, "primary flow has four nodes");
assert(enhanced.actionPlan.days30.items.length >= 1, "30-day plan");
assert(enhanced.actionPlan.days90.items.length >= 1, "90-day plan");
assert(enhanced.lifestyle.learning.length > 20, "lifestyle learning");
assert(enhanced.trivia.colorsPrimary.length >= 1, "trivia colors");
assert(enhanced.chaldean.reduced > 0, "chaldean reduced");
assert(enhanced.student.lifePathSteps.length >= 4, "life path walkthrough");
assert(enhanced.schoolCompare.length >= 4, "school compare rows");
assert(enhanced.radar.length === 6, "radar six families");
assert(enhanced.planets.length >= 1, "planet presence counts");
assert(!enhanced.disclaimer.toLowerCase().includes("guaranteed success"), "disclaimer safe");

const child = generateReport({
  fullName: "Asha Kulkarni",
  preferredName: "Asha",
  dateOfBirth: "10/10/2016",
  gender: "Female",
  purpose: "Family guidance",
});
eq(child.person.report_type, "child", "child report type");
const childReading = buildEnhancedReading(child, { now: new Date("2026-08-21") });
const childBlob = [
  childReading.narrative.full,
  childReading.lifestyle.leadership,
  childReading.actionPlan.days30.items.join(" "),
  childReading.actionPlan.year.primary,
  childReading.trivia.motto,
].join("\n");
const banned =
  /\b(romantic|romance|marriage|spouse|lover|boyfriend|girlfriend|salary)\b/i;
assert(!banned.test(childBlob), "child copy avoids adult romance/pay language");
assert(
  childReading.actionPlan.purposeNote.toLowerCase().includes("family"),
  "child plan uses purpose lens",
);

const fullSparse = generateReport({
  fullName: "Darshan Kulkarni",
  preferredName: "Darshan",
  dateOfBirth: "10/10/1980",
  purpose: "Self-reflection",
});
const { monthly_guidance: _monthly, chaldean: _chaldean, ...sparseRest } =
  fullSparse;
const sparseReading = buildEnhancedReading(
  sparseRest as typeof fullSparse,
  { now: new Date("2026-08-21") },
);
assert(sparseReading.season.asOf.includes("2026"), "sparse report still builds a season");
assert(sparseReading.chaldean.reduced > 0, "sparse chaldean falls back to snapshot");

console.log("smoke:enhanced-report passed");
