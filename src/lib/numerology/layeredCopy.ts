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
    1: "start one small thing today and put your name on it",
    2: "do one task with one other person this week",
    3: "finish one thing you started saying to someone",
    4: "write one repeating plan and keep it this week",
    5: "change one small thing this week, not everything",
    6: "keep one promise to someone, then keep one hour for yourself",
    7: "take ten quiet minutes, then answer the person who is waiting",
    8: "finish one result you can measure, then rest",
    9: "close one loop that is already done before you start another",
    11: "write one thing you keep noticing, then rest — do not force a launch",
    22: "put one practical step of the large plan on a real date",
    33: "help one person properly, then stop",
  };
  return map[n] ?? `use the tone of ${n} in one small way`;
}

/** How you start an ordinary day (Birth Day / Psychic). */
export function plainStart(n: number): string {
  const map: Record<number, string> = {
    1: "going first",
    2: "waiting for the other person",
    3: "talking or sharing an idea",
    4: "making a plan or putting things in order",
    5: "changing course",
    6: "looking after someone or keeping a promise",
    7: "going quiet to think",
    8: "pushing for a result",
    9: "finishing something or helping past the close circle",
    11: "noticing more than you can act on",
    22: "drawing a large plan",
    33: "helping several people at once",
  };
  return map[n] ?? `the tone of ${n}`;
}

/** How people meet you (Expression / Personality / Name). */
export function plainMeet(n: number): string {
  const map: Record<number, string> = {
    1: "someone who starts and decides",
    2: "someone patient who works with others",
    3: "someone who talks, jokes, and shares ideas",
    4: "someone planned and steady",
    5: "someone who likes change and room to move",
    6: "someone who looks after people and keeps promises",
    7: "someone quiet and hard to read",
    8: "someone who pushes for a result",
    9: "someone who finishes things and helps a wider group",
    11: "someone who notices a lot",
    22: "someone holding a large practical plan",
    33: "someone who teaches and cares",
  };
  return map[n] ?? `someone with the tone of ${n}`;
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
