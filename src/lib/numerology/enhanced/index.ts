import { DISCLAIMER } from "@/lib/numerology/meanings";
import { HOW_TO_READ_ENHANCED } from "./howToRead";
import {
  buildChartDerivations,
  type Derivation,
} from "@/lib/numerology/chartDerivations";
import { resolvePythagoreanChart, type PythagoreanChart } from "@/lib/numerology/pythagoreanChart";
import type { NumerologyReport } from "@/lib/numerology/types";
import { buildActionPlan, type ActionPlan } from "./actionPlan";
import { archetypeFor } from "./archetypes";
import { buildChaldeanStory, type ChaldeanStory } from "./chaldeanStory";
import { formatAsOf, parseChartNumber } from "./digits";
import { buildLifestyleInsights, type LifestyleInsights } from "./lifestyleInsights";
import { buildLoShuLived, type LoShuLived } from "./loShuLived";
import { buildPlanetPresence, type PlanetPresence } from "./planetPresence";
import { buildProfileNarrative, type ProfileNarrative } from "./profileNarrative";
import { buildRadarAxes, type RadarAxis } from "./radarModel";
import { buildRelationshipFlow, type RelationshipFlow } from "./relationshipFlow";
import { SCHOOL_COMPARE, type SchoolRow } from "./schoolCompare";
import { buildSeasonBrief, type SeasonBrief } from "./seasonBrief";
import { buildStudentWalkthrough, type StudentWalkthrough } from "./studentWalkthrough";
import { buildTensions, type Tension } from "./tensions";
import {
  buildThemeGraph,
  traitLabel,
  type ChartSeat,
  type ThemeHit,
} from "./themeGraph";
import { buildTriviaEnergies, type TriviaEnergies } from "./triviaEnergies";

export type CoreStripItem = {
  label: string;
  value: string;
  role: string;
  trait: string;
};

export type EnhancedHero = {
  displayName: string;
  archetype: string;
  throughline: string;
  currentFocus: string[];
  nameEra?: string;
};

export type EnhancedReading = {
  asOf: string;
  howToRead: string[];
  hero: EnhancedHero;
  coreStrip: CoreStripItem[];
  themes: ThemeHit[];
  tensions: Tension[];
  narrative: ProfileNarrative;
  season: SeasonBrief;
  flow: RelationshipFlow;
  actionPlan: ActionPlan;
  lifestyle: LifestyleInsights;
  trivia: TriviaEnergies;
  chaldean: ChaldeanStory;
  loShuLived: LoShuLived;
  student: StudentWalkthrough;
  derivations: Derivation[];
  schoolCompare: SchoolRow[];
  radar: RadarAxis[];
  planets: PlanetPresence[];
  pythagoreanChart: PythagoreanChart;
  disclaimer: string;
  detailedHref: string;
};

