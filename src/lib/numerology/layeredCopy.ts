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

/** One amateur job for a chart or year digit. */
export function plainJob(n: number): string {
  const map: Record<number, string> = {
    1: "start one small thing",
    2: "wait and work with one other person",
    3: "finish one thing you started saying",
    4: "write one repeating plan",
    5: "try one small change",
    6: "keep one promise",
    7: "take ten quiet minutes before you answer",
    8: "finish one real result, then rest",
    9: "close one loop before opening another",
    11: "notice and rest — do not force a big launch",
    22: "take one practical step on a large plan",
    33: "help one person without emptying yourself",
  };
  return map[n] ?? `use the tone of ${n} in one small way`;
}

export function plainWatch(n: number): string {
  const map: Record<number, string> = {
    1: "starting so many things that none get a second day",
    2: "waiting so long that nothing is said",
    3: "starting many talks and closing none",
    4: "planning so long that the week never starts",
    5: "changing course every day",
    6: "saying yes until you have no rest",
    7: "going so quiet that people think you do not care",
    8: "pushing for results with no pause",
    9: "holding an ending that is already done",
    11: "thinking until the month is gone",
    22: "drawing a plan that never meets a calendar",
    33: "caring for everyone except yourself",
  };
  return map[n] ?? "treating the number as the whole self";
}

/** Digit 6: two actions, two verbs — "keep" does not work for an hour. */
export const CARE_HOUR_PRACTICE =
  "Keep one promise to someone else. Set aside one hour that is only for you.";
