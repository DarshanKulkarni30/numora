/**
 * Weighted strength constellation — gifts clustered around Life Path,
 * not a complete inventory.
 */

import { STRENGTH_BANK } from "./meanings";
import { reduceToSingleDigit } from "./dateNumbers";
import { plainJob, plainTrait, plainWatch } from "./layeredCopy";

export type StrengthWeight = "core" | "supporting" | "stretch";

export type StrengthSource = {
  name: string;
  raw: string;
};

export type StrengthNode = {
  label: string;
  title: string;
  detail: string;
  sources: string[];
  weight: StrengthWeight;
  fromLifePath: boolean;
  meaning: string;
  tryLine: string;
  watchLine: string;
  sourceLine: string;
};

export type StrengthConstellationModel = {
  nodes: StrengthNode[];
  map: StrengthNode[];
  extra: StrengthNode[];
  defaultIndex: number;
};

type StrengthAction = { try: string; watch: string };

/** One try and one watch per STRENGTH_BANK gift. Fallback is digit-level copy. */
export const STRENGTH_ACTIONS: Record<string, StrengthAction> = {
  "Comfort initiating when others hesitate": {
    try: "start one thing this week that the room is waiting on",
    watch: "starting so that no one else gets a turn",
  },
  "Clear sense of personal direction": {
    try: "name one direction out loud and keep it for a week",
    watch: "treating your plan as the only plan in the room",
  },
  "Courage to try original approaches": {
    try: "try one approach nobody asked for, then check if it helped",
    watch: "original for its own sake, with no one using the result",
  },
  "Natural diplomatic awareness": {
    try: "wait and work with one other person before you decide",
    watch: "smoothing so much that nothing is said",
  },
  "Ability to notice subtle emotional cues": {
    try: "name one feeling you noticed, then ask if you read it right",
    watch: "reading a mood so long that you never speak",
  },
  "Patience with collaborative processes": {
    try: "let one slow conversation finish before you add a new idea",
    watch: "waiting so long that the work never starts",
  },
  "Expressive and imaginative communication": {
    try: "say your main point in three sentences, then ask someone else what they think",
    watch: "explaining past the point where they already agreed",
  },
  "Uplifting presence in social settings": {
    try: "leave one room having asked more than you told",
    watch: "keeping the mood light when someone needed the hard answer",
  },
  "Playful problem-solving": {
    try: "take one stuck problem and try the least serious idea first",
    watch: "a new angle every day and no attempt finished",
  },
  "Dependable follow-through": {
    try: "finish the one task you already promised",
    watch: "taking on more promises so none of them land",
  },
  "Skill with systems and order": {
    try: "write one repeating plan and live it for a week",
    watch: "planning so long that the week never starts",
  },
  "Steady progress under pressure": {
    try: "keep one small step going when the week gets loud",
    watch: "pushing through with no pause until something breaks",
  },
  "Adaptability across changing contexts": {
    try: "try one small change, then stay with it for a day",
    watch: "changing course every day",
  },
  "Curious learning style": {
    try: "learn one new thing and use it once this week",
    watch: "collecting facts with no place they land",
  },
  "Resourcefulness when plans shift": {
    try: "when a plan breaks, pick one next step in ten minutes",
    watch: "treating every shift as a reason to start over",
  },
  "Warm sense of responsibility": {
    try: "keep one promise without adding a new one",
    watch: "saying yes until you have no rest",
  },
  "Eye for harmony and care": {
    try: "fix one small friction at home or work today",
    watch: "keeping the peace by never saying what you need",
  },
  "Loyalty in close relationships": {
    try: "show up for one person you already said you would",
    watch: "staying loyal to a pattern that is hurting you",
  },
  "Thoughtful analytical depth": {
    try: "take ten quiet minutes before you answer",
    watch: "thinking until the month is gone",
  },
  "Comfort with focused solitude": {
    try: "protect one quiet block this week and use it",
    watch: "going so quiet that people think you do not care",
  },
  "Discernment before acting": {
    try: "decide one thing after you have the facts, then act the same day",
    watch: "waiting for perfect information that never arrives",
  },
  "Strategic awareness of resources": {
    try: "finish one real result, then rest",
    watch: "tracking every resource and using none of them",
  },
  "Drive to complete meaningful goals": {
    try: "pick one goal and close a loop on it this week",
    watch: "pushing for results with no pause",
  },
  "Capacity for organized leadership": {
    try: "give one person a clear next step and then step back",
    watch: "organizing everyone else's week and skipping your own rest",
  },
  "Broad empathy and perspective": {
    try: "help one person without taking on their whole list",
    watch: "holding an ending that is already done",
  },
  "Willingness to support others' growth": {
    try: "help one person take their own next step",
    watch: "coaching so much that your own work stalls",
  },
  "Ability to close chapters with grace": {
    try: "close one loop before opening another",
    watch: "reopening a chapter that is already finished",
  },
  "Inspirational insight": {
    try: "notice and rest — do not force a big launch",
    watch: "thinking until the month is gone",
  },
  "Sensitivity to meaningful patterns": {
    try: "write down one pattern you noticed, then stop for the day",
    watch: "reading signs in everything and acting on none of them",
  },
  "Capacity to motivate through ideas": {
    try: "share one idea and then let someone else run with it",
    watch: "inspiring a room and leaving no one with a next step",
  },
  "Vision paired with practical building": {
    try: "take one practical step on a large plan",
    watch: "drawing a plan that never meets a calendar",
  },
  "Long-range project stamina": {
    try: "put one date on the large plan and keep it",
    watch: "staying busy on the plan with no visible result this month",
  },
  "Ability to coordinate complex efforts": {
    try: "give two people one shared next step",
    watch: "coordinating so much that no one including you is building",
  },
  "Compassionate teaching energy": {
    try: "help one person without emptying yourself",
    watch: "caring for everyone except yourself",
  },
  "Creative care for communities": {
    try: "do one small useful thing for a group you already belong to",
    watch: "taking on a whole community when one person needed you",
  },
  "Uplifting influence through example": {
    try: "do one thing you would tell someone else to do, then stop talking about it",
    watch: "setting an example that you do not actually live this week",
  },
};

