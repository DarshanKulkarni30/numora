/**
 * Compatibility Compass — visual tone states + bond dynamics.
 * Keeps Amazing / Favourable / Neutral / Challenging as the matrix source of truth.
 */

import { CORE_TRAIT } from "./meanings";
import {
  CHANNEL_HINT,
  normalizeCompatTone,
  type CompatChannel,
  type CompatTone,
} from "./compatibility";
import { reduceToSingleDigit } from "./dateNumbers";
import { planetForVedic, type PlanetInfo } from "./planets";

export type VisualToneState =
  | "radiant"
  | "supportive"
  | "balanced"
  | "friction";

export type CompatChannelVisual = {
  id: CompatChannel | "team";
  label: string;
  /** Vedic arc label when in Graha context */
  vedicLabel: string;
  tone: CompatTone;
  state: VisualToneState;
  stateLabel: string;
  symbol: string;
  stroke: string;
  /** 0–1 arc fullness */
  intensity: number;
  dashed: boolean;
  insight: string;
  dynamics: string;
};

export type CompatCompassModel = {
  partner: number;
  partnerPlanet: PlanetInfo | null;
  hideRomantic: boolean;
  channels: CompatChannelVisual[];
  centerState: VisualToneState;
  centerLabel: string;
  centerSymbol: string;
  combinedSummary: string;
  reflectivePractice: string;
  blueprintLines: string[];
};

export type GrahaLayerId = "moolank" | "bhagyank" | "namank";

export type GrahaLayerCard = {
  id: GrahaLayerId;
  label: string;
  shortLabel: string;
  digit: number;
  planet: PlanetInfo;
  tone: CompatTone;
  state: VisualToneState;
  stateLabel: string;
  dynamics: string;
};

export type GrahaMandalaModel = {
  partner: number;
  partnerPlanet: PlanetInfo;
  yourLayers: GrahaLayerCard[];
  /** Blended Rasa / Karma / Sangha arcs across layers */
  compass: CompatCompassModel;
  combinedSummary: string;
  reflectivePractice: string;
  blueprintLines: string[];
};

const TONE_SCORE: Record<CompatTone, number> = {
  Amazing: 4,
  Favourable: 3,
  Neutral: 2,
  Challenging: 1,
};

const STATE_META: Record<
  VisualToneState,
  { label: string; symbol: string; intensity: number; dashed: boolean }
> = {
  radiant: { label: "Radiant", symbol: "✦", intensity: 1, dashed: false },
  supportive: { label: "Supportive", symbol: "↑", intensity: 0.78, dashed: false },
  balanced: { label: "Balanced", symbol: "·", intensity: 0.52, dashed: false },
  friction: { label: "Friction", symbol: "⚠", intensity: 0.34, dashed: true },
};

const CHANNEL_STROKE: Record<CompatChannel | "team", string> = {
  romantic: "rgb(190 90 110)",
  business: "rgb(45 70 110)",
  friendship: "rgb(45 122 120)",
  team: "rgb(45 70 110)",
};

const VEDIC_CHANNEL_LABEL: Record<CompatChannel | "team", string> = {
  romantic: "Rasa",
  business: "Karma",
  friendship: "Sangha",
  team: "Sangha",
};

export function toneToVisualState(tone: string): VisualToneState {
  if (tone === "—") return "balanced";
  const n = normalizeCompatTone(tone);
  if (n === "Amazing") return "radiant";
  if (n === "Favourable") return "supportive";
  if (n === "Challenging") return "friction";
  if (n === "Neutral") return "balanced";
  return "balanced";
}

export function resolveCompatTone(tone: string): CompatTone {
  if (tone === "—") return "Neutral";
  const n = normalizeCompatTone(tone);
  if (n === "Amazing" || n === "Favourable" || n === "Neutral" || n === "Challenging") {
    return n;
  }
  return "Neutral";
}

export function blendTones(tones: CompatTone[]): CompatTone {
  if (!tones.length) return "Neutral";
  const avg =
    tones.reduce((sum, t) => sum + TONE_SCORE[t], 0) / tones.length;
  if (avg >= 3.5) return "Amazing";
  if (avg >= 2.5) return "Favourable";
  if (avg >= 1.75) return "Neutral";
  return "Challenging";
}

function trait(n: number): string {
  return CORE_TRAIT[n] ?? `themes of ${n}`;
}

