/**
 * Vedic Square: personal seat meaning first.
 * Geometry bars describe the digit in the 9×9 table — not a grade of the person.
 */

import { digitalRoot, frequencyBand } from "@/lib/numerology/vedicSquare";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import { planetPairForDigit } from "@/lib/numerology/planets";
import { assertSafeCopy } from "@/lib/numerology/safety";
import type { FootprintMetrics } from "@/lib/numerology/vedicSquareArchitecture";

export type SquareSource = "psychic" | "destiny" | "name" | "unit" | "manual";

export type SquareDiagnostic = {
  id: string;
  label: string;
  percent: number;
  measures: string;
  inGrid: string;
  doWith: string;
};

export type MissingDigitNote = {
  digit: number;
  pattern: string;
  watch: string;
  practice: string;
};

export type VedicSquareReading = {
  digit: number;
  planetLine: string;
  keywords: string;
  seatTitle: string;
  seatMeaning: string;
  expressed: string;
  advantage: string;
  watch: string;
  use: string;
  together: string | null;
  observed: string;
  meaning: string;
  watchLine: string;
  action: string;
  confirmLine: string;
  missing: MissingDigitNote[];
  diagnostics: SquareDiagnostic[];
};

const KEYWORDS: Record<number, string> = {
  1: "Start • Decide • Visibility",
  2: "Pair • Wait • Sensitivity",
  3: "Expansion • Expression • Learning • Influence",
  4: "Build • Order • Unconventional routes",
  5: "Change • Curiosity • Movement",
  6: "Care • Home • Promises",
  7: "Depth • Analysis • Selectivity",
  8: "Results • Duty • Stewardship",
  9: "Completion • Wider help • Persistence",
};

const ADVANTAGE: Record<number, string> = {
  1: "You can start when others wait, and put your name on a first move.",
  2: "You can tune to another person and pace a room without forcing it.",
  3: "You can turn scattered information into a story, explanation, or direction others can use.",
  4: "You can give an idea a repeating method so it survives the week.",
  5: "You can change lane when the old one is stuck, and learn in motion.",
  6: "You can keep a promise and make a place or person feel held.",
  7: "You can go deep, spot what is thin, and refuse a shallow answer.",
  8: "You can aim at a result someone could count.",
  9: "You can close a chapter and point the leftover energy at a wider need.",
};

const WATCH: Record<number, string> = {
  1: "Starting so many things that none get a second day.",
  2: "Waiting so long that nothing is said.",
  3: "Too many ideas competing. The work is usually selection and completion, not generating possibilities.",
  4: "Planning so long that the week never starts.",
  5: "Changing course every day so nothing has a second week.",
  6: "Saying yes until you have no rest.",
  7: "Refining after the idea is already good enough to test. Quiet can look like absence.",
  8: "Pushing for results with no pause.",
  9: "Holding an ending that is already done.",
};

const USE: Record<number, string> = {
  1: "Start one thing. Let someone else add the next part.",
  2: "Have one uninterrupted conversation. Name one preference.",
  3: "Keep one primary outcome visible. Capture new ideas, but finish the current one before opening another.",
  4: "Write one repeating loop and keep it this week.",
  5: "Change one small thing. Do not rebuild the whole setup.",
  6: "Own one recurring responsibility completely — no reminder needed.",
  7: "Set a research deadline, then show a short trace of what you know.",
  8: "Finish one numbered result, then rest.",
  9: "Close one loop that is already done before collecting a new cause.",
};

