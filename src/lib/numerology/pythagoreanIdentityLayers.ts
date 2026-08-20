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

export type InnerOuterAlignment = {
  band: "aligned" | "complementary" | "tension";
  label: string;
  note: string;
};

export type PythagoreanIdentityLayers = {
  birthDay: string;
  lifePath: string;
  expression: string;
  soulUrge: string;
  personality: string;
  maturity: string;
  layers: IdentityLayerCard[];
  alignment: InnerOuterAlignment;
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

/** Short bullets from CORE_TRAIT phrasing, e.g. "Freedom · Adaptability". */
function traitBullets(n: number | string): string {
  return trait(n)
    .replace(/\s*&\s*/g, " · ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildAlignment(su: string, pe: string): InnerOuterAlignment {
  const suN = reduceToSingleDigit(Number(su));
  const peN = reduceToSingleDigit(Number(pe));
  const gap = Math.abs(suN - peN);

  if (suN === peN) {
    return {
      band: "aligned",
      label: "High alignment",
      note: "Inner motivation and outward style reinforce each other — stay congruent under pressure.",
    };
  }
  if (gap <= 2 || gap === 8) {
    return {
      band: "complementary",
      label: "Complementary dynamic",
      note: "External style and inner motivations differ, yet can work as complementary tones.",
    };
  }
  return {
    band: "tension",
    label: "Inner–outer tension",
    note: "The person others meet may differ substantially from the person you feel yourself to be.",
  };
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
  const bdN = reduceToSingleDigit(Number(bd));
  const exN = reduceToSingleDigit(Number(ex));
  const echoesBirth = exN === bdN;
  const alignment = buildAlignment(su, pe);

  const expressionInsight = echoesBirth
    ? `Expression ${ex} (${trait(ex)}) echoes Birth Day ${bd}, amplifying ${traitBullets(ex).toLowerCase()} as the style through which you pursue Life Path ${lp} (${trait(lp)}).`
    : `Expression ${ex} (${trait(ex)}) is the bridge — how your natural style colors the walk from Birth Day ${bd} (${trait(bd)}) toward Life Path ${lp} (${trait(lp)}).`;

  const expressionDeeper = vehicle.detail
    .replaceAll("Psychic", "Birth Day")
    .replaceAll("Destiny", "Life Path")
    .replaceAll("Name", "Expression");

  const expressionMicro: IdentityMicroInsight = echoesBirth
    ? {
        tone: traitBullets(ex),
        tension: `Repeated ${ex} energy can intensify restlessness or the need for freedom`,
        gift: `Makes Life Path ${lp} leadership more adaptable and flexible`,
      }
    : {
        tone: traitBullets(ex),
        tension: `Can color or complicate Birth Day ${bd} (${trait(bd)}) habits`,
        gift: `Gives Life Path ${lp} a ${traitBullets(ex).toLowerCase()} style`,
      };

  const innerOuterInsight =
    suN === peN
      ? `Soul Urge and Personality share ${su}. Inner want and outer face often rhyme — still a theme to live honestly, not a guarantee of ease.`
      : `People meet your outer face (${pe} · ${trait(pe)}), while your inner want (${su} · ${trait(su)}) quietly seeks its own depth.`;

  const innerOuterDeeper =
    suN === peN
      ? `When Soul Urge and Personality land on the same digit, rooms may read you quickly. The work is staying congruent under pressure — not performing the tone. ${alignment.note}`
      : `Soul Urge ${su} (${trait(su)}) is what you privately want; Personality ${pe} (${trait(pe)}) is how you are seen. The overlap is where you meet the world — use the gap as nuance, not a split to “fix.” ${alignment.note}`;

  const maturityInsight = `Maturity ${mat} (${trait(mat)}) represents the integration of Life Path ${lp} and Expression ${ex} — gradually shifting toward ${traitBullets(mat).toLowerCase()}.`;

  const maturityDeeper = `Maturity is synthesis, not a calendar flip: Life Path ${lp} (${trait(lp)}) plus Expression ${ex} (${trait(ex)}) converge into Maturity ${mat} (${trait(mat)}). Birth Day ${bd} still colors the journey; the ripening is how path and craft learn to steward together.`;

  const layers: IdentityLayerCard[] = [
    {
      id: "expression",
      title: "Expression layer",
      kicker: "The expression bridge",
      insight: expressionInsight,
      micro: expressionMicro,
      deeper: `${vehicle.headline
        .replaceAll("Name", "Expression")
        .replaceAll("Birth", "Birth Day")
        .replaceAll("Destiny", "Life Path")}. ${
        echoesBirth
          ? `Expression ${ex} echoes Birth Day ${bd}, so outward style may feel familiar while Life Path ${lp} remains the growing edge: ${traitBullets(lp).toLowerCase()}.`
          : expressionDeeper
      }`,
    },
    {
      id: "inner-outer",
      title: "Inner want vs outer face",
      kicker: "Inner × outer",
      insight: innerOuterInsight,
      micro: {
        tone: `Want ${traitBullets(su)} · Seen as ${traitBullets(pe)}`,
        tension:
          alignment.band === "aligned"
            ? "Congruence can hide the need for honest rest"
            : alignment.band === "tension"
              ? "You may appear more structured or conventional than you feel inside"
              : "Hidden depth behind the social face",
        gift:
          alignment.band === "aligned"
            ? "Readable presence when lived honestly"
            : "Quiet wisdom behind an open first impression",
      },
      deeper: innerOuterDeeper,
    },
    {
      id: "maturity",
      title: "Maturity layer",
      kicker: "Path + expression → maturity",
      insight: maturityInsight,
      micro: {
        tone: `${traitBullets(mat)}`,
        tension: "Over-giving or holding chapters open too long",
        gift: "Stewardship emerging from path + expression craft",
      },
      deeper: maturityDeeper,
    },
  ];

  const dynamicsSummary = [
    `Bridge: BD ${bd} → Ex ${ex} → LP ${lp}.`,
    alignment.band === "aligned"
      ? `Inner×outer share ${su}.`
      : `Inner ${su} × outer ${pe}.`,
    `Convergence: LP ${lp} + Ex ${ex} → Mat ${mat}.`,
  ].join(" ");

  const growthInvitation = path.invitation;

  const reflectivePractice =
    suN === peN
      ? `Notice one moment when Expression ${ex} helped (or hurried) a Birth Day ${bd} habit — name it without judgment.`
      : `Let Personality ${pe} greet one conversation, then give Soul Urge ${su} five quiet minutes afterward.`;

  const blueprintLines = [
    `Expression ${ex}: ${layers[0].insight}`,
    `  Tone: ${layers[0].micro.tone}. Tension: ${layers[0].micro.tension}. Gift: ${layers[0].micro.gift}.`,
    `Inner ${su} / Outer ${pe}: ${layers[1].insight}`,
    `  Alignment: ${alignment.label}. ${alignment.note}`,
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
    alignment,
    dynamicsSummary,
    growthInvitation,
    reflectivePractice,
    blueprintLines,
  };
}
