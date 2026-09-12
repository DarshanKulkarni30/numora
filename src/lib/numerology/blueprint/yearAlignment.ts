/**
 * Annual Career & Life alignment: Core (BN + DN + Name) × Personal Year × Name Cycle.
 * Ranks as 1–5 stars and a verdict. Never a 0–100 grade.
 */

import { formatCompoundRoot } from "@/lib/numerology/chaldeanName";
import { pairTone } from "@/lib/numerology/compatibility";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import { westernYearOutlook, type WesternYearAnchor } from "@/lib/numerology/personalYearOutlook";
import { parseDob } from "@/lib/numerology/reduce";
import { assertSafeCopy } from "@/lib/numerology/safety";
import { nameCycleForYear } from "./nameCycle";
import { yearModeFor } from "./yearInterpreter";

export type StarScore = 1 | 2 | 3 | 4 | 5;

export type AlignmentVerdict =
  | "strong-now"
  | "different-approach"
  | "better-later"
  | "lighter-core";

export type AlignmentLayerWhy = {
  bn: string;
  dn: string;
  name: string;
  year: string;
  cycle: string;
};

export type AlignmentRow = {
  id: string;
  title: string;
  kind: "career" | "life";
  core: StarScore;
  year: StarScore;
  cycle: StarScore;
  verdict: AlignmentVerdict;
  verdictLabel: string;
  approach: string;
  result: string;
  why: AlignmentLayerWhy;
  starRead: string;
};

export type YearAlignment = {
  calendarYear: number;
  personalYear: number;
  pyModeTitle: string;
  pyModeVerb: string;
  cycleLetter: string | null;
  cycleNumber: number | null;
  bn: number;
  dn: number;
  nameDisplay: string;
  nameRoot: number;
  coreIntro: string;
  yearIntro: string;
  careers: AlignmentRow[];
  life: AlignmentRow[];
  priorities: AlignmentRow[];
  priorityLine: string;
  starKey: {
    core: string;
    year: string;
    cycle: string;
    whenTheyDiffer: string;
  };
};

const VERDICT_LABEL: Record<AlignmentVerdict, string> = {
  "strong-now": "Strong now",
  "different-approach": "Good, different approach",
  "better-later": "Better later",
  "lighter-core": "Lighter core fit",
};

type RoleDef = {
  id: string;
  title: string;
  kind: "career" | "life";
  coreDigits: number[];
  /** Index 1–9 = Personal Year star rank */
  yearStars: StarScore[];
  cycleDigits: number[];
  approach: Record<number, string>;
};

function stars9(
  a1: StarScore,
  a2: StarScore,
  a3: StarScore,
  a4: StarScore,
  a5: StarScore,
  a6: StarScore,
  a7: StarScore,
  a8: StarScore,
  a9: StarScore,
): StarScore[] {
  return [1, a1, a2, a3, a4, a5, a6, a7, a8, a9];
}

