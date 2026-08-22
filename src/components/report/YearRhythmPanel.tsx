"use client";

import { useMemo, useState } from "react";
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
  dateOfBirth?: string | null;
  /** When nested in TimingDashboard */
  hideSectionTitle?: boolean;
};

type Focus = RhythmLayerId | "astro";

const CX = 120;
const CY = 120;
const CLOCK_R = 88;
const OUTLOOK_R = 68;
const MONTH_R = 50;

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arcPath(r: number, startDeg: number, endDeg: number, gap = 1.4) {
  const a0 = startDeg + gap;
  const a1 = endDeg - gap;
  const s = polar(r, a0);
  const e = polar(r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

function layerTip(layer: RhythmLayer): string {
  return [
    `${layer.role} · ${layer.label} ${layer.raw} · ${layer.season.verb}`,
    `${layer.season.season} · ${layer.season.keyword}`,
    layer.nature ? `Nature: ${layer.nature}` : "",
    layer.job,
    layer.scan,
  ]
    .filter(Boolean)
    .join("\n");
}

function guideTopic(id: RhythmLayerId) {
  if (id === "year") return "personal-year" as const;
  if (id === "month") return "personal-month" as const;
  return "projected-year" as const;
}

export function YearRhythmPanel({
  personalYear,
  personalMonth,
  projectedYear,
  sunSignId,
  sunSignLabel,
  dateOfBirth,
  hideSectionTitle = false,
}: Props) {
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
        dateOfBirth,
      }),
    [personalYear, personalMonth, projectedYear, sunSignId, dateOfBirth],
  );
  const [tip, setTip] = useState<string | null>(null);
  const [selected, setSelected] = useState<Focus | null>(null);
  const year = rhythm.layers[0]!;
  const outlook = rhythm.layers[1]!;
  const month = rhythm.layers[2]!;
  const now = rhythm.clock.sectors[rhythm.clock.nowIndex]!;

  function focus(id: Focus) {
    const next = selected === id ? null : id;
    setSelected(next);
    if (!next) {
      setTip(null);
      return;
    }
    if (next === "astro") {
      setTip(
        [
          `Astro season · ${rhythm.sun?.symbol ?? ""} ${sunSignLabel || rhythm.sun?.name || "Sun sign"}`,
          rhythm.sun ? `${rhythm.sun.element} · ${rhythm.sun.modality} · ${rhythm.sunVerb}` : "",
          "Tropical sign from month and day — backdrop, not a numerology number.",
          rhythm.sunInfluence,
        ]
          .filter(Boolean)
          .join("\n"),
      );
      return;
    }
    const layer = rhythm.layers.find((l) => l.id === next);
    if (layer) setTip(layerTip(layer));
  }

  const clockHint = rhythm.clock.fromBirthday
    ? `Clock starts at your birthday (${now.label === rhythm.clock.sectors[0]!.label ? "this sector" : rhythm.clock.sectors[0]!.label}). Now: ${now.label}.`
    : `Clock starts in January (add a date of birth for a birthday start). Now: ${now.label}.`;

  return (
    <div className="space-y-5">
      {!hideSectionTitle ? (
        <div>
          <h2 className="text-xl text-ink">Annual rhythm</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Year clock, this month, and a second birthday-year clock.{" "}
            {rhythm.weatherPrinciple}{" "}
            <LearningConceptLink conceptKey="personal-year" />
            {" · "}
            <LearningConceptLink conceptKey="personal-month" />
            {" · "}
            <LearningConceptLink conceptKey="projected-year" />
          </p>
          {personalYear.range_label ? (
            <p className="mt-1 text-xs text-ink-soft">{personalYear.range_label}</p>
          ) : null}
        </div>
      ) : (
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Annual rhythm
          </p>
          <p className="mt-1 text-sm text-ink-soft">{rhythm.weatherPrinciple}</p>
          {personalYear.range_label ? (
            <p className="mt-1 text-xs text-ink-soft">{personalYear.range_label}</p>
          ) : null}
        </div>
      )}

      <div className="year-rhythm-mix rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Your current rhythm
        </p>
        <p className="brand mt-1 text-2xl text-ink">{rhythm.mix.mixLabel}</p>
        <p className="mt-1 text-sm text-ink">
          Year {year.raw}: {year.season.scan}
        </p>
        <p className="text-sm text-ink">
          Month {month.raw}: {month.season.scan}
        </p>
        <p className="mt-1 text-xs text-ink-soft">
          Together: {rhythm.mix.bestUse} Watch: {rhythm.mix.watchFor}
        </p>
        <p className="mt-1 text-xs text-ink-soft">{rhythm.mix.outlookNote}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <div className="space-y-4">
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <svg
              viewBox="0 0 240 240"
              className="h-full w-full overflow-visible"
              role="img"
              aria-label={`Personal Year clock from ${rhythm.clock.sectors[0]!.label}, now ${now.label}. Month ${month.raw} ${month.season.verb}.`}
            >
              <circle
                cx={CX}
                cy={CY}
                r="114"
                fill="rgba(255,255,255,0.55)"
                stroke="rgba(13, 159, 110, 0.14)"
                strokeWidth="0.6"
              />
              {rhythm.clock.sectors.map((sector) => {
                const mid = (sector.startDeg + sector.endDeg) / 2;
                const label = polar(108, mid);
                const activeYear = selected === "year";
                return (
                  <g key={sector.index}>
                    <path
                      d={arcPath(CLOCK_R, sector.startDeg, sector.endDeg)}
                      fill="none"
                      stroke={year.season.stroke}
                      strokeWidth={sector.isNow ? 18 : 13}
                      strokeLinecap="butt"
                      className={sector.isNow ? "year-rhythm-now" : "year-rhythm-wave"}
                      opacity={
                        selected && !activeYear ? 0.35 : sector.isNow ? 1 : 0.72
                      }
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => {
                        setTip(
                          [
                            `Climate · Personal Year ${year.raw} · ${year.season.verb}`,
                            sector.isStart
                              ? `${sector.label} — cycle begins here`
                              : sector.isNow
                                ? `${sector.label} — you are here`
                                : sector.label,
                            clockHint,
                            year.scan,
                          ].join("\n"),
                        );
                      }}
                      onMouseLeave={() => setTip(null)}
                      onClick={() => focus("year")}
                    />
                    <text
                      x={label.x}
                      y={label.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#355680"
                      fontSize="6.5"
                      fontWeight={sector.isNow ? 650 : 400}
                      className="pointer-events-none"
                    >
                      {sector.label}
                    </text>
                  </g>
                );
              })}
              <circle
                cx={CX}
                cy={CY}
                r={OUTLOOK_R}
                fill="none"
                stroke={outlook.season.stroke}
                strokeWidth="5"
                strokeDasharray="2.5 3.5"
                opacity={selected && selected !== "outlook" ? 0.28 : 0.55}
                className="year-rhythm-pulse"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setTip(layerTip(outlook))}
                onMouseLeave={() => setTip(null)}
                onClick={() => focus("outlook")}
              />
              <circle
                cx={CX}
                cy={CY}
                r={MONTH_R}
                fill={`${month.season.fill}22`}
                stroke={month.season.stroke}
                strokeWidth="7"
                opacity={selected && selected !== "month" ? 0.4 : 0.95}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setTip(layerTip(month))}
                onMouseLeave={() => setTip(null)}
                onClick={() => focus("month")}
              />
              <circle
                cx={CX}
                cy={CY}
                r="36"
                fill="rgba(255,255,255,0.96)"
                stroke="rgba(35, 79, 150, 0.16)"
                strokeWidth="0.7"
                style={{ cursor: "pointer" }}
                onMouseEnter={() =>
                  setTip(
                    [
                      `Astro season · ${rhythm.sun?.symbol ?? ""} ${sunSignLabel || rhythm.sun?.name || "Sun sign"}`,
                      "Tropical sign from month and day — backdrop, not a numerology number.",
                      rhythm.sunInfluence,
                    ]
                      .filter(Boolean)
                      .join("\n"),
                  )
                }
                onMouseLeave={() => setTip(null)}
                onClick={() => focus("astro")}
              />
              <text
                x={CX}
                y={rhythm.sun ? 108 : 116}
                textAnchor="middle"
                fill="#183a6b"
                fontSize="11"
                fontWeight="650"
                className="pointer-events-none"
              >
                {month.raw}
              </text>
              <text
                x={CX}
                y={rhythm.sun ? 118 : 128}
                textAnchor="middle"
                fill="#183a6b"
                fontSize="6"
                letterSpacing="0.12em"
                className="pointer-events-none"
              >
                {month.season.verb}
              </text>
              {rhythm.sun ? (
                <>
                  <text
                    x={CX}
                    y="130"
                    textAnchor="middle"
                    fill="#355680"
                    fontSize="8"
                    className="pointer-events-none"
                  >
                    {rhythm.sun.symbol}
                  </text>
                  <text
                    x={CX}
                    y="140"
                    textAnchor="middle"
                    fill="#5a6d82"
                    fontSize="4.2"
                    letterSpacing="0.08em"
                    className="pointer-events-none"
                  >
                    ASTRO SEASON
                  </text>
                </>
              ) : (
                <text
                  x={CX}
                  y="140"
                  textAnchor="middle"
                  fill="#5a6d82"
                  fontSize="4.2"
                  className="pointer-events-none"
                >
                  astro season
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
                onClick={() => focus(layer.id)}
                onMouseEnter={() => setTip(layerTip(layer))}
                onMouseLeave={() => setTip(null)}
                className={`btn-tactile rounded-full border px-3 py-1.5 text-xs ${
                  selected === layer.id
                    ? "border-ink bg-ink text-paper"
                    : "border-[var(--line)] bg-white/70 text-ink"
                }`}
              >
                {layer.role} · {layer.raw} {layer.season.verb}
              </button>
            ))}
            {rhythm.sun ? (
              <button
                type="button"
                aria-pressed={selected === "astro"}
                onClick={() => focus("astro")}
                className={`btn-tactile rounded-full border px-3 py-1.5 text-xs ${
                  selected === "astro"
                    ? "border-ink bg-ink text-paper"
                    : "border-[var(--line)] bg-white/70 text-ink"
                }`}
              >
                Astro · {rhythm.sun.symbol} {rhythm.sunVerb}
              </button>
            ) : null}
          </div>

          <ChartTipPanel
            tip={tip}
            empty={`${clockHint} Tap a month tick for climate, the dashed tint for outlook, the inner disc for this month. Center caption is astro season — not a numerology number.`}
          />
        </div>

        <div className="space-y-3">
          {rhythm.layers.map((layer) => (
            <article
              key={layer.id}
              className={`rounded-xl border bg-white/55 px-4 py-3 ${
                selected === layer.id
                  ? "border-ink/40 shadow-sm"
                  : "border-[var(--line)]"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                {layer.role}
              </p>
              <p className="mt-0.5 flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-ink">
                  {layer.season.verb}
                  <span className="ml-1.5 text-ink-soft">{layer.label}</span>
                </span>
                <GuideNumberLink
                  topic={guideTopic(layer.id)}
                  value={layer.raw}
                  label={layer.label}
                  className="brand text-lg text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
                />
              </p>
              <p className="text-xs text-ink-soft">
                {layer.season.keyword}
                {layer.nature ? ` · ${layer.nature}` : ""}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-ink-soft">
                {layer.scan}
              </p>
            </article>
          ))}
          {rhythm.sun ? (
            <article
              className={`rounded-xl border bg-white/55 px-4 py-3 ${
                selected === "astro"
                  ? "border-ink/40 shadow-sm"
                  : "border-[var(--line)]"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                Astro season
              </p>
              <p className="mt-0.5 text-sm font-medium text-ink">
                {rhythm.sunVerb} · {rhythm.sun.symbol}{" "}
                {sunSignLabel || rhythm.sun.name}
              </p>
              <p className="text-xs text-ink-soft">
                {rhythm.sun.element} · {rhythm.sun.modality} · backdrop
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-ink-soft">
                Tropical sign from month and day — not a numerology number.
              </p>
            </article>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-4">
        <h3 className="text-ink">Current rhythm</h3>
        <p className="brand mt-1 text-xl text-ink">{rhythm.mix.mixLabel}</p>
        <p className="mt-2 text-sm leading-6 text-ink">{rhythm.mix.tension}</p>
        <p className="mt-1 text-sm leading-6 text-ink-soft">{rhythm.mix.opportunity}</p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{rhythm.yearMonth}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <h3 className="text-ink">Best use of this month</h3>
          <p className="mt-2 text-sm leading-6 text-ink">{rhythm.mix.bestUse}</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            <span className="font-medium text-ink">Practice. </span>
            {rhythm.practice}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <h3 className="text-ink">Watch for</h3>
          <p className="mt-2 text-sm leading-6 text-ink">{rhythm.mix.watchFor}</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{rhythm.seasonal}</p>
        </div>
      </div>
    </div>
  );
}
