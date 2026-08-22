"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { VedicSquareGlyph } from "@/components/report/VedicSquareGlyph";
import { buildVedicSquareArchitecture } from "@/lib/numerology/vedicSquareArchitecture";
import {
  digitalRoot,
  layerContextLine,
  NINE_NOTE,
  REDUCTION_TIP,
  squareDigitGuide,
  VEDIC_SQUARE,
} from "@/lib/numerology/vedicSquare";

type HighlightSource = "psychic" | "destiny" | "name" | "unit" | "manual";

type Props = {
  psychic: string;
  destiny: string;
  nameNumber: string;
  unitName?: string;
};

function Meter({
  label,
  value,
  help,
}: {
  label: string;
  value: number;
  /** What a high bar actually means, so the percentage is not read as a grade. */
  help: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div title={`${label}: ${pct}% — ${help}`}>
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-ink-soft">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <p className="text-[10px] leading-4 text-ink-soft">{help}</p>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--line)]/50">
        <div
          className="h-full rounded-full bg-gold-deep/80 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Build a simple constellation path through positions (row/col 1–9). */
function constellationPath(
  positions: { row: number; col: number }[],
  cell: (row: number, col: number) => { x: number; y: number },
): string {
  if (positions.length < 2) return "";
  const sorted = [...positions].sort(
    (a, b) => a.row - b.row || a.col - b.col,
  );
  return sorted
    .map((p, i) => {
      const { x, y } = cell(p.row, p.col);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function VedicSquarePanel({
  psychic,
  destiny,
  nameNumber,
  unitName,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const [source, setSource] = useState<HighlightSource>("psychic");
  const [manual, setManual] = useState(1);
  const [layout, setLayout] = useState<"lattice" | "classic">("lattice");
  const [tip, setTip] = useState<string | null>(null);

  const highlight = useMemo(() => {
    if (source === "manual") return manual;
    if (source === "psychic") return Number(psychic) || 1;
    if (source === "destiny") return Number(destiny) || 1;
    if (source === "name") return Number(nameNumber) || 1;
    if (source === "unit") return Number(unitName) || 1;
    return 1;
  }, [source, manual, psychic, destiny, nameNumber, unitName]);

  const digit = digitalRoot(highlight || 1);
  const architecture = useMemo(
    () => buildVedicSquareArchitecture(digit),
    [digit],
  );
  const guide = squareDigitGuide(digit);
  const layerLine = layerContextLine(source, digit);
  const oppDigit = architecture.oppositeDigit;

  const presets: { id: HighlightSource; label: string; value?: string }[] = [
    { id: "psychic", label: "Psychic", value: psychic },
    { id: "destiny", label: "Destiny", value: destiny },
    { id: "name", label: "Name", value: nameNumber },
    ...(unitName
      ? [{ id: "unit" as const, label: "Unit name", value: unitName }]
      : []),
    { id: "manual", label: "Pick 1–9" },
  ];

  const pad = 8;
  const size = 100;
  const step = (size - pad * 2) / 8;
  const cellCenter = (row: number, col: number) => ({
    x: pad + (col - 1) * step,
    y: pad + (row - 1) * step,
  });

  const primaryPath = constellationPath(
    architecture.positions,
    cellCenter,
  );
  const shadowPath = constellationPath(
    architecture.oppositePositions,
    cellCenter,
  );

  const primarySet = useMemo(
    () => new Set(architecture.positions.map((p) => `${p.row},${p.col}`)),
    [architecture.positions],
  );
  const shadowSet = useMemo(
    () =>
      new Set(architecture.oppositePositions.map((p) => `${p.row},${p.col}`)),
    [architecture.oppositePositions],
  );

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5 sm:p-6">
      <p className="text-sm uppercase tracking-[0.18em] text-ink-soft">
        Vedic Square
      </p>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        A 9×9 multiplication table reduced to digital roots (1–9)—not Ank
        Kundli. Highlight a core number to see its footprint constellation,
        opposite shadow, and a short reflective practice.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {presets.map((p) => {
          const active = source === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSource(p.id)}
              className={`btn-tactile rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-[var(--line)] bg-white/80 text-ink-soft hover:text-ink"
              }`}
            >
              {p.label}
              {p.value ? (
                <span className="ml-1.5 opacity-80">{p.value}</span>
              ) : null}
            </button>
          );
        })}
        <div className="ml-auto flex rounded-full border border-[var(--line)] bg-white/50 p-0.5">
          {(
            [
              ["lattice", "Lattice"],
              ["classic", "Classic"],
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
      </div>

      {source === "manual" ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setManual(n)}
              className={`btn-tactile h-9 w-9 rounded-lg border text-sm font-medium transition ${
                manual === n
                  ? "border-gold/70 bg-gold/15 text-ink"
                  : "border-[var(--line)] bg-white text-ink-soft"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          {layout === "lattice" ? (
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <svg
                viewBox={`0 0 ${size} ${size}`}
                className="h-full w-full overflow-visible"
                role="img"
                aria-label={`Vedic Square lattice highlighting ${digit}`}
              >
                <defs>
                  <linearGradient
                    id={`vs-primary-${uid}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgb(180 83 9)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="rgb(180 83 9)" stopOpacity="0.85" />
                  </linearGradient>
                </defs>

                {/* faint lattice guides */}
                {Array.from({ length: 9 }, (_, i) => {
                  const a = pad + i * step;
                  return (
                    <g key={`g-${i}`} opacity="0.2">
                      <line
                        x1={pad}
                        y1={a}
                        x2={size - pad}
                        y2={a}
                        stroke="var(--line)"
                        strokeWidth="0.25"
                      />
                      <line
                        x1={a}
                        y1={pad}
                        x2={a}
                        y2={size - pad}
                        stroke="var(--line)"
                        strokeWidth="0.25"
                      />
                    </g>
                  );
                })}

                {shadowPath ? (
                  <path
                    d={shadowPath}
                    fill="none"
                    stroke="rgb(100 116 139 / 0.45)"
                    strokeWidth="0.55"
                    strokeDasharray="1.2 1.6"
                    strokeLinecap="round"
                  />
                ) : null}
                {primaryPath ? (
                  <path
                    d={primaryPath}
                    fill="none"
                    stroke={`url(#vs-primary-${uid})`}
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="motion-safe:opacity-95"
                  />
                ) : null}

                {VEDIC_SQUARE.map((row, ri) =>
                  row.map((cell, ci) => {
                    const row1 = ri + 1;
                    const col1 = ci + 1;
                    const { x, y } = cellCenter(row1, col1);
                    const key = `${row1},${col1}`;
                    const isPrimary = primarySet.has(key);
                    const isShadow = !isPrimary && shadowSet.has(key);
                    const r = isPrimary ? 2.4 : isShadow ? 1.9 : 1.35;
                    return (
                      <g key={key}>
                        <circle
                          cx={x}
                          cy={y}
                          r={r}
                          fill={
                            isPrimary
                              ? "rgb(30 58 107)"
                              : isShadow
                                ? "rgb(148 163 184 / 0.45)"
                                : "rgb(255 255 255 / 0.9)"
                          }
                          stroke={
                            isPrimary
                              ? "rgb(180 83 9)"
                              : isShadow
                                ? "rgb(100 116 139 / 0.55)"
                                : "var(--line)"
                          }
                          strokeWidth={isPrimary ? 0.55 : 0.35}
                          className={
                            isPrimary
                              ? "motion-safe:animate-pulse"
                              : undefined
                          }
                          style={{ cursor: "pointer" }}
                          onMouseEnter={() =>
                            setTip(
                              `${row1} × ${col1} → ${cell}${
                                isPrimary
                                  ? ` · footprint ${digit}`
                                  : isShadow
                                    ? ` · opposite ${oppDigit}`
                                    : ""
                              }`,
                            )
                          }
                          onMouseLeave={() => setTip(null)}
                          onClick={() => {
                            setSource("manual");
                            setManual(cell);
                          }}
                        />
                        <text
                          x={x}
                          y={y + 0.85}
                          textAnchor="middle"
                          fill={
                            isPrimary
                              ? "rgb(250 248 243)"
                              : "rgb(70 82 98)"
                          }
                          fontSize="2.2"
                          fontWeight="600"
                          style={{ pointerEvents: "none" }}
                        >
                          {cell}
                        </text>
                      </g>
                    );
                  }),
                )}
              </svg>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div
                className="mx-auto grid w-max gap-1"
                style={{
                  gridTemplateColumns: "repeat(9, minmax(2rem, 2.5rem))",
                }}
                role="grid"
                aria-label="Vedic Square classic"
              >
                {VEDIC_SQUARE.map((row, ri) =>
                  row.map((cell, ci) => {
                    const on = cell === digit;
                    const shadow = oppDigit != null && cell === oppDigit;
                    return (
                      <button
                        key={`${ri}-${ci}`}
                        type="button"
                        role="gridcell"
                        onClick={() => {
                          setSource("manual");
                          setManual(cell);
                        }}
                        className={`btn-tactile flex aspect-square items-center justify-center rounded-md border text-sm font-semibold transition ${
                          on
                            ? "border-ink bg-ink text-paper shadow-sm"
                            : shadow
                              ? "border-slate-300 bg-slate-100/80 text-slate-500"
                              : "border-[var(--line)] bg-paper/80 text-ink-soft"
                        }`}
                        title={`Row ${ri + 1} × Col ${ci + 1} → ${cell}`}
                      >
                        {cell}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          )}
          <p className="mt-2 min-h-[1.25rem] text-center text-xs text-ink-soft">
            {tip ?? "Hover a node for the multiplication pair · tap to highlight that digit."}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white/60 px-3 py-3">
            <VedicSquareGlyph
              digit={digit}
              className="h-12 w-12 text-gold-deep"
              title={`${digit} · ${architecture.planetLabel}`}
            />
            <div>
              <p className="brand text-2xl leading-none text-ink">{digit}</p>
              <p className="text-xs text-ink-soft">
                {architecture.planetLabel} {architecture.planetSymbol}
              </p>
              <p className="mt-0.5 text-xs font-medium text-ink">
                {architecture.archetype.name}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-white/60 px-3 py-3 space-y-2.5">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              How your digits sit on this square
            </p>
            <p className="text-[10px] leading-4 text-ink-soft">
              These describe the shape of your grid, not how good it is. There
              is no ideal set of bars.
            </p>
            <Meter
              label="Frequency"
              value={architecture.metrics.frequencyScore}
              help="How often your digits repeat. Higher means fewer traits, used more strongly."
              />
            <Meter
              label="Distribution"
              value={architecture.metrics.distributionScore}
              help="How spread out your digits are. Higher means more traits available, each less dominant."
            />
            <Meter
              label="Symmetry"
              value={architecture.metrics.symmetryScore}
              help="How evenly your digits balance across the square. Higher means fewer lopsided areas."
            />
            <Meter
              label="Opposite tension"
              value={architecture.metrics.oppositeTension}
              help="How often you hold digits that sit opposite each other. Higher means more internal push and pull."
            />
            <p className="text-[11px] text-ink-soft">
              {architecture.metrics.frequencyLabel} ·{" "}
              {architecture.metrics.clarity} clarity ·{" "}
              {architecture.metrics.reactionStyle} reactions
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Digit meaning
          </p>
          <p className="mt-1 text-sm font-medium text-ink">{guide.theme}</p>
          <p className="mt-2 text-xs leading-5 text-ink-soft">
            {architecture.archetype.behavioral}
          </p>
          <p className="mt-1 text-xs leading-5 text-ink-soft">
            {architecture.archetype.emotional}
          </p>
          {layerLine ? (
            <p className="mt-2 text-xs leading-5 text-ink-soft">{layerLine}</p>
          ) : null}
          <p className="mt-2 text-xs text-ink-soft">
            Appears{" "}
            <span className="brand text-ink">{architecture.metrics.frequency}</span>{" "}
            times ·{" "}
            <Link
              href={`/guide/vedic-square/${digit}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-deep underline underline-offset-2 hover:text-ink"
            >
              Full digit guide
            </Link>
          </p>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Opposite shadow
          </p>
          {oppDigit != null && architecture.oppositePair ? (
            <>
              <p className="mt-1 text-sm font-medium text-ink">
                {digit} ↔ {oppDigit} ({architecture.oppositePair.planets})
              </p>
              <p className="mt-2 text-xs leading-5 text-ink-soft">
                {architecture.oppositeNarrative}
              </p>
            </>
          ) : (
            <p className="mt-2 text-xs leading-5 text-ink-soft">{NINE_NOTE}</p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Reflective practice
        </p>
        <ul className="mt-2 space-y-2 text-sm text-ink-soft">
          <li>
            <span className="font-medium text-ink">Micro · </span>
            {architecture.practice.micro}
          </li>
          <li>
            <span className="font-medium text-ink">Awareness · </span>
            {architecture.practice.awareness}
          </li>
          <li>
            <span className="font-medium text-ink">Opposite balance · </span>
            {architecture.practice.oppositeBalance}
          </li>
          <li>
            <span className="font-medium text-ink">Pattern pause · </span>
            {architecture.practice.meditation}
          </li>
        </ul>
        <p className="mt-3 text-xs leading-5 text-ink-soft">
          {architecture.narrative} Reflective only—not medical, legal, or
          destiny claims.
        </p>
      </div>

      <p className="mt-3 text-xs leading-5 text-ink-soft">{REDUCTION_TIP}</p>
    </div>
  );
}