export function buildEnhancedReading(
  report: NumerologyReport,
  opts?: { reportId?: string; now?: Date },
): EnhancedReading {
  const now = opts?.now ?? new Date();
  const asOf = formatAsOf(now);
  const snap = report.numerology_snapshot;
  const displayName =
    report.person.preferred_name?.trim() || report.person.full_name;
  const { themes, seats } = buildThemeGraph(snap, report.lo_shu);
  const lp = parseChartNumber(snap.life_path) ?? 9;
  const bd = parseChartNumber(snap.birth_day) ?? lp;
  const expr = parseChartNumber(snap.expression_number) ?? 9;
  const soul = parseChartNumber(snap.soul_urge_number) ?? 9;
  const pers = parseChartNumber(snap.personality_number) ?? 9;
  const arch = archetypeFor({
    themes,
    seats,
    lifePath: lp,
    birthDay: bd,
    expression: expr,
    soulUrge: soul,
    personality: pers,
  });
  const tensions = buildTensions(snap, report.lo_shu);
  const season = buildSeasonBrief(report, asOf);
  let narrative;
  try {
    narrative = buildProfileNarrative({
      report,
      displayName,
      archetypeTitle: arch.title,
      themes,
      season,
    });
  } catch {
    narrative = {
      teaser: arch.throughline,
      full: arch.throughline,
      wordCount: arch.throughline.split(/\s+/).filter(Boolean).length,
    };
  }
  const actionPlan = buildActionPlan({ report, season, themes });
  const lifestyle = buildLifestyleInsights(report);
  const trivia = buildTriviaEnergies({
    report,
    themes,
    archetypeTitle: arch.title,
  });
  const detailedHref = opts?.reportId ? `/report/${opts.reportId}` : "/dashboard";

  const nameEra =
    snap.natal_name && snap.operating_name && snap.natal_name !== snap.operating_name
      ? `Natal ${snap.natal_name} · in force ${snap.operating_name}${snap.name_era_label ? ` (${snap.name_era_label})` : ""}`
      : undefined;
  const pythagoreanChart = resolvePythagoreanChart(report, now);

  return {
    asOf,
    howToRead: HOW_TO_READ_ENHANCED,
    hero: {
      displayName,
      archetype: arch.title,
      throughline: arch.throughline,
      currentFocus: season.yearFocus.slice(0, 3),
      nameEra,
    },
    coreStrip: buildCoreStrip(report, pythagoreanChart),
    themes,
    tensions,
    narrative,
    season,
    flow: buildRelationshipFlow(snap),
    actionPlan,
    lifestyle,
    trivia,
    chaldean: buildChaldeanStory(report),
    loShuLived: buildLoShuLived(report.lo_shu),
    student: buildStudentWalkthrough(report),
    derivations: buildChartDerivations(report, pythagoreanChart, now),
    schoolCompare: SCHOOL_COMPARE,
    radar: buildRadarAxes(themes),
    planets: buildPlanetPresence(snap),
    pythagoreanChart,
    disclaimer: report.disclaimer || DISCLAIMER,
    detailedHref,
  };
}

function buildCoreStrip(
  report: NumerologyReport,
  chart: PythagoreanChart,
): CoreStripItem[] {
  const s = report.numerology_snapshot;
  const item = (label: string, value: string | undefined, role: string): CoreStripItem => {
    const v = value || "—";
    const n = parseChartNumber(v);
    return {
      label,
      value: v,
      role,
      trait: n != null ? traitLabel(n) : "",
    };
  };
  return [
    item("Life Path", s.life_path, "Why the journey exists"),
    item("Expression", s.expression_number, "How you build and contribute"),
    item(
      "Minor Expression",
      s.minor_expression_number || s.expression_number,
      "Name in force — same as Expression until a later spelling",
    ),
    item("Birth Day", s.birth_day, "Native heat of the day"),
    item("Soul Urge", s.soul_urge_number, "Inner wish"),
    item("Personality", s.personality_number, "First impression"),
    item("Maturity", s.maturity_number, "What deepens with practice"),
    item("Psychic", s.vedic_psychic, "Day temperament"),
    item("Destiny", s.vedic_destiny, "Longer Vedic path"),
    item("Name", s.vedic_name, "Vedic name in force"),
    item("Chaldean", s.chaldean_name_number, "Short name number"),
    item("Personal Year", s.personal_year, "This season’s pacing"),
    item("Personal Day", String(chart.personalDay.number), "Today’s weather"),
    item(
      "Balance",
      chart.balance.number ? String(chart.balance.number) : "—",
      "Crisis tone from initials",
    ),
    item(
      "Hidden Passion",
      chart.hiddenPassion.numbers.join("/") || "—",
      "Most repeated letter-value",
    ),
    item("Attitude", String(chart.attitude.number), "Month + day of birth"),
    item(
      "Subconscious Self",
      String(chart.subconsciousSelf.number),
      "How many of 1–9 appear as letters",
    ),
  ];
}

export type { ActionPlan, ChartSeat, ThemeHit, Tension, SeasonBrief };
