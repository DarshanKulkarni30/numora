import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";

/** Parse a snapshot string such as "7" or "11". */
export function parseChartNumber(raw: string | number | undefined): number | null {
  if (raw === undefined || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.trunc(n);
}

export function isMaster(n: number): boolean {
  return n === 11 || n === 22 || n === 33;
}

/** 1–9 core used for family clustering; masters collapse (11→2). */
export function coreDigit(n: number): number {
  if (n >= 1 && n <= 9) return n;
  return reduceToSingleDigit(n);
}

export function displayNumber(n: number): string {
  return String(n);
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function formatAsOf(now = new Date()): string {
  return now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
