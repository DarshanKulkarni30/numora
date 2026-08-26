import { reduceToSingleDigit } from "./dateNumbers";
import { plainJob, plainWatch } from "./layeredCopy";
import { LO_SHU_NUMBER_META } from "./loShuEffects";
import type { LoShuResult } from "./types";
import { DIGIT_SEASON } from "./yearRhythm";

export type PlaneId = "emotional" | "mental" | "practical";

export type PlaneScore = {
  id: PlaneId;
  label: string;
  numbers: number[];
  /** Raw frequency sum */
  score: number;
  /** 0–1 normalized vs max of three planes (min 1 to avoid /0) */
  normalized: number;
  level: "quiet" | "gentle" | "balanced" | "strong";
  present: number[];
  missing: number[];
};

export type StrengthEngine = {
  id: "will" | "action" | "determination";
  label: string;
  numbers: number[];
  /** 0–3 cells present */
  presentCount: number;
  status: "active" | "partial" | "quiet";
  strength: number;
  summary: string;
  /** Classic arrow name for guide links when status is active/quiet full */
  arrowName: string;
};

export type GrowthCatalyst = {
  number: number;
  keyword: string;
  title: string;
  actions: string[];
  summary: string;
};

export type ArchitectureLayer = {
  id: "core" | "operating" | "cognitive";
  label: string;
  plane: PlaneId;
  summary: string;
  traits: string[];
};

export type LoShuArchitecture = {
  planes: PlaneScore[];
  layers: ArchitectureLayer[];
  decisionFlow: string[];
  decisionFlowLabel: string;
  tension: {
    /** 0 = BN / inner world, 1 = DN / outer world */
    position: number;
    bn: number | null;
    dn: number | null;
    label: string;
    narrative: string;
  };
  /** What the loudest and quietest plane mean in practice, plus one job. */
  decisionFlowTakeaway: string;
  catalysts: GrowthCatalyst[];
  engines: StrengthEngine[];
  activeEngineCount: number;
  narrative: string;
  /** Same content as `narrative`, kept as separate sentences for rendering. */
  narrativeLines: string[];
  blueprint: {
    title: string;
    lines: string[];
  };
};

const PLANE_DEFS: {
  id: PlaneId;
  label: string;
  numbers: number[];
  flowVerb: string;
}[] = [
  {
    id: "emotional",
    label: "Emotional",
    numbers: [3, 5, 7],
    flowVerb: "Feel",
  },
  {
    id: "mental",
    label: "Mental",
    numbers: [4, 9, 2],
    flowVerb: "Think",
  },
  {
    id: "practical",
    label: "Practical",
    numbers: [8, 1, 6],
    flowVerb: "Act",
  },
];

const PLANE_HABIT: Record<
  PlaneId,
  { loud: string; quiet: string; job: string }
> = {
  emotional: {
    loud: "you read the mood first, and feeling usually decides",
    quiet: "checking how you feel about it is the step that gets skipped",
    job: "say out loud how you feel about it before you decide",
  },
  mental: {
    loud: "you plan first, and the plan usually decides",
    quiet: "writing the plan down is the step that gets skipped",
    job: "write the next three steps down before you start",
  },
  practical: {
    loud: "you move first, and doing usually decides",
    quiet: "actually starting is the step that gets postponed",
    job: "put one small first action in the calendar this week",
  },
};

const ENGINE_DEFS: {
  id: StrengthEngine["id"];
  label: string;
  numbers: number[];
  arrowName: string;
  summaryActive: string;
}[] = [
  {
    id: "will",
    label: "Feeling group (3–5–7)",
    numbers: [3, 5, 7],
    arrowName: "Arrow of Will (Emotional)",
    summaryActive: "Emotional resilience, intuition, and creative expression.",
  },
  {
    id: "action",
    label: "Doing group (8–1–6)",
    numbers: [8, 1, 6],
    arrowName: "Arrow of Action (Practical)",
    summaryActive: "Execution, initiative, and responsible care.",
  },
  {
    id: "determination",
    label: "Stay-with-it group (9–5–1)",
    numbers: [9, 5, 1],
    arrowName: "Arrow of Determination",
    summaryActive: "Purpose, stability, and drive to begin.",
  },
];

