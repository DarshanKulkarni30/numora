import { nameCycleForYear } from "../src/lib/numerology/blueprint/nameCycle";
import { interpretYear, YEAR_INTERPRETATION_VERSION } from "../src/lib/numerology/blueprint/yearInterpreter";
import { personalYearForCalendarYear } from "../src/lib/numerology/cycles";

function eq(actual: unknown, expected: unknown, label: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
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

const DOB = "30/08/1981";
const NAME = "Darshan Kulkarni";

const c2026 = nameCycleForYear({
  natalName: NAME,
  dob: DOB,
  calendarYearUsed: 2026,
  personalYear: 3,
});
eq(c2026?.active.letter, "S", "Darshan 2026 letter S");
eq(c2026?.active.value, 3, "Darshan 2026 Chaldean 3");

const c2023 = nameCycleForYear({
  natalName: NAME,
  dob: DOB,
  calendarYearUsed: 2023,
});
eq(c2023?.active.letter, "D", "Darshan 2023 letter D");
eq(c2023?.active.value, 4, "Darshan 2023 Chaldean 4");

eq(c2026?.letters.map((l) => l.letter).join(""), "DARSHAN", "first-name walk");

const py2026 = personalYearForCalendarYear(DOB, 2026);
const reading = interpretYear({
  calendarYear: 2026,
  personalYear: py2026,
  cycle: c2026,
  bn: 3,
  dn: 3,
  nameRoot: 7,
});
eq(reading.interpretationVersion, YEAR_INTERPRETATION_VERSION, "version 1.0");
eq(reading.cycleLetter, "S", "interpreter cycle letter");
if (!reading.feel.includes("may feel")) {
  console.error("FAIL feel copy", reading.feel);
  process.exit(1);
}
console.log("ok reflective feel copy");

const married = nameCycleForYear({
  natalName: NAME,
  dob: DOB,
  calendarYearUsed: 2026,
  history: [
    {
      id: "e1",
      full_name: "Anita Sharma",
      started_on: "22/10/2005",
      ended_on: "",
      reason: "marriage",
    },
  ],
});
eq(married?.firstName.toUpperCase().startsWith("A"), true, "operating first name after change");
eq(married?.letters[0]?.letter, "A", "cycle uses Anita first letter");

const py9 = interpretYear({
  calendarYear: 2029,
  personalYear: 9,
  cycle: nameCycleForYear({
    natalName: NAME,
    dob: DOB,
    calendarYearUsed: 2029,
    personalYear: 9,
  }),
  bn: 3,
  dn: 3,
  nameRoot: 7,
});
eq(py9.personalYear, 9, "PY 9 still interprets");
assert(Boolean(py9.signatureTitle), "PY 9 has a signature");
console.log("ok name-cycle smokes");
