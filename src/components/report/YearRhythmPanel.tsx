"use client";

import { useId, useMemo, useState } from "react";
import { ChartTipPanel } from "@/components/report/ChartTipPanel";
import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import { LearningConceptLink } from "@/components/learning/LearningConceptLink";
import {
  buildYearRhythm,
  type RhythmLayer,
  type RhythmLayerId,
} from "@/lib/numerology/yearRhythm";
import type { NumerologyReport } from "@/lib/numerology/types";

type Props = {
  personalYear: NumerologyReport["personal_year"];
  personalMonth: NumerologyReport["personal_month"];
  projectedYear?: NumerologyReport["projected_year"];
  sunSignId?: string | null;
  sunSignLabel?: string | null;
  /** When nested in TimingDashboard */
  hideSectionTitle?: boolean;
};

const RING: Record<RhythmLayerId, { r: number; width: number }> = {
  year: { r: 82, width: 20 },
  outlook: { r: 60, width: 18 },
  month: { r: 40, width: 16 },
};

function layerTip(layer: RhythmLayer): string {
  return [
    `${layer.label} ${layer.raw} · ${layer.season.season}`,
    `${layer.season.keyword} · ${layer.season.element}`,
    layer.nature ? `Nature: ${layer.nature}` : "",
    layer.insight,
  ]
    .filter(Boolean)
    .join("\n");
}

