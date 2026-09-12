import { generateReport } from "../src/lib/numerology/report";
import { buildEnhancedReading } from "../src/lib/numerology/enhanced";
import { buildBlueprintReading } from "../src/lib/numerology/blueprint";
import { buildInteractionMap } from "../src/lib/numerology/blueprint/interactions";
import { buildInspectorCardCopy } from "../src/lib/numerology/blueprint/inspectorCopy";
import { buildVedicSquareReading } from "../src/lib/numerology/blueprint/vedicSquareReading";
import { dualNameChart } from "../src/lib/numerology/nameLayers";
import { planetPairForDigit } from "../src/lib/numerology/planets";
import { buildVedicSquareArchitecture } from "../src/lib/numerology/vedicSquareArchitecture";

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
  enhanced.themes.every((t) =>
    t.count >= 3 ? t.tier === "strong" : t.count === 2 ? t.tier === "supporting" : t.tier === "secondary",
  ),
  "theme tiers match seat counts",
);
assert(
  enhanced.narrative.wordCount >= 80 && enhanced.narrative.wordCount <= 1100,
  `narrative length ${enhanced.narrative.wordCount}`,
);
assert(
  !enhanced.narrative.full.includes("Strength language already stored"),
  "no padding paragraph",
);
assert(
  !enhanced.narrative.full.includes("Recommended focus already computed"),
  "no second pad paragraph",
);
assert(
  !enhanced.narrative.full.toLowerCase().includes("chart seats"),
  "story uses theme tiers, not raw seat counts",
);
assert(
  !enhanced.narrative.full.includes(enhanced.hero.throughline),
  "story body does not repeat the hero throughline",
);
assert(
  !enhanced.narrative.teaser.includes(enhanced.hero.throughline),
  "teaser does not repeat the hero throughline",
);
const storyParas = enhanced.narrative.full.split(/\n\n/).filter((p) => p.trim());
const actionCue =
  /\b(try|cap |finish |keep |write |start |close |take |define |pick |use |name |read |treat |offer |notice |wait |ask |help |protect |run )\b/i;
for (const p of storyParas) {
  if (p.startsWith("Read the numbers as a pattern")) continue;
  assert(actionCue.test(p), `story paragraph has an action: ${p.slice(0, 80)}`);
}
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
assert(enhanced.alignment.flowLabel.includes("→"), "alignment flow");
assert(enhanced.alignment.pairs.length === 3, "three alignment pairs");
assert(enhanced.alignment.bridge.number > 0, "bridge number");
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

const blueprint = buildBlueprintReading(adult, {
  reportId: "test-id",
  now: new Date("2026-08-21"),
});
assert(blueprint.interpretation.interpretationVersion === "1.0", "blueprint version");
assert(blueprint.identity.sameSpelling === false, "later spelling is a second identity layer");
assert(blueprint.identity.givenUnchanged, "surname-only change keeps one Name Cycle");
assert(
  blueprint.identity.showNatalCycle === false && blueprint.natalCycle == null,
  "natal cycle hidden when given name is unchanged",
);
assert(blueprint.identity.active.nnDisplay.length >= 1, "active NN is declared");
assert(
  blueprint.identity.question.toLowerCase().includes("bn"),
  "identity question names BN → DN support",
);
const givenChanged = generateReport({
  fullName: "Darshan Kulkarni",
  dateOfBirth: "30/08/1981",
  purpose: "Self-reflection",
  nameHistory: [
    {
      id: "e1",
      full_name: "Anita Sharma",
      started_on: "22/10/2005",
      ended_on: "",
      reason: "marriage",
    },
  ],
});
const givenChangedBp = buildBlueprintReading(givenChanged, {
  now: new Date("2026-08-21"),
});
assert(givenChangedBp.identity.showNatalCycle, "given-name change shows natal cycle as advanced");
assert(
  givenChangedBp.cycle?.firstName.toUpperCase().startsWith("A"),
  "active cycle uses everyday given name",
);
assert(
  givenChangedBp.natalCycle?.firstName.toUpperCase().startsWith("D"),
  "natal cycle uses birth given name",
);
assert(blueprint.career.moves.length === 3, "career compass has three moves");
assert(blueprint.career.domains.length >= 1, "career domains present");
assert(
  !blueprint.career.meaning.toLowerCase().includes("youtuber"),
  "career compass is not a job list",
);
const lifeWhys = blueprint.life.themes.map((t) => t.why);
const lifeDos = blueprint.life.themes.map((t) => t.doThis);
assert(
  new Set(lifeWhys).size === lifeWhys.length,
  "life compass why lines are unique",
);
assert(
  new Set(lifeDos).size === lifeDos.length,
  "life compass do-this lines are unique",
);
assert(
  !lifeWhys.some((w) => /keep this area from collapsing/i.test(w)),
  "life compass has no filler maintain line",
);
assert(blueprint.nextMoves.prompt.length > 10, "next moves prompt");

