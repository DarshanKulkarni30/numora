/**
 * Aura identity — three-layer reflective associations (Path / Destiny / Name).
 * Atmosphere only: not purchases, events, health, or weekly scheduling.
 */

import {
  associationsForNumber,
  type AssociationColor,
  type NumberAssociations,
} from "./associations";
import { pairTone, type CompatTone } from "./compatibility";
import { reduceToSingleDigit } from "./dateNumbers";
import { CORE_TRAIT } from "./meanings";
import { PLANETS, planetForPythagorean, planetForVedic, type PlanetInfo } from "./planets";
import { assertSafeCopy, assertSafeList } from "./safety";

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

export type AuraSwatchRole = "Primary" | "Secondary" | "Highlight";

export type AuraSwatchSource = { id: AuraLayerId; raw: string };

export type AuraSwatch = {
  name: string;
  hex: string;
  role: AuraSwatchRole;
  job: string;
  indicates: string;
  title: string;
  tags: string[];
  line: string;
  action: string;
  use: string;
  layers: AuraLayerId[];
  sources: AuraSwatchSource[];
};

export type AuraClimateBand = {
  kind: "year" | "month";
  number: string;
  trait: string;
  name: string;
  hex: string;
  title: string;
  line: string;
};

export type AuraClimate = {
  caption: string;
  year: AuraClimateBand;
  month: AuraClimateBand;
};

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
  paletteSummary: string;
  climate: AuraClimate | null;
  crystals: AuraCrystal[];
  anchors: AuraAnchor[];
  rhythms: AuraRhythm[];
  narrative: string;
  insight: string;
};