const CAREER_ROLES: RoleDef[] = [
  {
    id: "tech",
    title: "AI / Technology",
    kind: "career",
    coreDigits: [3, 4, 7, 1, 8],
    yearStars: stars9(4, 3, 5, 4, 4, 3, 4, 4, 3),
    cycleDigits: [3, 7, 1, 4],
    approach: {
      1: "Start one technical piece that already exists in your work.",
      2: "Pair with one person who can test or ship with you.",
      3: "Present one idea. Make expertise something others can try.",
      4: "Turn the idea into a repeatable build or spec.",
      5: "Try one new tool or audience. Keep the core product.",
      6: "Stabilise support and teaching around what you already built.",
      7: "Deepen one specialist finding, then publish a short trace of it.",
      8: "Ship a measurable result from work already in progress.",
      9: "Finish or hand over a technical chapter before opening another.",
    },
  },
  {
    id: "venture",
    title: "Entrepreneurship",
    kind: "career",
    coreDigits: [1, 3, 5, 8],
    yearStars: stars9(5, 3, 5, 4, 4, 3, 2, 5, 3),
    cycleDigits: [1, 3, 5, 8],
    approach: {
      1: "Start a small named offer. Do not found a second company.",
      2: "Find one partner or first customer. Do not solo-hero the year.",
      3: "Make the offer visible. Validate in public, in a small way.",
      4: "Build the operating system (price, delivery, follow-up).",
      5: "Test one new channel. Keep the offer.",
      6: "Stabilise delivery and care for the people already buying.",
      7: "Research and rethink the model. Do not force a scale-up.",
      8: "Scale what already works. Measure one number.",
      9: "Complete, sell, or close a chapter. Do not start a stack of new bets.",
    },
  },
  {
    id: "product",
    title: "Product leadership",
    kind: "career",
    coreDigits: [1, 3, 4, 8],
    yearStars: stars9(5, 3, 5, 4, 4, 3, 3, 5, 3),
    cycleDigits: [1, 3, 4, 7],
    approach: {
      1: "Own one product decision with your name on it.",
      2: "Align one stakeholder pair before adding features.",
      3: "Lead visibly: demo, write, or walk people through the product.",
      4: "Lock a build sequence and keep it.",
      5: "Explore one adjacent use. Do not rebuild the whole product.",
      6: "Protect the team and the promise you already made.",
      7: "Study what is true in the product. Then say it plainly.",
      8: "Drive one outcome the business can count.",
      9: "Retire a feature or a process that is already done.",
    },
  },
  {
    id: "consult",
    title: "Consulting / strategy",
    kind: "career",
    coreDigits: [3, 7, 1, 9],
    yearStars: stars9(4, 4, 5, 3, 3, 4, 4, 4, 4),
    cycleDigits: [3, 7, 1, 9],
    approach: {
      1: "Name one problem you already solve. Offer it once.",
      2: "Work with one client as a pair, not a broadcast.",
      3: "Share expertise in a session or brief someone else can use.",
      4: "Write the method so it can be repeated.",
      5: "Take the method to one new audience.",
      6: "Care for the existing clients. Do not add a new curriculum first.",
      7: "Research → a short published finding. Not research indefinitely.",
      8: "Price and deliver a result, not only advice.",
      9: "Close a body of work and teach the lesson from it.",
    },
  },
  {
    id: "research",
    title: "Research / R&D",
    kind: "career",
    coreDigits: [7, 4, 1],
    yearStars: stars9(3, 3, 3, 4, 3, 3, 5, 3, 4),
    cycleDigits: [7, 4, 3],
    approach: {
      1: "Start one inquiry with a date it will leave the notebook.",
      2: "Think with one colleague. Do not disappear.",
      3: "Turn one finding into a talk, page, or demo.",
      4: "Give the research a method and a file structure.",
      5: "Follow one unexpected lead. Cap the rabbit holes at one.",
      6: "Share enough that other people can use the work.",
      7: "Go deep, then publish a short trace. Depth is a support, not a hide.",
      8: "Convert one finding into a decision or a product step.",
      9: "Archive what is finished. Start only after that file is closed.",
    },
  },
  {
    id: "marketing",
    title: "Marketing / communication",
    kind: "career",
    coreDigits: [3, 5, 1, 9],
    yearStars: stars9(4, 3, 5, 3, 5, 3, 2, 4, 3),
    cycleDigits: [3, 5, 1],
    approach: {
      1: "Start one message and put your name on it.",
      2: "Have one real conversation instead of a campaign.",
      3: "Make the work visible. Finish one public piece.",
      4: "Build a repeating content loop. Keep it small.",
      5: "Try one new channel. Drop it if it does not earn a reply.",
      6: "Speak to people you already serve. Do not chase a crowd.",
      7: "Say less, with more truth. A quiet note beats a noisy feed.",
      8: "Tie communication to a numbered result (leads, replies, sales).",
      9: "Complete a campaign. Do not stack a new one on an open one.",
    },
  },
  {
    id: "education",
    title: "Education / teaching",
    kind: "career",
    coreDigits: [3, 6, 7, 9],
    yearStars: stars9(4, 4, 5, 3, 3, 5, 4, 3, 4),
    cycleDigits: [3, 6, 7, 9],
    approach: {
      1: "Teach one concept you already use.",
      2: "Teach with someone, or to one person, not a stadium.",
      3: "Teach / influence: turn knowledge into a session others can take.",
      4: "Write the lesson so it can be repeated next week.",
      5: "Take the lesson to one new group.",
      6: "Keep the promise to the people already learning.",
      7: "Deepen the material, then teach the short version.",
      8: "Measure whether people can use what you taught.",
      9: "Graduate a cohort or close a course before designing the next.",
    },
  },
  {
    id: "finance",
    title: "Finance",
    kind: "career",
    coreDigits: [8, 4, 2],
    yearStars: stars9(3, 2, 2, 4, 3, 4, 2, 5, 3),
    cycleDigits: [8, 4, 2],
    approach: {
      1: "Start one money habit you can keep (invoice, log, price).",
      2: "Talk money with one trusted person. Do not go silent.",
      3: "Controlled expansion: price work you already know how to do.",
      4: "Build the money system (dates, amounts, follow-up).",
      5: "Test one new income path. Cap the experiments at one.",
      6: "Stabilise household and work money so care does not leak.",
      7: "Study the numbers. Delay aggressive expansion.",
      8: "Execute one numbered money result.",
      9: "Close a money chapter (debt, product, partnership) cleanly.",
    },
  },
];

