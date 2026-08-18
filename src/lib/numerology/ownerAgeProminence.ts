/**
 * Classical reflective BN→DN lifetime shift for business naming, mobile
 * scoring, and name compatibility. BN (Psychic) leads early life; DN (Destiny)
 * rises after ~30–35.
 */

import { calculateAge } from "@/lib/numerology/reduce";

export type OwnerProminencePhase = "psychic_led" | "transition" | "destiny_led";

export type OwnerProminence = {
  age: number;
  phase: OwnerProminencePhase;
  /** Digit to emphasize vs company/mobile core */
  primaryCore: number;
  primaryLabel: "Psychic" | "Destiny";
  secondaryCore: number;
  secondaryLabel: "Psychic" | "Destiny";
  caption: string;
};

export function ownerProminenceFromDob(
  dob: string,
  psychic: number,
  destiny: number,
  now = new Date(),
): OwnerProminence {
  const age = calculateAge(dob, now);

  if (age >= 35) {
    return {
      age,
      phase: "destiny_led",
      primaryCore: destiny,
      primaryLabel: "Destiny",
      secondaryCore: psychic,
      secondaryLabel: "Psychic",
      caption: `Age ${age} · Destiny led for long-horizon path and naming`,
    };
  }

  if (age >= 30) {
    return {
      age,
      phase: "transition",
      primaryCore: psychic,
      primaryLabel: "Psychic",
      secondaryCore: destiny,
      secondaryLabel: "Destiny",
      caption: `Age ${age} · Transition · Psychic still primary, Destiny rising`,
    };
  }

  return {
    age,
    phase: "psychic_led",
    primaryCore: psychic,
    primaryLabel: "Psychic",
    secondaryCore: destiny,
    secondaryLabel: "Destiny",
    caption: `Age ${age} · Psychic led for early-life instinct and drive`,
  };
}
