"use client";

import Link from "next/link";
import { useId, useMemo, useState, type ReactNode } from "react";
import { ChartTipPanel } from "@/components/report/ChartTipPanel";
import {
  arrowNameToSlug,
  guideHref,
  LO_SHU_ARROW_GUIDES,
} from "@/lib/guides/content";
import { LO_SHU_NUMBER_META } from "@/lib/numerology/loShuEffects";
import {
  buildLoShuArchitecture,
  loShuBlueprintJson,
  type LoShuArchitecture,
  type StrengthEngine,
} from "@/lib/numerology/loShuArchitecture";
import type { LoShuResult } from "@/lib/numerology/types";
import { personalYearForCalendarYear } from "@/lib/numerology/cycles";
import { reduceNumber } from "@/lib/numerology/reduce";

/** Classic Lo Shu compass angles (deg, 0 = east; SVG y-down). */
const NODE_ANGLE: Record<number, number> = {
  4: -135,
  9: -90,
  2: -45,
  7: 0,
  6: 45,
  1: 90,
  5: 90, // inner radius on same ray as 1
  8: 135,
  3: 180,
};

/** Radius by plane — 5 sits near center on emotional ring. */
const NODE_RADIUS: Record<number, number> = {
  5: 14,
  3: 28,
  7: 28,
  4: 36,
  9: 36,
  2: 36,
  8: 44,
  1: 44,
  6: 44,
};

const PLANE_STROKE: Record<string, string> = {
  emotional: "rgb(244 63 94 / 0.35)",
  mental: "rgb(14 165 233 / 0.35)",
  practical: "rgb(16 185 129 / 0.4)",
};

const PLANE_FILL: Record<string, string> = {
  emotional: "rgb(255 228 230)",
  mental: "rgb(224 242 254)",
  practical: "rgb(209 250 229)",
};

const PLANE_OF: Record<number, "emotional" | "mental" | "practical"> = {
  3: "emotional",
  5: "emotional",
  7: "emotional",
  4: "mental",
  9: "mental",
  2: "mental",
  8: "practical",
  1: "practical",
  6: "practical",
};

