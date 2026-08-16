"use client";

import { useMemo, useState } from "react";
import {
  analyzeNameByMap,
  masterLetterTable,
  type NameLetterMapId,
} from "@/lib/numerology/nameLetterBreakdown";

type Props = {
  mapId?: NameLetterMapId;
};

export function NameNumberDemo({ mapId = "chaldean" }: Props) {
  const [name, setName] = useState("");
  const table = useMemo(() => masterLetterTable(mapId), [mapId]);
  const breakdown = useMemo(
    () => (name.trim().length >= 1 ? analyzeNameByMap(name, mapId) : null),
    [name, mapId],
  );

  const title =
    mapId === "pythagorean"
      ? "Pythagorean Expression"
      : mapId === "unit"
        ? "Unit System name"
        : "Chaldean / Vedic name";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <p className="text-sm font-medium text-ink">Master letter table</p>
        <p className="mt-1 text-xs text-ink-soft">{title}</p>
        <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-9">
          {table.map((row) => (
            <div
              key={row.letter}
              className="rounded-lg border border-[var(--line)] bg-white/80 px-1.5 py-1.5 text-center"
            >
              <p className="text-xs font-medium text-ink">{row.letter}</p>
              <p className="brand text-sm text-ink">{row.value || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <label htmlFor="learn-name" className="block text-sm text-ink-soft">
          Type a name
        </label>
        <input
          id="learn-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Meera Sharma"
          className="mt-1 w-full max-w-md rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
        />
        {breakdown ? (
          <div className="mt-4 space-y-2 text-sm">
            {breakdown.words.map((w) => (
              <p
                key={w.word}
                className="rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2 font-mono text-xs leading-5 text-ink-soft"
              >
                <span className="font-sans font-medium text-ink">
                  {w.word.toUpperCase()}
                </span>
                <br />
                {w.equation} → {w.reduced}
              </p>
            ))}
            <p className="text-ink">
              Name number{" "}
              <span className="brand">{breakdown.nameNumber}</span>
              {breakdown.nameNumber !== breakdown.singleDigit ? (
                <span className="text-ink-soft">
                  {" "}
                  (core {breakdown.singleDigit})
                </span>
              ) : null}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-soft">
            Letters light up in the math below as you type.
          </p>
        )}
      </div>
    </div>
  );
}
