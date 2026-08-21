import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import type { NumerologyReport, ReportType } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";

export type SeasonBrief = {
  asOf: string;
  yearNumber: number;
  yearTitle: string;
  yearImage: string;
  yearFocus: string[];
  monthNumber: number | null;
  monthTitle: string | null;
  monthImage: string | null;
  monthFocus: string[];
  combined: string;
  doThis: string[];
  easeOff: string[];
  pinnacle?: string;
  projected?: string;
};

const YEAR_IMAGE: Record<number, { title: string; image: string; focus: string[] }> =
  {
    1: {
      title: "A trailhead year",
      image: "like standing at a new trailhead",
      focus: ["begin one clear aim", "name a direction", "take a first honest step"],
    },
    2: {
      title: "A listening year",
      image: "like waiting for the right tide",
      focus: ["patience", "partnership", "timing over force"],
    },
    3: {
      title: "A voice year",
      image: "like a studio with the windows open",
      focus: ["expression", "learning out loud", "lighter social exchange"],
    },
    4: {
      title: "A foundation year",
      image: "like laying stone for a lasting floor",
      focus: ["routines", "systems", "simplifying commitments"],
    },
    5: {
      title: "A movement year",
      image: "like changing trains with a lighter bag",
      focus: ["flexibility", "conscious variety", "travel of mind or place"],
    },
    6: {
      title: "A garden year",
      image: "like tending a garden",
      focus: ["home", "care", "responsibility with boundaries"],
    },
    7: {
      title: "A university year",
      image: "like entering a university",
      focus: ["study", "research", "honest reflection"],
    },
    8: {
      title: "A stewardship year",
      image: "like taking inventory of a workshop",
      focus: ["organization", "ethical ambition", "measurable follow-through"],
    },
    9: {
      title: "A completion year",
      image: "like closing a long chapter with care",
      focus: ["release", "mentoring", "finishing what still matters"],
    },
    11: {
      title: "An insight year",
      image: "like a clear night for noticing patterns",
      focus: ["inspiration", "rest", "sharing ideas without rushing them"],
    },
    22: {
      title: "A building year",
      image: "like drawing a large plan on practical paper",
      focus: ["long-horizon craft", "daily steps", "durable structures"],
    },
    33: {
      title: "A teaching year",
      image: "like holding a lamp for others while keeping your own fuel",
      focus: ["guidance", "compassion", "care without self-erasure"],
    },
  };

const MONTH_IMAGE: Record<number, { title: string; image: string; focus: string[] }> =
  {
    1: { title: "Initiative month", image: "like striking a match", focus: ["start small"] },
    2: { title: "Attunement month", image: "like listening before speaking", focus: ["collaboration"] },
    3: { title: "Expression month", image: "like a sketchbook week", focus: ["make and share"] },
    4: { title: "Order month", image: "like sorting a workbench", focus: ["systems"] },
    5: { title: "Change month", image: "like opening a window", focus: ["variety with care"] },
    6: { title: "Care month", image: "like tending a garden", focus: ["family", "repair", "home"] },
    7: { title: "Study month", image: "like a quiet library hour", focus: ["reflection"] },
    8: { title: "Steward month", image: "like balancing the books", focus: ["follow-through"] },
    9: { title: "Release month", image: "like finishing a letter", focus: ["completion"] },
  };

export function buildSeasonBrief(
  report: NumerologyReport,
  asOf: string,
): SeasonBrief {
  const py = parseChartNumber(report.personal_year?.number) ?? 9;
  const pm = parseChartNumber(report.personal_month?.number);
  const yMeta = YEAR_IMAGE[py] ?? YEAR_IMAGE[coreFallback(py)];
  const mMeta = pm != null ? MONTH_IMAGE[pm] ?? MONTH_IMAGE[coreFallback(pm)] : null;
  const young = isYoung(report.person.report_type);
  const monthly = report.monthly_guidance;

  const combined = assertSafeCopy(
    mMeta
      ? `As of ${asOf}, Personal Year ${py} may feel ${yMeta.image}, while Personal Month ${pm} may feel ${mMeta.image}. Together, the current season may favour ${joinSoft(yMeta.focus.slice(0, 2))} through ${joinSoft(mMeta.focus)}.`
      : `As of ${asOf}, Personal Year ${py} may feel ${yMeta.image}. The invitation is ${joinSoft(yMeta.focus)}.`,
    "enhanced.season.combined",
  );

  const doThis = assertSafeList(
    unique([
      ...yMeta.focus.slice(0, 2),
      ...(mMeta?.focus ?? []),
      ...(monthly?.focus_areas ?? []).slice(0, 2),
      ...youngChildDo(young),
    ]).slice(0, 5),
    "enhanced.season.do",
  );

  const easeOff = assertSafeList(
    unique([
      ...(monthly?.avoid ?? []).slice(0, 3),
      ...defaultEase(py, young),
    ]).slice(0, 4),
    "enhanced.season.ease",
  );

  return {
    asOf,
    yearNumber: py,
    yearTitle: yMeta.title,
    yearImage: yMeta.image,
    yearFocus: yMeta.focus,
    monthNumber: pm,
    monthTitle: mMeta?.title ?? null,
    monthImage: mMeta?.image ?? null,
    monthFocus: mMeta?.focus ?? [],
    combined,
    doThis,
    easeOff,
    pinnacle: report.personal_year?.pinnacle,
    projected: report.projected_year
      ? `Projected year ${report.projected_year.number} (${report.projected_year.calendar_year})`
      : undefined,
  };
}

function coreFallback(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n >= 1 && n <= 9 ? n : 9;
}

function isYoung(t: ReportType): boolean {
  return t === "child" || t === "adolescent";
}

function youngChildDo(young: boolean): string[] {
  return young ? ["keep one simple practice", "notice feelings without rushing them"] : [];
}

function defaultEase(py: number, young: boolean): string[] {
  if (young) return ["comparing yourself to others", "forcing a grown-up pace"];
  if (py === 7) return ["isolation as the only plan", "over-analysis without a small next step"];
  if (py === 8) return ["pressure without rest", "measuring worth only by results"];
  if (py === 5) return ["scattering attention", "change for its own sake"];
  return ["forcing growth", "ignoring the body's need for pause"];
}

function joinSoft(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? "steady attention";
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

function unique(items: (string | undefined | null)[]): string[] {
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
