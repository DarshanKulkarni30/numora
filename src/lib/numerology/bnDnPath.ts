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
  feel: string;
  atmosphere: string;
  invitation: string;
};

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

const SAME: Record<number, BnDnTransition> = {
  1: {
    bn: 1,
    dn: 1,
    feel: "Identity intensifies; repeated calls to stand on your own.",
    atmosphere: "Leadership moments, decisive crossroads, self-reliance as a practice.",
    invitation: "Claim authority with clarity; refine a personal vision without forcing others.",
  },
  2: {
    bn: 2,
    dn: 2,
    feel: "Sensitivity doubles; life keeps asking for cooperation.",
    atmosphere: "Partnerships, diplomacy, and emotional weather as the main classroom.",
    invitation: "Honor feeling without disappearing; practice patience as strength.",
  },
  3: {
    bn: 3,
    dn: 3,
    feel: "Expression is both starting point and destination.",
    atmosphere: "Conversation, teaching-in-ordinary-life, creative output as daily weather.",
    invitation: "Finish what you start sharing; let joy have a container.",
  },
  4: {
    bn: 4,
    dn: 4,
    feel: "Structure deepens; the lesson is to keep building.",
    atmosphere: "Routines, systems, slow progress that actually holds.",
    invitation: "Stay with the scaffold; loosen rigidity where life needs give.",
  },
  5: {
    bn: 5,
    dn: 5,
    feel: "Change is home; restlessness is the curriculum.",
    atmosphere: "Variety, movement of mind, openings that do not stay still.",
    invitation: "Choose a few experiments; freedom needs a chosen path.",
  },
  6: {
    bn: 6,
    dn: 6,
    feel: "Care is both instinct and assignment.",
    atmosphere: "Home, loyalty, harmony work, tending people and places.",
    invitation: "Give without emptying; duty and joy can share a room.",
  },
  7: {
    bn: 7,
    dn: 7,
    feel: "The inner life is both refuge and homework.",
    atmosphere: "Study, solitude, intuition, meaning-making away from noise.",
    invitation: "Trust stillness; let insight become usable, not only private.",
  },
  8: {
    bn: 8,
    dn: 8,
    feel: "Ambition and endurance keep meeting you.",
    atmosphere: "Long projects, authority tests, stamina as the weather.",
    invitation: "Build with integrity; pair drive with rest so mastery can last.",
  },
  9: {
    bn: 9,
    dn: 9,
    feel: "Completion and compassion stay on the syllabus.",
    atmosphere: "Endings, forgiveness practice, care that wants to go wider.",
    invitation: "Close loops cleanly; let love move beyond the personal without bypassing it.",
  },
};

/** Hand-tuned BN→DN rows (user research, rewritten as reflective themes). */
const CURATED: Record<string, Omit<BnDnTransition, "bn" | "dn">> = {
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
    feel: "Creativity matures into responsibility and care.",
    atmosphere: "Family, community, artistic service, nurturing roles as themes.",
    invitation: "Balance joy with duty; pour expression into something that holds people.",
  },
  "3-9": {
    feel: "Expression expands into a wider human purpose.",
    atmosphere: "Teaching, guiding, and broader involvement as reflective tones.",
    invitation: "Develop compassion; share knowledge generously, not as performance.",
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
    feel: "Exploration becomes responsibility and care.",
    atmosphere: "Relationships deepen; home and stability themes rise.",
    invitation: "Cultivate loyalty; create emotional and practical harmony.",
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

function generated(bn: number, dn: number): BnDnTransition {
  const from = FROM[bn] ?? "your starting tone";
  const toward = TO[dn] ?? "the next lesson";
  const fromKw = VEDIC_DIGIT_THEMES[bn]?.keyword ?? String(bn);
  const toKw = VEDIC_DIGIT_THEMES[dn]?.keyword ?? String(dn);
  return {
    bn,
    dn,
    feel: `A shift from ${from} (${fromKw}) toward ${toward} (${toKw}).`,
    atmosphere: `${VEDIC_DIGIT_THEMES[dn]?.destinyFocus ?? "Path themes of the Destiny digit."} The Birth tone of ${fromKw} is the soil this grows in.`,
    invitation: `${VEDIC_DIGIT_THEMES[dn]?.practice ?? "Work with the Destiny theme as weather, not a verdict."} Keep what is true in Birth ${bn}.`,
  };
}

export function bnDnTransition(bnRaw: number | string, dnRaw: number | string): BnDnTransition {
  const bn = reduceToSingleDigit(Number(bnRaw));
  const dn = reduceToSingleDigit(Number(dnRaw));
  if (bn === dn) return SAME[bn] ?? generated(bn, dn);
  const hit = CURATED[`${bn}-${dn}`];
  if (hit) return { bn, dn, ...hit };
  return generated(bn, dn);
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
