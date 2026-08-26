/**
 * Step-by-step working for the chart numbers that previously showed a result
 * with no arithmetic behind it: Balance, Subconscious Self, Planes of
 * Expression, Period Cycles, Personal Month and the Lo Shu grid counts.
 *
 * Values are read off the already-built chart rather than recomputed, so a
 * derivation can never disagree with the number displayed beside it.
 */

import { personalMonth, personalYearCycleAt } from "./cycles";
import { calculateLoShu } from "./loShu";
import { PYTHAGOREAN } from "./mappings";
import {
  NAME_PLANE_LETTERS,
  type NamePlaneId,
  type PythagoreanChart,
} from "./pythagoreanChart";
import { lettersOnly, parseDob } from "./reduce";
import { assertSafeCopy } from "./safety";
import type { NumerologyReport } from "./types";

export type DerivationStep = { label: string; detail: string };

export type Derivation = {
  id: string;
  title: string;
  /** What the number is for, in one plain sentence. */
  purpose: string;
  /** The source material the calculation starts from. */
  inputs: string;
  steps: DerivationStep[];
  result: string;
  /** Where schools or maps legitimately differ, when that applies. */
  note?: string;
};

function letterValue(ch: string): number {
  return PYTHAGOREAN[ch] ?? 0;
}

/** "D=4 + A=1 + K=2 = 7", truncated so a long name stays readable. */
function letterSum(letters: string[], limit = 14): string {
  const shown = letters.slice(0, limit).map((ch) => `${ch}=${letterValue(ch)}`);
  const tail = letters.length > limit ? ` + … (${letters.length} letters)` : "";
  return shown.join(" + ") + tail;
}

function digitChain(start: number): string {
  const chain = [start];
  let cursor = start;
  while (cursor > 9) {
    cursor = String(cursor)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
    chain.push(cursor);
  }
  return chain.join(" → ");
}

export function buildChartDerivations(
  report: NumerologyReport,
  chart: PythagoreanChart,
  asOf = new Date(),
): Derivation[] {
  const natalName =
    report.numerology_snapshot.natal_name || report.person.full_name || "";
  const dob = report.person.date_of_birth;
  const out: Derivation[] = [];

  out.push(balanceDerivation(natalName, chart));
  out.push(subconsciousSelfDerivation(natalName, chart));
  out.push(...planeDerivations(natalName, chart));
  out.push(periodCycleDerivation(dob, chart));
  out.push(personalMonthDerivation(dob, asOf));
  out.push(loShuDerivation(dob));

  return out.map((d) => ({
    ...d,
    purpose: assertSafeCopy(d.purpose, `deriv.${d.id}.purpose`),
    result: assertSafeCopy(d.result, `deriv.${d.id}.result`),
  }));
}

function balanceDerivation(
  name: string,
  chart: PythagoreanChart,
): Derivation {
  const initials = name
    .toUpperCase()
    .split(/[\s-]+/)
    .map((part) => part.replace(/[^A-Z]/g, ""))
    .filter(Boolean)
    .map((part) => part[0]!);
  const sum = initials.reduce((s, ch) => s + letterValue(ch), 0);

  return {
    id: "balance",
    title: "Balance",
    purpose:
      "The steadying tone to reach for when you are thrown — not an everyday number, but the one to use in a hard hour.",
    inputs: `The first letter of each part of your birth-certificate name: ${initials.join(", ") || "none found"}.`,
    steps: initials.length
      ? [
          {
            label: "Take the initials",
            detail: `${name} gives ${initials.join(" · ")}.`,
          },
          {
            label: "Convert each to its Pythagorean value",
            detail: `${letterSum(initials)} = ${sum}`,
          },
          {
            label: "Reduce to one digit",
            detail: digitChain(sum),
          },
        ]
      : [
          {
            label: "No initials available",
            detail:
              "Balance needs at least one Latin initial from the birth-certificate name.",
          },
        ],
    result: chart.balance.number
      ? `Balance ${chart.balance.number}.`
      : "Balance could not be calculated from this spelling.",
    note: "Only initials are used, not the whole name. That is why Balance is usually different from your Expression number.",
  };
}

