/**
 * Letter-by-letter personal name math for any letter map.
 * Reflective teaching aid—not legal naming advice.
 */

import { CHALDEAN, PYTHAGOREAN } from "./mappings";
import { UNIT_SYSTEM_NAME_MAP } from "./vedicUnitSystem";
import { reduceToSingleDigit } from "./dateNumbers";
import { reduceNumber } from "./reduce";

export type NameLetterMapId = "pythagorean" | "chaldean" | "unit";

export type NameLetterValue = {
  letter: string;
  value: number;
};

export type NameWordBreakdown = {
  word: string;
  letters: NameLetterValue[];
  compound: number;
  reduced: number;
  equation: string;
};

export type NameMapBreakdown = {
  mapId: NameLetterMapId;
  label: string;
  raw: string;
  words: NameWordBreakdown[];
  grandCompound: number;
  /** Reduced name number (masters kept for Pythagorean / Chaldean where applicable). */
  nameNumber: number;
  /** Always 1–9 for trio-style compare. */
  singleDigit: number;
};

const MAPS: Record<
  NameLetterMapId,
  { label: string; map: Record<string, number>; masters: number[] }
> = {
  pythagorean: {
    label: "Pythagorean Expression",
    map: PYTHAGOREAN,
    masters: [11, 22, 33],
  },
  chaldean: {
    label: "Chaldean / Vedic name",
    map: CHALDEAN,
    masters: [11, 22],
  },
  unit: {
    label: "Unit System (Map B)",
    map: UNIT_SYSTEM_NAME_MAP,
    masters: [],
  },
};

function lettersForWord(
  word: string,
  map: Record<string, number>,
): NameLetterValue[] {
  return word
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((letter) => ({
      letter,
      value: map[letter] ?? 0,
    }))
    .filter((x) => x.value > 0);
}

function breakWord(
  word: string,
  map: Record<string, number>,
  masters: number[],
): NameWordBreakdown | null {
  const letters = lettersForWord(word, map);
  if (!letters.length) return null;
  const compound = letters.reduce((s, l) => s + l.value, 0);
  const reduced =
    masters.length > 0
      ? reduceNumber(compound, masters)
      : reduceToSingleDigit(compound || 9);
  const equation = `${letters.map((l) => `${l.letter}(${l.value})`).join(" + ")} = ${compound}`;
  return { word, letters, compound, reduced, equation };
}

export function analyzeNameByMap(
  rawName: string,
  mapId: NameLetterMapId,
): NameMapBreakdown | null {
  const raw = rawName.trim();
  if (raw.length < 1) return null;

  const cfg = MAPS[mapId];
  const words = raw
    .split(/[\s/_·•-]+/)
    .map((w) => breakWord(w, cfg.map, cfg.masters))
    .filter((w): w is NameWordBreakdown => w != null);

  if (!words.length) return null;

  const grandCompound = words.reduce((s, w) => s + w.compound, 0);
  const nameNumber =
    cfg.masters.length > 0
      ? reduceNumber(grandCompound, cfg.masters)
      : reduceToSingleDigit(grandCompound || 9);
  const singleDigit = reduceToSingleDigit(nameNumber);

  return {
    mapId,
    label: cfg.label,
    raw,
    words,
    grandCompound,
    nameNumber,
    singleDigit,
  };
}

/** A–Z master table for a letter map (teaching UI). */
export function masterLetterTable(
  mapId: NameLetterMapId,
): { letter: string; value: number }[] {
  const map = MAPS[mapId].map;
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => ({
    letter,
    value: map[letter] ?? 0,
  }));
}

export function letterMapLabel(mapId: NameLetterMapId): string {
  return MAPS[mapId].label;
}
