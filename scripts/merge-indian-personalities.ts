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

type Incoming = { field: string; name: string; dob: string; note: string };

function ymdToDmy(ymd: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return null;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function normName(name: string): string {
  return name.toLowerCase().replace(/[.\s]+/g, " ").trim();
}

const jsonPath = path.resolve("scripts/indian-personalities.json");
const incoming = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as Incoming[];

const existingNames = new Set(TRIVIA_PEOPLE.map((p) => normName(p.name)));
const byKey = new Map<string, TriviaPerson>();
for (const p of TRIVIA_PEOPLE) {
  byKey.set(`${normName(p.name)}|${p.dob}`, p);
}

const added: { field: string; name: string }[] = [];
const skipped: { field: string; name: string; reason: string }[] = [];
const errors: string[] = [];
const fieldCounts: Record<string, number> = {};

for (const row of incoming) {
  const dob = ymdToDmy(row.dob);
  if (!row.name || !dob) {
    errors.push(`${row.name}: bad DOB ${row.dob}`);
    continue;
  }
  if (existingNames.has(normName(row.name))) {
    skipped.push({ field: row.field, name: row.name, reason: "name already in list" });
    continue;
  }
  const key = `${normName(row.name)}|${dob}`;
  if (byKey.has(key)) {
    skipped.push({ field: row.field, name: row.name, reason: "duplicate key" });
    continue;
  }
  try {
    const person: TriviaPerson = {
      name: row.name,
      dob,
      note: row.note.replace(/\s+/g, " ").slice(0, 120),
      lifePath: lifePathFromDob(dob),
      destiny: vedicDestinyFromDob(dob),
      psychic: vedicPsychicFromDob(dob),
    };
    byKey.set(key, person);
    existingNames.add(normName(row.name));
    added.push({ field: row.field, name: row.name });
    fieldCounts[row.field] = (fieldCounts[row.field] || 0) + 1;
  } catch (e) {
    errors.push(`${row.name}: ${(e as Error).message}`);
  }
}

const incomingByField: Record<string, number> = {};
for (const row of incoming) {
  incomingByField[row.field] = (incomingByField[row.field] || 0) + 1;
}

const merged = [...byKey.values()].sort((a, b) => {
  const [ad, am] = a.dob.split("/").map(Number);
  const [bd, bm] = b.dob.split("/").map(Number);
  return am - bm || ad - bd || a.name.localeCompare(b.name);
});

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
      incoming: incoming.length,
      incomingByField,
      added: added.length,
      addedByField: fieldCounts,
      skipped: skipped.length,
      skippedNames: skipped,
      errors,
      previous: TRIVIA_PEOPLE.length,
      merged: merged.length,
      outPath,
    },
    null,
    2,
  ),
);
