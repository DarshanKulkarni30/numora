/**
 * Smoke: profile person JSON backup merge (name + DOB key).
 */
import {
  buildPersonExport,
  mergePersonImport,
  parsePersonBackup,
  personIdentityKey,
  PERSON_BACKUP_KIND,
} from "../src/lib/profile/personBackup";
import type { PersonRecord } from "../src/lib/profile/options";

function eq(actual: unknown, expected: unknown, label: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(`FAIL ${label}`, { actual, expected });
    process.exit(1);
  }
  console.log("ok", label);
}

function assert(cond: unknown, label: string) {
  if (!cond) {
    console.error("FAIL", label);
    process.exit(1);
  }
  console.log("ok", label);
}

const self: PersonRecord = {
  id: "self-1",
  is_self: true,
  relationship: "Self",
  full_name: "Darshan Kulkarni",
  preferred_name: "Darshan",
  date_of_birth: "10/10/1980",
  gender: "Male",
  purpose: "Self-reflection",
  sort_order: 0,
  name_history: [],
};

const child: PersonRecord = {
  id: "child-1",
  is_self: false,
  relationship: "Child",
  full_name: "Asha Kulkarni",
  preferred_name: "Asha",
  date_of_birth: "10/10/2016",
  gender: "Female",
  purpose: "Family guidance",
  sort_order: 1,
  name_history: [],
};

eq(
  personIdentityKey("Darshan Kulkarni", "1980-10-10"),
  "Darshan Kulkarni|10/10/1980",
  "ISO DOB normalizes into the key",
);
assert(
  personIdentityKey("Darshan Kulkarni", "10/10/1980") !==
    personIdentityKey("darshan kulkarni", "10/10/1980"),
  "name match is exact, including case",
);

const file = buildPersonExport([self, child]);
eq(file.kind, PERSON_BACKUP_KIND, "export kind");
eq(file.people.length, 2, "export two people");

const parsed = parsePersonBackup(file);
const replacedSelf = {
  ...parsed[0]!,
  preferred_name: "DK",
  purpose: "Career",
};
const newSpouse = {
  full_name: "Riya Sharma",
  preferred_name: "Riya",
  date_of_birth: "01/02/1985",
  gender: "Female",
  purpose: "Relationships",
  relationship: "Spouse/Partner",
  is_self: false,
  name_history: [],
};

const merged = mergePersonImport([self, child], [replacedSelf, newSpouse], 6);
eq(merged.replaced, 1, "matching Self replaced");
eq(merged.added, 1, "new spouse added");
eq(merged.people.length, 3, "restored list has three");
eq(merged.people[0]?.id, "self-1", "existing Self id kept");
eq(merged.people[0]?.preferred_name, "DK", "Self preferred name replaced");
eq(merged.people[0]?.is_self, true, "Self flag kept");
eq(merged.people[2]?.full_name, "Riya Sharma", "spouse appended");

const capped = mergePersonImport([self], [newSpouse], 1);
eq(capped.added, 0, "plan cap skips extra people");
eq(capped.skipped, 1, "over-cap counted as skipped");

const keepChild = mergePersonImport([self, child], [replacedSelf], 6);
eq(keepChild.people.length, 2, "people not in the file stay");
eq(keepChild.people[1]?.full_name, "Asha Kulkarni", "unmatched child kept");

console.log("smoke:person-backup passed");
