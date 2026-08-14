"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  countInSquare,
  digitalRoot,
  NINE_NOTE,
  oppositeOf,
  REDUCTION_TIP,
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
  const opp = oppositeOf(digit);
  const count = countInSquare(digit);

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
        core number to see where it repeats in the square.
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

      <div className="mt-5 space-y-2 text-sm text-ink-soft">
        <p>
          Highlighting{" "}
          <Link
            href={`/guide/vedic-square/${digit}`}
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            {digit}
          </Link>
          : appears <span className="text-ink">{count}</span> times in the
          square
          {opp != null ? (
            <>
              {" "}
              · opposite{" "}
              <Link
                href={`/guide/vedic-square/${opp}`}
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                {opp}
              </Link>
            </>
          ) : (
            <> · no opposite (9 stands alone)</>
          )}
          .
        </p>
        <p className="text-xs leading-5">{NINE_NOTE}</p>
        <p className="text-xs leading-5">{REDUCTION_TIP}</p>
      </div>
    </div>
  );
}
