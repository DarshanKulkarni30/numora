import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import type { NumerologyReport, ReportType } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";

export type SeasonBrief = {
  asOf: string;
  yearNumber: number;
  yearTitle: string;
  /** Plain sentence: what this year is for. Leads; the image is secondary. */
  yearJob: string;
  yearImage: string;
  yearFocus: string[];
  monthNumber: number | null;
  monthTitle: string | null;
  /** Plain sentence: what this month is for. */
  monthJob: string | null;
  monthImage: string | null;
  monthFocus: string[];
  combined: string;
  doThis: string[];
  easeOff: string[];
  pinnacle?: string;
  projected?: string;
};

const YEAR_IMAGE: Record<
  number,
  { title: string; job: string; image: string; focus: string[] }
> =
  {
    1: {
      title: "A starting year",
      job: "This year is for starting one thing and putting your name on it. Expect to be the one who decides and goes first, which is tiring but is the point of a 1 year.",
      image: "like standing at a new trailhead",
      focus: [
        "starting one clear thing",
        "saying out loud where you are heading",
        "taking the first honest step before it feels ready",
      ],
    },
    2: {
      title: "A listening year",
      job: "This year is for working with people rather than ahead of them. Progress tends to come from one good partnership and from waiting for the right moment, not from pushing harder.",
      image: "like waiting for the right tide",
      focus: [
        "hearing the other person out before you decide",
        "doing one thing with someone instead of alone",
        "letting timing do the work instead of pushing",
      ],
    },
    3: {
      title: "A speaking-up year",
      job: "This year is for saying and showing what you have been working on. Writing, teaching, posting and ordinary conversation all count — the risk is starting many of them and finishing none.",
      image: "like a studio with the windows open",
      focus: [
        "finishing one thing you started saying",
        "learning something out loud where others can hear it",
        "keeping the social load light enough to enjoy",
      ],
    },
    4: {
      title: "A groundwork year",
      job: "This year is for building the boring things that hold everything else up: routines, records, savings, repairs. It rarely feels exciting, and what you set up now is what next year runs on.",
      image: "like laying stone for a lasting floor",
      focus: [
        "writing one repeating task down as steps",
        "keeping one system running all year",
        "dropping one commitment that no longer fits",
      ],
    },
    5: {
      title: "A change year",
      job: "This year is for movement — travel, a new role, a different routine, a change of scene. Change tends to find you either way, so choose one or two on purpose rather than letting five happen at once.",
      image: "like changing trains with a lighter bag",
      focus: [
        "trying one small change you can undo",
        "keeping plans loose enough to move",
        "changing one input, not everything at once",
      ],
    },
    6: {
      title: "A responsibility year",
      job: "This year is for people and places that depend on you: home, family, a team, a promise you already made. More gets asked of you than usual, so the useful skill is helping with a limit rather than helping until you are empty.",
      image: "like tending a garden",
      focus: [
        "keeping one promise you already made",
        "helping with a limit you say out loud",
        "putting the home things back in order",
      ],
    },
    7: {
      title: "A study year",
      job: "This year is for going deeper into one subject rather than wider across five. Time alone is productive rather than antisocial now, as long as the thinking eventually turns into one small step.",
      image: "like entering a university",
      focus: [
        "protecting one quiet hour each week",
        "studying one subject properly instead of five lightly",
        "waiting a beat before you answer",
      ],
    },
    8: {
      title: "A results year",
      job: "This year is for finishing things that can be counted: money, targets, qualifications, a project that ships. Effort shows up in visible results, and the cost is that rest gets postponed unless you schedule it.",
      image: "like taking inventory of a workshop",
      focus: [
        "finishing one result you can measure",
        "getting the money and the admin in order",
        "resting after the push rather than instead of it",
      ],
    },
    9: {
      title: "A finishing year",
      job: "This year is for ending things properly — a job, a course, a habit, a version of yourself that has already finished. Starting something brand new tends to stall until the old thing is actually closed.",
      image: "like closing a long chapter with care",
      focus: [
        "closing one loop that is already done",
        "handing on something you know to someone who asked",
        "keeping what still matters and letting the rest go",
      ],
    },
    11: {
      title: "A noticing year",
      job: "This year is for paying attention rather than producing. Ideas and patterns arrive faster than usual and so does tiredness, so the job is to write things down and rest before you are forced to.",
      image: "a year for noticing, thinking and resting",
      focus: [
        "writing down one thing you keep repeating",
        "resting on purpose, not only once you are tired",
        "sharing one idea without rushing it out",
      ],
    },
    22: {
      title: "A building year",
      job: "This year is for the large practical project — the one that needs years, not weeks. Ambition only turns into anything if it goes on a real calendar in ordinary steps.",
      image: "like drawing a large plan on practical paper",
      focus: [
        "taking one practical step on the large plan",
        "putting that plan on a real calendar",
        "building something meant to outlast the year",
      ],
    },
    33: {
      title: "A teaching year",
      job: "This year is for passing on what you know and looking after people who ask. It goes wrong in one specific way — giving to everyone lightly and running yourself down — so help fewer people properly.",
      image: "like holding a lamp for others while keeping your own fuel",
      focus: [
        "helping one person properly instead of many lightly",
        "saying what you know in plain words",
        "keeping enough left over for yourself",
      ],
    },
  };

const MONTH_IMAGE: Record<
  number,
  { title: string; job: string; image: string; focus: string[] }
> = {
  1: {
    title: "Starting month",
    job: "A month to begin one thing rather than plan several.",
    image: "like striking a match",
    focus: ["starting one small thing"],
  },
  2: {
    title: "Working-with-others month",
    job: "A month where things move faster with one other person than alone.",
    image: "like listening before speaking",
    focus: ["doing one thing with one other person"],
  },
  3: {
    title: "Sharing month",
    job: "A month to finish something and let people see it.",
    image: "like a sketchbook week",
    focus: ["finishing and sharing one piece"],
  },
  4: {
    title: "Tidying month",
    job: "A month for admin, routines and the jobs you keep deferring.",
    image: "like sorting a workbench",
    focus: ["putting one routine on paper"],
  },
  5: {
    title: "Change month",
    job: "A month where a small change lands well and a big one overshoots.",
    image: "like opening a window",
    focus: ["trying one small change you can undo"],
  },
  6: {
    title: "Looking-after month",
    job: "A month when home and the people close to you need more of your time.",
    image: "like tending a garden",
    focus: [
      "looking after one person properly",
      "repairing one thing you have let slide",
    ],
  },
  7: {
    title: "Quiet month",
    job: "A month to think before answering and to protect some time alone.",
    image: "like a quiet library hour",
    focus: ["taking quiet time before you answer"],
  },
  8: {
    title: "Delivery month",
    job: "A month to finish one thing you can actually measure.",
    image: "like balancing the books",
    focus: ["finishing one result you can measure"],
  },
  9: {
    title: "Closing month",
    job: "A month to end what is already over instead of starting more.",
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
    yearJob: assertSafeCopy(yMeta.job, "enhanced.season.yearJob"),
    yearFocus: yMeta.focus,
    monthNumber: pm,
    monthTitle: mMeta?.title ?? null,
    monthJob: mMeta ? assertSafeCopy(mMeta.job, "enhanced.season.monthJob") : null,
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
