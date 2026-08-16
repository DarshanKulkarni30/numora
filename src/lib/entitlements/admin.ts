/** Accounts with full testing access (no paid limits). */
export const ADMIN_EMAILS = new Set([
  "darshan.kulkarni30@gmail.com",
]);

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.trim().toLowerCase());
}
