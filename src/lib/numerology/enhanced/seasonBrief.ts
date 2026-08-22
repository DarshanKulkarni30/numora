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
      focus: [
        "starting one clear thing",
        "saying out loud where you are heading",
        "taking the first honest step before it feels ready",
      ],
    },
    2: {
      title: "A listening year",
      image: "like waiting for the right tide",
      focus: [
        "hearing the other person out before you decide",
        "doing one thing with someone instead of alone",
        "letting timing do the work instead of pushing",
      ],
    },
    3: {
      title: "A voice year",
      image: "like a studio with the windows open",
      focus: [
        "finishing one thing you started saying",
        "learning something out loud where others can hear it",
        "keeping the social load light enough to enjoy",
      ],
    },
    4: {
      title: "A foundation year",
      image: "like laying stone for a lasting floor",
      focus: [
        "writing one repeating task down as steps",
        "keeping one system running all year",
        "dropping one commitment that no longer fits",
      ],
    },
    5: {
      title: "A movement year",
      image: "like changing trains with a lighter bag",
      focus: [
        "trying one small change you can undo",
        "keeping plans loose enough to move",
        "changing one input, not everything at once",
      ],
    },
    6: {
      title: "A garden year",
      image: "like tending a garden",
      focus: [
        "keeping one promise you already made",
        "helping with a limit you say out loud",
        "putting the home things back in order",
      ],
    },
    7: {
      title: "A university year",
      image: "like entering a university",
      focus: [
        "protecting one quiet hour each week",
        "studying one subject properly instead of five lightly",
        "waiting a beat before you answer",
      ],
    },
    8: {
      title: "A stewardship year",
      image: "like taking inventory of a workshop",
      focus: [
        "finishing one result you can measure",
        "getting the money and the admin in order",
        "resting after the push rather than instead of it",
      ],
    },
    9: {
      title: "A completion year",
      image: "like closing a long chapter with care",
      focus: [
        "closing one loop that is already done",
        "handing on something you know to someone who asked",
        "keeping what still matters and letting the rest go",
      ],
    },
    11: {
      title: "A noticing year",
      image: "a year to notice, think, and rest",
      focus: [
        "writing down one thing you keep repeating",
        "resting on purpose, not only once you are tired",
        "sharing one idea without rushing it out",
      ],
    },
    22: {
      title: "A building year",
      image: "like drawing a large plan on practical paper",
      focus: [
        "taking one practical step on the large plan",
        "putting that plan on a real calendar",
        "building something meant to outlast the year",
      ],
    },
    33: {
      title: "A teaching year",
      image: "like holding a lamp for others while keeping your own fuel",
      focus: [
        "helping one person properly instead of many lightly",
        "saying what you know in plain words",
        "keeping enough left over for yourself",
      ],
    },
  };

const MONTH_IMAGE: Record<number, { title: string; image: string; focus: string[] }> =
  {
    1: {
      title: "Initiative month",
      image: "like striking a match",
      focus: ["starting one small thing"],
    },
    2: {
      title: "Attunement month",
      image: "like listening before speaking",
      focus: ["doing one thing with one other person"],
    },
    3: {
      title: "Expression month",
      image: "like a sketchbook week",
      focus: ["finishing and sharing one piece"],
    },
    4: {
      title: "Order month",
      image: "like sorting a workbench",
      focus: ["putting one routine on paper"],
    },
    5: {
      title: "Change month",
      image: "like opening a window",
      focus: ["trying one small change you can undo"],
    },
    6: {
      title: "Care month",
      image: "like tending a garden",
      focus: [
        "looking after one person properly",
        "repairing one thing you have let slide",
      ],
    },
    7: {
      title: "Study month",
      image: "like a quiet library hour",
      focus: ["taking quiet time before you answer"],
    },
    8: {
      title: "Steward month",
      image: "like balancing the books",
      focus: ["finishing one result you can measure"],
    },
    9: {
      title: "Release month",
      image: "like finishing a letter",
      focus: ["closing one loop that is already done"],
    },
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
      ? `As of ${asOf}: year ${py} is for ${joinSoft(yMeta.focus.slice(0, 2))}. This month (${pm}) is for ${joinSoft(mMeta.focus)}. Do the month job inside the year job — not a prediction.`
      : `As of ${asOf}: year ${py} is for ${joinSoft(yMeta.focus)}. Not a prediction.`,
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
  return young
    ? [
        "keeping one simple practice going",
        "naming a feeling before moving on from it",
      ]
    : [];
}

function defaultEase(py: number, young: boolean): string[] {
  if (young)
    return ["comparing yourself to others", "forcing a grown-up pace"];
  if (py === 7)
    return [
      "going quiet as the whole plan",
      "thinking it through again instead of taking one small step",
    ];
  if (py === 8)
    return ["pushing with no pause", "measuring your worth only by results"];
  if (py === 5)
    return ["changing course every week", "change for its own sake"];
  return [
    "pushing growth that is not ready yet",
    "working through the signals to rest",
  ];
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
