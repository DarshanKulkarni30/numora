/**
 * Two-person relationship report: weighted seat score + 12-month year overlay.
 * Reflective only — not relationship advice.
 */

import { pairTone, type CompatTone } from "./compatibility";
import { personalYearCycleAt } from "./cycles";
import { vedicPsychicFromDob } from "./dateNumbers";
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
  tone: CompatTone;
  note: string;
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
  disclaimer: string;
};

const TONE_POINTS: Record<CompatTone, number> = {
  Amazing: 100,
  Favourable: 75,
  Neutral: 50,
  Challenging: 25,
};

const DISCLAIMER =
  "A pair score is a weighted reading of five number seats plus a year overlay. It is not a verdict on love, marriage, or friendship, and it does not predict outcomes.";

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
    } Life Path ${a.lifePath} (${(CORE_TRAIT[a.lifePath] ?? coreTraitFor(a.lifePath)).toLowerCase()}) beside Life Path ${b.lifePath} is the long-walk overlay; Personal Years colour the next twelve months without rewriting either chart.`,
    "couple.summary",
  );

  const months: CoupleMonth[] = [];
  for (let i = 0; i < 12; i++) {
    const d = addMonths(asOf, i);
    const aYear = personalYearCycleAt(personA.dateOfBirth, d).number;
    const bYear = personalYearCycleAt(personB.dateOfBirth, d).number;
    const tone = pairTone(aYear, bYear);
    months.push({
      label: monthLabel(d),
      calendarYear: d.getFullYear(),
      calendarMonth: d.getMonth() + 1,
      isCurrent: i === 0,
      aYear,
      bYear,
      tone,
      note: assertSafeCopy(
        `${monthLabel(d)}: ${a.label} in Personal Year ${aYear}, ${b.label} in Personal Year ${bYear} — ${tone.toLowerCase()} year overlay.`,
        `couple.m.${i}`,
      ),
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
    disclaimer: assertSafeCopy(DISCLAIMER, "couple.disclaimer"),
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
      report.disclaimer,
    ],
    "couple.pdf",
  );
}