const MISSING: Record<number, MissingDigitNote> = {
  1: {
    digit: 1,
    pattern: "Starting may not be the first move. You may wait for a clearer signal or for someone else to begin.",
    watch: "Good ideas staying private because no one ‘officially’ started.",
    practice: "Put your name on one small start this week.",
  },
  2: {
    digit: 2,
    pattern: "Pairing and patience may not be automatic when a faster trait is loud.",
    watch: "Skipping the one conversation that would have slowed a mistake.",
    practice: "Do one task with one other person, without rushing the close.",
  },
  3: {
    digit: 3,
    pattern: "Explaining out loud may feel extra when you already understand privately.",
    watch: "People not seeing the work because it never left the notebook.",
    practice: "Tell one person one idea in ten minutes.",
  },
  4: {
    digit: 4,
    pattern: "Routine may lose to whatever is more interesting today.",
    watch: "Repeating work slipping until it becomes urgent.",
    practice: "Keep one 20-minute loop on the same weekday.",
  },
  5: {
    digit: 5,
    pattern: "Change may feel optional until the current path is clearly stuck.",
    watch: "Staying in a lane that is finished because switching looks messy.",
    practice: "Change one small thing this week — not the whole setup.",
  },
  6: {
    digit: 6,
    pattern: "You may not naturally prioritise routine obligations when more interesting work competes for attention.",
    watch: "Home or family tasks handled only when they become urgent.",
    practice: "Own one recurring responsibility completely, without reminders.",
  },
  7: {
    digit: 7,
    pattern: "Depth may be skipped when the room rewards speed and talk.",
    watch: "Publishing or deciding before you have one true sentence.",
    practice: "Take ten quiet minutes, then answer the person who is waiting.",
  },
  8: {
    digit: 8,
    pattern: "A numbered result may feel crude next to ideas or care.",
    watch: "Work that never gets a date, a price, or a finish line.",
    practice: "Put a number and a date on one piece of work this month.",
  },
  9: {
    digit: 9,
    pattern: "Endings may stall. A new start can feel easier than closing.",
    watch: "Open loops stacking while a finished chapter is still on the desk.",
    practice: "Close one loop that is already done before starting another.",
  },
};

function planetLine(n: number): string {
  const pair = planetPairForDigit(n);
  return pair.same
    ? pair.vedic.name
    : `${pair.vedic.name} / ${pair.western.name}`;
}

function seatCopy(source: SquareSource, digit: number): { title: string; meaning: string } {
  if (source === "psychic") {
    return {
      title: `Psychic ${digit}`,
      meaning: assertSafeCopy(
        `How you naturally initiate: through ${plainTrait(digit)}.`,
        "square.seat.psychic",
      ),
    };
  }
  if (source === "destiny") {
    return {
      title: `Destiny ${digit}`,
      meaning: assertSafeCopy(
        `Where your life direction pulls you: toward ${plainTrait(digit)}.`,
        "square.seat.destiny",
      ),
    };
  }
  if (source === "name") {
    return {
      title: `Name ${digit}`,
      meaning: assertSafeCopy(
        `How your name modifies the pattern: ${plainTrait(digit)} is what people often meet first.`,
        "square.seat.name",
      ),
    };
  }
  if (source === "unit") {
    return {
      title: `Unit name ${digit}`,
      meaning: assertSafeCopy(
        `A second letter map of the same name, for comparison — not a replacement of the Chaldean name number.`,
        "square.seat.unit",
      ),
    };
  }
  return {
    title: `Digit ${digit} on the table`,
    meaning: assertSafeCopy(
      `You are browsing how ${digit} is woven into the 9×9 square. Tie it to Psychic, Destiny, or Name to make it personal.`,
      "square.seat.manual",
    ),
  };
}

