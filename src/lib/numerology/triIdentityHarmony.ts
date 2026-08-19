/**
 * Tri-Identity Harmony — Birth × Destiny × Name as pair dynamics + center score.
 * Builds on trioMatrix lookups. Reflective only.
 */

import { CORE_TRAIT } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import {
  TRIO_BAND_ICON,
  type TrioBand,
  type TrioHit,
  type TrioSystem,
} from "./trioMatrix";

export type HarmonyPairId = "birth-destiny" | "destiny-name" | "birth-name";

export type HarmonyPair = {
  id: HarmonyPairId;
  fromLabel: string;
  toLabel: string;
  from: number;
  to: number;
  band: TrioBand;
  icon: string;
  /** SVG stroke width hint */
  strokeWidth: number;
  /** CSS-ish stroke color */
  stroke: string;
  dashed: boolean;
  title: string;
  narrative: string;
};

export type TriIdentityHarmony = {
  system: TrioSystem;
  birth: number;
  destiny: number;
  name: number;
  birthLabel: string;
  destinyLabel: string;
  nameLabel: string;
  centerBand: TrioBand;
  centerLabel: string;
  centerWord: string;
  pairs: HarmonyPair[];
  narrative: string;
  growthAdvice: string;
  reflectivePractice: string;
  blueprintLines: string[];
};

const BAND_WORD: Record<TrioBand, string> = {
  amazing: "Superb harmony",
  favourable: "Strong harmony",
  neutral: "Moderate harmony",
  friction: "Mixed harmony",
  block: "Challenging harmony",
};

const BAND_STROKE: Record<TrioBand, { width: number; color: string; dashed: boolean }> = {
  amazing: { width: 3.2, color: "rgb(16 185 129)", dashed: false },
  favourable: { width: 2.4, color: "rgb(45 122 120)", dashed: false },
  neutral: { width: 1.6, color: "rgb(180 83 9 / 0.75)", dashed: false },
  friction: { width: 1.8, color: "rgb(217 119 6)", dashed: true },
  block: { width: 1.4, color: "rgb(190 18 60 / 0.75)", dashed: true },
};

/** Soft pairwise affinity for Birth↔Destiny / Birth↔Name when no dedicated pair table. */
const SOFT_FAV: Record<number, number[]> = {
  1: [1, 3, 5, 9],
  2: [2, 4, 6, 8],
  3: [1, 3, 5, 6, 9],
  4: [2, 4, 6, 8],
  5: [1, 3, 5, 7, 9],
  6: [2, 3, 4, 6, 8, 9],
  7: [1, 4, 5, 7],
  8: [2, 4, 6, 8],
  9: [1, 3, 5, 6, 9],
};

const SOFT_CARE: Record<number, number[]> = {
  1: [4, 8],
  2: [1, 9],
  3: [4, 7],
  4: [1, 5],
  5: [4],
  6: [1, 7],
  7: [3, 8],
  8: [1, 9],
  9: [4, 8],
};

function trait(n: number): string {
  return CORE_TRAIT[n] ?? CORE_TRAIT[reduceToSingleDigit(n)] ?? `Tone ${n}`;
}

function softPairBand(a: number, b: number): TrioBand {
  if (a === b) return "favourable";
  if (SOFT_FAV[a]?.includes(b) && SOFT_FAV[b]?.includes(a)) return "amazing";
  if (SOFT_FAV[a]?.includes(b) || SOFT_FAV[b]?.includes(a)) return "favourable";
  if (SOFT_CARE[a]?.includes(b) || SOFT_CARE[b]?.includes(a)) return "friction";
  return "neutral";
}

function pairStroke(band: TrioBand) {
  return BAND_STROKE[band];
}

function makePair(
  id: HarmonyPairId,
  fromLabel: string,
  toLabel: string,
  from: number,
  to: number,
  band: TrioBand,
  title: string,
  narrative: string,
): HarmonyPair {
  const s = pairStroke(band);
  return {
    id,
    fromLabel,
    toLabel,
    from,
    to,
    band,
    icon: TRIO_BAND_ICON[band],
    strokeWidth: s.width,
    stroke: s.color,
    dashed: s.dashed,
    title,
    narrative,
  };
}

