import { plainJob, plainTrait, plainWatch } from "@/lib/numerology/layeredCopy";
import {
  THEME_FAMILIES,
  type ChartSeat,
  type ThemeFamilyId,
  type ThemeHit,
} from "./themeGraph";

const TITLE_BY_DIGIT: Record<number, string> = {
  1: "The Starter — you go first",
  2: "The Partner — you work with someone",
  3: "The Voice — you talk it through",
  4: "The Planner — you write the steps",
  5: "The Changer — you switch course",
  6: "The Carer — you keep promises",
  7: "The Thinker — you pause first",
  8: "The Finisher of results — you count the work",
  9: "The Closer of loops — you end what is done",
  11: "The Noticer — you see it first",
  22: "The Builder — you put a large plan on a calendar",
  33: "The Teacher — you explain and care",
};

/** Short pull — used only inside the throughline, not as a title. */
const WANTS: Record<number, string> = {
  1: "a start that is yours",
  2: "one other person in the room",
  3: "ideas in motion",
  4: "a plan before the first step",
  5: "room to change course",
  6: "people looked after",
  7: "quiet before answering",
  8: "a result you can measure",
  9: "things closed",
  11: "to notice first",
  22: "a large plan on a calendar",
  33: "to help without emptying yourself",
};

function familyDigits(id: ThemeFamilyId): number[] {
  return THEME_FAMILIES.find((f) => f.id === id)?.digits ?? [];
}

/** Count seats per family digit, preferring the raw master when it belongs. */
export function digitSeatMap(
  theme: ThemeHit,
  seats: ChartSeat[],
): Map<number, string[]> {
  const allowed = familyDigits(theme.id);
  const map = new Map<number, string[]>();
  for (const seat of seats) {
    const key = allowed.includes(seat.raw)
      ? seat.raw
      : allowed.includes(seat.core)
        ? seat.core
        : null;
    if (key == null) continue;
    const list = map.get(key) ?? [];
    if (!list.includes(seat.label)) list.push(seat.label);
    map.set(key, list);
  }
  return map;
}

export function loudestDigit(
  theme: ThemeHit,
  seats: ChartSeat[],
): { digit: number; labels: string[] } {
  const map = digitSeatMap(theme, seats);
  let digit = theme.id === "expression" ? 3 : (familyDigits(theme.id)[0] ?? 9);
  let labels: string[] = [];
  for (const [n, list] of map) {
    if (list.length > labels.length || (list.length === labels.length && n > digit)) {
      digit = n;
      labels = list;
    }
  }
  if (!labels.length) labels = theme.appearsIn.slice();
  return { digit, labels };
}

function titleFor(theme: ThemeHit, seats: ChartSeat[]): string {
  const map = digitSeatMap(theme, seats);
  if (theme.id === "expression") {
    const three = map.get(3)?.length ?? 0;
    const nine = map.get(9)?.length ?? 0;
    if (three > 0 && nine > 0 && three === nine) return "You talk it through and you finish it";
    if (nine > three) return TITLE_BY_DIGIT[9];
    if (three > 0) return TITLE_BY_DIGIT[3];
  }
  const { digit } = loudestDigit(theme, seats);
  return TITLE_BY_DIGIT[digit] ?? "Your working note";
}

function counterweights(opts: {
  dominantId: ThemeFamilyId;
  loudest: number;
  lifePath: number;
  birthDay: number;
  expression: number;
  soulUrge: number;
  personality: number;
}): { n: number; label: string }[] {
  const allowed = new Set(familyDigits(opts.dominantId));
  const candidates: { n: number; label: string }[] = [
    { n: opts.expression, label: "Expression" },
    { n: opts.soulUrge, label: "Soul Urge" },
    { n: opts.personality, label: "Personality" },
    { n: opts.lifePath, label: "Life Path" },
    { n: opts.birthDay, label: "Birth Day" },
  ];
  const out: { n: number; label: string }[] = [];
  const seen = new Set<number>();
  for (const c of candidates) {
    if (c.n === opts.loudest) continue;
    if (allowed.has(c.n) && c.n === opts.loudest) continue;
    if (seen.has(c.n)) continue;
    // A second digit in the same family still counts as a pull (3 vs 9).
    if (c.n === opts.loudest) continue;
    seen.add(c.n);
    out.push(c);
    if (out.length === 2) break;
  }
  return out.filter((c) => c.n !== opts.loudest);
}

