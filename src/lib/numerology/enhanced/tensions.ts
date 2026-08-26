import type { LoShuResult, NumerologySnapshot } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";
import { plainJob, plainTrait } from "@/lib/numerology/layeredCopy";

export type Tension = {
  id: string;
  title: string;
  values: string[];
  insight: string;
};

export function buildTensions(
  snap: NumerologySnapshot,
  loShu?: LoShuResult | null,
): Tension[] {
  const out: Tension[] = [];
  const lp = parseChartNumber(snap.life_path);
  const soul = parseChartNumber(snap.soul_urge_number);
  const pers = parseChartNumber(snap.personality_number);
  const expr = parseChartNumber(snap.expression_number);
  const chal = parseChartNumber(snap.chaldean_name_number);
  const psychic = parseChartNumber(snap.vedic_psychic);
  const destiny = parseChartNumber(snap.vedic_destiny);

  if (soul != null && pers != null && soul !== pers) {
    out.push({
      id: "inner-outer",
      title: "Inner wish and outer manner",
      values: [`Soul Urge ${soul}`, `Personality ${pers}`],
      insight: `Inside you may want ${plainTrait(soul)} (Soul Urge ${soul}). People may first notice ${plainTrait(pers)} (Personality ${pers}). When those pull apart, pick one move: ${plainJob(soul)} or ${plainJob(pers)}. Watch: using the outer manner to hide the inner wish.`,
    });
  }

  if (lp != null && destiny != null && lp !== destiny) {
    out.push({
      id: "path-destiny",
      title: "Life Path and Destiny tones",
      values: [`Life Path ${lp}`, `Destiny ${destiny}`],
      insight: `Life Path ${lp} is ${plainTrait(lp)}. Destiny ${destiny} is ${plainTrait(destiny)}. They are two maps of the same date, not a contest. Try: ${plainJob(lp)} this week, and ${plainJob(destiny)} as the longer habit.`,
    });
  }

  if (psychic != null && destiny != null && psychic !== destiny) {
    out.push({
      id: "psychic-destiny",
      title: "Day temperament and longer path",
      values: [`Psychic ${psychic}`, `Destiny ${destiny}`],
      insight: `The day’s first reaction is ${plainTrait(psychic)} (Psychic ${psychic}). The longer work is ${plainTrait(destiny)} (Destiny ${destiny}). If today’s reaction pulls against the longer work, take one small step: ${plainJob(destiny)}.`,
    });
  }

  if (expr != null && chal != null && expr !== chal) {
    out.push({
      id: "name-schools",
      title: "Two name-school readings",
      values: [`Pythagorean Expression ${expr}`, `Chaldean Name ${chal}`],
      insight: `Same name, two letter maps. Expression ${expr} is ${plainTrait(expr)}. Chaldean ${chal} is ${plainTrait(chal)}. You do not pick a winner. A useful day: ${plainJob(expr)}, then ${plainJob(chal)}.`,
    });
  }

  const missing = loShu?.missing_numbers ?? [];
  if (missing.length) {
    const jobs = missing.map((n) => `${n}: ${plainJob(n)}`).join("; ");
    out.push({
      id: "lo-shu-gaps",
      title: "Lo Shu quiet digits",
      values: missing.map((n) => `Quiet ${n}`),
      insight: `These digits are quiet on the date grid, not a hole in the person: ${missing.join(", ")}. Try one: ${jobs}. Watch: calling a quiet digit a flaw.`,
    });
  }

  if (
    snap.natal_expression_number &&
    snap.natal_expression_number !== snap.expression_number
  ) {
    out.push({
      id: "name-era",
      title: "Natal and operating spellings",
      values: [
        `Natal Expression ${snap.natal_expression_number}`,
        `Operating Expression ${snap.expression_number}`,
      ],
      insight:
        "Birth-certificate spelling stays as the first name layer. The later name in force may change Expression and other name numbers. Date numbers (Life Path, year, day) stay the same. Read both layers; do not throw the first name away.",
    });
  }

  return out.slice(0, 5);
}
