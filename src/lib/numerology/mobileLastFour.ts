/**
 * Last-four active tail: receiver/caller school (Numora), not a universal map.
 * Last-four total is metadata; the root is what is compared to BN/DN.
 * Traditional reading only.
 */

import {
  meanNormalizedPairs,
  slidingPairs,
  type CompoundPair,
} from "./mobileCompoundPairs";
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
};

export type LastFourAnalysis = {
  digits: string;
  compound: number;
  root: number;
  slots: LastFourSlot[];
  pairs: CompoundPair[];
  direction: LastFourDirection;
  directionNote: string;
  bnTonePoints: number;
  dnTonePoints: number;
  /** 0–5 sequence slice. */
  points: number;
  schoolNote: string;
};

export type PurposeScores = Record<MobilePurpose, number>;

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

function directionScore01(direction: LastFourDirection): number {
  if (direction === "rising") return 0.85;
  if (direction === "level") return 0.5;
  if (direction === "mixed") return 0.55;
  if (direction === "paused") return 0.4;
  return 0.32;
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
  const pattern = patternDirection(digits);
  const pairs = slidingPairs(digits);

  const slots: LastFourSlot[] = ROLES.map((meta, i) => {
    const digit = Number(digits[i]);
    const hint = tenDigit
      ? `${7 + i}th digit`
      : `${meta.hint} of the active tail`;
    return {
      role: meta.role,
      index: i,
      digit,
      isZero: digit === 0,
      raw: slotRaw(meta.role, digit),
      note: ROLE_NOTE[meta.role][digit] ?? "A mixed last-four slot.",
      label: meta.label,
      hint,
    };
  });

  const positional01 =
    slots.reduce((s, sl) => s + sl.raw / 5, 0) / slots.length;
  const bnTonePoints = alignmentPoints(birthNumber, root);
  const dnTonePoints = alignmentPoints(destinyNumber, root);
  const root01 = (bnTonePoints + dnTonePoints) / 2 / 25;
  const points = clamp(
    5 *
      (0.5 * positional01 +
        0.2 * directionScore01(pattern.direction) +
        0.3 * root01),
    0,
    5,
  );

  return {
    digits,
    compound,
    root,
    slots,
    pairs,
    direction: pattern.direction,
    directionNote: pattern.note,
    bnTonePoints,
    dnTonePoints,
    points,
    schoolNote:
      "Last-four roles follow a receiver/caller school used in this engine — one traditional map among several, not a proven causal effect.",
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
  const lastRoot =
    (analysis.bnTonePoints + analysis.dnTonePoints) / 2 / 25;
  const coreFit =
    (alignmentPoints(birthNumber, core) +
      alignmentPoints(destinyNumber, core)) /
    2 /
    25;
  const pair01 = meanNormalizedPairs(analysis.pairs);
  const meanSlots = (g + h + i + j) / 4;

  const pct = (...parts: number[]) =>
    Math.round(clamp(parts.reduce((s, p) => s + p, 0) * 100, 0, 100));

  return {
    business: pct(0.22 * g, 0.2 * i, 0.26 * j, 0.18 * lastRoot, 0.14 * pair01),
    career: pct(0.18 * g, 0.22 * i, 0.24 * j, 0.22 * lastRoot, 0.14 * pair01),
    relationships: pct(
      0.3 * h,
      0.26 * i,
      0.18 * j,
      0.14 * lastRoot,
      0.12 * pair01,
    ),
    networking: pct(0.28 * g, 0.24 * i, 0.2 * j, 0.14 * lastRoot, 0.14 * pair01),
    wealth: pct(0.2 * g, 0.32 * j, 0.28 * lastRoot, 0.2 * pair01),
    personal: pct(
      0.24 * h,
      0.28 * meanSlots,
      0.28 * lastRoot,
      0.1 * coreFit,
      0.1 * pair01,
    ),
  };
}
