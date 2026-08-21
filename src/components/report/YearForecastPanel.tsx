"use client";

import { useMemo } from "react";
import {
  buildYearForecast,
  type YearForecast,
} from "@/lib/numerology/yearForecast";
import { isValidDob } from "@/lib/profile/date";

type Props = {
  dateOfBirth: string;
  asOf?: Date;
};

export function YearForecastPanel({ dateOfBirth, asOf }: Props) {
  const forecast: YearForecast | null = useMemo(() => {
    if (!isValidDob(dateOfBirth)) return null;
    return buildYearForecast(dateOfBirth, asOf ?? new Date());
  }, [dateOfBirth, asOf]);

  if (!forecast) return null;

  return (
    <div>
      <h2 className="text-xl text-ink">Twelve-month chapter</h2>
      <p className="mt-2 text-sm leading-7 text-ink-soft">{forecast.yearSummary}</p>
      <p className="mt-1 text-xs text-ink-soft">From {forecast.asOfLabel}</p>

      <ol className="mt-5 space-y-3">
        {forecast.months.map((m) => (
          <li
            key={`${m.calendarYear}-${m.calendarMonth}`}
            className={`rounded-2xl border px-4 py-3 ${
              m.isCurrent
                ? "border-gold/50 bg-gold/10"
                : "border-[var(--line)] bg-white/55"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium text-ink">
                {m.label}
                {m.isCurrent ? " · now" : ""}
              </p>
              <p className="text-xs text-ink-soft">
                Year {m.personalYear} · Month {m.personalMonth}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{m.summary}</p>
            <p className="mt-1 text-sm text-ink">{m.practice}</p>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs leading-5 text-ink-soft">{forecast.disclaimer}</p>
    </div>
  );
}