const CATALYST_ACTIONS: Record<number, string[]> = {
  1: [
    "Start one small task without waiting for perfect conditions",
    "Own a weekly initiative",
  ],
  2: [
    "Listen fully before deciding",
    "Share one decision with a partner",
    "Build a collaborative habit",
  ],
  3: ["Speak or write one idea daily", "Practice low-pressure creative output"],
  4: [
    "Plan the week in writing",
    "Document one recurring process",
    "Create a simple system",
  ],
  5: ["Add safe variety to the week", "Try one new experience on purpose"],
  6: ["Offer care with clear boundaries", "Complete one responsibility loop"],
  7: [
    "Protect quiet reflection time",
    "Study one theme without rushing to act",
  ],
  8: [
    "Set one measurable goal",
    "Review stewardship of time or resources",
  ],
  9: [
    "Finish a small cycle generously",
    "Widen perspective before judging",
  ],
};

function levelFromScore(score: number): PlaneScore["level"] {
  if (score === 0) return "quiet";
  if (score === 1) return "gentle";
  if (score === 2) return "balanced";
  return "strong";
}

function planeLayerCopy(
  plane: PlaneScore,
  kind: ArchitectureLayer["id"],
): ArchitectureLayer {
  const presentTraits = plane.present.map(
    (n) => LO_SHU_NUMBER_META[n]?.trait ?? String(n),
  );
  const missingTraits = plane.missing.map(
    (n) => LO_SHU_NUMBER_META[n]?.trait ?? String(n),
  );

  let summary: string;
  if (kind === "core") {
    summary =
      plane.score === 0
        ? "The feeling group is quiet on this grid. Depth comes from practised insight and gentle expression, not from an automatic pattern."
        : `Core self leans on ${presentTraits.join(", ") || "emotional themes"}${
            missingTraits.length
              ? `; lighter on ${missingTraits.join(", ")}`
              : ""
          }. When this group is active you read as intuitive, reflective, and creative.`;
  } else if (kind === "operating") {
    summary =
      plane.score === 0
        ? "The doing group is quiet. Execution needs a written first step, not more intention."
        : `Operating style leans on ${presentTraits.join(", ") || "practical themes"}${
            missingTraits.length
              ? `; less automatic on ${missingTraits.join(", ")}`
              : ""
          }. When this group is strong you start and build.`;
  } else {
    summary =
      plane.score === 0
        ? "The thinking group is quiet. Thinking stays empathic and unstructured until you practise a system."
        : `Thinking leans on ${presentTraits.join(", ") || "mental themes"}${
            missingTraits.length
              ? `, with ${missingTraits.join(", ")} as skills to practise rather than defaults`
              : ""
          }. Thinking is moral and compassionate; structure is a learnable skill when 4 or 2 is light.`;
  }

  return {
    id: kind,
    label:
      kind === "core"
        ? "Core self (emotional)"
        : kind === "operating"
          ? "Operating system (practical)"
          : "Cognitive framework (mental)",
    plane: plane.id,
    summary,
    traits: presentTraits,
  };
}

function buildCatalysts(missing: number[]): GrowthCatalyst[] {
  return missing.map((n) => {
    const keyword = LO_SHU_NUMBER_META[n]?.trait ?? `Number ${n}`;
    const actions = CATALYST_ACTIONS[n] ?? [
      LO_SHU_NUMBER_META[n]?.growth ?? "practice balanced habits",
    ];
    return {
      number: n,
      keyword,
      title: keyword,
      actions,
      summary: `Digit ${n} is quiet on your date grid. Practise ${keyword.toLowerCase()} with one small habit this week. A quiet digit is not a fault.`,
    };
  });
}

function tensionNarrative(
  bn: number | null,
  dn: number | null,
  position: number,
): { label: string; narrative: string } {
  if (bn == null || dn == null) {
    return {
      label: "Life-path tension",
      narrative:
        "BN and DN are not both available on this grid—tension reads mainly from plane balance.",
    };
  }
  if (bn === dn) {
    return {
      label: `BN ${bn} ≈ DN ${dn}`,
      narrative: `Birth-day number and long-path number are both ${bn}. That habit shows up a lot. Try one finish or one pause so it does not become the whole self. The slider is feeling-digits vs doing-digits on the grid — not a score of this ${bn}.`,
    };
  }
  const bnTrait = LO_SHU_NUMBER_META[bn]?.trait ?? String(bn);
  const dnTrait = LO_SHU_NUMBER_META[dn]?.trait ?? String(dn);
  const lean =
    position < 0.4
      ? "leans toward the inner world (BN)"
      : position > 0.6
        ? "leans toward outer expression (DN)"
        : "sits near the middle of the BN–DN span";
  return {
    label: `BN ${bn} ↔ DN ${dn}`,
    narrative: `Birth-day ${bn} (${bnTrait.toLowerCase()}) and long path ${dn} (${dnTrait.toLowerCase()}) are different. This chart ${lean}. The slider is a rough mix of those two plus feeling vs doing digits — not a percentage of tension.`,
  };
}

