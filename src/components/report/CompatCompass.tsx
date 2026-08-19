"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CompatRadar } from "@/components/report/CompatRadar";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import {
  buildCompatCompass,
  visualStateLegend,
  type CompatChannelVisual,
  type CompatCompassModel,
} from "@/lib/numerology/compatCompass";
import { TONE_HINT, type CompatTone } from "@/lib/numerology/compatibility";

type Props = {
  selfNumber: number;
  partner: number;
  romantic: string;
  business: string;
  friendship: string;
  hideRomantic?: boolean;
  vedicPlanet?: boolean;
  /** Prefer Vedic Rasa / Karma / Sangha labels on arcs */
  vedicArcLabels?: boolean;
  systemLabel?: string;
  size?: number;
  className?: string;
  /** Slimmer layout for explorers (hides long tone legend) */
  compact?: boolean;
  /** Extra panel below cards (e.g. psychic interaction) */
  children?: ReactNode;
};

const STATE_CHIP: Record<string, string> = {
  radiant: "border-emerald-300 bg-emerald-50 text-emerald-950",
  supportive: "border-teal-200 bg-teal-50 text-teal-950",
  balanced: "border-slate-200 bg-slate-50 text-slate-800",
  friction: "border-amber-300 bg-amber-50 text-amber-950",
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) {
  const start = polar(cx, cy, r, endDeg);
  const end = polar(cx, cy, r, startDeg);
  const large = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

export function CompatArcWheel({
  model,
  focus,
  onFocus,
  vedicLabels,
  size,
}: {
  model: CompatCompassModel;
  focus: string | null;
  onFocus: (id: string | null) => void;
  vedicLabels: boolean;
  size: number;
}) {
  const cx = 100;
  const cy = 100;
  const n = model.channels.length;
  const sweep = 360 / n;
  const gap = 8;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className="mx-auto max-w-full"
      role="img"
      aria-label={`Compatibility compass for partner ${model.partner}, ${model.centerLabel}`}
    >
      <defs>
        <radialGradient id="compass-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(196 164 108)" stopOpacity="0.35" />
          <stop offset="55%" stopColor="rgb(30 58 107)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="rgb(250 248 243)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r="78" fill="url(#compass-glow)" />
      <circle
        cx={cx}
        cy={cy}
        r="72"
        fill="none"
        stroke="rgb(196 164 108 / 0.25)"
        strokeWidth="0.6"
      />
      <circle
        cx={cx}
        cy={cy}
        r="58"
        fill="none"
        stroke="var(--line)"
        strokeWidth="0.5"
        strokeDasharray="2 3"
      />

      {model.channels.map((ch, i) => {
        const start = i * sweep + gap / 2;
        const end = (i + 1) * sweep - gap / 2;
        const rOuter = 68;
        const rInner = 68 - 10 - ch.intensity * 14;
        const lit = !focus || focus === ch.id;
        const mid = (start + end) / 2;
        const labelPt = polar(cx, cy, 86, mid);
        const iconPt = polar(cx, cy, (rOuter + rInner) / 2, mid);

        return (
          <g key={ch.id} opacity={lit ? 1 : 0.28}>
            <path
              d={describeArc(cx, cy, rOuter, start, end)}
              fill="none"
              stroke={ch.stroke}
              strokeWidth={3.2 + ch.intensity * 2.4}
              strokeLinecap="round"
              strokeDasharray={ch.dashed ? "5 4" : undefined}
              className={
                ch.state === "radiant" || ch.state === "supportive"
                  ? "motion-safe:opacity-95"
                  : undefined
              }
              style={{ cursor: "pointer" }}
              onClick={() => onFocus(focus === ch.id ? null : ch.id)}
              onMouseEnter={() => onFocus(ch.id)}
              onMouseLeave={() => onFocus(null)}
            />
            <path
              d={describeArc(cx, cy, rInner, start, end)}
              fill="none"
              stroke={ch.stroke}
              strokeWidth="1"
              strokeOpacity="0.25"
              style={{ pointerEvents: "none" }}
            />
            {/* hit target */}
            <path
              d={describeArc(cx, cy, 62, start, end)}
              fill="none"
              stroke="transparent"
              strokeWidth="28"
              style={{ cursor: "pointer" }}
              onClick={() => onFocus(focus === ch.id ? null : ch.id)}
              onMouseEnter={() => onFocus(ch.id)}
              onMouseLeave={() => onFocus(null)}
            />
            <text
              x={iconPt.x}
              y={iconPt.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill={ch.stroke}
              style={{ pointerEvents: "none" }}
            >
              {ch.symbol}
            </text>
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="6.5"
              fontWeight="600"
              fill="rgb(28 35 48)"
              style={{ pointerEvents: "none" }}
            >
              {vedicLabels ? ch.vedicLabel : ch.label}
            </text>
          </g>
        );
      })}

      <circle
        cx={cx}
        cy={cy}
        r="26"
        fill="rgb(250 248 243)"
        stroke="rgb(30 58 107)"
        strokeWidth="1.4"
        className="motion-safe:animate-pulse"
      />
      <circle
        cx={cx}
        cy={cy}
        r="22"
        fill="none"
        stroke="rgb(196 164 108 / 0.55)"
        strokeWidth="0.8"
      />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="rgb(30 58 107)"
      >
        {model.partner}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontSize="7"
        fill="rgb(70 82 98)"
      >
        {model.centerSymbol} {model.centerLabel}
      </text>
      {model.partnerPlanet ? (
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fontSize="8"
          fill="rgb(30 58 107)"
        >
          {model.partnerPlanet.symbol}
        </text>
      ) : null}
    </svg>
  );
}

function BondCard({
  channel,
  active,
  vedicLabels,
  onSelect,
}: {
  channel: CompatChannelVisual;
  active: boolean;
  vedicLabels: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`btn-tactile w-full rounded-xl border px-3 py-3 text-left transition ${
        active
          ? "border-ink bg-white shadow-sm"
          : "border-[var(--line)] bg-white/55 hover:border-gold/50"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-ink">
          {vedicLabels ? (
            <>
              {channel.vedicLabel}
              <span className="ml-1.5 text-xs font-normal text-ink-soft">
                {channel.label}
              </span>
            </>
          ) : (
            channel.label
          )}
        </p>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] ${STATE_CHIP[channel.state]}`}
        >
          {channel.symbol} {channel.stateLabel}
        </span>
      </div>
      <p className="mt-1.5 text-xs leading-5 text-ink-soft">{channel.dynamics}</p>
    </button>
  );
}

