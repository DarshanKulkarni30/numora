"use client";

import { useId, useMemo, useState } from "react";
import { ChartTipPanel } from "@/components/report/ChartTipPanel";
import {
  GRID_KIND_LABEL,
  GRID_STATUS_ORDER,
  VEDIC_GRID_CELL,
  VEDIC_GRID_NOTE,
  VEDIC_GRID_ORDER,
  calculateVedicGrid,
  cellCenter,
  patternsForDigit,
  type GridPattern,
  type GridStatus,
} from "@/lib/numerology/vedicGrid";

type Props = {
  dateOfBirth: string;
};

const STATUS_CARD: Record<GridStatus, string> = {
  Amazing: "border-emerald-300 bg-emerald-50 text-emerald-950",
  Good: "border-teal-200 bg-teal-50 text-teal-950",
  Neutral: "border-slate-200 bg-slate-50 text-slate-800",
  Bad: "border-amber-300 bg-amber-50 text-amber-950",
  Defeat: "border-rose-200 bg-rose-50 text-rose-950",
};

const STATUS_STROKE: Record<GridStatus, string> = {
  Amazing: "rgba(5, 150, 105, 0.5)",
  Good: "rgba(13, 148, 136, 0.45)",
  Neutral: "rgba(100, 116, 139, 0.4)",
  Bad: "rgba(217, 119, 6, 0.5)",
  Defeat: "rgba(190, 18, 60, 0.45)",
};

const STATUS_FILL: Record<GridStatus, string> = {
  Amazing: "rgba(5, 150, 105, 0.08)",
  Good: "rgba(13, 148, 136, 0.07)",
  Neutral: "rgba(100, 116, 139, 0.06)",
  Bad: "rgba(217, 119, 6, 0.08)",
  Defeat: "rgba(190, 18, 60, 0.07)",
};

function PatternCard({ pattern }: { pattern: GridPattern }) {
  return (
    <li className={`rounded-xl border px-4 py-3 ${STATUS_CARD[pattern.status]}`}>
      <p className="text-[10px] uppercase tracking-wider opacity-80">
        {GRID_KIND_LABEL[pattern.kind]} · {pattern.status}
      </p>
      <p className="mt-1 text-sm font-medium">{pattern.name}</p>
      <p className="mt-0.5 text-[11px] opacity-80">
        {pattern.numbers.join("–")}
      </p>
      <p className="mt-2 text-sm leading-6">{pattern.trait}</p>
    </li>
  );
}

