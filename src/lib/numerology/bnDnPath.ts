/**
 * Birth (Psychic) → Destiny path copy, plus how Name sits on that path.
 * Reflective pacing only — not events, health, legal, or purchase advice.
 */

import { reduceToSingleDigit } from "./dateNumbers";
import { vedicPairTone } from "./vedicCompatibility";
import { VEDIC_DIGIT_THEMES } from "./vedicNumberThemes";

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
  feelsLike: string;
  shapes: string;
};

export const VEDIC_LAYER_MAP: VedicLayerExplainer[] = [
  {
    id: "bn",
    shortTitle: "Birth · Psychic",
    represents:
      "From the day of the month you were born. How you react first, before you have thought about it.",
    feelsLike:
      "This is how you behave on an ordinary day when nothing is being demanded of you.",
    shapes: "Early habits, instinctive reactions, natural strengths.",
  },
  {
    id: "dn",
    shortTitle: "Destiny",
    represents:
      "From your full birth date. The theme that keeps coming back across jobs, places and relationships.",
    feelsLike:
      "This is the lesson that keeps reappearing in different forms until you get good at it.",
    shapes: "Major chapters, recurring lessons, how the path matures.",
  },
  {
    id: "nn",
    shortTitle: "Name",
    represents: "The outer face of this spelling — how you are introduced.",
    feelsLike: "This is the tone I carry into rooms, work, and first impressions.",
    shapes: "Social ease, how others meet you, the “vehicle” on the Birth → Destiny road.",
  },
];

const FROM: Record<number, string> = {
  1: "self-direction",
  2: "relational sensitivity",
  3: "expressive warmth",
  4: "structured effort",
  5: "restless curiosity",
  6: "care and harmony",
  7: "inward study",
  8: "endurance and ambition",
  9: "completion and compassion",
};

const TO: Record<number, string> = {
  1: "clearer self-authority",
  2: "patience and partnership",
  3: "sharing and creative speech",
  4: "foundations and steady building",
  5: "flexibility and wider horizons",
  6: "responsibility and tending others",
  7: "stillness and inner truth",
  8: "mastery and long-range aims",
  9: "release and wider care",
};

const SAME: Record<number, TransitionDraft> = {
  1: {
    feel: "Identity intensifies; repeated calls to stand on your own.",
    atmosphere: "Leadership moments, decisive crossroads, self-reliance as a practice.",
    invitation: "Claim authority with clarity; refine a personal vision without forcing others.",
  },
  2: {
    feel: "Sensitivity doubles; life keeps asking for cooperation.",
    atmosphere: "Partnerships, negotiation and reading other people's moods are where most of the learning happens.",
    invitation: "Honor feeling without disappearing; practice patience as strength.",
  },
  3: {
    feel: "Day habit and long path are the same: talking, play, and sharing ideas.",
    atmosphere: "Home, work, and friends may keep handing you speaking or making work.",
    invitation: "Finish one thing you started saying. Watch: starting many talks and closing none.",
  },
  4: {
    feel: "Structure deepens; the lesson is to keep building.",
    atmosphere: "Routines, systems, slow progress that actually holds.",
    invitation: "Stay with the scaffold; loosen rigidity where life needs give.",
  },
  5: {
    feel: "Change is home; restlessness is the curriculum.",
    atmosphere: "Variety, movement of mind, openings that do not stay still.",
    invitation: "Choose a few experiments; freedom needs a chosen path.",
  },
  6: {
    feel: "Care is both instinct and assignment.",
    atmosphere: "Home, loyalty, harmony work, tending people and places.",
    invitation: "Give without emptying; duty and joy can share a room.",
  },
  7: {
    feel: "The inner life is both refuge and homework.",
    atmosphere: "Study, solitude, intuition, meaning-making away from noise.",
    invitation: "Trust stillness; let insight become usable, not only private.",
  },
  8: {
    feel: "Ambition and endurance keep meeting you.",
    atmosphere: "Long projects, authority tests, stamina as the weather.",
    invitation: "Build with integrity; pair drive with rest so mastery can last.",
  },
  9: {
    feel: "Completion and compassion stay on the syllabus.",
    atmosphere: "Endings, forgiveness practice, care that wants to go wider.",
    invitation: "Close loops cleanly; let love move beyond the personal without bypassing it.",
  },
};

