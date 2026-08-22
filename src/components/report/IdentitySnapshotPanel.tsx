"use client";

import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import type { GuideTopic } from "@/lib/guides/content";
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

function guideForPetal(
  petal: SnapshotCapsule,
): { topic: GuideTopic; value: string; label: string } | null {
  switch (petal.id) {
    case "life-path":
      return { topic: "life-path", value: petal.value, label: "Life Path" };
    case "expression":
      return { topic: "expression", value: petal.value, label: "Expression" };
    case "destiny":
      return {
        topic: "vedic-destiny",
        value: petal.value,
        label: "Vedic Destiny",
      };
    case "year":
      return {
        topic: "personal-year",
        value: petal.value,
        label: "Personal Year",
      };
    case "sun":
      return {
        topic: "sun-sign",
        value: petal.value.toLowerCase(),
        label: "Sun Sign",
      };
    default:
      return null;
  }
}

function shortLabel(label: string): string {
  if (label === "Vedic Destiny") return "Vedic Destiny";
  if (label === "Personal Year") return "Personal Year";
  if (label === "Life Path") return "Life Path";
  if (label === "Sun Sign") return "Sun";
  return label;
}

function OrbitHotspot({
  tip,
  active,
  dimmed,
  onFocus,
  onToggle,
  children,
}: {
  tip: string;
  active: boolean;
  dimmed: boolean;
  onFocus: () => void;
  onToggle: () => void;
  children: ReactNode;
}) {
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };
  return (
    <g
      opacity={dimmed ? 0.32 : 1}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={tip}
      aria-pressed={active}
      onClick={onToggle}
      onMouseEnter={onFocus}
      onKeyDown={onKeyDown}
    >
      <title>{tip}</title>
      {children}
    </g>
  );
}

