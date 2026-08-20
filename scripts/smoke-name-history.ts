import { dualNameChart } from "../src/lib/numerology/nameLayers";
import { generateReport } from "../src/lib/numerology/report";
import {
  nameHistoryIssue,
  normalizeNameHistory,
  resolveNameInForce,
} from "../src/lib/profile/nameHistory";

function eq(actual: unknown, expected: unknown, label: string) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    console.error("FAIL", label, { actual, expected });
    process.exit(1);
  }
  console.log("ok", label);
}

const dob = "10/10/1980";
const natal = "ABCD XYZ";
const married = "ABCD YYYY";

const { eras, error } = normalizeNameHistory(
  [
    {
      id: "e1",
      full_name: married,
      started_on: "22/10/2005",
      ended_on: "",
      reason: "marriage",
    },
  ],
  dob,
);
eq(error, null, "marriage era normalizes");
eq(eras.length, 1, "one later name kept");

const before = resolveNameInForce({
  natalName: natal,
  dateOfBirth: dob,
  history: eras,
  asOf: "01/01/2000",
});
eq(before.operatingSpelling, natal, "before marriage uses birth name");
eq(before.differs, false, "pre-marriage not a different operating name");
eq(before.label, "Birth name", "pre-marriage label");

const weddingDay = resolveNameInForce({
  natalName: natal,
  dateOfBirth: dob,
  history: eras,
  asOf: "22/10/2005",
});
eq(weddingDay.operatingSpelling, married, "wedding day switches to married name");
eq(weddingDay.differs, true, "married name differs from natal");
eq(weddingDay.givenUnchanged, true, "given name unchanged on surname-only change");

const now = resolveNameInForce({
  natalName: natal,
  dateOfBirth: dob,
  history: eras,
  asOf: "20/08/2026",
});
eq(now.operatingSpelling, married, "today still uses married name");

const tooEarly = normalizeNameHistory(
  [
    {
      full_name: married,
      started_on: "01/01/1970",
      ended_on: "",
      reason: "marriage",
    },
  ],
  dob,
);
eq(Boolean(tooEarly.error), true, "era before DOB is rejected");

const second = normalizeNameHistory(
  [
    {
      full_name: married,
      started_on: "22/10/2005",
      ended_on: "",
      reason: "marriage",
    },
    {
      full_name: "ABCD ZZZZ",
      started_on: "01/01/2015",
      ended_on: "",
      reason: "legal",
    },
  ],
  dob,
);
eq(second.error, null, "two sequential eras ok");
eq(second.eras[0]?.ended_on, "31/12/2014", "open era auto-closes day before next");

const chart = dualNameChart({
  natalName: natal,
  dateOfBirth: dob,
  history: eras,
  asOf: "20/08/2026",
});
eq(chart.differs, true, "dual chart flags a name change");
eq(
  chart.operating.vedicName !== chart.natal.vedicName ||
    chart.operating.expression !== chart.natal.expression,
  true,
  "surname change moves NN or Expression",
);

const report = generateReport(
  {
    fullName: natal,
    preferredName: "ABCD",
    dateOfBirth: dob,
    purpose: "Self-reflection",
    gender: "Female",
    nameHistory: eras,
  },
  new Date(2026, 7, 20),
);
eq(report.person.full_name, natal, "report keeps birth-certificate name");
eq(report.person.operating_name, married, "report stores operating name");
eq(
  report.numerology_snapshot.vedic_name,
  String(chart.operating.vedicName),
  "snapshot NN is operating",
);
eq(
  report.numerology_snapshot.natal_vedic_name,
  String(chart.natal.vedicName),
  "snapshot keeps natal NN",
);
eq(
  report.numerology_snapshot.expression_number,
  String(chart.operating.expression),
  "snapshot Expression is operating",
);
eq(
  report.numerology_snapshot.natal_maturity_number,
  String(chart.natal.maturity),
  "classical maturity stays on birth name",
);

const plain = generateReport({
  fullName: natal,
  dateOfBirth: dob,
  purpose: "Self-reflection",
});
eq(plain.person.operating_name, undefined, "no history omits operating name");
eq(plain.numerology_snapshot.natal_vedic_name, undefined, "no dual NN without history");

const emptyNoDob = normalizeNameHistory([], "");
eq(emptyNoDob.error, null, "empty later-name list does not require DOB");
eq(emptyNoDob.eras.length, 0, "empty later-name list stays empty");

const blankCard = normalizeNameHistory(
  [{ id: "blank", full_name: "", started_on: "", ended_on: "", reason: "marriage" }],
  dob,
);
eq(blankCard.error, null, "blank later-name card is ignored");

eq(
  nameHistoryIssue(
    [{ full_name: married, started_on: "", ended_on: "", reason: "marriage" }],
    dob,
  ) != null,
  true,
  "named later name without start date blocks save",
);

console.log("name history smoke passed");
