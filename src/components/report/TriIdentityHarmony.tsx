"use client";

import { useMemo, useState } from "react";
import {
  buildTriIdentityHarmony,
  type HarmonyPair,
  type TriIdentityHarmony as TriModel,
} from "@/lib/numerology/triIdentityHarmony";
import { CORE_TRAIT } from "@/lib/numerology/meanings";
import {
  TRIO_BAND_ICON,
  type TrioBand,
  type TrioHit,
} from "@/lib/numerology/trioMatrix";

const BAND_CHIP: Record<TrioBand, string> = {
  amazing: "border-emerald-300 bg-emerald-50 text-emerald-950",
  favourable: "border-teal-200 bg-teal-50 text-teal-950",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  friction: "border-amber-300 bg-amber-50 text-amber-950",
  block: "border-rose-200 bg-rose-50 text-rose-950",
};

type Props = {
  hit: TrioHit;
  className?: string;
};

function vertexPoints() {
  // Name top, Birth left, Destiny right
  return {
    name: { x: 100, y: 22 },
    birth: { x: 28, y: 118 },
    destiny: { x: 172, y: 118 },
    center: { x: 100, y: 82 },
  };
}

function pairEndpoints(
  id: HarmonyPair["id"],
  pts: ReturnType<typeof vertexPoints>,
) {
  if (id === "birth-destiny") return [pts.birth, pts.destiny];
  if (id === "destiny-name") return [pts.destiny, pts.name];
  return [pts.birth, pts.name];
}

function mid(
  a: { x: number; y: number },
  b: { x: number; y: number },
) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function TriIdentityHarmony({ hit, className = "" }: Props) {
  const model = useMemo(() => buildTriIdentityHarmony(hit), [hit]);
  const [focus, setFocus] = useState<string | null>(null);
  const pts = vertexPoints();

  const activePair =
    model.pairs.find((p) => p.id === focus) ?? null;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
          <svg
            viewBox="0 0 200 140"
            className="mx-auto h-auto w-full max-w-md"
            role="img"
            aria-label={`${model.centerWord}: ${model.birthLabel} ${model.birth}, ${model.destinyLabel} ${model.destiny}, ${model.nameLabel} ${model.name}`}
          >
            {model.pairs.map((pair) => {
              const [a, b] = pairEndpoints(pair.id, pts);
              const m = mid(a, b);
              const lit = !focus || focus === pair.id;
              return (
                <g key={pair.id} opacity={lit ? 1 : 0.25}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={pair.stroke}
                    strokeWidth={pair.strokeWidth}
                    strokeDasharray={pair.dashed ? "3 2.5" : undefined}
                    strokeLinecap="round"
                    className={
                      pair.band === "amazing" || pair.band === "favourable"
                        ? "motion-safe:opacity-95"
                        : undefined
                    }
                  />
                  {/* hit target */}
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke="transparent"
                    strokeWidth={12}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setFocus((cur) => (cur === pair.id ? null : pair.id))
                    }
                    onMouseEnter={() => setFocus(pair.id)}
                    onMouseLeave={() => setFocus(null)}
                  />
                  <text
                    x={m.x}
                    y={m.y - 3}
                    textAnchor="middle"
                    fontSize="8"
                    fill="rgb(28 35 48)"
                    style={{ pointerEvents: "none" }}
                  >
                    {pair.icon}
                  </text>
                </g>
              );
            })}

            {/* Center score */}
            <circle
              cx={pts.center.x}
              cy={pts.center.y}
              r="18"
              fill="rgb(250 248 243)"
              stroke="rgb(180 83 9)"
              strokeWidth="1.2"
              className="motion-safe:animate-pulse"
            />
            <text
              x={pts.center.x}
              y={pts.center.y - 2}
              textAnchor="middle"
              fontSize="7"
              fontWeight="600"
              fill="rgb(30 58 107)"
            >
              {TRIO_BAND_ICON[model.centerBand]}
            </text>
            <text
              x={pts.center.x}
              y={pts.center.y + 8}
              textAnchor="middle"
              fontSize="5.5"
              fill="rgb(70 82 98)"
            >
              {model.centerLabel}
            </text>

            <Vertex
              x={pts.name.x}
              y={pts.name.y}
              digit={model.name}
              label={model.nameLabel}
              onFocus={() => setFocus("destiny-name")}
              onBlur={() => setFocus(null)}
            />
            <Vertex
              x={pts.birth.x}
              y={pts.birth.y}
              digit={model.birth}
              label={model.birthLabel}
              onFocus={() => setFocus("birth-destiny")}
              onBlur={() => setFocus(null)}
            />
            <Vertex
              x={pts.destiny.x}
              y={pts.destiny.y}
              digit={model.destiny}
              label={model.destinyLabel}
              onFocus={() => setFocus("birth-name")}
              onBlur={() => setFocus(null)}
            />
          </svg>
          <p className="mt-1 text-center text-xs text-ink-soft">
            {activePair
              ? `${activePair.icon} ${activePair.title}`
              : "Tap a line or vertex for pair detail"}
          </p>
        </div>

        <div className="space-y-2">
          <VertexCard
            label={model.birthLabel}
            digit={model.birth}
            accent="navy"
          />
          <VertexCard
            label={model.destinyLabel}
            digit={model.destiny}
            accent="teal"
          />
          <VertexCard
            label={model.nameLabel}
            digit={model.name}
            accent="gold"
          />
          <div
            className={`rounded-xl border px-3 py-2 text-center text-xs ${BAND_CHIP[model.centerBand]}`}
          >
            <p className="font-medium">
              {model.centerWord} · {model.centerLabel}
            </p>
          </div>
        </div>
      </div>

      {activePair ? (
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Pair interaction
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            {activePair.icon} {activePair.title}
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">
            {activePair.narrative}
          </p>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3 md:col-span-1">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Harmony narrative
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {model.narrative}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Growth advice
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {model.growthAdvice}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Reflective practice
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {model.reflectivePractice}
          </p>
        </div>
      </div>
    </div>
  );
}

function Vertex({
  x,
  y,
  digit,
  label,
  onFocus,
  onBlur,
}: {
  x: number;
  y: number;
  digit: number;
  label: string;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <g
      style={{ cursor: "pointer" }}
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
      onClick={onFocus}
    >
      <circle
        cx={x}
        cy={y}
        r="14"
        fill="rgb(250 248 243)"
        stroke="rgb(30 58 107)"
        strokeWidth="1.2"
      />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="rgb(30 58 107)"
      >
        {digit}
      </text>
      <text
        x={x}
        y={y + 22}
        textAnchor="middle"
        fontSize="5.5"
        fill="rgb(70 82 98)"
      >
        {label}
      </text>
    </g>
  );
}

function VertexCard({
  label,
  digit,
  accent,
}: {
  label: string;
  digit: number;
  accent: "navy" | "teal" | "gold";
}) {
  const ring =
    accent === "navy"
      ? "border-[var(--ink)]/30"
      : accent === "teal"
        ? "border-teal-300/60"
        : "border-gold/50";
  return (
    <div className={`rounded-xl border bg-white/70 px-3 py-2 ${ring}`}>
      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
        {label}
      </p>
      <p className="brand text-xl text-ink">{digit}</p>
      <p className="text-xs text-ink-soft">
        {CORE_TRAIT[digit] ?? `Tone ${digit}`}
      </p>
    </div>
  );
}

/** Expose model builder for PDF callers. */
export function triHarmonyFromHit(hit: TrioHit): TriModel {
  return buildTriIdentityHarmony(hit);
}
