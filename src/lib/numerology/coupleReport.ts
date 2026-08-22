/**
 * Two-person relationship report: weighted seat score + 12-month year overlay.
 * Reflective only — not relationship advice.
 */

import { pairTone, type CompatTone } from "./compatibility";
import { personalMonth, personalYearCycleAt } from "./cycles";
import { vedicPsychicFromDob } from "./dateNumbers";
import { plainJob, plainTrait, plainWatch } from "./layeredCopy";
import { CORE_TRAIT, coreTraitFor } from "./meanings";
import { calculatePythagorean } from "./pythagorean";
import { assertSafeCopy, assertSafeList } from "./safety";

export type CouplePersonInput = {
  label: string;
  fullName: string;
  dateOfBirth: string;
};

export type CoupleAxis = {
  key: string;
  label: string;
  a: number;
  b: number;
  tone: CompatTone;
  weight: number;
  points: number;
};

export type CoupleMonth = {
  label: string;
  calendarYear: number;
  calendarMonth: number;
  isCurrent: boolean;
  aYear: number;
  bYear: number;
  aMonth: number;
  bMonth: number;
  tone: CompatTone;
  note: string;
};

export type CoupleYear = {
  calendarYear: number;
  isCurrent: boolean;
  aYear: number;
  bYear: number;
  tone: CompatTone;
  note: string;
  months: CoupleMonth[];
};

export type CouplePersonView = {
  label: string;
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  psychic: number;
  personalYear: number;
};

export type CoupleReport = {
  a: CouplePersonView;
  b: CouplePersonView;
  axes: CoupleAxis[];
  score: number;
  headline: string;
  summary: string;
  months: CoupleMonth[];
  years: CoupleYear[];
  disclaimer: string;
};

const TONE_POINTS: Record<CompatTone, number> = {
  Amazing: 100,
  Favourable: 75,
  Neutral: 50,
  Challenging: 25,
};

const DISCLAIMER =
  "A pair score is a weighted reading of five number seats plus year and month overlays. It is not a verdict on love, marriage, or friendship, and it does not predict events.";

function toneJob(tone: CompatTone): { tryLine: string; watchLine: string } {
  if (tone === "Amazing" || tone === "Favourable") {
    return {
      tryLine: "Pick one shared plan you can both keep.",
      watchLine: "Do not treat an easy year as a promise that nothing will be hard.",
    };
  }
  if (tone === "Challenging") {
    return {
      tryLine: "Put one check-in on the calendar each month.",
      watchLine: "Assuming the other person is being difficult, rather than moving at a different pace.",
    };
  }
  return {
    tryLine: "Name one thing each person needs this window.",
    watchLine: "Waiting for the numbers to agree before you talk.",
  };
}

function overlayNote(
  label: string,
  aName: string,
  aNum: number,
  bName: string,
  bNum: number,
  tone: CompatTone,
): string {
  const job = toneJob(tone);
  return `${label}: ${aName} is in ${plainTrait(aNum)} (${aNum}). ${bName} is in ${plainTrait(bNum)} (${bNum}). ${job.tryLine} Watch: ${job.watchLine}`;
}