const LIFE_AREAS: RoleDef[] = [
  {
    id: "career-life",
    title: "Career",
    kind: "life",
    coreDigits: [1, 3, 8, 4],
    yearStars: stars9(5, 3, 5, 4, 4, 3, 3, 5, 3),
    cycleDigits: [1, 3, 8],
    approach: {
      1: "Start one visible piece of current work.",
      2: "Collaborate on one deliverable.",
      3: "Make current work public in a small way.",
      4: "Build a repeating work loop.",
      5: "Change one work habit, not the whole job.",
      6: "Keep promises at work so home is not the overflow valve.",
      7: "Deepen expertise, then show a short trace of it.",
      8: "Finish a result you can measure.",
      9: "Complete a work chapter before stacking a new one.",
    },
  },
  {
    id: "finance-life",
    title: "Finance",
    kind: "life",
    coreDigits: [8, 4, 2],
    yearStars: stars9(3, 2, 2, 4, 3, 4, 2, 5, 3),
    cycleDigits: [8, 4],
    approach: {
      1: "Put a date on one invoice or follow-up.",
      2: "One honest money conversation.",
      3: "Price one thing you already know how to do.",
      4: "Keep one money log for a month.",
      5: "Do not open a new stream until the last one has a number.",
      6: "Protect household money from extra yeses.",
      7: "Review, do not gamble.",
      8: "Collect or finish one real money result.",
      9: "Close a leak or a finished obligation.",
    },
  },
  {
    id: "relationships",
    title: "Relationships",
    kind: "life",
    coreDigits: [2, 6, 3],
    yearStars: stars9(3, 5, 4, 3, 3, 5, 3, 3, 4),
    cycleDigits: [2, 6, 3],
    approach: {
      1: "Start one honest conversation you have been postponing.",
      2: "Give partnership the foreground: one uninterrupted exchange.",
      3: "Say one specific appreciation. Do not use more events as a substitute.",
      4: "Keep a small repeating check-in.",
      5: "Try a new shared activity. Do not replace the hard talk with novelty.",
      6: "Care on purpose. Keep one promise.",
      7: "Stay reachable while you go inward. One real check-in.",
      8: "Protect time with people who matter from work overflow.",
      9: "Complete an old tension or let it go.",
    },
  },
  {
    id: "family",
    title: "Family",
    kind: "life",
    coreDigits: [6, 2, 4],
    yearStars: stars9(2, 4, 3, 3, 3, 5, 3, 3, 4),
    cycleDigits: [6, 2],
    approach: {
      1: "Own one family task with your name on it.",
      2: "Do one family act with someone, not for everyone.",
      3: "Speak plainly at home. One appreciation, one pending issue.",
      4: "Keep one weekly family loop on the same day.",
      5: "Change one household pattern, not the whole family system.",
      6: "This is a care year: one owned responsibility, not heroic availability.",
      7: "Be present in a small way even while you study.",
      8: "Do not let results season steal the repeating family task.",
      9: "Close a family loop that is already finished.",
    },
  },
  {
    id: "social",
    title: "Social life",
    kind: "life",
    coreDigits: [3, 5, 1],
    yearStars: stars9(4, 4, 5, 2, 5, 4, 2, 3, 3),
    cycleDigits: [3, 5, 1],
    approach: {
      1: "Start one new contact from work you already do.",
      2: "Deepen one existing tie.",
      3: "Be visible in rooms that already know your work.",
      4: "Cap events. One repeating gathering beats a scattered calendar.",
      5: "Meet new people through one experiment, then choose.",
      6: "Social time that serves care, not performance.",
      7: "Fewer rooms, better conversations.",
      8: "Network toward a result, then stop.",
      9: "Leave rooms that are finished.",
    },
  },
  {
    id: "growth",
    title: "Personal growth",
    kind: "life",
    coreDigits: [7, 3, 1, 9],
    yearStars: stars9(5, 3, 5, 4, 4, 3, 5, 3, 5),
    cycleDigits: [7, 3, 1, 9],
    approach: {
      1: "Turn one private idea into a first step with your name on it.",
      2: "Grow with one trusted person, not a new system.",
      3: "Share one page of an idea you have been holding.",
      4: "Practise one repeating growth loop.",
      5: "Try one new practice. Drop the rest of the stack.",
      6: "Growth that does not abandon care of others or rest.",
      7: "Inner work with one outward trace so it does not become hiding.",
      8: "Pick a growth result you can notice in a month.",
      9: "Release a story or habit that is already done.",
    },
  },
  {
    id: "learning",
    title: "Learning",
    kind: "life",
    coreDigits: [7, 3, 4],
    yearStars: stars9(4, 3, 5, 4, 4, 3, 5, 3, 4),
    cycleDigits: [7, 3, 4],
    approach: {
      1: "Begin one subject you will explain to someone else.",
      2: "Learn with a partner or a small group.",
      3: "Teach or write one concept you already use.",
      4: "Study on a repeating schedule.",
      5: "One new topic only. Finish a note before the next bookmark.",
      6: "Learn something the people around you can use.",
      7: "Go deep on one question. Publish a short finding.",
      8: "Use the learning in a piece of work with a date.",
      9: "Complete a course or close the notes before opening another.",
    },
  },
  {
    id: "wellbeing",
    title: "Peace / well-being",
    kind: "life",
    coreDigits: [2, 6, 7],
    yearStars: stars9(3, 4, 3, 4, 3, 5, 5, 2, 4),
    cycleDigits: [2, 6, 7],
    approach: {
      1: "Start one rest block on the calendar.",
      2: "Ask for help with one load.",
      3: "Do not fill every hour with talking. Keep one quiet slot.",
      4: "A small daily body or sleep loop.",
      5: "Change one draining pattern, not your whole life.",
      6: "Protect rest while you care for others.",
      7: "Quiet is in season. Still answer the person who is waiting.",
      8: "Results season: book rest as if it were a meeting.",
      9: "Drop one obligation that is already complete.",
    },
  },
  {
    id: "home",
    title: "Home / lifestyle",
    kind: "life",
    coreDigits: [4, 6, 2],
    yearStars: stars9(3, 3, 2, 5, 3, 5, 3, 3, 4),
    cycleDigits: [4, 6],
    approach: {
      1: "Start one home fix. Finish it.",
      2: "Share one household load.",
      3: "Do not renovate as displacement from a public task.",
      4: "Build year: one room, drawer, or weekly loop. Complete it.",
      5: "Move one thing, not the whole house.",
      6: "Home as care: one owned household loop.",
      7: "A quiet corner is enough. Skip the full redesign.",
      8: "Keep home from collapsing while you chase results.",
      9: "Clear what is finished. Do not store a new project.",
    },
  },
  {
    id: "purpose",
    title: "Purpose / impact",
    kind: "life",
    coreDigits: [9, 1, 3, 7],
    yearStars: stars9(5, 3, 4, 4, 4, 4, 4, 4, 5),
    cycleDigits: [9, 1, 3, 7],
    approach: {
      1: "Write the aim as one sentence you could say aloud.",
      2: "Test the aim with one person who knows you.",
      3: "Express the aim in one public or shared piece.",
      4: "Give the aim a repeating slot.",
      5: "Do not redesign purpose every time a new idea appears.",
      6: "Impact that includes the people you already care for.",
      7: "Clarify the aim in private, then let one person see it.",
      8: "Attach the aim to one measurable contribution.",
      9: "This is a completion year for purpose: finish a contribution, then rest.",
    },
  },
];

