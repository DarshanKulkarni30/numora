/**
 * Smoke: karmic debt detection, chart derivations, and the name-change diff.
 *
 * Guards the chain-walk fix in particular: debt totals sit on the two-digit
 * intermediates, so a full reduction in one step would miss them entirely.
 */
import { buildChartDerivations } from "../src/lib/numerology/chartDerivations";
import {
  allKarmicDebts,
  groupKarmicDebts,
  karmicDebtsFromDob,
  karmicDebtsFromName,
} from "../src/lib/numerology/karmicDebt";
import { buildNameChangeDiff } from "../src/lib/numerology/nameChangeDiff";
import { resolvePythagoreanChart } from "../src/lib/numerology/pythagoreanChart";
import { generateReport } from "../src/lib/numerology/report";

let failed = false;

function ok(label: string) {
  console.log("ok", label);
}

function fail(label: string, detail: string) {
  console.error(`FAIL ${label}\n  ${detail}`);
  failed = true;
}

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) fail(label, `expected ${e}, actual ${a}`);
  else ok(label);
}

function has(text: string, needle: string, label: string) {
  if (!text.toLowerCase().includes(needle.toLowerCase())) {
    fail(label, `missing "${needle}" in:\n${text}`);
  } else ok(label);
}

// —— Karmic debt: date positions ——

// Born on the 13th: birth-day debt is visible from the date alone.
const d13 = karmicDebtsFromDob("13/08/1981");
eq(
  d13.filter((d) => d.source === "birth-day").map((d) => d.label),
  ["13/4"],
  "birth-day debt detected for the 13th",
);

// 04/04/1976 reduces 4 + 4 + 5 = 13, the classic 13/4 on the Life Path.
const lpDebt = karmicDebtsFromDob("04/04/1976");
eq(
  lpDebt.filter((d) => d.source === "life-path").map((d) => d.label),
  ["13/4"],
  "life-path debt found on the two-digit intermediate",
);
has(
  lpDebt.find((d) => d.source === "life-path")!.positionMeaning,
  "4 + 4 + 5",
  "life-path derivation shows the actual sum",
);

// A chart with no debts must stay empty rather than inventing one.
eq(karmicDebtsFromDob("30/08/1981"), [], "clean date carries no debt");

// —— Karmic debt: name positions ——

// Vowels of this spelling total 34 -> no debt; Expression totals 85 -> 13 -> 4.
const nameDebts = karmicDebtsFromName("Jennifer Anne Smith", "operating");
eq(
  nameDebts.map((d) => `${d.label}@${d.source}`),
  ["13/4@expression"],
  "expression debt detected from the name total",
);
eq(nameDebts[0]!.fixed, false, "name debt is marked as movable");
eq(nameDebts[0]!.spelling, "operating", "name debt records which spelling");
has(
  nameDebts[0]!.positionMeaning,
  "85",
  "expression derivation shows the letter total",
);

// Respelling drops that debt: same final Expression, different route to it.
eq(
  karmicDebtsFromName("Jennifer Anne Whitfield", "operating").map((d) => d.label),
  [],
  "respelling clears the name debt",
);

// —— Grouping ——

// 13/08/1981 carries 13/4 twice (birth day and Life Path); advice appears once.
const grouped = groupKarmicDebts(allKarmicDebts("13/08/1981", "Darshan Kulkarni"));
eq(grouped.length, 1, "two positions of one code group into a single entry");
eq(grouped[0]!.positions.length, 2, "both positions retained under the group");
eq(grouped[0]!.fixed, true, "date-only group stays marked fixed");

// —— Report wiring ——

const debtReport = generateReport({
  fullName: "Darshan Kulkarni",
  dateOfBirth: "13/08/1981",
});
const block = debtReport.karmic_debt;
if (!block) fail("report carries a karmic_debt block", "block is undefined");
else {
  eq(block.items.length, 1, "report exposes the grouped debt");
  has(
    debtReport.sections.find((s) => s.id === "karmic-debt")?.body ?? "",
    "what to work on",
    "karmic debt section spells out the action",
  );
}

