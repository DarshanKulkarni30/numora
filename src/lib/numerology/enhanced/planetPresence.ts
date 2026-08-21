import {
  planetForPythagorean,
  planetForVedic,
  type PlanetInfo,
} from "@/lib/numerology/planets";
import type { NumerologySnapshot } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";

export type PlanetPresence = {
  name: string;
  symbol: string;
  seats: string[];
  count: number;
};

export function buildPlanetPresence(snap: NumerologySnapshot): PlanetPresence[] {
  const rows: { seat: string; planet: PlanetInfo }[] = [];
  const addPy = (seat: string, raw: string | undefined) => {
    const n = parseChartNumber(raw);
    if (n == null) return;
    rows.push({ seat, planet: planetForPythagorean(n) });
  };
  const addVe = (seat: string, raw: string | undefined) => {
    const n = parseChartNumber(raw);
    if (n == null) return;
    rows.push({ seat, planet: planetForVedic(n) });
  };

  addPy("Life Path", snap.life_path);
  addPy("Birth Day", snap.birth_day);
  addPy("Expression", snap.expression_number);
  addVe("Psychic", snap.vedic_psychic);
  addVe("Destiny", snap.vedic_destiny);
  addVe("Vedic Name", snap.vedic_name);

  const byName = new Map<string, PlanetPresence>();
  for (const row of rows) {
    const cur = byName.get(row.planet.name) ?? {
      name: row.planet.name,
      symbol: row.planet.symbol,
      seats: [],
      count: 0,
    };
    if (!cur.seats.includes(row.seat)) {
      cur.seats.push(row.seat);
      cur.count = cur.seats.length;
    }
    byName.set(row.planet.name, cur);
  }

  return [...byName.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