export function YearRhythmPanel({
  personalYear,
  personalMonth,
  projectedYear,
  sunSignId,
  sunSignLabel,
  hideSectionTitle = false,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const rhythm = useMemo(
    () =>
      buildYearRhythm({
        personalYear: personalYear.number,
        personalMonth: personalMonth.number,
        outlook: projectedYear?.number,
        yearNature: personalYear.nature,
        yearTheme: personalYear.theme,
        monthTheme: personalMonth.theme,
        monthAdvice: personalMonth.advice,
        sunSignId,
      }),
    [personalYear, personalMonth, projectedYear, sunSignId],
  );
  const [tip, setTip] = useState<string | null>(null);
  const [selected, setSelected] = useState<RhythmLayerId | null>(null);
  const selectedLayer = rhythm.layers.find((l) => l.id === selected) ?? null;

  function toggle(id: RhythmLayerId) {
    const next = selected === id ? null : id;
    setSelected(next);
    const layer = rhythm.layers.find((l) => l.id === id);
    if (next && layer) setTip(layerTip(layer));
  }

  return (
    <div className="space-y-5">
      {!hideSectionTitle ? (
        <div>
          <h2 className="text-xl text-ink">Annual rhythm</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Your year’s movement, this month’s pacing, and sun-sign tone — as
            weather, not a calendar of events.{" "}
            <LearningConceptLink conceptKey="personal-year" />
            {" · "}
            <LearningConceptLink conceptKey="personal-month" />
            {" · "}
            <LearningConceptLink conceptKey="projected-year" />
          </p>
          {personalYear.range_label ? (
            <p className="mt-1 text-xs text-ink-soft">
              {personalYear.range_label}
            </p>
          ) : null}
        </div>
      ) : (
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Annual rhythm
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Personal Year · Month · Outlook rings — weather, not events.
          </p>
          {personalYear.range_label ? (
            <p className="mt-1 text-xs text-ink-soft">
              {personalYear.range_label}
            </p>
          ) : null}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <div className="space-y-4">
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <svg
              viewBox="0 0 200 200"
              className="h-full w-full overflow-visible"
              role="img"
              aria-label="Year rhythm wheel with Personal Year, outlook, and month rings"
            >
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="rgba(255,255,255,0.55)"
                stroke="rgba(13, 159, 110, 0.16)"
                strokeWidth="0.6"
              />
              {rhythm.layers.map((layer) => {
                const ring = RING[layer.id];
                const active = selected === layer.id;
                return (
                  <circle
                    key={layer.id}
                    cx="100"
                    cy="100"
                    r={ring.r}
                    fill="none"
                    stroke={layer.season.stroke}
                    strokeWidth={ring.width}
                    className={
                      layer.id === "year"
                        ? "year-rhythm-wave"
                        : "year-rhythm-pulse"
                    }
                    strokeDasharray={layer.id === "year" ? "6 3.5" : undefined}
                    opacity={selected && !active ? 0.4 : 0.92}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setTip(layerTip(layer))}
                    onMouseLeave={() => setTip(null)}
                    onClick={() => toggle(layer.id)}
                  />
                );
              })}
              <circle
                cx="100"
                cy="100"
                r="26"
                fill="rgba(255,255,255,0.94)"
                stroke="rgba(35, 79, 150, 0.18)"
                strokeWidth="0.7"
              />
              <text
                x="100"
                y={rhythm.sun ? 96 : 102}
                textAnchor="middle"
                fill="#183a6b"
                fontSize={rhythm.sun ? 18 : 10}
              >
                {rhythm.sun ? rhythm.sun.symbol : "·"}
              </text>
              {rhythm.sun ? (
                <text
                  x="100"
                  y="112"
                  textAnchor="middle"
                  fill="#355680"
                  fontSize="5"
                >
                  {rhythm.sun.name}
                </text>
              ) : (
                <text
                  x="100"
                  y="110"
                  textAnchor="middle"
                  fill="#355680"
                  fontSize="4.5"
                >
                  sun sign
                </text>
              )}
            </svg>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {rhythm.layers.map((layer) => (
              <button
                key={layer.id}
                type="button"
                aria-pressed={selected === layer.id}
                onClick={() => toggle(layer.id)}
                onMouseEnter={() => setTip(layerTip(layer))}
                onMouseLeave={() => setTip(null)}
                className={`btn-tactile rounded-full border px-3 py-1.5 text-xs ${
                  selected === layer.id
                    ? "border-ink bg-ink text-paper"
                    : "border-[var(--line)] bg-white/70 text-ink"
                }`}
              >
                <span className="mr-1 opacity-80">{layer.season.glyph}</span>
                {layer.role} · {layer.raw}
              </button>
            ))}
          </div>

          <ChartTipPanel
            tip={tip}
            empty="Tap a ring for that timing layer. Center is tropical sun sign from month and day."
          />
        </div>

        <div className="space-y-3">
          {rhythm.layers.map((layer) => (
            <article
              key={layer.id}
              className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                {layer.role}
              </p>
              <p className="mt-0.5 flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-ink">{layer.label}</span>
                <GuideNumberLink
                  topic={
                    layer.id === "year"
                      ? "personal-year"
                      : layer.id === "month"
                        ? "personal-month"
                        : "projected-year"
                  }
                  value={layer.raw}
                  label={layer.label}
                  className="brand text-lg text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
                />
              </p>
              <p className="text-xs text-ink-soft">
                {layer.season.glyph} {layer.season.season} · {layer.season.keyword}
                {layer.nature ? ` · ${layer.nature}` : ""}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-ink-soft">
                {layer.insight}
              </p>
            </article>
          ))}
          {rhythm.sun ? (
            <article className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                Center
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink">
                {rhythm.sun.symbol} {sunSignLabel || rhythm.sun.name}
              </p>
              <p className="text-xs text-ink-soft">
                {rhythm.sun.element} · {rhythm.sun.modality}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-ink-soft">
                {rhythm.sunInfluence}
              </p>
            </article>
          ) : null}
        </div>
      </div>

      {selectedLayer ? (
        <p className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3 text-sm text-ink-soft">
          {selectedLayer.insight}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <h3 className="text-ink">Rhythm dynamics</h3>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{rhythm.summary}</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{rhythm.yearMonth}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <h3 className="text-ink">Season &amp; practice</h3>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{rhythm.seasonal}</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            <span className="font-medium text-ink">This month. </span>
            {rhythm.practice}
          </p>
        </div>
      </div>
    </div>
  );
}
