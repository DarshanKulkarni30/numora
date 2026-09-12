/**
 * Number-to-number harmony from the planetary pair table — not digit distance.
 * Same Personal Year is never rewritten; these edges only describe how two seats meet.
 */

import { pairTone, type CompatTone } from "@/lib/numerology/compatibility";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import { assertSafeCopy } from "@/lib/numerology/safety";

export type HarmonyKind = "supportive" | "neutral" | "tension" | "friction";

export type HarmonyEdge = {
  id: string;
  leftLabel: string;
  left: number;
  rightLabel: string;
  right: number;
  kind: HarmonyKind;
  kindLabel: string;
  why: string;
};

export const HARMONY_LABEL: Record<HarmonyKind, string> = {
  supportive: "Smooth",
  neutral: "Neutral",
  tension: "Productive tension",
  friction: "Friction",
};

function fromTone(tone: CompatTone, same: boolean): HarmonyKind {
  if (same) {
    if (tone === "Challenging") return "tension";
    return "supportive";
  }
  if (tone === "Amazing" || tone === "Favourable") return "supportive";
  if (tone === "Neutral") return "tension";
  return "friction";
}

/** Architecture pairs (BN↔SN, etc.): same restless digits can be productive tension. */
export function architectureKind(a: number, b: number): HarmonyKind {
  const x = reduceToSingleDigit(a);
  const y = reduceToSingleDigit(b);
  return fromTone(pairTone(x, y), x === y);
}

/**
 * Year vs a seat: matching the Personal Year digit means the year speaks that
 * layer’s language (supportive). It does not change the Personal Year number.
 */
export function yearSeatKind(
  py: number,
  seat: number,
  role: "bn" | "dn" | "sn" | "nn" | "cycle",
): HarmonyKind {
  const y = reduceToSingleDigit(py);
  const s = reduceToSingleDigit(seat);
  if (y === s) return "supportive";
  if ((y === 3 || y === 5) && s === 7 && (role === "sn" || role === "nn")) {
    return "tension";
  }
  if (y === 5 && (s === 4 || s === 8) && (role === "nn" || role === "dn" || role === "bn")) {
    return "tension";
  }
  if (y === 8 && (s === 2 || s === 7) && (role === "sn" || role === "bn")) {
    return "tension";
  }
  return fromTone(pairTone(y, s), false);
}

export function makeEdge(opts: {
  id: string;
  leftLabel: string;
  left: number;
  rightLabel: string;
  right: number;
  kind: HarmonyKind;
}): HarmonyEdge {
  const left = reduceToSingleDigit(opts.left);
  const right = reduceToSingleDigit(opts.right);
  const why = assertSafeCopy(
    opts.kind === "supportive"
      ? `${opts.leftLabel} ${left} (${plainTrait(left)}) and ${opts.rightLabel} ${right} (${plainTrait(right)}) reinforce each other.`
      : opts.kind === "neutral"
        ? `${opts.leftLabel} ${left} and ${opts.rightLabel} ${right} can sit side by side without a hard pull.`
        : opts.kind === "tension"
          ? `${opts.leftLabel} ${left} wants ${plainTrait(left)}; ${opts.rightLabel} ${right} wants ${plainTrait(right)}. Different aims, usable if they take turns.`
          : `${opts.leftLabel} ${left} and ${opts.rightLabel} ${right} pull behaviour in different directions. Slow down; do not force both at once.`,
    `harmony.${opts.id}`,
  );
  return {
    id: opts.id,
    leftLabel: opts.leftLabel,
    left,
    rightLabel: opts.rightLabel,
    right,
    kind: opts.kind,
    kindLabel: HARMONY_LABEL[opts.kind],
    why,
  };
}
