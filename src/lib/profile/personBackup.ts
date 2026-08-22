/**
 * Profile person list backup (JSON). Match key is exact full name + DOB.
 */

import { isValidDob, normalizeDobToSlash } from "@/lib/profile/date";
import type { PersonRecord } from "@/lib/profile/options";
import {
  RELATIONSHIP_OPTIONS,
  GENDER_OPTIONS,
  PURPOSE_OPTIONS,
} from "@/lib/profile/options";
import { normalizeNameHistory, type NameEra } from "@/lib/profile/nameHistory";

export const PERSON_BACKUP_KIND = "numora.people.v1";

export type PersonBackupRow = {
  full_name: string;
  preferred_name: string;
  date_of_birth: string;
  gender: string;
  purpose: string;
  relationship: string;
  is_self: boolean;
  name_history?: NameEra[];
};

export type PersonBackupFile = {
  kind: typeof PERSON_BACKUP_KIND;
  exported_at: string;
  people: PersonBackupRow[];
};

export function personIdentityKey(name: string, dob: string): string | null {
  const full = String(name || "").trim();
  const normalized = normalizeDobToSlash(String(dob || "").trim());
  if (!full || !normalized) return null;
  return `${full}|${normalized}`;
}

export function toBackupRow(p: PersonRecord): PersonBackupRow {
  return {
    full_name: p.full_name.trim(),
    preferred_name: p.preferred_name.trim(),
    date_of_birth: normalizeDobToSlash(p.date_of_birth.trim()) ?? p.date_of_birth.trim(),
    gender: p.gender,
    purpose: p.purpose,
    relationship: p.is_self ? "Self" : p.relationship,
    is_self: Boolean(p.is_self),
    name_history: Array.isArray(p.name_history) ? p.name_history : [],
  };
}

export function buildPersonExport(people: PersonRecord[]): PersonBackupFile {
  return {
    kind: PERSON_BACKUP_KIND,
    exported_at: new Date().toISOString(),
    people: people.filter((p) => p.full_name.trim() && p.date_of_birth.trim()).map(toBackupRow),
  };
}

export function parsePersonBackup(raw: unknown): PersonBackupRow[] {
  if (!raw || typeof raw !== "object") {
    throw new Error("This file is not a Numora person list.");
  }
  const file = raw as Partial<PersonBackupFile> & { people?: unknown };
  const list = Array.isArray(file.people)
    ? file.people
    : Array.isArray(raw)
      ? raw
      : null;
  if (!list) {
    throw new Error("This file has no people list.");
  }
  if (file.kind && file.kind !== PERSON_BACKUP_KIND) {
    throw new Error("This JSON is not a Numora person backup.");
  }
  return list.map((row, i) => {
    if (!row || typeof row !== "object") {
      throw new Error(`Person ${i + 1} is not an object.`);
    }
    const p = row as Partial<PersonBackupRow>;
    return {
      full_name: String(p.full_name || "").trim(),
      preferred_name: String(p.preferred_name || "").trim(),
      date_of_birth:
        normalizeDobToSlash(String(p.date_of_birth || "").trim()) ??
        String(p.date_of_birth || "").trim(),
      gender: String(p.gender || "").trim(),
      purpose: String(p.purpose || "").trim(),
      relationship: String(p.relationship || "").trim(),
      is_self: Boolean(p.is_self),
      name_history: Array.isArray(p.name_history) ? p.name_history : [],
    };
  });
}

export type PersonImportResult = {
  people: PersonRecord[];
  replaced: number;
  added: number;
  skipped: number;
};

export function mergePersonImport(
  existing: PersonRecord[],
  incoming: PersonBackupRow[],
  maxPeople: number,
): PersonImportResult {
  const next = existing.map((p) => ({ ...p }));
  const indexByKey = new Map<string, number>();
  next.forEach((p, i) => {
    const key = personIdentityKey(p.full_name, p.date_of_birth);
    if (key) indexByKey.set(key, i);
  });

  let replaced = 0;
  let added = 0;
  let skipped = 0;
  let hasSelf = next.some((p) => p.is_self);

  for (const row of incoming) {
    if (!row.full_name || !isValidDob(row.date_of_birth)) {
      skipped += 1;
      continue;
    }
    if (row.gender && !GENDER_OPTIONS.includes(row.gender as (typeof GENDER_OPTIONS)[number])) {
      skipped += 1;
      continue;
    }
    if (row.purpose && !PURPOSE_OPTIONS.includes(row.purpose as (typeof PURPOSE_OPTIONS)[number])) {
      skipped += 1;
      continue;
    }

    const key = personIdentityKey(row.full_name, row.date_of_birth);
    if (!key) {
      skipped += 1;
      continue;
    }

    const historyNorm = normalizeNameHistory(row.name_history, row.date_of_birth);
    const name_history = historyNorm.error ? [] : historyNorm.eras;
    const hit = indexByKey.get(key);

    if (hit != null) {
      const prev = next[hit]!;
      next[hit] = {
        ...prev,
        preferred_name: row.preferred_name,
        gender: row.gender || prev.gender,
        purpose: row.purpose || prev.purpose,
        relationship: prev.is_self
          ? "Self"
          : row.relationship &&
              RELATIONSHIP_OPTIONS.includes(
                row.relationship as (typeof RELATIONSHIP_OPTIONS)[number],
              )
            ? row.relationship
            : prev.relationship,
        name_history,
      };
      replaced += 1;
      continue;
    }

    if (next.length >= maxPeople) {
      skipped += 1;
      continue;
    }

    const asSelf = Boolean(row.is_self) && !hasSelf;
    const relationship = asSelf
      ? "Self"
      : RELATIONSHIP_OPTIONS.includes(
            row.relationship as (typeof RELATIONSHIP_OPTIONS)[number],
          )
        ? row.relationship
        : "Other relative";

    next.push({
      is_self: asSelf,
      relationship,
      full_name: row.full_name,
      preferred_name: row.preferred_name,
      date_of_birth: row.date_of_birth,
      gender: row.gender,
      purpose: row.purpose,
      sort_order: next.length,
      name_history,
      identity_edit_count: 0,
    });
    indexByKey.set(key, next.length - 1);
    if (asSelf) hasSelf = true;
    added += 1;
  }

  return {
    people: next.map((p, i) => ({ ...p, sort_order: i })),
    replaced,
    added,
    skipped,
  };
}