/** Pure personality-architecture layer on top of an existing Lo Shu result. */
export function buildLoShuArchitecture(loShu: LoShuResult): LoShuArchitecture {
  const grid = loShu.grid;

  const rawPlanes = PLANE_DEFS.map((p) => {
    const score = p.numbers.reduce((s, n) => s + (grid[n] ?? 0), 0);
    const present = p.numbers.filter((n) => (grid[n] ?? 0) > 0);
    const missing = p.numbers.filter((n) => (grid[n] ?? 0) === 0);
    return { ...p, score, present, missing, level: levelFromScore(score) };
  });
  const maxScore = Math.max(1, ...rawPlanes.map((p) => p.score));
  const planes: PlaneScore[] = rawPlanes.map((p) => ({
    id: p.id,
    label: p.label,
    numbers: p.numbers,
    score: p.score,
    normalized: p.score / maxScore,
    level: p.level,
    present: p.present,
    missing: p.missing,
  }));

  const byId = Object.fromEntries(planes.map((p) => [p.id, p])) as Record<
    PlaneId,
    PlaneScore
  >;

  const layers: ArchitectureLayer[] = [
    planeLayerCopy(byId.emotional, "core"),
    planeLayerCopy(byId.practical, "operating"),
    planeLayerCopy(byId.mental, "cognitive"),
  ];

  const ranked = [...PLANE_DEFS].sort(
    (a, b) => byId[b.id].score - byId[a.id].score || a.id.localeCompare(b.id),
  );
  const decisionFlow = ranked.map((p) => p.flowVerb);
  const decisionFlowLabel = decisionFlow.join(" → ");

  const loudPlane = byId[ranked[0]!.id];
  const quietPlane = byId[ranked[ranked.length - 1]!.id];
  const loudHabit = PLANE_HABIT[loudPlane.id];
  const quietHabit = PLANE_HABIT[quietPlane.id];
  const decisionFlowTakeaway =
    loudPlane.id === quietPlane.id || loudPlane.score === quietPlane.score
      ? `All three planes are close on this grid, so no single step leads. Pick the order on purpose: ${quietHabit.job}.`
      : `Loudest is ${loudPlane.label.toLowerCase()} (${
          loudPlane.present.length
            ? `${loudPlane.present.join(", ")} filled`
            : "carried by the centre numbers"
        }) — ${loudHabit.loud}. Quietest is ${quietPlane.label.toLowerCase()} (${
          quietPlane.missing.length
            ? `${quietPlane.missing.join(", ")} quiet`
            : "the lightest of the three"
        }) — ${quietHabit.quiet}. Try: ${quietHabit.job}.`;

  const engines: StrengthEngine[] = ENGINE_DEFS.map((e) => {
    const presentCount = e.numbers.filter((n) => (grid[n] ?? 0) > 0).length;
    const strength =
      e.numbers.reduce((s, n) => s + (grid[n] ?? 0), 0) /
      Math.max(1, e.numbers.length);
    let status: StrengthEngine["status"] = "quiet";
    if (presentCount === 3) status = "active";
    else if (presentCount >= 1) status = "partial";
    const summary =
      status === "active"
        ? e.summaryActive
        : status === "partial"
          ? `Partially lit (${e.numbers.filter((n) => (grid[n] ?? 0) > 0).join("–")} present)—may still support ${e.label.toLowerCase()} when practiced.`
          : `None of ${e.numbers.join(", ")} appear in your birth date, so ${e.label.toLowerCase()} is a skill you build deliberately rather than one that comes automatically. Missing digits are practice areas, not permanent gaps.`;
    return {
      id: e.id,
      label: e.label,
      numbers: e.numbers,
      presentCount,
      status,
      strength,
      summary,
      arrowName: e.arrowName,
    };
  });

  const activeEngineCount = engines.filter((e) => e.status === "active").length;
  const catalysts = buildCatalysts(loShu.missing_numbers);

  const bn = loShu.birth_number ?? null;
  const dn = loShu.destiny_number ?? null;
  let position = 0.5;
  if (bn != null && dn != null && bn !== dn) {
    const emotionalShare = byId.emotional.normalized;
    const practicalShare = byId.practical.normalized;
    const planePull = (practicalShare - emotionalShare + 1) / 2;
    const bnInnerBias = [2, 4, 7].includes(bn) ? 0.35 : 0.45;
    const dnOuterBias = [1, 3, 5, 9].includes(dn) ? 0.65 : 0.55;
    position = Math.min(
      1,
      Math.max(0, ((bnInnerBias + dnOuterBias) / 2) * 0.45 + planePull * 0.55),
    );
  } else {
    position =
      (byId.practical.normalized - byId.emotional.normalized + 1) / 2;
  }

  const tensionMeta = tensionNarrative(bn, dn, position);

  const engineLine =
    activeEngineCount === 3
      ? "All three digit-groups on this grid are filled. Rest so the automatic habits do not run the whole week."
      : activeEngineCount === 0
        ? "No digit-group is fully filled. Use the quiet digits as practice, not as a flaw."
        : `${activeEngineCount} digit-group${activeEngineCount === 1 ? "" : "s"} fully filled, and ${engines.filter((e) => e.status === "partial").length} partly filled.`;

  const narrativeLines = [
    `Decision flow may read as ${decisionFlowLabel}. ${decisionFlowTakeaway}`,
    ...layers.map((l) => l.summary),
    tensionMeta.narrative,
    engineLine,
    catalysts.length
      ? `Quiet digits to practise: ${catalysts.map((c) => c.keyword).join(", ")}. Pick one, not all five.`
      : "No missing-number catalysts—distribution looks broad across the Lo Shu grid.",
  ];
  const narrative = narrativeLines.join(" ");

  const blueprint = {
    title: "Lo Shu personality blueprint",
    lines: [
      `Planes — Emotional ${byId.emotional.level} (${byId.emotional.score}), Mental ${byId.mental.level} (${byId.mental.score}), Practical ${byId.practical.level} (${byId.practical.score}).`,
      `Decision flow: ${decisionFlowLabel}.`,
      `Life-path tension: ${tensionMeta.label}.`,
      ...layers.map((l) => `${l.label}: ${l.summary}`),
      ...engines.map(
        (e) =>
          `${e.label} [${e.status}]: ${e.numbers.join("–")} — ${e.summary}`,
      ),
      ...catalysts.map(
        (c) =>
          `${c.title}: ${c.summary} Practice: ${c.actions.join("; ")}.`,
      ),
      engineLine,
    ],
  };

  return {
    planes,
    layers,
    decisionFlow,
    decisionFlowLabel,
    tension: {
      position,
      bn,
      dn,
      label: tensionMeta.label,
      narrative: tensionMeta.narrative,
    },
    decisionFlowTakeaway,
    catalysts,
    engines,
    activeEngineCount,
    narrative,
    narrativeLines,
    blueprint,
  };
}