function finish(bn: number, dn: number, draft: TransitionDraft): BnDnTransition {
  const from = VEDIC_DIGIT_THEMES[bn];
  const to = VEDIC_DIGIT_THEMES[dn];
  const looksLike =
    draft.looksLike ??
    (bn === dn
      ? `Both numbers are the same, so the same theme shows up in your daily reactions and in your longer direction. Expect ${from.keyword.toLowerCase()} work to keep landing on you — ${from.psychicFocus} Doubled like this it becomes your strongest skill and your least examined habit, so it is worth checking occasionally whether it actually suits the situation.`
      : `In practice this looks like your first instinct (${from.keyword}: ${from.psychicFocus}) meeting a longer assignment (${to.keyword}: ${to.destinyFocus}) You will notice the difference most at home, at work and with people close to you — those are the places where the quick reaction and the longer aim have to be reconciled.`);
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

/** Hand-tuned BN→DN rows (user research, rewritten as reflective themes). */
const CURATED: Record<string, TransitionDraft> = {
  "1-2": {
    feel: "Shift from self-focus toward relational awareness.",
    atmosphere: "Partnerships, diplomacy, and emotional sensitivity as growing skills.",
    invitation: "Learn cooperation and subtle influence without dropping your own centre.",
  },
  "1-5": {
    feel: "Movement from a single focus toward exploration.",
    atmosphere: "Themes of variety, openings, and a wider field of interest.",
    invitation: "Stay flexible; expand without treating restlessness as failure.",
  },
  "2-4": {
    feel: "Emotional energy looks for structure and ground.",
    atmosphere: "Routines, foundations, slow but steady progress.",
    invitation: "Build resilience and practical strength around a sensitive core.",
  },
  "2-7": {
    feel: "Sensitivity turns inward toward contemplation.",
    atmosphere: "Solitude, study, spiritual or intellectual depth as weather.",
    invitation: "Trust intuition; cultivate inner stillness without cutting all ties.",
  },
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
      "3 is the birth day reduced (Psychic / Birth Day). 6 is the full date reduced (Destiny / Life Path). The report reads “from 3 toward 6.” Creativity is the start; care is the longer lesson.",
    expert:
      "Vedic Moolank 3 (Jupiter) → Bhagyank 6 (Venus). Pythagorean Birth Day 3 → Life Path 6 is the same date math with optional master numbers on the path. Not a prediction of family or career.",
  },
  "3-9": {
    feel: "You like to talk and share ideas (3). Life also asks you to finish things and help a wider group (9). Keep creating — and ask who it is for.",
    atmosphere: "Teaching, mentoring, and closing old chapters. Help that goes past close friends.",
    invitation: "Teach what you know in simple words. Finish one thing before you start a new cause.",
    looksLike:
      "A storyteller who starts teaching. A hobby that turns into helping strangers. It can also look like starting many “good” projects and finishing none.",
    helps: [
      "Your words can help someone, not only entertain",
      "You can end a chapter without calling it failure",
    ],
    watch: [
      "Talking about helping the world while one nearby person waits",
      "Too many causes, nothing finished",
    ],
  },
  "4-1": {
    feel: "Structure transforms into initiative and independence.",
    atmosphere: "New beginnings, self-driven paths, tests of personal decision.",
    invitation: "Step forward; trust your own calls after years of building.",
  },
  "4-8": {
    feel: "Discipline evolves into ambition and mastery.",
    atmosphere: "Work stamina, long-range aims, authority as a slow craft.",
    invitation: "Refine strategy and perseverance; let effort become skill, not grind alone.",
  },
  "4-9": {
    feel: "Practicality opens into emotional and spiritual release.",
    atmosphere: "Endings, completions, maturation of what you have built.",
    invitation: "Let go gracefully; treat closure as transformation, not failure.",
  },
  "5-1": {
    feel: "Freedom looks for a focused direction.",
    atmosphere: "New ventures of attention, decisive choices, personal breakthroughs of habit.",
    invitation: "Commit to a path; turn scattered ideas into one honest action.",
  },
  "5-6": {
    feel: "You like change and new things (5). Life also asks you to stay and take care of people or a home (6). You can still explore — and someone may need you on ordinary days, not only on trips.",
    atmosphere: "Home, partnership, and being reliable, while your mind still wants movement.",
    invitation: "Choose a few people or habits to stay with. Freedom is still freedom if you come back.",
    looksLike:
      "Someone who used to move jobs or cities now keeps a home or a team. It can also look like getting angry at “boring” duty.",
    helps: [
      "You can care for people without becoming rigid",
      "You can keep play inside a stable life",
    ],
    watch: [
      "Blaming the people you chose to stay with",
      "Leaving (new job, new city, new crush) when care feels heavy",
    ],
  },
  "5-8": {
    feel: "Change sharpens into ambition and achievement themes.",
    atmosphere: "High-stakes work weather, pressure that can become craft.",
    invitation: "Harness discipline; turn momentum into mastery instead of more motion.",
  },
  "6-3": {
    feel: "Responsibility softens into creativity and expression.",
    atmosphere: "Social expansion, artistic pursuits, a lighter emotional tone.",
    invitation: "Rediscover joy; speak freely while still honoring care.",
  },
  "6-8": {
    feel: "Care evolves into structured ambition.",
    atmosphere: "Leadership of responsibility, resource themes, authority tests.",
    invitation: "Balance empathy with firmness; build success that others can live with.",
  },
  "6-9": {
    feel: "Nurturing expands into wider compassion.",
    atmosphere: "Service, healing-as-presence, release of over-personal worry.",
    invitation: "Practice forgiveness; let care flow beyond the inner circle.",
  },
  "7-2": {
    feel: "Solitude opens into connection and partnership.",
    atmosphere: "Collaborations, emotional bonds, shared decisions.",
    invitation: "Learn vulnerability; trust others with some of the inner world.",
  },
  "7-3": {
    feel: "Inner study opens toward warmer expression and counsel.",
    atmosphere: "Conversation, teaching-in-ordinary-life, insight that wants simple words.",
    invitation: "Share what you know privately; keep joy beside solitude.",
  },
  "7-5": {
    feel: "Introspection transforms into exploration.",
    atmosphere: "Learning, unexpected openings, mental expansion as weather.",
    invitation: "Stay curious; allow life to surprise a careful mind.",
  },
  "7-9": {
    feel: "Inner wisdom looks for a contribution beyond the self.",
    atmosphere: "Teaching, healing-as-presence, endings, completion of old patterns.",
    invitation: "Share insights; release what is finished with grace.",
  },
  "8-1": {
    feel: "Ambition resets into fresh beginnings.",
    atmosphere: "New leadership of the self, independence, bolder choices of direction.",
    invitation: "Lead with integrity; rebuild with clarity rather than more force.",
  },
  "8-2": {
    feel: "Power softens into cooperation and diplomacy.",
    atmosphere: "Partnerships, negotiations, emotional refinement of strength.",
    invitation: "Practice patience; pair firmness with sensitivity.",
  },
  "8-4": {
    feel: "Achievement wants to stabilize into long-term building.",
    atmosphere: "Structure, discipline, foundational work, steady progress.",
    invitation: "Commit deeply; build systems that can endure without constant heroics.",
  },
  "9-3": {
    feel: "Completion shifts into creative rebirth.",
    atmosphere: "Expression, social energy, new ideas, lighter emotional tone.",
    invitation: "Celebrate renewal; communicate what the last chapter taught.",
  },
  "9-6": {
    feel: "Wide compassion becomes personal care.",
    atmosphere: "Close-in healing of family patterns, emotional responsibilities, nurturing cycles.",
    invitation: "Ground empathy at home; create harmony in the near relationships.",
  },
  "9-7": {
    feel: "Emotional release turns into spiritual or intellectual inquiry.",
    atmosphere: "Solitude, study, inner healing, intuitive development.",
    invitation: "Seek truth; deepen the inner connection after the wide heart.",
  },
};

