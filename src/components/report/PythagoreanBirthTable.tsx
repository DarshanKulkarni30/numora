"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChartTipPanel } from "@/components/report/ChartTipPanel";
import { guideHref } from "@/lib/guides/content";
import {
  PYTH_NUMBER_KEYWORD,
  SAT_RADIUS,
  SECTOR_RADIUS,
  WHEEL_CX,
  WHEEL_CY,
  buildPythagoreanWheel,
  curveThrough,
  engineStatusLabel,
  nodePoint,
  polar,
  type PythEngine,
  type PythPlaneId,
  type PythWheel,
} from "@/lib/numerology/pythagoreanWheel";
import type { NumerologySnapshot } from "@/lib/numerology/types";

type Props = {
  dateOfBirth: string;
  snap: NumerologySnapshot;
  fullName?: string;
};

const SECTORS: Array<{ id: PythPlaneId; start: number; end: number }> = [
  { id: "mental", start: 0, end: 120 },
  { id: "emotional", start: 120, end: 240 },
  { id: "practical", start: 240, end: 360 },
];

const ENGINE_STROKE: Record<PythPlaneId, string> = {
  mental: "rgba(7, 89, 133, 0.7)",
  emotional: "rgba(159, 18, 57, 0.68)",
  practical: "rgba(6, 95, 70, 0.68)",
};

const NODE_BTN: Record<PythPlaneId, { present: string; missing: string }> = {
  mental: {
    present:
      "border-sky-300/80 bg-sky-100 text-sky-950 hover:border-gold/60",
    missing:
      "border-dashed border-sky-300/70 bg-sky-50/70 text-sky-500 hover:border-gold/50",
  },
  emotional: {
    present:
      "border-rose-300/80 bg-rose-100 text-rose-950 hover:border-gold/60",
    missing:
      "border-dashed border-rose-300/70 bg-rose-50/70 text-rose-400 hover:border-gold/50",
  },
  practical: {
    present:
      "border-emerald-300/80 bg-emerald-100 text-emerald-950 hover:border-gold/60",
    missing:
      "border-dashed border-emerald-300/70 bg-emerald-50/70 text-emerald-500 hover:border-gold/50",
  },
};

function sectorPath(start: number, end: number, r: number): string {
  const a = polar(start, r);
  const b = polar(end, r);
  return `M ${WHEEL_CX} ${WHEEL_CY} L ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)} Z`;
}

function enginePath(engine: PythEngine): string {
  const [a, m, b] = engine.numbers.map(nodePoint);
  return curveThrough(a, m, b);
}

function strokeWidth(engine: PythEngine): number {
  return Math.min(4.2, 1.1 + engine.strength * 0.45);
}

function overlayPct(n: number): string {
  return `${(n / 200) * 100}%`;
}

const RADAR = {
  mental: { x: 70, y: 14 },
  emotional: { x: 126, y: 114 },
  practical: { x: 14, y: 114 },
  cx: 70,
  cy: 78,
};

function radarPoint(id: PythPlaneId, t: number): { x: number; y: number } {
  const v = RADAR[id];
  return {
    x: RADAR.cx + (v.x - RADAR.cx) * t,
    y: RADAR.cy + (v.y - RADAR.cy) * t,
  };
}