function frictionAction(loudest: number, pulls: { n: number }[]): string {
  const pullNs = pulls.map((p) => p.n);
  if (loudest === 3 && pullNs.includes(9)) {
    return 'Cap active projects at three and define what "done" means before starting a fourth.';
  }
  if (loudest === 3 && pullNs.includes(6)) {
    return "Finish one thing you started saying before taking on another person's task.";
  }
  if (loudest === 9 && pullNs.includes(3)) {
    return 'Close one loop before opening another, and write what "done" looks like first.';
  }
  if (loudest === 1 && (pullNs.includes(2) || pullNs.includes(6))) {
    return "Start one small thing, then ask one person to look at it the same day.";
  }
  if ((loudest === 7 || loudest === 11) && (pullNs.includes(1) || pullNs.includes(8))) {
    return "Take ten quiet minutes, then make the decision the same day.";
  }
  if (loudest === 5 && (pullNs.includes(4) || pullNs.includes(22))) {
    return "Try one small change inside a repeating plan, not a brand-new plan.";
  }
  if (loudest === 6 && pullNs.includes(3)) {
    return "Keep one promise fully before starting a new conversation about care.";
  }
  const job = plainJob(loudest);
  return `${job.charAt(0).toUpperCase()}${job.slice(1)}.`;
}

function throughlineFor(opts: {
  dominant: ThemeHit;
  seats: ChartSeat[];
  lifePath: number;
  birthDay: number;
  expression: number;
  soulUrge: number;
  personality: number;
}): string {
  const { digit, labels } = loudestDigit(opts.dominant, opts.seats);
  const seatList = labels.slice(0, 4).join(", ");
  const pattern = `${plainTrait(digit)} shows up in ${labels.length} place${labels.length === 1 ? "" : "s"}${
    seatList ? ` (${seatList})` : ""
  }. That is the loudest pattern here.`;

  const pulls = counterweights({
    dominantId: opts.dominant.id,
    loudest: digit,
    lifePath: opts.lifePath,
    birthDay: opts.birthDay,
    expression: opts.expression,
    soulUrge: opts.soulUrge,
    personality: opts.personality,
  });

  let pullLine = `The friction to expect is ${plainWatch(digit)}.`;
  if (pulls.length === 1) {
    const p = pulls[0]!;
    pullLine = `${p.label} ${p.n} pulls against it: ${p.n} wants ${WANTS[p.n] ?? plainTrait(p.n)}. The friction to expect is ${plainWatch(digit)}.`;
  } else if (pulls.length >= 2) {
    const a = pulls[0]!;
    const b = pulls[1]!;
    pullLine = `${a.label} ${a.n} and ${b.label} ${b.n} pull against it: ${a.n} wants ${WANTS[a.n] ?? plainTrait(a.n)}, ${b.n} wants ${WANTS[b.n] ?? plainTrait(b.n)}. The friction to expect is ${plainWatch(digit)}.`;
  }

  return `${pattern} ${pullLine} ${frictionAction(digit, pulls)}`;
}

/** Chart-specific archetype: title from the loudest seat, throughline from the actual pulls. */
export function archetypeFor(opts: {
  themes: ThemeHit[];
  seats: ChartSeat[];
  lifePath: number;
  birthDay: number;
  expression: number;
  soulUrge: number;
  personality: number;
}): { title: string; throughline: string } {
  const dominant = opts.themes[0] ?? {
    id: "wisdom" as const,
    label: "Wisdom",
    appearsIn: [],
    count: 0,
    keywords: [],
    tier: "secondary" as const,
  };
  return {
    title: titleFor(dominant, opts.seats),
    throughline: throughlineFor({ ...opts, dominant }),
  };
}
