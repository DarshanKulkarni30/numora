"use client";

import Link from "next/link";
import { useId, useMemo, useState, type ReactNode } from "react";
import { ChartTipPanel } from "@/components/report/ChartTipPanel";
import {
  arrowNameToSlug,
  guideHref,
  LO_SHU_ARROW_GUIDES,
} from "@/lib/guides/content";
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

const PLANE_BY_NUMBER: Record<number, string> = {
  4: "Mental",
  9: "Mental",
  2: "Mental",
  3: "Emotional",
  5: "Emotional",
  7: "Emotional",
  8: "Practical",
  1: "Practical",
  6: "Practical",
};

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
  /** Override the default Lo Shu intro copy */
  intro?: ReactNode;
  /** Optional aspect chips under the tip panel (Pythagorean / Vedic) */
  aspectLegend?: ReactNode;
};

function cellCenter(n: number): { x: number; y: number } {
  const row = CELL_ORDER.findIndex((r) => r.includes(n));
  const col = CELL_ORDER[row].indexOf(n);
  const slot = 100 / 3;
  return { x: slot * col + slot / 2, y: slot * row + slot / 2 };
}

function arrowSlugKey(name: string): string | null {
  return arrowNameToSlug(name);
}

function ArrowListItem({ name }: { name: string }) {
  const slug = arrowNameToSlug(name);
  const guide = slug ? LO_SHU_ARROW_GUIDES[slug] : null;
  return (
    <li className="space-y-0.5">
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
        <span className="text-ink">{name}</span>
      )}
      {guide ? (
        <p className="text-[11px] leading-snug text-ink-soft">
          {guide.significance}
        </p>
      ) : null}
    </li>
  );
}

