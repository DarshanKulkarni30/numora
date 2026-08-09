import { VEDIC_NAME, sumMappedLetters } from "./mappings";
import { planetForVedic, planetLabel } from "./planets";
import { parseDob, reduceNumber, reduceWithCompound } from "./reduce";

export type VedicResult = {
  psychic: number;
  destiny: number;
  nameNumber: number;
  nameCompound: number;
  rulingPlanet: string;
  destinyRulingPlanet: string;
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
  const rulingPlanet = planetLabel(planetForVedic(psychic));
  const destinyRulingPlanet = planetLabel(planetForVedic(destiny));

  return {
    psychic,
    destiny,
    nameNumber,
    nameCompound: compound,
    rulingPlanet,
    destinyRulingPlanet,
  };
}
