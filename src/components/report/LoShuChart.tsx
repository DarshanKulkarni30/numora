"use client";

import Link from "next/link";
import { arrowNameToSlug, guideHref } from "@/lib/guides/content";
import {
  LO_SHU_NUMBER_META,
  loShuEffectNotes,
} from "@/lib/numerology/loShuEffects";
import { LO_SHU_ARROWS } from "@/lib/numerology/loShu";
import type { LoShuResult } from "@/lib/numerology/types";

const CELL_ORDER = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

const NUMBER_PLANE_TINT: Record<number, string> = {
  4: "text-sky-800",
  9: "text-sky-800",
  2: "text-sky-800",
  3: "text-rose-800",
  5: "text-rose-800",
  7: "text-rose-800",
  8: "text-emerald-800",
  1: "text-emerald-800",
  6: "text-emerald-800",
};

type PlaneRow = {
  id: "mental" | "emotional" | "practical";
  label: string;
  numbers: number[];
  strength: string;
  present: string;
  missing: string;
  chip: string;
  rail: string;
};

type Props = {
  loShu: LoShuResult;
};

/** Cell center in a 3×3 SVG viewBox 0–100 (with ~4% inset for gaps). */
function cellCenter(n: number): { x: number; y: number } {
  const row = CELL_ORDER.findIndex((r) => r.includes(n));
  const col = CELL_ORDER[row].indexOf(n);
  const slot = 100 / 3;
  return { x: slot * col + slot / 2, y: slot * row + slot / 2 };
}

