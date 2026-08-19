/**
 * Insight tiles for Detailed reading — scannable cards, not paragraph walls.
 * Reflective only: not events, health, legal, or destiny claims.
 */

import { blurbForTopic, type NumberGuideTopic } from "@/lib/guides/numberMeanings";
import { associationsForNumber } from "@/lib/numerology/associations";
import { synergyKind } from "@/lib/numerology/auraIdentity";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import type { GrowthArea } from "@/lib/numerology/growthAreas";
import { LO_SHU_NUMBER_META } from "@/lib/numerology/loShuEffects";
import { CORE_TRAIT, coreTraitFor } from "@/lib/numerology/meanings";
import { assertSafeCopy } from "@/lib/numerology/safety";
import type {
  LoShuResult,
  NumerologyReport,
  NumerologySnapshot,
} from "@/lib/numerology/types";

export type InsightGeometry =
  | "hexagon"
  | "triangle"
  | "crescent"
  | "wave"
  | "lotus"
  | "square"
  | "mandala"
  | "grid"
  | "arrow"
  | "circles"
  | "speech"
  | "hourglass"
  | "ring"
  | "calendar"
  | "compass";

export type InsightConnection = {
  pair: string;
  body: string;
  kind: "aligned" | "complementary" | "contrasting";
};

export type InsightCardModel = {
  key: string;
  systemTag: string;
  label: string;
  number: string;
  keyword: string;
  glyph: string;
  geometry: InsightGeometry;
  palette: string[];
  core: string;
  showsUp: string;
  growth: string;
  narrative: string;
  dots: [boolean, boolean, boolean];
  related: { label: string; value: string }[];
  connections: InsightConnection[];
  strengths: string[];
  growthTies: { title: string; body: string }[];
};

const GLYPH: Record<number, string> = {
  1: "▲",
  2: "☾",
  3: "△",
  4: "□",
  5: "◎",
  6: "❦",
  7: "☽",
  8: "∞",
  9: "◉",
  11: "✦",
  22: "⬡",
  33: "❀",
};

const NARRATIVE: Record<number, string> = {
  1: "You move with a pioneering edge — initiative as a quiet compass.",
  2: "You move with attunement — cooperation as a way of seeing.",
  3: "Your voice is a vehicle — creative, warm, and imaginative.",
  4: "You build in measured steps — structure as devotion.",
  5: "You learn by moving — freedom with a chosen craft.",
  6: "You walk through life with a steady devotion to harmony and care.",
  7: "Beneath everything, you seek meaning.",
  8: "You take stewardship seriously — power as accountability.",
  9: "You complete cycles with a wide, compassionate view.",
  11: "Inspiration wants a grounded daily rhythm beside it.",
  22: "Large vision asks for patient, practical building.",
  33: "Care becomes teaching when it includes you too.",
};

const SHOW_UP: Record<string, (trait: string) => string> = {
  "life-path": (t) =>
    `You thrive when ${t.toLowerCase()} can shape the long walk of ordinary choices.`,
  "birth-day": (t) =>
    `Day to day, ${t.toLowerCase()} is an innate talent people may notice first.`,
  expression: (t) => `Your voice and craft often carry ${t.toLowerCase()}.`,
  "soul-urge": (t) =>
    `Underneath the social face, you seek ${t.toLowerCase()}.`,
  personality: (t) =>
    `Rooms often meet ${t.toLowerCase()} before they know the rest of you.`,
  maturity: (t) => `Later chapters may ripen toward ${t.toLowerCase()}.`,
  "chaldean-name": (t) =>
    `This spelling’s vibration often reads as ${t.toLowerCase()}.`,
  "vedic-psychic": (t) =>
    `First reactions often lean toward ${t.toLowerCase()}.`,
  "vedic-destiny": (t) =>
    `The longer Vedic path often holds ${t.toLowerCase()}.`,
  "vedic-name": (t) =>
    `Name tone in this system often carries ${t.toLowerCase()}.`,
  "lo-shu-present": (t) =>
    `On the grid this tone is lit — ${t.toLowerCase()} shows as a present pattern.`,
  "lo-shu-missing": (t) =>
    `This cell is quiet — ${t.toLowerCase()} may be a practice, not a missing self.`,
  "core-personality": (t) =>
    `Across systems, ${t.toLowerCase()} is a repeating atmosphere in this reading.`,
};

