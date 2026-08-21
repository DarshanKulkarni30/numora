/**
 * Living timing + share token smokes.
 */
import { generateReport } from "../src/lib/numerology/report";
import { applyLivingTiming } from "../src/lib/numerology/livingTiming";
import { personalYearCycleAt } from "../src/lib/numerology/cycles";
import {
  createShareToken,
  verifyShareToken,
} from "../src/lib/report/shareToken";
import { buildEnhancedReading } from "../src/lib/numerology/enhanced";

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

process.env.SHARE_LINK_SECRET = "smoke-share-secret";

const savedAsOf = new Date(2020, 0, 15);
const viewAsOf = new Date(2026, 7, 21);

const report = generateReport(
  {
    fullName: "Darshan Kulkarni",
    dateOfBirth: "10/10/1980",
    purpose: "Self-reflection",
  },
  savedAsOf,
);

const live = applyLivingTiming(report, viewAsOf);
const liveCycle = personalYearCycleAt("10/10/1980", viewAsOf);
eq(live.personal_year.number, String(liveCycle.number), "live PY matches cycle");
assert(
  live.numerology_snapshot.personal_day,
  "live snapshot has personal day",
);

const enhanced = buildEnhancedReading(live, { reportId: "smoke", now: viewAsOf });
assert(
  enhanced.howToRead.some((l) => l.toLowerCase().includes("live html")),
  "enhanced how-to names live HTML",
);
assert(enhanced.pythagoreanChart.personalDay.number >= 1, "day on enhanced");

const { token, expiresAt } = createShareToken("report-uuid-1");
assert(token.includes("."), "token has signature");
const parsed = verifyShareToken(token);
eq(parsed?.reportId, "report-uuid-1", "token round-trip");
assert(parsed?.expiresAt === expiresAt, "exp matches");
assert(verifyShareToken(token.slice(0, -2) + "xx") == null, "bad sig rejected");
assert(verifyShareToken("not-a-token") == null, "junk rejected");

console.log("smoke:living-share passed");