function subconsciousSelfDerivation(
  name: string,
  chart: PythagoreanChart,
): Derivation {
  const present = chart.subconsciousSelf.present;
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    (n) => !present.includes(n),
  );

  return {
    id: "subconscious-self",
    title: "Subconscious Self",
    purpose:
      "How many different tools your name gives you to fall back on under pressure. A count, not a rating — a lower number means fewer but more practised responses.",
    inputs: `Every letter of your birth-certificate name, converted to values 1–9.`,
    steps: [
      {
        label: "List the values your letters produce",
        detail: present.length
          ? `Present: ${present.join(", ")}.`
          : "No Latin letters found in this spelling.",
      },
      {
        label: "Note which of 1–9 never appear",
        detail: missing.length
          ? `Missing: ${missing.join(", ")}. These same gaps are your Karmic Lessons.`
          : "None missing — all nine values appear.",
      },
      {
        label: "Count the values present",
        detail: `${present.length} of 9.`,
      },
    ],
    result: `Subconscious Self ${chart.subconsciousSelf.number} of 9.`,
    note: "The scale runs 1 to 9 and most names land between 5 and 8. Nine is not better than six; it means a wider set of habits rather than a deeper few.",
  };
}

function planeDerivations(
  name: string,
  chart: PythagoreanChart,
): Derivation[] {
  const letters = lettersOnly(name).split("");

  return chart.planes.map((plane) => {
    const group = NAME_PLANE_LETTERS[plane.id as NamePlaneId];
    const used = letters.filter((ch) => group.includes(ch));

    return {
      id: `plane-${plane.id}`,
      title: `${plane.label} plane`,
      purpose: PLANE_PURPOSE[plane.id as NamePlaneId],
      inputs: `Only the letters of your birth-certificate name that belong to this plane: ${group.split("").join(", ")}.`,
      steps: [
        {
          label: "Pull those letters out of your name",
          detail: used.length
            ? `${used.join(", ")} — ${used.length} letter${used.length === 1 ? "" : "s"}.`
            : "None of this plane's letters appear in your name.",
        },
        {
          label: "Add their values",
          detail: used.length ? `${letterSum(used)} = ${plane.compound}` : "0",
        },
        {
          label: "Reduce to one digit",
          detail: plane.compound ? digitChain(plane.compound) : "—",
        },
      ],
      result: plane.compound
        ? `${plane.label} plane ${plane.compound}/${plane.reduced}, from ${plane.letterCount} of ${letters.length} letters.`
        : `${plane.label} plane is empty on this spelling, which is common and not a fault.`,
      note: "Letter count matters as much as the digit: a plane built from one letter is a thinner signal than one built from six. These are name-letter planes, which are a different map from the Lo Shu date-grid planes.",
    };
  });
}

const PLANE_PURPOSE: Record<NamePlaneId, string> = {
  physical:
    "How much of your natural approach is hands-on — building, moving, doing the thing rather than discussing it.",
  mental:
    "How much of your approach runs through analysis, planning and argument.",
  emotional:
    "How much runs through feeling, rapport and reading the room.",
  intuitive:
    "How much runs through hunches and pattern-sense you cannot fully justify yet.",
};

function periodCycleDerivation(
  dob: string,
  chart: PythagoreanChart,
): Derivation {
  let inputs = "The month, day and year of your birth, each reduced on its own.";
  const steps: DerivationStep[] = [];

  try {
    const { day, month, year } = parseDob(dob);
    inputs = `Your birth date ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}, with month, day and year each reduced separately.`;
    steps.push(
      {
        label: "First cycle comes from the month",
        detail: `${month} → ${chart.periodCycles[0]?.number ?? "—"}`,
      },
      {
        label: "Second cycle comes from the day",
        detail: `${day} → ${chart.periodCycles[1]?.number ?? "—"}`,
      },
      {
        label: "Third cycle comes from the year",
        detail: `${year} → ${chart.periodCycles[2]?.number ?? "—"}`,
      },
    );
  } catch {
    steps.push({
      label: "Note",
      detail: "This saved report's date could not be re-parsed.",
    });
  }

  for (const cycle of chart.periodCycles) {
    steps.push({
      label: `${cycle.label} cycle runs ${ageWindow(cycle.ageStart, cycle.ageEnd)}`,
      detail: `${cycle.label} carries ${cycle.number}${cycle.isCurrent ? " — this is the one you are in now" : ""}.`,
    });
  }

  const current = chart.periodCycles.find((c) => c.isCurrent);

  return {
    id: "period-cycles",
    title: "Period Cycles",
    purpose:
      "Three long chapters that divide up your life. Each one sets a background climate lasting decades, not a mood you feel day to day.",
    inputs,
    steps,
    result: current
      ? `You are in the ${current.label} cycle, carrying ${current.number}.`
      : "Cycle windows are set from the first Pinnacle boundary.",
    note: "The age boundaries follow your first Pinnacle, so they land on different birthdays for different people rather than at fixed ages.",
  };
}