function clampStars(n: number): StarScore {
  if (n <= 1) return 1;
  if (n >= 5) return 5;
  return n as StarScore;
}

function coreStars(bn: number, dn: number, nameRoot: number, needed: number[]): StarScore {
  const seats = [bn, dn, nameRoot];
  const hits = seats.filter((n) => needed.includes(n));
  const unique = new Set(hits).size;
  if (unique === 0) {
    const tone = pairTone(bn, needed[0] ?? bn);
    if (tone === "Amazing" || tone === "Favourable") return 2;
    return 1;
  }
  if (unique === 1) return hits.length >= 2 ? 4 : 3;
  if (unique === 2) return hits.length >= 3 ? 5 : 4;
  return 5;
}

function cycleStars(
  cycleN: number | null,
  py: number,
  needed: number[],
): StarScore {
  if (cycleN == null) return 3;
  if (needed.includes(cycleN)) return cycleN === py ? 5 : 4;
  const tone = pairTone(cycleN, needed[0] ?? cycleN);
  if (tone === "Amazing") return 3;
  if (tone === "Favourable") return 3;
  return 2;
}

function verdictFor(core: StarScore, year: StarScore, cycle: StarScore): AlignmentVerdict {
  if (core >= 4 && year >= 4) return "strong-now";
  if (core >= 4 && year <= 2) return "better-later";
  if (core >= 4) return "different-approach";
  if (core >= 3 && year <= 2 && cycle >= 4) return "different-approach";
  if (core >= 3 && year >= 3) return "different-approach";
  if (core <= 2 && year >= 4) return "different-approach";
  if (core >= 3 && year <= 2) return "better-later";
  return "lighter-core";
}