const CRYSTAL_META: Record<string, { keyword: string; body: string; hex: string }> = {
  Ruby: {
    keyword: "Vitality",
    body: "Warmth — starting energy, not a medical claim.",
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
    body: "A grounded reminder — feet on the floor, one brick at a time.",
    hex: "#B5651D",
  },
  "Cat’s eye": {
    keyword: "Clarity",
    body: "Focus — see the next honest step.",
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
    body: "Clean light — name what is true.",
    hex: "#E8EEF4",
  },
  "White sapphire": {
    keyword: "Poise",
    body: "A cool, composed tone — care with a boundary.",
    hex: "#D9E4EF",
  },
  Amethyst: {
    keyword: "Reflection",
    body: "Inward violet — study and rest.",
    hex: "#7B5EA7",
  },
  "Blue sapphire": {
    keyword: "Discipline",
    body: "Deep blue — long aims, honest limits.",
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
  const lt = traitOf(left.digit).toLowerCase();
  const rt = traitOf(right.digit).toLowerCase();
  if (kind === "aligned") {
    return `${left.label} and ${right.label} are both ${left.digit}. ${lt} is your automatic move — you reach for it before you think. That helps when the situation needs it. It hurts when you do it out of habit. This week: notice one time you reached for it. Ask if anyone actually asked.`;
  }
  if (kind === "complementary") {
    return `${left.label} is ${left.digit} (${lt}) and ${right.label} is ${right.digit} (${rt}). They work on the same task: one starts, the other finishes. Use both on one job this week. Do not pick a side.`;
  }
  if (kind === "neutral") {
    return `${left.label} is ${left.digit} (${lt}). ${right.label} is ${right.digit} (${rt}). Different jobs. They do not help or block each other. Pick which hour this is. Use one. Do not mix both in the same five minutes.`;
  }
  return `${left.label} is ${left.digit} (${lt}). ${right.label} is ${right.digit} (${rt}). They pull opposite ways. Give each its own task this week — one prepares, the other decides.`;
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

const INK_FALLBACK: AssociationColor = {
  name: "Ink",
  hex: "#183a6b",
  title: "Quiet focus",
  tags: ["Calm", "Clear", "Steady"],
  line: "A default ink tone when no traditional colour is listed — slow down and name the next step.",
  action: "Write the next step in one sentence.",
  use: "Keep a dark notebook nearby when the chart colour list is empty.",
};

const ROLE_FRAME: Record<
  AuraSwatchRole,
  { job: string; indicates: string }
> = {
  Primary: {
    job: "Your usual setting",
    indicates: "How you usually operate when nothing special is happening.",
  },
  Secondary: {
    job: "How you show up at work and with people",
    indicates: "What other people see when you are doing the day's work.",
  },
  Highlight: {
    job: "The extra switch",
    indicates: "Use this when the first two colours are not enough. It is not your everyday setting.",
  },
};

function asColor(c: AssociationColor | { name: string; hex: string }): AssociationColor {
  if ("title" in c && "tags" in c && "line" in c && "action" in c && "use" in c) {
    return c;
  }
  return { ...INK_FALLBACK, name: c.name, hex: c.hex };
}

function sourcesForColor(
  layers: AuraLayer[],
  color: AssociationColor,
): AuraSwatchSource[] {
  const hex = color.hex.toLowerCase();
  return layers
    .filter((l) =>
      l.assoc.colors.some((c) => c.hex.toLowerCase() === hex),
    )
    .map((l) => ({ id: l.id, raw: l.raw }));
}

function enrichSwatch(
  color: AssociationColor,
  role: AuraSwatchRole,
  layers: AuraLayer[],
): AuraSwatch {
  const sources = sourcesForColor(layers, color);
  const frame = ROLE_FRAME[role];
  const key = `aura.swatch.${role.toLowerCase()}`;
  return {
    name: color.name,
    hex: color.hex,
    role,
    job: assertSafeCopy(frame.job, `${key}.job`),
    indicates: assertSafeCopy(frame.indicates, `${key}.indicates`),
    title: assertSafeCopy(color.title, `${key}.title`),
    tags: assertSafeList([...color.tags], `${key}.tags`),
    line: assertSafeCopy(color.line, `${key}.line`),
    action: assertSafeCopy(color.action, `${key}.action`),
    use: assertSafeCopy(color.use, `${key}.use`),
    layers: sources.map((s) => s.id),
    sources,
  };
}

function pickPalette(layers: AuraLayer[]): AuraIdentity["palette"] {
  const path = layers[0].assoc.colors;
  const dest = layers[1].assoc.colors;
  const name = layers[2].assoc.colors;
  const primary = asColor(path[0] ?? INK_FALLBACK);
  const secondary = asColor(
    path[1] ??
      dest.find((c) => c.hex.toLowerCase() !== primary.hex.toLowerCase()) ??
      dest[0] ??
      primary,
  );
  const used = new Set([primary.hex.toLowerCase(), secondary.hex.toLowerCase()]);
  const unusedName = name.filter((c) => !used.has(c.hex.toLowerCase()));
  const silver = unusedName.find((c) => c.name.toLowerCase() === "silver");
  const highlight = asColor(
    silver ??
      [...unusedName].sort(
        (a, b) =>
          hexDist(b.hex, primary.hex) +
          hexDist(b.hex, secondary.hex) -
          (hexDist(a.hex, primary.hex) + hexDist(a.hex, secondary.hex)),
      )[0] ??
      name[0] ??
      primary,
  );
  return {
    primary: enrichSwatch(primary, "Primary", layers),
    secondary: enrichSwatch(secondary, "Secondary", layers),
    highlight: enrichSwatch(highlight, "Highlight", layers),
  };
}

function paletteSummaryFor(palette: AuraIdentity["palette"]): string {
  return assertSafeCopy(
    `Your aura blends ${palette.primary.title.toLowerCase()} (${palette.primary.name.toLowerCase()}), ${palette.secondary.title.toLowerCase()} (${palette.secondary.name.toLowerCase()}), and ${palette.highlight.title.toLowerCase()} (${palette.highlight.name.toLowerCase()}).`,
    "aura.palette.summary",
  );
}

function climateBand(
  kind: "year" | "month",
  raw: string,
): AuraClimateBand {
  const assoc = associationsForNumber(raw);
  const color = assoc.colors[0] ?? INK_FALLBACK;
  const trait = traitOf(assoc.number);
  const label = kind === "year" ? "Personal Year" : "Personal Month";
  return {
    kind,
    number: String(raw),
    trait,
    name: color.name,
    hex: color.hex,
    title: assertSafeCopy(color.title, `aura.climate.${kind}.title`),
    line: assertSafeCopy(
      `${label} ${raw} tints toward ${color.name.toLowerCase()} (${color.title.toLowerCase()}) — ${trait.toLowerCase()}. This is seasonal weather, not a rewrite of your natal colours.`,
      `aura.climate.${kind}.line`,
    ),
  };
}

function buildAuraClimate(
  personalYear?: string,
  personalMonth?: string,
): AuraClimate | null {
  const year = personalYear?.trim();
  const month = personalMonth?.trim();
  if (!year || !month) return null;
  return {
    caption: assertSafeCopy(
      "This is this year's weather, not your natal aura. Year and month tints shift; the three colours above stay with your Path, Destiny and Name.",
      "aura.climate.caption",
    ),
    year: climateBand("year", year),
    month: climateBand("month", month),
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
    body: "A traditional stone for this number — atmosphere, not a shopping list.",
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
  personalYear?: string;
  personalMonth?: string;
}): AuraIdentity {
  const pathDigit = digitOf(opts.lifePath);
  const destDigit = digitOf(opts.vedicDestiny);
  const nameDigit = digitOf(opts.chaldeanName);

  const layers: AuraLayer[] = [
    {
      id: "path",
      label: "Life Path",
      role: "Outer ring",
      represents:
        "Life Path, from your full birth date. The direction your life keeps returning to, regardless of what job you happen to be doing.",
      raw: opts.lifePath,
      digit: pathDigit,
      trait: traitOf(pathDigit),
      assoc: associationsForNumber(opts.lifePath),
      planet: planetForPythagorean(opts.lifePath),
      system: "pythagorean",
    },
    {
      id: "destiny",
      label: "Vedic Destiny",
      role: "Middle ring",
      represents:
        "Vedic Destiny, from the same birth date read by the Vedic method. The lesson that keeps coming back until you get good at it.",
      raw: opts.vedicDestiny,
      digit: destDigit,
      trait: traitOf(destDigit),
      assoc: associationsForNumber(opts.vedicDestiny),
      planet: planetForVedic(opts.vedicDestiny),
      system: "vedic",
    },
    {
      id: "name",
      label: "Name number",
      role: "Inner ring",
      represents:
        "Name number, from the letters of the spelling you use now. How you come across before people know you — and the one number here that changes if you change your name.",
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
    const intro = `This compares three numbers: Life Path ${layers[0].raw} (birth date), Vedic Destiny ${layers[1].raw} (same date, other method), and Name number ${layers[2].raw} (this spelling). When two share a digit, that job becomes your automatic move.`;
    const shape =
      sameDigits.size === 1
        ? ` All three are ${layers[0].digit}, so one trait — ${traitOf(layers[0].digit).toLowerCase()} — drives almost everything you do. That makes you consistent and predictable to others, and it means you have few natural alternatives when it stops working.`
        : sameDigits.size === 2
          ? ` Two of the three share a number, so that trait is your strong default, and the odd one out is the setting you have to choose deliberately.`
          : ` All three are different, so no single trait dominates. You can lead with whichever suits the situation, at the cost of feeling less consistent than people whose numbers repeat.`;
    const stretch = stretchPair
      ? ` The pair to watch is ${byId[stretchPair.a].label} ${byId[stretchPair.a].digit} next to ${byId[stretchPair.b].label} ${byId[stretchPair.b].digit}: they want opposite things, so under time pressure you may freeze or swing between them. Try giving each its own slot in the task rather than trying to do both at once.`
      : ` No pair pulls hard against another, so you are unlikely to feel torn between these three.`;
    return `${intro}${shape}${stretch}`;
  })();

  const palette = pickPalette(layers);
  const paletteSummary = paletteSummaryFor(palette);
  const climate = buildAuraClimate(opts.personalYear, opts.personalMonth);

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
      body: "A traditional metal for this number — atmosphere, not a prescription.",
    };
    return { name, keyword: meta.keyword, body: meta.body, layers: ids };
  });

  const rhythms: AuraRhythm[] = [...dayMap.entries()].map(([weekday, ids]) => {
    const planet = WEEKDAY_PLANET[weekday] ?? PLANETS.sun;
    const meta = WEEKDAY_RHYTHM[weekday] ?? {
      energy: "Planetary weekday tone",
      invitation:
        "Tradition links this weekday to your number. Use it as an optional reminder to do that number's kind of task — it does not make the day lucky.",
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
      ? `Your Life Path and your Vedic Destiny both come out as ${path.digit} (${path.trait}). Two different methods reaching the same digit means the trait is well supported rather than incidental — expect it to show up in both day-to-day choices and long-term direction. Your Name number ${name.raw} (${name.trait}) is what people meet first, and here ${
          nameVsPath.kind === "aligned"
            ? "it matches the other two, so how you come across and how you actually operate are the same thing."
            : nameVsPath.kind === "complementary"
              ? `it works with them rather than against them — it changes the delivery, not the direction.`
              : "it pulls a different way, so first impressions of you may not match how you actually work."
        }`
      : `Your Life Path is ${path.raw} and your Vedic Destiny is ${dest.raw}. Two methods reading the same birth date land on different digits, which is common and simply means your day-to-day instinct and your longer direction are not the same thing. ${pathDest.summary} Your Name number ${name.raw} is what people meet first.`;

  const insight = pairs.map((p) => p.summary).join(" ");

  return {
    layers,
    pairs,
    synergyLabel,
    synergySummary,
    palette,
    paletteSummary,
    climate,
    crystals,
    anchors,
    rhythms,
    narrative,
    insight,
  };
}

export function auraIdentityPdfLines(aura: AuraIdentity): string[] {
  const swatches = [
    aura.palette.primary,
    aura.palette.secondary,
    aura.palette.highlight,
  ];
  const palLines = swatches.map((s) => {
    const badges = s.sources
      .map((src) => `${src.id === "path" ? "PATH" : src.id === "destiny" ? "DESTINY" : "NAME"} ${src.raw}`)
      .join(" / ");
    return `${s.role} (${s.job}) — ${s.name}: ${s.title}. ${s.line} Try this: ${s.action}${badges ? ` [${badges}]` : ""}.`;
  });
  const crystals = aura.crystals.map((c) => `${c.name} (${c.keyword})`).join(", ");
  const days = aura.rhythms.map((r) => `${r.weekday} ${r.planet.symbol}`).join(", ");
  const climateLines = aura.climate
    ? [
        aura.climate.caption,
        aura.climate.year.line,
        aura.climate.month.line,
      ]
    : [];
  return [
    `Your three main numbers — Life Path ${aura.layers[0].raw}, Vedic Destiny ${aura.layers[1].raw}, Name ${aura.layers[2].raw}. ${aura.synergyLabel}. ${aura.synergySummary}`,
    aura.paletteSummary,
    ...palLines,
    ...climateLines,
    aura.narrative,
    crystals ? `Stones traditionally linked to these numbers: ${crystals}.` : "",
    days
      ? `Weekdays traditionally linked to these numbers: ${days}. Use them as optional reminders, not a schedule.`
      : "",
  ].filter(Boolean);
}

export function synergyKindLabel(kind: AuraSynergyKind): string {
  if (kind === "aligned") return "Same job";
  if (kind === "complementary") return "Work together";
  if (kind === "neutral") return "Different jobs";
  return "Pull opposite ways";
}
