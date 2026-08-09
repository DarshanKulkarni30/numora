/** Traditional reflective planet associations used in Numora reports. */

export type PlanetId =
  | "sun"
  | "moon"
  | "mars"
  | "mercury"
  | "jupiter"
  | "venus"
  | "saturn"
  | "rahu"
  | "ketu"
  | "uranus"
  | "neptune";

export type PlanetInfo = {
  id: PlanetId;
  name: string;
  /** Unicode astronomical / traditional symbol */
  symbol: string;
};

export const PLANETS: Record<PlanetId, PlanetInfo> = {
  sun: { id: "sun", name: "Sun", symbol: "☉" },
  moon: { id: "moon", name: "Moon", symbol: "☽" },
  mars: { id: "mars", name: "Mars", symbol: "♂" },
  mercury: { id: "mercury", name: "Mercury", symbol: "☿" },
  jupiter: { id: "jupiter", name: "Jupiter", symbol: "♃" },
  venus: { id: "venus", name: "Venus", symbol: "♀" },
  saturn: { id: "saturn", name: "Saturn", symbol: "♄" },
  rahu: { id: "rahu", name: "Rahu", symbol: "☊" },
  ketu: { id: "ketu", name: "Ketu", symbol: "☋" },
  uranus: { id: "uranus", name: "Uranus", symbol: "♅" },
  neptune: { id: "neptune", name: "Neptune", symbol: "♆" },
};

/** Western / Pythagorean-style number → planet (reflective tradition). */
export const PYTHAGOREAN_PLANET_BY_NUMBER: Record<number, PlanetId> = {
  1: "sun",
  2: "moon",
  3: "jupiter",
  4: "uranus",
  5: "mercury",
  6: "venus",
  7: "neptune",
  8: "saturn",
  9: "mars",
  11: "moon",
  22: "uranus",
  33: "venus",
};

/** Vedic / Indian-style number → planet (reflective tradition). */
export const VEDIC_PLANET_BY_NUMBER: Record<number, PlanetId> = {
  1: "sun",
  2: "moon",
  3: "jupiter",
  4: "rahu",
  5: "mercury",
  6: "venus",
  7: "ketu",
  8: "saturn",
  9: "mars",
  11: "moon",
  22: "uranus",
  33: "venus",
};

export function planetForPythagorean(n: number | string): PlanetInfo {
  const num = Number(n);
  const id = PYTHAGOREAN_PLANET_BY_NUMBER[num] ?? "sun";
  return PLANETS[id];
}

export function planetForVedic(n: number | string): PlanetInfo {
  const num = Number(n);
  const id = VEDIC_PLANET_BY_NUMBER[num] ?? "sun";
  return PLANETS[id];
}

export function planetLabel(info: PlanetInfo): string {
  return `${info.symbol} ${info.name}`;
}
