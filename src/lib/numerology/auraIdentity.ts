/**
 * Aura identity — three-layer reflective associations (Path / Destiny / Name).
 * Atmosphere only: not purchases, events, health, or weekly scheduling.
 */

import {
  associationsForNumber,
  type NumberAssociations,
} from "./associations";
import { pairTone, type CompatTone } from "./compatibility";
import { reduceToSingleDigit } from "./dateNumbers";
import { CORE_TRAIT } from "./meanings";
import { PLANETS, planetForPythagorean, planetForVedic, type PlanetInfo } from "./planets";

export type AuraLayerId = "path" | "destiny" | "name";
export type AuraSynergyKind =
  | "aligned"
  | "complementary"
  | "neutral"
  | "contrasting";

export type AuraLayer = {
  id: AuraLayerId;
  label: string;
  role: string;
  represents: string;
  raw: string;
  digit: number;
  trait: string;
  assoc: NumberAssociations;
  planet: PlanetInfo;
  system: "pythagorean" | "vedic";
};

export type AuraPair = {
  a: AuraLayerId;
  b: AuraLayerId;
  kind: AuraSynergyKind;
  tone: CompatTone | "same";
  summary: string;
};

export type AuraSwatch = { name: string; hex: string; role: string };

export type AuraCrystal = {
  name: string;
  keyword: string;
  body: string;
  hex: string;
  layers: AuraLayerId[];
  shared: boolean;
};

export type AuraAnchor = {
  name: string;
  keyword: string;
  body: string;
  layers: AuraLayerId[];
};

export type AuraRhythm = {
  weekday: string;
  planet: PlanetInfo;
  energy: string;
  invitation: string;
  layers: AuraLayerId[];
};

export type AuraIdentity = {
  layers: AuraLayer[];
  pairs: AuraPair[];
  synergyLabel: string;
  /** Plain-words replacement for the old 0–100 synergy score. */
  synergySummary: string;
  palette: { primary: AuraSwatch; secondary: AuraSwatch; highlight: AuraSwatch };
  crystals: AuraCrystal[];
  anchors: AuraAnchor[];
  rhythms: AuraRhythm[];
  narrative: string;
  insight: string;
};

const CRYSTAL_META: Record<string, { keyword: string; body: string; hex: string }> = {
  Ruby: {
    keyword: "Vitality",
    body: "A warmth cue — starting energy, not a medical claim.",
    hex: "#9B1B30",
  },
  Garnet: {
    keyword: "Steadiness",
    body: "A rooted tone for staying with the work.",
    hex: "#6B1323",
  },
  Pearl: {
    keyword: "Softness",
    body: "A calm, close-in feeling — listening weather.",
    hex: "#F4EFE6",
  },
  Moonstone: {
    keyword: "Intuition",
    body: "A quieter inner compass — notice, don’t force.",
    hex: "#C5D5E0",
  },
  "Yellow sapphire": {
    keyword: "Expansion",
    body: "A teaching / growth tint — share what you know simply.",
    hex: "#E3B23C",
  },
  Citrine: {
    keyword: "Brightness",
    body: "A lighter social tone — expression without strain.",
    hex: "#E8C547",
  },
  Hessonite: {
    keyword: "Grounding",
    body: "A structural cue — feet on the floor, one brick at a time.",
    hex: "#B5651D",
  },
  "Cat’s eye": {
    keyword: "Clarity",
    body: "A focus cue — see the next honest step.",
    hex: "#C4B454",
  },
  Emerald: {
    keyword: "Renewal",
    body: "A growth-green tone — curiosity that stays kind.",
    hex: "#1F7A4D",
  },
  Peridot: {
    keyword: "Ease",
    body: "A lighter green — movement without scattering.",
    hex: "#A3C76D",
  },
  Diamond: {
    keyword: "Clarity",
    body: "A clean-light cue — name what is true.",
    hex: "#E8EEF4",
  },
  "White sapphire": {
    keyword: "Poise",
    body: "A cool, composed tone — care with a boundary.",
    hex: "#D9E4EF",
  },
  Amethyst: {
    keyword: "Reflection",
    body: "An inward-violet cue — study and rest.",
    hex: "#7B5EA7",
  },
  "Blue sapphire": {
    keyword: "Discipline",
    body: "A deep-blue cue — long aims, honest limits.",
    hex: "#1E3A5F",
  },
  "Red coral": {
    keyword: "Courage",
    body: "A warm action tint — move, then review.",
    hex: "#C44536",
  },
  Carnelian: {
    keyword: "Warmth",
    body: "A social ember — start conversations kindly.",
    hex: "#D36C4F",
  },
};