function digitOf(value: string | number): number {
  const n = Number(value);
  if (n === 11 || n === 22 || n === 33) return n;
  return Number.isFinite(n) ? reduceToSingleDigit(n) : 1;
}

function glyphFor(value: string | number): string {
  const n = Number(value);
  return GLYPH[n] ?? GLYPH[digitOf(value)] ?? "○";
}

function paletteFor(value: string | number): string[] {
  const colors = associationsForNumber(digitOf(value)).colors.map((c) => c.hex);
  const pad = colors[0] ?? "#183a6b";
  return [colors[0] ?? pad, colors[1] ?? pad, colors[2] ?? pad];
}

function snapshotHits(snap: NumerologySnapshot, value: string | number): number {
  const d = reduceToSingleDigit(digitOf(value));
  const pool = [
    snap.life_path,
    snap.birth_day,
    snap.expression_number,
    snap.soul_urge_number,
    snap.personality_number,
    snap.vedic_psychic,
    snap.vedic_destiny,
    snap.vedic_name,
    snap.chaldean_name_number,
  ].map((v) => reduceToSingleDigit(Number(v)));
  return pool.filter((n) => n === d).length;
}

function relatedFromSnap(
  snap: NumerologySnapshot,
  selfLabel: string,
): { label: string; value: string }[] {
  const all = [
    { label: "Life Path", value: snap.life_path },
    { label: "Expression", value: snap.expression_number },
    { label: "Soul Urge", value: snap.soul_urge_number },
    { label: "Personality", value: snap.personality_number },
    { label: "Psychic", value: snap.vedic_psychic },
    { label: "Destiny", value: snap.vedic_destiny },
    { label: "Name", value: snap.vedic_name },
  ];
  return all.filter((row) => row.label !== selfLabel).slice(0, 4);
}

function connectionBody(
  aLabel: string,
  aVal: string,
  bLabel: string,
  bVal: string,
): InsightConnection {
  const a = digitOf(aVal);
  const b = digitOf(bVal);
  const ar = reduceToSingleDigit(a);
  const br = reduceToSingleDigit(b);
  const kind = synergyKind(ar, br);
  const ta = coreTraitFor(a).toLowerCase();
  const tb = coreTraitFor(b).toLowerCase();
  let body: string;
  if (kind === "aligned") {
    body = `Shared ${ar} — ${ta} rhyming across layers, not a guarantee of ease.`;
  } else if (kind === "complementary") {
    body = `${ta} meeting ${tb} — a supportive blend to notice.`;
  } else {
    body = `${ta} and ${tb} ask for patience — useful contrast, not a flaw.`;
  }
  return {
    pair: `${aLabel} ${aVal} ↔ ${bLabel} ${bVal}`,
    body: assertSafeCopy(body, "insight.connection"),
    kind,
  };
}

function connectionsFor(
  label: string,
  value: string,
  snap: NumerologySnapshot,
): InsightConnection[] {
  const others: { label: string; value: string }[] = [
    { label: "Life Path", value: snap.life_path },
    { label: "Expression", value: snap.expression_number },
    { label: "Soul Urge", value: snap.soul_urge_number },
    { label: "Personality", value: snap.personality_number },
    { label: "Destiny", value: snap.vedic_destiny },
  ].filter((row) => row.label !== label);
  return others.slice(0, 3).map((row) =>
    connectionBody(label, value, row.label, row.value),
  );
}

function growthTiesFor(
  label: string,
  value: string | number,
  loShu: LoShuResult | undefined,
  areas: GrowthArea[],
): { title: string; body: string }[] {
  const n = digitOf(value);
  const reduced = reduceToSingleDigit(n);
  const meta = LO_SHU_NUMBER_META[reduced];
  const out: { title: string; body: string }[] = [];
  if (meta) {
    const missing = loShu?.missing_numbers.includes(reduced) ?? false;
    out.push({
      title: `${meta.trait} catalyst`,
      body: missing
        ? `Quiet on this Lo Shu grid — Growth Mode practice around ${meta.growth}.`
        : `Keep ${meta.growth} in the mix so this tone stays supple.`,
    });
  }
  for (const area of areas) {
    const hit = area.sources.some(
      (s) =>
        s.toLowerCase().includes(label.toLowerCase()) ||
        s.includes(String(value)) ||
        s.includes(`catalyst ${reduced}`),
    );
    if (!hit) continue;
    if (out.some((t) => t.title === area.title)) continue;
    out.push({ title: area.title, body: area.suggestion });
    if (out.length >= 3) break;
  }
  return out.slice(0, 3).map((t) => ({
    title: assertSafeCopy(t.title, "insight.growthTitle"),
    body: assertSafeCopy(t.body, "insight.growthBody"),
  }));
}

