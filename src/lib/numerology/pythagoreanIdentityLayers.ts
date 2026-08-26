/**
 * Pythagorean Identity Layers — Expression / Inner·Outer / Maturity dynamics.
 * Reflective only.
 */

import { CORE_TRAIT } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import { plainJob, plainMeet, plainStart, plainTrait, plainWatch } from "./layeredCopy";
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
    return `${plainWatch(aRaw)} — doubled, this is the habit you do not notice.`;
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
      insight: `Birth Day ${bd}, Expression ${ex}, and Life Path ${lp} are the same theme: you start by ${plainStart(bdRaw)}, people meet you that way, and the longer work is the same. That is your strongest skill. It is also the habit you will not question.`,
      standsOut: `${bdN} shows in all three. There is no second number here.`,
      relation: `The work is doing ${plainTrait(bdRaw)} on purpose, not finding a new theme.`,
      friction: pairFriction(bdRaw, lpRaw),
      strength: `Do ${plainTrait(bdRaw)} honestly, on purpose.`,
      watch: plainWatch(bdRaw),
      tryLine: `Try: ${plainJob(bdRaw)}. Then ask if that habit actually fitted the situation.`,
      birthDetail: `Birth Day ${bd}: you start an ordinary day by ${plainStart(bdRaw)}. Try: ${plainJob(bdRaw)}.`,
      expressionDetail: `Expression ${ex}: people meet you as ${plainMeet(exRaw)}. Same theme as the birth day.`,
      pathDetail: `Life Path ${lp}: the longer work is the same theme, used with more care: ${pathHabit(lpRaw)}.`,
    };
  }

  if (bdLpRepeat) {
    return {
      kind: "bd-lp-repeat",
      core: bdN,
      modifier: exN,
      insight: `Birth Day ${bd} is how you start: ${instinctHabit(bdRaw)}. Life Path ${lp} is that same theme used with more care (${pathHabit(lpRaw)}). Expression ${ex} is how people meet you: ${plainTrait(exRaw)}.`,
      standsOut: `${bdN} is how you start and the longer work. Expression ${ex} is only how that comes across.`,
      relation: `Use ${plainTrait(exRaw)} so the longer work reaches other people.`,
      friction: pairFriction(bdRaw, exRaw),
      strength: `${plainTrait(bdRaw)} working through ${plainTrait(exRaw)}.`,
      watch: `${plainWatch(bdRaw)}; ${plainWatch(exRaw)}`,
      tryLine: `Try: ${plainJob(exRaw)}.${
        exN === 9 ? " Before the next idea, say what finished looks like." : ""
      }`,
      birthDetail: `Birth Day ${bd}: you start an ordinary day by ${plainStart(bdRaw)}. Try: ${plainJob(bdRaw)}.`,
      expressionDetail: `Expression ${ex}: people meet you as ${plainMeet(exRaw)}. Try: ${plainJob(exRaw)}.`,
      pathDetail: `Life Path ${lp}: same theme as the birth day, used with more care: ${pathHabit(lpRaw)}.`,
    };
  }

  if (exBdRepeat) {
    return {
      kind: "ex-bd-repeat",
      core: bdN,
      modifier: lpN,
      insight: `Expression ${ex} matches Birth Day ${bd}: people meet you as ${plainMeet(exRaw)}, which is also how you start. Life Path ${lp} is the longer work: ${plainTrait(lpRaw)}. You do not drop how you come across to grow.`,
      standsOut: `${exN} is both how you start and how people meet you. Life Path ${lp} is the growing work.`,
      relation: `People meet the day's start first. The longer work is still ${plainTrait(lpRaw)}.`,
      friction: `Staying in ${plainTrait(exRaw)} can leave ${plainTrait(lpRaw)} unfinished.`,
      strength: `Use how people meet you (${plainMeet(exRaw)}) on one ${plainTrait(lpRaw)} step.`,
      watch: `Staying in how you start so the longer work never begins.`,
      tryLine: `Try: ${plainJob(lpRaw)}. That is ${plainTrait(lpRaw)}, using how people already meet you.`,
      birthDetail: `Birth Day ${bd}: you start an ordinary day by ${plainStart(bdRaw)}. People meet you the same way.`,
      expressionDetail: `Expression ${ex} matches the birth day: people meet you as ${plainMeet(exRaw)}. Life Path ${lp} is still the longer work.`,
      pathDetail: `Life Path ${lp}: the longer work is ${plainTrait(lpRaw)}. How you come across does not replace this.`,
    };
  }

  if (exLpRepeat) {
    return {
      kind: "ex-lp-repeat",
      core: lpN,
      modifier: bdN,
      insight: `Expression ${ex} already matches Life Path ${lp}: people meet you as ${plainMeet(exRaw)}, which is also the longer work. Birth Day ${bd} is how you start: ${plainStart(bdRaw)}. That private start can get skipped.`,
      standsOut: `${exN} is how people meet you and the longer work. Birth Day ${bd} is the start that can get skipped.`,
      relation: `The longer work already shows in public. The private start is the one to keep.`,
      friction: `Skipping ${plainTrait(bdRaw)} because the name already looks like the goal.`,
      strength: `The longer work showing in public sooner than it feels inside.`,
      watch: `Skipping how you start because Expression already sounds like the path.`,
      tryLine: `Try: ${plainJob(lpRaw)} this week, and still ${plainJob(bdRaw)} on your own.`,
      birthDetail: `Birth Day ${bd}: you start by ${plainStart(bdRaw)}. This can get skipped because the name already looks like the path.`,
      expressionDetail: `Expression ${ex} matches Life Path ${lp}: people meet you as ${plainMeet(exRaw)}.`,
      pathDetail: `Life Path ${lp}: the longer work is ${plainTrait(lpRaw)}. Expression already carries this in public.`,
    };
  }

  return {
    kind: "all-different",
    core: null,
    modifier: exN,
    insight: `You start the day by ${plainStart(bdRaw)} (${bd}). People meet you as ${plainMeet(exRaw)} (${ex}). The longer work is ${plainTrait(lpRaw)} (${lp}). Three jobs, one person.`,
    standsOut: `No number repeats. Use how people meet you on one longer-work step this week.`,
    relation: `How people meet you (${plainMeet(exRaw)}) sits between how you start (${plainStart(bdRaw)}) and the longer work (${plainTrait(lpRaw)}).`,
    friction: pairFriction(bdRaw, exRaw),
    strength: `People meet you as ${plainMeet(exRaw)}. Use that on one ${plainTrait(lpRaw)} step this week.`,
    watch: `${plainWatch(exRaw)}. Do not treat how you come across as the whole job.`,
    tryLine: `Try: ${plainJob(exRaw)}. Then ${plainJob(bdRaw)}.`,
    birthDetail: `Birth Day ${bd}: you start an ordinary day by ${plainStart(bdRaw)}. Try: ${plainJob(bdRaw)}.`,
    expressionDetail: `Expression ${ex}: people meet you as ${plainMeet(exRaw)}. Try: ${plainJob(exRaw)}.`,
    pathDetail: `Life Path ${lp}: the longer work is ${plainTrait(lpRaw)}. Try: ${plainJob(lpRaw)}.`,
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
      tone: `Maturity ${mat} is the same theme as Life Path and Expression: ${plainTrait(matRaw)}. Age deepens it. It does not add a new one.`,
      tension: `Watch: ${plainWatch(matRaw)} — this is the habit you will not question.`,
      gift: `Try today: ${plainJob(matRaw)}. Do it small. Do not wait for a later birthday.`,
    };
  }
  if (matN === lpN) {
    return {
      tone: `Maturity lands back on Life Path ${lp}: ${plainTrait(lpRaw)}. That work gets stronger with age. It does not change into something else.`,
      tension: `Watch: treating Expression ${ex} as the later story, and missing that the path is what remains.`,
      gift: `Try today: ${plainJob(lpRaw)}. A little at a time.`,
    };
  }
  if (matN === exN) {
    return {
      tone: `Maturity lands on Expression ${ex}: people already meet you as ${plainMeet(exRaw)}. That is what lasts.`,
      tension: `Watch: waiting for age to switch on a new personality. The lasting tone is already how people meet you.`,
      gift: `Try today: ${plainJob(exRaw)} in a calmer dose.`,
    };
  }
  return {
    tone: `Maturity ${mat} is ${plainTrait(matRaw)}. That is not Life Path ${lp} and not Expression ${ex}. It gets louder later. Practise it now in a small way.`,
    tension: `Watch: ${plainWatch(matRaw)}. Also: skipping this because people still know you for ${plainTrait(lpRaw)} or ${plainTrait(exRaw)}.`,
    gift: `Try today: ${plainJob(matRaw)}. Then stop. You do not wait until your forties.`,
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

  const suRaw = Number(su);
  const peRaw = Number(pe);
  const bdRaw = Number(bd);
  const exRaw = Number(ex);
  const lpRaw = Number(lp);
  const matRaw = Number(mat);
  const suN = reduceToSingleDigit(suRaw);
  const peN = reduceToSingleDigit(peRaw);
  const exN = reduceToSingleDigit(exRaw);
  const innerOuterPattern = buildInnerOuterPattern(su, pe);
  const alignment = buildAlignment(innerOuterPattern);
  const expressionPattern = buildExpressionPattern(bd, lp, ex);
  const expressionInsight = expressionPattern.insight;

  const expressionDeeper = [
    expressionPattern.standsOut,
    expressionPattern.relation,
    expressionPattern.friction,
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
      ? `Soul Urge and Personality are both ${su}. What you want and what people see first are the same: ${plainTrait(suRaw)}. Live it honestly.`
      : `People first see ${plainMeet(peRaw)} (${pe}). Inside you want ${plainTrait(suRaw)} (${su}). They do not have to match.`;

  const innerOuterDeeper =
    suN === peN
      ? `When both numbers match, people read you quickly. Stay honest when things get hard. ${innerOuterPattern.meet}`
      : `${innerOuterPattern.looksLike} ${innerOuterPattern.tryLine}`;

  // The maturity diagram looks like the expression bridge, so the copy has to
  // carry the difference: the sum, who it matches, and roughly when it lands.
  const matN = reduceToSingleDigit(matRaw);
  const lpN = reduceToSingleDigit(lpRaw);
  const matSum = `${lp} + ${ex} = ${lpRaw + exRaw}, which reduces to ${mat}`;
  const matEcho =
    matN === lpN && matN === exN
      ? `It is the same number as both, so this is more of the same, not a new tone.`
      : matN === lpN
        ? `It lands back on Life Path ${lp}, so the path gets stronger with age rather than changing.`
        : matN === exN
          ? `It lands on Expression ${ex}, so how people already meet you is what lasts.`
          : `It is not Life Path ${lp} and not Expression ${ex}. Later, ${plainTrait(matRaw)} gets louder.`;

  const maturityInsight = `Maturity ${mat} is Life Path plus Expression: ${matSum}. ${matEcho} Nothing switches on at a birthday. Practise it now in a small way.`;

  const maturityDeeper = `Expression is about now. Maturity is about later. ${lp} + ${ex} becomes ${mat} (${plainTrait(matRaw)}). Birth Day ${bd} still colours ordinary days.`;

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
    `You start by ${plainStart(bdRaw)} (${bd}). People meet you as ${plainMeet(exRaw)} (${ex}). The longer work is ${plainTrait(lpRaw)} (${lp}).`,
    suN === peN
      ? `Inside and outside share ${su}.`
      : `Inside you want ${plainTrait(suRaw)} (${su}). People first see ${plainMeet(peRaw)} (${pe}).`,
    `Later, ${plainTrait(matRaw)} (${mat}) gets louder. That is ${lp} + ${ex}.`,
  ].join(" ");

  const growthInvitation = `This week: ${plainJob(exRaw)}. Then one ${plainJob(lpRaw)} step. Watch: ${plainWatch(exRaw)}.`;

  const reflectivePractice =
    suN === peN
      ? `Notice one moment when how you come across helped — or hurried — how you start. Name it. Do not judge it.`
      : `Let ${plainMeet(peRaw)} greet one conversation. Then give ${plainTrait(suRaw)} five quiet minutes. Do not skip the quiet.`;

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