export function CompatCompass({
  selfNumber,
  partner,
  romantic,
  business,
  friendship,
  hideRomantic = false,
  vedicPlanet = false,
  vedicArcLabels = false,
  systemLabel = "Compatibility Compass",
  size = 260,
  className = "",
  compact = false,
  children,
}: Props) {
  const model = useMemo(
    () =>
      buildCompatCompass({
        selfNumber,
        partner,
        romantic,
        business,
        friendship,
        hideRomantic,
        vedicPlanet,
        systemLabel,
      }),
    [
      selfNumber,
      partner,
      romantic,
      business,
      friendship,
      hideRomantic,
      vedicPlanet,
      systemLabel,
    ],
  );

  const [focus, setFocus] = useState<string | null>(null);
  const [classic, setClassic] = useState(false);

  const active =
    model.channels.find((c) => c.id === focus) ?? null;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            {systemLabel}
          </p>
          <p className="mt-0.5 text-sm text-ink-soft">
            How your tones interact across three bonds
          </p>
        </div>
        <button
          type="button"
          className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs text-ink"
          onClick={() => setClassic((v) => !v)}
        >
          {classic ? "Compass view" : "Classic radar"}
        </button>
      </div>

      {classic ? (
        <CompatRadar
          romantic={romantic}
          business={business}
          friendship={friendship}
          hideRomantic={hideRomantic}
          size={Math.min(size, 240)}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
            <CompatArcWheel
              model={model}
              focus={focus}
              onFocus={setFocus}
              vedicLabels={vedicArcLabels}
              size={size}
            />
            {model.partnerPlanet ? (
              <div className="mt-2 flex justify-center">
                <PlanetIcon planet={model.partnerPlanet} size="sm" />
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            {model.channels.map((ch) => (
              <BondCard
                key={ch.id}
                channel={ch}
                active={focus === ch.id}
                vedicLabels={vedicArcLabels}
                onSelect={() =>
                  setFocus((cur) => (cur === ch.id ? null : ch.id))
                }
              />
            ))}
          </div>
        </div>
      )}

      {active && !classic ? (
        <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3 text-xs leading-5 text-ink-soft">
          <p className="font-medium text-ink">
            {vedicArcLabels ? active.vedicLabel : active.label} ·{" "}
            {active.stateLabel} ({active.tone})
          </p>
          <p className="mt-1">{active.insight}</p>
          <p className="mt-2 text-ink">{active.dynamics}</p>
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3 text-sm leading-6 text-ink">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Combined bond summary
        </p>
        <p className="mt-1">{model.combinedSummary}</p>
        <p className="mt-2 text-xs text-ink-soft">{model.reflectivePractice}</p>
      </div>

      {children}

      {!compact ? (
        <div className="rounded-xl border border-[var(--line)] bg-white/50 px-3 py-3 text-xs leading-5 text-ink-soft">
          <p className="font-medium text-ink">Tone states</p>
          <ul className="mt-2 space-y-1.5">
            {visualStateLegend().map((row) => (
              <li key={row.state}>
                <span className="mr-1.5 font-medium text-ink">
                  {row.symbol} {row.label}
                </span>
                <span className="text-ink-soft">({row.tone})</span> — {row.hint}
              </li>
            ))}
          </ul>
          <ul className="mt-3 space-y-1 border-t border-[var(--line)] pt-2">
            {(
              [
                "Amazing",
                "Favourable",
                "Neutral",
                "Challenging",
              ] as CompatTone[]
            ).map((t) => (
              <li key={t}>
                <strong className="text-ink">{t}</strong> — {TONE_HINT[t]}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