const ANCHOR_META: Record<string, { keyword: string; body: string }> = {
  Gold: {
    keyword: "Presence",
    body: "A visible, warming anchor — show up as yourself.",
  },
  Silver: {
    keyword: "Reflection",
    body: "A listening anchor — sensitivity with a mirror, not a mask.",
  },
  Iron: {
    keyword: "Discipline",
    body: "A structural anchor — routines that hold when mood does not.",
  },
  Steel: {
    keyword: "Endurance",
    body: "A long-range anchor — keep the frame; rest inside it.",
  },
  Bronze: {
    keyword: "Craft",
    body: "A making anchor — skill built by repetition.",
  },
  Platinum: {
    keyword: "Poise",
    body: "A refined anchor — care that doesn’t need to announce itself.",
  },
  Copper: {
    keyword: "Warmth",
    body: "A conductive anchor — connection and repair.",
  },
};

const WEEKDAY_PLANET: Record<string, PlanetInfo> = {
  Sunday: PLANETS.sun,
  Monday: PLANETS.moon,
  Tuesday: PLANETS.mars,
  Wednesday: PLANETS.mercury,
  Thursday: PLANETS.jupiter,
  Friday: PLANETS.venus,
  Saturday: PLANETS.saturn,
};

const WEEKDAY_RHYTHM: Record<string, { energy: string; invitation: string }> = {
  Sunday: {
    energy: "Solar — initiative and visibility",
    invitation:
      "A brighter day-tone: start something small in public, then step back.",
  },
  Monday: {
    energy: "Lunar — feeling and reset",
    invitation:
      "A softer day-tone: listen, tidy the inner room, and let the week find its pace.",
  },
  Tuesday: {
    energy: "Martial — heat and motion",
    invitation:
      "A kinetic day-tone: one honest push, then a pause so heat doesn’t spill.",
  },
  Wednesday: {
    energy: "Mercurial — messages and movement",
    invitation:
      "A quick day-tone: send the note, take the walk, keep plans light.",
  },
  Thursday: {
    energy: "Jovial — meaning and teaching",
    invitation:
      "A spacious day-tone: explain something simply, or sit with a longer view.",
  },
  Friday: {
    energy: "Venusian — harmony and care",
    invitation:
      "A relational day-tone: beauty, repair, and kindness in the near circle.",
  },
  Saturday: {
    energy: "Saturnian — structure and finishing",
    invitation:
      "A slower day-tone: sort, complete, and keep a promise to the future self.",
  },
};

function digitOf(raw: string | number): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 1;
  return reduceToSingleDigit(n);
}

function traitOf(n: number): string {
  return CORE_TRAIT[n] ?? `Tone ${n}`;
}

export function synergyKind(a: number, b: number): AuraSynergyKind {
  if (a === b) return "aligned";
  const tone = pairTone(a, b);
  if (tone === "Amazing" || tone === "Favourable") return "complementary";
  // A Neutral pair is a mixed pairing, not a clash. Reporting it as
  // "contrasting" made ordinary combinations read like a problem.
  if (tone === "Neutral") return "neutral";
  return "contrasting";
}

function pairSummary(
  left: AuraLayer,
  right: AuraLayer,
  kind: AuraSynergyKind,
): string {
  if (kind === "aligned") {
    return `${left.label} and ${right.label} share ${left.digit} (${traitOf(left.digit)}) — two layers rhyming, not a guarantee of ease.`;
  }
  if (kind === "complementary") {
    return `${left.label} ${left.digit} (${traitOf(left.digit)}) sits beside ${right.label} ${right.digit} (${traitOf(right.digit)}) as complementary weather — texture, not a split to fix.`;
  }
  if (kind === "neutral") {
    return `${left.label} ${left.digit} (${traitOf(left.digit)}) and ${right.label} ${right.digit} (${traitOf(right.digit)}) neither push nor pull — they simply do different jobs.`;
  }
  return `${left.label} ${left.digit} and ${right.label} ${right.digit} ask for patience between ${traitOf(left.digit).split(" & ")[0].toLowerCase()} and ${traitOf(right.digit).split(" & ")[0].toLowerCase()} — a stretch, not a verdict.`;
}

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(n.slice(0, 2), 16) || 0,
    g: parseInt(n.slice(2, 4), 16) || 0,
    b: parseInt(n.slice(4, 6), 16) || 0,
  };
}

function hexDist(a: string, b: string): number {
  const pa = parseHex(a);
  const pb = parseHex(b);
  return Math.abs(pa.r - pb.r) + Math.abs(pa.g - pb.g) + Math.abs(pa.b - pb.b);
}

