/**
 * Pythagorean Identity Layers — Expression / Inner·Outer / Maturity dynamics.
 * Reflective only.
 */

import { CORE_TRAIT } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import { bnDnTransition } from "./bnDnPath";
import { plainJob, plainTrait, plainWatch } from "./layeredCopy";
import {
  buildInnerOuterPattern,
  INNER_OUTER_KIND_LABEL,
  type InnerOuterPattern,
} from "./innerOuterPairs";

export type { InnerOuterKind, InnerOuterPattern, TensionStop } from "./innerOuterPairs";
export { buildInnerOuterPattern, microForTensionStop } from "./innerOuterPairs";

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

export type ExpressionPatternKind =
  | "all-same"
  | "bd-lp-repeat"
  | "ex-bd-repeat"
  | "ex-lp-repeat"
  | "all-different";

export type ExpressionPattern = {
  kind: ExpressionPatternKind;
  core: number | null;
  modifier: number | null;
  insight: string;
  standsOut: string;
  relation: string;
  friction: string;
  strength: string;
  watch: string;
  tryLine: string;
  birthDetail: string;
  expressionDetail: string;
  pathDetail: string;
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
  expressionPattern: ExpressionPattern;
  innerOuterPattern: InnerOuterPattern;
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

/** First-habit wording so a repeated digit is not printed as the same sentence twice. */
function instinctHabit(n: number): string {
  const map: Record<number, string> = {
    1: "starting things on your own, often before anyone asked",
    2: "waiting and smoothing things over, often before you have said what you need",
    3: "talking and ideas, often before they are finished",
    4: "planning and routines, often before the week has actually started",
    5: "changing course, often before the last try had a chance",
    6: "saying yes and taking care, often before you have rest",
    7: "going quiet to think, often before you have answered",
    8: "pushing for a result, often before there is a pause",
    9: "helping a wider group, often before the close-in work is done",
    11: "sensing a lot, often before you rest",
    22: "drawing a large plan, often before one practical step is dated",
    33: "helping many people, often before you have kept anything for yourself",
  };
  return map[n] ?? map[reduceToSingleDigit(n)] ?? plainTrait(n);
}

/** Same theme as the first habit, used with more care — the Life Path reading of a repeat. */
function pathHabit(n: number): string {
  const map: Record<number, string> = {
    1: "one decision you stand behind",
    2: "one partnership you stay in",
    3: "one idea carried through",
    4: "one plan you actually live",
    5: "one experiment you finish",
    6: "one promise you keep without emptying yourself",
    7: "insight that becomes usable, not only private",
    8: "one real result, then rest",
    9: "one loop closed so the help can last",
    11: "notice, then rest, without a forced launch",
    22: "one practical step on the calendar",
    33: "help one person without emptying yourself",
  };
  return map[n] ?? map[reduceToSingleDigit(n)] ?? plainJob(n);
}

function pairFriction(aRaw: number, bRaw: number): string {
  const a = reduceToSingleDigit(aRaw);
  const b = reduceToSingleDigit(bRaw);
  if (a === b) {
    return `${plainWatch(aRaw)} — doubled, this is the habit you may not notice.`;
  }
  if ((a === 3 && b === 9) || (a === 9 && b === 3)) {
    return "Ideas can multiply faster than they are finished.";
  }
  if ((a === 3 && b === 6) || (a === 6 && b === 3)) {
    return "Talking and ideas can outrun the promises other people are waiting on.";
  }
  return `${plainTrait(aRaw)} can run ahead of the work of ${plainTrait(bRaw)}.`;
}

export function buildExpressionPattern(
  bd: string,
  lp: string,
  ex: string,
): ExpressionPattern {
  const bdRaw = Number(bd);
  const lpRaw = Number(lp);
  const exRaw = Number(ex);
  const bdN = reduceToSingleDigit(bdRaw);
  const lpN = reduceToSingleDigit(lpRaw);
  const exN = reduceToSingleDigit(exRaw);

  const allSame = bdN === lpN && exN === bdN;
  const bdLpRepeat = bdN === lpN && exN !== bdN;
  const exBdRepeat = exN === bdN && lpN !== bdN;
  const exLpRepeat = exN === lpN && bdN !== lpN;

  if (allSame) {
    return {
      kind: "all-same",
      core: bdN,
      modifier: null,
      insight: `Birth Day ${bd}, Expression ${ex}, and Life Path ${lp} share one theme: ${plainTrait(bdRaw)}. It is the first habit, how people meet you, and the longer direction. That makes it your strongest skill and the habit you are least likely to question.`,
      standsOut: `${bdN} is repeated in all three seats — there is no second number shaping how this shows.`,
      relation: `The work is using ${plainTrait(bdRaw)} with more care, not finding a new theme.`,
      friction: pairFriction(bdRaw, lpRaw),
      strength: `Living ${plainTrait(bdRaw)} honestly, on purpose.`,
      watch: plainWatch(bdRaw),
      tryLine: `Try: ${plainJob(bdRaw)} — then check whether that habit actually suited the situation.`,
      birthDetail: `Birth Day ${bd} is the first habit: ${instinctHabit(bdRaw)}. The same theme will keep showing up.`,
      expressionDetail: `Expression ${ex} is how people meet that same theme: ${plainTrait(exRaw)}. It is not a second person.`,
      pathDetail: `Life Path ${lp} is the same theme used with more care: ${pathHabit(lpRaw)}. It is not a new personality.`,
    };
  }

  if (bdLpRepeat) {
    return {
      kind: "bd-lp-repeat",
      core: bdN,
      modifier: exN,
      insight: `Birth Day ${bd} is the first habit (${instinctHabit(bdRaw)}). Life Path ${lp} is the same theme used with more care (${pathHabit(lpRaw)}). Expression ${ex} is how that shows: ${plainTrait(exRaw)}, not only the first habit.`,
      standsOut: `${bdN} is repeated — instinct and long-term direction share one theme. ${exN} shapes how that theme comes across.`,
      relation: `The repeated ${bdN} is the core. Expression ${ex} is the modifier: ${plainTrait(exRaw)}. That style is how the core reaches other people.`,
      friction: pairFriction(bdRaw, exRaw),
      strength: `You may be strongest when ${plainTrait(bdRaw)} also serves ${plainTrait(exRaw)}.`,
      watch: `${plainWatch(bdRaw)}; ${plainWatch(exRaw)}`,
      tryLine: `Try: ${plainJob(exRaw)}.${
        exN === 9 ? " Before the next idea, say what finished looks like." : ""
      }`,
      birthDetail: `Birth Day ${bd} is the first habit: ${instinctHabit(bdRaw)}. It is the raw version of a theme you will keep meeting.`,
      expressionDetail: `Expression ${ex} is how you show up: ${plainTrait(exRaw)}. It is the work that grows the first habit into the longer path — not a second person.`,
      pathDetail: `Life Path ${lp} is the same theme as Birth Day, used with more care: ${pathHabit(lpRaw)}. It is not a new number and not a new personality.`,
    };
  }

  if (exBdRepeat) {
    return {
      kind: "ex-bd-repeat",
      core: bdN,
      modifier: lpN,
      insight: `Your name number (Expression ${ex}) matches Birth Day ${bd}, so how you come across doubles the first habit: ${plainTrait(exRaw)}. Life Path ${lp} is the longer ask: ${plainTrait(lpRaw)}. You do not have to drop the name style to grow.`,
      standsOut: `${exN} is repeated in Birth Day and Expression. Life Path ${lp} is the growing work.`,
      relation: `People meet the day habit first. The path is still ${plainTrait(lpRaw)}.`,
      friction: `Staying in ${plainTrait(exRaw)} can leave ${plainTrait(lpRaw)} unfinished.`,
      strength: `Using ${plainTrait(exRaw)} to help with ${plainTrait(lpRaw)}.`,
      watch: `Staying in the first habit so the longer path never starts.`,
      tryLine: `Try: ${plainJob(lpRaw)} — ${plainTrait(lpRaw)} — using the ${plainTrait(exRaw)} habit you already have.`,
      birthDetail: `Birth Day ${bd} is the first habit: ${instinctHabit(bdRaw)}. Expression matches it, so this tone shows in public as well as in private.`,
      expressionDetail: `Expression ${ex} matches Birth Day ${bd}, so how you come across doubles ${plainTrait(exRaw)}. Life Path ${lp} is still the longer ask.`,
      pathDetail: `Life Path ${lp} is the longer direction: ${plainTrait(lpRaw)}. The name style does not replace this work.`,
    };
  }

  if (exLpRepeat) {
    return {
      kind: "ex-lp-repeat",
      core: lpN,
      modifier: bdN,
      insight: `Expression ${ex} already matches Life Path ${lp}: people meet you as ${plainTrait(exRaw)}, which is also the longer direction. Birth Day ${bd} is the starting difference: ${plainTrait(bdRaw)}.`,
      standsOut: `${exN} is repeated in how you show up and where you are headed. Birth Day ${bd} is the first habit that may not match that public style.`,
      relation: `The path already shows in the name. The private starting habit is the one that can get skipped.`,
      friction: `Skipping ${plainTrait(bdRaw)} because the name already looks like the goal.`,
      strength: `The longer direction showing in public sooner than it feels inside.`,
      watch: `Skipping the birth-day habit because Expression already sounds like the path.`,
      tryLine: `Try: ${plainJob(lpRaw)} this week, and still ${plainJob(bdRaw)} on your own.`,
      birthDetail: `Birth Day ${bd} is the first habit: ${plainTrait(bdRaw)}. It can get skipped because the name already looks like the path.`,
      expressionDetail: `Expression ${ex} already matches Life Path ${lp}: how you show up is ${plainTrait(exRaw)}, which is also the longer direction.`,
      pathDetail: `Life Path ${lp} is the longer direction: ${plainTrait(lpRaw)}. Expression already carries this in public.`,
    };
  }

  return {
    kind: "all-different",
    core: null,
    modifier: exN,
    insight: `Birth Day ${bd} is the first habit (${plainTrait(bdRaw)}). Expression ${ex} is how you show up (${plainTrait(exRaw)}). Life Path ${lp} is the longer direction (${plainTrait(lpRaw)}). They are three jobs, not three people.`,
    standsOut: `No digit repeats among the three. Expression ${ex} is the style between the first habit and the longer direction.`,
    relation: `How you come across (${plainTrait(exRaw)}) sits between the first habit (${plainTrait(bdRaw)}) and the longer direction (${plainTrait(lpRaw)}).`,
    friction: pairFriction(bdRaw, exRaw),
    strength: `Using the name style to take one path step: ${plainTrait(lpRaw)}.`,
    watch: `Treating the name as a second destiny; ${plainWatch(exRaw)}.`,
    tryLine: `Try: ${plainJob(exRaw)}, then return to ${plainJob(bdRaw)}.`,
    birthDetail: `Birth Day ${bd} is the first habit: ${plainTrait(bdRaw)}. It is how you naturally begin, not the whole story.`,
    expressionDetail: `Expression ${ex} is how you show up: ${plainTrait(exRaw)}. It is the style between the first habit and the longer direction — not a second person.`,
    pathDetail: `Life Path ${lp} is the longer direction: ${plainTrait(lpRaw)}. Expression ${ex} is how that direction tends to look from the outside.`,
  };
}

function buildAlignment(pattern: InnerOuterPattern): InnerOuterAlignment {
  if (pattern.band === "aligned") {
    return {
      band: "aligned",
      label: "Inside and outside match",
      note: pattern.meet,
    };
  }
  if (pattern.band === "complementary") {
    return {
      band: "complementary",
      label: "Two numbers that work together",
      note: pattern.meet,
    };
  }
  return {
    band: "tension",
    label: "Inside and outside want different things",
    note: pattern.meet,
  };
}

function maturityMicro(opts: {
  mat: string;
  matRaw: number;
  lp: string;
  ex: string;
  lpRaw: number;
  exRaw: number;
  matN: number;
  lpN: number;
  exN: number;
}): IdentityMicroInsight {
  const { mat, matRaw, lp, ex, lpRaw, exRaw, matN, lpN, exN } = opts;
  if (matN === lpN && matN === exN) {
    return {
      tone: `Later habit ${mat} is the same theme as both Life Path and Expression: ${plainTrait(matRaw)}. Age tends to deepen it, not add a new one.`,
      tension: `Watch: ${plainWatch(matRaw)} — doubled for years, this is the habit you may not question.`,
      gift: `Try today: ${plainJob(matRaw)} in small doses, years ahead of time, so the later habit is chosen rather than automatic.`,
    };
  }
  if (matN === lpN) {
    return {
      tone: `Later habit lands back on Life Path ${lp}: ${plainTrait(lpRaw)}. The path tone gets stronger with age rather than changing.`,
      tension: `Watch: treating Expression ${ex} (${plainTrait(exRaw)}) as if it were the later story, and missing that the path is what remains.`,
      gift: `Try today: ${plainJob(lpRaw)} — a little at a time, so the later path tone has somewhere to land.`,
    };
  }
  if (matN === exN) {
    return {
      tone: `Later habit lands on Expression ${ex}: ${plainTrait(exRaw)}. The name style is what tends to last.`,
      tension: `Watch: waiting for age to switch on a new personality, when the lasting tone is already how you show up.`,
      gift: `Try today: ${plainJob(exRaw)} in a calmer dose — the later habit is this style, used with more care.`,
    };
  }
  return {
    tone: `Later habit ${mat} (${plainTrait(matRaw)}) is a third number — not Life Path ${lp} and not Expression ${ex}. It tends to show once the other two have been lived a while.`,
    tension: `Watch: ${plainWatch(matRaw)}. Also watch for skipping it because it is not the number people already know you for.`,
    gift: `Try today: ${plainJob(matRaw)} — small doses, years ahead of time, so the later tone is not a surprise.`,
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
  const innerOuterPattern = buildInnerOuterPattern(su, pe);
  const alignment = buildAlignment(innerOuterPattern);
  const expressionPattern = buildExpressionPattern(bd, lp, ex);

  const expressionInsight = expressionPattern.insight;
  const expressionDeeper = [
    expressionPattern.standsOut,
    expressionPattern.relation,
    expressionPattern.friction,
    bdN === reduceToSingleDigit(lpRaw) ? path.looksLike : "",
  ]
    .filter(Boolean)
    .join(" ");

  const expressionMicro: IdentityMicroInsight = {
    tone: expressionPattern.strength,
    tension: expressionPattern.watch,
    gift: expressionPattern.tryLine,
  };

  const innerOuterInsight =
    suN === peN
      ? `Soul Urge and Personality are both ${su}. What you want inside and what people see first use the same number: ${plainTrait(suRaw)}. This can feel simple. It is still something to live honestly.`
      : `People first see Personality ${pe} (${plainTrait(peRaw)}). Inside, Soul Urge ${su} wants ${plainTrait(suRaw)}. These can work together. They do not have to match.`;

  const innerOuterDeeper =
    suN === peN
      ? `When both numbers match, people may read you quickly. The work is staying honest when things get hard — not acting the number. ${innerOuterPattern.meet}`
      : `${innerOuterPattern.looksLike} ${innerOuterPattern.tryLine}`;

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

  const maturityDeeper = `The Expression layer above is about now: Birth Day ${bd} and Expression ${ex} in daily use. Maturity is about later. Life Path ${lp} (${plainTrait(lpRaw)}) and Expression ${ex} (${plainTrait(exRaw)}) add toward ${mat} (${plainTrait(matRaw)}), which is the habit that tends to remain once the busier ones settle. Birth Day ${bd} still colours ordinary days throughout.`;

  const layers: IdentityLayerCard[] = [
    {
      id: "expression",
      title: "Expression layer",
      kicker: "The expression bridge",
      insight: expressionInsight,
      micro: expressionMicro,
      deeper: expressionDeeper,
      student:
        "Expression is the Pythagorean name number (all letters). Birth Day is the calendar day reduced. Life Path is the full date reduced. A digit that appears twice is the core; a different Expression is the modifier.",
      expert:
        "When Birth Day and Life Path share a digit, read instinct vs the same theme used with more care. Expression is the modifier when it differs. Not a prediction of job or family.",
    },
    {
      id: "inner-outer",
      title: "Inner want vs outer face",
      kicker: "Inner × outer",
      insight: innerOuterInsight,
      micro: {
        tone: innerOuterPattern.looksLike,
        tension: innerOuterPattern.watch,
        gift: innerOuterPattern.tryLine,
      },
      deeper: innerOuterDeeper,
      student:
        "Soul Urge uses vowels. Personality uses consonants. Same chart, two jobs.",
      expert:
        "Alignment band comes from how the inner want and outer face relate (same digit, same direction, or a named friction), not a compatibility score. Masters such as 11 keep their own read; family tags may fall back to the reduced digit.",
    },
    {
      id: "maturity",
      title: "Maturity layer",
      kicker: "Path + expression → maturity",
      insight: maturityInsight,
      micro: maturityMicro({
        mat,
        matRaw,
        lp,
        ex,
        lpRaw,
        exRaw,
        matN,
        lpN,
        exN,
      }),
      deeper: maturityDeeper,
      student:
        "Maturity = Life Path + Expression, then reduce. It is a later-life tone, not a birthday switch.",
      expert:
        "Some schools read Maturity after about age 35–45. Numora shows it as synthesis of path + name, always visible, never a forecast.",
    },
  ];

  const dynamicsSummary = [
    `Pattern: BD ${bd} · Ex ${ex} · LP ${lp}. ${expressionPattern.standsOut}`,
    alignment.band === "aligned"
      ? `Inner×outer share ${su} (${INNER_OUTER_KIND_LABEL[innerOuterPattern.kind]}).`
      : `Inner ${su} × outer ${pe} (${INNER_OUTER_KIND_LABEL[innerOuterPattern.kind]}).`,
    `Convergence: LP ${lp} + Ex ${ex} → Mat ${mat}.`,
  ].join(" ");

  const growthInvitation = path.invitation;

  const reflectivePractice =
    suN === peN
      ? `Notice one moment when Expression ${ex} helped (or hurried) a Birth Day ${bd} habit — name it without judgment.`
      : `Let Personality ${pe} greet one conversation, then give Soul Urge ${su} five quiet minutes afterward.`;

  const blueprintLines = [
    `Expression ${ex}: ${layers[0].insight}`,
    `  ${expressionPattern.standsOut}`,
    `  Strength: ${expressionPattern.strength}. Watch: ${expressionPattern.watch}. ${expressionPattern.tryLine}`,
    `Inner ${su} / Outer ${pe}: ${layers[1].insight}`,
    `  Alignment: ${alignment.label}. ${INNER_OUTER_KIND_LABEL[innerOuterPattern.kind]}.`,
    `  Meet: ${innerOuterPattern.meet}`,
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
    expressionPattern,
    innerOuterPattern,
    dynamicsSummary,
    growthInvitation,
    reflectivePractice,
    blueprintLines,
  };
}
