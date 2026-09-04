import type { LastFourAnalysis, PurposeScores } from "@/lib/numerology/mobileLastFour";
import { PURPOSE_LABEL } from "@/lib/numerology/mobileLastFour";

const PURPOSE_ORDER = [
  "business",
  "career",
  "networking",
  "wealth",
  "relationships",
  "personal",
] as const;

type Props = {
  lastFour: LastFourAnalysis;
  purpose: PurposeScores;
  birthNumber: number;
  destinyNumber: number;
};

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
            className={`rounded-xl border px-2.5 py-2 ${
              sl.isZero
                ? "border-rose-200 bg-rose-50 text-rose-950"
                : "border-[var(--line)] bg-white/80 text-ink"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              {sl.hint}
            </p>
            <p className="brand mt-0.5 text-2xl leading-none">{sl.digit}</p>
            <p className="mt-1 text-[11px] font-medium leading-4">{sl.label}</p>
            <p className="mt-1 text-[11px] leading-4 text-ink-soft">{sl.note}</p>
          </div>
        ))}
      </div>
      <p className="text-sm leading-5 text-ink">
        Last-four total {lastFour.compound} → root {lastFour.root} (metadata;
        root is what is compared to birth {birthNumber} and destiny{" "}
        {destinyNumber}). {lastFour.directionNote}
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
