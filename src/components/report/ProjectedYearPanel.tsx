"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { YearOutlookMandala } from "@/components/report/YearOutlookMandala";
import {
  projectedYearCycleStarting,
} from "@/lib/numerology/vedicYearNumber";

type Props = {
  dateOfBirth: string;
  /** Cycle-start year (birthday default). */
  initialYear?: number;
  /** Deep-link to /years for this report person. */
  yearsHref?: string;
  /** Hide outer chrome when nested in TimingDashboard */
  embedded?: boolean;
};

export function ProjectedYearPanel({
  dateOfBirth,
  initialYear,
  yearsHref = "/years?tab=vedic",
  embedded = false,
}: Props) {
  const fallbackYear = initialYear ?? new Date().getFullYear();
  const [year, setYear] = useState(fallbackYear);

  const cycle = useMemo(
    () => projectedYearCycleStarting(dateOfBirth, year),
    [dateOfBirth, year],
  );

  const body = (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={embedded ? "text-lg text-ink" : "text-xl text-ink"}>
            Year Outlook
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Birthday-year clock (date + weekday of that birthday). Hover a ring
            for what that layer is. Combined job is under the graphic.
          </p>
          <p className="mt-2 text-xs leading-5 text-ink-soft">
            <span className="font-medium text-ink">Personal Year</span> =
            birth month + birth day + full year (Western pacing).{" "}
            <span className="font-medium text-ink">Year Outlook</span> also
            folds in the weekday of that year’s birthday.
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

      <div className="mt-4">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-ink-soft">
          Year number for {cycle.rangeLabel}
        </p>
        <YearOutlookMandala cycle={cycle} dob={dateOfBirth} />
      </div>

      <p className="mt-4 text-xs leading-5 text-ink-soft">
        Reflective pacing theme for the selected birthday cycle—not a prediction
        of specific events.
      </p>
    </>
  );

  if (embedded) {
    return <div className="sys-timing rounded-2xl border p-5 sm:p-6">{body}</div>;
  }

  return <div className="sys-timing rounded-2xl border p-5 sm:p-6">{body}</div>;
}