type Props = {
  loShu: LoShuResult;
  intro?: ReactNode;
  aspectLegend?: ReactNode;
  /** When false, skip architecture panels (Pythagorean reuse). Default true. */
  showArchitecture?: boolean;
  /** DOB for yearly timeline (ISO or DD/MM/YYYY). */
  dateOfBirth?: string;
  personName?: string;
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function TriBalanceRadar({ architecture }: { architecture: LoShuArchitecture }) {
  const cx = 50;
  const cy = 52;
  const R = 36;
  const order: ("emotional" | "practical" | "mental")[] = [
    "emotional",
    "practical",
    "mental",
  ];
  const angles = [-90, 150, 30];
  const byId = Object.fromEntries(architecture.planes.map((p) => [p.id, p]));
  const pts = order.map((id, i) => {
    const n = byId[id]?.normalized ?? 0;
    return polar(cx, cy, 8 + R * n, angles[i]);
  });
  const poly = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const frame = angles
    .map((a) => {
      const p = polar(cx, cy, R + 8, a);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/50 p-3">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Tri-balance
      </p>
      <svg viewBox="0 0 100 100" className="mx-auto mt-1 h-36 w-full max-w-[11rem]">
        <polygon
          points={frame}
          fill="none"
          stroke="var(--line)"
          strokeWidth="0.8"
        />
        <polygon
          points={poly}
          fill="rgb(180 83 9 / 0.2)"
          stroke="rgb(180 83 9 / 0.7)"
          strokeWidth="1.2"
        />
        {order.map((id, i) => {
          const tip = polar(cx, cy, R + 14, angles[i]);
          return (
            <text
              key={id}
              x={tip.x}
              y={tip.y}
              textAnchor="middle"
              className="fill-[var(--ink-soft)]"
              style={{ fontSize: 7 }}
            >
              {byId[id]?.label.slice(0, 3)}
            </text>
          );
        })}
      </svg>
      <ul className="mt-1 space-y-0.5 text-[11px] text-ink-soft">
        {architecture.planes.map((p) => (
          <li key={p.id}>
            <span className="font-medium text-ink">{p.label}</span> · {p.level}{" "}
            ({p.score})
          </li>
        ))}
      </ul>
    </div>
  );
}

function TensionBar({ architecture }: { architecture: LoShuArchitecture }) {
  const { tension } = architecture;
  const pct = Math.round(tension.position * 100);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/50 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Life-path tension
      </p>
      <p className="mt-1 text-sm font-medium text-ink">{tension.label}</p>
      <div className="relative mt-3 h-2 rounded-full bg-[var(--line)]/60">
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-gold-deep bg-paper shadow-sm transition-[left] duration-500"
          style={{ left: `calc(${pct}% - 0.5rem)` }}
          aria-hidden
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-wider text-ink-soft">
        <span>
          BN {tension.bn ?? "—"} · inner
        </span>
        <span>
          DN {tension.dn ?? "—"} · outer
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-ink-soft">{tension.narrative}</p>
    </div>
  );
}

function YearTimeline({
  dateOfBirth,
  architecture,
}: {
  dateOfBirth: string;
  architecture: LoShuArchitecture;
}) {
  const years = useMemo(() => {
    const now = new Date().getFullYear();
    try {
      return [now - 1, now, now + 1, now + 2].map((y) => ({
        year: y,
        py: personalYearForCalendarYear(dateOfBirth, y),
      }));
    } catch {
      return [];
    }
  }, [dateOfBirth]);

  if (!years.length) return null;

  const catalystNums = new Set(architecture.catalysts.map((c) => c.number));

  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/50 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Yearly timeline
      </p>
      <p className="mt-1 text-[11px] text-ink-soft">
        Personal year digits beside Lo Shu catalysts—reflective pairing only,
        not Lo Shu year math.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {years.map(({ year, py }) => {
          const digit = reduceNumber(py, []);
          const hit =
            catalystNums.has(digit) || catalystNums.has(py);
          return (
            <div
              key={year}
              className={`min-w-[4.5rem] rounded-lg border px-2.5 py-2 text-center ${
                year === new Date().getFullYear()
                  ? "border-gold/70 bg-gold/10"
                  : "border-[var(--line)] bg-white/70"
              }`}
            >
              <p className="text-[10px] text-ink-soft">{year}</p>
              <p className="brand text-lg text-ink">{py}</p>
              {hit ? (
                <p className="text-[9px] text-gold-deep">Catalyst year</p>
              ) : (
                <p className="text-[9px] text-ink-soft">Personal year</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function downloadBlueprint(
  loShu: LoShuResult,
  architecture: LoShuArchitecture,
  personName?: string,
  dateOfBirth?: string,
) {
  const payload = loShuBlueprintJson(loShu, architecture, {
    name: personName,
    dateOfBirth,
  });
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "lo-shu-personality-blueprint.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function LoShuChart({
  loShu,
  intro,
  aspectLegend,
  showArchitecture = true,
  dateOfBirth,
  personName,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const [tip, setTip] = useState<string | null>(null);
  const [layout, setLayout] = useState<"circular" | "square">("circular");

  const architecture = useMemo(
    () => (showArchitecture ? buildLoShuArchitecture(loShu) : null),
    [loShu, showArchitecture],
  );

  const cx = 50;
  const cy = 50;

  const nodePos = useMemo(() => {
    const map: Record<number, { x: number; y: number }> = {};
    for (let n = 1; n <= 9; n++) {
      map[n] = polar(cx, cy, NODE_RADIUS[n], NODE_ANGLE[n]);
    }
    return map;
  }, []);

  const enginePaths: {
    engine: StrengthEngine;
    d: string;
  }[] = useMemo(() => {
    if (!architecture) return [];
    return architecture.engines.map((engine) => {
      const pts = engine.numbers.map((n) => nodePos[n]);
      const d = pts
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
        .join(" ");
      return { engine, d };
    });
  }, [architecture, nodePos]);

  return (
    <div className="space-y-5">
      {intro ?? (
        <p className="text-sm text-ink-soft">
          Birth-date digits plus{" "}
          <span className="font-medium text-ink">BN</span>
          {loShu.birth_number != null ? ` ${loShu.birth_number}` : ""} and{" "}
          <span className="font-medium text-ink">DN</span>
          {loShu.destiny_number != null ? ` ${loShu.destiny_number}` : ""} on
          the Lo Shu grid. Rings mark Emotional (inner), Mental, and Practical
          (outer). Hover a node for meaning; click for its guide.
        </p>
      )}

      {showArchitecture ? (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-[var(--line)] bg-white/50 p-0.5">
            {(
              [
                ["circular", "Lo Shu grid"],
                ["square", "Classic 3×3"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLayout(id)}
                className={`btn-tactile rounded-full px-3 py-1.5 text-xs transition ${
                  layout === id
                    ? "bg-ink text-paper"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {architecture ? (
            <button
              type="button"
              onClick={() =>
                downloadBlueprint(loShu, architecture, personName, dateOfBirth)
              }
              className="btn-tactile rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-xs text-ink hover:border-gold/50"
            >
              Export blueprint (JSON)
            </button>
          ) : null}
        </div>
      ) : null}

      {architecture && showArchitecture ? (
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <TensionBar architecture={architecture} />
          <div className="rounded-xl border border-[var(--line)] bg-white/50 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-ink-soft">
              Decision flow
            </p>
            <p className="brand mt-1 text-xl text-ink">
              {architecture.decisionFlowLabel}
            </p>
          </div>
        </div>
      ) : null}

      {layout === "circular" ? (
        <div className="mx-auto max-w-md">
          <svg
            viewBox="0 0 100 100"
            className="h-auto w-full overflow-visible"
            role="img"
            aria-label="Lo Shu grid"
          >
            <defs>
              <linearGradient id={`will-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(244 63 94)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="rgb(244 63 94)" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id={`action-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0.75" />
              </linearGradient>
              <linearGradient
                id={`determination-${uid}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgb(180 83 9)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="rgb(180 83 9)" stopOpacity="0.75" />
              </linearGradient>
            </defs>

            {[44, 36, 28].map((r, i) => (
              <circle
                key={r}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={
                  i === 0
                    ? PLANE_STROKE.practical
                    : i === 1
                      ? PLANE_STROKE.mental
                      : PLANE_STROKE.emotional
                }
                strokeWidth="0.6"
              />
            ))}

            {enginePaths.map(({ engine, d }) => {
              const grad =
                engine.id === "will"
                  ? `url(#will-${uid})`
                  : engine.id === "action"
                    ? `url(#action-${uid})`
                    : `url(#determination-${uid})`;
              const thick =
                engine.status === "active"
                  ? 1.8
                  : engine.status === "partial"
                    ? 1.1
                    : 0.5;
              return (
                <path
                  key={engine.id}
                  d={d}
                  fill="none"
                  stroke={grad}
                  strokeWidth={thick}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={
                    engine.status === "quiet" ? "1.5 2" : undefined
                  }
                  className={
                    engine.status === "active"
                      ? "motion-safe:animate-pulse"
                      : undefined
                  }
                  opacity={engine.status === "quiet" ? 0.35 : 0.9}
                  onMouseEnter={() =>
                    setTip(
                      `${engine.label} (${engine.status})\n${engine.numbers.join("–")}\n${engine.summary}`,
                    )
                  }
                  onMouseLeave={() => setTip(null)}
                  style={{ pointerEvents: "stroke" }}
                />
              );
            })}

            {/* BN | DN center */}
            <circle
              cx={cx}
              cy={cy}
              r="9"
              fill="var(--paper)"
              stroke="var(--gold-deep)"
              strokeWidth="0.7"
            />
            <path
              d={`M ${cx} ${cy - 9} A 9 9 0 0 0 ${cx} ${cy + 9} Z`}
              fill="rgb(180 83 9 / 0.12)"
            />
            <text
              x={cx - 3.5}
              y={cy + 1.5}
              textAnchor="middle"
              style={{ fontSize: 5.5, fontWeight: 600 }}
              className="fill-[var(--ink)]"
            >
              {loShu.birth_number ?? "·"}
            </text>
            <text
              x={cx + 3.5}
              y={cy + 1.5}
              textAnchor="middle"
              style={{ fontSize: 5.5, fontWeight: 600 }}
              className="fill-[var(--ink)]"
            >
              {loShu.destiny_number ?? "·"}
            </text>
            <text
              x={cx}
              y={cy + 6.5}
              textAnchor="middle"
              style={{ fontSize: 3.2 }}
              className="fill-[var(--ink-soft)]"
            >
              BN | DN
            </text>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
              const count = loShu.grid[n] ?? 0;
              const missing = count === 0;
              const { x, y } = nodePos[n];
              const plane = PLANE_OF[n];
              const size = missing ? 4.2 : Math.min(8, 4 + count * 1.4);
              const meta = LO_SHU_NUMBER_META[n];
              const catalyst = architecture?.catalysts.find((c) => c.number === n);
              const tileTip = [
                `${n} · ${meta.trait} (${meta.vedic})`,
                `Plane: ${plane}`,
                missing
                  ? catalyst
                    ? `Growth catalyst · ${catalyst.keyword}`
                    : "Quiet in this birth grid — a growth invite."
                  : `Present ×${count} — ${meta.theme}.`,
                loShu.birth_number === n ? `Includes BN ${loShu.birth_number}.` : null,
                loShu.destiny_number === n
                  ? `Includes DN ${loShu.destiny_number}.`
                  : null,
              ]
                .filter(Boolean)
                .join("\n");

              return (
                <a
                  key={n}
                  href={guideHref("lo-shu-number", n)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setTip(tileTip)}
                  onMouseLeave={() => setTip(null)}
                  onFocus={() => setTip(tileTip)}
                  onBlur={() => setTip(null)}
                >
                  {missing ? (
                    <circle
                      cx={x}
                      cy={y}
                      r={size + 1.5}
                      fill="none"
                      stroke={PLANE_STROKE[plane]}
                      strokeWidth="0.5"
                      strokeDasharray="1.2 1.4"
                      opacity="0.7"
                      className="motion-safe:opacity-80"
                    />
                  ) : null}
                  <circle
                    cx={x}
                    cy={y}
                    r={size}
                    fill={missing ? "transparent" : PLANE_FILL[plane]}
                    stroke={
                      loShu.birth_number === n || loShu.destiny_number === n
                        ? "var(--gold-deep)"
                        : PLANE_STROKE[plane]
                    }
                    strokeWidth={
                      loShu.birth_number === n || loShu.destiny_number === n
                        ? 1.1
                        : 0.6
                    }
                    opacity={missing ? 0.55 : 1}
                  />
                  <text
                    x={x}
                    y={y + 1.6}
                    textAnchor="middle"
                    style={{ fontSize: missing ? 4.5 : 5.5, fontWeight: 600 }}
                    className={
                      missing ? "fill-[var(--ink-soft)]" : "fill-[var(--ink)]"
                    }
                  >
                    {n}
                  </text>
                  {missing && catalyst ? (
                    <text
                      x={x}
                      y={y + size + 3.2}
                      textAnchor="middle"
                      style={{ fontSize: 2.8 }}
                      className="fill-[var(--ink-soft)]"
                    >
                      {catalyst.keyword.slice(0, 8)}
                    </text>
                  ) : !missing && count > 1 ? (
                    <text
                      x={x}
                      y={y + size + 2.8}
                      textAnchor="middle"
                      style={{ fontSize: 2.8 }}
                      className="fill-[var(--ink-soft)]"
                    >
                      ×{count}
                    </text>
                  ) : null}
                </a>
              );
            })}
          </svg>
        </div>
      ) : (
        <ClassicSquareGrid loShu={loShu} setTip={setTip} />
      )}

      <ChartTipPanel
        tip={tip}
        empty="Hover a node for plane and meaning, or a vector for its strength engine."
      />

      {aspectLegend}

      {architecture && showArchitecture ? (
        <>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <TriBalanceRadar architecture={architecture} />
            <div className="rounded-xl border border-[var(--line)] bg-white/50 px-4 py-3 md:col-span-1 lg:col-span-2">
              <p className="text-xs uppercase tracking-wider text-ink-soft">
                Strength engines
              </p>
              <ul className="mt-2 space-y-2">
                {architecture.engines.map((e) => {
                  const slug = arrowNameToSlug(e.arrowName);
                  const guide = slug ? LO_SHU_ARROW_GUIDES[slug] : null;
                  return (
                    <li key={e.id} className="text-sm">
                      <div className="flex flex-wrap items-baseline gap-2">
                        {slug ? (
                          <Link
                            href={guideHref("lo-shu-arrow", slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
                          >
                            {e.label}
                          </Link>
                        ) : (
                          <span className="font-medium text-ink">{e.label}</span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                            e.status === "active"
                              ? "bg-emerald-100 text-emerald-900"
                              : e.status === "partial"
                                ? "bg-amber-100 text-amber-900"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {e.status}
                        </span>
                        <span className="text-xs text-ink-soft">
                          {e.numbers.join("–")}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-soft">{e.summary}</p>
                      {guide ? (
                        <p className="mt-0.5 text-[11px] text-ink-soft/80">
                          {guide.significance}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {architecture.activeEngineCount === 3 ? (
                <p className="mt-2 text-xs font-medium text-gold-deep">
                  Three active engines — rare and powerful when balanced with
                  rest.
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-white/50 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-ink-soft">
              Growth catalysts
            </p>
            {architecture.catalysts.length ? (
              <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                {architecture.catalysts.map((c) => (
                  <li key={c.number} className="text-sm">
                    <Link
                      href={guideHref("lo-shu-number", c.number)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
                    >
                      {c.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-soft">{c.summary}</p>
                    <ul className="mt-1 list-inside list-disc text-[11px] text-ink-soft">
                      {c.actions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                No missing-number catalysts—broad distribution across the grid.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-ink-soft">
              Personality architecture
            </p>
            <ul className="mt-2 space-y-2">
              {architecture.layers.map((layer) => (
                <li key={layer.id} className="text-sm">
                  <span className="font-medium text-ink">{layer.label}</span>
                  <p className="text-xs leading-5 text-ink-soft">
                    {layer.summary}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-6 text-ink-soft">
              {architecture.narrative}
            </p>
          </div>

          {dateOfBirth ? (
            <YearTimeline
              dateOfBirth={dateOfBirth}
              architecture={architecture}
            />
          ) : null}
        </>
      ) : null}

      <div className="flex flex-wrap gap-3 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-200 border border-rose-400" />{" "}
          Emotional (3–5–7)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-200 border border-sky-400" />{" "}
          Mental (4–9–2)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-200 border border-emerald-500" />{" "}
          Practical (8–1–6)
        </span>
      </div>
    </div>
  );
}

function ClassicSquareGrid({
  loShu,
  setTip,
}: {
  loShu: LoShuResult;
  setTip: (t: string | null) => void;
}) {
  const CELL_ORDER = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ];
  const planes = [
    {
      numbers: [4, 9, 2],
      present: "border-sky-300/80 bg-sky-100 text-sky-950",
      missing: "border-dashed border-sky-300/60 bg-sky-50/50 text-sky-400",
    },
    {
      numbers: [3, 5, 7],
      present: "border-rose-300/80 bg-rose-100 text-rose-950",
      missing: "border-dashed border-rose-300/60 bg-rose-50/50 text-rose-400",
    },
    {
      numbers: [8, 1, 6],
      present: "border-emerald-300/80 bg-emerald-100 text-emerald-950",
      missing:
        "border-dashed border-emerald-300/60 bg-emerald-50/50 text-emerald-400",
    },
  ];

  return (
    <div className="mx-auto grid max-w-xs grid-cols-3 gap-1.5">
      {CELL_ORDER.flat().map((n) => {
        const plane = planes.find((p) => p.numbers.includes(n))!;
        const count = loShu.grid[n] ?? 0;
        const missing = count === 0;
        const meta = LO_SHU_NUMBER_META[n];
        const tileTip = `${n} · ${meta.trait}${missing ? " · quiet" : ` · ×${count}`}`;
        return (
          <Link
            key={n}
            href={guideHref("lo-shu-number", n)}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setTip(tileTip)}
            onMouseLeave={() => setTip(null)}
            className={`btn-tactile relative flex aspect-square flex-col items-center justify-center rounded-lg border outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              missing ? plane.missing : plane.present
            }`}
          >
            <span className="brand text-xl leading-none">{n}</span>
            <span className="mt-0.5 text-[9px] uppercase tracking-wider opacity-90">
              {missing ? "quiet" : `×${count}`}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