function systemVertexLabels(system: TrioSystem): {
  birth: string;
  destiny: string;
  name: string;
} {
  if (system === "pythagorean") {
    return {
      birth: "Birth Day",
      destiny: "Life Path",
      name: "Expression",
    };
  }
  if (system === "chaldean") {
    return {
      birth: "Birth",
      destiny: "Destiny",
      name: "Chaldean name",
    };
  }
  return { birth: "Psychic", destiny: "Destiny", name: "Name" };
}

/**
 * @param hit Combined trio result from vedicTrio / chaldeanTrio / pythagoreanTrio
 * @param pairBands Optional exact bands; destinyName defaults to hit.band
 */
export function buildTriIdentityHarmony(
  hit: TrioHit,
  opts?: {
    birthDestinyBand?: TrioBand;
    birthNameBand?: TrioBand;
  },
): TriIdentityHarmony {
  const labels = systemVertexLabels(hit.system);
  const b = hit.birth;
  const d = hit.destiny;
  const n = hit.name;

  const destinyNameBand = hit.band;
  const birthDestinyBand = opts?.birthDestinyBand ?? softPairBand(b, d);
  const birthNameBand = opts?.birthNameBand ?? softPairBand(b, n);

  const pairs: HarmonyPair[] = [
    makePair(
      "birth-destiny",
      labels.birth,
      labels.destiny,
      b,
      d,
      birthDestinyBand,
      `${labels.birth} ${b} → ${labels.destiny} ${d}`,
      `${trait(b)} meeting ${trait(d)} — how the innate tone may support the longer path.`,
    ),
    makePair(
      "destiny-name",
      labels.destiny,
      labels.name,
      d,
      n,
      destinyNameBand,
      `${labels.destiny} ${d} → ${labels.name} ${n}`,
      `${trait(d)} meeting ${trait(n)} — how the name tone may color the path.`,
    ),
    makePair(
      "birth-name",
      labels.birth,
      labels.name,
      b,
      n,
      birthNameBand,
      `${labels.birth} ${b} → ${labels.name} ${n}`,
      `${trait(b)} meeting ${trait(n)} — how the name interacts with the innate tone.`,
    ),
  ];

  const centerBand = hit.band;
  const centerWord = BAND_WORD[centerBand];
  const centerLabel = hit.label;

  const narrative = [
    `These three tones form a ${centerWord.toLowerCase().replace(" harmony", "")} triad (${centerLabel}).`,
    `${trait(b)} (${b}) grounds the base; ${trait(d)} (${d}) holds the path; ${trait(n)} (${n}) sits at the apex.`,
    hit.summary,
    "Ease may show up more readily with supportive combinations — ordinary effort still matters. Reflective reading only.",
  ].join(" ");

  const growthAdvice =
    centerBand === "amazing" || centerBand === "favourable"
      ? "Lean into the supportive pairs without assuming automatic ease — keep one weekly practice that joins all three tones."
      : centerBand === "friction" || centerBand === "block"
        ? "Treat heat as information: slow decisions where the challenging line sits, and borrow habits from the stronger edge."
        : "Notice which pair feels easiest this month and build from that edge rather than forcing the whole triangle.";

  const reflectivePractice = `This week: name one moment when ${labels.birth} ${b}, ${labels.destiny} ${d}, and ${labels.name} ${n} showed up in the same day — write one sentence for each.`;

  const blueprintLines = [
    `${labels.birth} ${b} · ${labels.destiny} ${d} · ${labels.name} ${n} → ${centerWord} (${centerLabel})`,
    ...pairs.map(
      (p) =>
        `${p.icon} ${p.title}: ${p.narrative}`,
    ),
    `Growth: ${growthAdvice}`,
    `Practice: ${reflectivePractice}`,
  ];

  return {
    system: hit.system,
    birth: b,
    destiny: d,
    name: n,
    birthLabel: labels.birth,
    destinyLabel: labels.destiny,
    nameLabel: labels.name,
    centerBand,
    centerLabel,
    centerWord,
    pairs,
    narrative,
    growthAdvice,
    reflectivePractice,
    blueprintLines,
  };
}
