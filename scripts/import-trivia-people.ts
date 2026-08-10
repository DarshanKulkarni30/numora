import fs from "fs";
import path from "path";
import {
  lifePathFromDob,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "../src/lib/numerology/dateNumbers";
import {
  TRIVIA_PEOPLE,
  type TriviaPerson,
} from "../src/lib/trivia/people";

const csvPath =
  process.argv[2] ||
  "C:/Users/darsh/Projects/nanobots/docs/well-known-persons-by-day.csv";

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function ymdToDmy(ymd: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return null;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

const raw = fs.readFileSync(csvPath, "utf8");
const lines = raw.split(/\r?\n/).filter((l) => l.trim());
const header = parseCsvLine(lines[0]);
const idx = {
  name: header.indexOf("Name"),
  dob: header.indexOf("DOB"),
  known: header.indexOf("Known For"),
  country: header.indexOf("Country"),
};
if (idx.name < 0 || idx.dob < 0 || idx.known < 0) {
  throw new Error(`Unexpected CSV header: ${header.join(",")}`);
}

const fromCsv: TriviaPerson[] = [];
const errors: string[] = [];

for (let i = 1; i < lines.length; i++) {
  const cols = parseCsvLine(lines[i]);
  const name = cols[idx.name];
  const dobIso = cols[idx.dob];
  const known = cols[idx.known] || cols[idx.country] || "Notable figure";
  const dob = ymdToDmy(dobIso);
  if (!name || !dob) {
    errors.push(`row ${i + 1}: bad fields`);
    continue;
  }
  try {
    fromCsv.push({
      name,
      dob,
      note: known.replace(/\s+/g, " ").slice(0, 120),
      lifePath: lifePathFromDob(dob),
      destiny: vedicDestinyFromDob(dob),
      psychic: vedicPsychicFromDob(dob),
    });
  } catch (e) {
    errors.push(`row ${i + 1} ${name}: ${(e as Error).message}`);
  }
}

const byKey = new Map<string, TriviaPerson>();
for (const p of [...TRIVIA_PEOPLE, ...fromCsv]) {
  const key = `${p.name.toLowerCase().replace(/\s+/g, " ")}|${p.dob}`;
  if (!byKey.has(key)) byKey.set(key, p);
}

const merged = [...byKey.values()].sort((a, b) => {
  const [ad, am] = a.dob.split("/").map(Number);
  const [bd, bm] = b.dob.split("/").map(Number);
  return am - bm || ad - bd || a.name.localeCompare(b.name);
});

const cov = new Map<string, number>();
for (const p of merged) {
  const k = p.dob.slice(0, 5);
  cov.set(k, (cov.get(k) || 0) + 1);
}

let daysOk = 0;
let daysUnder2 = 0;
const gaps: string[] = [];
for (let m = 1; m <= 12; m++) {
  const dim = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
  for (let d = 1; d <= dim; d++) {
    const k = `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}`;
    const c = cov.get(k) || 0;
    if (c >= 2) daysOk++;
    else {
      daysUnder2++;
      gaps.push(`${k}:${c}`);
    }
  }
}

const outPath = path.resolve("src/lib/trivia/people.ts");
const body = merged.map((p) => `  ${JSON.stringify(p)}`).join(",\n");
const file = `/** Curated famous personalities for reflective trivia (DOB-based match). */
export type TriviaPerson = {
  name: string;
  dob: string;
  note: string;
  lifePath: number;
  destiny: number;
  psychic: number;
};

export const TRIVIA_PEOPLE: TriviaPerson[] = [
${body}
];
`;
fs.writeFileSync(outPath, file, "utf8");

console.log(
  JSON.stringify(
    {
      csvRows: lines.length - 1,
      imported: fromCsv.length,
      errors: errors.length,
      merged: merged.length,
      daysOk,
      daysUnder2,
      gaps: gaps.slice(0, 20),
      sampleErrors: errors.slice(0, 15),
      outPath,
    },
    null,
    2,
  ),
);
