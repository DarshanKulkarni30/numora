"use client";

import type { CoupleReport } from "@/lib/numerology/coupleReport";
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

export function CoupleScorePanel({ report }: Props) {
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

      <h3 className="mt-6 text-lg text-ink">Year overlay</h3>
      <p className="mt-1 text-xs text-ink-soft">
        Next twelve months of Personal Year beside each other — weather, not a
        forecast of the relationship.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {report.months.map((m) => (
          <div
            key={`${m.calendarYear}-${m.calendarMonth}`}
            className={`rounded-xl border px-3 py-2 text-sm ${
              m.isCurrent
                ? "border-gold/50 bg-gold/10"
                : "border-[var(--line)] bg-white/55"
            }`}
          >
            <p className="text-xs text-ink-soft">{m.label}</p>
            <p className="mt-1 text-ink">
              {m.aYear} · {m.bYear}
            </p>
            <p className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] ${TONE_COLOR[m.tone]}`}>
              {m.tone}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-ink-soft">{report.disclaimer}</p>
    </div>
  );
}
