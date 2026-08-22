"use client";

import { useMemo, useState } from "react";
import { personalYearForCalendarYear } from "@/lib/numerology/cycles";
import { PY_NATURE, pyNatureMeta } from "@/lib/numerology/personalYearOutlook";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import type { PublicFigureRow, ResearchEvent } from "@/lib/research/publicFigures";

const PIN_COLOR: Record<number, string> = {
  1: "#E8A317",
  2: "#7EB8D4",
  3: "#E07A3A",
  4: "#3F3D8A",
};

const EVENT_TONE: Record<string, string> = {
  marriage: "bg-rose-100 text-rose-950 border-rose-300",
  union_ended: "bg-amber-100 text-amber-950 border-amber-300",
  award: "bg-gold/20 text-ink border-gold/50",
  office_start: "bg-sky-100 text-sky-950 border-sky-300",
};

function birthYear(iso: string): number {
  return Number(iso.slice(0, 4));
}

function yearAtAge(iso: string, age: number): number {
  return birthYear(iso) + age;
}

function eventDot(type: string): string {
  if (type === "marriage") return "bg-rose-500";
  if (type === "union_ended") return "bg-amber-500";
  if (type === "office_start") return "bg-sky-600";
  return "bg-gold-deep";
}

/** 11/22/33 keep their face but read as the reduced digit, as on /years. */
function pyLabel(n: number): string {
  const digit = reduceToSingleDigit(n);
  return digit === n ? String(n) : `${n} (reads as ${digit})`;
}

function PyDefinition({ number }: { number: number }) {
  const meta = pyNatureMeta(number);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3">
      <p className="text-sm text-ink">
        <span className="brand text-lg">Personal Year {pyLabel(number)}</span>{" "}
        · {meta.nature}
      </p>
      <p className="mt-1 text-sm text-ink-soft">{meta.short}</p>
      <p className="mt-1 text-sm text-ink-soft">{meta.typical}</p>
      {meta.later ? (
        <p className="mt-1 text-sm text-ink-soft">{meta.later}</p>
      ) : null}
      <p className="mt-2 text-sm text-ink">Practice: {meta.practice}</p>
    </div>
  );
}

