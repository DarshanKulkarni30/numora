/**
 * Pythagorean pinnacle cycles (month/day/year reduced, then four pinnacles).
 */

import { calculateAge, parseDob, reduceNumber } from "./reduce";
import { lifePathFromDob, reduceToSingleDigit } from "./dateNumbers";

export type PinnacleId = 1 | 2 | 3 | 4;

export type Pinnacle = {
  id: PinnacleId;
  number: number;
  ageStart: number;
  ageEnd: number | null;
};

export type PinnacleSet = {
  lifePath: number;
  firstEndsAtAge: number;
  pinnacles: Pinnacle[];
};

const PINNACLE_THEME: Record<number, { name: string; theme: string; shadow: string }> =
  {
    1: {
      name: "Leadership",
      theme: "Independence, career-building, self-direction.",
      shadow: "Ego, loneliness, or conflict when forcing pace.",
    },
    2: {
      name: "Partnership",
      theme: "Diplomacy, teamwork, and close cooperation.",
      shadow: "Oversensitivity or leaning too hard on others.",
    },
    3: {
      name: "Creativity",
      theme: "Speaking, writing, and artistic growth.",
      shadow: "Scattered energy or unfinished expression.",
    },
    4: {
      name: "Structure",
      theme: "Hard work, systems, and discipline.",
      shadow: "Delays and frustration when shortcuts fail.",
    },
    5: {
      name: "Change",
      theme: "Travel, relocation, and career or lifestyle shifts.",
      shadow: "Instability or disruption without a rebuild plan.",
    },
    6: {
      name: "Responsibility",
      theme: "Family, service, and leadership through care.",
      shadow: "Burden when yeses outrun rest.",
    },
    7: {
      name: "Learning",
      theme: "Study, inner work, and spiritual or technical depth.",
      shadow: "Isolation if the inner season is forced outward.",
    },
    8: {
      name: "Power and money",
      theme: "Stewardship, authority, and measurable results.",
      shadow: "Pressure and overwork without recovery.",
    },
    9: {
      name: "Completion",
      theme: "Closing cycles and releasing what no longer fits.",
      shadow: "Endings that feel like loss before the next chapter.",
    },
  };

export function pinnacleTheme(n: number) {
  const d = reduceToSingleDigit(n);
  return PINNACLE_THEME[d] ?? PINNACLE_THEME[1];
}

function reducePart(n: number): number {
  return reduceNumber(n, []);
}

export function pinnaclesForDob(dob: string): PinnacleSet {
  const { day, month, year } = parseDob(dob);
  const m = reducePart(month);
  const d = reducePart(day);
  const y = reducePart(year);
  const p1 = reducePart(m + d);
  const p2 = reducePart(d + y);
  const p3 = reducePart(p1 + p2);
  const p4 = reducePart(m + y);
  const lifePath = reduceToSingleDigit(lifePathFromDob(dob));
  const firstEndsAtAge = Math.max(18, 36 - lifePath);
  const secondEnd = firstEndsAtAge + 9;
  const thirdEnd = secondEnd + 9;
  const pinnacles: Pinnacle[] = [
    { id: 1, number: p1, ageStart: 0, ageEnd: firstEndsAtAge },
    { id: 2, number: p2, ageStart: firstEndsAtAge + 1, ageEnd: secondEnd },
    { id: 3, number: p3, ageStart: secondEnd + 1, ageEnd: thirdEnd },
    { id: 4, number: p4, ageStart: thirdEnd + 1, ageEnd: null },
  ];
  return { lifePath, firstEndsAtAge, pinnacles };
}

export function pinnacleAtAge(set: PinnacleSet, age: number): Pinnacle {
  const a = Math.max(0, Math.trunc(age));
  return (
    set.pinnacles.find((p) => {
      if (p.ageEnd == null) return a >= p.ageStart;
      return a >= p.ageStart && a <= p.ageEnd;
    }) ?? set.pinnacles[0]
  );
}

export function pinnacleAtDate(dob: string, asOf: Date): Pinnacle {
  return pinnacleAtAge(pinnaclesForDob(dob), calculateAge(dob, asOf));
}
