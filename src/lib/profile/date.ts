/** Format digits as DD/MM/YYYY while typing. */
export function formatDobInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function isValidDob(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
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
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value.trim())) {
    return "Use DD/MM/YYYY format.";
  }
  if (!isValidDob(value)) return "Enter a valid calendar date.";
  return null;
}
