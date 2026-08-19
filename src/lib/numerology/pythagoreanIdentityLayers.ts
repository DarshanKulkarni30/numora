/**
 * Pythagorean Identity Layers — Expression / Inner·Outer / Maturity dynamics.
 * Reflective only.
 */

import { CORE_TRAIT } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import { bnDnTransition, nameOnBnDnPath } from "./bnDnPath";

export type IdentityMicroInsight = {
  tone: string;
  tension: string;
  gift: string;
};

export type IdentityLayerCard = {
  id: "expression" | "inner-outer" | "maturity";
  title: string;
  kicker: string;
  insight: string;
  micro: IdentityMicroInsight;
  deeper: string;
};

export type PythagoreanIdentityLayers = {
  birthDay: string;
  lifePath: string;
  expression: string;
  soulUrge: string;
  personality: string;
  maturity: string;
  layers: IdentityLayerCard[];
  dynamicsSummary: string;
  growthInvitation: string;
  reflectivePractice: string;
  blueprintLines: string[];
};

function trait(n: number | string): string {
  const num = Number(n);
  const k = reduceToSingleDigit(num);
  return CORE_TRAIT[num] ?? CORE_TRAIT[k] ?? `Tone ${n}`;
}

export function buildPythagoreanIdentityLayers(opts: {
  birthDay: string;
  lifePath: string;
  expression: string;
  soulUrge: string;
  personality: string;
  maturity: string;
}): PythagoreanIdentityLayers {
  const bd = opts.birthDay;
  const lp = opts.lifePath;
  const ex = opts.expression;
  const su = opts.soulUrge;
  const pe = opts.personality;
  const mat = opts.maturity;

  const path = bnDnTransition(bd, lp);
  const vehicle = nameOnBnDnPath(bd, lp, ex);
  const suN = reduceToSingleDigit(Number(su));
  const peN = reduceToSingleDigit(Number(pe));

  const expressionInsight = `Expression ${ex} (${trait(ex)}) is the creative vehicle that colors how you walk from Birth Day ${bd} (${trait(bd)}) to Life Path ${lp} (${trait(lp)}).`;

  const expressionDeeper = vehicle.detail
    .replaceAll("Psychic", "Birth Day")
    .replaceAll("Destiny", "Life Path")
    .replaceAll("Name", "Expression");

  const innerOuterInsight =
    suN === peN
      ? `Soul Urge and Personality share ${su}. Inner want and outer face often rhyme — still a theme to live honestly, not a guarantee of ease.`
      : `People meet your adaptable outer face (${pe} · ${trait(pe)}), while your inner want (${su} · ${trait(su)}) quietly seeks its own depth.`;

  const innerOuterDeeper =
    suN === peN
      ? `When Soul Urge and Personality land on the same digit, rooms may read you quickly. The work is staying congruent under pressure — not performing the tone.`
      : `Soul Urge ${su} (${trait(su)}) is the inward pull; Personality ${pe} (${trait(pe)}) is the first impression. Use the gap as nuance, not a split to “fix.”`;

  const maturityInsight = `Maturity ${mat} (${trait(mat)}) is the ripening of your path — a later blend of care from Life Path ${lp} and craft from Expression ${ex}.`;

  const maturityDeeper = `Later chapters often soften Birth Day ${bd} and Life Path ${lp} through Expression ${ex}. Maturity ${mat} is that emerging tone — not a calendar date when personality suddenly changes.`;

  const layers: IdentityLayerCard[] = [
    {
      id: "expression",
      title: "Expression layer",
      kicker: "The third brushstroke",
      insight: expressionInsight,
      micro: {
        tone: `${trait(ex)} articulation`,
        tension: `Can color or complicate structured Birth Day ${bd}`,
        gift: `Adds a third tone to Life Path ${lp}`,
      },
      deeper: `${vehicle.headline.replaceAll("Name", "Expression").replaceAll("Birth", "Birth Day").replaceAll("Destiny", "Life Path")}. ${expressionDeeper}`,
    },
    {
      id: "inner-outer",
      title: "Inner want vs outer face",
      kicker: "Dual masks",
      insight: innerOuterInsight,
      micro: {
        tone: `Inner ${trait(su)} · Outer ${trait(pe)}`,
        tension:
          suN === peN
            ? "Congruence can hide the need for honest rest"
            : "Hidden depth behind the social face",
        gift:
          suN === peN
            ? "Readable presence when lived honestly"
            : "Quiet wisdom behind an open first impression",
      },
      deeper: innerOuterDeeper,
    },
    {
      id: "maturity",
      title: "Maturity layer",
      kicker: "The ripening arc",
      insight: maturityInsight,
      micro: {
        tone: `${trait(mat)} completion`,
        tension: "Over-giving or holding chapters open too long",
        gift: "Compassion emerging from path + name craft",
      },
      deeper: maturityDeeper,
    },
  ];

  const dynamicsSummary = [
    `Your Expression (${ex} · ${trait(ex)}) softens and colors the walk from Birth Day ${bd} (${trait(bd)}) toward Life Path ${lp} (${trait(lp)}).`,
    suN === peN
      ? `Inner want and outer face share ${su} — congruence with honesty still matters.`
      : `Inner want (${su} · ${trait(su)}) seeks depth while the outer face (${pe} · ${trait(pe)}) meets the room first.`,
    `Over time these tones may ripen into Maturity ${mat} (${trait(mat)}).`,
    path.feel,
  ].join(" ");

  const growthInvitation = path.invitation;

  const reflectivePractice =
    suN === peN
      ? `This week: notice one moment when Expression ${ex} helped (or hurried) a Birth Day ${bd} habit — name it without judgment.`
      : `This week: let Personality ${pe} greet one conversation, then give Soul Urge ${su} five quiet minutes afterward.`;

  const blueprintLines = [
    `Expression ${ex}: ${layers[0].insight}`,
    `  Tone: ${layers[0].micro.tone}. Tension: ${layers[0].micro.tension}. Gift: ${layers[0].micro.gift}.`,
    `Inner ${su} / Outer ${pe}: ${layers[1].insight}`,
    `  Tone: ${layers[1].micro.tone}. Tension: ${layers[1].micro.tension}. Gift: ${layers[1].micro.gift}.`,
    `Maturity ${mat}: ${layers[2].insight}`,
    `  Tone: ${layers[2].micro.tone}. Tension: ${layers[2].micro.tension}. Gift: ${layers[2].micro.gift}.`,
    `Dynamics: ${dynamicsSummary}`,
    `Practice: ${reflectivePractice}`,
  ];

  return {
    birthDay: bd,
    lifePath: lp,
    expression: ex,
    soulUrge: su,
    personality: pe,
    maturity: mat,
    layers,
    dynamicsSummary,
    growthInvitation,
    reflectivePractice,
    blueprintLines,
  };
}
