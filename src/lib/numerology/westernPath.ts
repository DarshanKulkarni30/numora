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
  looksLike?: string;
  helps?: string[];
  watch?: string[];
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
      looksLike: path.looksLike,
      helps: path.helps,
      watch: path.watch,
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
      feel: "The spelling totals 44, then settles on 8. 44 is often read as doubled structure — load-bearing work, persistence, a name that can carry weight. 8 is the keyword rooms may hear faster: stewardship, resources, long-range aims.",
      atmosphere: `${texture} Keep 44 for texture (how heavy the build feels) and 8 for the simple keyword. They are one spelling, two zoom levels — not two people.`,
      invitation:
        "Ask whether this name is being used to hold a project, a team, or a family’s practical load. If yes, pair the 8 with rest. If the 8 feels like a costume, the compound is describing pressure, not a job title.",
      looksLike:
        "A short, strong name that people treat as capable before they know you. Being handed the budget, the deadline, or the 'you decide' moment. Pride in finishing what others start — and fatigue when every room assumes you will carry it.",
      helps: [
        "Stamina for unfinished builds — 44 is persistence, not a sprint",
        "Others may read the name as someone who can hold the books",
        "8 can give a lighter Expression (speech, play, ideas) a spine",
      ],
      watch: [
        "44 can feel heavy: over-responsibility dressed as competence",
        "Confusing stewardship with status or being needed",
        "A Pythagorean Expression that is lighter (often 3 or 5) may feel truer inside than this 8 sounds",
      ],
    };
  }

  return {
    kicker: "",
    heading: "",
    feel: `The spelling totals ${compound}, then reduces to ${reduced} (${traitR}). The compound is the grain of the letters; the reduced digit is the simple name vibration.`,
    atmosphere: texture,
    invitation:
      "Read both numbers: compound for texture, reduced for a keyword. Neither is a verdict on the person.",
    looksLike: `In rooms, people may meet the ${traitR.toLowerCase()} of ${reduced} first. The compound ${compound} is the longer flavor of the same spelling — how the name may feel to live in, not a second destiny.`,
    helps: [
      `A clear name keyword (${reduced} · ${traitR}) you can actually remember`,
      "Compound texture that distinguishes this spelling from others that reduce to the same digit",
    ],
    watch: [
      "Treating the reduced digit as the whole story and ignoring the compound",
      "Fighting Pythagorean Expression when the two charts disagree — they are two maps, not two fates",
    ],
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
    return `Pythagorean Expression is also ${opts.reduced} on this spelling — both letter charts agree on the reduced digit. The compound ${opts.compound} is extra Chaldean texture Pythagorean does not keep. Agreement is worth noticing; it is still not a prediction.`;
  }
  return `Same letters, two jobs. Pythagorean Expression ${opts.pythExpression} (${trait(opts.pythExpression)}) totals every letter on a 1–9 chart — craft, how you build and are introduced. Chaldean ${opts.reduced} (${trait(opts.reduced)}) uses the older 1–8 chart and keeps compound ${opts.compound} as texture. If they differ, ask which room you are in: the ${opts.pythExpression}-voice (how you make and speak) or the ${opts.reduced}-keyword (how the older map hears the spelling). Not a fight over which is correct.`;
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
  const path = bnDnTransition(bd, lp);
  const echo =
    ex != null && ex === bd
      ? ` Pythagorean Expression ${ex} echoes Birth Day ${bd}, so the starting voice is loud in the name as well as the date.`
      : "";
  if (ch === lp) {
    return `Chaldean ${ch} already matches Life Path ${lp}. The name may advertise the longer curriculum (${path.feel}) while Birth Day ${bd} stays the private default.${echo}`;
  }
  if (ch === bd) {
    return `Chaldean ${ch} echoes Birth Day ${bd}. The older name chart repeats the starting tone; Life Path ${lp} is still the growing edge (${path.feel}).${echo}`;
  }
  return `The date path on this chart is Birth Day ${bd} → Life Path ${lp}: ${path.feel} Chaldean ${ch} (${trait(ch)}) is a third job for the same spelling — neither the start nor the destination. Useful question: is the name being asked to hold ${trait(ch).toLowerCase()} while the person is still practicing the ${bd}→${lp} stretch? A pacing cue, not a verdict.${echo}`;
}
