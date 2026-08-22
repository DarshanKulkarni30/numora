"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import {
  buildYearOutlookMandala,
  type YearOutlookMandalaModel,
} from "@/lib/numerology/yearOutlookMandala";
import type { ProjectedYearCycle } from "@/lib/numerology/vedicYearNumber";

type Props = {
  cycle: ProjectedYearCycle;
  dob: string;
  /** Compact for explorer rows */
  compact?: boolean;
  className?: string;
};

const SYNERGY_CHIP: Record<string, string> = {
  harmony: "border-emerald-300 bg-emerald-50 text-emerald-950",
  near: "border-teal-200 bg-teal-50 text-teal-950",
  contrast: "border-amber-300 bg-amber-50 text-amber-950",
};

function MandalaWheel({
  model,
  onLayer,
}: {
  model: YearOutlookMandalaModel;
  onLayer?: (text: string) => void;
}) {
  const { cycle, planet, season, synergy } = model;
  const stroke = season.stroke;

  return (
    <svg
      viewBox="0 0 220 220"
      className="mx-auto h-auto w-full max-w-sm"
      role="img"
      aria-label={`Year ${cycle.number} mandala, ${season.name}, ${planet.name}`}
    >
      <defs>
        <radialGradient id="year-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgb(196 164 108)" stopOpacity="0.3" />
          <stop offset="60%" stopColor={stroke} stopOpacity="0.08" />
          <stop offset="100%" stopColor="rgb(250 248 243)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Mountain / season backdrop for 8 */}
      {cycle.number === 8 ? (
        <path
          d="M20 175 L70 95 L100 130 L140 80 L200 175 Z"
          fill="rgb(45 55 90 / 0.08)"
          stroke="rgb(45 55 90 / 0.2)"
          strokeWidth="0.8"
          className="origin-bottom motion-safe:animate-rise"
        />
      ) : null}

      <circle cx="110" cy="110" r="100" fill="url(#year-glow)" />

      {/* Outer ring — year number */}
      <circle
        cx="110"
        cy="110"
        r="88"
        fill="none"
        stroke={stroke}
        strokeWidth="3.5"
        strokeDasharray="4 6"
        className="motion-safe:animate-pulse cursor-pointer"
        onMouseEnter={() =>
          onLayer?.(
            `Center ${cycle.number} is this birthday-year. Job: ${model.tiles[0]?.insight ?? ""}.`,
          )
        }
      />
      <circle
        cx="110"
        cy="110"
        r="88"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeOpacity="0.35"
      />

      {/* Second — weekday */}
      <circle
        cx="110"
        cy="110"
        r="72"
        fill="none"
        stroke="rgb(196 164 108 / 0.55)"
        strokeWidth="2.2"
      />
      <text
        x="110"
        y="42"
        textAnchor="middle"
        fontSize="7"
        fill="rgb(70 82 98)"
        className="cursor-pointer"
        onMouseEnter={() =>
          onLayer?.(
            `Weekday of that year’s birthday (${cycle.weekdayLabel}) counts as ${cycle.weekdayDigit} in this school.`,
          )
        }
      >
        {cycle.weekdayLabel} → {cycle.weekdayDigit}
      </text>

      {/* Third — month + day */}
      <circle
        cx="110"
        cy="110"
        r="56"
        fill="none"
        stroke="var(--line)"
        strokeWidth="1.5"
        strokeDasharray="2 3"
      />
      <text
        x="110"
        y="58"
        textAnchor="middle"
        fontSize="6.5"
        fill="rgb(70 82 98)"
      >
        M{cycle.month} · D{cycle.day}
      </text>
      <circle
        cx="110"
        cy="110"
        r="56"
        fill="transparent"
        className="cursor-pointer"
        onMouseEnter={() =>
          onLayer?.(
            `Birth month ${cycle.month} and day ${cycle.day} go into this year sum. They do not change if you change your name.`,
          )
        }
      />

      {/* Inner — Personal Year synergy */}
      <circle
        cx="110"
        cy="110"
        r="42"
        fill="none"
        stroke={
          synergy.mode === "harmony"
            ? "rgb(16 185 129)"
            : synergy.mode === "near"
              ? "rgb(45 122 120)"
              : "rgb(217 119 6)"
        }
        strokeWidth="2.4"
        strokeDasharray={synergy.mode === "contrast" ? "5 4" : undefined}
        className="motion-safe:animate-pulse"
      />
      <text
        x="110"
        y="78"
        textAnchor="middle"
        fontSize="6"
        fill="rgb(70 82 98)"
      >
        PY {synergy.personalYear} · {synergy.label}
      </text>
      <circle
        cx="110"
        cy="110"
        r="42"
        fill="transparent"
        className="cursor-pointer"
        onMouseEnter={() => onLayer?.(synergy.summary)}
      />

      {/* Center */}
      <circle
        cx="110"
        cy="110"
        r="30"
        fill="rgb(250 248 243)"
        stroke="rgb(30 58 107)"
        strokeWidth="1.5"
      />
      <text
        x="110"
        y="106"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="rgb(30 58 107)"
      >
        {cycle.number}
      </text>
      <text
        x="110"
        y="122"
        textAnchor="middle"
        fontSize="12"
        fill={stroke}
      >
        {planet.symbol}
      </text>
    </svg>
  );
}

