"use client";

import { useMemo, useState } from "react";
import type { GrowthArea } from "@/lib/numerology/growthAreas";
import { CORE_TRAIT } from "@/lib/numerology/meanings";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { DIGIT_SEASON } from "@/lib/numerology/yearRhythm";

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

function wedgeLabel(title: string): string {
  return title
    .replace(/^Develop\s+/i, "")
    .replace(/\s+(catalyst|engine|balance|craft|awareness)$/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .join(" ");
}

export function GrowthAreasPanel({
  areas,
  growthMode = true,
  personalYear,
  personalMonth,
  lifePath,
}: Props) {
  const catalysts = areas.slice(0, 6);
  const [pin, setPin] = useState(0);
  const [peek, setPeek] = useState<number | null>(null);
  const shownIndex = peek ?? pin;
  const active = catalysts[shownIndex] ?? catalysts[0] ?? null;

  const yearN = personalYear
    ? reduceToSingleDigit(Number(personalYear))
    : null;
  const monthN = personalMonth
    ? reduceToSingleDigit(Number(personalMonth))
    : null;
  const yearSeason = yearN != null ? DIGIT_SEASON[yearN] : null;
  const monthSeason = monthN != null ? DIGIT_SEASON[monthN] : null;

  const narrative = useMemo(() => {
    if (!active) return "";
    const monthBit = monthSeason
      ? `This month’s ${monthSeason.verb} weather may be a useful window for ${active.title.toLowerCase()}. `
      : "";
    const lp = lifePath ? `Life Path ${lifePath}` : "the longer path";
    return `${monthBit}${active.suggestion} Treat it as one skill to practise alongside your Life Path ${lp}, not a judgement on how you are doing.`;
  }, [active, lifePath, monthSeason]);

  if (!areas.length) return null;

  const n = Math.max(catalysts.length, 1);
  const sweep = 360 / n;
  const gap = 3;
  const shownStyle = SEGMENT_STYLE[shownIndex % SEGMENT_STYLE.length];

  if (!growthMode) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-ink-soft">
          Themes that showed up across more than one part of this reading.
        </p>
        <ol className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70">
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
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        Catalyst Pathway Map — tap a wedge for one live practice. The wheel is
        a roadmap, not a score of what is missing.
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,1fr)] lg:items-stretch">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
          <svg
            viewBox="0 0 220 220"
            className="mx-auto h-auto w-full max-w-md"
            role="img"
            aria-label="Six-catalyst growth wheel"
          >
            {catalysts.map((c, i) => {
              const style = SEGMENT_STYLE[i % SEGMENT_STYLE.length];
              const a0 = i * sweep + gap / 2;
              const a1 = (i + 1) * sweep - gap / 2;
              const mid = (a0 + a1) / 2;
              const icon = polar(110, 110, 78, mid);
              const label = polar(110, 110, 62, mid);
              const isPin = pin === i;
              const isShown = shownIndex === i;
              return (
                <g key={c.id} opacity={isShown ? 1 : 0.38}>
                  <path
                    d={wedgePath(110, 110, 36, 96, a0, a1)}
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth={isPin ? 2.4 : isShown ? 1.6 : 1}
                    className="cursor-pointer"
                    onClick={() => setPin(i)}
                    onMouseEnter={() => setPeek(i)}
                    onMouseLeave={() => setPeek(null)}
                  />
                  <text
                    x={icon.x}
                    y={icon.y - 6}
                    textAnchor="middle"
                    fontSize="9"
                    fill={style.stroke}
                    style={{ pointerEvents: "none" }}
                  >
                    {style.glyph}
                  </text>
                  <text
                    x={label.x}
                    y={label.y + 8}
                    textAnchor="middle"
                    fontSize="6.2"
                    fill="rgb(28 35 48)"
                    style={{ pointerEvents: "none" }}
                  >
                    {wedgeLabel(c.title)}
                  </text>
                </g>
              );
            })}
            <circle
              cx="110"
              cy="110"
              r="30"
              fill="rgb(250 248 243)"
              stroke="rgb(30 58 107)"
              strokeWidth="1.4"
            />
            <text
              x="110"
              y="100"
              textAnchor="middle"
              fontSize="6"
              fill="rgb(70 82 98)"
            >
              {yearSeason ? yearSeason.verb : "Season"}
            </text>
            <text
              x="110"
              y="116"
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="rgb(30 58 107)"
            >
              {yearN ?? "—"}
            </text>
            <text
              x="110"
              y="128"
              textAnchor="middle"
              fontSize="5.5"
              fill="rgb(70 82 98)"
            >
              Personal Year
            </text>
          </svg>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {catalysts.map((c, i) => {
              const style = SEGMENT_STYLE[i % SEGMENT_STYLE.length];
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={pin === i}
                  onClick={() => setPin(i)}
                  onMouseEnter={() => setPeek(i)}
                  onMouseLeave={() => setPeek(null)}
                  className={`btn-tactile rounded-lg border px-2 py-1.5 text-left text-[11px] leading-4 ${
                    pin === i
                      ? "border-ink bg-white text-ink shadow-sm"
                      : "border-[var(--line)] bg-white/70 text-ink-soft"
                  }`}
                >
                  <span className="mr-1" style={{ color: style.stroke }}>
                    {style.glyph}
                  </span>
                  {wedgeLabel(c.title)}
                </button>
              );
            })}
          </div>
        </div>

        {active ? (
          <article
            className="flex flex-col rounded-xl border bg-white/70 px-4 py-4"
            style={{ borderColor: shownStyle.stroke }}
          >
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Live practice · Catalyst {shownIndex + 1}
            </p>
            <h3 className="mt-1 text-lg text-ink">{active.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {active.suggestion}
            </p>
            {active.actions?.[0] ? (
              <p className="mt-3 rounded-lg bg-mist/60 px-3 py-2 text-sm text-ink">
                <span className="font-medium">This week. </span>
                {active.actions[0]}
              </p>
            ) : (
              <p className="mt-3 rounded-lg bg-mist/60 px-3 py-2 text-sm text-ink">
                <span className="font-medium">This week. </span>
                Run one small version of this theme for seven days.
              </p>
            )}
            {active.sources.length ? (
              <p className="mt-auto pt-3 text-[11px] text-ink-soft">
                Seen in {active.sources.join(" · ")}
              </p>
            ) : null}
          </article>
        ) : null}
      </div>

      {yearN != null && monthN != null && yearSeason && monthSeason ? (
        <div className="grid gap-3 rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Climate · Personal Year
            </p>
            <p className="brand mt-1 text-2xl text-ink">
              {yearSeason.verb} {yearN}
            </p>
            <p className="text-[11px] text-ink-soft">
              {CORE_TRAIT[yearN] ?? "Season tone"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Weather · Personal Month
            </p>
            <p className="brand mt-1 text-2xl text-ink">
              {monthSeason.verb} {monthN}
            </p>
            <p className="text-[11px] text-ink-soft">
              {CORE_TRAIT[monthN] ?? "Month tone"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Mix
            </p>
            <p className="brand mt-1 text-lg text-ink">
              {yearSeason.verb} → {monthSeason.verb}
            </p>
            <p className="mt-1 text-sm leading-5 text-ink-soft">
              {yearN === monthN
                ? "Your year and month are the same number, so this month is the best time to make the year's main move."
                : `${CORE_TRAIT[yearN]?.split("&")[0]?.trim() ?? yearN} climate with ${CORE_TRAIT[monthN]?.split("&")[0]?.trim()?.toLowerCase() ?? monthN} pacing.`}
            </p>
          </div>
        </div>
      ) : null}

      {active ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-white to-mist/50 px-4 py-4 text-sm leading-7 text-ink">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Growth narrative
            </p>
            <p className="mt-2">{narrative}</p>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-4 text-sm leading-7 text-ink">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Seven-day cue
            </p>
            <p className="mt-2">
              Stay with <span className="font-medium">{active.title}</span>
              {monthSeason
                ? ` while this month’s ${monthSeason.verb} weather is in play.`
                : "."}{" "}
              One micro-practice, not a new identity.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
