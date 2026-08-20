/**
 * Pinnacle Year mountain — four life chapters with current-terrace insight.
 * Reflective pacing only: not events, health, or a calendar of incidents.
 */

import { synergyKind } from "@/lib/numerology/auraIdentity";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import {
  pinnaclesForDob,
  pinnacleAtAge,
  type Pinnacle,
  type PinnacleId,
  type PinnacleSet,
} from "@/lib/numerology/pinnacles";
import { planetForPythagorean, type PlanetInfo } from "@/lib/numerology/planets";
import { calculateAge } from "@/lib/numerology/reduce";
import { assertSafeCopy } from "@/lib/numerology/safety";
import { DIGIT_SEASON, type DigitSeason } from "@/lib/numerology/yearRhythm";

export type ChapterPalette = {
  name: string;
  from: string;
  to: string;
  ink: string;
};

export type PinnacleInsight = {
  pinnacle: Pinnacle;
  title: string;
  chapterTitle: string;
  ageLabel: string;
  coreTone: string;
  manifestation: string[];
  practiceCue: string;
  narrative: string;
  keywords: [string, string, string];
  season: DigitSeason;
  planet: PlanetInfo;
  palette: ChapterPalette;
  related: { label: string; value: string }[];
  synergies: { label: string; kind: "aligned" | "complementary" | "contrasting" }[];
};

export type PinnacleYearModel = {
  age: number;
  set: PinnacleSet;
  current: PinnacleInsight;
  chapters: PinnacleInsight[];
};

const CHAPTER: Record<PinnacleId, { title: string; palette: ChapterPalette }> = {
  1: {
    title: "Beginnings",
    palette: { name: "Gold", from: "#E8A317", to: "#F6D48A", ink: "#7A4E00" },
  },
  2: {
    title: "Partnership",
    palette: { name: "Soft blue", from: "#7EB8D4", to: "#D5EBF5", ink: "#1E4A63" },
  },
  3: {
    title: "Expression",
    palette: { name: "Orange", from: "#E07A3A", to: "#F4C7A5", ink: "#7A3410" },
  },
  4: {
    title: "Structure",
    palette: { name: "Indigo", from: "#3F3D8A", to: "#B8B6DE", ink: "#1E1B4B" },
  },
};

const NUMBER_COPY: Record<
  number,
  {
    title: string;
    coreTone: string;
    manifestation: [string, string];
    practiceCue: string;
    narrative: string;
    keywords: [string, string, string];
  }
> = {
  1: {
    title: "Leadership",
    coreTone: "Independence, initiative, and self-directed building.",
    manifestation: ["You start more of your own chapters", "Pace wants a clean yes"],
    practiceCue: "Name one project and protect its first 90 days.",
    narrative: "This chapter asks you to trust a beginning you can finish.",
    keywords: ["Start", "Agency", "Spark"],
  },
  2: {
    title: "Partnership",
    coreTone: "Diplomacy, teamwork, and close cooperation.",
    manifestation: ["Decisions want a second voice", "Timing matters more than speed"],
    practiceCue: "Ask for one clear yes before adding a new yes.",
    narrative: "This chapter asks you to build with someone, not only for them.",
    keywords: ["Listen", "Pace", "Bond"],
  },
  3: {
    title: "Creative expansion",
    coreTone: "Expression, visibility, and creative momentum.",
    manifestation: ["Ideas multiply quickly", "Public work finds more room"],
    practiceCue: "Finish and share one creative project this year.",
    narrative: "This chapter asks you to make visible what you already know.",
    keywords: ["Voice", "Play", "Share"],
  },
  4: {
    title: "Structure",
    coreTone: "Systems, craft, and durable follow-through.",
    manifestation: ["Routines carry more weight", "Shortcuts cost more later"],
    practiceCue: "Keep one weekly structure that outlives mood.",
    narrative: "This chapter asks you to build something that lasts past the week.",
    keywords: ["Craft", "Order", "Steady"],
  },
  5: {
    title: "Change",
    coreTone: "Movement, variety, and a wider field of trial.",
    manifestation: ["Plans want extra air", "New rooms open if you travel them"],
    practiceCue: "Pick one change to finish; let the rest wait.",
    narrative: "This chapter asks you to move with a chosen craft, not scatter.",
    keywords: ["Move", "Try", "Air"],
  },
  6: {
    title: "Responsibility",
    coreTone: "Care, harmony, and leadership through service.",
    manifestation: ["People lean on your steadiness", "Home and duty share the stage"],
    practiceCue: "Care includes you — schedule one receiving hour weekly.",
    narrative: "This chapter asks you to keep harmony without erasing yourself.",
    keywords: ["Care", "Home", "Duty"],
  },
  7: {
    title: "Learning",
    coreTone: "Study, inner work, and unhurried depth.",
    manifestation: ["Quiet becomes productive", "Surface noise costs more"],
    practiceCue: "Protect two study or rest blocks on the calendar.",
    narrative: "This chapter asks you to go inward without disappearing.",
    keywords: ["Study", "Quiet", "Depth"],
  },
  8: {
    title: "Stewardship",
    coreTone: "Authority, resources, and measurable follow-through.",
    manifestation: ["Results get more visible", "Pressure rises with the ledger"],
    practiceCue: "Define success with rest and integrity, not status alone.",
    narrative: "This chapter asks you to hold power as care for what you tend.",
    keywords: ["Steward", "Measure", "Hold"],
  },
  9: {
    title: "Completion",
    coreTone: "Closing cycles and releasing what no longer fits.",
    manifestation: ["Endings arrive as invitations", "The next chapter wants space"],
    practiceCue: "Close one loop this season before opening three more.",
    narrative: "This chapter asks you to finish cleanly so the next start is honest.",
    keywords: ["Close", "Give", "Clear"],
  },
};

