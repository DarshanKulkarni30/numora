"use client";

import { useMemo, useState } from "react";
import type { GrowthArea } from "@/lib/numerology/growthAreas";
import { CORE_TRAIT } from "@/lib/numerology/meanings";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";

type Props = {
  areas: GrowthArea[];
  growthMode?: boolean;
  personalYear?: string;
  personalMonth?: string;
  lifePath?: string;
};

const SEGMENT_STYLE = [
  { stroke: "rgb(56 120 170)", fill: "rgb(56 120 170 / 0.12)", glyph: "○○" },
  { stroke: "rgb(45 122 120)", fill: "rgb(45 122 120 / 0.12)", glyph: "∿" },
  { stroke: "rgb(79 70 150)", fill: "rgb(79 70 150 / 0.12)", glyph: "◉" },
  { stroke: "rgb(45 122 90)", fill: "rgb(45 122 90 / 0.12)", glyph: "♡" },
  { stroke: "rgb(180 100 50)", fill: "rgb(180 100 50 / 0.12)", glyph: "✎" },
  { stroke: "rgb(120 90 60)", fill: "rgb(120 90 60 / 0.12)", glyph: "⟷" },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
) {
  const p0 = polar(cx, cy, r1, a0);
  const p1 = polar(cx, cy, r1, a1);
  const p2 = polar(cx, cy, r0, a1);
  const p3 = polar(cx, cy, r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M ${p0.x} ${p0.y}`,
    `A ${r1} ${r1} 0 ${large} 1 ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${r0} ${r0} 0 ${large} 0 ${p3.x} ${p3.y}`,
    "Z",
  ].join(" ");
}

export function GrowthAreasPanel({
  areas,
  growthMode = true,
  personalYear,
  personalMonth,
  lifePath,
}: Props) {
  const catalysts = areas.slice(0, 6);
  const [focus, setFocus] = useState<number | null>(0);
  const active = focus != null ? catalysts[focus] : null;

  const yearN = personalYear
    ? reduceToSingleDigit(Number(personalYear))
    : null;
  const monthN = personalMonth
    ? reduceToSingleDigit(Number(personalMonth))
    : null;
  const seasonTrait =
    yearN != null ? CORE_TRAIT[yearN]?.toLowerCase() ?? `tone ${yearN}` : null;

  const narrative = useMemo(() => {
    if (!catalysts.length) return "";
    const titles = catalysts
      .slice(0, 3)
      .map((c) => c.title.replace(/^Develop\s+/i, "").toLowerCase());
    const lp = lifePath ? `Life Path ${lifePath}` : "your long path";
    return `Your growth path blends ${titles.join(", ")}${
      titles.length ? " with" : ""
    } the balance of ${lp}. Creative delivery and daily-vs-long-path alignment shape how you evolve across seasons.`;
  }, [catalysts, lifePath]);

  if (!areas.length) return null;

  const n = Math.max(catalysts.length, 1);
  const sweep = 360 / n;
  const gap = 3;

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        {growthMode
          ? "Catalyst Pathway Map — Lo Shu catalysts and cross-chart themes as a practice roadmap."
          : "Themes that showed up across more than one part of this reading."}
      </p>

      {growthMode ? (
        <>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
            <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
              <svg
                viewBox="0 0 220 220"
                className="mx-auto h-auto w-full max-w-sm"
                role="img"
                aria-label="Six-catalyst growth wheel"
              >
                {catalysts.map((c, i) => {
                  const style = SEGMENT_STYLE[i % SEGMENT_STYLE.length];
                  const a0 = i * sweep + gap / 2;
                  const a1 = (i + 1) * sweep - gap / 2;
                  const mid = (a0 + a1) / 2;
                  const icon = polar(110, 110, 72, mid);
                  const lit = focus == null || focus === i;
                  return (
                    <g key={c.id} opacity={lit ? 1 : 0.28}>
                      <path
                        d={wedgePath(110, 110, 38, 92, a0, a1)}
                        fill={style.fill}
                        stroke={style.stroke}
                        strokeWidth={focus === i ? 2 : 1}
                        className="cursor-pointer transition"
                        onClick={() =>
                          setFocus((cur) => (cur === i ? null : i))
                        }
                        onMouseEnter={() => setFocus(i)}
                      />
                      <text
                        x={icon.x}
                        y={icon.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="11"
                        fill={style.stroke}
                        style={{ pointerEvents: "none" }}
                      >
                        {style.glyph}
                      </text>
                    </g>
                  );
                })}
                <circle
                  cx="110"
                  cy="110"
                  r="32"
                  fill="rgb(250 248 243)"
                  stroke="rgb(30 58 107)"
                  strokeWidth="1.4"
                  className="motion-safe:animate-pulse"
                />
                <text
                  x="110"
                  y="104"
                  textAnchor="middle"
                  fontSize="7"
                  fill="rgb(70 82 98)"
                >
                  Season
                </text>
                <text
                  x="110"
                  y="118"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill="rgb(30 58 107)"
                >
                  {yearN ?? "—"}
                </text>
              </svg>
              {seasonTrait ? (
                <p className="mt-1 text-center text-xs text-ink-soft">
                  Personal Year {yearN} · {seasonTrait}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              {catalysts.map((c, i) => {
                const style = SEGMENT_STYLE[i % SEGMENT_STYLE.length];
                const practice = c.actions?.[0];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFocus(i)}
                    className={`btn-tactile w-full rounded-xl border px-3 py-3 text-left ${
                      focus === i
                        ? "border-ink bg-white shadow-sm"
                        : "border-[var(--line)] bg-white/55 hover:border-gold/50"
                    }`}
                  >
                    <div
                      className="mb-2 h-1 w-12 rounded-full"
                      style={{ background: style.stroke }}
                    />
                    <div className="flex items-start gap-2">
                      <span className="text-base" aria-hidden>
                        {style.glyph}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{c.title}</p>
                        <p className="mt-1 text-xs leading-5 text-ink-soft">
                          {c.suggestion}
                        </p>
                        {practice ? (
                          <p className="mt-1.5 text-xs text-ink">
                            Practice: {practice}
                          </p>
                        ) : null}
                        {c.sources.length ? (
                          <p className="mt-1 text-[10px] text-ink-soft/80">
                            Seen in: {c.sources.join(" · ")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {active && focus != null ? (
            <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3 text-sm leading-6 text-ink">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                Focus · Catalyst {focus + 1}
              </p>
              <p className="mt-1 font-medium">{active.title}</p>
              <p className="mt-1 text-ink-soft">{active.suggestion}</p>
            </div>
          ) : null}

          {yearN != null && monthN != null ? (
            <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                Seasonal Growth Meter
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-ink-soft">Personal Year</p>
                  <p className="brand text-2xl text-ink">{yearN}</p>
                  <p className="text-[11px] text-ink-soft">
                    {CORE_TRAIT[yearN] ?? "Season tone"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Personal Month</p>
                  <p className="brand text-2xl text-ink">{monthN}</p>
                  <p className="text-[11px] text-ink-soft">
                    {CORE_TRAIT[monthN] ?? "Month tone"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-soft">Combined feel</p>
                  <p className="mt-1 text-sm leading-5 text-ink">
                    {yearN === monthN
                      ? "Year and month rhyme — lean into that tone."
                      : `${CORE_TRAIT[yearN]?.split("&")[0]?.trim() ?? yearN} season with ${CORE_TRAIT[monthN]?.split("&")[0]?.trim()?.toLowerCase() ?? monthN} pacing.`}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full bg-sea/70"
                  style={{ width: `${(yearN / 9) * 100}%` }}
                  title={`Year ${yearN}`}
                />
                <div
                  className="h-full bg-gold/70"
                  style={{ width: `${(monthN / 9) * 50}%` }}
                  title={`Month ${monthN}`}
                />
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-white to-mist/50 px-4 py-4 text-sm leading-7 text-ink">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Growth Narrative
            </p>
            <p className="mt-2">{narrative}</p>
            <p className="mt-2 text-xs text-ink-soft">
              Reflective practice of the month: pick one catalyst card and run
              its first micro-practice for seven days.
            </p>
          </div>
        </>
      ) : (
        <ol className="mt-4 space-y-0 overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70">
          {areas.map((a, i) => (
            <li
              key={a.id}
              className="border-b border-[var(--line)] px-4 py-4 last:border-0"
            >
              <div className="flex gap-3">
                <span className="brand text-lg text-gold-deep tabular-nums">
                  {i + 1}.
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-ink">{a.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-ink-soft">
                    {a.suggestion}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