/**
 * Splits a strength only at a real clause boundary. Cutting on a preposition
 * produced half-phrases like "Willingness" from "Willingness to support
 * others' growth", so the title now keeps the whole phrase unless a comma or
 * dash offers a clean break.
 */
export function splitStrengthLabel(label: string): { title: string; detail: string } {
  const clean = label.replace(/[.。].*$/, "").trim();
  const split = /^([^,—–]+)\s*[,—–]\s*(.+)$/.exec(clean);
  if (split) {
    return { title: split[1]!.trim(), detail: split[2]!.trim() };
  }
  return { title: clean, detail: "" };
}

function digitsFor(raw: string): number[] {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return [];
  const out = [n];
  const reduced = reduceToSingleDigit(n);
  if (reduced !== n) out.push(reduced);
  return out;
}

function banksInclude(label: string, raw: string): boolean {
  return digitsFor(raw).some((d) => (STRENGTH_BANK[d] ?? []).includes(label));
}

function joinNames(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function buildSourceLine(matched: StrengthSource[]): string {
  if (!matched.length) return "Tied to more than one seat on this chart.";
  const groups = new Map<string, string[]>();
  for (const b of matched) {
    const trait = plainTrait(Number(b.raw));
    const list = groups.get(trait) ?? [];
    list.push(`${b.name} ${b.raw}`);
    groups.set(trait, list);
  }
  if (groups.size === 1) {
    const [trait, seats] = [...groups.entries()][0]!;
    if (seats.length === 1) return `Tied to ${seats[0]} — ${trait}.`;
    const verb = seats.length === 2 ? "both point" : "all point";
    return `Tied to ${joinNames(seats)} — ${verb} at ${trait}.`;
  }
  const parts = [...groups.entries()].map(([trait, seats]) =>
    `${joinNames(seats)} (${trait})`,
  );
  return `Tied to ${joinNames(parts)}.`;
}

function buildMeaning(
  weight: StrengthWeight,
  matched: StrengthSource[],
  lifePath?: string | null,
): string {
  const seats = matched.map((b) => `${b.name} ${b.raw}`);
  const others = matched
    .filter((b) => b.name !== "Life Path")
    .map((b) => `${b.name} ${b.raw}`);
  if (weight === "core") {
    if (others.length) {
      return `This sits next to Life Path ${lifePath ?? ""}, and also shows in ${joinNames(others)}. It may show up a lot.`;
    }
    return `This sits next to Life Path ${lifePath ?? ""}. It may show up a lot.`;
  }
  if (weight === "supporting") {
    return `This shows in ${joinNames(seats)}. It is familiar, not the whole self.`;
  }
  return seats.length
    ? `This is quieter on this chart (${joinNames(seats)}). It is in the mix, not a hole.`
    : "This is quieter on this chart. It is in the mix, not a hole.";
}

export function buildStrengthConstellation(opts: {
  strengths: string[];
  lifePath?: string | null;
  expression?: string | null;
  soulUrge?: string | null;
  vedicPsychic?: string | null;
}): StrengthConstellationModel {
  const banks: StrengthSource[] = [
    opts.lifePath ? { name: "Life Path", raw: opts.lifePath } : null,
    opts.expression ? { name: "Expression", raw: opts.expression } : null,
    opts.soulUrge ? { name: "Soul Urge", raw: opts.soulUrge } : null,
    opts.vedicPsychic ? { name: "Psychic", raw: opts.vedicPsychic } : null,
  ].filter((b): b is StrengthSource => b != null);

  const nodes: StrengthNode[] = opts.strengths.map((label) => {
    const { title, detail } = splitStrengthLabel(label);
    const matched = banks.filter((b) => banksInclude(label, b.raw));
    const fromLifePath = opts.lifePath
      ? banksInclude(label, opts.lifePath)
      : false;
    const sources = matched.map((b) => `${b.name} ${b.raw}`);
    const weight: StrengthWeight = fromLifePath
      ? "core"
      : matched.length >= 2
        ? "supporting"
        : "stretch";
    const firstNum = Number(matched[0]?.raw ?? opts.lifePath ?? 0);
    const action = STRENGTH_ACTIONS[label];
    return {
      label,
      title,
      detail,
      sources: sources.length ? sources : ["Chart mix"],
      weight,
      fromLifePath,
      meaning: buildMeaning(weight, matched, opts.lifePath),
      tryLine: `Try: ${action?.try ?? plainJob(firstNum)}.`,
      watchLine: `Watch: ${action?.watch ?? plainWatch(firstNum)}.`,
      sourceLine: buildSourceLine(matched),
    };
  });

  const rank = { core: 0, supporting: 1, stretch: 2 };
  const ordered = [...nodes].sort((a, b) => rank[a.weight] - rank[b.weight]);
  const map = ordered.slice(0, 5);
  const extra = ordered.slice(5);
  const defaultIndex = Math.max(
    0,
    map.findIndex((n) => n.weight === "core"),
  );

  return { nodes: ordered, map, extra, defaultIndex };
}

export function strengthWeightLabel(weight: StrengthWeight): string {
  if (weight === "core") return "Loud · next to Life Path";
  if (weight === "supporting") return "Familiar · more than one seat";
  return "Quiet · also in the mix";
}