function channelDynamics(
  channel: CompatChannel | "team",
  tone: CompatTone,
  self: number,
  partner: number,
): string {
  const a = trait(self);
  const b = trait(partner);
  if (channel === "romantic") {
    if (tone === "Amazing") {
      return `Warm chemistry may feel easy to start between ${a.toLowerCase()} and ${b.toLowerCase()}. Closeness still needs care and clear talk.`;
    }
    if (tone === "Favourable") {
      return `Supportive personal tone — goodwill may come more readily when both stay curious and kind.`;
    }
    if (tone === "Challenging") {
      return `Differences may show up quickly in closeness. Patience, pacing, and honest boundaries help more than forcing harmony.`;
    }
    return `Mixed personal rhythm — some ease, some stretch. Outcomes depend on effort and mutual respect.`;
  }
  if (channel === "business" || channel === "team") {
    if (tone === "Amazing") {
      return `Cooperative work rhythm may feel natural — structured support with shared drive when roles stay clear.`;
    }
    if (tone === "Favourable") {
      return `Teamwork may feel mutually supportive. Decision pace improves when expectations are named early.`;
    }
    if (tone === "Challenging") {
      return `Work friction may appear around pace or control. Written agreements and calm check-ins reduce heat.`;
    }
    return `Collaboration is situational — strong when goals align; stretch when priorities diverge.`;
  }
  if (tone === "Amazing") {
    return `Easy camaraderie and steady mutual support — a natural social affinity in tradition.`;
  }
  if (tone === "Favourable") {
    return `Friendship may feel welcoming and reliable when both give space and show up consistently.`;
  }
  if (tone === "Challenging") {
    return `Social tone may need extra grace — differences in energy or boundaries ask for kindness, not judgment.`;
  }
  return `Friendship rhythm is mixed — some shared ease, some need for intentional reconnection.`;
}

function combinedSummaryLine(
  partner: number,
  channels: CompatChannelVisual[],
  center: VisualToneState,
): string {
  const bits = channels.map((c) => {
    const soft =
      c.id === "romantic"
        ? "romantic warmth"
        : c.id === "business" || c.id === "team"
          ? "cooperative work rhythm"
          : "easy friendship flow";
    if (c.state === "radiant" || c.state === "supportive") return soft;
    if (c.state === "friction") {
      return c.id === "romantic"
        ? "careful romantic pacing"
        : c.id === "business" || c.id === "team"
          ? "deliberate work boundaries"
          : "patient friendship care";
    }
    return c.id === "romantic"
      ? "mixed personal tone"
      : c.id === "business" || c.id === "team"
        ? "situational collaboration"
        : "mixed social ease";
  });
  const unique = [...new Set(bits)];
  const stateWord = STATE_META[center].label.toLowerCase();
  return `Partner ${partner} forms a ${stateWord} tri-bond with you — ${unique.join(", ")}.`;
}

