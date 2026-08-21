import type { LoShuResult, NumerologySnapshot } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";
import { traitLabel } from "./themeGraph";

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
      insight: `Soul Urge ${soul} (${traitLabel(soul)}) may describe what feels true inside, while Personality ${pers} (${traitLabel(pers)}) may color first impressions. The stretch is letting the inner pace be visible without forcing the outer style to disappear.`,
    });
  }

  if (lp != null && destiny != null && lp !== destiny) {
    out.push({
      id: "path-destiny",
      title: "Life Path and Destiny tones",
      values: [`Life Path ${lp}`, `Destiny ${destiny}`],
      insight: `Pythagorean Life Path ${lp} and Vedic Destiny ${destiny} are different school lenses on the longer journey. Read them as two maps of the same terrain—not a contest.`,
    });
  }

  if (psychic != null && destiny != null && psychic !== destiny) {
    out.push({
      id: "psychic-destiny",
      title: "Day temperament and longer path",
      values: [`Psychic ${psychic}`, `Destiny ${destiny}`],
      insight: `Psychic ${psychic} may describe default daily wiring, while Destiny ${destiny} may describe the longer curriculum. A useful practice is noticing when a day’s reaction pulls against a longer aim, then choosing one bridging habit.`,
    });
  }

  if (expr != null && chal != null && expr !== chal) {
    out.push({
      id: "name-schools",
      title: "Two name-school readings",
      values: [`Pythagorean Expression ${expr}`, `Chaldean Name ${chal}`],
      insight: `Expression ${expr} is the Pythagorean all-letter craft of the spelling in force. Chaldean ${chal} is a different letter map of the same name. Together they often read as how you build (${expr}) and how the name may feel to others (${chal}).`,
    });
  }

  const missing = loShu?.missing_numbers ?? [];
  if (missing.length) {
    const shown = missing.slice(0, 3).join(", ");
    out.push({
      id: "lo-shu-gaps",
      title: "Lo Shu development edges",
      values: missing.map((n) => `Missing ${n}`),
      insight: `The Lo Shu grid does not show ${shown} as strongly as other digits. Traditions treat this as a practice edge—habits to grow—not a lack in the person.`,
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
