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
      theme: "Starting things on your own and building what you choose.",
      shadow: "Pushing so hard that you feel alone, or fight people for speed.",
    },
    2: {
      name: "Partnership",
      theme: "Working with others, waiting, and close teamwork.",
      shadow: "Feeling too much, or leaning too hard on other people.",
    },
    3: {
      name: "Creativity",
      theme: "Talking, writing, and sharing ideas.",
      shadow: "Starting many things and finishing few.",
    },
    4: {
      name: "Structure",
      theme: "Hard work, plans, and steady habits.",
      shadow: "Getting stuck or angry when a shortcut fails.",
    },
    5: {
      name: "Change",
      theme: "Movement, new places, and trying a different life shape.",
      shadow: "Changing so often that nothing has time to grow.",
    },
    6: {
      name: "Responsibility",
      theme: "Family, service, and care that people can count on.",
      shadow: "Saying yes until you have no rest.",
    },
    7: {
      name: "Learning",
      theme: "Study, quiet thinking, and going deeper.",
      shadow: "Hiding so long that people cannot reach you.",
    },
    8: {
      name: "Power and money",
      theme: "Plans, money, and results you can measure.",
      shadow: "Working without rest until the numbers own you.",
    },
    9: {
      name: "Completion",
      theme: "Finishing chapters and letting go of what no longer fits.",
      shadow: "An ending that feels like loss before the next start.",
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
