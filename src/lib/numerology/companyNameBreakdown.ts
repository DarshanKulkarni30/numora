/**
 * Chaldean letter-by-letter company / brand name breakdown.
 * Reflective branding math—not legal or financial advice.
 */

import { CHALDEAN } from "./mappings";
import { chaldeanCompoundMeaning } from "./meanings";
import { PLANETS, VEDIC_PLANET_BY_NUMBER, type PlanetInfo } from "./planets";
import { reduceToSingleDigit } from "./dateNumbers";

export type LetterValue = {
  letter: string;
  value: number;
};

export type WordBreakdown = {
  word: string;
  letters: LetterValue[];
  compound: number;
  reduced: number;
  equation: string;
};

export type CompanyNameBreakdown = {
  raw: string;
  words: WordBreakdown[];
  /** Sum of per-word compounds (e.g. 25 + 25 = 50). */
  grandCompound: number;
  grandReduced: number;
  planet: PlanetInfo;
  compoundNote: string;
  ownerBridge: string;
};

function lettersForWord(word: string): LetterValue[] {
  return word
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((letter) => ({
      letter,
      value: CHALDEAN[letter] ?? 0,
    }))
    .filter((x) => x.value > 0);
}

function breakWord(word: string): WordBreakdown | null {
  const letters = lettersForWord(word);
  if (!letters.length) return null;
  const compound = letters.reduce((s, l) => s + l.value, 0);
  const reduced = reduceToSingleDigit(compound || 9);
  const equation = `${letters.map((l) => `${l.letter}(${l.value})`).join(" + ")} = ${compound}`;
  return { word, letters, compound, reduced, equation };
}

function ownerPlanetLine(psychic: number, destiny: number): string {
  const p = PLANETS[VEDIC_PLANET_BY_NUMBER[psychic] ?? "sun"];
  const d = PLANETS[VEDIC_PLANET_BY_NUMBER[destiny] ?? "sun"];
  if (psychic === destiny) {
    return `Owner chart reads as ${psychic}–${destiny} (double ${p.name})—Psychic and Destiny share the same tone.`;
  }
  return `Owner chart reads Psychic ${psychic} (${p.name}) · Destiny ${destiny} (${d.name}).`;
}

function bridgeNarrative(
  psychic: number,
  destiny: number,
  grandReduced: number,
  planet: PlanetInfo,
): string {
  const owner = ownerPlanetLine(psychic, destiny);
  const companyPlanet = planet.name;
  if (psychic === destiny && psychic === 3 && grandReduced === 5) {
    return `${owner} Company core ${grandReduced} is ruled by ${companyPlanet}—often read as trade, messaging, and commercial movement. Beside double Jupiter (knowledge/teaching), a Mercury-leaning brand total is sometimes used as a reflective bridge from wisdom themes toward clearer exchange and reach—not a profit guarantee.`;
  }
  if (psychic === destiny) {
    return `${owner} Company core ${grandReduced} (${companyPlanet}) sits beside that repeated birth tone. Notice whether the brand digit supports, softens, or tensions the owner’s ${psychic} theme—reflective only.`;
  }
  return `${owner} Company grand total reduces to ${grandReduced} (${companyPlanet}). Compare that planet tone with both birth numbers for a reflective brand–owner bridge—not a prediction.`;
}

/**
 * Break a company/brand string into Chaldean word math + grand total.
 */
export function analyzeCompanyNameChaldean(
  rawName: string,
  psychic: number,
  destiny: number,
): CompanyNameBreakdown | null {
  const raw = rawName.trim();
  if (raw.length < 2) return null;

  const words = raw
    .split(/[\s/_·•-]+/)
    .map((w) => breakWord(w))
    .filter((w): w is WordBreakdown => w != null);

  if (!words.length) return null;

  const grandCompound = words.reduce((s, w) => s + w.compound, 0);
  const grandReduced = reduceToSingleDigit(grandCompound || 9);
  const planetId = VEDIC_PLANET_BY_NUMBER[grandReduced] ?? "mercury";
  const planet = PLANETS[planetId];

  return {
    raw,
    words,
    grandCompound,
    grandReduced,
    planet,
    compoundNote: chaldeanCompoundMeaning(grandCompound),
    ownerBridge: bridgeNarrative(psychic, destiny, grandReduced, planet),
  };
}
