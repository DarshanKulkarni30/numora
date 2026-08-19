"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  projectedYearCycleStarting,
  projectedYearMeta,
} from "@/lib/numerology/vedicYearNumber";

type Props = {
  dateOfBirth: string;
  /** Cycle-start year (birthday default). */
  initialYear?: number;
  /** Deep-link to /years for this report person. */
  yearsHref?: string;
};

export function ProjectedYearPanel({
  dateOfBirth,
  initialYear,
  yearsHref = "/years?tab=vedic",
}: Props) {
  const fallbackYear = initialYear ?? new Date().getFullYear();
  const [year, setYear] = useState(fallbackYear);

  const cycle = useMemo(
    () => projectedYearCycleStarting(dateOfBirth, year),
    [dateOfBirth, year],
  );
  const meta = projectedYearMeta(cycle.number);

  return (
    <div className="sys-timing rounded-2xl border p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium tracking-wide">
            Year outlook by birthday cycle
          </p>
          <p className="mt-1 text-sm opacity-80">
            A second way to read a year’s tone beside Personal Year. This
            year’s Vedic number activates on your birthday. Step years to see
            each cycle.
          </p>
          <p className="mt-2 text-xs leading-5 opacity-80">
            <span className="font-medium text-ink">Personal Year</span> =
            birth month + birth day + full year → one digit (Western pacing).{" "}
            <span className="font-medium text-ink">Year outlook</span> below
            also folds in the weekday of that year’s birthday. Toggle Calendar
            year on the Years page for 1 Jan–31 Dec.
          </p>
          <p className="mt-3">
            <Link
              href={yearsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tactile inline-flex rounded-full border border-[var(--sys-timing-border)] bg-white/80 px-3 py-1.5 text-sm text-ink"
            >
              View all years
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-tactile rounded-full border border-[var(--sys-timing-border)] bg-white/80 px-3 py-1.5 text-sm text-ink"
            onClick={() => setYear((y) => y - 1)}
            aria-label="Previous cycle year"
          >
            −
          </button>
          <span className="brand min-w-[3.5rem] text-center text-lg text-ink">
            {year}
          </span>
          <button
            type="button"
            className="btn-tactile rounded-full border border-[var(--sys-timing-border)] bg-white/80 px-3 py-1.5 text-sm text-ink"
            onClick={() => setYear((y) => y + 1)}
            aria-label="Next cycle year"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider opacity-70">
            Year number for {cycle.rangeLabel}
          </p>
          <Link
            href={`/guide/projected-year/${cycle.number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="brand text-4xl text-ink underline-offset-4 hover:underline"
          >
            {cycle.number}
          </Link>
        </div>
        <p className="text-sm opacity-80">
          Planet tone: <span className="text-ink">{meta.planet}</span>
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--sys-timing-border)] bg-white/70 px-4 py-3 text-sm text-ink">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Calculation for {cycle.rangeLabel}
        </p>
        <ol className="mt-2 space-y-1.5 text-ink-soft">
          <li>
            1. Birth month{" "}
            <span className="font-medium text-ink">{cycle.month}</span> +
            birth day{" "}
            <span className="font-medium text-ink">{cycle.day}</span>
          </li>
          <li>
            2. Last two digits of {cycle.calendarYearUsed}:{" "}
            <span className="font-medium text-ink">{cycle.yearDigits}</span>
          </li>
          <li>
            3. Weekday of your birthday in {cycle.calendarYearUsed}:{" "}
            <span className="font-medium text-ink">
              {cycle.weekdayLabel}
            </span>{" "}
            → number{" "}
            <span className="font-medium text-ink">
              {cycle.weekdayDigit}
            </span>
          </li>
          <li>
            4. Add them:{" "}
            <span className="font-medium text-ink">
              {cycle.month} + {cycle.day} + {cycle.yearDigits} +{" "}
              {cycle.weekdayDigit} = {cycle.compound}
            </span>
          </li>
          <li>
            5. Reduce to one digit:{" "}
            <span className="font-medium text-ink">{cycle.number}</span>
          </li>
        </ol>
      </div>

      <p className="mt-4 text-sm leading-6 text-ink">{meta.theme}</p>
      <ul className="mt-3 space-y-1 text-sm opacity-80">
        {meta.strengths.slice(0, 2).map((s) => (
          <li key={s}>· {s}</li>
        ))}
        <li>· Practice: {meta.practice}</li>
      </ul>
      <p className="mt-4 text-xs leading-5 opacity-75">
        Reflective pacing theme for the selected birthday cycle—not a prediction
        of specific events.
      </p>
    </div>
  );
}
