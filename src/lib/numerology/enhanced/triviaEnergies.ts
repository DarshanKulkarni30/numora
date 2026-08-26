import { associationsForNumber } from "@/lib/numerology/associations";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import type { NumerologyReport, ReportType } from "@/lib/numerology/types";
import type { ThemeHit } from "./themeGraph";
import { parseChartNumber } from "./digits";

export type TriviaEnergies = {
  colorsPrimary: { name: string; hex: string }[];
  colorsSupport: { name: string; hex: string }[];
  weekdays: { label: string; day: string }[];
  recurringDigits: number[];
  elements: string[];
  workspaces: string[];
  motto: string;
  note: string;
};

const ELEMENT: Record<number, string> = {
  1: "Fire",
  2: "Water",
  3: "Fire",
  4: "Earth",
  5: "Air",
  6: "Earth",
  7: "Water",
  8: "Earth",
  9: "Fire",
};

export function buildTriviaEnergies(opts: {
  report: NumerologyReport;
  themes: ThemeHit[];
  archetypeTitle: string;
}): TriviaEnergies {
  const { report, themes, archetypeTitle } = opts;
  const snap = report.numerology_snapshot;
  const young = isYoung(report.person.report_type);
  const lp = parseChartNumber(snap.life_path) ?? 9;
  const expr = parseChartNumber(snap.expression_number) ?? 9;
  const soul = parseChartNumber(snap.soul_urge_number) ?? 9;
  const py = parseChartNumber(snap.personal_year) ?? lp;

  const primary = associationsForNumber(lp);
  const support = associationsForNumber(expr);
  const soulA = associationsForNumber(soul);

  const colorsPrimary = uniqueColors([...primary.colors, ...soulA.colors]).slice(0, 3);
  const colorsSupport = uniqueColors(support.colors.filter((c) => !colorsPrimary.some((p) => p.name === c.name))).slice(0, 2);

  const weekdays = [
    { label: "Planning tone", day: pickDay(primary.weekdays, "Thursday") },
    { label: "Discipline tone", day: pickDay(support.weekdays, "Saturday") },
    {
      label: young ? "Family tone" : "Relationship tone",
      day: pickDay(soulA.weekdays, "Monday"),
    },
  ];

  const recurring = uniqueNums([
    lp,
    parseChartNumber(snap.birth_day),
    expr,
    parseChartNumber(snap.vedic_destiny),
    parseChartNumber(snap.vedic_psychic),
    py,
  ]).slice(0, 5);

  const elements = unique([
    ELEMENT[core(lp)],
    ELEMENT[core(expr)],
    ELEMENT[core(soul)],
  ]).filter(Boolean) as string[];

  const workspaces = workspaceFor(lp, expr, young);
  const motto = mottoFor(archetypeTitle, lp, expr);
  const topTheme = themes[0]?.label.toLowerCase();

  return {
    colorsPrimary,
    colorsSupport,
    weekdays,
    recurringDigits: recurring,
    elements,
    workspaces,
    motto: assertSafeCopy(motto, "enhanced.trivia.motto"),
    note: assertSafeCopy(
      `These are reflective associations from the same color, weekday, and tone banks used elsewhere in Numora—not lucky charms, shopping lists, or predicted events.${topTheme ? ` Dominant theme in this profile: ${topTheme}.` : ""}`,
      "enhanced.trivia.note",
    ),
  };
}

function isYoung(t: ReportType): boolean {
  return t === "child" || t === "adolescent";
}

function core(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

function pickDay(days: string[], fallback: string): string {
  return days[0] || fallback;
}

function uniqueColors(list: { name: string; hex: string }[]) {
  const seen = new Set<string>();
  const out: { name: string; hex: string }[] = [];
  for (const c of list) {
    if (seen.has(c.name)) continue;
    seen.add(c.name);
    out.push(c);
  }
  return out;
}

function uniqueNums(list: (number | null)[]): number[] {
  const out: number[] = [];
  for (const n of list) {
    if (n == null || out.includes(n)) continue;
    out.push(n);
  }
  return out;
}

function unique(list: string[]): string[] {
  return [...new Set(list.filter(Boolean))];
}

function workspaceFor(lp: number, expr: number, young: boolean): string[] {
  const out: string[] = [];
  if (lp === 7 || lp === 11 || expr === 7) out.push("Library or quiet desk");
  if (lp === 4 || expr === 4 || expr === 22) out.push("Private office with clear surfaces");
  if (lp === 3 || expr === 3) out.push("A place where making is allowed to be messy at first");
  if (lp === 6 || lp === 2) out.push("A room that still feels like home");
  if (lp === 5) out.push("A café or window seat used on purpose, then left");
  if (!out.length) out.push("A consistent corner that belongs to you");
  if (young) out.push("A spot an adult can still see, without hovering");
  return assertSafeList(out.slice(0, 4), "enhanced.trivia.space");
}

function mottoFor(archetype: string, lp: number, expr: number): string {
  if (lp === 7 || lp === 11) return "Understand deeply, then act on purpose.";
  if (expr === 4 || lp === 4) return "Make the insight usable.";
  if (lp === 8) return "Use authority to get a result, not to prove you deserve it.";
  if (lp === 2 || lp === 6) return "Care without dropping your own work.";
  if (lp === 5) return "Move, then choose a form.";
  return `${archetype}: keep the numbers honest, and keep the day kind.`;
}
