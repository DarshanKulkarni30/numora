/** Format digits as DD/MM/YYYY while typing. */
export function formatDobInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Normalize DOB strings to DD/MM/YYYY.
 * Accepts profile form style and HTML date inputs (YYYY-MM-DD).
 */
export function normalizeDobToSlash(value: string): string | null {
  const trimmed = value.trim();
  const slash = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (slash) return trimmed;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  return null;
}

export function isValidDob(value: string): boolean {
  const normalized = normalizeDobToSlash(value);
  if (!normalized) return false;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(normalized);
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < 1900 || year > new Date().getFullYear()) return false;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }
  return date <= new Date();
}

export function dobError(value: string): string | null {
  if (!value.trim()) return "Date of birth is required.";
  if (!normalizeDobToSlash(value)) {
    return "Use DD/MM/YYYY format.";
  }
  if (!isValidDob(value)) return "Enter a valid calendar date.";
  return null;
}

export function formatSlashDate(day: number, month: number, year: number): string {
  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
}

export function todaySlash(now = new Date()): string {
  return formatSlashDate(now.getDate(), now.getMonth() + 1, now.getFullYear());
}

/** Calendar date in DD/MM/YYYY — no “must be in the past” rule (for name eras). */
export function parseSlashDate(
  value: string,
): { day: number; month: number; year: number } | null {
  const normalized = normalizeDobToSlash(value);
  if (!normalized) return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(normalized);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < 1900 || year > 2100) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return { day, month, year };
}

export function isValidCalendarDate(value: string): boolean {
  return parseSlashDate(value) != null;
}

/** Sortable YYYYMMDD key, or null if invalid. */
export function slashDateKey(value: string): number | null {
  const p = parseSlashDate(value);
  if (!p) return null;
  return p.year * 10000 + p.month * 100 + p.day;
}

export function addDaysToSlash(value: string, days: number): string | null {
  const p = parseSlashDate(value);
  if (!p) return null;
  const utc = Date.UTC(p.year, p.month - 1, p.day);
  const next = new Date(utc + days * 86400000);
  return formatSlashDate(
    next.getUTCDate(),
    next.getUTCMonth() + 1,
    next.getUTCFullYear(),
  );
}