export function LoShuChart({ loShu, intro, aspectLegend }: Props) {
  const uid = useId().replace(/:/g, "");
  const markerPresent = `numora-arrow-present-${uid}`;
  const markerMissing = `numora-arrow-missing-${uid}`;
  const effects = loShuEffectNotes(
    loShu.repeated_numbers,
    loShu.missing_numbers,
  );
  const [tip, setTip] = useState<string | null>(null);

  const presentSet = useMemo(
    () => new Set(loShu.present_arrows),
    [loShu.present_arrows],
  );
  const missingSet = useMemo(
    () => new Set(loShu.missing_arrows),
    [loShu.missing_arrows],
  );

  const overlayArrows = LO_SHU_ARROWS.filter(
    (a) => presentSet.has(a.name) || missingSet.has(a.name),
  );

  const planes: PlaneRow[] = [
    {
      id: "mental",
      label: "Mental",
      numbers: [4, 9, 2],
      strength: loShu.mental_plane,
      present: "border-sky-300/80 bg-sky-100 text-sky-950",
      missing: "border-dashed border-sky-300/60 bg-sky-50/50 text-sky-400",
      chip: "bg-sky-100 text-sky-900 border-sky-200",
      rail: "bg-sky-100/80 border-sky-200",
    },
    {
      id: "emotional",
      label: "Emotional",
      numbers: [3, 5, 7],
      strength: loShu.emotional_plane,
      present: "border-rose-300/80 bg-rose-100 text-rose-950",
      missing: "border-dashed border-rose-300/60 bg-rose-50/50 text-rose-400",
      chip: "bg-rose-100 text-rose-900 border-rose-200",
      rail: "bg-rose-100/80 border-rose-200",
    },
    {
      id: "practical",
      label: "Practical",
      numbers: [8, 1, 6],
      strength: loShu.practical_plane,
      present: "border-emerald-300/80 bg-emerald-100 text-emerald-950",
      missing:
        "border-dashed border-emerald-300/60 bg-emerald-50/50 text-emerald-400",
      chip: "bg-emerald-100 text-emerald-900 border-emerald-200",
      rail: "bg-emerald-100/80 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-5">
      {intro ?? (
        <p className="text-sm text-ink-soft">
          Birth-date digits plus{" "}
          <span className="font-medium text-ink">BN</span> (Psychic / birth
          number
          {loShu.birth_number != null ? ` ${loShu.birth_number}` : ""}) and{" "}
          <span className="font-medium text-ink">DN</span> (Destiny
          {loShu.destiny_number != null ? ` ${loShu.destiny_number}` : ""}) are
          placed on the grid. Rows are color-coded by plane. Hover a tile or
          arrow for meaning; click a tile for its Lo Shu guide.
        </p>
      )}

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

        <div className="relative overflow-visible">
          <div className="grid grid-cols-3 gap-1.5">
            {CELL_ORDER.flat().map((n) => {
              const plane = planes.find((p) => p.numbers.includes(n))!;
              const count = loShu.grid[n] ?? 0;
              const missing = count === 0;
              const meta = LO_SHU_NUMBER_META[n];
              const tileTip = [
                `${n} · ${meta.trait} (${meta.vedic})`,
                `Plane: ${PLANE_BY_NUMBER[n]} · ${plane.strength}`,
                missing
                  ? "Missing in this birth grid — a growth invite, not a deficit."
                  : `Present ×${count} — core strength theme: ${meta.theme}.`,
                loShu.birth_number === n
                  ? `Includes BN (Psychic / birth number) ${loShu.birth_number}.`
                  : null,
                loShu.destiny_number === n
                  ? `Includes DN (Destiny number) ${loShu.destiny_number}.`
                  : null,
              ]
                .filter(Boolean)
                .join("\n");
              return (
                <Link
                  key={n}
                  href={guideHref("lo-shu-number", n)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Click for more about Lo Shu number ${n}`}
                  onMouseEnter={() => setTip(tileTip)}
                  onMouseLeave={() => setTip(null)}
                  onFocus={() => setTip(tileTip)}
                  onBlur={() => setTip(null)}
                  className={`relative z-[1] flex aspect-square flex-col items-center justify-center rounded-lg border outline-none transition hover:border-gold/60 focus-visible:ring-2 focus-visible:ring-gold ${
                    missing ? plane.missing : plane.present
                  }`}
                >
                  <span className="brand text-xl leading-none">{n}</span>
                  <span className="mt-0.5 text-[9px] uppercase tracking-wider opacity-90">
                    {missing ? "miss" : `×${count}`}
                  </span>
                  {(loShu.birth_number === n || loShu.destiny_number === n) &&
                  !missing ? (
                    <span className="mt-0.5 flex gap-0.5 text-[8px] font-semibold uppercase tracking-wide opacity-90">
                      {loShu.birth_number === n ? <span>BN</span> : null}
                      {loShu.destiny_number === n ? <span>DN</span> : null}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          {overlayArrows.length > 0 ? (
            <svg
              className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <marker
                  id={markerPresent}
                  markerWidth="3"
                  markerHeight="3"
                  refX="2.5"
                  refY="1.5"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path d="M0,0 L3,1.5 L0,3 Z" fill="rgba(217, 119, 6, 0.55)" />
                </marker>
                <marker
                  id={markerMissing}
                  markerWidth="3"
                  markerHeight="3"
                  refX="2.5"
                  refY="1.5"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path d="M0,0 L3,1.5 L0,3 Z" fill="rgba(100, 116, 139, 0.45)" />
                </marker>
              </defs>
              {overlayArrows.map((arrow) => {
                const present = presentSet.has(arrow.name);
                const a = cellCenter(arrow.numbers[0]);
                const b = cellCenter(arrow.numbers[2]);
                const slug = arrowSlugKey(arrow.name);
                const guide = slug ? LO_SHU_ARROW_GUIDES[slug] : null;
                const meaning = guide
                  ? present
                    ? guide.present
                    : guide.missing
                  : present
                    ? "Present strength pattern in this grid."
                    : "Fully missing pattern — a gentle growth area.";
                const arrowTip = `${arrow.name}\n${present ? "Present" : "Missing"} · ${arrow.numbers.join("–")}\n${meaning}`;
                return (
                  <g key={arrow.name}>
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke="transparent"
                      strokeWidth={10}
                      className="cursor-help"
                      style={{ pointerEvents: "stroke" }}
                      onMouseEnter={() => setTip(arrowTip)}
                      onMouseLeave={() => setTip(null)}
                    />
                    <line
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={
                        present
                          ? "rgba(180, 83, 9, 0.55)"
                          : "rgba(71, 85, 105, 0.45)"
                      }
                      strokeWidth={0.9}
                      strokeLinecap="round"
                      strokeDasharray="1.4 2.6"
                      markerEnd={
                        present
                          ? `url(#${markerPresent})`
                          : `url(#${markerMissing})`
                      }
                      style={{ pointerEvents: "none" }}
                    />
                  </g>
                );
              })}
            </svg>
          ) : null}
        </div>
      </div>

      <ChartTipPanel
        tip={tip}
        empty="Hover a grid tile for its plane and core strength, or hover a dotted arrow for its name and meaning."
      />

      {aspectLegend}

      <div className="flex flex-wrap gap-3 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-200 border border-sky-400" />{" "}
          Mental (4–9–2)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-200 border border-rose-400" />{" "}
          Emotional (3–5–7)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-200 border border-emerald-500" />{" "}
          Practical (8–1–6)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-5 border-t border-dotted border-amber-700/60" />{" "}
          Present arrow
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-5 border-t border-dotted border-slate-500" />{" "}
          Missing arrow
        </span>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-ink-soft">
          Number meanings
        </p>
        <p className="mt-1 text-[11px] text-ink-soft">
          Trait · Vedic nickname — click a number for its Lo Shu guide
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <li key={n} className="flex items-baseline gap-1.5">
              <Link
                href={guideHref("lo-shu-number", n)}
                target="_blank"
                rel="noopener noreferrer"
                title={`Click for more about Lo Shu number ${n}`}
                className={`brand text-base underline decoration-gold/50 underline-offset-2 hover:text-gold-deep ${NUMBER_PLANE_TINT[n]}`}
              >
                {n}
              </Link>
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
            <ul className="mt-2 space-y-2 text-sm text-ink-soft">
              {loShu.present_arrows.map((name) => (
                <ArrowListItem key={name} name={name} />
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">No complete present arrows.</p>
          )}
        </div>
        <div>
          <h3 className="text-ink">Missing arrows (growth areas)</h3>
          {loShu.missing_arrows.length ? (
            <ul className="mt-2 space-y-2 text-sm text-ink-soft">
              {loShu.missing_arrows.map((name) => (
                <ArrowListItem key={name} name={name} />
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">No fully missing arrows.</p>
          )}
        </div>
      </div>
    </div>
  );
}