export function buildCompatCompass(input: {
  selfNumber: number;
  partner: number;
  romantic: string;
  business: string;
  friendship: string;
  hideRomantic?: boolean;
  /** Attach Vedic planet glyph for partner center */
  vedicPlanet?: boolean;
  systemLabel?: string;
}): CompatCompassModel {
  const hideRomantic = Boolean(input.hideRomantic);
  const self = reduceToSingleDigit(input.selfNumber);
  const partner = reduceToSingleDigit(input.partner);

  const defs: {
    id: CompatChannel | "team";
    label: string;
    toneRaw: string;
    hintKey: CompatChannel | "team";
  }[] = hideRomantic
    ? [
        {
          id: "business",
          label: "Business",
          toneRaw: input.business,
          hintKey: "team",
        },
        {
          id: "friendship",
          label: "Friendship",
          toneRaw: input.friendship,
          hintKey: "friendship",
        },
        {
          id: "team",
          label: "Team",
          toneRaw: input.business,
          hintKey: "team",
        },
      ]
    : [
        {
          id: "romantic",
          label: "Romantic",
          toneRaw: input.romantic,
          hintKey: "romantic",
        },
        {
          id: "business",
          label: "Business",
          toneRaw: input.business,
          hintKey: "business",
        },
        {
          id: "friendship",
          label: "Friendship",
          toneRaw: input.friendship,
          hintKey: "friendship",
        },
      ];

  const channels: CompatChannelVisual[] = defs.map((d) => {
    const tone = resolveCompatTone(d.toneRaw);
    const state = toneToVisualState(tone);
    const meta = STATE_META[state];
    const dynChannel: CompatChannel | "team" =
      d.id === "team" ? "team" : d.id;
    return {
      id: d.id,
      label: d.label,
      vedicLabel: VEDIC_CHANNEL_LABEL[d.id],
      tone,
      state,
      stateLabel: meta.label,
      symbol: meta.symbol,
      stroke: CHANNEL_STROKE[d.id],
      intensity: meta.intensity,
      dashed: meta.dashed,
      insight: CHANNEL_HINT[d.hintKey],
      dynamics: channelDynamics(dynChannel, tone, self, partner),
    };
  });

  const centerTone = blendTones(channels.map((c) => c.tone));
  const centerState = toneToVisualState(centerTone);
  const centerMeta = STATE_META[centerState];
  const summary = combinedSummaryLine(partner, channels, centerState);
  const practice =
    centerState === "friction"
      ? "Reflective practice: name one boundary and one appreciation before revisiting a hard topic."
      : centerState === "balanced"
        ? "Reflective practice: notice where ease already exists, then give one stretch area a calm weekly check-in."
        : "Reflective practice: keep the natural ease, and still schedule small honest conversations so goodwill stays grounded.";

  const system = input.systemLabel ?? "Compatibility";
  const blueprintLines = [
    `${system} Compass · partner ${partner} · ${centerMeta.label} (${centerTone})`,
    summary,
    ...channels.map(
      (c) =>
        `${c.label}: ${c.stateLabel} / ${c.tone} — ${c.dynamics}`,
    ),
    practice,
  ];

  return {
    partner,
    partnerPlanet: input.vedicPlanet ? planetForVedic(partner) : null,
    hideRomantic,
    channels,
    centerState,
    centerLabel: centerMeta.label,
    centerSymbol: centerMeta.symbol,
    combinedSummary: summary,
    reflectivePractice: practice,
    blueprintLines,
  };
}

function grahaLayerDynamics(
  id: GrahaLayerId,
  tone: CompatTone,
  selfPlanet: PlanetInfo,
  partnerPlanet: PlanetInfo,
): string {
  const pair = `${selfPlanet.name} with ${partnerPlanet.name}`;
  if (id === "moolank") {
    if (tone === "Amazing" || tone === "Favourable") {
      return `Day-to-day temperaments (${pair}) may support each other’s edge. Closeness can start easily, and still needs grounding.`;
    }
    if (tone === "Challenging") {
      return `Psychic rhythm (${pair}) may spark quickly. Soften first reactions with pause and clear language.`;
    }
    return `Mixed day-to-day chemistry (${pair}) — some instant rapport, some need for pacing.`;
  }
  if (id === "bhagyank") {
    if (tone === "Amazing" || tone === "Favourable") {
      return `Long-path tones (${pair}) may blend supportively — direction and collaboration can feel aligned when roles stay clear.`;
    }
    if (tone === "Challenging") {
      return `Destiny tones (${pair}) may pull differently. Shared milestones and honest timelines reduce karmic-feeling friction.`;
    }
    return `Life-direction mix (${pair}) is situational — strong when goals rhyme, stretch when timelines diverge.`;
  }
  if (tone === "Amazing" || tone === "Favourable") {
    return `Outer-face tones (${pair}) may add clarity and ease in social settings — friendship and presentation can feel mutually supportive.`;
  }
  if (tone === "Challenging") {
    return `Name / social face (${pair}) may read differently in rooms. Agree on how you show up together before high-stakes settings.`;
  }
  return `Social presentation (${pair}) is mixed — some easy flow, some need for intentional bridging.`;
}

