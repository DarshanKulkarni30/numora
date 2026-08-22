"use client";

import { LayeredNote } from "@/components/report/LayeredNote";
import type { PythagoreanChart } from "@/lib/numerology/pythagoreanChart";

type Props = {
  chart: PythagoreanChart;
  compact?: boolean;
};

function AgeRange({ start, end }: { start: number; end: number | null }) {
  return (
    <span className="text-xs text-ink-soft">
      ages {start}–{end ?? "on"}
    </span>
  );
}

export function PythagoreanChartPanel({ chart, compact = false }: Props) {
  const currentChallenge = chart.challenges.find((c) => c.isCurrent);
  const currentPeriod = chart.periodCycles.find((p) => p.isCurrent);
  const passion = chart.hiddenPassion.numbers.join(" / ") || "—";
  const lessons =
    chart.karmicLessons.numbers.length > 0
      ? chart.karmicLessons.numbers.join(", ")
      : "None missing";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl text-ink">Pythagorean chart</h2>
        <p className="mt-1 text-sm text-ink-soft">{chart.methodNote}</p>
        <p className="mt-1 text-xs text-ink-soft">
          Birth-certificate spelling: {chart.nameUsed}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Balance", String(chart.balance.number || "—"), chart.balance.initials],
          ["Hidden Passion", passion, `${chart.hiddenPassion.numbers.length ? "most repeated letter-value" : "needs Latin letters"}`],
          ["Attitude", String(chart.attitude.number), "month + day"],
          ["Subconscious Self", String(chart.subconsciousSelf.number), `${chart.subconsciousSelf.present.length ? chart.subconsciousSelf.present.join(", ") : "needs Latin letters"}`],
          ["Personal Day", String(chart.personalDay.number), chart.personalDay.asOf],
          [
            "Essence",
            chart.essence.reduced
              ? `${chart.essence.compound}/${chart.essence.reduced}`
              : "—",
            chart.essence.transits.map((t) => t.letter).join(" · ") || "—",
          ],
        ].map(([label, value, note]) => (
          <div
            key={label}
            className="rounded-2xl border border-[var(--line)] bg-white/55 px-3 py-3"
          >
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              {label}
            </p>
            <p className="brand mt-1 text-2xl text-ink">{value}</p>
            <p className="mt-1 text-xs text-ink-soft">{note}</p>
          </div>
        ))}
      </div>

      <p className="text-sm leading-7 text-ink-soft">{chart.balance.summary}</p>
      <div>
        <p className="text-sm leading-7 text-ink-soft">
          {chart.hiddenPassion.summary} {chart.hiddenPassion.practice}
        </p>
        <LayeredNote
          student={chart.hiddenPassion.student}
          expert={chart.hiddenPassion.expert}
        />
      </div>
      <div>
        <p className="text-sm leading-7 text-ink-soft">
          {chart.personalDay.summary} {chart.personalDay.practice}
        </p>
        <LayeredNote
          student={chart.personalDay.student}
          expert={chart.personalDay.expert}
        />
      </div>
      <div>
        <p className="text-sm leading-7 text-ink-soft">
          {chart.attitude.summary} {chart.attitude.practice}
        </p>
        <LayeredNote
          student={chart.attitude.student}
          expert={chart.attitude.expert}
        />
      </div>
      <p className="text-sm leading-7 text-ink-soft">
        {chart.subconsciousSelf.summary} {chart.subconsciousSelf.practice}
      </p>
      <div>
        <p className="text-sm leading-7 text-ink-soft">{chart.essence.summary}</p>
        <p className="text-sm leading-7 text-ink-soft">{chart.essence.practice}</p>
        <LayeredNote
          student={chart.essence.student}
          expert={chart.essence.expert}
        />
      </div>

      <div>
        <h3 className="text-lg text-ink">Karmic Lessons (missing letters)</h3>
        <p className="mt-2 text-sm leading-7 text-ink-soft">
          {chart.karmicLessons.summary}
        </p>
        <LayeredNote
          student={chart.karmicLessons.student}
          expert={chart.karmicLessons.expert}
        />
        {chart.karmicLessons.items.length ? (
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {chart.karmicLessons.items.map((i) => (
              <li key={i.number}>
                <span className="font-medium text-ink">
                  {i.number}
                  {i.softened ? " · easier (also in main numbers)" : ""}
                </span>
                {" — "}
                {i.practice}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">{lessons}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg text-ink">Planes of Expression (name letters)</h3>
        <p className="mt-1 text-xs text-ink-soft">{chart.planeNote}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {chart.planes.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-[var(--line)] bg-white/55 px-3 py-3"
            >
              <p className="text-sm font-medium text-ink">
                {p.label}{" "}
                <span className="brand text-lg">
                  {p.letterCount ? `${p.compound}/${p.reduced}` : "—"}
                </span>
              </p>
              <p className="mt-1 text-xs leading-6 text-ink-soft">{p.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {!compact ? (
        <>
          <div>
            <h3 className="text-lg text-ink">Challenges</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Same age windows as Pinnacles. Current: Challenge{" "}
              {currentChallenge?.id ?? "—"} · {currentChallenge?.number ?? "—"}.
            </p>
            <ul className="mt-3 space-y-3">
              {chart.challenges.map((c) => (
                <li
                  key={c.id}
                  className={`rounded-2xl border px-4 py-3 ${
                    c.isCurrent
                      ? "border-gold/50 bg-gold/10"
                      : "border-[var(--line)] bg-white/55"
                  }`}
                >
                  <p className="text-ink">
                    Challenge {c.id} · {c.number} {c.title}{" "}
                    <AgeRange start={c.ageStart} end={c.ageEnd} />
                    {c.isCurrent ? " · now" : ""}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{c.practice}</p>
                  <LayeredNote student={c.student} expert={c.expert} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg text-ink">Period Cycles</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Formative (month), Productive (day), Harvest (year). Current:{" "}
              {currentPeriod?.label ?? "—"} {currentPeriod?.number ?? "—"}.
            </p>
            <ul className="mt-3 space-y-3">
              {chart.periodCycles.map((p) => (
                <li
                  key={p.id}
                  className={`rounded-2xl border px-4 py-3 ${
                    p.isCurrent
                      ? "border-gold/50 bg-gold/10"
                      : "border-[var(--line)] bg-white/55"
                  }`}
                >
                  <p className="text-ink">
                    {p.label} · {p.number} {p.title}{" "}
                    <AgeRange start={p.ageStart} end={p.ageEnd} />
                    {p.isCurrent ? " · now" : ""}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{p.practice}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3">
            <p className="text-sm font-medium text-ink">
              Current Challenge {currentChallenge?.id ?? "—"} ·{" "}
              {currentChallenge?.number ?? "—"}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {currentChallenge?.practice}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3">
            <p className="text-sm font-medium text-ink">
              {currentPeriod?.label} cycle · {currentPeriod?.number ?? "—"}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              {currentPeriod?.practice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
