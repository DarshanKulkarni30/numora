/**
 * Vedic digit themes (1–9) — NumoraWisdom original copy.
 * Keywords align with common Indian-style teaching maps (Leader, Harmony…).
 * Synthesized for reflective Psychic (Moolank) and Destiny (Bhagyank) use—
 * not medical, legal, or predictive advice; not third-party verbatim text.
 */

export type VedicDigitTheme = {
  keyword: string;
  planet: string;
  /** Short line for Psychic / day temperament. */
  psychicFocus: string;
  /** Short line for Destiny / path themes. */
  destinyFocus: string;
  strengths: string[];
  watchouts: string[];
  /** Reflective pacing / habit cue—not a remedy prescription. */
  practice: string;
  /** Soft career atmosphere cues only. */
  workTone: string;
};

export const VEDIC_DIGIT_THEMES: Record<number, VedicDigitTheme> = {
  1: {
    keyword: "Leader",
    planet: "Sun",
    psychicFocus:
      "Day-to-day drive toward initiative, visibility, and making the first move.",
    destinyFocus:
      "Outer-path themes of pioneering, self-direction, and standing as an originator.",
    strengths: [
      "Confidence to start when others hesitate",
      "Clear personal standards",
      "Creative problem-solving under pressure",
    ],
    watchouts: [
      "Impatience when results arrive slowly",
      "Over-controlling rooms that need collaboration",
      "Clashing with other strong wills for the same lead role",
    ],
    practice:
      "Start one thing clearly. Then let someone else add their part.",
    workTone:
      "Suits roles with autonomy, ownership, and visible responsibility (reflective cue only).",
  },
  2: {
    keyword: "Harmony",
    planet: "Moon",
    psychicFocus:
      "Day-to-day sensitivity, peacemaking, and reading how a room feels.",
    destinyFocus:
      "Path themes of partnership, diplomacy, and progress through cooperation.",
    strengths: [
      "Emotional intelligence and patience",
      "Ability to soothe conflict",
      "Loyalty once trust is built",
    ],
    watchouts: [
      "Taking criticism too personally",
      "Difficulty saying no",
      "Quiet withdrawal instead of clear needs",
    ],
    practice:
      "Keep the peace, and still say no once this week.",
    workTone:
      "Suits teaching, mediation, care, and collaborative crafts (reflective cue only).",
  },
  3: {
    keyword: "Creativity",
    planet: "Jupiter",
    psychicFocus:
      "Day-to-day expressiveness, humor, and the urge to share ideas aloud.",
    destinyFocus:
      "Path themes of growth through communication, learning, and optimistic expansion.",
    strengths: [
      "Lively communication",
      "Idea generation and storytelling",
      "Social ease that opens doors",
    ],
    watchouts: [
      "Scattered focus across too many projects",
      "Skipping depth for sparkle",
      "Impulsive spending of time or energy",
    ],
    practice:
      "Finish and share one idea. Not ten drafts.",
    workTone:
      "Suits media, teaching, design, and people-facing storytelling roles (reflective cue only).",
  },
  4: {
    keyword: "Stability",
    planet: "Rahu",
    psychicFocus:
      "Day-to-day preference for structure, honest systems, and dependable effort.",
    destinyFocus:
      "Path themes of building foundations—often through unconventional or hard-won routes.",
    strengths: [
      "Discipline and follow-through",
      "Practical problem-solving",
      "Reliability when others waver",
    ],
    watchouts: [
      "Rigidity when plans must change",
      "Over-serious tone that blocks play",
      "Restlessness if structure feels empty",
    ],
    practice:
      "Keep one routine. Let one plan change without throwing the rest out.",
    workTone:
      "Suits analysis, building, technical craft, and orderly stewardship (reflective cue only).",
  },
  5: {
    keyword: "Freedom",
    planet: "Mercury",
    psychicFocus:
      "Day-to-day curiosity, quick speech, and appetite for movement and variety.",
    destinyFocus:
      "Path themes of change, commerce of ideas, and learning through experience.",
    strengths: [
      "Adaptability under shifting conditions",
      "Persuasive, lively communication",
      "Courage to try the unfamiliar",
    ],
    watchouts: [
      "Restlessness that breaks useful routines",
      "Talking past listening",
      "Commitment fatigue when life feels fenced in",
    ],
    practice:
      "Try one small new thing. Come back to the routine after.",
    workTone:
      "Suits sales, travel-adjacent work, writing, and fast-feedback roles (reflective cue only).",
  },
  6: {
    keyword: "Care",
    planet: "Venus",
    psychicFocus:
      "Day-to-day warmth, aesthetic sense, and the urge to protect people you love.",
    destinyFocus:
      "Path themes of responsibility, beauty in daily life, and service through relationship.",
    strengths: [
      "Devotion and loyalty",
      "Taste for harmony and craft",
      "Quiet leadership that people trust",
    ],
    watchouts: [
      "Care that tips into control",
      "Over-giving until resentment builds",
      "Avoiding hard truths to keep peace",
    ],
    practice:
      "Keep one promise to someone else, and one hour that is for you.",
    workTone:
      "Suits healing, teaching, design, hospitality, and family-centered work (reflective cue only).",
  },
  7: {
    keyword: "Wisdom",
    planet: "Ketu",
    psychicFocus:
      "Day-to-day inwardness, analysis, and preference for depth over small talk.",
    destinyFocus:
      "Path themes of insight, research, and meaning sought beneath appearances.",
    strengths: [
      "Strong intuition and pattern sense",
      "Independent thinking",
      "Capacity for focused study",
    ],
    watchouts: [
      "Overthinking that stalls action",
      "Emotional distance that confuses partners",
      "Critical tone when others move slower",
    ],
    practice:
      "Tell one honest thought to someone you trust. Then stop.",
    workTone:
      "Suits research, writing, counseling, and specialist craft (reflective cue only).",
  },
  8: {
    keyword: "Success",
    planet: "Saturn",
    psychicFocus:
      "Day-to-day seriousness about duty, results, and earning trust through effort.",
    destinyFocus:
      "Path themes of material mastery, authority, and rewards that arrive after endurance.",
    strengths: [
      "Management instinct and judgment of character",
      "Patience with long games",
      "Loyalty to word and work",
    ],
    watchouts: [
      "Work that crowds out rest and relationship",
      "Ambition that forgets joy",
      "Appearing cold while caring deeply",
    ],
    practice:
      "Finish one real result. Then rest as if rest were part of the job.",
    workTone:
      "Suits finance, operations, law, and enterprise building (reflective cue only).",
  },
  9: {
    keyword: "Humanity",
    planet: "Mars",
    psychicFocus:
      "Day-to-day heat—courage, compassion, and urgency to act for people or causes.",
    destinyFocus:
      "Path themes of completion, generosity, and channeling fire into service.",
    strengths: [
      "Brave follow-through",
      "Wide empathy and creative fire",
      "Willingness to stand for others",
    ],
    watchouts: [
      "Impulse before reflection",
      "Holding the past too tightly",
      "Scattered focus across too many missions",
    ],
    practice:
      "Pick one cause. Do one next step. Then stop.",
    workTone:
      "Suits healing, defense of others, arts with impact, and high-energy craft (reflective cue only).",
  },
};

export function vedicDigitTheme(n: number | string): VedicDigitTheme {
  let x = Math.abs(Math.trunc(Number(n)));
  while (x > 9) {
    x = String(x)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  if (x < 1 || x > 9) return VEDIC_DIGIT_THEMES[1];
  return VEDIC_DIGIT_THEMES[x];
}

/** Compact meaning string for report Psychic / Destiny fields. */
export function vedicRoleMeaning(
  n: number | string,
  role: "psychic" | "destiny",
): string {
  const t = vedicDigitTheme(n);
  const focus = role === "psychic" ? t.psychicFocus : t.destinyFocus;
  const label = role === "psychic" ? "Psychic (Moolank)" : "Destiny (Bhagyank)";
  return `${label} ${Number(n)} · ${t.keyword} (${t.planet}): ${focus} Strengths often noted: ${t.strengths.slice(0, 2).join("; ")}. Watch: ${t.watchouts[0]}. Practice: ${t.practice}`;
}
