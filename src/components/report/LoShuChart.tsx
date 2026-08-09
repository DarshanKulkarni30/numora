"use client";

import Link from "next/link";
import { arrowNameToSlug, guideHref } from "@/lib/guides/content";
import type { LoShuResult } from "@/lib/numerology/types";

type PlaneRow = {
  id: "mental" | "emotional" | "practical";
  label: string;
  numbers: number[];
  strength: string;
  /** Cell fill when present */
  present: string;
  /** Cell style when missing */
  missing: string;
  /** Row label chip */
  chip: string;
  rail: string;
};

type Props = {
  loShu: LoShuResult;
};

export function LoShuChart({ loShu }: Props) {
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
        <span className="font-medium text-emerald-800">Practical</span>.
      </p>

      <div className="mx-auto max-w-md space-y-2">
        {planes.map((plane) => (
          <div
            key={plane.id}
            className={`grid grid-cols-[5.5rem_1fr] items-stretch gap-2 rounded-xl border p-2 ${plane.rail}`}
          >
            <div className="flex flex-col justify-center px-1">
              <span
                className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${plane.chip}`}
              >
                {plane.label}
              </span>
              <span className="mt-1 text-[11px] leading-snug text-ink-soft">
                {plane.strength}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {plane.numbers.map((n) => {
                const count = loShu.grid[n] ?? 0;
                const missing = count === 0;
                return (
                  <div
                    key={n}
                    title={`${plane.label} plane · ${n}${missing ? " (missing)" : ` ×${count}`}`}
                    className={`flex aspect-square flex-col items-center justify-center rounded-lg border ${
                      missing ? plane.missing : plane.present
                    }`}
                  >
                    <span className="brand text-xl">{n}</span>
                    <span className="text-[9px] uppercase tracking-wider opacity-90">
                      {missing ? "miss" : `×${count}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
      </div>

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