/** Compare two architectures for dual-chart UI. */
export function compareLoShuArchitectures(
  a: LoShuArchitecture,
  b: LoShuArchitecture,
): {
  sharedActiveEngines: string[];
  onlyAEngines: string[];
  onlyBEngines: string[];
  sharedCatalystKeywords: string[];
  onlyACatalysts: string[];
  onlyBCatalysts: string[];
  tensionDelta: number;
  summary: string;
} {
  const activeA = new Set(
    a.engines.filter((e) => e.status === "active").map((e) => e.label),
  );
  const activeB = new Set(
    b.engines.filter((e) => e.status === "active").map((e) => e.label),
  );
  const sharedActiveEngines = [...activeA].filter((x) => activeB.has(x));
  const onlyAEngines = [...activeA].filter((x) => !activeB.has(x));
  const onlyBEngines = [...activeB].filter((x) => !activeA.has(x));

  const catA = new Set(a.catalysts.map((c) => c.keyword));
  const catB = new Set(b.catalysts.map((c) => c.keyword));
  const sharedCatalystKeywords = [...catA].filter((x) => catB.has(x));
  const onlyACatalysts = [...catA].filter((x) => !catB.has(x));
  const onlyBCatalysts = [...catB].filter((x) => !catA.has(x));
  const tensionDelta = Math.round(
    (b.tension.position - a.tension.position) * 100,
  );

  const summary = [
    sharedActiveEngines.length
      ? `Shared active engines: ${sharedActiveEngines.join(", ")}.`
      : "No shared fully active engines.",
    onlyAEngines.length || onlyBEngines.length
      ? `Engine contrast — A only: ${onlyAEngines.join(", ") || "—"}; B only: ${onlyBEngines.join(", ") || "—"}.`
      : null,
    sharedCatalystKeywords.length
      ? `Shared growth catalysts: ${sharedCatalystKeywords.join(", ")}.`
      : null,
    `Tension bar delta (B − A): ${tensionDelta > 0 ? "+" : ""}${tensionDelta} toward outer expression.`,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    sharedActiveEngines,
    onlyAEngines,
    onlyBEngines,
    sharedCatalystKeywords,
    onlyACatalysts,
    onlyBCatalysts,
    tensionDelta,
    summary,
  };
}

