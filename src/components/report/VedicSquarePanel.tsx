"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  countInSquare,
  digitalRoot,
  frequencyBand,
  layerContextLine,
  NINE_NOTE,
  REDUCTION_TIP,
  squareDigitGuide,
  VEDIC_SQUARE,
} from "@/lib/numerology/vedicSquare";

type HighlightSource =
  | "psychic"
  | "destiny"
  | "name"
  | "unit"
  | "manual";

type Props = {
  psychic: string;
  destiny: string;
  nameNumber: string;
  unitName?: string;
};

export function VedicSquarePanel({
  psychic,
  destiny,
  nameNumber,
  unitName,
}: Props) {
  const [source, setSource] = useState<HighlightSource>("psychic");
  const [manual, setManual] = useState(1);

  const highlight = useMemo(() => {
    if (source === "manual") return manual;
    if (source === "psychic") return Number(psychic) || 1;
    if (source === "destiny") return Number(destiny) || 1;
    if (source === "name") return Number(nameNumber) || 1;
    if (source === "unit") return Number(unitName) || 1;
    return 1;
  }, [source, manual, psychic, destiny, nameNumber, unitName]);

  const digit = digitalRoot(highlight || 1);
  const count = countInSquare(digit);
  const guide = squareDigitGuide(digit);
  const freq = frequencyBand(count);
  const layerLine = layerContextLine(source, digit);
  const opp = guide.opposite;

  const presets: { id: HighlightSource; label: string; value?: string }[] = [
    { id: "psychic", label: "Psychic", value: psychic },
    { id: "destiny", label: "Destiny", value: destiny },
    { id: "name", label: "Name", value: nameNumber },
    ...(unitName
      ? [{ id: "unit" as const, label: "Unit name", value: unitName }]
      : []),
    { id: "manual", label: "Pick 1–9" },
  ];

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5 sm:p-6">
      <p className="text-sm uppercase tracking-[0.18em] text-ink-soft">
        Vedic Square
      </p>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        A 9×9 multiplication table reduced to digital roots (1–9). Highlight a
        core number to see where it repeats, what that footprint often means,
        and a short reflective practice.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
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
                  : "border-[var(--line)] bg-white/80 text-ink-soft"
              }`}
            >
              {p.label}
              {p.value ? (
                <span className="ml-1.5 opacity-80">{p.value}</span>
              ) : null}
            </button>
          );
        })}
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
                  ? "border-sand bg-sand/30 text-ink"
                  : "border-[var(--line)] bg-white text-ink-soft"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <div
          className="mx-auto grid w-max gap-1"
          style={{ gridTemplateColumns: "repeat(9, minmax(2rem, 2.5rem))" }}
          role="grid"
          aria-label="Vedic Square"
        >
          {VEDIC_SQUARE.map((row, ri) =>
            row.map((cell, ci) => {
              const on = cell === digit;
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
                      : "border-[var(--line)] bg-paper/80 text-ink-soft"
                  }`}
                  aria-pressed={on}
                  title={`Row ${ri + 1} × Col ${ci + 1} → ${cell}`}
                >
                  {cell}
                </button>
              );
            }),
          )}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
          <p className="text-sm text-ink">
            Highlighting{" "}
            <Link
              href={`/guide/vedic-square/${digit}`}
              className="font-medium text-gold-deep underline underline-offset-2 hover:text-ink"
            >
              {digit}
            </Link>
            : appears <span className="brand text-ink">{count}</span> times ·{" "}
            <span className="text-ink">{freq.label}</span>
            {opp != null ? (
              <>
                {" "}
                · opposite{" "}
                <Link
                  href={`/guide/vedic-square/${opp.a === digit ? opp.b : opp.a}`}
                  className="font-medium text-gold-deep underline underline-offset-2 hover:text-ink"
                >
                  {opp.a === digit ? opp.b : opp.a}
                </Link>
              </>
            ) : (
              <> · no opposite (9 stands alone)</>
            )}
          </p>
          {layerLine ? (
            <p className="mt-2 text-xs leading-5 text-ink-soft">{layerLine}</p>
          ) : null}
          <p className="mt-2 text-sm leading-6 text-ink-soft">{freq.meaning}</p>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Generic impact of digit {digit}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">{guide.theme}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-soft">
                Often supports
              </p>
              <ul className="mt-1 space-y-1 text-sm text-ink">
                {guide.strengths.map((s) => (
                  <li key={s}>· {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-soft">
                Watch for
              </p>
              <ul className="mt-1 space-y-1 text-sm text-ink">
                {guide.watchouts.map((s) => (
                  <li key={s}>· {s}</li>
                ))}
              </ul>
            </div>
          </div>
          {opp ? (
            <p className="mt-3 text-xs leading-5 text-ink-soft">
              Opposite play {opp.a}↔{opp.b} ({opp.planets}): {opp.theme}{" "}
              Practice: {opp.practice}
            </p>
          ) : null}
          <p className="mt-3 rounded-lg border border-[var(--line)] bg-mist/40 px-3 py-2 text-sm text-ink">
            <span className="text-xs uppercase tracking-wider text-ink-soft">
              Practice
            </span>
            <br />
            {guide.practice}
          </p>
          <p className="mt-2 text-xs text-ink-soft">
            Reflective pattern notes only—not medical, legal, or destiny claims.{" "}
            <Link
              href={`/guide/vedic-square/${digit}`}
              className="text-gold-deep underline underline-offset-2 hover:text-ink"
            >
              Open full digit guide
            </Link>
          </p>
        </div>

        {digit === 9 ? (
          <p className="text-xs leading-5 text-ink-soft">{NINE_NOTE}</p>
        ) : null}
        <p className="text-xs leading-5 text-ink-soft">{REDUCTION_TIP}</p>
      </div>
    </div>
  );
}
