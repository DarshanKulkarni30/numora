/**
 * Birth (Psychic) → Destiny path copy, plus how Name sits on that path.
 * Reflective pacing only — not events, health, legal, or purchase advice.
 */

import { reduceToSingleDigit } from "./dateNumbers";
import { vedicPairTone } from "./vedicCompatibility";
import { VEDIC_DIGIT_THEMES } from "./vedicNumberThemes";
import { CARE_HOUR_PRACTICE, plainJob, plainTrait, plainWatch } from "./layeredCopy";

export type BnDnTransition = {
  bn: number;
  dn: number;
  /** Short headline of the shift — keep to 1–2 sentences. */
  feel: string;
  atmosphere: string;
  invitation: string;
  /** Concrete life situations this pairing often resembles. */
  looksLike: string;
  /** What this stretch can support. */
  helps: string[];
  /** Common friction — pacing cues, not character verdicts. */
  watch: string[];
  student?: string;
  expert?: string;
};

type TransitionDraft = Pick<BnDnTransition, "feel" | "atmosphere" | "invitation"> &
  Partial<Pick<BnDnTransition, "looksLike" | "helps" | "watch" | "student" | "expert">>;

export type VedicLayerId = "bn" | "dn" | "nn";

export type VedicLayerExplainer = {
  id: VedicLayerId;
  shortTitle: string;
  represents: string;
  /** Everyday try for this layer. */
  tryLine: string;
  /** Everyday watch for this layer. */
  watchLine: string;
  /** Kept for older callers that still read feelsLike. */
  feelsLike: string;
  shapes: string;
};

export const VEDIC_LAYER_MAP: VedicLayerExplainer[] = [
  {
    id: "bn",
    shortTitle: "Birth · Psychic",
    represents:
      "From the day of the month you were born. How you react first, before you have thought about it.",
    tryLine: "Notice your first reaction before you plan.",
    watchLine: "Treating that first reaction as the only option.",
    feelsLike: "Notice your first reaction before you plan.",
    shapes: "First reactions. Not the whole life.",
  },
  {
    id: "dn",
    shortTitle: "Destiny",
    represents:
      "From the full birth date (day, month, and year added together). This is the longer work life keeps asking of you — at work, at home, and with people close to you.",
    tryLine:
      "Notice one kind of work that keeps landing on you at work and at home. That repeating work is this number, not a new person.",
    watchLine:
      "Calling yourself a failure because the same kind of work keeps showing up. Repeating work is the longer ask, not a verdict.",
    feelsLike:
      "Notice one kind of work that keeps landing on you at work and at home.",
    shapes: "The longer work. Not a score.",
  },
  {
    id: "nn",
    shortTitle: "Name",
    represents: "From the spelling in force now. How people first meet you.",
    tryLine:
      "Notice one first impression this spelling gives, then check if it matches what you meant.",
    watchLine:
      "Treating the spelling as if it replaced your birth date. It is how people meet you, not a replacement for the birth-day number.",
    feelsLike:
      "Notice one first impression this spelling gives, then check if it matches what you meant.",
    shapes: "First impressions. Not a replacement for the birth date.",
  },
];

