"use client";

import { useMemo, useState } from "react";
import { CORE_TRAIT } from "@/lib/numerology/meanings";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import {
  buildStrengthConstellation,
  strengthWeightLabel,
  type StrengthNode,
} from "@/lib/numerology/strengthConstellation";

type Props = {
  strengths: string[];
  lifePath?: string;
  expression?: string;
  soulUrge?: string;
  vedicPsychic?: string;
};

const NODE_COLORS = [
  "rgb(45 122 120)",
  "rgb(30 58 107)",
  "rgb(180 100 50)",
  "rgb(79 70 150)",
  "rgb(45 122 90)",
];

function radiusFor(weight: StrengthNode["weight"]) {
  if (weight === "core") return 15;
  if (weight === "supporting") return 12;
  return 9;
}

export function StrengthsConstellation({
  strengths,
  lifePath,
  expression,
  soulUrge,
  vedicPsychic,
}: Props) {
  const model = useMemo(
    () =>
      buildStrengthConstellation({
        strengths,
        lifePath,
        expression,
        soulUrge,
        vedicPsychic,
      }),
    [strengths, lifePath, expression, soulUrge, vedicPsychic],
  );
  const [pin, setPin] = useState(model.defaultIndex);
  const [peek, setPeek] = useState<number | null>(null);
  const shownIndex = peek ?? pin;

  /** A click must win over a lingering hover, or the panel keeps the hovered slot. */
  const select = (i: number) => {
    setPin(i);
    setPeek(null);
  };
  const lp = lifePath ? reduceToSingleDigit(Number(lifePath)) : null;
  const centerTrait = lp != null ? CORE_TRAIT[lp] : "Dominant tone";

  const layout = useMemo(() => {
    const cx = 110;
    const cy = 110;
    const r = 78;
    return model.map.map((node, i) => {
      const ang =
        (-90 + (i * 360) / Math.max(model.map.length, 1)) * (Math.PI / 180);
      return {
        ...node,
        x: cx + Math.cos(ang) * r,
        y: cy + Math.sin(ang) * r,
        color: NODE_COLORS[i % NODE_COLORS.length],
      };
    });
  }, [model.map]);

  if (!model.map.length) return null;

  const active = layout[shownIndex] ?? layout[0]!;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Five gifts around Life Path {lifePath ?? "—"}. The number on a circle is
        only the slot (1–5), not a chart number. Larger circles sit closer to
        that Life Path. This is not a full list of who you are.
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,1fr)] lg:items-stretch">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
          <svg
            viewBox="0 0 220 220"
            className="mx-auto h-auto w-full max-w-md"
            role="img"
            aria-label="Weighted strength constellation"
          >
            {layout.map((n, i) => (
              <line
                key={`spoke-${n.title}-${i}`}
                x1="110"
                y1="110"
                x2={n.x}
                y2={n.y}
                stroke={
                  n.weight === "core"
                    ? "rgb(30 58 107 / 0.35)"
                    : "rgb(30 58 107 / 0.12)"
                }
                strokeWidth={n.weight === "core" ? 1.8 : 1}
              />
            ))}
            <circle
              cx="110"
              cy="110"
              r="28"
              fill="rgb(250 248 243)"
              stroke="rgb(30 58 107)"
              strokeWidth="1.4"
            />
            <text
              x="110"
              y="106"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="rgb(30 58 107)"
            >
              {lp ?? "·"}
            </text>
            <text
              x="110"
              y="120"
              textAnchor="middle"
              fontSize="6"
              fill="rgb(70 82 98)"
            >
              Life Path
            </text>
            {layout.map((n, i) => {
              const isPin = pin === i;
              const isShown = shownIndex === i;
              const r = radiusFor(n.weight) + (isPin ? 2 : 0);
              return (
                <g
                  key={n.title + i}
                  opacity={isShown ? 1 : 0.38}
                  className="cursor-pointer"
                  onClick={() => select(i)}
                  onMouseEnter={() => setPeek(i)}
                  onMouseLeave={() => setPeek(null)}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={r}
                    fill={n.color}
                    fillOpacity={n.weight === "stretch" ? 0.08 : 0.22}
                    stroke={n.color}
                    strokeWidth={n.weight === "core" ? 2 : 1.4}
                    strokeDasharray={n.weight === "stretch" ? "2.5 2" : undefined}
                  />
                  <text
                    x={n.x}
                    y={n.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="6"
                    fill="rgb(28 35 48)"
                    fontWeight="600"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-1 text-center text-xs text-ink-soft">
            Center · {centerTrait}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {layout.map((n, i) => (
              <button
                key={n.title + i}
                type="button"
                aria-pressed={pin === i}
                onClick={() => select(i)}
                onMouseEnter={() => setPeek(i)}
                onMouseLeave={() => setPeek(null)}
                className={`btn-tactile rounded-lg border px-2 py-1.5 text-left text-[11px] leading-4 ${
                  pin === i
                    ? "border-ink bg-white text-ink shadow-sm"
                    : "border-[var(--line)] bg-white/70 text-ink-soft"
                }`}
              >
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full align-middle"
                  style={{ background: n.color }}
                />
                {n.title}
              </button>
            ))}
          </div>
        </div>

        <article className="flex flex-col rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            {strengthWeightLabel(active.weight)}
          </p>
          <h3 className="mt-1 text-lg text-ink">{active.title}</h3>
          {active.detail ? (
            <p className="mt-2 text-sm leading-6 text-ink-soft">{active.detail}</p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-ink">{active.meaning}</p>
          <p className="mt-2 text-xs text-ink-soft">{active.sourceLine}</p>
          <p className="mt-auto pt-4 text-sm leading-6 text-ink">
            {active.tryLine} {active.watchLine}
          </p>
        </article>
      </div>

      {model.extra.length ? (
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Also on this chart
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            Quieter gifts that did not fit the five circles. Read the full
            phrase — they are not buttons.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {model.extra.map((n) => (
              <span
                key={n.label}
                title={`${n.label}. ${n.tryLine}`}
                className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs text-ink"
              >
                {n.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
