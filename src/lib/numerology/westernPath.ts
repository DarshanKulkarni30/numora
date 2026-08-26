/**
 * Pythagorean and Chaldean snapshot explainers (lay language).
 * Reflective only — not events, health, legal, or purchase advice.
 */

import { bnDnTransition, nameOnBnDnPath } from "./bnDnPath";
import { chaldeanCompoundMeaning, CORE_TRAIT } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import { plainJob, plainWatch } from "./layeredCopy";

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
  looksLike?: string;
  helps?: string[];
  watch?: string[];
  student?: string;
  expert?: string;
};

export type SystemInsight = {
  layers: LayerCard[];
  path: PathCard;
  extras: LayerCard[];
};

export const PYTHAGOREAN_LAYER_MAP: LayerCard[] = [
  {
    title: "Birth Day",
    body: "From the day of the month you were born. How you react first on ordinary days.",
  },
  {
    title: "Life Path",
    body: "From the full birth date. The longer work that keeps repeating — at work, at home, and with people close to you.",
  },
  {
    title: "Expression",
    body: "From every letter of the name (A=1 … I=9, then repeat). How people first meet you from this spelling.",
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
  const expressionRole = nameOnBnDnPath(opts.birthDay, opts.lifePath, opts.expression);
  const su = reduceToSingleDigit(Number(opts.soulUrge));
  const pe = reduceToSingleDigit(Number(opts.personality));

  const innerOuter =
    su === pe
      ? `Soul Urge and Personality share ${su}. Inner want and outer face often tell a similar story — still a habit to live honestly, not a guarantee of ease.`
      : `Soul Urge ${opts.soulUrge} (${trait(opts.soulUrge)}) is the inner want; Personality ${opts.personality} (${trait(opts.personality)}) is the outer face. People may meet ${trait(opts.personality)} first, while you are quietly oriented toward ${trait(opts.soulUrge)}. Use the gap as nuance, not a split to “fix.”`;

  const expressionBody = expressionRole.detail
    .replaceAll("Psychic", "Birth Day")
    .replaceAll("Destiny", "Life Path")
    .replaceAll("Name", "Expression");
  const expressionHead = expressionRole.headline
    .replaceAll("Name", "Expression")
    .replaceAll("Birth", "Birth Day")
    .replaceAll("Destiny", "Life Path");

  return {
    layers: PYTHAGOREAN_LAYER_MAP,
    path: {
      kicker: "Birth Day → Life Path (same date math as Destiny)",
      heading: `Birth Day ${path.bn} → Life Path ${path.dn}`,
      feel: `This uses the same full-date math as Vedic Destiny. The full plus and watch live in the Vedic Path story — not a second path. Here: try ${plainJob(path.dn)}. Watch: ${plainWatch(path.bn)}.`,
      atmosphere: "Not a second path and not a score.",
      invitation: `Try: ${plainJob(path.dn)}. Watch: ${plainWatch(path.bn)}.`,
    },
    extras: [
      {
        title: expressionHead,
        body: `${expressionBody} Expression ${opts.expression} reads as ${trait(opts.expression)}.`,
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
    title: "Compound (the full total)",
    body: "Each letter gets a number from 1 to 8 (this old chart does not give 9 to a letter). Add them up. That total is the compound. Two names can become the same small number and still have different totals.",
  },
  {
    title: "Name number (the short number)",
    body: "Keep adding the digits of the total until you get one number from 1 to 9 (sometimes 11 or 22). That short number is the easy label for the name.",
  },
];

export function chaldeanInsight(opts: {
  compound: string;
  reduced: string;
  pythExpression?: string;
  birthDay?: string;
  lifePath?: string;
}): SystemInsight {
  const compoundN = Number(opts.compound);
  const reduced = opts.reduced;
  const reducedN = reduceToSingleDigit(Number(reduced));
  const shift = chaldeanCompoundShift(compoundN, reducedN);

  const vsPyth = pythagoreanBesideChaldean(opts);
  const extras: LayerCard[] = [{ title: "Beside Pythagorean Expression", body: vsPyth }];
  const chartNote = chaldeanOnDatePath(opts);
  if (chartNote) extras.push({ title: "On this chart", body: chartNote });

  return {
    layers: CHALDEAN_LAYER_MAP,
    path: {
      kicker: "Compound → name number",
      heading: `${opts.compound} → ${reduced}`,
      feel: shift.feel,
      atmosphere: shift.atmosphere,
      invitation: shift.invitation,
      looksLike: shift.looksLike,
      helps: shift.helps,
      watch: shift.watch,
      student: shift.student,
      expert: shift.expert,
    },
    extras,
  };
}

function chaldeanCompoundShift(compound: number, reduced: number): PathCard {
  const traitR = trait(reduced);
  const texture = Number.isFinite(compound)
    ? chaldeanCompoundMeaning(compound)
    : "The compound is the raw name total before it folds to one digit.";

  if (compound === 44 && reduced === 8) {
    return {
      kicker: "",
      heading: "",
      feel: "The letters in this name add up to 44. Then 4 + 4 = 8. 44 means a builder name: slow, steady work. 8 means people may see you as someone who can handle plans, money, or duty. Same name, two steps — not two people.",
      atmosphere: `${texture} Keep 44 to understand the “heavy work” feeling. Keep 8 as the short label.`,
      invitation:
        "If this name is on a project, a team, or family duties, rest as well as work. 8 is a label, not a job title you must wear all day.",
      looksLike:
        "People may treat you as capable before they know you. You may be given the budget, the deadline, or the final decision. That can feel proud — and tiring.",
      helps: [
        "You can stay with long work and finish it",
        "Others may trust you with money or plans",
        "If your other name number is lighter (like 3), 8 can add backbone",
      ],
      watch: [
        "Doing everyone’s hard work because you look able",
        "Mixing “I am useful” with “I must be in charge”",
        "Feeling that 8 is a costume if another chart on the same name reads as 3 or 5",
      ],
      student:
        "Chaldean letters use values 1–8 (no letter is 9). The compound is the raw sum of the letters. The name number is that sum reduced to one digit (here 8).",
      expert:
        "44 is often taught as a master compound (4 + 4). Pythagorean Expression on the same spelling can differ because that chart uses 1–9. Compare the two maps; do not pick a winner.",
    };
  }

  return {
    kicker: "",
    heading: "",
    feel: `The letters add up to ${compound}. That sum becomes ${reduced} (${traitR}). ${compound} is the full total. ${reduced} is the short name number.`,
    atmosphere: texture,
    invitation:
      "Read both numbers. The big total is extra detail. The small number is the easy label. Neither judges the person.",
    looksLike: `People may first notice the ${reduced} feeling (${traitR.toLowerCase()}). The total ${compound} is more detail about the same name — not a second life path.`,
    helps: [
      `A short label you can remember: ${reduced} (${traitR})`,
      `The total ${compound} shows this spelling is not the same as every other name that also becomes ${reduced}`,
    ],
    watch: [
      "Using only the small number and ignoring the total",
      "Arguing with Pythagorean Expression if it is a different digit — two counting methods, one name",
    ],
    student:
      "Chaldean: add letter values (1–8 chart), keep the compound, then reduce. Pythagorean Expression uses a 1–9 letter chart on the same spelling.",
    expert:
      "Disagreement between Chaldean reduced and Pythagorean Expression is expected when letter values differ (for example E, H, S). Two ways of adding letters, not two people.",
  };
}

function pythagoreanBesideChaldean(opts: {
  compound: string;
  reduced: string;
  pythExpression?: string;
}): string {
  if (!opts.pythExpression) {
    return "Compare this name number with Pythagorean Expression on the same spelling when you want a second mirror.";
  }
  if (opts.pythExpression === opts.reduced) {
    return `The other letter chart (Pythagorean Expression) also gives ${opts.reduced} for this name. Both methods agree on the short number. The total ${opts.compound} is extra detail that Pythagorean does not keep. Agreement is interesting — not a prediction.`;
  }
  return `Same name, two counts. Pythagorean Expression ${opts.pythExpression} (${trait(opts.pythExpression)}) uses letters A=1 to I=9. Chaldean ${opts.reduced} (${trait(opts.reduced)}) uses an older 1–8 letter list and also keeps the total ${opts.compound}. If the two numbers differ, they are two ways to count, not two different people.`;
}

function chaldeanOnDatePath(opts: {
  reduced: string;
  pythExpression?: string;
  birthDay?: string;
  lifePath?: string;
}): string | null {
  if (!opts.birthDay || !opts.lifePath) return null;
  const bd = reduceToSingleDigit(Number(opts.birthDay));
  const lp = reduceToSingleDigit(Number(opts.lifePath));
  const ch = reduceToSingleDigit(Number(opts.reduced));
  const ex = opts.pythExpression
    ? reduceToSingleDigit(Number(opts.pythExpression))
    : null;
  const echo =
    ex != null && ex === bd
      ? ` Pythagorean Expression is also ${ex}, the same as Birth Day ${bd}. The start number is in the date and in the name.`
      : "";
  if (ch === lp) {
    return `Chaldean name number ${ch} is the same as Life Path ${lp}. The name already points to the longer work. Birth Day ${bd} is still the starting style.${echo}`;
  }
  if (ch === bd) {
    return `Chaldean name number ${ch} is the same as Birth Day ${bd}. The name repeats the starting style. Life Path ${lp} is the longer work.${echo}`;
  }
  return `On this chart the date path is Birth Day ${bd} → Life Path ${lp}. The Chaldean name number is ${ch} (${trait(ch)}) — a third number for the same spelling. People may expect the name version of you and get the date version. Useful to know before you take on a role that only suits one of them.${echo}`;
}
