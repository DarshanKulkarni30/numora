/**
 * Dated name eras on a profile: natal (birth-certificate) spelling stays
 * locked; later legal / marriage / chosen names are additional layers.
 */

import { splitGivenAndSurname } from "@/lib/numerology/nameParts";
import {
  addDaysToSlash,
  isValidCalendarDate,
  slashDateKey,
  todaySlash,
} from "@/lib/profile/date";

export const NAME_ERA_REASONS = [
  "marriage",
  "legal",
  "professional",
  "religious",
  "other",
] as const;

export type NameEraReason = (typeof NAME_ERA_REASONS)[number];

export const NAME_ERA_REASON_LABEL: Record<NameEraReason, string> = {
  marriage: "Marriage / partner name",
  legal: "Legal name change",
  professional: "Professional / public name",
  religious: "Religious / chosen name",
  other: "Other",
};

export type NameEra = {
  id: string;
  full_name: string;
  started_on: string;
  ended_on: string;
  reason: NameEraReason;
};

export const MAX_NAME_ERAS = 6;

export type NameInForce = {
  natalSpelling: string;
  operatingSpelling: string;
  givenSpelling: string;
  natalGivenSpelling: string;
  calledBy: string;
  asOf: string;
  era: NameEra | null;
  label: string;
  differs: boolean;
  givenUnchanged: boolean;
};

function tidyName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function isNameEraReason(value: string): value is NameEraReason {
  return (NAME_ERA_REASONS as readonly string[]).includes(value);
}

