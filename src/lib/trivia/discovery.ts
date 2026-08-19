/**
 * Trivia discovery — gallery match kinds, ring strengths, and reflective narratives.
 * Atmosphere only: not biography claims, predictions, or endorsements.
 */

import { associationsForNumber } from "@/lib/numerology/associations";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { assertSafeCopy } from "@/lib/numerology/safety";
import {
  compareTriples,
  dayMonthKey,
  type LayerScore,
  type NumberTriple,
} from "@/lib/trivia/match";
import type { TriviaPerson } from "@/lib/trivia/people";

export type MatchKind = "triad" | "dual" | "single" | "contrast";
export type DiscoveryFilter = "all" | "triad" | "dual" | "day";

export type DiscoveryLayer = LayerScore & {
  id: "lifePath" | "destiny" | "psychic";
  label: string;
  value: number;
  color: string;
  /** 0.25–1, drives ring stroke weight. */
  strength: number;
};

export type DiscoveryPerson = {
  person: TriviaPerson;
  kind: MatchKind;
  exact: number;
  closeness: number;
  sameDay: boolean;
  reason: string;
  insight: string;
  glyph: string;
  glyphLabel: string;
  toneHex: string;
  layers: {
    lifePath: DiscoveryLayer;
    destiny: DiscoveryLayer;
    psychic: DiscoveryLayer;
  };
};

export type DiscoveryNarratives = {
  triad: string;
  dayMonth: string;
};

export type DiscoveryTarget = NumberTriple & { dob?: string };

const SHORT_TONE: Record<number, string> = {
  1: "initiative",
  2: "cooperation",
  3: "creative expression",
  4: "structured effort",
  5: "adaptability",
  6: "relational care",
  7: "reflective study",
  8: "stewardship",
  9: "compassionate breadth",
  11: "inspired intuition",
  22: "practical vision",
  33: "teaching care",
};

const LAYER_LABEL: Record<DiscoveryLayer["id"], string> = {
  lifePath: "Life Path",
  destiny: "Destiny",
  psychic: "Psychic",
};

const KIND_META: Record<MatchKind, { glyph: string; label: string }> = {
  triad: { glyph: "✦", label: "Strong triad" },
  dual: { glyph: "↑", label: "Dual match" },
  single: { glyph: "•", label: "Single match" },
  contrast: { glyph: "◇", label: "Contrast" },
};

export function personDiscoveryKey(person: TriviaPerson): string {
  return `${person.name}|${person.dob}`;
}