function ageWindow(start: number, end: number | null): string {
  return end == null ? `from age ${start} onward` : `ages ${start}–${end}`;
}

function personalMonthDerivation(dob: string, asOf: Date): Derivation {
  const cycle = personalYearCycleAt(dob, asOf);
  const month = asOf.getMonth() + 1;
  const pm = personalMonth(cycle.number, asOf);
  const sum = cycle.number + month;

  return {
    id: "personal-month",
    title: "Personal Month",
    purpose:
      "The pacing for the next few weeks, sitting inside the larger Personal Year. It suggests what kind of effort fits right now.",
    inputs: `Your Personal Year (${cycle.number}) and the current calendar month (${month}).`,
    steps: [
      {
        label: "Start from the Personal Year",
        detail: `Personal Year ${cycle.number}.`,
      },
      {
        label: "Add the calendar month number",
        detail: `${cycle.number} + ${month} = ${sum}`,
      },
      {
        label: "Reduce to one digit",
        detail: digitChain(sum),
      },
    ],
    result: `Personal Month ${pm}.`,
    note: "The calendar month is used here, so the Personal Month changes on the 1st. The Personal Year it is built from changes on your birthday, not on 1 January.",
  };
}

function loShuDerivation(dob: string): Derivation {
  const steps: DerivationStep[] = [];
  let result = "Lo Shu grid could not be built from this date.";

  try {
    const { day, month, year } = parseDob(dob);
    const raw = `${day}${month}${year}`.split("").map(Number);
    const digits = raw.filter((d) => d !== 0);
    const loShu = calculateLoShu(dob);

    const counts = Object.entries(loShu.grid)
      .filter(([, count]) => (count as number) > 0)
      .map(([digit, count]) => `${digit}×${count}`)
      .join(", ");
    const missing = Object.entries(loShu.grid)
      .filter(([, count]) => (count as number) === 0)
      .map(([digit]) => digit);

    steps.push(
      {
        label: "Write the date out as single digits",
        detail: `${day}/${month}/${year} → ${raw.join(" ")}`,
      },
      {
        label: "Drop the zeros",
        detail: `Zeros have no square on the grid, leaving ${digits.join(" ")}.`,
      },
      {
        label: "Add the two derived numbers",
        detail: `Psychic ${loShu.birth_number} (birth day reduced) and Destiny ${loShu.destiny_number} (whole date reduced) are placed on the grid as well.`,
      },
      {
        label: "Count how many times each digit landed",
        detail: counts || "No digits placed.",
      },
      {
        label: "Note the empty squares",
        detail: missing.length
          ? `${missing.join(", ")} never appear. These are skills to build deliberately, not faults.`
          : "Every square is filled, which is uncommon.",
      },
    );
    result = `Grid counts: ${counts || "none"}.${missing.length ? ` Empty: ${missing.join(", ")}.` : ""}`;
  } catch {
    steps.push({
      label: "Note",
      detail: "This saved report's date could not be re-parsed.",
    });
  }

  return {
    id: "lo-shu",
    title: "Lo Shu grid counts",
    purpose:
      "Which digits your birth date repeats and which it never uses. Repeats point to automatic habits; gaps point to skills that need deliberate practice.",
    inputs: "Every digit of your birth date, plus your Psychic and Destiny numbers.",
    steps,
    result,
    note: "Numora adds the Psychic and Destiny numbers to the grid, which is standard in Indian practice. Charts that plot only the raw date digits will show slightly different counts.",
  };
}