export function YearOutlookMandala({
  cycle,
  dob,
  compact = false,
  className = "",
}: Props) {
  const model = useMemo(
    () => buildYearOutlookMandala(cycle, dob),
    [cycle, dob],
  );
  const [layerTip, setLayerTip] = useState<string | null>(null);

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`rounded-xl border border-[var(--line)] bg-gradient-to-br p-3 ${model.season.tint}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Birthday-year {model.cycle.number}
            </p>
            <p className="text-sm text-ink">{model.tiles[2]?.headline}</p>
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${SYNERGY_CHIP[model.synergy.mode]}`}
          >
            {model.synergy.label}
          </span>
        </div>
        <MandalaWheel model={model} onLayer={setLayerTip} />
        <div className="mt-1 flex justify-center">
          <PlanetIcon planet={model.planet} size="sm" />
        </div>
        <p className="mt-2 text-center text-sm text-ink">{model.combined}</p>
        <p className="mt-1 text-center text-xs text-ink-soft">
          {layerTip ??
            "Tap or hover a ring: weekday, birth month/day, Western year, or the center birthday-year."}
        </p>
      </div>

      {!compact ? (
        <div className="grid gap-2 sm:grid-cols-3">
          {model.tiles.map((tile) => (
            <div
              key={tile.id}
              className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3"
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                <span className="mr-1" aria-hidden>
                  {tile.glyph}
                </span>
                {tile.title}
              </p>
              <p className="mt-1 text-sm font-medium text-ink">{tile.headline}</p>
              <p className="mt-1.5 text-xs leading-5 text-ink-soft">
                {tile.insight}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          How this year was derived
        </p>
        <div className="relative mt-3 flex flex-wrap items-center gap-2">
          <div
            className="pointer-events-none absolute left-2 right-2 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent sm:block"
            aria-hidden
          />
          {model.calcCapsules.map((c) => (
            <div
              key={c.id}
              className="relative rounded-xl border border-[var(--line)] bg-gradient-to-b from-white to-mist/40 px-3 py-2 text-center"
            >
              <p className="text-[9px] uppercase tracking-wider text-ink-soft">
                {c.label}
              </p>
              <p className="brand text-lg text-ink">{c.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink">
          Sum{" "}
          <span className="font-medium">{model.cycle.compound}</span>
          {" → "}
          reduce{" "}
          <Link
            href={`/guide/projected-year/${model.cycle.number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="brand font-medium underline-offset-2 hover:underline"
          >
            {model.cycle.number}
          </Link>
        </p>
      </div>

      <p className="text-xs leading-5 text-ink-soft">{model.synergy.summary}</p>
      {!compact ? (
        <p className="text-xs leading-5 text-ink-soft">
          {model.reflectivePractice}
        </p>
      ) : null}
    </div>
  );
}