export function personInitials(name: string): string {
  const cleaned = name.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
  const parts = cleaned.split(" ").filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function birthYear(dob: string): string {
  const m = /\/(\d{4})$/.exec(dob.trim());
  return m ? m[1] : "";
}

function toneWord(n: number): string {
  return SHORT_TONE[n] ?? SHORT_TONE[reduceToSingleDigit(n)] ?? "balance";
}

function uniqueBlend(values: number[]): string {
  const words = values.map(toneWord);
  const uniq: string[] = [];
  for (const w of words) {
    if (!uniq.includes(w)) uniq.push(w);
  }
  if (uniq.length === 1) return uniq[0];
  if (uniq.length === 2) return `${uniq[0]} and ${uniq[1]}`;
  return `${uniq[0]}, ${uniq[1]}, and ${uniq[2]}`;
}

function hexLuminance(hex: string): number {
  const h = hex.replace("#", "");
  if (h.length !== 6) return 0.5;
  const r = Number.parseInt(h.slice(0, 2), 16) / 255;
  const g = Number.parseInt(h.slice(2, 4), 16) / 255;
  const b = Number.parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function numberToneHex(n: number): string {
  const colors = associationsForNumber(n).colors;
  const pick =
    colors.find((c) => hexLuminance(c.hex) < 0.82) ?? colors[0] ?? { hex: "#183a6b" };
  return pick.hex;
}

function kindFromExact(exact: number): MatchKind {
  if (exact >= 3) return "triad";
  if (exact === 2) return "dual";
  if (exact === 1) return "single";
  return "contrast";
}

function decorateLayer(
  id: DiscoveryLayer["id"],
  value: number,
  score: LayerScore,
): DiscoveryLayer {
  const strength = score.matched
    ? 1
    : Math.max(0.28, 1 - score.distance / 4.5);
  return {
    id,
    label: LAYER_LABEL[id],
    value,
    color: numberToneHex(value),
    strength,
    matched: score.matched,
    distance: score.distance,
  };
}

function matchReason(
  person: TriviaPerson,
  kind: MatchKind,
  layers: DiscoveryPerson["layers"],
  sameDay: boolean,
  dayKey: string | null,
): string {
  const triad = `${person.lifePath}–${person.destiny}–${person.psychic}`;
  if (kind === "triad") {
    return sameDay && dayKey
      ? `Same ${triad} triad · shared ${dayKey}`
      : `Same ${triad} triad`;
  }
  const hits = (["lifePath", "destiny", "psychic"] as const)
    .filter((id) => layers[id].matched)
    .map((id) => LAYER_LABEL[id]);
  if (kind === "dual") {
    const base = `${hits.join(" + ")} match`;
    return sameDay && dayKey ? `${base} · shared ${dayKey}` : base;
  }
  if (kind === "single") {
    const id = hits[0] ?? "Number";
    const value =
      id === "Life Path"
        ? person.lifePath
        : id === "Destiny"
          ? person.destiny
          : person.psychic;
    const base = `Shared ${id} ${value}`;
    return sameDay && dayKey ? `${base} · shared ${dayKey}` : base;
  }
  return sameDay && dayKey
    ? `Nearby digits · shared ${dayKey}`
    : "Nearby digits — a contrast on the wheel";
}

function whyThisMatch(
  kind: MatchKind,
  layers: DiscoveryPerson["layers"],
  sameDay: boolean,
): string {
  if (kind === "triad") return "Shared triad → similar life rhythm";
  if (sameDay) return "Shared day → similar temperament";
  if (layers.destiny.matched) return "Shared destiny → similar long-path themes";
  if (layers.lifePath.matched) return "Shared life path → similar direction tone";
  if (layers.psychic.matched) return "Shared psychic → similar first reactions";
  return "Nearby digits → a contrast that still sits close on the wheel";
}

export function describePersonMatch(
  target: DiscoveryTarget,
  person: TriviaPerson,
): DiscoveryPerson {
  const compared = compareTriples(target, {
    lifePath: person.lifePath,
    destiny: person.destiny,
    psychic: person.psychic,
  });
  const kind = kindFromExact(compared.exact);
  const layers = {
    lifePath: decorateLayer("lifePath", person.lifePath, compared.layers.lifePath),
    destiny: decorateLayer("destiny", person.destiny, compared.layers.destiny),
    psychic: decorateLayer("psychic", person.psychic, compared.layers.psychic),
  };
  const viewerKey = target.dob ? dayMonthKey(target.dob) : null;
  const sameDay = Boolean(viewerKey && viewerKey === dayMonthKey(person.dob));
  const meta = KIND_META[kind];
  const reason = matchReason(person, kind, layers, sameDay, viewerKey);
  const insight = whyThisMatch(kind, layers, sameDay);

  return {
    person,
    kind,
    exact: compared.exact,
    closeness: compared.closeness,
    sameDay,
    reason: assertSafeCopy(reason, "trivia.matchReason"),
    insight: assertSafeCopy(insight, "trivia.matchInsight"),
    glyph: meta.glyph,
    glyphLabel: meta.label,
    toneHex: numberToneHex(person.lifePath),
    layers,
  };
}

export function annotatePeople(
  target: DiscoveryTarget,
  people: TriviaPerson[],
): DiscoveryPerson[] {
  return people.map((person) => describePersonMatch(target, person));
}

export function filterDiscovery(
  rows: DiscoveryPerson[],
  filter: DiscoveryFilter,
  dayRows: DiscoveryPerson[],
): DiscoveryPerson[] {
  if (filter === "day") return dayRows;
  if (filter === "all") return rows;
  return rows.filter((row) => row.kind === filter);
}

export function triadNarrative(lifePath: number, destiny: number, psychic: number): string {
  const label = `${lifePath}–${destiny}–${psychic}`;
  const blend = uniqueBlend([lifePath, destiny, psychic]);
  return assertSafeCopy(
    `These individuals share your ${label} triad — ${blend}. In this trivia bank their notes often lean toward craft, public life, or care roles. Reflective likeness only—not a shared fate.`,
    "trivia.triadNarrative",
  );
}

export function dayMonthNarrative(dob: string): string {
  const key = dayMonthKey(dob);
  if (!key) {
    return assertSafeCopy(
      "Save a full birth date to see people born on the same day and month. Shared calendar day only—not destiny.",
      "trivia.dayMonthNarrative",
    );
  }
  const [dd, mm] = key.split("/");
  const day = Number(dd);
  const month = Number(mm);
  const dayDigit = reduceToSingleDigit(day);
  const monthDigit = reduceToSingleDigit(month);
  const dayParts = String(day)
    .split("")
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
  const daySum =
    dayParts.length > 1 ? `${dayParts.join("+")}` : String(dayDigit);
  return assertSafeCopy(
    `People born on ${key} often show a blend of ${toneWord(dayDigit)} (${dayDigit} from the day${dayParts.length > 1 ? `, ${daySum}` : ""}) and a ${toneWord(monthDigit)} month tone. This date shows up across political, artistic, and public-life notes in our bank. Shared calendar day only—not a lineage or prediction.`,
    "trivia.dayMonthNarrative",
  );
}

export function buildDiscoveryNarratives(target: DiscoveryTarget): DiscoveryNarratives {
  return {
    triad: triadNarrative(target.lifePath, target.destiny, target.psychic),
    dayMonth: dayMonthNarrative(target.dob ?? ""),
  };
}
