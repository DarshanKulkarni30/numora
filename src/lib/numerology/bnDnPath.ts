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
};

type TransitionDraft = Pick<BnDnTransition, "feel" | "atmosphere" | "invitation"> &
  Partial<Pick<BnDnTransition, "looksLike" | "helps" | "watch">>;

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
    represents: "Your default wiring — who you are when nothing else is pulling.",
    feelsLike: "This is me on an ordinary day, before the world asks anything.",
    shapes: "Early habits, instinctive reactions, natural strengths.",
  },
  {
    id: "dn",
    shortTitle: "Destiny",
    represents: "The longer curriculum — themes life keeps returning you to.",
    feelsLike: "This is who I am growing into; the lesson keeps repeating.",
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
    atmosphere: "Partnerships, diplomacy, and emotional weather as the main classroom.",
    invitation: "Honor feeling without disappearing; practice patience as strength.",
  },
  3: {
    feel: "Expression is both starting point and destination.",
    atmosphere: "Conversation, teaching-in-ordinary-life, creative output as daily weather.",
    invitation: "Finish what you start sharing; let joy have a container.",
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
      ? `The same tone repeats at the start and on the long walk. Days and chapters may keep handing you ${from.keyword.toLowerCase()} work — ${from.psychicFocus} That is a concentration of weather, not a sentence.`
      : `Ordinary life often looks like this: the day’s habit (${from.keyword}: ${from.psychicFocus}) meeting a longer assignment (${to.keyword}: ${to.destinyFocus}) Home, work, and close relationships become the practice room.`);
  const helps = draft.helps ?? [
    from.strengths[0],
    to.strengths[0],
    to.strengths[1] ?? to.workTone,
  ];
  const watch = draft.watch ?? [
    from.watchouts[0],
    to.watchouts[0],
    to.watchouts[1] ?? from.watchouts[1],
  ];
  return {
    bn,
    dn,
    feel: draft.feel,
    atmosphere: draft.atmosphere,
    invitation: draft.invitation,
    looksLike,
    helps,
    watch,
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
    feel: "The 3-voice (speech, play, ideas) is asked to grow a container. Care and responsibility become the classroom — not the end of creativity.",
    atmosphere:
      "Home, loyalty, teaching, hosting, and work that other people rely on. The gift is still expression; the test is whether it feeds someone or something that lasts the week, not only the moment.",
    invitation:
      "Keep one creative practice that is yours alone, and one place where that gift actually holds people. Duty without joy dries out; joy without a vessel scatters.",
    looksLike:
      "A lively talker who becomes the person a family or team calls when something breaks. A designer, teacher, or performer who starts running the studio, the classroom, or the household calendar. Wit that used to entertain is asked to soothe, explain, or stay. It can also look like saying yes to every need because you can make it sound easy.",
    helps: [
      "Warmth that can actually hold people, not only charm a room",
      "Ideas that find a use — art, teaching, or a product someone lives with",
      "Social ease that builds loyalty instead of a string of first impressions",
      "Humor that makes duty bearable for you and for others",
    ],
    watch: [
      "Resentment if care swallows play and you never get the stage back",
      "Performing helpfulness (sounding responsible) instead of keeping the promise",
      "Using charm to dodge a hard conversation the 6-path still needs",
      "Guilt when you want solitude or applause — both are allowed; neither is the whole job",
    ],
  },
  "3-9": {
    feel: "Expression is asked to serve a wider circle. The 3-voice still talks and makes; the 9-path asks what the gift is for when the room is larger than friends.",
    atmosphere: "Teaching, mentoring, finishing chapters, and causes that pull you past personal applause.",
    invitation: "Share knowledge as hospitality, not performance. Close loops so the next creative start is clean.",
    looksLike:
      "A storyteller who becomes a mentor. A brand or hobby that turns into unpaid counseling. Heat for people you will never fully know. It can also look like collecting new missions before the last one is finished.",
    helps: [
      "Communication that actually lifts someone, not only entertains",
      "Permission to end a chapter without calling it failure",
      "Creative fire with a moral aim",
    ],
    watch: [
      "Saving the world in talk while one nearby relationship waits",
      "Scattered causes that feel noble and finish nothing",
      "Burnout from being 'on' for everyone",
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
    feel: "Curiosity is asked to stay. Variety does not vanish; someone or some place starts needing you on Tuesdays, not only on adventures.",
    atmosphere: "Home, partnership, and reliability themes rise beside a mind that still wants movement.",
    invitation: "Choose a few people and practices to be loyal to. Freedom with a return ticket is still freedom.",
    looksLike:
      "The traveler who starts keeping house. The job-hopper who is asked to manage a team. A restless mind that now has dependents — children, clients, a lease, a reputation. It can also look like picking fights with 'boring' duty.",
    helps: [
      "Adaptability that makes care less rigid",
      "Loyalty that still knows how to play",
      "A home or practice that can survive a change of plans",
    ],
    watch: [
      "Resenting the people you chose to stay for",
      "Secret exits (new crushes, new cities, new jobs) when care feels heavy",
      "Calling restlessness honesty when it is only escape",
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
    feel: `A shift from ${from} (${fromKw}) toward ${toward} (${toKw}). The starting tone does not vanish; it becomes the soil the next lesson grows in.`,
    atmosphere: `${VEDIC_DIGIT_THEMES[dn]?.destinyFocus ?? "Path themes of the Destiny digit."} Birth ${bn} (${fromKw}) is the habit you already know; Destiny ${dn} (${toKw}) is the chapter that keeps repeating.`,
    invitation: `${VEDIC_DIGIT_THEMES[dn]?.practice ?? "Work with the Destiny theme as weather, not a verdict."} Keep what is true in Birth ${bn} — the stretch is to add ${toKw.toLowerCase()}, not to erase ${fromKw.toLowerCase()}.`,
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
        ? "may add friction on the Destiny side — a cue to slow down, not a verdict"
        : "sits in a mixed way with Destiny";
  const birthEase =
    toBn === "Amazing" || toBn === "Favourable"
      ? "and usually cooperates with Birth"
      : toBn === "Challenging"
        ? "and may contrast Birth (useful tension, not a flaw)"
        : "and is a third color beside Birth";

  return {
    headline: "Name is a third color on the path",
    detail: `Name ${nn} is neither Birth ${bn} nor Destiny ${dn}. Think of it as the vehicle: it ${ease}, ${birthEase}. Use contrast as nuance — how you are introduced can speed, soften, or complicate the Birth → Destiny walk.`,
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
