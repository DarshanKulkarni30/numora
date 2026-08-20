"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildPythagoreanTrigonum,
  trigonumRelated,
  TRIGONUM_EDGES,
  type TrigonumEnergyBand,
  type TrigonumNodeId,
} from "@/lib/numerology/pythagoreanTrigonum";

type Props = {
  dateOfBirth: string;
  className?: string;
};

const BAND_STROKE: Record<TrigonumEnergyBand, string> = {
  action: "rgb(45 90 140)",
  analytical: "rgb(79 70 150)",
  nurturing: "rgb(160 100 70)",
};

const BAND_FILL: Record<TrigonumEnergyBand, string> = {
  action: "rgb(45 90 140 / 0.12)",
  analytical: "rgb(79 70 150 / 0.12)",
  nurturing: "rgb(160 100 70 / 0.14)",
};

/** Inverted triangle layout: top A B C, mid D E, apex F */
const POS: Record<TrigonumNodeId, { x: number; y: number }> = {
  A: { x: 50, y: 36 },
  B: { x: 140, y: 36 },
  C: { x: 230, y: 36 },
  D: { x: 95, y: 100 },
  E: { x: 185, y: 100 },
  F: { x: 140, y: 168 },
};

export function PythagoreanTrigonum({ dateOfBirth, className = "" }: Props) {
  const model = useMemo(
    () => buildPythagoreanTrigonum(dateOfBirth),
    [dateOfBirth],
  );
  const [focus, setFocus] = useState<TrigonumNodeId>("F");
  const [reveal, setReveal] = useState(0);

  useEffect(() => {
    setReveal(0);
    setFocus("F");
    const timers = [
      window.setTimeout(() => setReveal(1), 80),
      window.setTimeout(() => setReveal(2), 280),
      window.setTimeout(() => setReveal(3), 480),
    ];
    return () => timers.forEach(clearTimeout);
  }, [dateOfBirth]);

  const active = model.nodes[focus];
  const related = trigonumRelated(focus);
  const lit = new Set<TrigonumNodeId>([
    focus,
    ...related.parents,
    ...related.children,
  ]);

  const stageFor = (id: TrigonumNodeId) => {
    if (id === "A" || id === "B" || id === "C") return 1;
    if (id === "D" || id === "E") return 2;
    return 3;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Pythagorean Trigonum
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Inverted birth triangle — Day, Month, and Year cascade into an apex
          root. Distinct from Life Path; reflective only.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
          <svg
            viewBox="0 0 280 210"
            className="mx-auto h-auto w-full max-w-md"
            role="img"
            aria-label={`Pythagorean Trigonum apex ${model.apex}`}
          >
            {TRIGONUM_EDGES.map((e) => {
              const a = POS[e.from];
              const b = POS[e.to];
              const edgeLit =
                lit.has(e.from) && lit.has(e.to) && reveal >= stageFor(e.to);
              const show = reveal >= stageFor(e.to);
              return (
                <line
                  key={`${e.from}-${e.to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={
                    edgeLit ? "rgb(180 83 9)" : "rgb(196 164 108 / 0.35)"
                  }
                  strokeWidth={edgeLit ? 2.2 : 1.2}
                  opacity={show ? 1 : 0.15}
                  strokeLinecap="round"
                />
              );
            })}

            {model.order.map((id) => {
              const node = model.nodes[id];
              const p = POS[id];
              const show = reveal >= stageFor(id);
              const isFocus = focus === id;
              const dim = reveal >= 3 && !lit.has(id);
              return (
                <g
                  key={id}
                  opacity={show ? (dim ? 0.28 : 1) : 0.12}
                  className="cursor-pointer"
                  onClick={() => setFocus(id)}
                  onMouseEnter={() => setFocus(id)}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isFocus ? 22 : 18}
                    fill={BAND_FILL[node.band]}
                    stroke={BAND_STROKE[node.band]}
                    strokeWidth={isFocus ? 2.2 : 1.4}
                    className={
                      id === "F" ? "motion-safe:animate-pulse" : undefined
                    }
                  />
                  <text
                    x={p.x}
                    y={p.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isFocus ? 16 : 14}
                    fontWeight="700"
                    fill="rgb(30 58 107)"
                  >
                    {node.value}
                  </text>
                  <text
                    x={p.x}
                    y={p.y + (isFocus ? 34 : 30)}
                    textAnchor="middle"
                    fontSize="8"
                    fill="rgb(70 82 98)"
                  >
                    {id}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-2 flex flex-wrap justify-center gap-3 text-[10px] text-ink-soft">
            <span>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-full"
                style={{ background: BAND_STROKE.action }}
              />
              Action 1·5·8
            </span>
            <span>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-full"
                style={{ background: BAND_STROKE.analytical }}
              />
              Analytical 3·7
            </span>
            <span>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-full"
                style={{ background: BAND_STROKE.nurturing }}
              />
              Nurturing 2·4·6·9
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              {active.id === "F" ? "Apex root" : `Node ${active.id}`}
            </p>
            <p className="mt-1 text-lg font-medium text-ink">
              {active.label} · {active.value}{" "}
              <span className="text-sm font-normal text-ink-soft">
                ({active.archetype})
              </span>
            </p>
            <p className="mt-2 inline-block rounded-full border border-[var(--line)] bg-white/80 px-2.5 py-1 text-[11px] text-ink">
              {active.formula}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              {active.narrative}
            </p>
            {related.parents.length || related.children.length ? (
              <p className="mt-2 text-[11px] text-ink-soft">
                {related.parents.length
                  ? `From ${related.parents.join(" · ")}`
                  : "Top base"}
                {related.children.length
                  ? ` → into ${related.children.join(" · ")}`
                  : ""}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {model.order.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setFocus(id)}
                className={`btn-tactile rounded-full border px-2.5 py-1 text-xs ${
                  focus === id
                    ? "border-ink bg-ink text-paper"
                    : "border-[var(--line)] bg-white/70 text-ink hover:border-gold"
                }`}
              >
                {id} · {model.nodes[id].value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calc strip */}
      <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          How the triangle was derived
        </p>
        <div className="relative mt-3 flex flex-wrap items-center gap-2">
          <div
            className="pointer-events-none absolute left-2 right-2 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent sm:block"
            aria-hidden
          />
          {(
            [
              ["A", model.nodes.A],
              ["B", model.nodes.B],
              ["C", model.nodes.C],
              ["D", model.nodes.D],
              ["E", model.nodes.E],
              ["F", model.nodes.F],
            ] as const
          ).map(([id, node]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFocus(id)}
              className={`btn-tactile relative rounded-xl border px-3 py-2 text-center ${
                focus === id
                  ? "border-ink bg-white shadow-sm"
                  : "border-[var(--line)] bg-gradient-to-b from-white to-mist/40"
              }`}
            >
              <p className="text-[9px] uppercase tracking-wider text-ink-soft">
                {node.label}
              </p>
              <p className="brand text-lg text-ink">{node.value}</p>
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink">
          {model.day}/{String(model.month).padStart(2, "0")}/{model.year} →
          Apex{" "}
          <span className="brand font-medium">{model.apex}</span> (
          {model.nodes.F.archetype})
        </p>
      </div>

      {/* Plane metrics */}
      <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Core planes
        </p>
        <ul className="mt-3 space-y-3">
          {model.planes.map((plane) => (
            <li key={plane.id}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-ink">{plane.label}</span>
                <span className="tabular-nums text-ink-soft">
                  {plane.percent}% · {plane.values.join(" · ")}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-sea/70 transition-[width] duration-500"
                  style={{ width: `${plane.percent}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] leading-4 text-ink-soft">
                {plane.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {(model.repeats.length > 0 || model.missing.length > 0) && (
        <div className="grid gap-2 sm:grid-cols-2">
          {model.repeats.length ? (
            <div className="rounded-xl border border-[var(--line)] bg-amber-50/50 px-3 py-3 text-sm text-ink">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                Amplified digits
              </p>
              <p className="mt-1">
                {model.repeats
                  .map((r) => `${r.digit} appears ${r.count}×`)
                  .join(" · ")}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                Strong emphasis — still needs balance, not a guarantee.
              </p>
            </div>
          ) : null}
          {model.missing.length ? (
            <div className="rounded-xl border border-[var(--line)] bg-mist/50 px-3 py-3 text-sm text-ink">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                Quiet digits
              </p>
              <p className="mt-1">{model.missing.join(" · ")}</p>
              <p className="mt-1 text-xs text-ink-soft">
                Practice tones to invite consciously — not a deficit verdict.
              </p>
            </div>
          ) : null}
        </div>
      )}

      <p className="text-xs leading-5 text-ink-soft">{model.disclaimer}</p>
    </div>
  );
}