function StrengthDots({ count }: { count: number }) {
  const filled = Math.min(4, count);
  return (
    <span className="inline-flex gap-0.5" aria-label={`Frequency ${count}`}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${
            i < filled ? "bg-ink/70" : "bg-ink/15"
          }`}
        />
      ))}
    </span>
  );
}

export function PythagoreanBirthTable({ dateOfBirth, snap, fullName }: Props) {
  const wheel = useMemo(
    () => buildPythagoreanWheel(dateOfBirth, snap),
    [dateOfBirth, snap],
  );
  const [tip, setTip] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [previewEngine, setPreviewEngine] = useState<string | null>(null);

  const planeById = useMemo(() => {
    return new Map(wheel.planes.map((p) => [p.id, p]));
  }, [wheel.planes]);

  const maxPlane = Math.max(1, ...wheel.planes.map((p) => p.score));
  const radarPts = wheel.planes.map((p) =>
    radarPoint(p.id, p.score / maxPlane),
  );
  const radarD = `M ${radarPts[0].x.toFixed(1)} ${radarPts[0].y.toFixed(1)} L ${radarPts[1].x.toFixed(1)} ${radarPts[1].y.toFixed(1)} L ${radarPts[2].x.toFixed(1)} ${radarPts[2].y.toFixed(1)} Z`;

  const visibleEngines = wheel.engines.filter((e) => {
    if (previewEngine === e.id) return true;
    return e.status !== "quiet";
  });

  function showNode(n: number) {
    const count = wheel.counts[n] ?? 0;
    const plane = planeById.get(
      n <= 3 ? "mental" : n <= 6 ? "emotional" : "practical",
    )!;
    const missing = count === 0;
    const keyword = PYTH_NUMBER_KEYWORD[n];
    const line = [
      `${n} · ${keyword}`,
      `Axis: ${plane.label} · ${plane.represents}`,
      missing
        ? `Quiet halo — growth through ${wheel.growth.find((g) => g.number === n)?.habit ?? "small practices"}. Not a deficit.`
        : `Present ×${count} — ${count >= 3 ? "emphasized" : count === 2 ? "strong" : "stable"} theme on this matrix.`,
      `Satellites on ${n}: ${
        wheel.satellites
          .filter((s) => s.digit === n)
          .map((s) => s.short)
          .join(", ") || "none"
      }`,
    ].join("\n");
    setTip(line);
  }

  function showEngine(e: PythEngine) {
    setTip(
      [
        `${e.name} · ${e.numbers.join("–")}`,
        engineStatusLabel(e.status),
        e.summary,
        e.missing.length
          ? `Quiet links: ${e.missing.map((n) => `${n} ${PYTH_NUMBER_KEYWORD[n]}`).join(", ")}.`
          : "All three nodes are present.",
      ].join("\n"),
    );
  }

  function showSatellite(s: (typeof wheel.satellites)[number]) {
    setTip(
      `${s.label} ${s.raw} · ${PYTH_NUMBER_KEYWORD[s.digit]}\nOrbits the ${s.digit} node. Click the badge in the signature panel for its guide.`,
    );
  }

  const displayName = fullName?.trim() || null;

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        A <span className="font-medium text-ink">Pythagorean personality
        wheel</span> — Western axes 1–2–3 mental, 4–5–6 emotional, 7–8–9
        practical. Different from Lo Shu rows. Nodes scale by how often a digit
        appears among day/month/year and core numbers (masters fold to 1–9).
        Quiet numbers are growth halos, not defects. Reflection only.
      </p>

      <div className="rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            {displayName ? (
              <p className="text-sm font-medium text-ink">{displayName}</p>
            ) : null}
            <p className="text-xs text-ink-soft">
              Birth Day{" "}
              <span className="brand text-base text-ink">{snap.birth_day}</span>
              <span className="mx-1.5 text-ink/30">→</span>
              Life Path{" "}
              <span className="brand text-base text-ink">{snap.life_path}</span>
            </p>
          </div>
          <div className="min-w-[10rem] flex-1 sm:max-w-xs">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Personality contrast
            </p>
            <div
              className="mt-1 h-2 overflow-hidden rounded-full bg-mist"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={wheel.contrast}
              aria-label="Inner versus outer contrast"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-300 via-rose-300 to-emerald-300"
                style={{ width: `${Math.max(8, wheel.contrast)}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-ink-soft">
              {wheel.contrast === 0
                ? "What you want privately and how you come across publicly land on the same number, so people generally get an accurate read on you."
                : wheel.contrast < 50
                  ? "A mild inner / outer texture — nuance, not a split."
                  : "Several tensions in play — see the notes below."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <div className="space-y-4">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-visible">
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full overflow-visible"
              role="img"
              aria-label="Pythagorean personality wheel with three axes"
            >
              {SECTORS.map((s) => {
                const plane = planeById.get(s.id)!;
                return (
                  <path
                    key={s.id}
                    d={sectorPath(s.start, s.end, SECTOR_RADIUS)}
                    fill={plane.fill}
                    stroke={plane.stroke}
                    strokeWidth={0.6}
                  />
                );
              })}
              <circle
                cx={WHEEL_CX}
                cy={WHEEL_CY}
                r={18}
                fill="rgba(255,255,255,0.88)"
                stroke="rgba(35, 79, 150, 0.22)"
                strokeWidth={0.7}
              />
              <text
                x={WHEEL_CX}
                y={WHEEL_CY - 2}
                textAnchor="middle"
                fill="#183a6b"
                fontSize="6"
                fontWeight="600"
              >
                {planeById.get(wheel.dominant)?.label}
              </text>
              <text
                x={WHEEL_CX}
                y={WHEEL_CY + 7}
                textAnchor="middle"
                fill="#355680"
                fontSize="4.5"
              >
                leads
              </text>

              {visibleEngines.map((e) => {
                const quiet = e.status === "quiet" || e.status === "partial";
                return (
                  <path
                    key={e.id}
                    d={enginePath(e)}
                    fill="none"
                    stroke={ENGINE_STROKE[e.origin]}
                    strokeWidth={strokeWidth(e)}
                    strokeLinecap="round"
                    strokeDasharray={quiet ? "1.6 2.4" : undefined}
                    className={
                      e.status === "inPlay" || e.status === "emphasized"
                        ? "pyth-current-pulse"
                        : undefined
                    }
                    opacity={previewEngine === e.id ? 1 : quiet ? 0.55 : 0.85}
                    onMouseEnter={() => showEngine(e)}
                    onMouseLeave={() => setTip(null)}
                    style={{ pointerEvents: "stroke", cursor: "help" }}
                  />
                );
              })}

              {wheel.missing.map((n) => {
                const p = nodePoint(n);
                return (
                  <circle
                    key={`halo-${n}`}
                    cx={p.x}
                    cy={p.y}
                    r={11}
                    fill="none"
                    stroke="rgba(100, 116, 139, 0.45)"
                    strokeWidth={0.7}
                    strokeDasharray="1.2 1.8"
                    className="pyth-halo-shimmer"
                  />
                );
              })}
            </svg>

            {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((n) => {
              const p = nodePoint(n);
              const count = wheel.counts[n] ?? 0;
              const missing = count === 0;
              const planeId =
                n <= 3 ? "mental" : n <= 6 ? "emotional" : "practical";
              const size = missing ? 2.4 : 2.2 + Math.min(count, 4) * 0.28;
              const id = `node-${n}`;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={pinned === id}
                  aria-label={`Number ${n} ${PYTH_NUMBER_KEYWORD[n]}, ${missing ? "quiet" : `present ${count} times`}`}
                  title={`${n} · ${PYTH_NUMBER_KEYWORD[n]}`}
                  onMouseEnter={() => showNode(n)}
                  onMouseLeave={() => {
                    if (pinned !== id) setTip(null);
                  }}
                  onFocus={() => showNode(n)}
                  onBlur={() => {
                    if (pinned !== id) setTip(null);
                  }}
                  onClick={() => {
                    showNode(n);
                    setPinned((cur) => (cur === id ? null : id));
                  }}
                  className={`btn-tactile absolute flex flex-col items-center justify-center rounded-full border text-center outline-none focus-visible:ring-2 focus-visible:ring-gold ${NODE_BTN[planeId][missing ? "missing" : "present"]} ${
                    pinned === id ? "ring-2 ring-gold" : ""
                  }`}
                  style={{
                    left: overlayPct(p.x),
                    top: overlayPct(p.y),
                    width: `${size}rem`,
                    height: `${size}rem`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                  }}
                >
                  <span className="brand text-sm leading-none">{n}</span>
                  <span className="text-[8px] uppercase tracking-wide opacity-90">
                    {missing ? PYTH_NUMBER_KEYWORD[n].slice(0, 4) : `×${count}`}
                  </span>
                </button>
              );
            })}

            {wheel.satellites.map((s) => {
              const p = polar(s.angle, SAT_RADIUS);
              return (
                <button
                  key={s.id}
                  type="button"
                  title={`${s.label} ${s.raw}`}
                  aria-label={`${s.label} ${s.raw}`}
                  onMouseEnter={() => showSatellite(s)}
                  onMouseLeave={() => setTip(null)}
                  onFocus={() => showSatellite(s)}
                  onBlur={() => setTip(null)}
                  className="btn-tactile absolute z-[3] flex h-7 min-w-7 items-center justify-center rounded-full border border-[var(--line)] bg-white/90 px-1.5 text-[9px] font-semibold uppercase tracking-wide text-ink outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  style={{
                    left: overlayPct(p.x),
                    top: overlayPct(p.y),
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {s.short}
                  <span className="brand ml-0.5 text-[10px]">{s.raw}</span>
                </button>
              );
            })}
          </div>

          <ChartTipPanel
            tip={tip}
            empty="Hover a node, current, or satellite. Tap a number to pin its reading. Quiet halos are growth invitations."
          />

          <div className="flex flex-wrap gap-3 text-xs text-ink-soft">
            {wheel.planes.map((p) => (
              <span key={p.id} className="inline-flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full border ${
                    p.id === "mental"
                      ? "border-sky-400 bg-sky-200"
                      : p.id === "emotional"
                        ? "border-rose-400 bg-rose-200"
                        : "border-emerald-500 bg-emerald-200"
                  }`}
                />
                {p.label} ({p.numbers.join("–")})
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-5 border-t border-[var(--line)]" />{" "}
              Current in play
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-5 border-t border-dotted border-slate-500" />{" "}
              Partial / quiet
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-ink-soft">
              Tri-balance
            </p>
            <svg
              viewBox="0 0 140 128"
              className="mx-auto mt-2 h-32 w-full max-w-[12rem]"
              role="img"
              aria-label="Mental, emotional, and practical balance"
            >
              <polygon
                points={`${RADAR.mental.x},${RADAR.mental.y} ${RADAR.emotional.x},${RADAR.emotional.y} ${RADAR.practical.x},${RADAR.practical.y}`}
                fill="rgba(35, 79, 150, 0.04)"
                stroke="rgba(35, 79, 150, 0.22)"
                strokeWidth={0.8}
              />
              <path
                d={radarD}
                fill="rgba(232, 163, 23, 0.18)"
                stroke="rgba(196, 132, 10, 0.65)"
                strokeWidth={1.1}
                strokeLinejoin="round"
              />
              <text
                x={70}
                y={10}
                textAnchor="middle"
                fontSize="7"
                fill="#355680"
              >
                Mental
              </text>
              <text
                x={128}
                y={124}
                textAnchor="end"
                fontSize="7"
                fill="#355680"
              >
                Emotional
              </text>
              <text
                x={12}
                y={124}
                textAnchor="start"
                fontSize="7"
                fill="#355680"
              >
                Practical
              </text>
            </svg>
            <ul className="mt-1 space-y-1 text-[11px] text-ink-soft">
              {wheel.planes.map((p) => (
                <li key={p.id} className="flex justify-between gap-2">
                  <span>{p.label}</span>
                  <span className="text-ink">{p.score}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-ink-soft">
              Energy currents
            </p>
            <ul className="mt-2 space-y-1.5">
              {wheel.engines.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className="btn-tactile w-full rounded-lg border border-transparent px-2 py-1.5 text-left hover:border-[var(--line)] hover:bg-white/80"
                    onMouseEnter={() => {
                      setPreviewEngine(e.id);
                      showEngine(e);
                    }}
                    onMouseLeave={() => {
                      setPreviewEngine(null);
                      setTip(null);
                    }}
                    onFocus={() => {
                      setPreviewEngine(e.id);
                      showEngine(e);
                    }}
                    onBlur={() => {
                      setPreviewEngine(null);
                      setTip(null);
                    }}
                  >
                    <span className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-ink">{e.name}</span>
                      <span className="text-[10px] uppercase tracking-wide text-ink-soft">
                        {engineStatusLabel(e.status)}
                      </span>
                    </span>
                    <span className="text-[11px] text-ink-soft">
                      {e.numbers.join("–")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-ink-soft">
              Growth catalysts
            </p>
            {wheel.growth.length ? (
              <ul className="mt-2 space-y-2">
                {wheel.growth.map((g) => (
                  <li key={g.number} className="text-sm text-ink-soft">
                    <span className="font-medium text-ink">
                      {g.number} · {g.keyword}
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-snug">
                      {g.body}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                Every digit 1–9 appears — look to emphasized nodes for rest, not
                to missing ones for growth.
              </p>
            )}
          </div>
        </div>
      </div>

      <SignaturePanel wheel={wheel} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <h3 className="text-ink">Personality architecture</h3>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {wheel.architecture}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            <span className="font-medium text-ink">Decision flow. </span>
            {wheel.decisionFlow}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <h3 className="text-ink">Birth Day → Life Path</h3>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {wheel.narrative}
          </p>
        </div>
      </div>

      {wheel.tensions.length ? (
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <h3 className="text-ink">Inner tensions</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-ink-soft">
            {wheel.tensions.map((line) => (
              <li key={line.slice(0, 48)}>{line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SignaturePanel({ wheel }: { wheel: PythWheel }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Pythagorean signature
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {wheel.aspects.map((a) => {
          const plane = wheel.planes.find((p) => p.id === a.plane);
          const count = a.digit != null ? (wheel.counts[a.digit] ?? 0) : 0;
          const keyword =
            a.digit != null ? PYTH_NUMBER_KEYWORD[a.digit] : "—";
          if (a.raw === "—" || a.digit == null) {
            return (
              <li
                key={a.id}
                className="rounded-xl border border-dashed border-[var(--line)] px-3 py-2 text-xs text-ink-soft"
              >
                {a.label} —
              </li>
            );
          }
          return (
            <li key={a.id}>
              <Link
                href={guideHref(a.topic, a.raw)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Click for more about ${a.label} ${a.raw}`}
                className={`btn-tactile flex items-start justify-between gap-2 rounded-xl border px-3 py-2 ${plane?.rail ?? "border-[var(--line)] bg-white/70"}`}
              >
                <span>
                  <span className="block text-[10px] uppercase tracking-wider text-ink-soft">
                    {a.label}
                    {plane ? ` · ${plane.label}` : ""}
                  </span>
                  <span className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="brand text-lg leading-none">{a.raw}</span>
                    <span className="text-xs text-ink">{keyword}</span>
                  </span>
                </span>
                <StrengthDots count={count} />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
