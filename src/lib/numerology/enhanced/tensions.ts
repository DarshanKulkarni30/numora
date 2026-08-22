import type { LoShuResult, NumerologySnapshot } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";
import { plainTrait } from "@/lib/numerology/layeredCopy";

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
      insight: `Soul Urge ${soul} (${plainTrait(soul)}) is what can feel true inside. Personality ${pers} (${plainTrait(pers)}) is what people may notice first. You do not have to hide one to keep the other.`,
    });
  }

  if (lp != null && destiny != null && lp !== destiny) {
    out.push({
      id: "path-destiny",
      title: "Life Path and Destiny tones",
      values: [`Life Path ${lp}`, `Destiny ${destiny}`],
      insight: `Pythagorean Life Path ${lp} and Vedic Destiny ${destiny} are two school views of the longer path. Read both. They are not a contest.`,
    });
  }

  if (psychic != null && destiny != null && psychic !== destiny) {
    out.push({
      id: "psychic-destiny",
      title: "Day temperament and longer path",
      values: [`Psychic ${psychic}`, `Destiny ${destiny}`],
      insight: `Psychic ${psychic} is closer to the day’s first habit. Destiny ${destiny} is the longer walk. Notice when a day’s reaction pulls against a longer aim, then take one small bridging step.`,
    });
  }

  if (expr != null && chal != null && expr !== chal) {
    out.push({
      id: "name-schools",
      title: "Two name-school readings",
      values: [`Pythagorean Expression ${expr}`, `Chaldean Name ${chal}`],
      insight: `Expression ${expr} is the Pythagorean all-letter name number. Chaldean ${chal} is a different letter map of the same name. One is how you build. The other is how the name may feel. Hold both.`,
    });
  }

  const missing = loShu?.missing_numbers ?? [];
  if (missing.length) {
    const shown = missing.slice(0, 3).join(", ");
    out.push({
      id: "lo-shu-gaps",
      title: "Lo Shu development edges",
      values: missing.map((n) => `Missing ${n}`),
      insight: `The Lo Shu grid does not show ${shown} as strongly as other digits. Treat that as extra practice, not a hole in the person.`,
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
        "Birth-certificate spelling stays the natal layer. The later name in force may shift Expression and name numbers while date-based numbers stay the same. Both layers belong in a complete reading.",
    });
  }

  return out.slice(0, 5);
}
