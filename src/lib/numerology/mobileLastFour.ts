/**
 * Last-four active tail: receiver/caller school (Numora), not a universal map.
 * Last-four total is metadata; the root is what is compared to BN/DN.
 * Traditional reading only.
 */

import {
  isAdverseKind,
  meanNormalizedPairs,
  normalizePairRaw,
  slidingPairs,
  type CompoundPair,
} from "./mobileCompoundPairs";
import { pairPurposeAffinities } from "./mobilePairMatrix";
import { mobileCompound, mobileCore } from "./mobileNumber";
import { alignmentPoints } from "./mobileRootFit";

export type LastFourRole =
  | "receiverOuter"
  | "receiverEmotion"
  | "callerTone"
  | "callerOutcome";

export type LastFourDirection =
  | "rising"
  | "falling"
  | "mixed"
  | "level"
  | "paused";

export type LastFourPattern =
  | "rising"
  | "falling"
  | "alternate"
  | "repeat"
  | "mirror"
  | "abrupt"
  | "mixed"
  | "paused";

export type LastFourSlotTone = "clean" | "watch" | "conflict";

export type MobilePurpose =
  | "business"
  | "career"
  | "relationships"
  | "networking"
  | "wealth"
  | "personal";

export type LastFourSlot = {
  role: LastFourRole;
  index: number;
  digit: number;
  isZero: boolean;
  raw: number;
  note: string;
  label: string;
  hint: string;
  tone: LastFourSlotTone;
};

export type LastFourLayers = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
};

export type LastFourAnalysis = {
  digits: string;
  compound: number;
  root: number;
  slots: LastFourSlot[];
  pairs: CompoundPair[];
  direction: LastFourDirection;
  directionNote: string;
  pattern: LastFourPattern;
  patternNote: string;
  layers: LastFourLayers;
  bnTonePoints: number;
  dnTonePoints: number;
  /** 0–5 sequence slice = L4-A…E. */
  points: number;
  schoolNote: string;
};

export type PurposeScores = Record<MobilePurpose, number>;

export const LAST_FOUR_LAYER_MAX: LastFourLayers = {
  a: 2.5,
  b: 1,
  c: 1,
  d: 0.5,
  e: 0.5,
};

export const LAST_FOUR_LAYER_LABEL: Record<keyof LastFourLayers, string> = {
  a: "L4-A · slots",
  b: "L4-B · D7–D8",
  c: "L4-C · D9–D10",
  d: "L4-D · pattern",
  e: "L4-E · zeros",
};

const ROLES: {
  role: LastFourRole;
  label: string;
  hint: string;
}[] = [
  {
    role: "receiverOuter",
    label: "You — how you come across",
    hint: "First of the last four",
  },
  {
    role: "receiverEmotion",
    label: "You — how you feel in the exchange",
    hint: "Second of the last four",
  },
  {
    role: "callerTone",
    label: "Incoming tone",
    hint: "Third of the last four",
  },
  {
    role: "callerOutcome",
    label: "Outcome of the contact",
    hint: "Last digit",
  },
];

/** 0–5 quality of digit 0–9 in each last-four role. 0 is a weaken, not a grid cell. */
const ROLE_RAW: Record<LastFourRole, number[]> = {
  receiverOuter: [1.6, 4.2, 3.2, 4.8, 2.2, 4.8, 3.6, 2.4, 2.2, 4.2],
  receiverEmotion: [1.2, 3.2, 4.8, 3.6, 2.0, 3.6, 4.8, 2.6, 2.0, 3.4],
  callerTone: [1.2, 3.6, 4.2, 4.2, 2.2, 4.2, 4.2, 2.6, 2.2, 4.2],
  callerOutcome: [0.8, 4.6, 3.2, 3.6, 2.2, 4.2, 4.6, 2.2, 3.2, 4.2],
};

/** Engine-design zero multipliers, not traditional constants. */
const ZERO_MULT: Record<LastFourRole, number> = {
  receiverOuter: 0.8,
  receiverEmotion: 0.75,
  callerTone: 0.75,
  callerOutcome: 0.65,
};

