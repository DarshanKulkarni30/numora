/**
 * Report voice: Simple first, then optional student and expert notes.
 * Short words. No metaphor unless the next sentence explains it.
 */

export type LayeredCopy = {
  simple: string;
  student?: string;
  expert?: string;
};

export function plainTrait(n: number): string {
  const map: Record<number, string> = {
    1: "starting things and deciding for yourself",
    2: "working with others and being patient",
    3: "talking, play, and sharing ideas",
    4: "plans, routines, and steady work",
    5: "change, freedom, and trying new things",
    6: "care, home, and keeping promises",
    7: "quiet thinking and study",
    8: "plans, money, and responsibility",
    9: "finishing things and helping a wider group",
    11: "strong intuition and inspiring others",
    22: "building large, practical plans",
    33: "teaching and care at a high level",
  };
  return map[n] ?? `themes of ${n}`;
}

export function ageSpan(start: number, end: number | null): string {
  if (end == null) return `From age ${start} onward`;
  return `From about age ${start} to ${end}`;
}
