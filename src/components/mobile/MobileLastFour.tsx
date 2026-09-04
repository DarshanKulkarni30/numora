import type { LastFourAnalysis, LastFourSlotTone, PurposeScores } from "@/lib/numerology/mobileLastFour";
import {
  LAST_FOUR_LAYER_LABEL,
  LAST_FOUR_LAYER_MAX,
  PURPOSE_LABEL,
} from "@/lib/numerology/mobileLastFour";

const PURPOSE_ORDER = [
  "business",
  "career",
  "networking",
  "wealth",
  "relationships",
  "personal",
] as const;

const LAYER_ORDER = ["a", "b", "c", "d", "e"] as const;

type Props = {
  lastFour: LastFourAnalysis;
  purpose: PurposeScores;
  birthNumber: number;
  destinyNumber: number;
};

function slotClass(tone: LastFourSlotTone): string {
  if (tone === "clean") return "border-teal-400 bg-teal-50 text-teal-950";
  if (tone === "watch") return "border-amber-300 bg-amber-50 text-amber-950";
  return "border-rose-300 bg-rose-50 text-rose-950";
}

function fmt(n: number): string {
  return n.toFixed(2);
}

export function MobileLastFour({
  lastFour,
  purpose,
  birthNumber,
  destinyNumber,
}: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink">
          Last four · receiver / caller
        </p>
        <p className="mt-0.5 text-[11px] leading-4 text-ink-soft">
          {lastFour.schoolNote}
        </p>
      </div>
      <p className="font-mono text-lg tracking-[0.2em] text-ink">
        {lastFour.digits.split("").join(" ")}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {lastFour.slots.map((sl) => (
          <div
            key={sl.role}
            className={`rounded-xl border px-2.5 py-2 ${slotClass(sl.tone)}`}
          >
            <p className="text-[10px] uppercase tracking-wider opacity-80">
              {sl.hint}
            </p>
            <p className="brand mt-0.5 text-2xl leading-none">{sl.digit}</p>
            <p className="mt-1 text-[11px] font-medium leading-4">{sl.label}</p>
            <p className="mt-1 text-[11px] leading-4 opacity-80">{sl.note}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
          Last-4 layers · 5 sequence points
        </p>
        <ul className="mt-1.5 space-y-1">
          {LAYER_ORDER.map((key) => {
            const val = lastFour.layers[key];
            const max = LAST_FOUR_LAYER_MAX[key];
            return (
              <li key={key}>
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="text-ink">{LAST_FOUR_LAYER_LABEL[key]}</span>
                  <span className="font-medium text-ink">
                    {fmt(val)} / {fmt(max)}
                  </span>
                </div>
                <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-[var(--mist)]">
                  <div
                    className="h-full rounded-full bg-sea"
                    style={{ width: `${(val / max) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-1 text-[11px] text-ink-soft">
          Slice {fmt(lastFour.points)} / 5.00
        </p>
      </div>
      <p className="text-sm leading-5 text-ink">
        Last-four total {lastFour.compound} → root {lastFour.root} (metadata;
        root is what is compared to birth {birthNumber} and destiny{" "}
        {destinyNumber}). {lastFour.directionNote} {lastFour.patternNote}
      </p>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
          Purpose suitability · not part of the 100
        </p>
        <ul className="mt-1.5 space-y-1.5">
          {PURPOSE_ORDER.map((key) => {
            const pct = purpose[key];
            return (
              <li key={key}>
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="text-ink">{PURPOSE_LABEL[key]}</span>
                  <span className="font-medium text-ink">{pct}%</span>
                </div>
                <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-[var(--mist)]">
                  <div
                    className="h-full rounded-full bg-sea"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