/** JSON-serializable blueprint for download. */
export function loShuBlueprintJson(
  loShu: LoShuResult,
  architecture: LoShuArchitecture,
  meta?: { name?: string; dateOfBirth?: string },
) {
  return {
    title: architecture.blueprint.title,
    generated_at: new Date().toISOString(),
    person: meta ?? {},
    grid: loShu.grid,
    present_numbers: loShu.present_numbers,
    missing_numbers: loShu.missing_numbers,
    birth_number: loShu.birth_number ?? null,
    destiny_number: loShu.destiny_number ?? null,
    architecture: {
      decision_flow: architecture.decisionFlowLabel,
      tension: architecture.tension,
      planes: architecture.planes,
      layers: architecture.layers,
      engines: architecture.engines,
      catalysts: architecture.catalysts,
      narrative: architecture.narrative,
    },
    blueprint_lines: architecture.blueprint.lines,
    disclaimer:
      "Belief-based numerology for reflection only—not medical, financial, or legal advice.",
  };
}

export type LoShuYearCard = {
  year: number;
  py: number;
  digit: number;
  isCurrent: boolean;
  isQuietCell: boolean;
  phase: string;
  badge: string;
  meaning: string;
  tryLine: string;
  watchLine: string;
  quietNote: string | null;
};

function capJob(job: string): string {
  return job.charAt(0).toUpperCase() + job.slice(1);
}

/** One calendar-year card on the Lo Shu timeline: Personal Year job + quiet-cell note. */
export function loShuYearCardCopy(opts: {
  year: number;
  py: number;
  missing: number[];
  asOfYear: number;
}): LoShuYearCard {
  const digit = reduceToSingleDigit(opts.py);
  const season = DIGIT_SEASON[digit] ?? DIGIT_SEASON[1];
  const isCurrent = opts.year === opts.asOfYear;
  const isQuietCell = opts.missing.includes(digit);
  const master = opts.py !== digit;
  const meaning = master
    ? `A ${season.phase} year. Personal Year ${opts.py} is kept as ${opts.py} and works like a ${digit}. ${season.scan}`
    : `A ${season.phase} year. ${season.scan}`;
  const quietNote = isQuietCell
    ? `This year number matches a quiet cell on your date grid. That skill is usually light for you, so this is a year to practise it: ${capJob(plainJob(digit))}. Not a special fate.`
    : null;
  const when =
    opts.year === opts.asOfYear
      ? "This year"
      : opts.year === opts.asOfYear - 1
        ? "Last year"
        : opts.year === opts.asOfYear + 1
          ? "Next year"
          : "Personal year";
  return {
    year: opts.year,
    py: opts.py,
    digit,
    isCurrent,
    isQuietCell,
    phase: season.phase,
    badge: isQuietCell ? "Quiet cell" : when,
    meaning,
    tryLine: capJob(plainJob(master ? opts.py : digit)),
    watchLine: capJob(plainWatch(master ? opts.py : digit)),
    quietNote,
  };
}
