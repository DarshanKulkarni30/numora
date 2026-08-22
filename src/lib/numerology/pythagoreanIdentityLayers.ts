/**
 * Pythagorean Identity Layers — Expression / Inner·Outer / Maturity dynamics.
 * Reflective only.
 */

import { CORE_TRAIT } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import { bnDnTransition, nameOnBnDnPath } from "./bnDnPath";
import { plainJob, plainTrait, plainWatch } from "./layeredCopy";

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
  const suRaw = Number(su);
  const peRaw = Number(pe);
  const suN = reduceToSingleDigit(suRaw);
  const peN = reduceToSingleDigit(peRaw);
  const gap = Math.abs(suN - peN);

  if (suN === peN) {
    return {
      band: "aligned",
      label: "Inside and outside match",
      note: `Both numbers are ${su}, so what people meet is close to what you actually want: ${plainTrait(suRaw)}. Try: ${plainJob(suRaw)}. Watch: ${plainWatch(suRaw)} — when nothing pushes back, this tone can run unchecked.`,
    };
  }
  if (gap <= 2 || gap === 8) {
    return {
      band: "complementary",
      label: "Two numbers that work together",
      note: `People meet ${plainTrait(peRaw)} (${pe}); underneath you want ${plainTrait(suRaw)} (${su}). They are close enough to help each other. Try: ${plainJob(peRaw)}, then ${plainJob(suRaw)}. Watch: doing only the outer one because it is easier.`,
    };
  }
  return {
    band: "tension",
    label: "Inside and outside want different things",
    note: `People meet ${plainTrait(peRaw)} (${pe}); inside you want ${plainTrait(suRaw)} (${su}). That gap is why some days feel like acting. Try: ${plainJob(peRaw)} in company, and ${plainJob(suRaw)} on your own. Watch: ${plainWatch(peRaw)}.`,
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

  // The maturity diagram looks like the expression bridge, so the copy has to
  // carry the difference: the sum, who it matches, and roughly when it lands.
  const matN = reduceToSingleDigit(matRaw);
  const lpN = reduceToSingleDigit(lpRaw);
  const matSum = `${lp} + ${ex} = ${lpRaw + exRaw}, which reduces to ${mat}`;
  const matEcho =
    matN === lpN && matN === exN
      ? `It lands on the same number as both, so this is less a new tone than more of the same.`
      : matN === lpN
        ? `It lands back on Life Path ${lp}, so the path tone gets stronger with age rather than changing.`
        : matN === exN
          ? `It lands on Expression ${ex}, so the name style is what tends to last.`
          : `It is a third number, not Life Path ${lp} and not Expression ${ex} — a tone that only appears once the other two have been lived a while.`;

  const maturityInsight = `Maturity ${mat} is the sum of the other two: ${matSum}. ${matEcho} Traditions place it loosely around the mid-thirties to mid-forties, and it arrives gradually — nothing switches on at a birthday.`;

  const maturityDeeper = `The expression bridge above is about now: Birth Day ${bd} and Expression ${ex} in daily use. Maturity is about later. Life Path ${lp} (${plainTrait(lpRaw)}) and Expression ${ex} (${plainTrait(exRaw)}) add toward ${mat} (${plainTrait(matRaw)}), which is the habit that tends to remain once the busier ones settle. Birth Day ${bd} still colours ordinary days throughout.`;

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
        tone: `Later habit: ${plainTrait(matRaw)}`,
        tension: `Watch: ${plainWatch(matRaw)}`,
        gift: `Try now: ${plainJob(matRaw)} — small doses, years ahead of time`,
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
