"use client";

import { useState } from "react";
import type { CoupleMonth, CoupleReport } from "@/lib/numerology/coupleReport";
import type { CompatTone } from "@/lib/numerology/compatibility";

const TONE_COLOR: Record<CompatTone, string> = {
  Amazing: "bg-emerald-100 text-emerald-950 border-emerald-300",
  Favourable: "bg-teal-50 text-teal-900 border-teal-200",
  Neutral: "bg-slate-50 text-slate-800 border-slate-200",
  Challenging: "bg-amber-50 text-amber-950 border-amber-200",
};

type Props = {
  report: CoupleReport;
};

function MonthGrid({
  months,
  showMonthDigits,
}: {
  months: CoupleMonth[];
  showMonthDigits?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {months.map((m) => (
        <div
          key={`${m.calendarYear}-${m.calendarMonth}`}
          className={`rounded-xl border px-3 py-2 text-sm ${
            m.isCurrent
              ? "border-gold/50 bg-gold/10"
              : "border-[var(--line)] bg-white/55"
          }`}
          title={m.note}
        >
          <p className="text-xs text-ink-soft">{m.label}</p>
          <p className="mt-1 text-ink">
            {showMonthDigits
              ? `Month ${m.aMonth} · ${m.bMonth}`
              : `Year ${m.aYear} · ${m.bYear}`}
          </p>
          <p
            className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] ${TONE_COLOR[m.tone]}`}
          >
            {m.tone}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CoupleScorePanel({ report }: Props) {
  const [openYear, setOpenYear] = useState<number | null>(
    report.years[0]?.calendarYear ?? null,
  );
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5">
      <p className="text-sm uppercase tracking-[0.18em] text-gold-deep">
        Relationship report
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="brand text-2xl text-ink">
            {report.a.label} × {report.b.label}
          </h2>
          <p className="mt-1 text-ink">{report.headline}</p>
        </div>
        <p className="brand text-4xl text-ink">
          {report.score}
          <span className="text-lg text-ink-soft"> / 100</span>
        </p>
      </div>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{report.summary}</p>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {report.axes.map((x) => (
          <li
            key={x.key}
            className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-ink">{x.label}</p>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs ${TONE_COLOR[x.tone]}`}
              >
                {x.tone}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              {x.a} × {x.b} · weight {x.weight}%
            </p>
          </li>
        ))}
      </ul>

      <h3 className="mt-6 text-lg text-ink">This year, month by month</h3>
      <p className="mt-1 text-xs text-ink-soft">
        Next twelve months. Each card is that person’s Personal Year that month
        — pacing, not a forecast of the relationship.
      </p>
      <div className="mt-3">
        <MonthGrid months={report.months} />
      </div>

      <h3 className="mt-8 text-lg text-ink">Next 10 years</h3>
      <p className="mt-1 text-xs text-ink-soft">
        Open a year to see that year’s job, then every month in it. Pacing, not
        events.
      </p>
      <div className="mt-3 space-y-2">
        {report.years.map((y) => {
          const open = openYear === y.calendarYear;
          return (
            <div
              key={y.calendarYear}
              className={`rounded-xl border ${
                y.isCurrent
                  ? "border-gold/50 bg-gold/10"
                  : "border-[var(--line)] bg-white/55"
              }`}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() =>
                  setOpenYear(open ? null : y.calendarYear)
                }
                className="btn-tactile flex w-full flex-wrap items-center justify-between gap-2 px-3 py-3 text-left"
              >
                <span className="font-medium text-ink">
                  {y.calendarYear}
                  {y.isCurrent ? " · now" : ""}
                </span>
                <span className="text-sm text-ink">
                  {report.a.label} {y.aYear} · {report.b.label} {y.bYear}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] ${TONE_COLOR[y.tone]}`}
                >
                  {y.tone}
                </span>
              </button>
              {open ? (
                <div className="border-t border-[var(--line)] px-3 py-3">
                  <p className="text-sm leading-6 text-ink">{y.note}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-wider text-ink-soft">
                    Months in {y.calendarYear}
                  </p>
                  <div className="mt-2">
                    <MonthGrid months={y.months} showMonthDigits />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-ink-soft">{report.disclaimer}</p>
    </div>
  );
}