function ageLabel(p: Pinnacle): string {
  if (p.ageEnd == null) return `Ages ${p.ageStart}+`;
  return `Ages ${p.ageStart}–${p.ageEnd}`;
}

function copyFor(n: number) {
  const d = reduceToSingleDigit(n);
  return NUMBER_COPY[d] ?? NUMBER_COPY[1];
}

function synergyChip(
  label: string,
  self: number,
  other: string,
): PinnacleInsight["synergies"][number] {
  const kind = synergyKind(
    reduceToSingleDigit(self),
    reduceToSingleDigit(Number(other)),
  );
  return { label: `${label} ${other}`, kind };
}

export function buildPinnacleInsight(
  pinnacle: Pinnacle,
  related: { lifePath: string; personalYear: string; expression: string },
): PinnacleInsight {
  const copy = copyFor(pinnacle.number);
  const chapter = CHAPTER[pinnacle.id];
  const season = DIGIT_SEASON[reduceToSingleDigit(pinnacle.number)] ?? DIGIT_SEASON[1];
  const planet = planetForPythagorean(pinnacle.number);
  return {
    pinnacle,
    title: copy.title,
    chapterTitle: chapter.title,
    ageLabel: ageLabel(pinnacle),
    coreTone: assertSafeCopy(copy.coreTone, "pinnacle.coreTone"),
    manifestation: copy.manifestation.map((line) =>
      assertSafeCopy(line, "pinnacle.manifestation"),
    ),
    practiceCue: assertSafeCopy(copy.practiceCue, "pinnacle.practiceCue"),
    narrative: assertSafeCopy(copy.narrative, "pinnacle.narrative"),
    keywords: copy.keywords,
    season,
    planet,
    palette: chapter.palette,
    related: [
      { label: "Life Path", value: related.lifePath },
      { label: "Personal Year", value: related.personalYear },
      { label: "Expression", value: related.expression },
    ],
    synergies: [
      synergyChip("Life Path", pinnacle.number, related.lifePath),
      synergyChip("Personal Year", pinnacle.number, related.personalYear),
      synergyChip("Expression", pinnacle.number, related.expression),
    ],
  };
}

export function buildPinnacleYearModel(opts: {
  dob: string;
  lifePath: string;
  personalYear: string;
  expression: string;
  asOf?: Date;
}): PinnacleYearModel {
  const asOf = opts.asOf ?? new Date();
  const set = pinnaclesForDob(opts.dob);
  const age = calculateAge(opts.dob, asOf);
  const currentPin = pinnacleAtAge(set, age);
  const related = {
    lifePath: opts.lifePath,
    personalYear: opts.personalYear,
    expression: opts.expression,
  };
  const chapters = set.pinnacles.map((p) => buildPinnacleInsight(p, related));
  const current =
    chapters.find((c) => c.pinnacle.id === currentPin.id) ?? chapters[0];
  return { age, set, current, chapters };
}

export function pinnacleYearPdfLines(model: PinnacleYearModel): string[] {
  const c = model.current;
  return [
    `Pinnacle ${c.pinnacle.id} · ${c.pinnacle.number} ${c.title} · ${c.ageLabel} (age ${model.age}).`,
    `Season ${c.season.season} · ${c.planet.symbol} ${c.planet.name}.`,
    `Core tone: ${c.coreTone}`,
    `How it may show: ${c.manifestation.join("; ")}.`,
    `Practice cue: ${c.practiceCue}`,
    c.narrative,
    `Related: ${c.related.map((r) => `${r.label} ${r.value}`).join(" · ")}.`,
    `Chapters: ${model.chapters
      .map(
        (ch) =>
          `P${ch.pinnacle.id} ${ch.pinnacle.number} ${ch.ageLabel}${
            ch.pinnacle.id === c.pinnacle.id ? " · current" : ""
          }`,
      )
      .join("; ")}.`,
  ];
}
