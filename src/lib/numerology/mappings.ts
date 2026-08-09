/** Pythagorean letter values */
export const PYTHAGOREAN: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

/** Chaldean letter values (no 9 for letters) */
export const CHALDEAN: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

/**
 * Vedic / Indian name chart commonly used with Latin spellings
 * (aligned with Chaldean-style 1–8 mapping used in many Indian numerology practices).
 */
export const VEDIC_NAME = CHALDEAN;

export const RULING_PLANETS: Record<number, string> = {
  1: "Sun",
  2: "Moon",
  3: "Jupiter",
  4: "Rahu",
  5: "Mercury",
  6: "Venus",
  7: "Ketu",
  8: "Saturn",
  9: "Mars",
  11: "Moon (Master)",
  22: "Uranus / Master Builder influence (reflective)",
  33: "Venus / Master Teacher influence (reflective)",
};

export function sumMappedLetters(
  name: string,
  map: Record<string, number>,
  predicate?: (ch: string) => boolean,
): number {
  return name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .filter((ch) => (predicate ? predicate(ch) : true))
    .reduce((sum, ch) => sum + (map[ch] ?? 0), 0);
}
