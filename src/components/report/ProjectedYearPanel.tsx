"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PROJECTED_YEAR_METHOD_NOTE,
  projectedYearBreakdown,
  projectedYearMeta,
} from "@/lib/numerology/vedicYearNumber";

type Props = {
  dateOfBirth: string;
  /** Initial calendar year (usually current). */
  initialYear?: number;
};

export function ProjectedYearPanel({
  dateOfBirth,
  initialYear = new Date().getFullYear(),
}: Props) {
  const [year, setYear] = useState(initialYear);

  const breakdown = useMemo(
    () => projectedYearBreakdown(dateOfBirth, year),
    [dateOfBirth, year],
  );
  const meta = projectedYearMeta(breakdown.number);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-ink-soft">
            Projected Year
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Unit System–style year tone beside Western Personal Year.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-sm"
            onClick={() => setYear((y) => y - 1)}
            aria-label="Previous year"
          >
            −
          </button>
          <span className="brand min-w-[3.5rem] text-center text-lg text-ink">
            {year}
          </span>
          <button
            type="button"
            className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-sm"
            onClick={() => setYear((y) => y + 1)}
            aria-label="Next year"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Year number
          </p>
          <Link
            href={`/guide/projected-year/${breakdown.number}`}
            className="brand text-4xl text-ink underline-offset-4 hover:underline"
          >
            {breakdown.number}
          </Link>
        </div>
        <div className="text-sm text-ink-soft">
          <p>
            Planet tone: <span className="text-ink">{meta.planet}</span>
          </p>
          <p className="mt-1 text-xs">
            {breakdown.month}+{breakdown.day}+{breakdown.yearDigits}+
            {breakdown.weekdayDigit} ({breakdown.weekdayLabel}) →{" "}
            {breakdown.compound} → {breakdown.number}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-ink">{meta.theme}</p>
      <ul className="mt-3 space-y-1 text-sm text-ink-soft">
        {meta.strengths.slice(0, 2).map((s) => (
          <li key={s}>· {s}</li>
        ))}
        <li>· Practice: {meta.practice}</li>
      </ul>
      <p className="mt-4 text-xs leading-5 text-ink-soft">
        {PROJECTED_YEAR_METHOD_NOTE}
      </p>
    </div>
  );
}