export function buildVedicSquareReading(opts: {
  source: SquareSource;
  digit: number;
  psychic: number;
  destiny: number;
  name: number;
  unit?: number | null;
  metrics: FootprintMetrics;
}): VedicSquareReading {
  const digit = digitalRoot(opts.digit);
  const psychic = digitalRoot(opts.psychic);
  const destiny = digitalRoot(opts.destiny);
  const name = digitalRoot(opts.name);
  const unit =
    opts.unit != null && opts.unit > 0 ? digitalRoot(opts.unit) : null;
  const seats = [psychic, destiny, name, ...(unit != null ? [unit] : [])];
  const hits = seats.filter((n) => n === digit).length;
  const seat = seatCopy(opts.source, digit);
  const band = frequencyBand(opts.metrics.frequency);

  const expressed = assertSafeCopy(
    hits >= 2
      ? `${digit} is strongly expressed in your seats (it appears in more than one of Psychic, Destiny, and Name). You tend to ${plainTrait(digit)}.`
      : hits === 1
        ? `${digit} is present in this seat. It is a real tone, not the whole chart.`
        : `You are looking at ${digit} on the square. It is not one of your current core seats.`,
    "square.expressed",
  );

  let together: string | null = null;
  if (psychic !== name) {
    together = assertSafeCopy(
      `Your Psychic ${psychic} leans toward ${plainTrait(psychic)}. Your Name ${name} leans toward ${plainTrait(name)}. A recurring pattern: having something to say (or do) and wanting to be sure you understand it — or look a certain way — before it leaves the room.`,
      "square.together",
    );
  } else if (psychic === destiny && psychic === digit) {
    together = assertSafeCopy(
      `Psychic and Destiny both sit on ${digit}. The driver and the longer path agree. The work is using that tone with discipline, not finding a new one.`,
      "square.together.same",
    );
  }

  const present = [...new Set(seats)];
  const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .filter((n) => !present.includes(n))
    .slice(0, 3)
    .map((n) => {
      const row = MISSING[n]!;
      return {
        digit: n,
        pattern: assertSafeCopy(row.pattern, `square.miss.${n}.p`),
        watch: assertSafeCopy(row.watch, `square.miss.${n}.w`),
        practice: assertSafeCopy(row.practice, `square.miss.${n}.a`),
      };
    });

  const confirmLine = assertSafeCopy(
    hits >= 2
      ? `The grid highlight matches your journey: ${digit} is prominent in more than one core seat, which reinforces ${plainTrait(digit)}.`
      : opts.source === "name" && name !== psychic
        ? `The square is showing the name layer (${name}), which can complicate or refine the Psychic ${psychic} journey — not cancel it.`
        : `This square shows how ${digit} is woven into the 9×9 table. Your journey still lives in the seats above (Psychic ${psychic}, Destiny ${destiny}, Name ${name}).`,
    "square.confirm",
  );

  const m = opts.metrics;
  const diagnostics: SquareDiagnostic[] = [
    {
      id: "frequency",
      label: "Frequency",
      percent: Math.round(m.frequencyScore * 100),
      measures: "How often this digit appears in the fixed 9×9 multiplication table.",
      inGrid: `${band.label}: ${digit} appears ${m.frequency} times. That is a property of the table, the same for anyone highlighting ${digit} — not a grade of your life.`,
      doWith: hits >= 2
        ? "Read a high table-count as ‘this tone is easy to overuse’ only when it also repeats in your seats."
        : "Use this as a map of the digit, not as a score for you.",
    },
    {
      id: "distribution",
      label: "Distribution",
      percent: Math.round(m.distributionScore * 100),
      measures: "How spread the digit’s cells are across the square (clustered vs spread).",
      inGrid: `This ${digit} footprint reads ${m.distribution}. Again, that shape belongs to the digit in the table.`,
      doWith: "If your seats repeat this digit, a spread footprint is a reminder that the tone can show up in many rooms — pick one.",
    },
    {
      id: "symmetry",
      label: "Symmetry",
      percent: Math.round(m.symmetryScore * 100),
      measures: "How evenly the footprint balances on the square.",
      inGrid: `Symmetry for ${digit} reads ${m.symmetry}. Not a verdict on whether you are a balanced person.`,
      doWith: "If the bar is low, the digit’s cells sit lopsided on the table. Pair the practice below with one opposite-digit habit.",
    },
    {
      id: "opposition",
      label: "Opposition",
      percent: Math.round(m.oppositeTension * 100),
      measures: "How strongly this digit sits across from its pair in the square’s mirror play.",
      inGrid: `Opposite tension for ${digit} is a table relationship (for example 3 with 6), not a conflict score for your year.`,
      doWith: "When this seat is loud, practise the opposite pair’s small habit so the tone does not run alone.",
    },
  ];

  return {
    digit,
    planetLine: planetLine(digit),
    keywords: KEYWORDS[digit] ?? "",
    seatTitle: seat.title,
    seatMeaning: seat.meaning,
    expressed,
    advantage: assertSafeCopy(ADVANTAGE[digit] ?? "", "square.adv"),
    watch: assertSafeCopy(WATCH[digit] ?? "", "square.watch"),
    use: assertSafeCopy(USE[digit] ?? "", "square.use"),
    together,
    observed: assertSafeCopy(
      hits >= 2
        ? `${digit} appears repeatedly in your core seats.`
        : `${digit} is the digit you are highlighting (${seat.title}).`,
      "square.obs",
    ),
    meaning: assertSafeCopy(
      `This tone is ${plainTrait(digit)}.`,
      "square.mean",
    ),
    watchLine: assertSafeCopy(WATCH[digit] ?? "", "square.watch2"),
    action: assertSafeCopy(USE[digit] ?? "", "square.act"),
    confirmLine,
    missing,
    diagnostics,
  };
}
