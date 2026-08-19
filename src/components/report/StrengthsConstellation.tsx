"use client";

import { useMemo, useState } from "react";
import { CORE_TRAIT } from "@/lib/numerology/meanings";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";

type Props = {
  strengths: string[];
  lifePath?: string;
};

const NODE_COLORS = [
  "rgb(45 122 120)",
  "rgb(30 58 107)",
  "rgb(180 100 50)",
  "rgb(79 70 150)",
  "rgb(45 122 90)",
  "rgb(120 90 60)",
  "rgb(56 120 170)",
  "rgb(150 80 100)",
];

function shortLabel(s: string): string {
  const words = s.replace(/[.。].*$/, "").trim().split(/\s+/);
  if (words.length <= 3) return words.join(" ");
  return words.slice(0, 3).join(" ");
}

export function StrengthsConstellation({ strengths, lifePath }: Props) {
  const nodes = strengths.slice(0, 8);
  const [focus, setFocus] = useState<number | null>(null);
  const lp = lifePath ? reduceToSingleDigit(Number(lifePath)) : null;
  const centerTrait = lp != null ? CORE_TRAIT[lp] : "Dominant tone";

  const layout = useMemo(() => {
    const cx = 110;
    const cy = 110;
    const r = 78;
    return nodes.map((label, i) => {
      const ang = (-90 + (i * 360) / Math.max(nodes.length, 1)) * (Math.PI / 180);
      return {
        label,
        short: shortLabel(label),
        x: cx + Math.cos(ang) * r,
        y: cy + Math.sin(ang) * r,
        color: NODE_COLORS[i % NODE_COLORS.length],
      };
    });
  }, [nodes]);

  if (!nodes.length) return null;

  const active = focus != null ? layout[focus] : null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Strength Constellation — related gifts around your Life Path tone.
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
          <svg
            viewBox="0 0 220 220"
            className="mx-auto h-auto w-full max-w-sm"
            role="img"
            aria-label="Strength constellation"
          >
            {layout.map((n, i) => {
              const next = layout[(i + 1) % layout.length];
              return (
                <line
                  key={`e-${i}`}
                  x1={n.x}
                  y1={n.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="rgb(196 164 108 / 0.35)"
                  strokeWidth="1"
                />
              );
            })}
            {layout.map((n) => (
              <line
                key={`spoke-${n.short}`}
                x1="110"
                y1="110"
                x2={n.x}
                y2={n.y}
                stroke="rgb(30 58 107 / 0.12)"
                strokeWidth="1"
              />
            ))}
            <circle
              cx="110"
              cy="110"
              r="28"
              fill="rgb(250 248 243)"
              stroke="rgb(30 58 107)"
              strokeWidth="1.4"
              className="motion-safe:animate-pulse"
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
              const lit = focus == null || focus === i;
              return (
                <g
                  key={n.short + i}
                  opacity={lit ? 1 : 0.3}
                  className="cursor-pointer"
                  onClick={() => setFocus((cur) => (cur === i ? null : i))}
                  onMouseEnter={() => setFocus(i)}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={focus === i ? 14 : 11}
                    fill={n.color}
                    fillOpacity="0.2"
                    stroke={n.color}
                    strokeWidth="1.5"
                    className="motion-safe:opacity-95"
                  />
                  <text
                    x={n.x}
                    y={n.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="7"
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
        </div>

        <div className="space-y-2">
          {layout.map((n, i) => (
            <button
              key={n.short + i}
              type="button"
              onClick={() => setFocus(i)}
              className={`btn-tactile w-full rounded-xl border px-3 py-2.5 text-left ${
                focus === i
                  ? "border-ink bg-white shadow-sm"
                  : "border-[var(--line)] bg-white/55 hover:border-gold/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-ink"
                  style={{
                    background: `${n.color}22`,
                    border: `1px solid ${n.color}`,
                  }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-ink">{n.short}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-ink-soft">{n.label}</p>
            </button>
          ))}
        </div>
      </div>

      {active ? (
        <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3 text-sm leading-6 text-ink">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Strength card
          </p>
          <p className="mt-1 font-medium">{active.short}</p>
          <p className="mt-1 text-ink-soft">{active.label}</p>
          <p className="mt-2 text-xs text-ink-soft">
            Related growth: notice when this gift overextends, then borrow one
            catalyst practice from Growth Mode.
          </p>
        </div>
      ) : null}
    </div>
  );
}