function resultCopy(verdict: AlignmentVerdict, title: string, approach: string): string {
  if (verdict === "strong-now") {
    return assertSafeCopy(
      `${title}: this year’s mode and your core point the same way. Best use: ${approach}`,
      "align.result.now",
    );
  }
  if (verdict === "better-later") {
    return assertSafeCopy(
      `${title}: the longer fit is real. This year’s mode is a weaker time to push it. Keep a light hold, and use the year’s energy elsewhere.`,
      "align.result.later",
    );
  }
  if (verdict === "different-approach") {
    return assertSafeCopy(
      `${title}: good role or area — different strategy this year. ${approach}`,
      "align.result.diff",
    );
  }
  return assertSafeCopy(
    `${title}: not a natural centre of this profile. Keep it small unless you already do this work.`,
    "align.result.light",
  );
}

function starRead(
  verdict: AlignmentVerdict,
  core: StarScore,
  year: StarScore,
  cycle: StarScore,
  kind: "career" | "life",
  title: string,
): string {
  const noun = kind === "career" ? "kind of work" : "life area";
  if (verdict === "strong-now" && core <= 2) {
    return assertSafeCopy(
      `${title}: this year is carrying this more than your birth pattern. Use Best approach — low core stars are not “not for you.”`,
      "align.star.now-low-core",
    );
  }
  if (verdict === "better-later") {
    return assertSafeCopy(
      `${title}: this ${noun} still fits you. This year is a weaker time to push it — keep a light hold, not a quit decision.`,
      "align.star.later",
    );
  }
  if (verdict === "lighter-core") {
    return assertSafeCopy(
      `${title}: lower core stars mean this is not a natural centre of the chart. Keep it small unless you already do it.`,
      "align.star.light",
    );
  }
  if (verdict === "strong-now") {
    return assertSafeCopy(
      `${title}: core and this year agree. Lean in with Best approach — one concrete move, not a life overhaul.`,
      "align.star.now",
    );
  }
  if (year > core) {
    return assertSafeCopy(
      `${title}: the year wants this more than your core does. Stay in work you already do; change the method.`,
      "align.star.year-high",
    );
  }
  if (year < core) {
    return assertSafeCopy(
      `${title}: you fit this ${noun} more than this year does. Keep the work; change the method (Best approach).`,
      "align.star.year-low",
    );
  }
  if (cycle !== core || cycle !== year) {
    return assertSafeCopy(
      `${title}: good fit, different method this year. Read Best approach — the star rows can disagree.`,
      "align.star.diff",
    );
  }
  return assertSafeCopy(
    `${title}: good fit. Best approach is the instruction, not the star count.`,
    "align.star.same",
  );
}

