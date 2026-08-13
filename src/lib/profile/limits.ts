const DEFAULT_MAX_FAMILY = 3;

/** Per-account family-member caps (Self is not counted). */
const ELEVATED_MAX_FAMILY: Record<string, number> = {
  "darshan.kulkarni30@gmail.com": 10,
};

export function maxFamilyMembers(email?: string | null): number {
  if (!email) return DEFAULT_MAX_FAMILY;
  const key = email.trim().toLowerCase();
  return ELEVATED_MAX_FAMILY[key] ?? DEFAULT_MAX_FAMILY;
}
