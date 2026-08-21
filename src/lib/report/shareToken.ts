/**
 * Time-boxed view-only share tokens for a live HTML reading.
 * HMAC, 7 days. No database row — link dies when exp passes.
 */

import { createHmac, timingSafeEqual } from "crypto";

export const SHARE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type SharePayload = {
  rid: string;
  exp: number;
};

function shareSecret(): string {
  return (
    process.env.SHARE_LINK_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    ""
  );
}

export function shareLinksConfigured(): boolean {
  return Boolean(shareSecret());
}

function sign(payloadB64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

export function createShareToken(
  reportId: string,
  ttlMs = SHARE_TTL_MS,
): { token: string; expiresAt: string } {
  const secret = shareSecret();
  if (!secret) {
    throw new Error("Share links are not configured on this server.");
  }
  const exp = Date.now() + ttlMs;
  const payloadB64 = Buffer.from(
    JSON.stringify({ rid: reportId, exp } satisfies SharePayload),
    "utf8",
  ).toString("base64url");
  const token = `${payloadB64}.${sign(payloadB64, secret)}`;
  return { token, expiresAt: new Date(exp).toISOString() };
}

export function verifyShareToken(
  token: string,
): { reportId: string; expiresAt: string } | null {
  const secret = shareSecret();
  if (!secret || !token) return null;
  const trimmed = token.trim();
  const dot = trimmed.lastIndexOf(".");
  if (dot <= 0) return null;
  const payloadB64 = trimmed.slice(0, dot);
  const sig = trimmed.slice(dot + 1);
  if (!payloadB64 || !sig) return null;
  const expected = sign(payloadB64, secret);
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as SharePayload;
    if (!data.rid || typeof data.exp !== "number") return null;
    if (data.exp < Date.now()) return null;
    return {
      reportId: data.rid,
      expiresAt: new Date(data.exp).toISOString(),
    };
  } catch {
    return null;
  }
}
