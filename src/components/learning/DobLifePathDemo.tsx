"use client";

import { useMemo, useState } from "react";
import { lifePathFromDob } from "@/lib/numerology/dateNumbers";
import { parseDob, reduceNumber } from "@/lib/numerology/reduce";
import { isValidDob } from "@/lib/profile/date";

export function DobLifePathDemo() {
  const [dob, setDob] = useState("");

  const steps = useMemo(() => {
    if (!isValidDob(dob)) return null;
    const { day, month, year } = parseDob(dob);
    const d = reduceNumber(day);
    const m = reduceNumber(month);
    const y = reduceNumber(year);
    const lifePath = lifePathFromDob(dob);
    const birthDay = reduceNumber(day);
    return { day, month, year, d, m, y, lifePath, birthDay };
  }, [dob]);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <label htmlFor="learn-dob-lp" className="block text-sm text-ink-soft">
        Date of birth
      </label>
      <input
        id="learn-dob-lp"
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="mt-1 w-full max-w-xs rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
      />
      {steps ? (
        <div className="mt-4 space-y-3 text-sm leading-6 text-ink-soft">
          <p>
            Reduce day, month, and year separately (masters 11 / 22 / 33 may be
            kept):
          </p>
          <p className="font-mono text-xs">
            day {steps.day} → {steps.d} · month {steps.month} → {steps.m} · year{" "}
            {steps.year} → {steps.y}
          </p>
          <p>
            <span className="font-medium text-ink">Life Path</span> = {steps.d}{" "}
            + {steps.m} + {steps.y} →{" "}
            <span className="brand text-ink">{steps.lifePath}</span>
          </p>
          <p>
            <span className="font-medium text-ink">Birth Day</span> = day reduced
            → <span className="brand text-ink">{steps.birthDay}</span>
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-soft">
          Pick a date to see Life Path and Birth Day steps.
        </p>
      )}
    </div>
  );
}