/** Interactive orbit — headline tones; repeated digits share a stronger ring. */
function IdentityOrbit({ petals }: { petals: SnapshotCapsule[] }) {
  const n = petals.length || 1;
  const [focusId, setFocusId] = useState<string | null>(null);

  const digitCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of petals) {
      const d = Number(p.value);
      if (!Number.isFinite(d)) continue;
      const key = String(d);
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [petals]);

  const active = petals.find((p) => p.id === focusId) ?? null;
  const activeGuide = active ? guideForPetal(active) : null;
  const clusterNote = useMemo(() => {
    const clusters = [...digitCounts.entries()]
      .filter(([, c]) => c >= 2)
      .sort((a, b) => b[1] - a[1]);
    if (!clusters.length) return "Headline tones emphasize different digits.";
    return clusters
      .map(([d, c]) => `${d} appears on ${c} petals`)
      .join(" · ");
  }, [digitCounts]);

  return (
    <div>
      <svg
        viewBox="0 0 280 280"
        className="mx-auto h-auto w-full max-w-[22rem]"
        role="img"
        aria-label="Identity orbit of headline numbers. Hover or tap a petal for details."
      >
        <circle
          cx="140"
          cy="140"
          r="92"
          fill="none"
          stroke="rgb(196 164 108 / 0.25)"
          strokeWidth="1"
          strokeDasharray="4 5"
        />
        <circle
          cx="140"
          cy="140"
          r="34"
          fill="rgb(250 248 243)"
          stroke="rgb(30 58 107)"
          strokeWidth="1.4"
          className="motion-safe:animate-pulse"
        />
        <text
          x="140"
          y="136"
          textAnchor="middle"
          fontSize="11"
          fill="rgb(30 58 107)"
          fontWeight="700"
        >
          Identity
        </text>
        <text
          x="140"
          y="150"
          textAnchor="middle"
          fontSize="7"
          fill="rgb(70 82 98)"
        >
          Orbit
        </text>

        {petals.map((p, i) => {
          const ang = (-90 + (i * 360) / n) * (Math.PI / 180);
          const cx = 140 + Math.cos(ang) * 92;
          const cy = 140 + Math.sin(ang) * 92;
          const digit = Number(p.value);
          const clustered =
            Number.isFinite(digit) && (digitCounts.get(String(digit)) ?? 0) >= 2;
          const tip = `${p.label} ${p.value} · ${p.trait}`;
          const isFocus = focusId === p.id;
          return (
            <OrbitHotspot
              key={p.id}
              tip={tip}
              active={isFocus}
              dimmed={Boolean(focusId && !isFocus)}
              onFocus={() => setFocusId(p.id)}
              onToggle={() =>
                setFocusId((cur) => (cur === p.id ? null : p.id))
              }
            >
              <line
                x1="140"
                y1="140"
                x2={cx}
                y2={cy}
                stroke={
                  clustered
                    ? "rgb(180 83 9 / 0.45)"
                    : "rgb(30 58 107 / 0.18)"
                }
                strokeWidth={clustered ? 1.6 : 1}
              />
              <ellipse
                cx={cx}
                cy={cy}
                rx={isFocus ? 36 : 32}
                ry={isFocus ? 24 : 22}
                transform={`rotate(${(i * 360) / n} ${cx} ${cy})`}
                fill={
                  clustered
                    ? "rgb(180 83 9 / 0.1)"
                    : "rgb(255 255 255 / 0.95)"
                }
                stroke={
                  clustered ? "rgb(180 83 9)" : "rgb(196 164 108 / 0.85)"
                }
                strokeWidth={isFocus ? 2.4 : clustered ? 1.8 : 1.2}
              />
              <text
                x={cx}
                y={cy - 4}
                textAnchor="middle"
                fontSize={isFocus ? 14 : 12}
                fontWeight="700"
                fill="rgb(30 40 55)"
              >
                {p.value.length > 10 ? `${p.value.slice(0, 8)}…` : p.value}
              </text>
              <text
                x={cx}
                y={cy + 10}
                textAnchor="middle"
                fontSize="7"
                fill="rgb(70 82 98)"
              >
                {shortLabel(p.label)}
              </text>
            </OrbitHotspot>
          );
        })}
      </svg>

      {active ? (
        <div className="mt-2 rounded-xl border border-[var(--line)] bg-mist/45 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
            {active.label}
            {Number.isFinite(Number(active.value)) &&
            (digitCounts.get(String(Number(active.value))) ?? 0) >= 2
              ? " · clustered tone"
              : ""}
          </p>
          <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
            {activeGuide ? (
              <GuideNumberLink
                topic={activeGuide.topic}
                value={activeGuide.value}
                label={activeGuide.label}
                display={active.value}
                className="brand text-lg text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
              />
            ) : (
              <span className="brand text-lg text-ink">{active.value}</span>
            )}
            <span className="text-sm text-ink-soft">{active.trait}</span>
          </p>
          <p className="mt-1 text-[11px] leading-5 text-ink-soft">
            {active.glyph} Headline petal in the Identity Snapshot — tap again
            to clear.
          </p>
        </div>
      ) : (
        <p className="mt-2 text-center text-[11px] leading-5 text-ink-soft">
          Hover or tap a petal · {clusterNote}
        </p>
      )}
    </div>
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="rounded-xl border border-[var(--line)] bg-white/70 p-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Identity Orbit
          </p>
          <p className="mt-0.5 text-[11px] text-ink-soft">
            Where headline tones sit together — clustered digits share a warmer
            ring.
          </p>
          <IdentityOrbit petals={model.flowerPetals} />
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              What your chart emphasises
            </p>
            <p className="mt-0.5 text-[10px] leading-4 text-ink-soft">
              The bar splits your chart positions by the kind of trait each one
              points at. A wider band means more of your numbers push that way.
            </p>
            <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-mist">
              {model.toneBalance
                .filter((t) => t.weight > 0)
                .map((t) => (
                  <div
                    key={t.id}
                    title={`${t.label}: ${t.weight}% of your chart positions point this way.`}
                    className={`${t.tint} h-full`}
                    style={{ width: `${t.weight}%` }}
                  />
                ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-soft">
              {model.toneBalance.map((t) => (
                <li key={t.id}>
                  <span
                    className={`mr-1 inline-block h-2 w-2 rounded-full ${t.tint}`}
                  />
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
            <div className="mt-2 grid max-w-[9rem] grid-cols-3 gap-1.5">
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
