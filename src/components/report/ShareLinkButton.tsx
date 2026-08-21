"use client";

import { useState } from "react";

type Props = {
  reportId: string;
};

export function ShareLinkButton({ reportId }: Props) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expires, setExpires] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setError(null);
    setCopied(false);
    try {
      const res = await fetch(`/api/reports/${reportId}/share`, {
        method: "POST",
      });
      const data = (await res.json()) as {
        url?: string;
        expiresAt?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not create a share link");
      }
      await navigator.clipboard.writeText(data.url);
      setCopied(true);
      setExpires(data.expiresAt ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create a share link");
    } finally {
      setBusy(false);
    }
  }

  const expLabel = expires
    ? new Date(expires).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={onClick}
        className="btn-tactile rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Creating…" : copied ? "Link copied" : "Share live link"}
      </button>
      {copied && expLabel ? (
        <p className="text-xs text-ink-soft">View-only · 7 days · until {expLabel}</p>
      ) : null}
      {error ? <p className="text-xs text-rose-800">{error}</p> : null}
    </div>
  );
}
