"use client";

import { calculateKua } from "@/lib/numerology/hiddenYear";
import {
  lastFourVsTotalRoot,
  yearNumberSit,
} from "@/lib/numerology/mobileChartExtras";
import type { RootFitTone } from "@/lib/numerology/mobileRootFit";

const TONE_STYLE: Record<RootFitTone, string> = {
  Favourable: "border-emerald-200 bg-emerald-50 text-emerald-950",
  Steady: "border-slate-200 bg-slate-50 text-slate-800",
  Heavy: "border-amber-200 bg-amber-50 text-amber-950",
};

type Props = {
  dob: string;
  gender?: string | null;
  birthNumber: number;
  destinyNumber: number;
  totalRoot: number;
  lastFourRoot?: number | null;
};

export function MobileChartExtras({
  dob,
  gender,
  birthNumber,
  destinyNumber,
  totalRoot,
  lastFourRoot,
}: Props) {
  const year = yearNumberSit(dob, birthNumber, destinyNumber, totalRoot);
  const kua = calculateKua(dob, gender);
  const tail =
    lastFourRoot != null
      ? lastFourVsTotalRoot(lastFourRoot, totalRoot)
      : null;
  return (
    <div className="space-y-3">
      {tail ? (
        <div className={`rounded-xl border px-3 py-3 ${TONE_STYLE[tail.tone]}`}>
          <p className="text-[10px] uppercase tracking-wider opacity-80">
            Last four vs whole number
          </p>
          <p className="mt-1 text-sm font-medium">
            Last four root {tail.lastFourRoot} ↔ total root {tail.totalRoot} ·{" "}
            {tail.tone}
          </p>
          <p className="mt-1 text-xs leading-5">{tail.line}</p>
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Year number
        </p>
        <p className="brand mt-1 text-2xl text-ink">{year.root}</p>
        <p className="mt-1 text-xs leading-5 text-ink-soft">{year.line}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(
            [
              ["Birth", birthNumber, year.vsBirth],
              ["Destiny", destinyNumber, year.vsDestiny],
              ["Total root", totalRoot, year.vsMobile],
            ] as const
          ).map(([label, n, tone]) => (
            <span
              key={label}
              className={`rounded-full border px-2.5 py-1 text-xs ${TONE_STYLE[tone]}`}
            >
              {label} {n} · {tone}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Kua (Lo Shu compass)
        </p>
        {kua.ok ? (
          <>
            <p className="brand mt-1 text-2xl text-ink">{kua.number}</p>
            <p className="mt-1 text-xs leading-5 text-ink-soft">
              Extra compass number from the birth year and gender. It does not
              replace Birth, Destiny, or the 100-point score.
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm leading-5 text-ink-soft">{kua.note}</p>
        )}
      </div>
    </div>
  );
}