const SAME: Record<number, TransitionDraft> = {
  1: {
    feel: "Your birth day and your full date are both 1: starting things and deciding for yourself.",
    atmosphere: "This often shows up when someone has to go first.",
    invitation: `Try: ${plainJob(1)}. Watch: ${plainWatch(1)}.`,
  },
  2: {
    feel: "Your birth day and your full date are both 2: working with others and being patient.",
    atmosphere: "This often shows up in partnerships and shared decisions.",
    invitation: `Try: ${plainJob(2)}. Watch: ${plainWatch(2)}.`,
  },
  3: {
    feel: "Your birth day and your full date are both 3: talking, play, and sharing ideas.",
    atmosphere: "Home, work, and friends may keep handing you speaking or making work.",
    invitation: `Try: ${plainJob(3)}. Watch: ${plainWatch(3)}.`,
  },
  4: {
    feel: "Your birth day and your full date are both 4: plans, routines, and steady work.",
    atmosphere: "Routines and slow progress that actually holds.",
    invitation: `Try: ${plainJob(4)}. Watch: ${plainWatch(4)}.`,
  },
  5: {
    feel: "Your birth day and your full date are both 5: change, freedom, and trying new things.",
    atmosphere: "Variety and openings that do not stay still.",
    invitation: `Try: ${plainJob(5)}. Watch: ${plainWatch(5)}.`,
  },
  6: {
    feel: "Your birth day and your full date are both 6: care, home, and keeping promises.",
    atmosphere: "Home, loyalty, and tending people and places.",
    invitation: `Try: ${CARE_HOUR_PRACTICE} Watch: ${plainWatch(6)}.`,
  },
  7: {
    feel: "Your birth day and your full date are both 7: quiet thinking and study.",
    atmosphere: "Study, solitude, and meaning away from noise.",
    invitation: `Try: ${plainJob(7)}. Watch: ${plainWatch(7)}.`,
  },
  8: {
    feel: "Your birth day and your full date are both 8: plans, money, and responsibility.",
    atmosphere: "Long projects and results people can see.",
    invitation: `Try: ${plainJob(8)}. Watch: ${plainWatch(8)}.`,
  },
  9: {
    feel: "Your birth day and your full date are both 9: finishing things and helping a wider group.",
    atmosphere: "Endings, closing loops, and help that goes past close friends.",
    invitation: `Try: ${plainJob(9)}. Watch: ${plainWatch(9)}.`,
  },
};

function finish(bn: number, dn: number, draft: TransitionDraft): BnDnTransition {
  const from = VEDIC_DIGIT_THEMES[bn];
  const to = VEDIC_DIGIT_THEMES[dn];
  const looksLike =
    draft.looksLike ??
    (bn === dn
      ? `Both numbers are ${bn}: ${plainTrait(bn)}. That shows in how you react first and in the longer direction. It is your strongest skill and the one you are least likely to question.`
      : `Your first reaction is ${plainTrait(bn)} (${bn}). The longer ask is ${plainTrait(dn)} (${dn}). You will notice the difference most at home, at work, and with people close to you.`);
  // When Psychic and Destiny are the same digit both sides pull from one
  // theme, so take the next distinct entry instead of repeating the first.
  const pickThree = (a: string[], b: string[], fallback: string): string[] => {
    const out: string[] = [];
    for (const item of [...a, ...b, fallback]) {
      if (item && !out.includes(item)) out.push(item);
      if (out.length === 3) break;
    }
    return out;
  };
  const helps =
    draft.helps ?? pickThree(from.strengths, to.strengths, to.workTone);
  const watch =
    draft.watch ??
    pickThree(
      from.watchouts,
      to.watchouts,
      "Treating one number as the whole person",
    );
  return {
    bn,
    dn,
    feel: draft.feel,
    atmosphere: draft.atmosphere,
    invitation: draft.invitation,
    looksLike,
    helps,
    watch,
    student:
      draft.student ??
      `Number ${bn} comes from the birth day. Number ${dn} comes from the full birth date (day + month + year), then reduced to one digit. This page reads a path from ${bn} toward ${dn}. The first number does not become “wrong.”`,
    expert:
      draft.expert ??
      `Vedic: Psychic (Moolank) ${bn} → Destiny (Bhagyank) ${dn}. Pythagorean Life Path uses the same full-date idea and may keep 11, 22, or 33 before reducing. Copy here is reflective, not a prediction.`,
  };
}