export function buildInsightCard(opts: {
  topic: NumberGuideTopic | "lo-shu-present" | "lo-shu-missing" | "core-personality";
  label: string;
  value: string | number;
  systemTag: string;
  geometry: InsightGeometry;
  snap: NumerologySnapshot;
  loShu?: LoShuResult;
  growthAreas?: GrowthArea[];
  meaningFallback?: string;
}): InsightCardModel {
  const value = String(opts.value);
  const n = Number(value);
  const trait = CORE_TRAIT[n] ?? coreTraitFor(n);
  const topicKey =
    opts.topic === "lo-shu-present" ||
    opts.topic === "lo-shu-missing" ||
    opts.topic === "core-personality"
      ? null
      : opts.topic;
  const blurb = topicKey ? blurbForTopic(topicKey, value) : null;
  const loMeta = LO_SHU_NUMBER_META[reduceToSingleDigit(digitOf(value))];
  const core =
    blurb?.theme ??
    (opts.topic.startsWith("lo-shu") && loMeta
      ? `${loMeta.trait} — ${loMeta.theme}.`
      : opts.meaningFallback?.split(/(?<=\.)\s+/)[0] ?? trait);
  const showFn = SHOW_UP[opts.topic] ?? SHOW_UP["life-path"];
  const showsUp = showFn(trait);
  const growth =
    blurb?.practice ??
    (opts.topic === "lo-shu-missing" && loMeta
      ? `Invite ${loMeta.growth} — a development area, not a deficit.`
      : `Keep ${trait.toLowerCase()} in balance — practice, not a flaw to fix.`);
  const hits = snapshotHits(opts.snap, value);
  const dots: [boolean, boolean, boolean] = [
    true,
    hits >= 2,
    hits >= 3 || Boolean(opts.loShu?.missing_numbers.includes(reduceToSingleDigit(digitOf(value)))),
  ];
  const narrative =
    NARRATIVE[n] ?? NARRATIVE[reduceToSingleDigit(digitOf(value))] ?? core;

  return {
    key: `${opts.topic}-${value}`,
    systemTag: opts.systemTag,
    label: opts.label,
    number: value,
    keyword: trait,
    glyph: glyphFor(value),
    geometry: opts.geometry,
    palette: paletteFor(value),
    core: assertSafeCopy(core, "insight.core"),
    showsUp: assertSafeCopy(showsUp, "insight.showsUp"),
    growth: assertSafeCopy(growth, "insight.growth"),
    narrative: assertSafeCopy(narrative, "insight.narrative"),
    dots,
    related: relatedFromSnap(opts.snap, opts.label),
    connections: connectionsFor(opts.label, value, opts.snap),
    strengths: (blurb?.strengths ?? (loMeta ? [loMeta.trait, loMeta.theme] : [trait])).slice(
      0,
      3,
    ),
    growthTies: growthTiesFor(
      opts.label,
      value,
      opts.loShu,
      opts.growthAreas ?? [],
    ),
  };
}

export function buildDetailedInsightCards(report: NumerologyReport): Record<
  string,
  InsightCardModel[]
