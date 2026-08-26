/**
 * Vedic digit themes (1–9) — NumoraWisdom original copy.
 * Keywords align with common Indian-style teaching maps (Leader, Harmony…).
 * Synthesized for reflective Psychic (Moolank) and Destiny (Bhagyank) use—
 * not medical, legal, or predictive advice; not third-party verbatim text.
 */

import { CARE_HOUR_PRACTICE } from "./layeredCopy";

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
      "The longer work is starting things and deciding for yourself — often going first.",
    strengths: [
      "You can start when others wait",
      "You know what you will and will not do",
      "You can solve a problem when time is short",
    ],
    watchouts: [
      "Starting so many things that none get a second day",
      "Taking over a room that needed teamwork",
      "Fighting for the lead when sharing it would finish the job",
    ],
    practice:
      "Start one thing clearly. Then let someone else add their part.",
    workTone:
      "Suits roles with autonomy, ownership, and visible responsibility (reflective only).",
  },
  2: {
    keyword: "Harmony",
    planet: "Moon",
    psychicFocus:
      "Day-to-day sensitivity, peacemaking, and reading how a room feels.",
    destinyFocus:
      "The longer work is working with others and being patient.",
    strengths: [
      "You notice how a room feels before you speak",
      "You can calm a fight without making it worse",
      "Once you trust someone, you stay",
    ],
    watchouts: [
      "Taking a comment as an attack on you",
      "Saying yes when you mean no",
      "Going quiet instead of saying what you need",
    ],
    practice:
      "Keep the peace, and still say no once this week.",
    workTone:
      "Suits teaching, mediation, care, and collaborative crafts (reflective only).",
  },
  3: {
    keyword: "Creativity",
    planet: "Jupiter",
    psychicFocus:
      "Day-to-day expressiveness, humor, and the urge to share ideas aloud.",
    destinyFocus:
      "The longer work is talking, play, and sharing ideas.",
    strengths: [
      "You can say something in a way people remember",
      "You have more ideas than the week can hold",
      "You make it easier for people to talk to you",
    ],
    watchouts: [
      "Starting many talks and closing none",
      "Skipping the hard part because the joke landed",
      "Spending time or energy before you finish one thing",
    ],
    practice:
      "Finish and share one idea. Not ten drafts.",
    workTone:
      "Suits media, teaching, design, and people-facing storytelling roles (reflective only).",
  },
  4: {
    keyword: "Stability",
    planet: "Rahu",
    psychicFocus:
      "Day-to-day preference for structure, honest systems, and dependable effort.",
    destinyFocus:
      "The longer work is plans, routines, and steady work — even when the route is awkward.",
    strengths: [
      "You finish what you start",
      "You can fix a practical problem",
      "People can count on you when others flake",
    ],
    watchouts: [
      "Planning so long that the week never starts",
      "Being so serious that nobody can play",
      "Throwing out a good plan because one part changed",
    ],
    practice:
      "Keep one routine. Let one plan change without throwing the rest out.",
    workTone:
      "Suits analysis, building, technical craft, and orderly stewardship (reflective only).",
  },
  5: {
    keyword: "Freedom",
    planet: "Mercury",
    psychicFocus:
      "Day-to-day curiosity, quick speech, and appetite for movement and variety.",
    destinyFocus:
      "The longer work is change, freedom, and trying new things.",
    strengths: [
      "You can change course when a plan is stuck",
      "You can talk people into trying something new",
      "You will try the unfamiliar",
    ],
    watchouts: [
      "Changing course every day",
      "Talking past listening",
      "Leaving a useful routine because it feels fenced in",
    ],
    practice:
      "Try one small new thing. Come back to the routine after.",
    workTone:
      "Suits sales, travel-adjacent work, writing, and fast-feedback roles (reflective only).",
  },
  6: {
    keyword: "Care",
    planet: "Venus",
    psychicFocus:
      "Day-to-day warmth, aesthetic sense, and the urge to protect people you love.",
    destinyFocus:
      "The longer work is care, home, and keeping promises.",
    strengths: [
      "People can count on you to help",
      "You notice what a home or group needs",
      "You can keep a promise when it is dull",
    ],
    watchouts: [
      "Care that turns into control",
      "Saying yes until you have no rest",
      "Avoiding a hard truth to keep the peace",
    ],
    practice: CARE_HOUR_PRACTICE,
    workTone:
      "Suits healing, teaching, design, hospitality, and family-centered work (reflective only).",
  },
  7: {
    keyword: "Wisdom",
    planet: "Ketu",
    psychicFocus:
      "Day-to-day inwardness, analysis, and preference for depth over small talk.",
    destinyFocus:
      "The longer work is quiet thinking and study.",
    strengths: [
      "You can sit with a hard question",
      "You think for yourself",
      "Quiet time actually helps you think",
    ],
    watchouts: [
      "Thinking until the month is gone",
      "Going so quiet that people think you do not care",
      "Sounding sharp when others move slower than you",
    ],
    practice:
      "Tell one honest thought to someone you trust. Then stop.",
    workTone:
      "Suits research, writing, counseling, and specialist craft (reflective only).",
  },
  8: {
    keyword: "Success",
    planet: "Saturn",
    psychicFocus:
      "Day-to-day seriousness about duty, results, and earning trust through effort.",
    destinyFocus:
      "The longer work is plans, money, and responsibility — results after long effort.",
    strengths: [
      "You can run a long project",
      "You wait for a result that takes years",
      "You keep your word at work",
    ],
    watchouts: [
      "Pushing for results with no pause",
      "Work that crowds out rest and people",
      "Looking cold while you still care",
    ],
    practice:
      "Finish one real result. Then rest as if rest were part of the job.",
    workTone:
      "Suits finance, operations, law, and enterprise building (reflective only).",
  },
  9: {
    keyword: "Humanity",
    planet: "Mars",
    psychicFocus:
      "Day-to-day heat—courage, compassion, and urgency to act for people or causes.",
    destinyFocus:
      "The longer work is finishing things and helping a wider group.",
    strengths: [
      "You finish when others stall",
      "You care about people you do not know well",
      "You will stand up for someone else",
    ],
    watchouts: [
      "Acting before you think",
      "Holding an ending that is already done",
      "Too many causes, nothing finished",
    ],
    practice:
      "Pick one cause. Do one next step. Then stop.",
    workTone:
      "Suits healing, defense of others, arts with impact, and high-energy craft (reflective only).",
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
