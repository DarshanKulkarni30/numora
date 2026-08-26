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
      image: "You will be the one who decides first more often this year.",
      focus: [
        "starting one clear thing",
        "saying out loud where you are heading",
        "taking the first honest step before it feels ready",
      ],
    },
    2: {
      title: "A listening year",
      job: "This year is for working with people rather than ahead of them. Progress comes from one good partnership and from waiting for the right moment, not from pushing harder.",
      image: "Progress comes from one good partnership, not from pushing harder.",
      focus: [
        "hearing the other person out before you decide",
        "doing one thing with someone instead of alone",
        "letting timing do the work instead of pushing",
      ],
    },
    3: {
      title: "A speaking-up year",
      job: "This year is for saying and showing what you have been working on. Writing, teaching, posting and ordinary conversation all count — the risk is starting many of them and finishing none.",
      image: "The risk this year is starting many talks and finishing none.",
      focus: [
        "finishing one thing you started saying",
        "learning something out loud where others can hear it",
        "keeping the social load light enough to enjoy",
      ],
    },
    4: {
      title: "A groundwork year",
      job: "This year is for building the boring things that hold everything else up: routines, records, savings, repairs. It rarely feels exciting, and what you set up now is what next year runs on.",
      image: "This year rarely feels exciting. What you set up now is what next year runs on.",
      focus: [
        "writing one repeating task down as steps",
        "keeping one system running all year",
        "dropping one commitment that no longer fits",
      ],
    },
    5: {
      title: "A change year",
      job: "This year is for movement — travel, a new role, a different routine, a change of scene. Change finds you either way, so choose one or two on purpose rather than letting five happen at once.",
      image: "Change will find you either way, so choose one or two on purpose.",
      focus: [
        "Try one small change you can undo (a route, a meeting, or a bedtime)",
        "Keep the rest of the week the same",
        "Do not start a second change until this one has had a week",
      ],
    },
    6: {
      title: "A responsibility year",
      job: "This year is for people and places that depend on you: home, family, a team, a promise you already made. More gets asked of you than usual, so the useful skill is helping with a limit rather than helping until you are empty.",
      image: "More gets asked of you than usual. Help with a limit you say out loud.",
      focus: [
        "keeping one promise you already made",
        "helping with a limit you say out loud",
        "putting the home things back in order",
      ],
    },
    7: {
      title: "A study year",
      job: "This year is for going deeper into one subject rather than wider across five. Time alone is productive rather than antisocial now, as long as the thinking eventually turns into one small step.",
      image: "Time alone is useful this year if the thinking turns into one small step.",
      focus: [
        "protecting one quiet hour each week",
        "studying one subject properly instead of five lightly",
        "waiting a beat before you answer",
      ],
    },
    8: {
      title: "A results year",
      job: "This year is for finishing things that can be counted: money, targets, qualifications, a project that ships. Effort shows up in visible results, and the cost is that rest gets postponed unless you schedule it.",
      image: "Effort shows up as a result you can count. Rest has to be scheduled.",
      focus: [
        "finishing one result you can measure",
        "getting the money and the admin in order",
        "resting after the push rather than instead of it",
      ],
    },
    9: {
      title: "A finishing year",
      job: "This year is for ending things properly — a job, a course, a habit, a version of yourself that has already finished. Starting something brand new stalls until the old thing is actually closed.",
      image: "New starts stall until the old thing is actually closed.",
      focus: [
        "closing one loop that is already done",
        "handing on something you know to someone who asked",
        "keeping what still matters and letting the rest go",
      ],
    },
    11: {
      title: "A noticing year",
      job: "This year is for paying attention rather than producing. Ideas and patterns arrive faster than usual and so does tiredness, so the job is to write things down and rest before you are forced to.",
      image: "Ideas arrive faster, and so does tiredness. Write them down and rest.",
      focus: [
        "writing down one thing you keep repeating",
        "resting on purpose, not only once you are tired",
        "sharing one idea without rushing it out",
      ],
    },
    22: {
      title: "A building year",
      job: "This year is for the large practical project — the one that needs years, not weeks. Ambition only turns into anything if it goes on a real calendar in ordinary steps.",
      image: "Ambition only turns into anything if it goes on a real calendar.",
      focus: [
        "taking one practical step on the large plan",
        "putting that plan on a real calendar",
        "building something meant to outlast the year",
      ],
    },
    33: {
      title: "A teaching year",
      job: "This year is for passing on what you know and looking after people who ask. It goes wrong in one specific way — giving to everyone lightly and running yourself down — so help fewer people properly.",
      image: "It goes wrong when you help everyone lightly and run yourself down.",
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
    title: "A starting month",
    job: "This month is for beginning one thing, not planning five. Example: send the first message, not rewrite the whole list.",
    image: "Begin one thing. Do not plan several.",
    focus: ["Start one small thing this week and put your name on it"],
  },
  2: {
    title: "A with-someone month",
    job: "This month, one task moves faster with one other person than alone. Ask them. Do the task together.",
    image: "Do one thing with one other person.",
    focus: ["Do one task with one other person this week"],
  },
  3: {
    title: "A sharing month",
    job: "This month is for finishing one piece and letting someone see it. Example: send the draft. Do not open a second draft first.",
    image: "Finish one piece and let someone see it.",
    focus: ["Finish one thing you started saying and let someone see it"],
  },
  4: {
    title: "A planning month",
    job: "This month is for jobs you keep putting off — a bill, a filing, or a weekly plan. Write one repeating task as steps (sleep, budget, or the start of the workday) and do the first step this week.",
    image: "Write one repeating task as steps. Do the first step this week.",
    focus: [
      "Write one repeating task as steps (sleep, budget, or the start of the workday) and do the first step this week",
    ],
  },
  5: {
    title: "A change month",
    job: "This month a small change works; a big rewrite does not. Pick one change you can undo (a route, a meeting, or a bedtime).",
    image: "One small change. Not a rewrite of the whole plan.",
    focus: ["Try one small change you can undo. Keep the rest of the week the same"],
  },
  6: {
    title: "A care month",
    job: "This month home and people close to you need more time. Keep one promise. Keep one hour that is only for you.",
    image: "Keep one promise. Keep one hour for yourself.",
    focus: ["Keep one promise to someone. Keep one hour that is only for you"],
  },
  7: {
    title: "A quiet month",
    job: "This month, think before you answer. Protect some time alone. Then tell one person what you found.",
    image: "Think, then answer. Do not hide all week.",
    focus: ["Take ten quiet minutes, then answer the person who is waiting"],
  },
  8: {
    title: "A results month",
    job: "This month, finish one thing you can count — a file, a payment, a shipped step. Then rest.",
    image: "Finish one result you can count. Then rest.",
    focus: ["Finish one result you can measure, then rest"],
  },
  9: {
    title: "A closing month",
    job: "This month, end what is already over. Example: send the last message, return the item, delete the dead project. Do not start more until that is closed.",
    image: "Close one loop that is already done. Do not start more.",
    focus: ["Close one loop that is already done before you start another"],
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
      ...youngChildDo(young),
    ]).slice(0, 5),
    "enhanced.season.do",
  );

  const easeOff = assertSafeList(
    unique([
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

/** One 30-day line: this year's job inside this month's job. */
export function thirtyDayFocus(season: SeasonBrief): string {
  const yearBit = season.yearFocus[0];
  const monthBit = season.monthFocus[0];
  if (yearBit && monthBit) {
    return `${yearBit}. This month: ${monthBit}. Keep that one pair for four weeks. Do not add a second project.`;
  }
  if (yearBit) return `${yearBit}. Keep it for four weeks.`;
  return "Pick one practice from this page. Keep it for four weeks.";
}
