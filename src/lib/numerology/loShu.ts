import { loShuEffectNotes } from "./loShuEffects";
import type { LoShuResult } from "./types";
import { parseDob } from "./reduce";

const ARROWS: { name: string; numbers: number[] }[] = [
  { name: "Arrow of Planning (Mental)", numbers: [4, 9, 2] },
  { name: "Arrow of Will (Emotional)", numbers: [3, 5, 7] },
  { name: "Arrow of Action (Practical)", numbers: [8, 1, 6] },
  { name: "Arrow of Thought", numbers: [4, 3, 8] },
  { name: "Arrow of Determination", numbers: [9, 5, 1] },
  { name: "Arrow of Practicality", numbers: [2, 7, 6] },
  { name: "Arrow of Intellect", numbers: [4, 5, 6] },
  { name: "Arrow of Emotion", numbers: [2, 5, 8] },
];

export function calculateLoShu(dob: string): LoShuResult {
  const { day, month, year } = parseDob(dob);
  const digits = `${day}${month}${year}`
    .split("")
    .map(Number)
    .filter((d) => d !== 0);

  const grid: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  };
  for (const d of digits) {
    if (d >= 1 && d <= 9) grid[d] += 1;
  }

  const present_numbers = Object.entries(grid)
    .filter(([, count]) => count > 0)
    .map(([n]) => Number(n))
    .sort((a, b) => a - b);

  const missing_numbers = Object.entries(grid)
    .filter(([, count]) => count === 0)
    .map(([n]) => Number(n))
    .sort((a, b) => a - b);

  const repeated_numbers = Object.entries(grid)
    .filter(([, count]) => count > 1)
    .map(([n, count]) => ({ number: Number(n), count }))
    .sort((a, b) => a.number - b.number);

  const planeStrength = (nums: number[]) => {
    const total = nums.reduce((s, n) => s + grid[n], 0);
    if (total === 0) return "Quiet / developing";
    if (total === 1) return "Gentle presence";
    if (total === 2) return "Balanced presence";
    return "Strong presence";
  };

  const mental_plane = planeStrength([4, 9, 2]);
  const emotional_plane = planeStrength([3, 5, 7]);
  const practical_plane = planeStrength([8, 1, 6]);

  const present_arrows = ARROWS.filter((a) =>
    a.numbers.every((n) => grid[n] > 0),
  ).map((a) => a.name);

  const missing_arrows = ARROWS.filter((a) =>
    a.numbers.every((n) => grid[n] === 0),
  ).map((a) => a.name);

  const effects = loShuEffectNotes(repeated_numbers, missing_numbers);

  const analysis = [
    `According to Lo Shu traditions, present numbers (${present_numbers.join(", ") || "none highlighted"}) may indicate active traits in the birth-date pattern.`,
    missing_numbers.length
      ? `Missing numbers (${missing_numbers.join(", ")}) may suggest growth opportunities to cultivate through habits—not fixed limits. ${effects.missing.join(" ")}`
      : "No missing numbers appear in this grid pattern, which may suggest a broadly distributed set of traits.",
    repeated_numbers.length
      ? `Repeated numbers (${repeated_numbers.map((r) => `${r.number}×${r.count}`).join(", ")}) may emphasize those themes more strongly. ${effects.repeated.join(" ")}`
      : "No repeated numbers stand out beyond single occurrences.",
    `Mental plane: ${mental_plane}. Emotional plane: ${emotional_plane}. Practical plane: ${practical_plane}.`,
    present_arrows.length
      ? `Present arrows may include: ${present_arrows.join("; ")}.`
      : "No complete present arrows were detected in this reading.",
    missing_arrows.length
      ? `Missing arrows may include: ${missing_arrows.join("; ")}. These can be conscious improvement areas rather than permanent gaps.`
      : "No fully missing arrows were detected.",
  ].join(" ");

  return {
    present_numbers,
    missing_numbers,
    repeated_numbers,
    mental_plane,
    emotional_plane,
    practical_plane,
    present_arrows,
    missing_arrows,
    analysis,
    grid,
  };
}
