import { reduceToSingleDigit } from "./dateNumbers";

export const MOBILE_NOTE =
  "This is a traditional Birth × Destiny × mobile-digit lookup for reflection only. It describes how three digits are often read together—not a prediction of luck, money, call volume, or fate, and not telecom or legal advice.";

export type MobileParseOk = {
  ok: true;
  digits: string;
  compound: number;
  core: number;
};

export type MobileParseErr = {
  ok: false;
  error: string;
};

export type MobileParse = MobileParseOk | MobileParseErr;

const MIN_LEN = 8;
const MAX_LEN = 12;

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

  return {
    ok: true,
    digits,
    compound,
    core: mobileCore(compound),
  };
}