function scoreRole(
  role: RoleDef,
  opts: {
    bn: number;
    dn: number;
    nameRoot: number;
    nameDisplay: string;
    py: number;
    cycleLetter: string | null;
    cycleNumber: number | null;
  },
): AlignmentRow {
  const py = reduceToSingleDigit(opts.py);
  const core = coreStars(opts.bn, opts.dn, opts.nameRoot, role.coreDigits);
  const year = role.yearStars[py] ?? 3;
  const cycle = cycleStars(opts.cycleNumber, py, role.cycleDigits);
  const verdict = verdictFor(core, year, cycle);
  const approach = role.approach[py] ?? `Use this area in a ${yearModeFor(py).title.toLowerCase()} way.`;
  const cycleBit =
    opts.cycleLetter && opts.cycleNumber != null
      ? `Name Cycle ${opts.cycleLetter}/${opts.cycleNumber} (${plainTrait(opts.cycleNumber)}).`
      : "No Name Cycle letter is on file for this year.";
  return {
    id: role.id,
    title: role.title,
    kind: role.kind,
    core,
    year,
    cycle,
    verdict,
    verdictLabel: VERDICT_LABEL[verdict],
    approach: assertSafeCopy(approach, `align.${role.id}.approach`),
    result: resultCopy(verdict, role.title, approach),
    starRead: starRead(verdict, core, year, cycle, role.kind, role.title),
    why: {
      bn: assertSafeCopy(
        `Birth Number ${opts.bn}: ${plainTrait(opts.bn)}.`,
        `align.${role.id}.bn`,
      ),
      dn: assertSafeCopy(
        `Destiny Number ${opts.dn}: ${plainTrait(opts.dn)}.`,
        `align.${role.id}.dn`,
      ),
      name: assertSafeCopy(
        `Name ${opts.nameDisplay}: ${plainTrait(opts.nameRoot)}.`,
        `align.${role.id}.name`,
      ),
      year: assertSafeCopy(
        `Personal Year ${py} is a ${yearModeFor(py).title} year. ${approach}`,
        `align.${role.id}.year`,
      ),
      cycle: assertSafeCopy(cycleBit, `align.${role.id}.cycle`),
    },
  };
}

const VERDICT_RANK: Record<AlignmentVerdict, number> = {
  "strong-now": 4,
  "different-approach": 3,
  "better-later": 2,
  "lighter-core": 1,
};

function rankRows(rows: AlignmentRow[]): AlignmentRow[] {
  return [...rows].sort((a, b) => {
    const vr = VERDICT_RANK[b.verdict] - VERDICT_RANK[a.verdict];
    if (vr !== 0) return vr;
    const now = b.year + b.core + b.cycle - (a.year + a.core + a.cycle);
    if (now !== 0) return now;
    return a.title.localeCompare(b.title);
  });
}

function priorityLine(top: AlignmentRow[], pyTitle: string): string {
  const names = top.slice(0, 3).map((r) => r.title);
  if (names.length < 3) {
    return assertSafeCopy(
      `A ${pyTitle} year suggests putting energy where the top rows point, not equally everywhere.`,
      "align.priority.short",
    );
  }
  return assertSafeCopy(
    `Your pattern this year suggests more energy into ${names[0]}, then ${names[1]}, then ${names[2]} — not spreading yourself equally across every area.`,
    "align.priority",
  );
}

