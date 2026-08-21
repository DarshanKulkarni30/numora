import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import type { NumerologyReport, ReportType } from "@/lib/numerology/types";
import type { SeasonBrief } from "./seasonBrief";
import type { ThemeHit } from "./themeGraph";

export type ActionPlan = {
  days30: { title: string; items: string[] };
  days90: { title: string; items: string[] };
  year: { title: string; primary: string; secondary: string; items: string[] };
  purposeNote: string;
};

export function buildActionPlan(opts: {
  report: NumerologyReport;
  season: SeasonBrief;
  themes: ThemeHit[];
}): ActionPlan {
  const { report, season, themes } = opts;
  const young = isYoung(report.person.report_type);
  const purpose = report.person.purpose || "Self-reflection";
  const growth = report.growth_areas ?? [];
  const recs = report.recommendations ?? [];
  const topTheme = themes[0]?.label.toLowerCase() ?? "clarity";

  const skill = young
    ? "one skill or interest to practice without comparison"
    : purposeSkill(purpose, topTheme);
  const relationship = young
    ? "one family or friendship repair or shared attention"
    : purposeRelation(purpose);
  const unfinished = young
    ? "one unfinished piece of schoolwork, hobby, or room-order"
    : "one unfinished task that would quiet the mind if completed";

  const days30 = assertSafeList(
    unique([
      skill,
      relationship,
      unfinished,
      season.doThis[0],
      growth[0]?.actions?.[0],
    ]).slice(0, 4),
    "enhanced.plan.30",
  );

  const days90 = assertSafeList(
    unique([
      young ? "Build a simple weekly rhythm (study, rest, play)" : purposeNinety(purpose),
      young ? "Document one thing you learned in your own words" : "Document a method you already use so it can be reused",
      young ? "Teach or show a younger person or sibling one small skill" : "Teach or explain one insight to someone who asked",
      recs[0],
    ]).slice(0, 4),
    "enhanced.plan.90",
  );

  const primary = young
    ? "Deepen curiosity without rushing identity"
    : purposeYearPrimary(purpose, topTheme);
  const secondary = young
    ? "Share what you notice with a trusted adult when it feels safe"
    : "Share what you learn when it is kind and wanted";

  return {
    days30: {
      title: "Next 30 days",
      items: days30,
    },
    days90: {
      title: "Next 90 days",
      items: days90,
    },
    year: {
      title: "This year",
      primary: assertSafeCopy(primary, "enhanced.plan.year.primary"),
      secondary: assertSafeCopy(secondary, "enhanced.plan.year.secondary"),
      items: assertSafeList(
        unique([season.yearFocus[0], recs[1], growth[1]?.suggestion]).slice(0, 3),
        "enhanced.plan.year.items",
      ),
    },
    purposeNote: assertSafeCopy(
      `Ordered using the profile lens “${purpose}” and the current Personal Year ${season.yearNumber} season as of ${season.asOf}. These are practice invitations, not assigned outcomes.`,
      "enhanced.plan.purpose",
    ),
  };
}

function isYoung(t: ReportType): boolean {
  return t === "child" || t === "adolescent";
}

function purposeSkill(purpose: string, theme: string): string {
  const p = purpose.toLowerCase();
  if (p.includes("career")) return `One skill that makes ${theme} usable at work (a template, checklist, or teaching note)`;
  if (p.includes("relationship") || p.includes("family"))
    return "One listening or repair skill used in a real conversation";
  return `One skill that turns ${theme} into a visible practice`;
}

function purposeRelation(purpose: string): string {
  const p = purpose.toLowerCase();
  if (p.includes("career")) return "One working relationship to clarify (ask, thank, or close a loop)";
  if (p.includes("family")) return "One family connection to tend without fixing anyone";
  if (p.includes("relationship")) return "One relationship to meet with clearer pacing and honesty";
  return "One relationship (family, friend, or colleague) to tend with attention";
}

function purposeNinety(purpose: string): string {
  const p = purpose.toLowerCase();
  if (p.includes("career")) return "Build one reusable work system";
  if (p.includes("family") || p.includes("relationship")) return "Build one household or partnership ritual that lowers friction";
  return "Build one personal system that holds insight (notes, calendar, or craft hours)";
}

function purposeYearPrimary(purpose: string, theme: string): string {
  const p = purpose.toLowerCase();
  if (p.includes("career")) return `Deepen ${theme} as craft others can rely on`;
  if (p.includes("family")) return "Deepen care at home without disappearing";
  if (p.includes("relationship")) return "Deepen honest pacing in close ties";
  return `Deepen ${theme} into lived knowledge`;
}

function unique(items: (string | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    if (typeof item !== "string") continue;
    const key = item.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item.trim());
  }
  return out;
}