function pickPalette(layers: AuraLayer[]): AuraIdentity["palette"] {
  const path = layers[0].assoc.colors;
  const dest = layers[1].assoc.colors;
  const name = layers[2].assoc.colors;
  const primary = path[0] ?? { name: "Ink", hex: "#183a6b" };
  const secondary =
    path[1] ??
    dest.find((c) => c.hex.toLowerCase() !== primary.hex.toLowerCase()) ??
    dest[0] ??
    primary;
  const used = new Set([primary.hex.toLowerCase(), secondary.hex.toLowerCase()]);
  const unusedName = name.filter((c) => !used.has(c.hex.toLowerCase()));
  const silver = unusedName.find((c) => c.name.toLowerCase() === "silver");
  const highlight =
    silver ??
    unusedName.sort(
      (a, b) =>
        hexDist(b.hex, primary.hex) +
        hexDist(b.hex, secondary.hex) -
        (hexDist(a.hex, primary.hex) + hexDist(a.hex, secondary.hex)),
    )[0] ??
    name[0] ??
    primary;
  return {
    primary: { ...primary, role: "Primary" },
    secondary: { ...secondary, role: "Secondary" },
    highlight: { ...highlight, role: "Highlight" },
  };
}

function crystalFor(
  name: string,
  layers: AuraLayerId[],
): AuraCrystal {
  const key =
    name.replace(/['’]/g, "'") === "Cat's eye" ? "Cat’s eye" : name;
  const meta = CRYSTAL_META[key] ?? {
    keyword: "Atmosphere",
    body: "A traditional stone cue for this number — reflective only, not a purchase.",
    hex: "#C4B28A",
  };
  return {
    name,
    keyword: meta.keyword,
    body: meta.body,
    hex: meta.hex,
    layers,
    shared: layers.length > 1,
  };
}

export function buildAuraIdentity(opts: {
  lifePath: string;
  vedicDestiny: string;
  chaldeanName: string;
}): AuraIdentity {
  const pathDigit = digitOf(opts.lifePath);
  const destDigit = digitOf(opts.vedicDestiny);
  const nameDigit = digitOf(opts.chaldeanName);

  const layers: AuraLayer[] = [
    {
      id: "path",
      label: "Path aura",
      role: "Outer ring",
      represents: "Life Path — the external journey, how the longer walk may feel to live.",
      raw: opts.lifePath,
      digit: pathDigit,
      trait: traitOf(pathDigit),
      assoc: associationsForNumber(opts.lifePath),
      planet: planetForPythagorean(opts.lifePath),
      system: "pythagorean",
    },
    {
      id: "destiny",
      label: "Destiny aura",
      role: "Middle ring",
      represents:
        "Vedic Destiny — the longer curriculum, themes that keep returning.",
      raw: opts.vedicDestiny,
      digit: destDigit,
      trait: traitOf(destDigit),
      assoc: associationsForNumber(opts.vedicDestiny),
      planet: planetForVedic(opts.vedicDestiny),
      system: "vedic",
    },
    {
      id: "name",
      label: "Name aura",
      role: "Inner ring",
      represents:
        "Chaldean name — the identity vibration of this spelling, the face rooms meet.",
      raw: opts.chaldeanName,
      digit: nameDigit,
      trait: traitOf(nameDigit),
      assoc: associationsForNumber(opts.chaldeanName),
      planet: planetForPythagorean(nameDigit),
      system: "pythagorean",
    },
  ];

  const pairDefs: Array<[AuraLayerId, AuraLayerId]> = [
    ["path", "destiny"],
    ["path", "name"],
    ["destiny", "name"],
  ];
  const byId = Object.fromEntries(layers.map((l) => [l.id, l])) as Record<
    AuraLayerId,
    AuraLayer
  >;
  const pairs: AuraPair[] = pairDefs.map(([a, b]) => {
    const left = byId[a];
    const right = byId[b];
    const kind = synergyKind(left.digit, right.digit);
    return {
      a,
      b,
      kind,
      tone: kind === "aligned" ? "same" : pairTone(left.digit, right.digit),
      summary: pairSummary(left, right, kind),
    };
  });

  const alignedCount = pairs.filter((p) => p.kind === "aligned").length;
  const synergyLabel =
    alignedCount === 3
      ? "All three layers share one number"
      : alignedCount === 1 && pairs.every((p) => p.kind !== "contrasting")
        ? "Two layers share a number, the third fits alongside"
        : pairs.every((p) => p.kind !== "contrasting")
          ? "Three different numbers that sit easily together"
          : "Three different numbers with one real stretch";

  /**
   * A 0–100 score read as a grade, and in a numerology app a number like 33
   * also read as a master number. Say the shape of the layers in words instead.
   */
  const sameDigits = new Set(layers.map((l) => l.digit));
  const stretchPair = pairs.find((p) => p.kind === "contrasting");
  const synergySummary = (() => {
    const shape =
      sameDigits.size === 1
        ? `All three layers are ${layers[0].digit}, so one tone (${traitOf(layers[0].digit).toLowerCase()}) carries the whole chart.`
        : sameDigits.size === 2
          ? `Two of the three layers share a number; the third brings a different tone.`
          : `All three layers are different numbers, so no single tone runs the chart.`;
    const stretch = stretchPair
      ? ` The one to watch is ${byId[stretchPair.a].label} ${byId[stretchPair.a].digit} beside ${byId[stretchPair.b].label} ${byId[stretchPair.b].digit} — give each its own time rather than blending them.`
      : ` None of the pairs pull hard against each other.`;
    return `${shape}${stretch} Atmosphere only, not a score.`;
  })();

  const palette = pickPalette(layers);

  const stoneMap = new Map<string, AuraLayerId[]>();
  const metalMap = new Map<string, AuraLayerId[]>();
  const dayMap = new Map<string, AuraLayerId[]>();
  for (const layer of layers) {
    for (const s of layer.assoc.stones) {
      stoneMap.set(s, [...(stoneMap.get(s) ?? []), layer.id]);
    }
    for (const m of layer.assoc.metals) {
      metalMap.set(m, [...(metalMap.get(m) ?? []), layer.id]);
    }
    for (const d of layer.assoc.weekdays) {
      dayMap.set(d, [...(dayMap.get(d) ?? []), layer.id]);
    }
  }

  const crystals = [...stoneMap.entries()]
    .map(([name, ids]) => crystalFor(name, ids))
    .sort((a, b) => Number(b.shared) - Number(a.shared) || a.name.localeCompare(b.name));

  const anchors: AuraAnchor[] = [...metalMap.entries()].map(([name, ids]) => {
    const meta = ANCHOR_META[name] ?? {
      keyword: "Anchor",
      body: "A traditional metal cue for this number — atmosphere, not a prescription.",
    };
    return { name, keyword: meta.keyword, body: meta.body, layers: ids };
  });

  const rhythms: AuraRhythm[] = [...dayMap.entries()].map(([weekday, ids]) => {
    const planet = WEEKDAY_PLANET[weekday] ?? PLANETS.sun;
    const meta = WEEKDAY_RHYTHM[weekday] ?? {
      energy: "Planetary weekday tone",
      invitation: "A reflective day-tone in tradition — weather, not a schedule.",
    };
    return { weekday, planet, energy: meta.energy, invitation: meta.invitation, layers: ids };
  });

  const path = layers[0];
  const dest = layers[1];
  const name = layers[2];
  const pathDest = pairs[0];
  const nameVsPath = pairs[1];

  const narrative =
    pathDest.kind === "aligned"
      ? `Path and Destiny share ${path.digit} (${path.trait}). The outer walk and the longer curriculum currently rhyme. Name ${name.raw} (${name.trait}) is the inner vibration of this spelling — ${
          nameVsPath.kind === "aligned"
            ? "it matches that rhyme."
            : nameVsPath.kind === "complementary"
              ? `it ${name.digit === 2 ? "softens and emotionalizes" : "colors"} the ${path.digit} aura rather than fighting it.`
              : "it adds a stretch beside that shared digit."
        } Atmosphere only.`
      : `Path ${path.raw} and Destiny ${dest.raw} are different digits — ${pathDest.summary} Name ${name.raw} is the spelling’s face. Weather language, not a forecast.`;

  const insight = pairs.map((p) => p.summary).join(" ");

  return {
    layers,
    pairs,
    synergyLabel,
    synergySummary,
    palette,
    crystals,
    anchors,
    rhythms,
    narrative,
    insight,
  };
}

export function auraIdentityPdfLines(aura: AuraIdentity): string[] {
  const pal = `${aura.palette.primary.name}, ${aura.palette.secondary.name}, highlight ${aura.palette.highlight.name}`;
  const crystals = aura.crystals.map((c) => `${c.name} (${c.keyword})`).join(", ");
  const days = aura.rhythms.map((r) => `${r.weekday} ${r.planet.symbol}`).join(", ");
  return [
    `Aura identity — Path ${aura.layers[0].raw} · Destiny ${aura.layers[1].raw} · Name ${aura.layers[2].raw}. ${aura.synergyLabel}. ${aura.synergySummary}`,
    `Palette: ${pal}.`,
    aura.narrative,
    crystals ? `Resonance crystals: ${crystals}.` : "",
    days ? `Rhythm days: ${days}. Reflective weekday tones, not a schedule.` : "",
  ].filter(Boolean);
}

export function synergyKindLabel(kind: AuraSynergyKind): string {
  if (kind === "aligned") return "Aligned";
  if (kind === "complementary") return "Complementary";
  if (kind === "neutral") return "Independent";
  return "Contrasting";
}