export function LoShuChart({ loShu }: Props) {
  const effects = loShuEffectNotes(
    loShu.repeated_numbers,
    loShu.missing_numbers,
  );

  const presentSet = new Set(loShu.present_arrows);
  const missingSet = new Set(loShu.missing_arrows);

  const overlayArrows = LO_SHU_ARROWS.filter(
    (a) => presentSet.has(a.name) || missingSet.has(a.name),
  );

  const planes: PlaneRow[] = [
    {
      id: "mental",
      label: "Mental",
      numbers: [4, 9, 2],
      strength: loShu.mental_plane,
      present: "border-sky-400/70 bg-sky-600 text-white",
      missing: "border-dashed border-sky-300/70 bg-sky-50 text-sky-400",
      chip: "bg-sky-100 text-sky-900 border-sky-200",
      rail: "bg-sky-100/80 border-sky-200",
    },
    {
      id: "emotional",
      label: "Emotional",
      numbers: [3, 5, 7],
      strength: loShu.emotional_plane,
      present: "border-rose-400/70 bg-rose-600 text-white",
      missing: "border-dashed border-rose-300/70 bg-rose-50 text-rose-400",
      chip: "bg-rose-100 text-rose-900 border-rose-200",
      rail: "bg-rose-100/80 border-rose-200",
    },
    {
      id: "practical",
      label: "Practical",
      numbers: [8, 1, 6],
      strength: loShu.practical_plane,
      present: "border-emerald-400/70 bg-emerald-700 text-white",
      missing: "border-dashed border-emerald-300/70 bg-emerald-50 text-emerald-400",
      chip: "bg-emerald-100 text-emerald-900 border-emerald-200",
      rail: "bg-emerald-100/80 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        Rows are color-coded by plane:{" "}
        <span className="font-medium text-sky-800">Mental</span>,{" "}
        <span className="font-medium text-rose-800">Emotional</span>,{" "}
        <span className="font-medium text-emerald-800">Practical</span>. Soft
        gold lines mark present arrows; dashed slate lines mark fully missing
        arrows.
      </p>

      <div className="mx-auto grid max-w-md grid-cols-[5.5rem_1fr] gap-2">
        <div className="flex flex-col gap-2 py-2">
          {planes.map((plane) => (
            <div
              key={plane.id}
              className={`flex flex-1 flex-col justify-center rounded-xl border px-1.5 py-2 ${plane.rail}`}
            >
              <span
                className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${plane.chip}`}
              >
                {plane.label}
              </span>
              <span className="mt-1 text-[11px] leading-snug text-ink-soft">
                {plane.strength}
              </span>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="grid grid-cols-3 gap-1.5">
            {CELL_ORDER.flat().map((n) => {
              const plane = planes.find((p) => p.numbers.includes(n))!;
              const count = loShu.grid[n] ?? 0;
              const missing = count === 0;
              return (
                <div
                  key={n}
                  title={`${plane.label} · ${n} ${LO_SHU_NUMBER_META[n].trait} (${LO_SHU_NUMBER_META[n].vedic})${missing ? " (missing)" : ` ×${count}`}`}
                  className={`relative z-[1] flex aspect-square flex-col items-center justify-center rounded-lg border ${
                    missing ? plane.missing : plane.present
                  }`}
                >
                  <span className="brand text-xl leading-none">{n}</span>
                  <span className="mt-0.5 text-[9px] uppercase tracking-wider opacity-90">
                    {missing ? "miss" : `×${count}`}
                  </span>
                </div>
              );
            })}
          </div>

          {overlayArrows.length > 0 ? (
            <svg
              className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {overlayArrows.map((arrow) => {
                const present = presentSet.has(arrow.name);
                const a = cellCenter(arrow.numbers[0]);
                const b = cellCenter(arrow.numbers[2]);
                return (
                  <line
                    key={arrow.name}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={present ? "rgba(217, 119, 6, 0.55)" : "rgba(100, 116, 139, 0.45)"}
                    strokeWidth={present ? 1.6 : 1.3}
                    strokeLinecap="round"
                    strokeDasharray={present ? undefined : "3 2.5"}
                  >
                    <title>{arrow.name}</title>
                  </line>
                );
              })}
            </svg>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-600" /> Mental (4–9–2)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-600" /> Emotional (3–5–7)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-700" /> Practical
          (8–1–6)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-amber-600/70" /> Present
          arrow
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 border-t border-dashed border-slate-500" />{" "}
          Missing arrow
        </span>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-ink-soft">
          Number meanings
        </p>
        <p className="mt-1 text-[11px] text-ink-soft">
          Trait · Vedic nickname
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <li key={n} className="flex items-baseline gap-1.5">
              <span className={`brand text-base ${NUMBER_PLANE_TINT[n]}`}>
                {n}
              </span>
              <span className="text-ink-soft">
                {LO_SHU_NUMBER_META[n].trait}{" "}
                <span className="text-ink/70">
                  · {LO_SHU_NUMBER_META[n].vedic}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {(effects.repeated.length > 0 || effects.missing.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-ink">Repeated numbers</h3>
            {effects.repeated.length ? (
              <ul className="mt-2 space-y-2 text-sm text-ink-soft">
                {effects.repeated.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                No repeats beyond single occurrences.
              </p>
            )}
          </div>
          <div>
            <h3 className="text-ink">Missing numbers</h3>
            {effects.missing.length ? (
              <ul className="mt-2 space-y-2 text-sm text-ink-soft">
                {effects.missing.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                No missing numbers in this grid.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-ink">Present arrows (strength patterns)</h3>
          {loShu.present_arrows.length ? (
            <ul className="mt-2 space-y-1 text-sm text-ink-soft">
              {loShu.present_arrows.map((name) => {
                const slug = arrowNameToSlug(name);
                return (
                  <li key={name}>
                    {slug ? (
                      <Link
                        href={guideHref("lo-shu-arrow", slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Click for more about ${name}`}
                        className="text-ink underline decoration-gold/60 underline-offset-2 hover:text-gold-deep"
                      >
                        {name}
                      </Link>
                    ) : (
                      name
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">No complete present arrows.</p>
          )}
        </div>
        <div>
          <h3 className="text-ink">Missing arrows (growth areas)</h3>
          {loShu.missing_arrows.length ? (
            <ul className="mt-2 space-y-1 text-sm text-ink-soft">
              {loShu.missing_arrows.map((name) => {
                const slug = arrowNameToSlug(name);
                return (
                  <li key={name}>
                    {slug ? (
                      <Link
                        href={guideHref("lo-shu-arrow", slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Click for more about ${name}`}
                        className="text-ink underline decoration-gold/60 underline-offset-2 hover:text-gold-deep"
                      >
                        {name}
                      </Link>
                    ) : (
                      name
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">No fully missing arrows.</p>
          )}
        </div>
      </div>
    </div>
  );
}
