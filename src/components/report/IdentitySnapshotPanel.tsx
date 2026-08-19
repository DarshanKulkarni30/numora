"use client";

import { useMemo, useState } from "react";
import {
  buildIdentitySnapshot,
  type SnapshotCapsule,
} from "@/lib/numerology/identitySnapshot";
import type { LoShuResult, NumerologySnapshot } from "@/lib/numerology/types";

type Props = {
  snap: NumerologySnapshot;
  loShu: LoShuResult;
  preferredName?: string;
  /** Legacy prose kept behind toggle */
  legacyBody?: string;
};

function Capsule({ item }: { item: SnapshotCapsule }) {
  return (
    <div
      className={`flex min-w-[7.5rem] flex-1 flex-col items-center rounded-2xl border bg-gradient-to-b px-3 py-3 text-center ${item.tint}`}
    >
      <span className="text-lg text-ink" aria-hidden>
        {item.glyph}
      </span>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-ink-soft">
        {item.label}
      </p>
      <p className="brand mt-0.5 text-xl text-ink">{item.value}</p>
      <p className="mt-1 text-[11px] leading-4 text-ink-soft">{item.trait}</p>
    </div>
  );
}

function Flower({ petals }: { petals: SnapshotCapsule[] }) {
  const n = petals.length || 1;
  return (
    <svg
      viewBox="0 0 200 200"
      className="mx-auto h-auto w-full max-w-[14rem]"
      role="img"
      aria-label="Numerology flower of headline numbers"
    >
      <circle
        cx="100"
        cy="100"
        r="22"
        fill="rgb(250 248 243)"
        stroke="rgb(30 58 107)"
        strokeWidth="1.2"
        className="motion-safe:animate-pulse"
      />
      <text
        x="100"
        y="104"
        textAnchor="middle"
        fontSize="8"
        fill="rgb(30 58 107)"
        fontWeight="600"
      >
        Identity
      </text>
      {petals.map((p, i) => {
        const ang = (-90 + (i * 360) / n) * (Math.PI / 180);
        const cx = 100 + Math.cos(ang) * 58;
        const cy = 100 + Math.sin(ang) * 58;
        return (
          <g key={p.id}>
            <ellipse
              cx={cx}
              cy={cy}
              rx="22"
              ry="16"
              transform={`rotate(${(i * 360) / n} ${cx} ${cy})`}
              fill="rgb(255 255 255 / 0.85)"
              stroke="rgb(196 164 108 / 0.7)"
              strokeWidth="1"
            />
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="rgb(30 58 107)"
            >
              {p.value}
            </text>
            <text
              x={cx}
              y={cy + 9}
              textAnchor="middle"
              fontSize="5.5"
              fill="rgb(70 82 98)"
            >
              {p.label.split(" ")[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function IdentitySnapshotPanel({
  snap,
  loShu,
  preferredName,
  legacyBody,
}: Props) {
  const model = useMemo(
    () => buildIdentitySnapshot({ snap, loShu, preferredName }),
    [snap, loShu, preferredName],
  );
  const [showLegacy, setShowLegacy] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <p className="text-sm text-ink-soft">
          Identity Snapshot — headline numbers, shared threads, and where
          systems diverge.
        </p>
        <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-ink">
          {model.harmony.label}
        </span>
      </div>

      {/* Snapshot bar */}
      <div className="relative">
        <div
          className="pointer-events-none absolute left-4 right-4 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent md:block"
          aria-hidden
        />
        <div className="relative flex flex-wrap gap-2 md:flex-nowrap">
          {model.capsules.map((c) => (
            <Capsule key={c.id} item={c} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Numerology Flower
          </p>
          <Flower petals={model.flowerPetals} />
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Tone Balance
            </p>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-mist">
              {model.toneBalance
                .filter((t) => t.weight > 0)
                .map((t) => (
                  <div
                    key={t.id}
                    title={`${t.label} ${t.weight}%`}
                    className={`${t.tint} h-full`}
                    style={{ width: `${t.weight}%` }}
                  />
                ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-soft">
              {model.toneBalance.map((t) => (
                <li key={t.id}>
                  <span className={`mr-1 inline-block h-2 w-2 rounded-full ${t.tint}`} />
                  {t.label} {t.weight}%
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs leading-5 text-ink-soft">
              {model.harmony.summary}
            </p>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              Mini Lo Shu
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5 max-w-[9rem]">
              {model.loShuMini.map((cell) => (
                <div
                  key={cell.number}
                  className={`flex aspect-square items-center justify-center rounded-md border text-sm ${
                    cell.count > 0
                      ? "border-ink/20 bg-ink/5 font-semibold text-ink"
                      : "border-[var(--line)] bg-white/40 text-ink-soft/50"
                  }`}
                  title={
                    cell.count > 0
                      ? `${cell.number} × ${cell.count}`
                      : `${cell.number} missing`
                  }
                >
                  {cell.number}
                  {cell.count > 1 ? (
                    <span className="ml-0.5 text-[9px] text-ink-soft">
                      ×{cell.count}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Common threads */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Common Threads
        </p>
        {model.threads.length ? (
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {model.threads.map((t) => (
              <div
                key={t.digit}
                className={`rounded-xl border bg-gradient-to-br px-3 py-3 ${t.tint}`}
              >
                <p className="text-lg text-ink">
                  <span aria-hidden>{t.glyph}</span>{" "}
                  <span className="brand font-semibold">{t.digit}</span>
                </p>
                <p className="mt-0.5 text-sm font-medium text-ink">{t.trait}</p>
                <p className="mt-1.5 text-[11px] leading-4 text-ink-soft">
                  Appears in: {t.appearsIn.join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">
            Methods emphasize different digits—compare the snapshot groups
            rather than forcing one story.
          </p>
        )}
      </div>

      {/* Divergences */}
      {model.divergences.length ? (
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Where Systems Diverge
          </p>
          <div className="mt-2 space-y-2">
            {model.divergences.map((d) => (
              <div
                key={d.id}
                className="flex flex-wrap items-start gap-3 rounded-xl border border-[var(--line)] bg-white/60 px-3 py-3"
              >
                <span className="text-lg text-ink" aria-hidden>
                  {d.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{d.title}</p>
                  <p className="mt-1 flex flex-wrap gap-1.5 text-xs">
                    {d.values.map((v) => (
                      <span
                        key={v}
                        className="rounded-full border border-[var(--line)] bg-mist/50 px-2 py-0.5 text-ink"
                      >
                        {v}
                      </span>
                    ))}
                  </p>
                  <p className="mt-1.5 text-xs text-ink-soft">{d.insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Core narrative */}
      <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-paper via-white to-mist/40 px-4 py-5">
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Core Narrative
        </p>
        <p className="mt-2 text-sm leading-7 text-ink">{model.corePoem}</p>
        <ul className="mt-4 space-y-2.5">
          {model.narrative.map((beat) => (
            <li key={beat.id} className="text-sm leading-6">
              <span className="mr-1.5 text-ink-soft" aria-hidden>
                {beat.glyph}
              </span>
              <strong className="text-ink">{beat.label}</strong>
              <span className="text-ink-soft"> — {beat.line}</span>
            </li>
          ))}
        </ul>
      </div>

      {legacyBody ? (
        <div>
          <button
            type="button"
            className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs text-ink"
            onClick={() => setShowLegacy((v) => !v)}
          >
            {showLegacy ? "Hide" : "View"} classic prose summary
          </button>
          {showLegacy ? (
            <div className="mt-3 whitespace-pre-wrap text-sm leading-7 text-ink-soft">
              {legacyBody}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
