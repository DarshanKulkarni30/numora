/** Public product name (Chaldean brand total 50 → 5 Mercury). */
export const BRAND_NAME = "NumoraWisdom";

/** Canonical public site URL for auth redirects. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (process.env.VERCEL_ENV === "production") {
    return "https://numora-steel.vercel.app";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
