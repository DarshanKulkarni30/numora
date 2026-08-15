/**
 * Build src/lib/trivia/cities.ts (~1000 world cities with Pythagorean name numbers).
 * Source: datasets/world-cities CSV (scripts/world-cities.csv).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const PYTH = {
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

function nameNumber(name) {
  const letters = name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "");
  const sum = letters.split("").reduce((s, c) => s + (PYTH[c] || 0), 0);
  let n = sum || 9;
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

function isCleanName(name) {
  if (!name || name.length < 3 || name.length > 40) return false;
  if (/[0-9]/.test(name)) return false;
  // Prefer Latin-script city names for letter-map name numbers
  if (!/^[A-Za-zÀ-ÿ'’.\-\s]+$/.test(name)) return false;
  return true;
}

const csvPath = path.join(__dirname, "world-cities.csv");
const raw = fs.readFileSync(csvPath, "utf8");
const lines = raw.split(/\r?\n/).slice(1);

/** @type {Map<string, {name: string, country: string}[]>} */
const byCountry = new Map();

for (const line of lines) {
  if (!line.trim()) continue;
  // CSV: name,country,subcountry,geonameid — names can contain commas rarely; keep simple
  const firstComma = line.indexOf(",");
  const secondComma = line.indexOf(",", firstComma + 1);
  if (firstComma < 0 || secondComma < 0) continue;
  const name = line.slice(0, firstComma).trim();
  const country = line.slice(firstComma + 1, secondComma).trim();
  if (!isCleanName(name) || !country) continue;
  const list = byCountry.get(country) ?? [];
  list.push({ name, country });
  byCountry.set(country, list);
}

// Sort cities within country by name length then alpha (prefer concise capitals-like names)
for (const [, list] of byCountry) {
  list.sort((a, b) => {
    if (a.name.length !== b.name.length) return a.name.length - b.name.length;
    return a.name.localeCompare(b.name);
  });
}

const countries = [...byCountry.keys()].sort((a, b) => a.localeCompare(b));
const seen = new Set();
const picked = [];

// Round-robin: take one city per country per pass until 1000
let pass = 0;
while (picked.length < 1000 && pass < 40) {
  let added = 0;
  for (const country of countries) {
    if (picked.length >= 1000) break;
    const list = byCountry.get(country) ?? [];
    const city = list[pass];
    if (!city) continue;
    const key = `${city.name.toLowerCase()}|${city.country.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push({
      name: city.name,
      country: city.country,
      nameNumber: nameNumber(city.name),
    });
    added += 1;
  }
  if (added === 0) break;
  pass += 1;
}

picked.sort((a, b) => {
  const c = a.country.localeCompare(b.country);
  return c !== 0 ? c : a.name.localeCompare(b.name);
});

const outPath = path.join(root, "src", "lib", "trivia", "cities.ts");
const header = `/** World cities with Pythagorean-style name numbers for reflective trivia. */
export type TriviaCity = {
  name: string;
  country: string;
  nameNumber: number;
};

export const TRIVIA_CITIES: TriviaCity[] = `;

fs.writeFileSync(
  outPath,
  header + JSON.stringify(picked.slice(0, 1000), null, 2) + ";\n",
  "utf8",
);

const dist = picked.slice(0, 1000).reduce((m, c) => {
  m[c.nameNumber] = (m[c.nameNumber] || 0) + 1;
  return m;
}, {});
console.log(
  `wrote ${Math.min(picked.length, 1000)} cities → ${outPath}`,
);
console.log("nameNumber distribution:", dist);
console.log("countries covered:", new Set(picked.map((c) => c.country)).size);
