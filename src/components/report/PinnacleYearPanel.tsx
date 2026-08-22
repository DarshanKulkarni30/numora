"use client";

import { useMemo, useState } from "react";
import { LayeredNote } from "@/components/report/LayeredNote";
import {
  buildPinnacleYearModel,
  type PinnacleInsight,
} from "@/lib/numerology/pinnacleYear";
import type { PinnacleId } from "@/lib/numerology/pinnacles";
import { parseDob } from "@/lib/numerology/reduce";

function yearAtAge(dob: string, age: number): number | null {
  try {
    const { year } = parseDob(dob);
    if (!year) return null;
    return year + age;
  } catch {
    return null;
  }
}

type Props = {
  dateOfBirth: string;
  lifePath: string;
  personalYear: string;
  expression: string;
};

const TERRACE: Record<
  PinnacleId,
  { d: string; labelX: number; labelY: number }
> = {
  4: { d: "M70 58 L170 58 L188 98 L52 98 Z", labelX: 120, labelY: 82 },
  3: { d: "M52 100 L188 100 L206 148 L34 148 Z", labelX: 120, labelY: 128 },
  2: { d: "M34 150 L206 150 L222 198 L18 198 Z", labelX: 120, labelY: 178 },
  1: { d: "M18 200 L222 200 L236 252 L4 252 Z", labelX: 120, labelY: 230 },
};