const ROLE_NOTE: Record<LastFourRole, string[]> = {
  receiverOuter: [
    "Expression in this slot is thinned — the opening of the last four is quieter.",
    "A direct, lead-from-the-front opening.",
    "A softer, cooperative opening.",
    "A bright, talkative opening.",
    "A structured, slower opening.",
    "A quick, Mercury-style opening.",
    "A warm, ease-first opening.",
    "A private, inward opening.",
    "A duty-heavy opening that can feel slow.",
    "A high-energy opening.",
  ],
  receiverEmotion: [
    "Your emotional slot is thinned — the feel of the exchange is less defined.",
    "A self-led emotional tone.",
    "A receptive, people-first emotional tone.",
    "An expressive, sometimes scattered emotional tone.",
    "A contained, cautious emotional tone.",
    "A restless, fast emotional tone.",
    "A harmony-seeking emotional tone.",
    "A withdrawn emotional tone.",
    "A heavy, delayed emotional tone.",
    "A heated emotional tone.",
  ],
  callerTone: [
    "Incoming tone is thinned — what arrives is less distinct.",
    "Incoming contacts lean independent and initiating.",
    "Incoming contacts lean personal and collaborative.",
    "Incoming contacts lean social and vocal.",
    "Incoming contacts lean formal or effortful.",
    "Incoming contacts lean busy and varied.",
    "Incoming contacts lean warm and material-ease.",
    "Incoming contacts lean sparse or inward.",
    "Incoming contacts lean serious or delayed.",
    "Incoming contacts lean urgent and forceful.",
  ],
  callerOutcome: [
    "The last digit is 0, so the outcome/wealth slot is the most weakened of the four.",
    "Outcomes lean toward new starts and lead roles.",
    "Outcomes lean toward people and pairing.",
    "Outcomes lean toward visibility and talk.",
    "Outcomes lean toward systems and slow build.",
    "Outcomes lean toward movement and trade.",
    "Outcomes lean toward comfort, money-ease, and close ties.",
    "Outcomes lean toward research and fewer, deeper contacts.",
    "Outcomes lean toward duty, delay, and earned gains.",
    "Outcomes lean toward push, close, and high heat.",
  ],
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function slotRaw(role: LastFourRole, digit: number): number {
  return ROLE_RAW[role][digit] ?? 2;
}

function patternDirection(digits: string): {
  direction: LastFourDirection;
  note: string;
} {
  const vals = digits.split("").map(Number);
  const nonzero = vals.filter((d) => d !== 0);
  if (nonzero.length <= 1) {
    return {
      direction: "paused",
      note: "Zeroes break a clean rise or fall, so the last four do not run as one slope.",
    };
  }
  let up = 0;
  let down = 0;
  for (let i = 1; i < nonzero.length; i++) {
    if (nonzero[i]! > nonzero[i - 1]!) up += 1;
    else if (nonzero[i]! < nonzero[i - 1]!) down += 1;
  }
  const steps = nonzero.length - 1;
  if (up === steps) {
    return {
      direction: "rising",
      note: "The last four climb. Traditional last-four work treats a rising tail as more progressive.",
    };
  }
  if (down === steps) {
    return {
      direction: "falling",
      note: "The last four fall. Traditional last-four work treats a descending tail as less progressive.",
    };
  }
  if (up === 0 && down === 0) {
    return {
      direction: "level",
      note: "The last four sit on one digit. Intensity is high; direction is flat.",
    };
  }
  return {
    direction: "mixed",
    note: "The last four mix rise and fall, so the tail is an ordered sequence — not a bag of four digits.",
  };
}

function lastFourPattern(digits: string): {
  pattern: LastFourPattern;
  note: string;
  score: number;
} {
  const d = digits.split("").map(Number);
  const slope = patternDirection(digits);

  if (d[0] === d[1] && d[1] === d[2] && d[2] === d[3]) {
    return {
      pattern: "repeat",
      note: "All four slots repeat one digit — intensity is high; the tail does not travel.",
      score: 0.22,
    };
  }
  if (d[0] === d[2] && d[1] === d[3] && d[0] !== d[1]) {
    const named = digits === "5656" ? " (5656)" : "";
    return {
      pattern: "alternate",
      note: `The last four alternate two digits${named} — a pulse, not a climb.`,
      score: 0.4,
    };
  }
  if (d[0] === d[3] && d[1] === d[2] && d[0] !== d[1]) {
    return {
      pattern: "mirror",
      note: "The last four mirror (outer digits match, inner digits match).",
      score: 0.36,
    };
  }

  let maxJump = 0;
  for (let i = 1; i < 4; i++) {
    if (d[i] === 0 || d[i - 1] === 0) continue;
    maxJump = Math.max(maxJump, Math.abs(d[i]! - d[i - 1]!));
  }
  if (maxJump >= 7) {
    return {
      pattern: "abrupt",
      note: "An abrupt jump between neighbouring last-four digits breaks a smooth tail.",
      score: 0.18,
    };
  }
  if (slope.direction === "rising") {
    return { pattern: "rising", note: slope.note, score: 0.48 };
  }
  if (slope.direction === "falling") {
    return { pattern: "falling", note: slope.note, score: 0.16 };
  }
  if (slope.direction === "paused") {
    return { pattern: "paused", note: slope.note, score: 0.18 };
  }
  return { pattern: "mixed", note: slope.note, score: 0.28 };
}

function slotTone(isZero: boolean): LastFourSlotTone {
  return isZero ? "conflict" : "clean";
}

function layerA(slots: LastFourSlot[]): number {
  const mean =
    slots.reduce((s, sl) => {
      const q = sl.raw / 5;
      const z = sl.isZero ? ZERO_MULT[sl.role] : 1;
      return s + q * z;
    }, 0) / slots.length;
  return clamp(2.5 * mean, 0, LAST_FOUR_LAYER_MAX.a);
}

function layerFromPair(pair: CompoundPair | undefined, max: number): number {
  if (!pair) return max * 0.5;
  return clamp(max * normalizePairRaw(pair.raw), 0, max);
}

function layerE(digits: string, pairs: CompoundPair[]): number {
  const zeros = digits.split("").filter((c) => c === "0").length;
  if (zeros === 0) return LAST_FOUR_LAYER_MAX.e;
  let pts = LAST_FOUR_LAYER_MAX.e;
  pts -= zeros * 0.07;
  if (digits[3] === "0") pts -= 0.12;
  for (const p of pairs) {
    if (p.pair.includes("0") && isAdverseKind(p.kind)) pts -= 0.08;
  }
  return clamp(pts, 0, LAST_FOUR_LAYER_MAX.e);
}

export function analyzeLastFour(
  fullDigits: string,
  birthNumber: number,
  destinyNumber: number,
): LastFourAnalysis | null {
  if (fullDigits.length < 4) return null;
  const digits = fullDigits.slice(-4);
  const tenDigit = fullDigits.length === 10;
  const compound = mobileCompound(digits);
  const root = mobileCore(compound || 9);
  const slope = patternDirection(digits);
  const patterned = lastFourPattern(digits);
  const pairs = slidingPairs(digits);

  const slots: LastFourSlot[] = ROLES.map((meta, i) => {
    const digit = Number(digits[i]);
    const hint = tenDigit
      ? `${7 + i}th digit`
      : `${meta.hint} of the active tail`;
    const isZero = digit === 0;
    return {
      role: meta.role,
      index: i,
      digit,
      isZero,
      raw: slotRaw(meta.role, digit),
      note: ROLE_NOTE[meta.role][digit] ?? "A mixed last-four slot.",
      label: meta.label,
      hint,
      tone: slotTone(isZero),
    };
  });

  const layers: LastFourLayers = {
    a: layerA(slots),
    b: layerFromPair(pairs[0], LAST_FOUR_LAYER_MAX.b),
    c: layerFromPair(pairs[2], LAST_FOUR_LAYER_MAX.c),
    d: clamp(patterned.score, 0, LAST_FOUR_LAYER_MAX.d),
    e: layerE(digits, pairs),
  };
  const bnTonePoints = alignmentPoints(birthNumber, root);
  const dnTonePoints = alignmentPoints(destinyNumber, root);
  const points = clamp(
    layers.a + layers.b + layers.c + layers.d + layers.e,
    0,
    5,
  );

  return {
    digits,
    compound,
    root,
    slots,
    pairs,
    direction: slope.direction,
    directionNote: slope.note,
    pattern: patterned.pattern,
    patternNote: patterned.note,
    layers,
    bnTonePoints,
    dnTonePoints,
    points,
    schoolNote:
      "Last-4 positional model — Numora receiver/caller school. Traditional reading only; other schools map these four slots differently.",
  };
}

export const PURPOSE_LABEL: Record<MobilePurpose, string> = {
  business: "Business",
  career: "Career",
  relationships: "Relationships",
  networking: "Networking",
  wealth: "Wealth",
  personal: "Personal",
};

function slot01(analysis: LastFourAnalysis, role: LastFourRole): number {
  const sl = analysis.slots.find((s) => s.role === role);
  return (sl?.raw ?? 2) / 5;
}

function meanPairAff(
  pairs: CompoundPair[],
  key: keyof ReturnType<typeof pairPurposeAffinities>,
): number {
  if (pairs.length === 0) return 0.4;
  const sum = pairs.reduce(
    (s, p) => s + pairPurposeAffinities(p.pair)[key] / 5,
    0,
  );
  return sum / pairs.length;
}

export function scorePurposeSuitability(
  analysis: LastFourAnalysis,
  core: number,
  birthNumber: number,
  destinyNumber: number,
): PurposeScores {
  const g = slot01(analysis, "receiverOuter");
  const h = slot01(analysis, "receiverEmotion");
  const i = slot01(analysis, "callerTone");
  const j = slot01(analysis, "callerOutcome");
  const d10 = analysis.slots.find((s) => s.role === "callerOutcome")?.digit ?? 0;
  const lastRoot =
    (analysis.bnTonePoints + analysis.dnTonePoints) / 2 / 25;
  const coreFit =
    (alignmentPoints(birthNumber, core) +
      alignmentPoints(destinyNumber, core)) /
    2 /
    25;
  const pair01 = meanNormalizedPairs(analysis.pairs);
  const meanSlots = (g + h + i + j) / 4;
  const seq01 = analysis.points / 5;
  const pairBiz = meanPairAff(analysis.pairs, "business");
  const pairCareer = meanPairAff(analysis.pairs, "career");
  const pairRel = meanPairAff(analysis.pairs, "relationship");
  const pairWealth = meanPairAff(analysis.pairs, "wealth");
  const pairNet = meanPairAff(analysis.pairs, "networking");
  const d10Business = d10 === 5 ? 1 : d10 === 0 ? 0.2 : 0.7;
  const wealthSlot = d10 === 0 ? j * 0.45 : j;

  const pct = (...parts: number[]) =>
    Math.round(clamp(parts.reduce((s, p) => s + p, 0) * 100, 0, 100));

  return {
    business: pct(
      0.18 * g,
      0.18 * i,
      0.22 * j,
      0.12 * d10Business,
      0.16 * lastRoot,
      0.14 * pairBiz,
    ),
    career: pct(
      0.22 * g,
      0.22 * j,
      0.2 * seq01,
      0.2 * coreFit,
      0.16 * pairCareer,
    ),
    relationships: pct(
      0.28 * h,
      0.22 * i,
      0.18 * j,
      0.16 * lastRoot,
      0.16 * pairRel,
    ),
    networking: pct(
      0.26 * g,
      0.22 * i,
      0.22 * j,
      0.14 * lastRoot,
      0.16 * pairNet,
    ),
    wealth: pct(
      0.08 * g,
      0.42 * wealthSlot,
      0.18 * lastRoot,
      0.16 * coreFit,
      0.16 * pairWealth,
    ),
    personal: pct(
      0.28 * h,
      0.24 * meanSlots,
      0.22 * lastRoot,
      0.16 * coreFit,
      0.1 * pair01,
    ),
  };
}