const cleanReport = generateReport({
  fullName: "Darshan Kulkarni",
  dateOfBirth: "30/08/1981",
});
has(
  cleanReport.sections.find((s) => s.id === "karmic-debt")?.body ?? "",
  "most charts have none",
  "empty debt state reassures rather than showing a blank",
);

// —— Derivations match the chart they describe ——

const asOf = new Date(2026, 7, 22);
const chart = resolvePythagoreanChart(cleanReport, asOf);
const derivations = buildChartDerivations(cleanReport, chart, asOf);

const ids = derivations.map((d) => d.id);
for (const required of [
  "balance",
  "subconscious-self",
  "plane-physical",
  "plane-mental",
  "plane-emotional",
  "plane-intuitive",
  "period-cycles",
  "personal-month",
  "lo-shu",
]) {
  if (!ids.includes(required)) fail(`derivation present: ${required}`, `got ${ids.join(", ")}`);
}
ok("all six previously bare numbers have a derivation");

const balance = derivations.find((d) => d.id === "balance")!;
has(balance.result, String(chart.balance.number), "balance derivation matches the chart value");

const ss = derivations.find((d) => d.id === "subconscious-self")!;
has(
  ss.result,
  String(chart.subconsciousSelf.number),
  "subconscious self derivation matches the chart value",
);

for (const plane of chart.planes) {
  const deriv = derivations.find((d) => d.id === `plane-${plane.id}`)!;
  if (plane.compound && !deriv.result.includes(`${plane.compound}/${plane.reduced}`)) {
    fail(`plane ${plane.id} derivation matches chart`, deriv.result);
  }
}
ok("every plane derivation matches its chart compound and reduced value");

const pm = derivations.find((d) => d.id === "personal-month")!;
has(
  pm.result,
  cleanReport.personal_month.number,
  "personal month derivation matches the report value",
);

// Every derivation must state its purpose and show at least one step.
for (const d of derivations) {
  if (!d.purpose.trim()) fail(`derivation ${d.id} has a purpose`, "empty");
  if (d.steps.length === 0) fail(`derivation ${d.id} has steps`, "none");
  if (!d.inputs.trim()) fail(`derivation ${d.id} names its inputs`, "empty");
}
ok("every derivation carries purpose, inputs and steps");

// —— Name change diff ——

eq(buildNameChangeDiff(cleanReport), null, "no diff panel without a name change");

const changed = generateReport({
  fullName: "Jennifer Anne Smith",
  dateOfBirth: "16/03/1990",
  nameHistory: [
    {
      id: "married",
      full_name: "Jennifer Anne Whitfield",
      started_on: "2020-06-14",
      ended_on: null,
      reason: "marriage",
    },
  ],
} as never);

const diff = buildNameChangeDiff(changed);
if (!diff) fail("diff built for a changed name", "returned null");
else {
  eq(diff.natalName, "Jennifer Anne Smith", "diff keeps the birth-certificate name");
  eq(diff.operatingName, "Jennifer Anne Whitfield", "diff uses the name in force");
  if (!diff.nameRows.some((r) => r.changed)) {
    fail("diff finds at least one moved number", "nothing marked changed");
  } else ok("diff finds moved name-based numbers");
  if (diff.dateRows.some((r) => r.changed)) {
    fail("date rows never move", "a date row was marked changed");
  } else ok("date-based numbers are held fixed across the change");
  eq(
    diff.debts.fellAway.map((d) => d.label),
    ["13/4"],
    "diff reports the debt that fell away with the old spelling",
  );
}

if (failed) {
  console.error("\nsmoke-practitioner FAILED");
  process.exit(1);
}
console.log("\nsmoke-practitioner passed");