export function newNameEraId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `era-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function blankNameEra(startedOn = ""): NameEra {
  return {
    id: newNameEraId(),
    full_name: "",
    started_on: startedOn,
    ended_on: "",
    reason: "marriage",
  };
}

function eraLabel(era: NameEra | null): string {
  if (!era) return "Birth name";
  const reason = NAME_ERA_REASON_LABEL[era.reason] ?? "Later name";
  return era.ended_on
    ? `${reason} · ${era.started_on}–${era.ended_on}`
    : `${reason} since ${era.started_on}`;
}

function coversDate(era: NameEra, asOfKey: number): boolean {
  const start = slashDateKey(era.started_on);
  if (start == null || asOfKey < start) return false;
  if (!era.ended_on.trim()) return true;
  const end = slashDateKey(era.ended_on);
  if (end == null) return false;
  return asOfKey <= end;
}

/**
 * Sort, auto-close open eras the day before the next start, drop empties.
 * Returns an error string if the set cannot be used for analysis.
 */
export function normalizeNameHistory(
  raw: unknown,
  dateOfBirth: string,
): { eras: NameEra[]; error: string | null } {
  if (raw == null || raw === "") return { eras: [], error: null };
  if (!Array.isArray(raw)) {
    return { eras: [], error: "Name history must be a list of later names." };
  }
  if (raw.length > MAX_NAME_ERAS) {
    return {
      eras: [],
      error: `You can save up to ${MAX_NAME_ERAS} later names.`,
    };
  }

  const dobKey = slashDateKey(dateOfBirth);
  if (dobKey == null) {
    return { eras: [], error: "Save a valid date of birth before adding later names." };
  }

  const parsed: NameEra[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const rec = row as Record<string, unknown>;
    const full_name = tidyName(String(rec.full_name ?? rec.fullName ?? ""));
    if (!full_name) continue;
    const started_on = String(rec.started_on ?? rec.startedOn ?? "").trim();
    const ended_on = String(rec.ended_on ?? rec.endedOn ?? "").trim();
    const reasonRaw = String(rec.reason ?? "other");
    const reason: NameEraReason = isNameEraReason(reasonRaw)
      ? reasonRaw
      : "other";
    const id = String(rec.id ?? "").trim() || newNameEraId();

    if (!isValidCalendarDate(started_on)) {
      return {
        eras: [],
        error: `“${full_name}” needs a valid start date (DD/MM/YYYY).`,
      };
    }
    const startKey = slashDateKey(started_on)!;
    if (startKey < dobKey) {
      return {
        eras: [],
        error: `“${full_name}” cannot start before the date of birth.`,
      };
    }
    if (ended_on) {
      if (!isValidCalendarDate(ended_on)) {
        return {
          eras: [],
          error: `“${full_name}” has an invalid end date.`,
        };
      }
      if (slashDateKey(ended_on)! < startKey) {
        return {
          eras: [],
          error: `“${full_name}” cannot end before it starts.`,
        };
      }
    }

    parsed.push({ id, full_name, started_on, ended_on, reason });
  }

  parsed.sort((a, b) => slashDateKey(a.started_on)! - slashDateKey(b.started_on)!);

  const closed: NameEra[] = parsed.map((era, i) => {
    const next = parsed[i + 1];
    if (!next) return era;
    const nextStart = slashDateKey(next.started_on)!;
    const ownEnd = era.ended_on.trim()
      ? slashDateKey(era.ended_on)
      : null;
    if (ownEnd != null && ownEnd < nextStart) return era;
    const dayBefore = addDaysToSlash(next.started_on, -1);
    if (!dayBefore || slashDateKey(dayBefore)! < slashDateKey(era.started_on)!) {
      return era;
    }
    return { ...era, ended_on: dayBefore };
  });

  for (let i = 0; i < closed.length; i++) {
    const a = closed[i];
    const aStart = slashDateKey(a.started_on)!;
    const aEnd = a.ended_on ? slashDateKey(a.ended_on)! : 99999999;
    for (let j = i + 1; j < closed.length; j++) {
      const b = closed[j];
      const bStart = slashDateKey(b.started_on)!;
      if (bStart === aStart) {
        return {
          eras: [],
          error: "Two later names cannot start on the same date.",
        };
      }
      if (bStart <= aEnd) {
        return {
          eras: [],
          error:
            "Later names overlap. End one before the next begins, or leave the latest open.",
        };
      }
    }
  }

  return { eras: closed, error: null };
}

export function resolveNameInForce(opts: {
  natalName: string;
  dateOfBirth: string;
  history?: unknown;
  preferredName?: string;
  asOf?: Date | string;
}): NameInForce {
  const natalSpelling = tidyName(opts.natalName);
  const asOf =
    typeof opts.asOf === "string" && opts.asOf.trim()
      ? opts.asOf.trim()
      : todaySlash(opts.asOf instanceof Date ? opts.asOf : undefined);
  const asOfKey = slashDateKey(asOf) ?? slashDateKey(todaySlash())!;
  const { eras } = normalizeNameHistory(opts.history, opts.dateOfBirth);

  let match: NameEra | null = null;
  for (const era of eras) {
    if (coversDate(era, asOfKey)) match = era;
  }

  const operatingSpelling = match?.full_name || natalSpelling;
  const givenSpelling = splitGivenAndSurname(operatingSpelling).given || operatingSpelling;
  const natalGivenSpelling =
    splitGivenAndSurname(natalSpelling).given || natalSpelling;
  const calledBy = tidyName(opts.preferredName ?? "");

  return {
    natalSpelling,
    operatingSpelling,
    givenSpelling,
    natalGivenSpelling,
    calledBy,
    asOf,
    era: match,
    label: eraLabel(match),
    differs:
      operatingSpelling.localeCompare(natalSpelling, undefined, {
        sensitivity: "accent",
      }) !== 0,
    givenUnchanged:
      givenSpelling.localeCompare(natalGivenSpelling, undefined, {
        sensitivity: "accent",
      }) === 0,
  };
}

export function operatingFullName(opts: {
  natalName: string;
  dateOfBirth: string;
  history?: unknown;
  asOf?: Date | string;
}): string {
  return resolveNameInForce(opts).operatingSpelling;
}
