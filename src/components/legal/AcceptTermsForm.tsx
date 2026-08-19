"use client";

import { useState } from "react";
import { CURRENT_TERMS_VERSION } from "@/lib/legal/terms";

type Props = {
  nextPath: string;
};

export function AcceptTermsForm({ nextPath }: Props) {
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onAccept() {
    if (!checked || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/legal/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: CURRENT_TERMS_VERSION }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setError(data.error || "Could not save acceptance.");
        setBusy(false);
        return;
      }
      const dest = nextPath.startsWith("/") ? nextPath : "/dashboard";
      window.location.assign(dest);
    } catch {
      setError("Network error. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-4 text-sm text-ink">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1"
        />
        <span>
          I have read and agree to the Terms of Use (draft{" "}
          {CURRENT_TERMS_VERSION}). I will not copy, scrape, or recreate
          proprietary NumoraWisdom content or visuals.
        </span>
      </label>

      {error ? <p className="text-sm text-rose-800">{error}</p> : null}

      <button
        type="button"
        disabled={!checked || busy}
        onClick={onAccept}
        className="btn-tactile rounded-full bg-sea px-6 py-3 text-paper hover:bg-sea-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Saving…" : "Accept and continue"}
      </button>
    </div>
  );
}
