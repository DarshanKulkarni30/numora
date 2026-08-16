import { reduceToSingleDigit } from "./dateNumbers";

export const MOBILE_NOTE =
  "This is a traditional Birth × Destiny × mobile-digit lookup for reflection only. It describes how three digits are often read together—not a prediction of luck, money, call volume, or fate, and not telecom or legal advice.";

export type MobileSegment = {
  digits: string;
  compound: number;
  core: number;
};

export type ConsecutiveRun = {
  digit: string;
  start: number;
  length: number;
};

export type MobileParseOk = {
  ok: true;
  digits: string;
  compound: number;
  core: number;
  /** First (N − 4) digits when N ≥ 5. */
  prefix: MobileSegment | null;
  /** Last 4 digits when N ≥ 4. */
  last4: MobileSegment | null;
  /** Count of each digit 0–9 in the full number. */
  digitCounts: number[];
  /** Runs of the same digit length ≥ 3 (0-based start index). */
  consecutiveRuns: ConsecutiveRun[];
};

export type MobileParseErr = {
  ok: false;
  error: string;
};

export type MobileParse = MobileParseOk | MobileParseErr;

const MIN_LEN = 8;
const MAX_LEN = 12;
const LAST4_LEN = 4;

/** Digits only, after removing spaces and dashes. */
export function stripMobileInput(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

export function mobileCompound(digits: string): number {
  return digits.split("").reduce((sum, ch) => sum + Number(ch), 0);
}

export function mobileCore(compound: number): number {
  return reduceToSingleDigit(compound);
}

function segmentFromDigits(digits: string): MobileSegment {
  const compound = mobileCompound(digits);
  return {
    digits,
    compound,
    core: mobileCore(compound || 9),
  };
}

export function countDigits(digits: string): number[] {
  const counts = Array.from({ length: 10 }, () => 0);
  for (const ch of digits) {
    const n = Number(ch);
    if (n >= 0 && n <= 9) counts[n] += 1;
  }
  return counts;
}

/** Consecutive same-digit runs of length ≥ minLen. */
export function findConsecutiveRuns(
  digits: string,
  minLen = 3,
): ConsecutiveRun[] {
  const runs: ConsecutiveRun[] = [];
  if (!digits) return runs;
  let start = 0;
  for (let i = 1; i <= digits.length; i++) {
    if (i < digits.length && digits[i] === digits[start]) continue;
    const length = i - start;
    if (length >= minLen) {
      runs.push({ digit: digits[start], start, length });
    }
    start = i;
  }
  return runs;
}

/**
 * Split national digits into prefix (first N−4) and last 4.
 * On a 10-digit number this is first 6 + last 4.
 */
export function mobileDigitSegments(digits: string): {
  prefix: MobileSegment | null;
  last4: MobileSegment | null;
} {
  if (digits.length < LAST4_LEN) {
    return { prefix: null, last4: null };
  }
  const last4 = segmentFromDigits(digits.slice(-LAST4_LEN));
  const prefixDigits = digits.slice(0, -LAST4_LEN);
  const prefix =
    prefixDigits.length > 0 ? segmentFromDigits(prefixDigits) : null;
  return { prefix, last4 };
}

/**
 * Parse a national mobile number (no country code).
 * Rejects +, 00, and a leading 91 on a 12-digit string.
 */
export function parseMobile(raw: string): MobileParse {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: "Type a mobile number without a country code." };
  }
  if (trimmed.startsWith("+")) {
    return {
      ok: false,
      error: "Leave out the country code (no + or 00). Type the national number only.",
    };
  }
  if (/[^\d\s-]/.test(trimmed)) {
    return {
      ok: false,
      error: "Use digits only (spaces or dashes are fine).",
    };
  }

  const digits = stripMobileInput(trimmed).replace(/\D/g, "");
  const compound = mobileCompound(digits);
  if (digits.length >= MIN_LEN && digits.length <= MAX_LEN && compound === 0) {
    return { ok: false, error: "Enter a real number—zeros alone have no core digit." };
  }
  if (trimmed.startsWith("00")) {
    return {
      ok: false,
      error: "Leave out the country code (no + or 00). Type the national number only.",
    };
  }
  if (digits.length < MIN_LEN || digits.length > MAX_LEN) {
    return {
      ok: false,
      error: `Use ${MIN_LEN}–${MAX_LEN} digits, without a country code.`,
    };
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return {
      ok: false,
      error: "That looks like a country code plus a number. Type the national digits only.",
    };
  }

  const { prefix, last4 } = mobileDigitSegments(digits);

  return {
    ok: true,
    digits,
    compound,
    core: mobileCore(compound),
    prefix,
    last4,
    digitCounts: countDigits(digits),
    consecutiveRuns: findConsecutiveRuns(digits, 3),
  };
}
