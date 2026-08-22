/**
 * Pythagorean Identity Layers — Expression / Inner·Outer / Maturity dynamics.
 * Reflective only.
 */

import { CORE_TRAIT } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import { bnDnTransition, nameOnBnDnPath } from "./bnDnPath";
import { plainTrait } from "./layeredCopy";

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
  student?: string;
  expert?: string;
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

export function identityTrait(n: number | string): string {
  const num = Number(n);
  const k = reduceToSingleDigit(num);
  return CORE_TRAIT[num] ?? CORE_TRAIT[k] ?? `Tone ${n}`;
}

/** Short bullets from CORE_TRAIT phrasing, e.g. "Freedom · Adaptability". */
export function identityTraitBullets(n: number | string): string {
  return identityTrait(n)
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
      note: "What you want inside and how you look outside use the same number. Stay honest when things get hard.",
    };
  }
  if (gap <= 2 || gap === 8) {
    return {
      band: "complementary",
      label: "Complementary dynamic",
      note: "Outside style and inside want are different. They can still help each other.",
    };
  }
  return {
    band: "tension",
    label: "Inner–outer tension",
    note: "The person others meet may not match how you feel inside. That is information, not a flaw.",
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
  const suRaw = Number(su);
  const peRaw = Number(pe);
  const bdRaw = Number(bd);
  const exRaw = Number(ex);
  const lpRaw = Number(lp);
  const matRaw = Number(mat);
  const suN = reduceToSingleDigit(suRaw);
  const peN = reduceToSingleDigit(peRaw);
  const bdN = reduceToSingleDigit(bdRaw);
  const exN = reduceToSingleDigit(exRaw);
  const echoesBirth = exN === bdN;
  const alignment = buildAlignment(su, pe);

  const expressionInsight = echoesBirth
    ? `Your name number (Expression ${ex}) is the same as your birth day (${bd}). You come across as someone who likes ${plainTrait(exRaw)}. Your longer path is ${lp}: ${plainTrait(lpRaw)}.`
    : `Expression ${ex} is how you show your name: ${plainTrait(exRaw)}. Birth Day ${bd} is ${plainTrait(bdRaw)}. Life Path ${lp} is the longer walk: ${plainTrait(lpRaw)}.`;

  const expressionDeeper = echoesBirth
    ? `Expression ${ex} matches Birth Day ${bd}, so the way you show up may feel familiar. Life Path ${lp} is still the longer lesson: ${plainTrait(lpRaw)}. You do not have to drop the name style to grow.`
    : vehicle.detail
        .replaceAll("Psychic", "Birth Day")
        .replaceAll("Destiny", "Life Path")
        .replaceAll("Name", "Expression");

  const expressionMicro: IdentityMicroInsight = echoesBirth
    ? {
        tone: plainTrait(exRaw),
        tension: `Using ${plainTrait(exRaw)} a lot can leave ${plainTrait(lpRaw)} unfinished`,
        gift: `You can use ${plainTrait(exRaw)} to help with ${plainTrait(lpRaw)}`,
      }
    : {
        tone: plainTrait(exRaw),
        tension: `The name style can change how Birth Day ${bd} habits show up`,
        gift: `Gives Life Path ${lp} a style of ${plainTrait(exRaw)}`,
      };

  const innerOuterInsight =
    suN === peN
      ? `Soul Urge and Personality are both ${su}. What you want inside and what people see first use the same number: ${plainTrait(suRaw)}. This can feel simple. It is still something to live honestly.`
      : `People first see Personality ${pe} (${plainTrait(peRaw)}). Inside, Soul Urge ${su} wants ${plainTrait(suRaw)}. These can work together. They do not have to match.`;

  const innerOuterDeeper =
    suN === peN
      ? `When both numbers match, people may read you quickly. The work is staying honest when things get hard — not acting the number. ${alignment.note}`
      : `Soul Urge ${su} is what you want when no one is watching: ${plainTrait(suRaw)}. Personality ${pe} is what people meet first: ${plainTrait(peRaw)}. Use the gap as extra information, not a problem to fix. ${alignment.note}`;

  const maturityInsight = `Maturity ${mat} is Life Path ${lp} plus Expression ${ex}, added. Over many years the mix may look more like ${plainTrait(matRaw)}. This does not switch on at a birthday.`;

  const maturityDeeper = `Maturity is a later mix, not a flip on a birthday. Life Path ${lp} (${plainTrait(lpRaw)}) plus Expression ${ex} (${plainTrait(exRaw)}) add toward Maturity ${mat} (${plainTrait(matRaw)}). Birth Day ${bd} still colors daily habits.`;

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
        .replaceAll("Destiny", "Life Path")}. ${expressionDeeper}`,
      student:
        "Expression is the Pythagorean name number (all letters). Birth Day is the calendar day reduced. Life Path is the full date reduced.",
      expert:
        "When Expression equals Birth Day, style and day-tone share a digit. Life Path remains the longer walk. Not a prediction of job or family.",
    },
    {
      id: "inner-outer",
      title: "Inner want vs outer face",
      kicker: "Inner × outer",
      insight: innerOuterInsight,
      micro: {
        tone: `Want ${plainTrait(suRaw)} · Seen as ${plainTrait(peRaw)}`,
        tension:
          alignment.band === "aligned"
            ? "When they match, you may forget to rest"
            : "People may see one thing while you feel another",
        gift:
          alignment.band === "aligned"
            ? "People can see what you want if you stay honest"
            : "You can greet people one way, then give the inner want some quiet time",
      },
      deeper: innerOuterDeeper,
      student:
        "Soul Urge uses vowels. Personality uses consonants. Same chart, two jobs.",
      expert:
        "Alignment band is a teaching gap (same digit / close / far), not a compatibility score. Masters such as 11 stay visible; gap math may reduce them.",
    },
    {
      id: "maturity",
      title: "Maturity layer",
      kicker: "Path + expression → maturity",
      insight: maturityInsight,
      micro: {
        tone: plainTrait(matRaw),
        tension: "Trying to help everyone, or leaving things open too long",
        gift: "Path and name style can grow into one habit over time",
      },
      deeper: maturityDeeper,
      student:
        "Maturity = Life Path + Expression, then reduce. It is a later-life tone, not a birthday switch.",
      expert:
        "Some schools read Maturity after about age 35–45. Numora shows it as synthesis of path + name, always visible, never a forecast.",
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
