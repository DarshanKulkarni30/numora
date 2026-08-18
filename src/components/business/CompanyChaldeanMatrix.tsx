"use client";

import { useMemo } from "react";
import { CHALDEAN } from "@/lib/numerology/mappings";
import { analyzeCompanyNameChaldean } from "@/lib/numerology/companyNameBreakdown";
import { PLANETS, VEDIC_PLANET_BY_NUMBER } from "@/lib/numerology/planets";

const LETTERS_BY_DIGIT: Record<number, string> = (() => {
  const buckets: Record<number, string[]> = {};
  for (const [letter, value] of Object.entries(CHALDEAN)) {
    (buckets[value] ??= []).push(letter);
  }
  const out: Record<number, string> = {};
  for (let d = 1; d <= 8; d++) {
    out[d] = (buckets[d] ?? []).sort().join("");
  }
  return out;
})();

type Props = {
  companyName: string;
  /** First owner's psychic/destiny for a light harmony note (optional). */
  bridgePsychic?: number;
  bridgeDestiny?: number;
};

export function CompanyChaldeanMatrix({
  companyName,
  bridgePsychic = 1,
  bridgeDestiny = 1,
}: Props) {
  const breakdown = useMemo(
    () =>
      analyzeCompanyNameChaldean(companyName, bridgePsychic, bridgeDestiny),
    [companyName, bridgePsychic, bridgeDestiny],
  );

  const usedDigits = useMemo(() => {
    const set = new Set<number>();
    if (!breakdown) return set;
    for (const word of breakdown.words) {
      for (const { value } of word.letters) set.add(value);
    }
    set.add(breakdown.grandReduced);
    return set;
  }, [breakdown]);

  if (!breakdown) return null;

  const planet = breakdown.planet;

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-gradient-to-b from-mist/80 to-white/90 p-4 shadow-sm">
      <div>
        <p className="text-sm font-medium text-ink">Chaldean letter map</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          Digits 1–8 (no 9 for letters). Highlighted cells appear in this
          spelling.
        </p>
      </div>

      <div className="relative grid grid-cols-4 gap-2">
        <div
          className="pointer-events-none absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-sea/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sea"
          aria-hidden
        />
        {[1, 2, 3, 4, 5, 6, 7, 8].map((digit) => {
          const active = usedDigits.has(digit);
          const letters = LETTERS_BY_DIGIT[digit] ?? "";
          const label =
            PLANETS[VEDIC_PLANET_BY_NUMBER[digit] ?? "sun"]?.name ?? "";
          return (
            <div
              key={digit}
              className={`relative flex min-h-[4.5rem] flex-col justify-between rounded-xl border px-2 py-2 transition ${
                active
                  ? "border-sea bg-sea/10 shadow-sm ring-1 ring-sea/30"
                  : "border-[var(--line)] bg-white/70"
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <span
                  className={`brand text-xl font-semibold ${
                    active ? "text-sea-deep" : "text-ink"
                  }`}
                >
                  {digit}
                </span>
                <span className="max-w-[3.5rem] text-right text-[10px] leading-tight tracking-wide text-ink-soft">
                  {letters}
                </span>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-ink-soft">
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-[var(--line)] pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Compound sum
          </p>
          <p className="brand text-lg text-ink">{breakdown.grandCompound}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Name number
          </p>
          <p className="brand text-lg text-ink">
            {breakdown.grandReduced}
            <span className="ml-1 text-sm font-normal text-ink-soft">
              ({planet.name})
            </span>
          </p>
        </div>
      </div>
      <p className="text-xs leading-5 text-ink-soft">{breakdown.compoundNote}</p>
    </div>
  );
}
