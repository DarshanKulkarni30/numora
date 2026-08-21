import { CORE_TRAIT, coreTraitFor } from "@/lib/numerology/meanings";
import type { LoShuResult, NumerologySnapshot } from "@/lib/numerology/types";
import { coreDigit, parseChartNumber } from "./digits";

export type ThemeFamilyId =
  | "wisdom"
  | "leadership"
  | "service"
  | "structure"
  | "freedom"
  | "expression";

export type ChartSeat = {
  label: string;
  raw: number;
  core: number;
};

export type ThemeHit = {
  id: ThemeFamilyId;
  label: string;
  appearsIn: string[];
  count: number;
  keywords: string[];
};

export const THEME_FAMILIES: {
  id: ThemeFamilyId;
  label: string;
  digits: number[];
  keywords: string[];
}[] = [
  {
    id: "wisdom",
    label: "Wisdom",
    digits: [7, 11],
    keywords: ["insight", "study", "reflection"],
  },
  {
    id: "leadership",
    label: "Leadership",
    digits: [1, 8],
    keywords: ["initiative", "stewardship", "direction"],
  },
  {
    id: "service",
    label: "Service",
    digits: [2, 6, 33],
    keywords: ["care", "harmony", "responsibility"],
  },
  {
    id: "structure",
    label: "Structure",
    digits: [4, 22],
    keywords: ["systems", "craft", "follow-through"],
  },
  {
    id: "freedom",
    label: "Freedom",
    digits: [5],
    keywords: ["curiosity", "adaptability", "movement"],
  },
  {
    id: "expression",
    label: "Expression",
    digits: [3, 9],
    keywords: ["voice", "creativity", "completion"],
  },
];

function seat(label: string, raw: string | number | undefined): ChartSeat | null {
  const n = parseChartNumber(raw);
  if (n == null) return null;
  return { label, raw: n, core: coreDigit(n) };
}

export function collectSeats(
  snap: NumerologySnapshot,
  loShu?: LoShuResult | null,
): ChartSeat[] {
  const seats: ChartSeat[] = [];
  const push = (s: ChartSeat | null) => {
    if (s) seats.push(s);
  };

  push(seat("Life Path", snap.life_path));
  push(seat("Birth Day", snap.birth_day));
  push(seat("Expression", snap.expression_number));
  push(seat("Soul Urge", snap.soul_urge_number));
  push(seat("Personality", snap.personality_number));
  push(seat("Maturity", snap.maturity_number));
  push(seat("Psychic", snap.vedic_psychic));
  push(seat("Destiny", snap.vedic_destiny));
  push(seat("Vedic Name", snap.vedic_name));
  push(seat("Chaldean Name", snap.chaldean_name_number));
  push(seat("Personal Year", snap.personal_year));

  if (
    snap.natal_expression_number &&
    snap.natal_expression_number !== snap.expression_number
  ) {
    push(seat("Natal Expression", snap.natal_expression_number));
  }

  for (const r of loShu?.repeated_numbers ?? []) {
    if (r.count >= 2) {
      push(seat(`Lo Shu emphasis ${r.number}`, r.number));
    }
  }

  return seats;
}

export function buildThemeGraph(
  snap: NumerologySnapshot,
  loShu?: LoShuResult | null,
): { seats: ChartSeat[]; themes: ThemeHit[]; dominant: ThemeHit | null } {
  const seats = collectSeats(snap, loShu);
  const themes: ThemeHit[] = THEME_FAMILIES.map((f) => {
    const hits = seats.filter(
      (s) => f.digits.includes(s.raw) || f.digits.includes(s.core),
    );
    const appearsIn = [...new Set(hits.map((h) => h.label))];
    return {
      id: f.id,
      label: f.label,
      appearsIn,
      count: appearsIn.length,
      keywords: f.keywords,
    };
  })
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  return { seats, themes, dominant: themes[0] ?? null };
}

export function traitLabel(n: number): string {
  return CORE_TRAIT[n] ?? coreTraitFor(n);
}
