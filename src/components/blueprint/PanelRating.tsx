"use client";

import { useState } from "react";
import { YEAR_INTERPRETATION_VERSION } from "@/lib/numerology/blueprint/yearInterpreter";

type Props = {
  panelId: string;
  numbers: Record<string, string | number | null | undefined>;
  enabled?: boolean;
  interpretationVersion?: string;
};

export function PanelRating({
  panelId,
  numbers,
  enabled = true,
  interpretationVersion = YEAR_INTERPRETATION_VERSION,
}: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "local">(
    "idle",
  );

  if (!enabled) return null;

  async function save(next: number) {
    setRating(next);
    setStatus("saving");
    try {
      const res = await fetch("/api/interpretation-ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          panel_id: panelId,
          interpretation_version: interpretationVersion,
          numbers,
          rating: next,
          feedback_type: "panel",
        }),
      });
      setStatus(res.ok ? "saved" : "local");
    } catch {
      setStatus("local");
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
        Does this fit?
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} of 5`}
            aria-pressed={rating === n}
            className={`btn-tactile h-8 w-8 rounded-full border text-sm ${
              rating != null && n <= rating
                ? "border-gold-deep bg-gold/30 text-ink"
                : "border-[var(--line)] bg-white text-ink-soft"
            }`}
            onClick={() => void save(n)}
          >
            {n}
          </button>
        ))}
      </div>
      {status === "saving" ? (
        <span className="text-xs text-ink-soft">Saving…</span>
      ) : null}
      {status === "saved" ? (
        <span className="text-xs text-ink-soft">Saved</span>
      ) : null}
      {status === "local" ? (
        <span className="text-xs text-ink-soft">Kept on this device</span>
      ) : null}
    </div>
  );
}
