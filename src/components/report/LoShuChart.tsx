"use client";

import Link from "next/link";
import { arrowNameToSlug, guideHref } from "@/lib/guides/content";
import type { LoShuResult } from "@/lib/numerology/types";

const CELL_ORDER = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

type Props = {
  loShu: LoShuResult;
};

export function LoShuChart({ loShu }: Props) {
  return (
    <div className="space-y-5">
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
        {CELL_ORDER.flat().map((n) => {
          const count = loShu.grid[n] ?? 0;
          const missing = count === 0;
          return (
            <div
              key={n}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl border ${
                missing
                  ? "border-dashed border-[var(--line)] bg-white/30 text-ink-soft/50"
                  : "border-[var(--line)] bg-ink text-paper"
              }`}
            >
              <span className="brand text-2xl">{n}</span>
              <span className="text-[10px] uppercase tracking-wider">
                {missing ? "missing" : `×${count}`}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 text-sm sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-white/50 p-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">Mental</p>
          <p className="mt-1 text-ink">{loShu.mental_plane}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/50 p-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Emotional
          </p>
          <p className="mt-1 text-ink">{loShu.emotional_plane}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/50 p-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Practical
          </p>
          <p className="mt-1 text-ink">{loShu.practical_plane}</p>
        </div>
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
