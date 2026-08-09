import { RULING_PLANETS, VEDIC_NAME, sumMappedLetters } from "./mappings";
import { parseDob, reduceNumber, reduceWithCompound } from "./reduce";

export type VedicResult = {
  psychic: number;
  destiny: number;
  nameNumber: number;
  nameCompound: number;
  rulingPlanet: string;
};

export function calculateVedic(fullName: string, dob: string): VedicResult {
  const { day, month, year } = parseDob(dob);
  const psychic = reduceNumber(day, []); // traditionally single digit 1–9
  const destiny = reduceNumber(day + month + year, []);
  const { compound, reduced } = reduceWithCompound(
    sumMappedLetters(fullName, VEDIC_NAME),
    [],
  );
  const nameNumber = reduced === 0 ? 9 : reduced;
  const rulingPlanet = RULING_PLANETS[psychic] ?? "Reflective planetary theme";

  return {
    psychic,
    destiny,
    nameNumber,
    nameCompound: compound,
    rulingPlanet,
  };
}
