/**
 * Pythagorean and Chaldean snapshot explainers (lay language).
 * Reflective only — not events, health, legal, or purchase advice.
 */

import { bnDnTransition, nameOnBnDnPath } from "./bnDnPath";
import { chaldeanCompoundMeaning, CORE_TRAIT } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";

export type LayerCard = {
  title: string;
  body: string;
};

export type PathCard = {
  kicker: string;
  heading: string;
  feel: string;
  atmosphere: string;
  invitation: string;
};

export type SystemInsight = {
  layers: LayerCard[];
  path: PathCard;
  extras: LayerCard[];
};

export const PYTHAGOREAN_LAYER_MAP: LayerCard[] = [
  {
    title: "Birth Day",
    body: "From the day you were born only. The talent you bring into ordinary days — the starting color of the chart.",
  },
  {
    title: "Life Path",
    body: "From the full birth date. The longer curriculum — themes that keep repeating across chapters.",
  },
  {
    title: "Expression",
    body: "From every letter of the name (A=1 … I=9, then repeat). How you build and are introduced — the vehicle.",
  },
  {
    title: "Soul Urge",
    body: "Vowels only. What you may want underneath the social face.",
  },
  {
    title: "Personality",
    body: "Consonants only. The first impression — the mask rooms meet before they know you.",
  },
  {
    title: "Maturity",
    body: "Life Path + Expression, reduced. A later-life blend — how the walk and the name craft may ripen together.",
  },
];

function trait(n: number | string): string {
  const k = reduceToSingleDigit(Number(n));
  return CORE_TRAIT[Number(n)] ?? CORE_TRAIT[k] ?? `Tone ${n}`;
}

export function pythagoreanInsight(opts: {
  birthDay: string;
  lifePath: string;
  expression: string;
  soulUrge: string;
  personality: string;
  maturity: string;
}): SystemInsight {
  const path = bnDnTransition(opts.birthDay, opts.lifePath);
  const vehicle = nameOnBnDnPath(opts.birthDay, opts.lifePath, opts.expression);
  const su = reduceToSingleDigit(Number(opts.soulUrge));
  const pe = reduceToSingleDigit(Number(opts.personality));

  const innerOuter =
    su === pe
      ? `Soul Urge and Personality share ${su}. Inner want and outer face often tell a similar story — still a theme to live honestly, not a guarantee of ease.`
      : `Soul Urge ${opts.soulUrge} (${trait(opts.soulUrge)}) is the inner want; Personality ${opts.personality} (${trait(opts.personality)}) is the outer face. People may meet ${trait(opts.personality)} first, while you are quietly oriented toward ${trait(opts.soulUrge)}. Use the gap as nuance, not a split to “fix.”`;

  const vehicleBody = vehicle.detail
    .replaceAll("Psychic", "Birth Day")
    .replaceAll("Destiny", "Life Path")
    .replaceAll("Name", "Expression");
  const vehicleHead = vehicle.headline
    .replaceAll("Name", "Expression")
    .replaceAll("Birth", "Birth Day")
    .replaceAll("Destiny", "Life Path");

  return {
    layers: PYTHAGOREAN_LAYER_MAP,
    path: {
      kicker: "Your Birth Day → Life Path",
      heading: `Birth Day ${path.bn} → Life Path ${path.dn}`,
      feel: path.feel,
      atmosphere: path.atmosphere,
      invitation: path.invitation,
    },
    extras: [
      {
        title: vehicleHead,
        body: `${vehicleBody} Expression ${opts.expression} reads as ${trait(opts.expression)}.`,
      },
      {
        title: "Inner want vs outer face",
        body: innerOuter,
      },
      {
        title: `Maturity ${opts.maturity}`,
        body: `Later chapters often blend Life Path ${opts.lifePath} with Expression ${opts.expression}. Maturity ${opts.maturity} (${trait(opts.maturity)}) is that ripening tone — not a date when personality suddenly changes.`,
      },
    ],
  };
}

export const CHALDEAN_LAYER_MAP: LayerCard[] = [
  {
    title: "Compound (before reduce)",
    body: "Every letter is scored on the older 1–8 Chaldean chart (9 is not given to a letter). The raw total is the texture of this spelling — two names can share a reduced digit and still feel different here.",
  },
  {
    title: "Name number (reduced)",
    body: "The compound folded to 1–9 (or 11/22 when they appear). The simple name vibration — how this spelling may feel as a keyword.",
  },
];

export function chaldeanInsight(opts: {
  compound: string;
  reduced: string;
  pythExpression?: string;
}): SystemInsight {
  const compoundN = Number(opts.compound);
  const reduced = opts.reduced;
  const compoundLine = Number.isFinite(compoundN)
    ? chaldeanCompoundMeaning(compoundN)
    : "The compound is the raw name total before it folds to one digit.";

  const vsPyth =
    opts.pythExpression && opts.pythExpression !== ""
      ? opts.pythExpression === reduced
        ? `Pythagorean Expression is also ${reduced} on this spelling — both letter charts agree on the reduced digit. The compound ${opts.compound} is extra Chaldean texture Pythagorean does not keep in the snapshot.`
        : `Pythagorean Expression on the same spelling is ${opts.pythExpression} (${trait(opts.pythExpression)}). Chaldean uses a 1–8 letter chart; Pythagorean uses 1–9. Different maps, same name — compare them as two mirrors, not a fight over which is “correct.”`
      : "Compare this name number with Pythagorean Expression on the same spelling when you want a second mirror.";

  return {
    layers: CHALDEAN_LAYER_MAP,
    path: {
      kicker: "Compound → name number",
      heading: `${opts.compound} → ${reduced}`,
      feel: `The spelling totals ${opts.compound}, then reduces to ${reduced} (${trait(reduced)}).`,
      atmosphere: compoundLine,
      invitation:
        "Keep both numbers in view: compound for texture, reduced for a simple keyword. Weather language only — not a verdict on the name.",
    },
    extras: [
      {
        title: "Beside Pythagorean Expression",
        body: vsPyth,
      },
    ],
  };
}