function SynergyChip({
  label,
  kind,
}: {
  label: string;
  kind: PinnacleInsight["synergies"][number]["kind"];
}) {
  const tone =
    kind === "aligned"
      ? "border-emerald-300 bg-emerald-50 text-emerald-900"
      : kind === "complementary"
        ? "border-sky-300 bg-sky-50 text-sky-900"
        : "border-amber-300 bg-amber-50 text-amber-950";
  const meaning =
    kind === "aligned"
      ? "same number, so this doubles up"
      : kind === "complementary"
        ? "different numbers that work together"
        : kind === "neutral"
          ? "unrelated, neither helps nor blocks"
          : "pull opposite ways, give each its own task";
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] ${tone}`}
      title={`${label} — ${meaning}`}
    >
      {label}
      <span className="text-ink-soft"> · {meaning}</span>
    </span>
  );
}

export function PinnacleYearPanel({
  dateOfBirth,
  lifePath,
  personalYear,
  expression,
}: Props) {
  const model = useMemo(
    () =>
      buildPinnacleYearModel({
        dob: dateOfBirth,
        lifePath,
        personalYear,
        expression,
      }),
    [dateOfBirth, lifePath, personalYear, expression],
  );
  const [selectedId, setSelectedId] = useState<PinnacleId>(model.current.pinnacle.id);
  const selected =
    model.chapters.find((c) => c.pinnacle.id === selectedId) ?? model.current;
  const currentId = model.current.pinnacle.id;
  const maxAge = Math.max(
    model.age,
    ...model.chapters.map((c) => c.pinnacle.ageEnd ?? c.pinnacle.ageStart + 18),
  );
  const markerPct = Math.min(96, Math.max(4, (model.age / Math.max(1, maxAge)) * 100));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg text-ink">Your life in four chapters</h3>
        <p className="mt-1 max-w-[70ch] text-sm leading-6 text-ink-soft">
          Your birth date splits into four age ranges, each with its own number
          and its own thing to work on. The one highlighted is where you are
          now. Tap any chapter to see what it asks for, how it tends to show up,
          and one thing to try. These describe pacing and emphasis, not events.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-3">
          <svg
            viewBox="0 0 240 268"
            className="h-auto w-full"
            role="img"
            aria-label={`Your four life chapters by age. You are currently in chapter ${currentId}, number ${model.current.pinnacle.number}, ${model.current.ageLabel}.`}
          >
            <defs>
              <linearGradient id="pin-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e4edf8" />
                <stop offset="100%" stopColor="#f4f7fc" />
              </linearGradient>
            </defs>
            <rect width="240" height="268" rx="16" fill="url(#pin-sky)" />
            <polygon
              points="120,18 148,58 92,58"
              fill={selected.palette.to}
              stroke={selected.palette.from}
              strokeWidth="1.2"
            />
            <text
              x="120"
              y="36"
              textAnchor="middle"
              className="fill-[var(--ink-soft)]"
              style={{ fontSize: 11 }}
            >
              {selected.planet.symbol} {selected.season.glyph}
            </text>
            <text
              x="120"
              y="52"
              textAnchor="middle"
              className="fill-[var(--ink)]"
              style={{ fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif" }}
            >
              {selected.pinnacle.number}
            </text>
            {([4, 3, 2, 1] as PinnacleId[]).map((id) => {
              const chapter = model.chapters.find((c) => c.pinnacle.id === id)!;
              const active = selectedId === id;
              const isNow = currentId === id;
              const t = TERRACE[id];
              return (
                <g key={id}>
                  <path
                    d={t.d}
                    fill={chapter.palette.to}
                    stroke={chapter.palette.from}
                    strokeWidth={active ? 2.2 : 1}
                    opacity={active ? 1 : 0.72}
                    className={`cursor-pointer ${isNow ? "pinnacle-terrace-now" : ""}`}
                    tabIndex={0}
                    role="button"
                    aria-label={`Life chapter ${id}, ${chapter.ageLabel}, number ${chapter.pinnacle.number}: ${chapter.coreTone}`}
                    onClick={() => setSelectedId(id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(id);
                      }
                    }}
                  />
                  <text
                    x={t.labelX}
                    y={t.labelY}
                    textAnchor="middle"
                    className="fill-[var(--ink)]"
                    style={{ fontSize: 10, fontWeight: 600 }}
                  >
                    {chapter.ageLabel} · {chapter.pinnacle.number}{" "}
                    {chapter.title}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="mt-2 grid grid-cols-4 gap-1">
            {model.chapters.map((ch) => (
              <button
                key={ch.pinnacle.id}
                type="button"
                aria-pressed={selectedId === ch.pinnacle.id}
                aria-label={`Life chapter ${ch.pinnacle.id}, ${ch.ageLabel}, number ${ch.pinnacle.number}: ${ch.coreTone}`}
                title={`${ch.ageLabel} — ${ch.coreTone}`}
                onClick={() => setSelectedId(ch.pinnacle.id)}
                className={`btn-tactile rounded-lg border px-1 py-1.5 text-[10px] leading-tight ${
                  selectedId === ch.pinnacle.id
                    ? "border-gold bg-white text-ink ring-2 ring-gold/40"
                    : "border-[var(--line)] bg-white/80 text-ink-soft"
                }`}
              >
                {ch.ageLabel}
                {ch.pinnacle.id === currentId ? " · now" : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="brand text-2xl text-ink">
            {selected.pinnacle.number} {selected.title}
          </p>
          <p className="text-sm text-ink-soft">
            Chapter {selected.pinnacle.id} · {selected.ageLabel}
            {yearAtAge(dateOfBirth, selected.pinnacle.ageStart) != null
              ? ` · from about ${yearAtAge(dateOfBirth, selected.pinnacle.ageStart)}`
              : ""}
            {/* The chapter runs through the whole of ageEnd, so it closes on the
                birthday after it — the same year the next chapter's tick shows. */}
            {selected.pinnacle.ageEnd != null &&
            yearAtAge(dateOfBirth, selected.pinnacle.ageEnd + 1) != null
              ? ` to ${yearAtAge(dateOfBirth, selected.pinnacle.ageEnd + 1)}`
              : ""}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-mist/70 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                In simple words
              </p>
              <p className="mt-1 text-sm leading-6 text-ink">{selected.coreTone}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                What this can look like
              </p>
              <ul className="mt-1 space-y-1 text-sm leading-6 text-ink">
                {selected.manifestation.map((line) => (
                  <li key={line}>· {line}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                Something you can try
              </p>
              <p className="pinnacle-practice mt-1 text-sm font-medium leading-6 text-ink">
                {selected.practiceCue}
              </p>
            </div>
          </div>
          <p className="text-sm italic leading-6 text-ink">{selected.narrative}</p>
          <LayeredNote student={selected.student} expert={selected.expert} />
          <div className="flex flex-wrap items-center gap-2">
            {selected.keywords.map((k, i) => (
              <span
                key={k}
                className="h-6 rounded-full border border-[var(--line)] px-2 text-[11px] leading-6 text-ink"
                style={{
                  background:
                    i === 0
                      ? selected.palette.from
                      : i === 1
                        ? selected.palette.to
                        : "white",
                  color: i === 0 ? "#fff" : selected.palette.ink,
                }}
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Timeline · age {model.age}
        </p>
        <div className="relative mt-2 h-3 rounded-full bg-mist">
          {model.chapters.map((ch) => {
            const start = (ch.pinnacle.ageStart / Math.max(1, maxAge)) * 100;
            const end =
              ((ch.pinnacle.ageEnd ?? maxAge) / Math.max(1, maxAge)) * 100;
            return (
              <button
                key={ch.pinnacle.id}
                type="button"
                aria-label={`${ch.ageLabel}`}
                onClick={() => setSelectedId(ch.pinnacle.id)}
                className="absolute top-0 h-3 rounded-full"
                style={{
                  left: `${start}%`,
                  width: `${Math.max(4, end - start)}%`,
                  background: ch.palette.from,
                  opacity: selectedId === ch.pinnacle.id ? 1 : 0.45,
                }}
                title={ch.ageLabel}
              />
            );
          })}
          <span
            className="absolute -top-1 h-5 w-1 rounded-full bg-ink"
            style={{ left: `${markerPct}%` }}
            title={`Age ${model.age}`}
          />
        </div>
        <div className="relative mt-1.5 h-8 text-[10px] text-ink-soft">
          {model.chapters.map((ch) => {
            const start = (ch.pinnacle.ageStart / Math.max(1, maxAge)) * 100;
            const y = yearAtAge(dateOfBirth, ch.pinnacle.ageStart);
            return (
              <span
                key={ch.pinnacle.id}
                className="absolute top-0 max-w-[28%] leading-3"
                style={{ left: `${start}%` }}
                title={
                  y
                    ? `P${ch.pinnacle.id} starts about age ${ch.pinnacle.ageStart} (${y})`
                    : ch.ageLabel
                }
              >
                {ch.pinnacle.ageStart}
                {y ? ` · ${y}` : ""}
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Synergy strip
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.synergies.map((s) => (
            <SynergyChip key={s.label} label={s.label} kind={s.kind} />
          ))}
        </div>
      </div>
    </div>
  );
}
