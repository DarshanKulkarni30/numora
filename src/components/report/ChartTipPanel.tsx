"use client";

type Props = {
  tip: string | null;
  empty: string;
};

/** Shared hover tip strip under birth-chart UIs. */
export function ChartTipPanel({ tip, empty }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto min-h-[4.5rem] max-w-md rounded-xl border border-dashed border-[var(--line)] bg-white/70 px-3 py-2 text-[12px] leading-snug text-ink"
    >
      {tip ? (
        <p className="whitespace-pre-line">{tip}</p>
      ) : (
        <p className="text-ink-soft">{empty}</p>
      )}
    </div>
  );
}