/** Hand-tuned BN→DN rows kept when they already speak amateur (what it is + plus + watch). */
const CURATED: Record<string, TransitionDraft> = {
  "3-6": {
    feel: "You like to talk, play, and share ideas (3). Over time, life also asks you to take care of people and keep promises (6). You do not have to stop being creative.",
    atmosphere:
      "This often shows up at home, in a team, or in any job where other people rely on you. Your gift is still words and ideas. The extra work is using them to help someone, not only to entertain.",
    invitation:
      "Keep one hobby that is only for you. Also keep one place where you really help others. Both matter.",
    looksLike:
      "You become the person family or coworkers call when something breaks. Or you run a class, a home, or a small shop — not only perform or joke. It can also look like saying yes to everyone because you can make it sound easy.",
    helps: [
      "Your words can comfort people, not only make them laugh",
      "Your ideas can be useful in daily life",
      "People may stay because they trust you",
    ],
    watch: [
      "You may feel angry if all your time is for others",
      "You may sound helpful but not finish the job",
      "You may avoid a hard talk by being funny or charming",
    ],
    student:
      "3 is the birth day reduced (Psychic / Birth Day). 6 is the full date reduced (Destiny / Life Path). The report reads from 3 toward 6. Creativity is the start; care is the longer work.",
    expert:
      "Vedic Moolank 3 (Jupiter) → Bhagyank 6 (Venus). Pythagorean Birth Day 3 → Life Path 6 is the same date math with optional master numbers on the path. Not a prediction of family or career.",
  },
  "3-9": {
    feel: "You like to talk and share ideas (3). Life also asks you to finish things and help a wider group (9). Keep creating — and ask who it is for.",
    atmosphere: "Teaching, mentoring, and closing old chapters. Help that goes past close friends.",
    invitation: "Teach what you know in simple words. Finish one thing before you start a new cause.",
    looksLike:
      "A storyteller who starts teaching. A hobby that turns into helping strangers. It can also look like starting many good projects and finishing none.",
    helps: [
      "Your words can help someone, not only entertain",
      "You can end a chapter without calling it failure",
    ],
    watch: [
      "Talking about helping the world while one nearby person waits",
      "Too many causes, nothing finished",
    ],
  },
  "5-6": {
    feel: "You like change and new things (5). Life also asks you to stay and take care of people or a home (6). You can still explore — and someone may need you on ordinary days, not only on trips.",
    atmosphere: "Home, partnership, and being reliable, while your mind still wants movement.",
    invitation: "Choose a few people or habits to stay with. Freedom is still freedom if you come back.",
    looksLike:
      "Someone who used to move jobs or cities now keeps a home or a team. It can also look like getting angry at boring duty.",
    helps: [
      "You can care for people without becoming rigid",
      "You can keep play inside a stable life",
    ],
    watch: [
      "Blaming the people you chose to stay with",
      "Leaving (new job, new city, new crush) when care feels heavy",
    ],
  },
  "7-2": {
    feel: "Your first reaction is quiet thinking and study (7). The longer work is working with others and being patient (2). You do not have to stop needing quiet.",
    atmosphere:
      "This often shows up in partnerships and shared decisions. Your gift is still thinking first. The extra work is saying something out loud before the other person gives up.",
    invitation:
      "Try: wait and work with one other person. Watch: going so quiet that people think you do not care.",
    looksLike:
      "You think it through, then someone else has already decided. Or you partner with people but still need hours alone. It can also look like skipping the meeting because the idea is not finished.",
    helps: [
      "You can think first, then still show up for someone else",
      "Quiet can help a partnership if you also speak",
    ],
    watch: [
      "Going so quiet that people think you do not care",
      "Waiting so long that nothing is said",
    ],
  },
};

function generatedDraft(bn: number, dn: number): TransitionDraft {
  return {
    feel: `You start with ${plainTrait(bn)} (${bn}). Over time, life also asks for ${plainTrait(dn)} (${dn}). The first number does not go away.`,
    atmosphere: `Day to day you may still act like ${bn}. The longer work is ${dn}. This can show up at home, at work, or with close people.`,
    invitation: `Try: ${plainJob(dn)}. Watch: ${plainWatch(bn)}. Keep what is true about ${bn}; do not erase it.`,
  };
}

export function bnDnTransition(bnRaw: number | string, dnRaw: number | string): BnDnTransition {
  const bn = reduceToSingleDigit(Number(bnRaw));
  const dn = reduceToSingleDigit(Number(dnRaw));
  if (bn === dn) return finish(bn, dn, SAME[bn] ?? generatedDraft(bn, dn));
  const hit = CURATED[`${bn}-${dn}`];
  if (hit) return finish(bn, dn, hit);
  return finish(bn, dn, generatedDraft(bn, dn));
}

export type NameOnPath = {
  headline: string;
  detail: string;
  nnEqualsBn: boolean;
  nnEqualsDn: boolean;
};

