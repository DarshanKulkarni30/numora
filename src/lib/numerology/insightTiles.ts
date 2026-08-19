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
  | "grid";

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

  return {
    pythagorean,
    chaldean,
    vedic,
    "lo-shu": loShuCards,
    "core-personality": core,
  };
}
