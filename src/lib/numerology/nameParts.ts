/** Split a profile full name into given names + last token (surname). */

export function splitGivenAndSurname(fullName: string): {
  given: string;
  surname: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { given: "", surname: "" };
  if (parts.length === 1) return { given: parts[0], surname: "" };
  return {
    given: parts.slice(0, -1).join(" "),
    surname: parts[parts.length - 1],
  };
}

export function joinGivenAndSurname(given: string, surname: string): string {
  return [given.trim(), surname.trim()].filter(Boolean).join(" ");
}