> {
  const snap = report.numerology_snapshot;
  const loShu = report.lo_shu;
  const growthAreas = report.growth_areas ?? [];
  const py = report.pythagorean;

  const pythagorean = [
    {
      topic: "life-path" as const,
      label: "Life Path",
      value: snap.life_path,
      geometry: "hexagon" as const,
      meaning: py.life_path.meaning,
    },
    {
      topic: "birth-day" as const,
      label: "Birth Day",
      value: snap.birth_day,
      geometry: "triangle" as const,
      meaning: py.birth_day.meaning,
    },
    {
      topic: "expression" as const,
      label: "Expression",
      value: snap.expression_number,
      geometry: "triangle" as const,
      meaning: py.expression.meaning,
    },
    {
      topic: "soul-urge" as const,
      label: "Soul Urge",
      value: snap.soul_urge_number,
      geometry: "crescent" as const,
      meaning: py.soul_urge.meaning,
    },
    {
      topic: "personality" as const,
      label: "Personality",
      value: snap.personality_number,
      geometry: "wave" as const,
      meaning: py.personality.meaning,
    },
    {
      topic: "maturity" as const,
      label: "Maturity",
      value: snap.maturity_number,
      geometry: "lotus" as const,
      meaning: py.maturity.meaning,
    },
  ].map((row) =>
    buildInsightCard({
      topic: row.topic,
      label: row.label,
      value: row.value,
      systemTag: "Pythagorean",
      geometry: row.geometry,
      snap,
      loShu,
      growthAreas,
      meaningFallback: row.meaning,
    }),
  );

  const chaldean = [
    buildInsightCard({
      topic: "chaldean-name",
      label: "Name number",
      value: snap.chaldean_name_number,
      systemTag: "Chaldean",
      geometry: "square",
      snap,
      loShu,
      growthAreas,
      meaningFallback: report.chaldean.analysis,
    }),
  ];

  const vedic = [
    {
      topic: "vedic-psychic" as const,
      label: "Psychic",
      value: snap.vedic_psychic,
      meaning: report.vedic.psychic_number.meaning,
    },
    {
      topic: "vedic-destiny" as const,
      label: "Destiny",
      value: snap.vedic_destiny,
      meaning: report.vedic.destiny_number.meaning,
    },
    {
      topic: "vedic-name" as const,
      label: "Name",
      value: snap.vedic_name,
      meaning: report.vedic.name_number.meaning,
    },
  ].map((row) =>
    buildInsightCard({
      topic: row.topic,
      label: row.label,
      value: row.value,
      systemTag: "Vedic",
      geometry: "mandala",
      snap,
      loShu,
      growthAreas,
      meaningFallback: row.meaning,
    }),
  );

  const present = [...report.lo_shu.repeated_numbers]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  const presentNums = present.length
    ? present.map((r) => r.number)
    : report.lo_shu.present_numbers.slice(0, 3);
  const loShuCards = [
    ...presentNums.map((n) =>
      buildInsightCard({
        topic: "lo-shu-present",
        label: `Grid ${n}`,
        value: n,
        systemTag: "Lo Shu",
        geometry: "grid",
        snap,
        loShu,
        growthAreas,
      }),
    ),
    ...report.lo_shu.missing_numbers.slice(0, 3).map((n) =>
      buildInsightCard({
        topic: "lo-shu-missing",
        label: `Quiet ${n}`,
        value: n,
        systemTag: "Lo Shu",
        geometry: "grid",
        snap,
        loShu,
        growthAreas,
      }),
    ),
  ];

  const core = [
    buildInsightCard({
      topic: "core-personality",
      label: "Core atmosphere",
      value: snap.life_path,
      systemTag: "Core",
      geometry: "lotus",
      snap,
      loShu,
      growthAreas,
      meaningFallback: report.personality.core_personality,
    }),
  ];

  function softCard(opts: {
    key: string;
    systemTag: string;
    label: string;
    number: string;
    keyword: string;
    glyph: string;
    geometry: InsightGeometry;
    core: string;
    showsUp: string;
    growth: string;
    narrative: string;
    related?: { label: string; value: string }[];
    strengths?: string[];
  }): InsightCardModel {
    const value = opts.number;
    return {
      key: opts.key,
      systemTag: opts.systemTag,
      label: opts.label,
      number: value,
      keyword: opts.keyword,
      glyph: opts.glyph,
      geometry: opts.geometry,
      palette: paletteFor(value === "—" ? snap.life_path : value),
      core: assertSafeCopy(opts.core, "insight.soft.core"),
      showsUp: assertSafeCopy(opts.showsUp, "insight.soft.showsUp"),
      growth: assertSafeCopy(opts.growth, "insight.soft.growth"),
      narrative: assertSafeCopy(opts.narrative, "insight.soft.narrative"),
      dots: [true, true, true],
      related: opts.related ?? relatedFromSnap(snap, opts.label),
      connections: [
        connectionBody("Life Path", snap.life_path, "Expression", snap.expression_number),
        connectionBody("Life Path", snap.life_path, "Destiny", snap.vedic_destiny),
      ],
      strengths: (opts.strengths ?? report.strengths.slice(0, 3)).map((s) =>
        assertSafeCopy(s, "insight.soft.strength"),
      ),
      growthTies: growthTiesFor("Life Path", snap.life_path, loShu, growthAreas),
    };
  }

  const firstSentence = (text: string) =>
    text.split(/(?<=\.)\s+/).filter(Boolean)[0]?.trim() ?? text.slice(0, 140);

  const strengths = [
    softCard({
      key: "strengths",
      systemTag: "Strengths",
      label: "At a glance",
      number: snap.life_path,
      keyword: coreTraitFor(snap.life_path),
      glyph: "✦",
      geometry: "lotus",
      core: "Gifts that showed up across this reading’s banks and charts.",
      showsUp: report.strengths.slice(0, 3).join(" · ") || "Steady reflective strengths.",
      growth: "Let strengths stay soft — overuse can harden into a blind spot.",
      narrative: "Your gifts work best when they serve care, not performance.",
      strengths: report.strengths.slice(0, 5),
    }),
  ];

  const growth = [
    softCard({
      key: "growth",
      systemTag: "Growth",
      label: "Opportunities",
      number: snap.personal_year,
      keyword: "Practice",
      glyph: "→",
      geometry: "compass",
      core: "Themes inviting patient skill — not flaws to erase.",
      showsUp:
        report.growth_opportunities.slice(0, 2).join(" ") ||
        "Growth Mode catalysts above name the live practice list.",
      growth:
        report.growth_areas?.[0]?.actions?.[0] ??
        "Pick one micro-practice for seven days, then review.",
      narrative: "Growth is a pathway of small durable habits, not a verdict.",
      strengths: report.growth_opportunities.slice(0, 3),
    }),
  ];

  const career = [
    softCard({
      key: "career",
      systemTag: "Career",
      label: "Work tone",
      number: snap.expression_number,
      keyword: coreTraitFor(snap.expression_number),
      glyph: "▲",
      geometry: "arrow",
      core: firstSentence(report.personality.career_style),
      showsUp: `Expression ${snap.expression_number} and Life Path ${snap.life_path} shape how effort wants to land.`,
      growth: "Choose roles that reward craft and recovery — not endless proving.",
      narrative: firstSentence(report.personality.career_style),
      related: [
        { label: "Expression", value: snap.expression_number },
        { label: "Life Path", value: snap.life_path },
        { label: "Destiny", value: snap.vedic_destiny },
      ],
    }),
  ];

  const relationships = [
    softCard({
      key: "relationships",
      systemTag: "Relationships",
      label: "Closeness",
      number: snap.soul_urge_number,
      keyword: coreTraitFor(snap.soul_urge_number),
      glyph: "○○",
      geometry: "circles",
      core: firstSentence(report.personality.relationship_style),
      showsUp: `Soul Urge ${snap.soul_urge_number} meets Personality ${snap.personality_number} in how closeness starts.`,
      growth: "Name one need clearly before agreeing to shared plans.",
      narrative: firstSentence(report.personality.relationship_style),
    }),
  ];

  const communication = [
    softCard({
      key: "communication",
      systemTag: "Communication",
      label: "Voice",
      number: snap.personality_number,
      keyword: coreTraitFor(snap.personality_number),
      glyph: "◎",
      geometry: "speech",
      core: firstSentence(report.personality.communication_style),
      showsUp: `Outer face ${snap.personality_number} colors first impressions and messaging pace.`,
      growth: "One clarifying question before you defend a position.",
      narrative: firstSentence(report.personality.communication_style),
    }),
  ];

  const ageGuidance = [
    softCard({
      key: "age-guidance",
      systemTag: "Age",
      label: report.age_guidance.category,
      number: String(report.person.age),
      keyword: "Chapter",
      glyph: "◇",
      geometry: "hourglass",
      core: firstSentence(report.age_guidance.guidance),
      showsUp: `Age ${report.person.age} · Life Path ${snap.life_path} as the long walk behind this chapter.`,
      growth: "Match ambition to season — Personal Year and Month set pace.",
      narrative: firstSentence(report.age_guidance.guidance),
      related: [
        { label: "Life Path", value: snap.life_path },
        { label: "Year", value: snap.personal_year },
        { label: "Month", value: snap.personal_month },
      ],
    }),
  ];

  const personalYear = [
    softCard({
      key: "personal-year",
      systemTag: "Timing",
      label: "Personal Year",
      number: snap.personal_year,
      keyword: report.personal_year.nature || coreTraitFor(snap.personal_year),
      glyph: "◎",
      geometry: "ring",
      core: report.personal_year.theme,
      showsUp: report.personal_year.land || report.personal_year.theme,
      growth: report.personal_year.advice,
      narrative: report.personal_year.theme,
      related: [
        { label: "Month", value: snap.personal_month },
        { label: "Life Path", value: snap.life_path },
      ],
    }),
  ];

  const projectedYear = report.projected_year
    ? [
        softCard({
          key: "projected-year",
          systemTag: "Year Outlook",
          label: "Birthday cycle",
          number: String(report.projected_year.number),
          keyword: report.projected_year.planet || "Outlook",
          glyph: "♄",
          geometry: "ring",
          core: report.projected_year.theme,
          showsUp: `Outlook ${report.projected_year.number} for ${
            report.projected_year.range_label ??
            report.projected_year.calendar_year
          }.`,
          growth: report.projected_year.advice,
          narrative: report.projected_year.theme,
        }),
      ]
    : [];

  const personalMonth = [
    softCard({
      key: "personal-month",
      systemTag: "Timing",
      label: "Personal Month",
      number: snap.personal_month,
      keyword: coreTraitFor(snap.personal_month),
      glyph: "▢",
      geometry: "calendar",
      core: report.personal_month.theme,
      showsUp: `Month ${snap.personal_month} inside Year ${snap.personal_year}.`,
      growth: report.personal_month.advice,
      narrative: report.personal_month.theme,
    }),
  ];

  const mg = report.monthly_guidance;
  const currentMonth = [
    softCard({
      key: "current-month",
      systemTag: "This month",
      label: "Guidance",
      number: snap.personal_month,
      keyword: "Focus",
      glyph: "→",
      geometry: "compass",
      core: mg.focus_areas.slice(0, 2).join(" · ") || mg.career,
      showsUp: `Work/learn: ${firstSentence(mg.career)} Relations: ${firstSentence(mg.relationships)}`,
      growth: mg.avoid[0]
        ? `Ease off: ${mg.avoid[0]}`
        : firstSentence(mg.wellbeing),
      narrative: firstSentence(mg.wellbeing),
      strengths: mg.focus_areas.slice(0, 4),
    }),
  ];

  const recommendations = [
    softCard({
      key: "recommendations",
      systemTag: "Focus",
      label: "Recommended",
      number: snap.life_path,
      keyword: "Practice list",
      glyph: "◎",
      geometry: "compass",
      core: report.recommendations.slice(0, 2).join(" ") || "Stay with reflective practice.",
      showsUp: report.recommendations.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join(" "),
      growth: report.recommendations[0] ?? "Choose one focus for the next fortnight.",
      narrative: "Focus areas are invitations — pick what fits this season.",
      strengths: report.recommendations.slice(0, 4),
    }),
  ];

  return {
    pythagorean,
    chaldean,
    vedic,
    "lo-shu": loShuCards,
    "core-personality": core,
    strengths,
    growth,
    career,
    relationships,
    communication,
    "age-guidance": ageGuidance,
    "personal-year": personalYear,
    "projected-year": projectedYear,
    "personal-month": personalMonth,
    "current-month": currentMonth,
    recommendations,
  };
}

export function insightCardPdfLines(cards: InsightCardModel[]): string[] {
  return cards.flatMap((c) => [
    `${c.systemTag} · ${c.label} ${c.number} — ${c.keyword}`,
    `Core: ${c.core}`,
    `Shows up: ${c.showsUp}`,
    `Growth: ${c.growth}`,
    c.narrative,
  ]);
}