export function FigureLifePanel({
  figure,
  onClose,
}: {
  figure: PublicFigureRow;
  onClose: () => void;
}) {
  const [focusYear, setFocusYear] = useState<number | null>(null);
  const [showKey, setShowKey] = useState(false);
  const start = birthYear(figure.dobIso);
  const end = figure.deathIso
    ? Number(figure.deathIso.slice(0, 4))
    : new Date().getFullYear();

  const years = useMemo(() => {
    const out: { year: number; py: number; events: ResearchEvent[] }[] = [];
    for (let y = start; y <= end; y++) {
      out.push({
        year: y,
        py: personalYearForCalendarYear(figure.dob, y),
        events: figure.events.filter((e) => e.year === y),
      });
    }
    return out;
  }, [end, figure.dob, figure.events, start]);

  const maxAge = Math.max(
    end - start,
    ...figure.pinnacles.map((p) => p.ageEnd ?? p.ageStart + 18),
    1,
  );

  const focusedEvents = (
    focusYear
      ? figure.events.filter((e) => e.year === focusYear)
      : figure.events
  )
    .slice()
    .sort((a, b) => a.year - b.year || (a.month ?? 13) - (b.month ?? 13));

  return (
    <section className="rounded-2xl border border-ink/20 bg-white px-4 py-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            {figure.field} · {figure.country}
          </p>
          <h2 className="brand mt-1 text-3xl text-ink">{figure.name}</h2>
          <p className="mt-1 text-sm text-ink">
            Born {figure.dob}
            {figure.deathIso ? ` · died ${figure.deathIso}` : ""}
            {" · "}Life Path {figure.lifePath} · Psychic {figure.psychic} ·
            Destiny {figure.destiny}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn-tactile rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink"
        >
          Back to list
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg text-ink">Pinnacle chapters</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Four life chapters from the birth date. Dots are Wikidata events that
          fall in that chapter.
        </p>
        <div className="relative mt-4 h-3 rounded-full bg-mist">
          {figure.pinnacles.map((ch) => {
            const left = (ch.ageStart / maxAge) * 100;
            const right = ((ch.ageEnd ?? maxAge) / maxAge) * 100;
            return (
              <div
                key={ch.id}
                className="absolute top-0 h-3 rounded-full"
                style={{
                  left: `${left}%`,
                  width: `${Math.max(4, right - left)}%`,
                  background: PIN_COLOR[ch.id] ?? "#94a3b8",
                }}
                title={`P${ch.id} · ${ch.number} · ages ${ch.ageStart}${ch.ageEnd != null ? `–${ch.ageEnd}` : "+"}`}
              />
            );
          })}
          {figure.events.map((e, i) => {
            const age = e.year - start;
            const left = Math.min(96, Math.max(1, (age / maxAge) * 100));
            return (
              <button
                key={`${e.type}-${e.year}-${e.label}-${i}`}
                type="button"
                onClick={() => setFocusYear(e.year)}
                className={`absolute -top-1 h-5 w-2.5 rounded-full border border-white ${eventDot(e.type)}`}
                style={{ left: `${left}%` }}
                title={`${e.year} ${e.label} · PY ${e.personalYear} · P${e.pinnacleId}`}
              />
            );
          })}
        </div>
        <div className="relative mt-2 h-10 text-[10px] text-ink-soft">
          {figure.pinnacles.map((ch) => {
            const left = (ch.ageStart / maxAge) * 100;
            return (
              <span
                key={ch.id}
                className="absolute top-0 max-w-[28%] leading-3"
                style={{ left: `${left}%` }}
              >
                P{ch.id} · {ch.number}
                <span className="mt-0.5 block">
                  {ch.ageStart}
                  {ch.ageEnd != null ? `–${ch.ageEnd}` : "+"} · ~
                  {yearAtAge(figure.dobIso, ch.ageStart)}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg text-ink">Personal Year by calendar year</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Number in each cell is that year’s Personal Year (month + day + that
          year). A mark means a Wikidata event in that calendar year. Click a
          marked year to list the events.
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {years.map((row) => {
            const marked = row.events.length > 0;
            const on = focusYear === row.year;
            return (
              <button
                key={row.year}
                type="button"
                disabled={!marked}
                onClick={() => setFocusYear(on ? null : row.year)}
                className={`relative min-w-[3.4rem] rounded-lg border px-1.5 py-1 text-center text-[10px] ${
                  marked
                    ? `btn-tactile ${on ? "border-ink bg-ink text-paper" : "border-gold/50 bg-gold/10 text-ink"}`
                    : "cursor-default border-[var(--line)] bg-white/70 text-ink-soft"
                }`}
                title={
                  marked
                    ? `${row.year}: Personal Year ${pyLabel(row.py)} — ${pyNatureMeta(row.py).nature}. ${row.events.map((e) => e.label).join("; ")}`
                    : `${row.year}: Personal Year ${pyLabel(row.py)} — ${pyNatureMeta(row.py).nature}`
                }
              >
                <span className="block text-ink-soft/80">{row.year}</span>
                <span className="brand text-sm">{row.py}</span>
                {marked ? (
                  <span className="mt-0.5 flex justify-center gap-0.5">
                    {row.events.slice(0, 3).map((e, i) => (
                      <span
                        key={`${e.label}-${i}`}
                        className={`h-1.5 w-1.5 rounded-full ${eventDot(e.type)}`}
                      />
                    ))}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {focusYear ? (
          <div className="mt-3">
            <PyDefinition
              number={personalYearForCalendarYear(figure.dob, focusYear)}
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setShowKey((v) => !v)}
          aria-expanded={showKey}
          className="btn-tactile mt-3 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs text-ink"
        >
          {showKey ? "Hide" : "Show"} what each Personal Year number means
        </button>
        {showKey ? (
          <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
            {Object.entries(PY_NATURE).map(([digit, meta]) => (
              <li key={digit}>
                <span className="text-ink">
                  {digit} · {meta.nature}
                </span>{" "}
                — {meta.short}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-8">
        <h3 className="text-lg text-ink">
          {focusYear ? `Events in ${focusYear}` : "All dated events"}
        </h3>
        {focusYear ? (
          <button
            type="button"
            onClick={() => setFocusYear(null)}
            className="btn-tactile mt-1 text-xs text-gold-deep underline"
          >
            Show every event
          </button>
        ) : null}
        <ul className="mt-3 space-y-2">
          {focusedEvents.length ? (
            focusedEvents.map((e, i) => (
              <li
                key={`${e.type}-${e.year}-${e.label}-${i}`}
                className={`rounded-xl border px-3 py-2 text-sm ${EVENT_TONE[e.type] ?? "border-[var(--line)]"}`}
              >
                <p className="font-medium">
                  {e.year}
                  {e.month ? `/${String(e.month).padStart(2, "0")}` : ""} ·{" "}
                  {e.label}
                </p>
                <p className="mt-0.5 text-xs">
                  {e.type.replaceAll("_", " ")} · Personal Year{" "}
                  {pyLabel(e.personalYear)} (birthday cycle) · Pinnacle{" "}
                  {e.pinnacleId} ({e.pinnacleNumber})
                </p>
                <p className="mt-1 text-xs">
                  <span className="font-medium">
                    {pyNatureMeta(e.personalYear).nature}
                  </span>{" "}
                  — {pyNatureMeta(e.personalYear).short}
                </p>
              </li>
            ))
          ) : (
            <li className="text-sm text-ink-soft">No Wikidata events in this year.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