export function VedicBirthChart({ dateOfBirth }: Props) {
  const uid = useId().replace(/:/g, "");
  const [tip, setTip] = useState<string | null>(null);
  const [focusDigit, setFocusDigit] = useState<number | null>(null);

  const result = useMemo(
    () => calculateVedicGrid(dateOfBirth),
    [dateOfBirth],
  );
  const presentSet = useMemo(() => new Set(result.present), [result.present]);

  const overlayYogas = result.presentPatterns.filter((p) => p.kind === "yoga");
  const overlayTrikons = result.presentPatterns.filter(
    (p) => p.kind === "trikon",
  );
  const overlayDrishti = result.presentPatterns.filter(
    (p) => p.kind === "drishti",
  );

  const groupedPresent = GRID_STATUS_ORDER.map((status) => ({
    status,
    items: result.presentPatterns.filter((p) => p.status === status),
  })).filter((g) => g.items.length > 0);

  const focused =
    focusDigit != null ? patternsForDigit(result, focusDigit) : [];

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">{VEDIC_GRID_NOTE}</p>

      <div className="mx-auto max-w-md">
        <div className="relative">
          <div
            className="grid grid-cols-3 gap-1.5"
            aria-label="Vedic Ank Kundli"
          >
            {VEDIC_GRID_ORDER.flat().map((n) => {
              const cell = VEDIC_GRID_CELL[n];
              const on = presentSet.has(n);
              const selected = focusDigit === n;
              const hits = on ? patternsForDigit(result, n) : [];
              const tileTip = on
                ? `${n} · ${cell.sanskrit} / ${cell.english} · present\n${
                    hits.length
                      ? hits
                          .map(
                            (p) =>
                              `${GRID_KIND_LABEL[p.kind]} · ${p.status}: ${p.name}`,
                          )
                          .join("\n")
                      : "This digit does not join into a line, triangle or pair here."
                  }`
                : `${n} · ${cell.sanskrit} / ${cell.english} · not in this date (unique digits only).`;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on ? selected : undefined}
                  aria-disabled={!on}
                  title={tileTip}
                  onMouseEnter={() => setTip(tileTip)}
                  onMouseLeave={() => setTip(null)}
                  onFocus={() => setTip(tileTip)}
                  onBlur={() => setTip(null)}
                  onClick={() => {
                    if (!on) return;
                    setFocusDigit((prev) => (prev === n ? null : n));
                  }}
                  className={`btn-tactile relative z-[1] flex aspect-square flex-col items-center justify-center rounded-lg border px-1 py-2 text-center ${
                    on
                      ? "border-ink/40 bg-amber-50 text-ink shadow-sm"
                      : "cursor-not-allowed border-dashed border-[var(--line)] bg-slate-100/70 text-slate-400"
                  } ${selected ? "ring-2 ring-ink ring-offset-1" : ""}`}
                >
                  <span className="brand text-xl leading-none">{n}</span>
                  <span className="mt-1 text-[10px] font-medium leading-tight">
                    {cell.sanskrit}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider opacity-80">
                    {cell.english}
                  </span>
                </button>
              );
            })}
          </div>

          {overlayYogas.length + overlayTrikons.length + overlayDrishti.length >
          0 ? (
            <svg
              className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                {GRID_STATUS_ORDER.map((status) => (
                  <marker
                    key={status}
                    id={`ank-drishti-${uid}-${status}`}
                    markerWidth="3.2"
                    markerHeight="3.2"
                    refX="2.6"
                    refY="1.6"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path
                      d="M0,0 L3.2,1.6 L0,3.2 Z"
                      fill={STATUS_STROKE[status]}
                    />
                  </marker>
                ))}
              </defs>
              {overlayYogas.map((p) => {
                const a = cellCenter(p.numbers[0]);
                const b = cellCenter(p.numbers[1]);
                const c = cellCenter(p.numbers[2]);
                return (
                  <polyline
                    key={p.id}
                    points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`}
                    fill="none"
                    stroke={STATUS_STROKE[p.status]}
                    strokeWidth={0.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.85}
                  />
                );
              })}
              {overlayTrikons.map((p) => {
                const a = cellCenter(p.numbers[0]);
                const b = cellCenter(p.numbers[1]);
                const c = cellCenter(p.numbers[2]);
                return (
                  <polygon
                    key={p.id}
                    points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`}
                    fill={STATUS_FILL[p.status]}
                    stroke={STATUS_STROKE[p.status]}
                    strokeWidth={0.7}
                    strokeDasharray="1.6 1.8"
                    opacity={0.9}
                  />
                );
              })}
              {overlayDrishti.map((p) => {
                const a = cellCenter(p.numbers[0]);
                const b = cellCenter(p.numbers[1]);
                return (
                  <line
                    key={p.id}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={STATUS_STROKE[p.status]}
                    strokeWidth={0.75}
                    strokeLinecap="round"
                    markerEnd={`url(#ank-drishti-${uid}-${p.status})`}
                    opacity={0.8}
                  />
                );
              })}
            </svg>
          ) : null}
        </div>
      </div>

      <ChartTipPanel
        tip={tip}
        empty="Hover a filled cell to see its planet. Tap a digit you have to see which patterns on this grid include it — lines of three, triangles and pairs each carry a different traditional meaning."
      />

      <div className="flex flex-wrap gap-2 text-[11px] text-ink-soft">
        <span className="rounded-full border border-[var(--line)] bg-white/70 px-2.5 py-1">
          Present {result.present.join(", ") || "—"}
        </span>
        <span className="rounded-full border border-dashed border-[var(--line)] bg-white/50 px-2.5 py-1">
          Not in date {result.missing.join(", ") || "—"}
        </span>
      </div>

      {result.mixedReading ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-950">
          {result.mixedReading}
        </p>
      ) : null}

      {focusDigit != null && presentSet.has(focusDigit) ? (
        <div className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            On this chart · {focusDigit} {VEDIC_GRID_CELL[focusDigit].sanskrit}
          </p>
          {focused.length ? (
            <ul className="mt-2 space-y-1 text-sm text-ink">
              {focused.map((p) => (
                <li key={p.id}>
                  {GRID_KIND_LABEL[p.kind]} · {p.status}: {p.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">
              You have this digit, but it does not join up with others into a
              line, triangle or pair on this grid — so it acts on its own rather
              than reinforcing a wider pattern.
            </p>
          )}
        </div>
      ) : null}

      <div>
        <h3 className="text-ink">
          Patterns your digits make on the grid
        </h3>
        {groupedPresent.length ? (
          <div className="mt-3 space-y-4">
            {groupedPresent.map((g) => (
              <div key={g.status}>
                <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                  {g.status}
                </p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {g.items.map((p) => (
                    <PatternCard key={p.id} pattern={p} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">
            The digits in your date do not form any complete line, triangle or
            pair on this grid. That is common and simply means no single
            traditional pattern dominates your chart.
          </p>
        )}
      </div>

      {result.voids.length > 0 ? (
        <div>
          <h3 className="text-ink">Gaps</h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {result.voids.map((p) => (
              <PatternCard key={p.id} pattern={p} />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
