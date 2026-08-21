"use client";

import { useMemo, useState } from "react";
import {
  analyzePlace,
  type PlaceKind,
} from "@/lib/numerology/placeNumber";

export function PlaceAnalyzer() {
  const [kind, setKind] = useState<PlaceKind>("address");
  const [raw, setRaw] = useState("");

  const reading = useMemo(() => analyzePlace(raw, kind), [raw, kind]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1 sm:max-w-md">
        {(["address", "phone"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setKind(id)}
            className={`btn-tactile flex-1 rounded-full px-4 py-2.5 text-sm ${
              kind === id
                ? "bg-ink text-paper shadow-sm"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {id === "address" ? "Address" : "Phone"}
          </button>
        ))}
      </div>

      <label className="block text-sm">
        <span className="text-ink-soft">
          {kind === "address"
            ? "Street, city, or a single line"
            : "Digits as you dial them (no country code needed)"}
        </span>
        <input
          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-ink"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={
            kind === "address" ? "14 Oak Lane, Brighton" : "9876543210"
          }
        />
      </label>

      {reading ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-gold-deep">
            Vibration
          </p>
          <p className="brand mt-2 text-4xl text-ink">{reading.combined}</p>
          {kind === "address" ? (
            <p className="mt-1 text-sm text-ink-soft">
              Letters {reading.letterReduced ?? "—"} · digits{" "}
              {reading.digitReduced || "—"}
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-soft">
              Compound {reading.digitCompound} → {reading.digitReduced}
            </p>
          )}
          <p className="mt-3 text-sm leading-7 text-ink-soft">{reading.summary}</p>
          <p className="mt-2 text-sm text-ink">{reading.practice}</p>
          <p className="mt-4 text-xs leading-5 text-ink-soft">
            {reading.disclaimer}
          </p>
        </div>
      ) : raw.trim() ? (
        <p className="text-sm text-ink-soft">
          Add letters or digits to read a vibration.
        </p>
      ) : null}
    </div>
  );
}
