/**
 * First-name bookends: Cornerstone, Capstone, First Vowel.
 * Chaldean 1–8 letter groups with NumoraWisdom-native reflective copy.
 */

import { CHALDEAN } from "./mappings";
import { planetForVedic, type PlanetInfo } from "./planets";

export type NameLetterRole = "cornerstone" | "capstone" | "first-vowel";

export type NameLetterPoint = {
  role: NameLetterRole;
  label: string;
  letter: string;
  group: number;
  planet: PlanetInfo;
};

export type NameBookendsResult = {
  firstName: string;
  cornerstone: NameLetterPoint | null;
  capstone: NameLetterPoint | null;
  firstVowel: NameLetterPoint | null;
};

export type GroupBlurb = {
  theme: string;
  approach: string;
  growth: string;
  letters: string;
};

/** Original NumoraWisdom blurbs by Chaldean group (not third-party copy). */
export const GROUP_BLURBS: Record<number, GroupBlurb> = {
  1: {
    theme: "Self-directed starts",
    letters: "A, I, J, Q, Y",
    approach:
      "Group 1 letters often color beginnings with initiative and a preference to set direction rather than wait for cues.",
    growth:
      "A constructive practice: invite collaboration early so momentum stays connected to others.",
  },
  2: {
    theme: "Relational pacing",
    letters: "B, K, R",
    approach:
      "Group 2 letters may favor starting through partnership, listening, and reading the emotional room before pushing ahead.",
    growth:
      "A constructive practice: name your own preference clearly when harmony starts to erase it.",
  },
  3: {
    theme: "Expressive openings",
    letters: "C, G, L, S",
    approach:
      "Group 3 letters often open with ideas, warmth, and a wish to communicate or create something visible.",
    growth:
      "A constructive practice: finish one thread before opening the next creative door.",
  },
  4: {
    theme: "Structured beginnings",
    letters: "D, M, T",
    approach:
      "Group 4 letters may approach challenges with plan-first discipline and a focus on stable footing.",
    growth:
      "A constructive practice: allow one small change when the plan needs air.",
  },
  5: {
    theme: "Adaptive movement",
    letters: "E, H, N, X",
    approach:
      "Group 5 letters often begin with curiosity, quick pivots, and comfort in motion or conversation.",
    growth:
      "A constructive practice: choose a simple anchor habit so versatility does not scatter focus.",
  },
  6: {
    theme: "Care and harmony",
    letters: "U, V, W",
    approach:
      "Group 6 letters may start from care—home, fairness, beauty, or responsibility toward people nearby.",
    growth:
      "A constructive practice: receive support as readily as you offer it.",
  },
  7: {
    theme: "Inward inquiry",
    letters: "O, Z",
    approach:
      "Group 7 letters often begin by observing beneath the surface—study, intuition, or a quieter strategy.",
    growth:
      "A constructive practice: share one insight with a trusted person so reflection becomes connection.",
  },
  8: {
    theme: "Stewarded effort",
    letters: "F, P",
    approach:
      "Group 8 letters may open with duty, endurance, and an eye toward lasting material or organizational results.",
    growth:
      "A constructive practice: pace ambition with rest so persistence stays humane.",
  },
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

/** First whitespace-separated token, letters A–Z only. */
export function extractFirstNameLetters(fullName: string): string {
  const token = fullName.trim().split(/\s+/)[0] ?? "";
  return token.toUpperCase().replace(/[^A-Z]/g, "");
}

function point(
  role: NameLetterRole,
  label: string,
  letter: string,
): NameLetterPoint | null {
  const group = CHALDEAN[letter];
  if (!group) return null;
  return {
    role,
    label,
    letter,
    group,
    planet: planetForVedic(group),
  };
}

/**
 * First vowel in the first name: A,E,I,O,U preferred.
 * Y counts only when no other vowel appears.
 */
export function findFirstVowelLetter(letters: string): string | null {
  for (const ch of letters) {
    if (VOWELS.has(ch)) return ch;
  }
  if (letters.includes("Y")) return "Y";
  return null;
}

export function analyzeNameBookends(fullName: string): NameBookendsResult {
  const firstName = extractFirstNameLetters(fullName);
  if (!firstName) {
    return {
      firstName: "",
      cornerstone: null,
      capstone: null,
      firstVowel: null,
    };
  }

  const vowel = findFirstVowelLetter(firstName);
  return {
    firstName,
    cornerstone: point("cornerstone", "Cornerstone", firstName[0]),
    capstone: point(
      "capstone",
      "Capstone",
      firstName[firstName.length - 1],
    ),
    firstVowel: vowel
      ? point("first-vowel", "First vowel", vowel)
      : null,
  };
}

export function groupBlurb(group: number): GroupBlurb | null {
  return GROUP_BLURBS[group] ?? null;
}

/** Short lines for report Chaldean analysis (generated, not ingested). */
export function bookendsAnalysisLines(fullName: string): string[] {
  const b = analyzeNameBookends(fullName);
  if (!b.cornerstone) return [];
  const lines: string[] = [
    `Name letters (first name “${b.firstName}”): Cornerstone ${b.cornerstone.letter} (group ${b.cornerstone.group}), Capstone ${b.capstone?.letter ?? "—"} (group ${b.capstone?.group ?? "—"})${
      b.firstVowel
        ? `, First vowel ${b.firstVowel.letter} (group ${b.firstVowel.group})`
        : ""
    }.`,
  ];
  const blurb = groupBlurb(b.cornerstone.group);
  if (blurb) {
    lines.push(
      `Cornerstone theme (${blurb.theme}): ${blurb.approach} ${blurb.growth}`,
    );
  }
  lines.push(
    "These letter bookends are reflective spelling cues for how beginnings, completions, and inner drive may feel—not predictions or fixed character labels.",
  );
  return lines;
}