const soulCard = buildInspectorCardCopy({
  label: "Soul",
  digit: blueprint.soul,
  dob: adult.person.date_of_birth,
  operatingName: adult.person.operating_name || adult.person.full_name,
  cycle: blueprint.cycle,
  pinnacle: blueprint.pinnacle,
});
assert(soulCard.meaning.toLowerCase().includes("vowel"), "soul card describes the term");
assert(soulCard.calc.length >= 2, "soul card shows calculation");
const pinCard = buildInspectorCardCopy({
  label: "Pinnacle",
  digit: blueprint.pinnacle.number,
  dob: adult.person.date_of_birth,
  operatingName: adult.person.full_name,
  pinnacle: blueprint.pinnacle,
});
assert(pinCard.meaning.toLowerCase().includes("chapter"), "pinnacle card describes the term");
assert(pinCard.calc.some((line) => /pinnacle 1/i.test(line)), "pinnacle card shows the four chapters");
const ketu = planetPairForDigit(7);
assert(ketu.vedic.name === "Ketu" && ketu.western.name === "Neptune", "7 is Ketu / Neptune");
const rahu = planetPairForDigit(4);
assert(rahu.vedic.name === "Rahu" && rahu.western.name === "Uranus", "4 is Rahu / Uranus");
const lifePattern = blueprint.interactions;
assert(lifePattern.nodes.length === 4, "life pattern has four nodes");
assert(lifePattern.energyFlow.includes("→"), "life pattern has a verb path");
assert(
  lifePattern.items.every((row) => row.headline.length > 12 && row.easeLabel.length > 3),
  "each pair has a headline and a plain ease label",
);
assert(
  !lifePattern.items.some((row) => /sits with|expression and depth/i.test(row.meaning)),
  "pair copy is not the generic sits-with template",
);
assert(
  lifePattern.items.some((row) => row.id === "soul-bn" && /inner want/i.test(row.meaning)),
  "soul row explains inner want, not Expression as a type",
);
const sevenTwoSix = buildInteractionMap({ bn: 7, dn: 2, nameRoot: 6, soul: 6 });
assert(sevenTwoSix.energyFlow === "Deepen → Connect → Care", "7-2-6 verb path");
assert(
  sevenTwoSix.items[0]?.easeLabel === "Works together" ||
    sevenTwoSix.items[0]?.easeLabel === "Smooth",
  "7→2 ease is a plain label, not a jammed table cell",
);
assert(blueprint.coreJourney.layers.length === 5, "number journey has five layers");
assert(blueprint.coreJourney.edges.length >= 4, "journey has harmony edges");
assert(
  blueprint.resonance.personalYear >= 1 && blueprint.resonance.personalYear <= 9,
  "resonance year is 1–9",
);
assert(
  !JSON.stringify(blueprint.resonance).includes("%"),
  "year resonance has no percent grade",
);
assert(
  blueprint.resonance.whyDifferent.toLowerCase().includes("never rewrite"),
  "resonance copy keeps personal year unrewritten",
);
assert(
  blueprint.journey.every((row) => row.reading.tableDo.length > 12),
  "year journey has a practise line",
);
assert(
  !/NURTURE|REFLECT ×|ACHIEVE/.test(blueprint.transition.changes),
  "transition uses plain year titles, not verb jargon",
);
assert(
  !/previous year’s default/i.test(blueprint.transition.stopCarrying),
  "leave-behind is a specific weekly job, not a generic default",
);
assert(blueprint.coreJourney.rememberAction.includes("One priority"), "journey has a one-thing box");
assert(
  blueprint.coreJourney.bridge === blueprint.dn - blueprint.bn,
  "bridge is destiny minus birth",
);
const square = buildVedicSquareReading({
  source: "psychic",
  digit: blueprint.bn,
  psychic: blueprint.bn,
  destiny: blueprint.dn,
  name: blueprint.nameRoot,
  metrics: buildVedicSquareArchitecture(blueprint.bn).metrics,
});
assert(square.seatMeaning.toLowerCase().includes("initiate"), "psychic seat explains initiation");
assert(
  square.diagnostics.some((d) => /same for anyone highlighting/i.test(d.inGrid)),
  "diagnostics admit table geometry is not a personal grade",
);
assert(
  !square.missing.some((m) => /lack of/i.test(m.pattern)),
  "missing digits are not judgmental",
);
assert(
  !blueprint.interpretation.feel.toLowerCase().includes("will happen"),
  "year copy is not deterministic",
);

console.log("smoke:enhanced-report passed");