function generatedDraft(bn: number, dn: number): TransitionDraft {
  const from = FROM[bn] ?? "your starting tone";
  const toward = TO[dn] ?? "the next lesson";
  const fromKw = VEDIC_DIGIT_THEMES[bn]?.keyword ?? String(bn);
  const toKw = VEDIC_DIGIT_THEMES[dn]?.keyword ?? String(dn);
  return {
    feel: `You start with ${from} (number ${bn}, ${fromKw}). Over time, life also asks for ${toward} (number ${dn}, ${toKw}). The first number does not go away.`,
    atmosphere: `Day to day you may still act like ${fromKw}. The longer lesson is ${toKw}. This can show up at home, at work, or with close people.`,
    invitation: `Keep what is true about number ${bn}. Add practice for number ${dn}. Do not try to erase the first number.`,
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
        "The outer face matches both the default self and the long path. That can feel simple to wear — still a theme to live honestly, not a guarantee of ease.",
      nnEqualsBn,
      nnEqualsDn,
    };
  }
  if (nnEqualsBn) {
    return {
      headline: "Name echoes Birth",
      detail: `Name ${nn} repeats Psychic ${bn}. The world may meet the person you already are, while Destiny ${dn} is the growing edge. The name can support Birth traits; the path still asks the Birth → Destiny stretch.`,
      nnEqualsBn,
      nnEqualsDn,
    };
  }
  if (nnEqualsDn) {
    return {
      headline: "Name already speaks Destiny",
      detail: `Name ${nn} matches Destiny ${dn}. The outer identity may advertise the curriculum you are growing into, while Birth ${bn} stays the private default. That can make the transition more visible — sometimes sooner than it feels inside.`,
      nnEqualsBn,
      nnEqualsDn,
    };
  }

  const toBn = vedicPairTone(nn, bn);
  const toDn = vedicPairTone(nn, dn);
  const ease =
    toDn === "Amazing" || toDn === "Favourable"
      ? "often sits more easily with Destiny"
      : toDn === "Challenging"
        ? "tends to add friction on the Destiny side, which usually means decisions there take longer than you expect"
        : "sits in a mixed way with Destiny";
  const birthEase =
    toBn === "Amazing" || toBn === "Favourable"
      ? "and usually cooperates with Birth"
      : toBn === "Challenging"
        ? "and may contrast Birth (useful tension, not a flaw)"
        : "and is a third color beside Birth";

  return {
      headline: "Name is a third habit on the path",
      detail: `Name ${nn} is not Birth ${bn} and not Destiny ${dn}. People may meet ${VEDIC_DIGIT_THEMES[nn]?.keyword ?? nn} first. It ${ease}, ${birthEase}. Try one name habit, then return to the day habit. Not a second destiny.`,
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
      : "Same name, two letter charts — not two destinies",
    detail: agree
      ? "Two Indian-style alphabets were used. They landed on the same Name digit, so the outer-face number is stable for this spelling. The story above uses this digit."
      : `Letters are given different values in different Indian charts (for example C or H). The Vedic story on this page uses the main chart: Name ${main}. The second chart reads Name ${other} — a cross-check from another school, not a second person and not a contradiction of Birth or Destiny.`,
  };
}