function addMonths(asOf: Date, offset: number): Date {
  return new Date(asOf.getFullYear(), asOf.getMonth() + offset, 12, 12, 0, 0);
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function personView(
  p: CouplePersonInput,
  asOf: Date,
): CouplePersonView {
  const pyth = calculatePythagorean(p.fullName || p.label, p.dateOfBirth);
  return {
    label: p.label,
    lifePath: pyth.lifePath,
    expression: pyth.expression,
    soulUrge: pyth.soulUrge,
    personality: pyth.personality,
    psychic: vedicPsychicFromDob(p.dateOfBirth),
    personalYear: personalYearCycleAt(p.dateOfBirth, asOf).number,
  };
}

function axis(
  key: string,
  label: string,
  a: number,
  b: number,
  weight: number,
): CoupleAxis {
  const tone = pairTone(a, b);
  return {
    key,
    label,
    a,
    b,
    tone,
    weight,
    points: TONE_POINTS[tone],
  };
}

function headlineFor(score: number): string {
  if (score >= 80) return "Easy affinity on paper";
  if (score >= 65) return "Mostly supportive, with a few stretch seats";
  if (score >= 50) return "Mixed — some seats ease, some ask for patience";
  if (score >= 35) return "More stretch than ease — still not a verdict";
  return "The numbers ask for extra clarity — not a no";
}

export function buildCoupleReport(
  personA: CouplePersonInput,
  personB: CouplePersonInput,
  asOf = new Date(),
): CoupleReport {
  const a = personView(personA, asOf);
  const b = personView(personB, asOf);
  const axes = [
    axis("lifePath", "Life Path", a.lifePath, b.lifePath, 30),
    axis("expression", "Expression", a.expression, b.expression, 20),
    axis("soulUrge", "Soul Urge", a.soulUrge, b.soulUrge, 20),
    axis("personality", "Personality", a.personality, b.personality, 15),
    axis("psychic", "Psychic (day)", a.psychic, b.psychic, 15),
  ];
  const raw = axes.reduce((s, x) => s + x.points * x.weight, 0);
  const score = Math.round(raw / 100);

  const stretch = axes.filter((x) => x.tone === "Challenging").map((x) => x.label);
  const ease = axes.filter((x) => x.tone === "Amazing" || x.tone === "Favourable").map((x) => x.label);

  const summary = assertSafeCopy(
    `${a.label} and ${b.label} score ${score} / 100 on five seats (Life Path 30%, Expression 20%, Soul Urge 20%, Personality 15%, Psychic 15%). ${headlineFor(score)}. ${
      ease.length ? `Easier seats: ${ease.join(", ")}.` : ""
    } ${
      stretch.length ? `Stretch seats: ${stretch.join(", ")}.` : "No stretch seat on this pairing."
    } Life Path ${a.lifePath} (${(CORE_TRAIT[a.lifePath] ?? coreTraitFor(a.lifePath)).toLowerCase()}) beside Life Path ${b.lifePath} is the long walk. Year and month numbers below are pacing for each person — not a forecast of the relationship.`,
    "couple.summary",
  );

  const months: CoupleMonth[] = [];
  for (let i = 0; i < 12; i++) {
    months.push(
      buildCoupleMonth(personA, personB, a.label, b.label, addMonths(asOf, i), i === 0, i, "year"),
    );
  }

  const startYear = asOf.getFullYear();
  const years: CoupleYear[] = [];
  for (let i = 0; i < 10; i++) {
    const calendarYear = startYear + i;
    const mid = new Date(calendarYear, 6, 1, 12, 0, 0);
    const aYear = personalYearCycleAt(personA.dateOfBirth, mid).number;
    const bYear = personalYearCycleAt(personB.dateOfBirth, mid).number;
    const tone = pairTone(aYear, bYear);
    const job = toneJob(tone);
    const yearMonths: CoupleMonth[] = [];
    for (let m = 0; m < 12; m++) {
      const d = new Date(calendarYear, m, 12, 12, 0, 0);
      yearMonths.push(
        buildCoupleMonth(
          personA,
          personB,
          a.label,
          b.label,
          d,
          calendarYear === startYear && m === asOf.getMonth(),
          i * 12 + m,
          "month",
        ),
      );
    }
    years.push({
      calendarYear,
      isCurrent: i === 0,
      aYear,
      bYear,
      tone,
      note: assertSafeCopy(
        `${calendarYear}: ${a.label} — ${plainJob(aYear)}. ${b.label} — ${plainJob(bYear)}. ${job.tryLine} Watch: ${job.watchLine} ${a.label} watch: ${plainWatch(aYear)}.`,
        `couple.y.${i}`,
      ),
      months: yearMonths,
    });
  }

  return {
    a,
    b,
    axes,
    score,
    headline: assertSafeCopy(headlineFor(score), "couple.headline"),
    summary,
    months,
    years,
    disclaimer: assertSafeCopy(DISCLAIMER, "couple.disclaimer"),
  };
}

function buildCoupleMonth(
  personA: CouplePersonInput,
  personB: CouplePersonInput,
  aLabel: string,
  bLabel: string,
  d: Date,
  isCurrent: boolean,
  key: number,
  pair: "year" | "month",
): CoupleMonth {
  const aYear = personalYearCycleAt(personA.dateOfBirth, d).number;
  const bYear = personalYearCycleAt(personB.dateOfBirth, d).number;
  const aM = personalMonth(aYear, d);
  const bM = personalMonth(bYear, d);
  const left = pair === "month" ? aM : aYear;
  const right = pair === "month" ? bM : bYear;
  const tone = pairTone(left, right);
  return {
    label: monthLabel(d),
    calendarYear: d.getFullYear(),
    calendarMonth: d.getMonth() + 1,
    isCurrent,
    aYear,
    bYear,
    aMonth: aM,
    bMonth: bM,
    tone,
    note: assertSafeCopy(
      overlayNote(monthLabel(d), aLabel, left, bLabel, right, tone),
      `couple.m.${key}`,
    ),
  };
}

export function coupleReportPdfLines(report: CoupleReport): string[] {
  return assertSafeList(
    [
      `${report.a.label} × ${report.b.label} · ${report.score}/100 · ${report.headline}`,
      report.summary,
      ...report.axes.map(
        (x) =>
          `${x.label} ${x.a} × ${x.b} · ${x.tone} · weight ${x.weight}%`,
      ),
      ...report.months.map((m) => m.note),
      ...report.years.map((y) => y.note),
      report.disclaimer,
    ],
    "couple.pdf",
  );
}