export function buildGrahaMandala(input: {
  moolank: number;
  bhagyank: number;
  namank: number;
  partner: number;
  /** Per-layer channel tones for the selected partner */
  moolankRow: { romantic: string; business: string; friendship: string };
  bhagyankRow: { romantic: string; business: string; friendship: string };
  namankRow: { romantic: string; business: string; friendship: string };
  hideRomantic?: boolean;
}): GrahaMandalaModel {
  const partner = reduceToSingleDigit(input.partner);
  const partnerPlanet = planetForVedic(partner);
  const hideRomantic = Boolean(input.hideRomantic);

  const layerDefs: {
    id: GrahaLayerId;
    label: string;
    shortLabel: string;
    digit: number;
    row: { romantic: string; business: string; friendship: string };
  }[] = [
    {
      id: "moolank",
      label: "Psychic (Moolank)",
      shortLabel: "Psychic",
      digit: reduceToSingleDigit(input.moolank),
      row: input.moolankRow,
    },
    {
      id: "bhagyank",
      label: "Destiny (Bhagyank)",
      shortLabel: "Destiny",
      digit: reduceToSingleDigit(input.bhagyank),
      row: input.bhagyankRow,
    },
    {
      id: "namank",
      label: "Name (Namank)",
      shortLabel: "Name",
      digit: reduceToSingleDigit(input.namank),
      row: input.namankRow,
    },
  ];

  const yourLayers: GrahaLayerCard[] = layerDefs.map((layer) => {
    const channelTones = hideRomantic
      ? [
          resolveCompatTone(layer.row.business),
          resolveCompatTone(layer.row.friendship),
        ]
      : [
          resolveCompatTone(layer.row.romantic),
          resolveCompatTone(layer.row.business),
          resolveCompatTone(layer.row.friendship),
        ];
    const tone = blendTones(channelTones);
    const state = toneToVisualState(tone);
    const planet = planetForVedic(layer.digit);
    return {
      id: layer.id,
      label: layer.label,
      shortLabel: layer.shortLabel,
      digit: layer.digit,
      planet,
      tone,
      state,
      stateLabel: STATE_META[state].label,
      dynamics: grahaLayerDynamics(layer.id, tone, planet, partnerPlanet),
    };
  });

  const romantic = blendTones(
    layerDefs.map((l) => resolveCompatTone(l.row.romantic)),
  );
  const business = blendTones(
    layerDefs.map((l) => resolveCompatTone(l.row.business)),
  );
  const friendship = blendTones(
    layerDefs.map((l) => resolveCompatTone(l.row.friendship)),
  );

  const compass = buildCompatCompass({
    selfNumber: input.bhagyank,
    partner,
    romantic,
    business,
    friendship,
    hideRomantic,
    vedicPlanet: true,
    systemLabel: "Vedic Graha Mandala",
  });

  // Prefer Vedic arc labels in blueprint for mandala mode
  const arcs = compass.channels
    .map(
      (c) =>
        `${c.vedicLabel} (${c.label}): ${c.stateLabel} / ${c.tone}`,
    )
    .join(" · ");

  const planetLine = yourLayers
    .map((l) => `${l.planet.name} (${l.digit})`)
    .join(", ");

  const combinedSummary = `${planetLine} meet partner ${partnerPlanet.name} (${partner}) — ${compass.centerLabel.toLowerCase()} tri-tone across Rasa, Karma, and Sangha.`;

  const practice =
    "Reflective practice: honour each layer’s planet tone without forcing one story — notice day-to-day, long path, and outer face separately.";

  return {
    partner,
    partnerPlanet,
    yourLayers,
    compass: {
      ...compass,
      combinedSummary,
      reflectivePractice: practice,
    },
    combinedSummary,
    reflectivePractice: practice,
    blueprintLines: [
      `Vedic Compatibility Mandala · partner ${partner} (${partnerPlanet.name})`,
      combinedSummary,
      arcs,
      ...yourLayers.map(
        (l) =>
          `${l.shortLabel} ${l.digit} ${l.planet.symbol}: ${l.stateLabel} / ${l.tone} — ${l.dynamics}`,
      ),
      practice,
    ],
  };
}

export function visualStateLegend(): {
  state: VisualToneState;
  label: string;
  symbol: string;
  tone: CompatTone;
  hint: string;
}[] {
  return [
    {
      state: "radiant",
      label: "Radiant",
      symbol: "✦",
      tone: "Amazing",
      hint: "Bright affinity in tradition — still needs care.",
    },
    {
      state: "supportive",
      label: "Supportive",
      symbol: "↑",
      tone: "Favourable",
      hint: "Generally lifting cooperation and goodwill.",
    },
    {
      state: "balanced",
      label: "Balanced",
      symbol: "·",
      tone: "Neutral",
      hint: "Mixed / situational — effort shapes the tone.",
    },
    {
      state: "friction",
      label: "Friction",
      symbol: "⚠",
      tone: "Challenging",
      hint: "Heat that asks for patience and clear boundaries.",
    },
  ];
}