/** Score from known seats. Core fit does not change when only the year changes. */
export function scoreYearAlignment(opts: {
  calendarYear: number;
  personalYear: number;
  bn: number;
  dn: number;
  nameRoot: number;
  nameCompound?: number;
  cycleLetter?: string | null;
  cycleNumber?: number | null;
}): YearAlignment {
  const bn = reduceToSingleDigit(opts.bn);
  const dn = reduceToSingleDigit(opts.dn);
  const nameRoot = reduceToSingleDigit(opts.nameRoot);
  const rawPy = opts.personalYear;
  const py = reduceToSingleDigit(rawPy);
  const nameDisplay = formatCompoundRoot(opts.nameCompound ?? nameRoot, nameRoot);
  const cycleLetter = opts.cycleLetter ?? null;
  const cycleNumber =
    opts.cycleNumber != null ? reduceToSingleDigit(opts.cycleNumber) : null;
  const pyMode = yearModeFor(py);
  const ctx = { bn, dn, nameRoot, nameDisplay, py, cycleLetter, cycleNumber };
  const careers = rankRows(CAREER_ROLES.map((role) => scoreRole(role, ctx)));
  const life = rankRows(LIFE_AREAS.map((role) => scoreRole(role, ctx)));
  const priorities = life.slice(0, 5);
  return {
    calendarYear: opts.calendarYear,
    personalYear: py,
    pyModeTitle: pyMode.title,
    pyModeVerb: pyMode.verb,
    cycleLetter,
    cycleNumber,
    bn,
    dn,
    nameDisplay,
    nameRoot,
    coreIntro: assertSafeCopy(
      `Core does not change when you step the year. Stars change the method, not who you are. Core fit uses BN + DN + Active NN.`,
      "align.coreIntro",
    ),
    yearIntro: assertSafeCopy(
      `${opts.calendarYear} — ${pyMode.title} year. Personal Year ${py}${
        cycleLetter && cycleNumber != null
          ? ` · Active Name Cycle ${cycleLetter}/${cycleNumber}`
          : ""
      }. Foundation stays BN ${bn} → DN ${dn}. Active NN ${nameDisplay}.`,
      "align.yearIntro",
    ),
    careers,
    life,
    priorities,
    priorityLine: priorityLine(priorities, pyMode.title),
    starKey: {
      core: "Who you are (BN + DN + Active NN). Does not move when you step the year.",
      year: "How to work this area now.",
      cycle: "Active first-name letter — how you show up this year.",
      whenTheyDiffer:
        "If the rows disagree, keep the work that fits you and change the method (Best approach). Lower year stars are not a signal to quit.",
    },
  };
}

export function buildYearAlignment(opts: {
  dob: string;
  natalName: string;
  calendarYear: number;
  bn: number;
  dn: number;
  nameRoot: number;
  nameCompound?: number;
  history?: unknown;
  preferredName?: string;
  yearAnchor?: WesternYearAnchor;
}): YearAlignment {
  const outlook = westernYearOutlook({
    dob: opts.dob,
    fullName: opts.natalName,
    anchor: opts.yearAnchor ?? "birthday",
    year: opts.calendarYear,
  });
  const cycle = nameCycleForYear({
    natalName: opts.natalName,
    dob: opts.dob,
    calendarYearUsed: outlook.calendarYearUsed,
    history: opts.history,
    preferredName: opts.preferredName,
    personalYear: outlook.number,
  });
  return scoreYearAlignment({
    calendarYear: outlook.calendarYearUsed,
    personalYear: outlook.number,
    bn: opts.bn,
    dn: opts.dn,
    nameRoot: opts.nameRoot,
    nameCompound: cycle?.nameCompound ?? opts.nameCompound,
    cycleLetter: cycle?.active.letter ?? null,
    cycleNumber: cycle?.active.value ?? null,
  });
}

export function yearBounds(dob: string): { min: number; max: number } {
  const { year } = parseDob(dob);
  return { min: year, max: year + 90 };
}
