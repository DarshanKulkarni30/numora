"use client";

import { useMemo, useState } from "react";
import {
  formatCycleRange,
  personalYearBreakdown,
  personalYearCycleAt,
} from "@/lib/numerology/cycles";
import { isValidDob } from "@/lib/profile/date";

export function PersonalYearDemo() {
  const [dob, setDob] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  const steps = useMemo(() => {
    if (!isValidDob(dob)) return null;
    try {
      return personalYearBreakdown(dob, year);
    } catch {
      return null;
    }
  }, [dob, year]);

  const cycle = useMemo(() => {
    if (!isValidDob(dob)) return null;
    try {
      return personalYearCycleAt(dob, new Date(year, 6, 1));
    } catch {
      return null;
    }
  }, [dob, year]);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="learn-py-dob" className="block text-sm text-ink-soft">
            Date of birth
          </label>
          <input
            id="learn-py-dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1 w-full max-w-xs rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="learn-py-year" className="block text-sm text-ink-soft">
            Calendar year
          </label>
          <input
            id="learn-py-year"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value) || year)}
            className="mt-1 w-28 rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
          />
        </div>
      </div>
      {steps ? (
        <div className="mt-4 space-y-2 text-sm leading-6 text-ink-soft">
          <p className="font-mono text-xs">
            {steps.month} + {steps.day} + {steps.year} = {steps.compound} →{" "}
            {steps.number}
          </p>
          <p>
            <span className="font-medium text-ink">Calendar Personal Year</span>{" "}
            → <span className="brand text-ink">{steps.number}</span>
            {cycle ? (
              <>
                {" "}
                · birthday cycle now:{" "}
                <span className="brand text-ink">{cycle.number}</span> (
                {formatCycleRange(cycle)})
              </>
            ) : null}
          </p>
          <p className="text-xs">
            Most software uses 1 Jan–31 Dec. Many practitioners start the year
            on the birthday (School A: this calendar year’s number activates on
            that birthday). Reflective pacing only—not a forecast.
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-soft">
          Enter DOB and a year to see Personal Year math.
        </p>
      )}
    </div>
  );
}
