const DEFAULT_MASTERS = new Set([11, 22, 33]);

/** Reduce a number while preserving master numbers when requested. */
export function reduceNumber(
  value: number,
  keepMasters: Iterable<number> = DEFAULT_MASTERS,
): number {
  const masters = keepMasters instanceof Set ? keepMasters : new Set(keepMasters);
  let n = Math.abs(Math.trunc(value));
  while (n > 9 && !masters.has(n)) {
    n = digitSum(n);
  }
  return n;
}

export function digitSum(value: number): number {
  return Math.abs(Math.trunc(value))
    .toString()
    .split("")
    .reduce((sum, d) => sum + Number(d), 0);
}

export function reduceWithCompound(
  value: number,
  keepMasters: Iterable<number> = DEFAULT_MASTERS,
): { compound: number; reduced: number } {
  const compound = Math.abs(Math.trunc(value));
  return { compound, reduced: reduceNumber(compound, keepMasters) };
}

export function parseDob(dob: string): { day: number; month: number; year: number } {
  const trimmed = dob.trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
  if (!match) {
    throw new Error("Date of birth must be in DD/MM/YYYY format.");
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error("Please enter a valid date of birth.");
  }
  if (date > new Date()) {
    throw new Error("Date of birth cannot be in the future.");
  }
  return { day, month, year };
}

export function calculateAge(dob: string, now = new Date()): number {
  const { day, month, year } = parseDob(dob);
  let age = now.getFullYear() - year;
  const hadBirthday =
    now.getMonth() + 1 > month ||
    (now.getMonth() + 1 === month && now.getDate() >= day);
  if (!hadBirthday) age -= 1;
  return Math.max(0, age);
}

export function lettersOnly(name: string): string {
  return name.toUpperCase().replace(/[^A-Z]/g, "");
}

export function isVowel(ch: string): boolean {
  return "AEIOU".includes(ch);
}
