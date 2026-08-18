"use client";

import type { OwnerProminence } from "@/lib/numerology/ownerAgeProminence";

export function AgeFocusNumberChips({
  psychic,
  destiny,
  nameNumber,
  prominence,
}: {
  psychic: number;
  destiny: number;
  nameNumber?: number | null;
  prominence: OwnerProminence;
}) {
  const psychicFocus = prominence.phase !== "destiny_led";
  const destinyFocus = prominence.phase !== "psychic_led";
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
            psychicFocus
              ? "border-sea/40 bg-sea/10 text-sea-deep ring-2 ring-sea/20"
              : "border-[var(--line)] bg-white/80 text-ink"
          }`}
        >
          Psychic {psychic}
          {psychicFocus ? " · age focus" : ""}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
            destinyFocus
              ? "border-sea/40 bg-sea/10 text-sea-deep ring-2 ring-sea/20"
              : "border-[var(--line)] bg-white/80 text-ink"
          }`}
        >
          Destiny {destiny}
          {destinyFocus ? " · age focus" : ""}
        </span>
        {nameNumber != null ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white/80 px-2.5 py-1 text-xs text-ink">
            Name {nameNumber}
          </span>
        ) : null}
      </div>
      <p className="text-xs text-ink-soft">{prominence.caption}</p>
    </div>
  );
}