export function nameOnBnDnPath(
  bnRaw: number | string,
  dnRaw: number | string,
  nnRaw: number | string,
): NameOnPath {
  const bn = reduceToSingleDigit(Number(bnRaw));
  const dn = reduceToSingleDigit(Number(dnRaw));
  const nn = reduceToSingleDigit(Number(nnRaw));
  const nnEqualsBn = nn === bn;
  const nnEqualsDn = nn === dn;

  if (nnEqualsBn && nnEqualsDn) {
    return {
      headline: "Name, Birth, and Destiny share one digit",
      detail:
        "How people meet you matches both the first habit and the longer work. That can feel simple to wear. Try: live that one habit honestly this week. Watch: treating ease as a guarantee.",
      nnEqualsBn,
      nnEqualsDn,
    };
  }
  if (nnEqualsBn) {
    return {
      headline: "Name matches Birth",
      detail: `How people meet you already looks like your first habit (${plainTrait(bn)}). The longer work is still ${plainTrait(dn)}. Try: keep using the first habit, then add one Destiny habit this week. Watch: staying in the first habit so the longer work never starts.`,
      nnEqualsBn,
      nnEqualsDn,
    };
  }
  if (nnEqualsDn) {
    return {
      headline: "Name matches Destiny",
      detail: `How people meet you already looks like the longer work (${plainTrait(dn)}). The birth-day habit (${plainTrait(bn)}) stays yours in private. That can make the longer work show up in public sooner than it feels inside. Try: do one Destiny habit this week. Watch: skipping the birth-day habit because the name already sounds like the goal.`,
      nnEqualsBn,
      nnEqualsDn,
    };
  }

  const toBn = vedicPairTone(nn, bn);
  const toDn = vedicPairTone(nn, dn);
  const ease =
    toDn === "Amazing" || toDn === "Favourable"
      ? "often fits the longer work"
      : toDn === "Challenging"
        ? "tends to slow Destiny decisions — they take longer than you expect"
        : "sits in a mixed way with the longer work";
  const birthEase =
    toBn === "Amazing" || toBn === "Favourable"
      ? "and usually fits the birth-day habit"
      : toBn === "Challenging"
        ? "and may contrast the birth-day habit (useful tension, not a flaw)"
        : "and sits beside the birth-day habit rather than matching it";

  return {
    headline: "Name is a first impression, not a replacement",
    detail: `How people meet you is ${plainTrait(nn)} (${nn}). That is not the birth-day habit (${bn}) and not the longer work (${dn}). It ${ease}, ${birthEase}. Try one name habit this week, then go back to the day habit. Watch: treating the spelling as if it replaced your birth date.`,
    nnEqualsBn,
    nnEqualsDn,
  };
}

export type TwoNameMapsCopy = {
  agree: boolean;
  mainLabel: string;
  otherLabel: string;
  headline: string;
  detail: string;
};

export function twoNameMapsCopy(
  mainRaw: string | number,
  otherRaw: string | number | undefined,
  mainCompound?: string | number,
  otherCompound?: string | number,
): TwoNameMapsCopy | null {
  if (otherRaw == null || otherRaw === "") return null;
  const main = String(mainRaw);
  const other = String(otherRaw);
  const agree = main === other;
  const mainC = mainCompound != null && String(mainCompound) !== "" ? String(mainCompound) : null;
  const otherC =
    otherCompound != null && String(otherCompound) !== "" ? String(otherCompound) : null;

  return {
    agree,
    mainLabel: mainC ? `${main} (letters added to ${mainC}, then reduced)` : main,
    otherLabel: otherC ? `${other} (letters added to ${otherC}, then reduced)` : other,
    headline: agree
      ? "Both letter charts agree on this spelling"
      : "Same name, two ways of adding the letters",
    detail: agree
      ? "Two Indian-style alphabets were used. They landed on the same Name digit, so the first-impression number is stable for this spelling. The story above uses this digit."
      : `Letters get different values in different Indian charts (for example C or H). Chart A reads Name ${main}. Chart B reads Name ${other}. These are two totals from two alphabets — two jobs, not two people. Neither wins. The Vedic story on this page uses the main chart: Name ${main}.`,
  };
}
