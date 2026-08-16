import {
  birthDayCompoundInsight,
  unitSystemNameNumber,
  temperamentChips,
  triadHarmony,
  zeroInDobInsight,
  UNIT_NUMBER_META,
  type HarmonyTone,
  type Dosha,
} from "./vedicUnitSystem";
import { VEDIC_NAME, sumMappedLetters } from "./mappings";
import { planetForVedic, planetLabel } from "./planets";
import { parseDob, reduceNumber, reduceWithCompound } from "./reduce";

export type VedicResult = {
  psychic: number;
  destiny: number;
  /** Current NumoraWisdom Vedic/Chaldean-aligned name number */
  nameNumber: number;
  nameCompound: number;
  /** Unit System name number (dual display) */
  unitSystemNameNumber: number;
  unitSystemNameCompound: number;
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
  psychicMeta: (typeof UNIT_NUMBER_META)[number];
  destinyMeta: (typeof UNIT_NUMBER_META)[number];
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
  const unitSystem = unitSystemNameNumber(fullName);
  const dayInsight = birthDayCompoundInsight(dob);
  const rulingPlanet = planetLabel(planetForVedic(psychic));
  const destinyRulingPlanet = planetLabel(planetForVedic(destiny));

  return {
    psychic,
    destiny,
    nameNumber,
    nameCompound: compound,
    unitSystemNameNumber: unitSystem.reduced,
    unitSystemNameCompound: unitSystem.compound,
    rulingPlanet,
    destinyRulingPlanet,
    birthDay: {
      day: dayInsight.day,
      note: dayInsight.note,
      exalted: dayInsight.exalted,
      leadingDigit: dayInsight.leadingDigit,
    },
    temperament: temperamentChips(day, psychic),
    harmony: triadHarmony(psychic, destiny, unitSystem.reduced),
    psychicMeta: UNIT_NUMBER_META[psychic] ?? UNIT_NUMBER_META[1],
    destinyMeta: UNIT_NUMBER_META[destiny] ?? UNIT_NUMBER_META[1],
    zeroNote: zeroInDobInsight(dob),
  };
}
