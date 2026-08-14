import {
  birthDayCompoundInsight,
  johariNameNumber,
  temperamentChips,
  triadHarmony,
  zeroInDobInsight,
  JOHARI_NUMBER_META,
  type HarmonyTone,
  type Dosha,
} from "./johariVedic";
import { VEDIC_NAME, sumMappedLetters } from "./mappings";
import { planetForVedic, planetLabel } from "./planets";
import { parseDob, reduceNumber, reduceWithCompound } from "./reduce";

export type VedicResult = {
  psychic: number;
  destiny: number;
  /** Current Numora Vedic/Chaldean-aligned name number */
  nameNumber: number;
  nameCompound: number;
  /** Johari Unit System name number (dual display) */
  johariNameNumber: number;
  johariNameCompound: number;
  rulingPlanet: string;
  destinyRulingPlanet: string;
  birthDay: {
    day: number;
    note: string;
    exalted: boolean;
    leadingDigit: number | null;
  };
  temperament: { doshas: Dosha[]; summary: string };
  harmony: {
    tone: HarmonyTone;
    label: string;
    detail: string;
    set369: boolean;
  };
  psychicMeta: (typeof JOHARI_NUMBER_META)[number];
  destinyMeta: (typeof JOHARI_NUMBER_META)[number];
  zeroNote: string | null;
};

export function calculateVedic(fullName: string, dob: string): VedicResult {
  const { day, month, year } = parseDob(dob);
  const psychic = reduceNumber(day, []);
  const destiny = reduceNumber(day + month + year, []);
  const { compound, reduced } = reduceWithCompound(
    sumMappedLetters(fullName, VEDIC_NAME),
    [],
  );
  const nameNumber = reduced === 0 ? 9 : reduced;
  const johari = johariNameNumber(fullName);
  const dayInsight = birthDayCompoundInsight(dob);
  const rulingPlanet = planetLabel(planetForVedic(psychic));
  const destinyRulingPlanet = planetLabel(planetForVedic(destiny));

  return {
    psychic,
    destiny,
    nameNumber,
    nameCompound: compound,
    johariNameNumber: johari.reduced,
    johariNameCompound: johari.compound,
    rulingPlanet,
    destinyRulingPlanet,
    birthDay: {
      day: dayInsight.day,
      note: dayInsight.note,
      exalted: dayInsight.exalted,
      leadingDigit: dayInsight.leadingDigit,
    },
    temperament: temperamentChips(day, psychic),
    harmony: triadHarmony(psychic, destiny, johari.reduced),
    psychicMeta: JOHARI_NUMBER_META[psychic] ?? JOHARI_NUMBER_META[1],
    destinyMeta: JOHARI_NUMBER_META[destiny] ?? JOHARI_NUMBER_META[1],
    zeroNote: zeroInDobInsight(dob),
  };
}
