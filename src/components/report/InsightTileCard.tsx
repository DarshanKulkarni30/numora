"use client";

import { useState } from "react";
import type { InsightCardModel, InsightGeometry } from "@/lib/numerology/insightTiles";

function GeometryWatermark({ kind }: { kind: InsightGeometry }) {
  const stroke = "currentColor";
  if (kind === "hexagon") {
    return (
      <polygon
        points="50,8 86,29 86,71 50,92 14,71 14,29"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
      />
    );
  }
  if (kind === "triangle") {
    return (
      <polygon
        points="50,12 88,86 12,86"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
      />
    );
  }
  if (kind === "crescent") {
    return (
      <path
        d="M62 18a32 32 0 1 0 0 64 26 26 0 1 1 0-64z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
      />
    );
  }
  if (kind === "wave") {
    return (
      <path
        d="M10 50c12-18 18-18 30 0s18 18 30 0 18-18 20 0"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
      />
    );
  }
  if (kind === "lotus") {
    return (
      <path
        d="M50 78c-8-16-22-24-30-26 10-4 18-14 20-24 6 12 14 18 20 20 6-2 14-8 20-20 2 10 10 20 20 24-8 2-22 10-30 26z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
      />
    );
  }
  if (kind === "square") {
    return (
      <rect
        x="18"
        y="18"
        width="64"
        height="64"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
      />
    );
  }
  if (kind === "mandala") {
    return (
      <>
        <circle cx="50" cy="50" r="32" fill="none" stroke={stroke} strokeWidth="1" />
        <circle cx="50" cy="50" r="18" fill="none" stroke={stroke} strokeWidth="1" />
        <circle cx="50" cy="50" r="6" fill="none" stroke={stroke} strokeWidth="1" />
      </>
    );
  }
  if (kind === "grid") {
    return (
      <>
        <path
          d="M22 22h56v56H22z M22 50h56 M50 22v56"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
        />
      </>
    );
  }
  if (kind === "arrow") {
    return (
      <path
        d="M50 82 V22 M36 38 L50 22 L64 38"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    );
  }
  if (kind === "circles") {
    return (
      <>
        <circle cx="38" cy="50" r="18" fill="none" stroke={stroke} strokeWidth="1.2" />
        <circle cx="62" cy="50" r="18" fill="none" stroke={stroke} strokeWidth="1.2" />
      </>
    );
  }
  if (kind === "speech") {
    return (
      <path
        d="M22 28h56v36H48l-12 12 V64H22z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
      />
    );
  }
  if (kind === "hourglass") {
    return (
      <path
        d="M30 20h40v8L58 50l12 22v8H30v-8l12-22L30 28z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
      />
    );
  }
  if (kind === "ring") {
    return (
      <circle cx="50" cy="50" r="28" fill="none" stroke={stroke} strokeWidth="1.4" />
    );
  }
  if (kind === "calendar") {
    return (
      <rect
        x="24"
        y="28"
        width="52"
        height="48"
        rx="4"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
      />
    );
  }
  if (kind === "compass") {
    return (
      <>
        <circle cx="50" cy="50" r="28" fill="none" stroke={stroke} strokeWidth="1" />
        <path d="M50 28 L56 50 L50 72 L44 50 Z" fill="none" stroke={stroke} strokeWidth="1.2" />
      </>
    );
  }
  return (
    <>
      <path
        d="M22 22h56v56H22z M22 50h56 M50 22v56"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
      />
    </>
  );
}

function Tile({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "core" | "you" | "growth";
}) {
  const bg =
    tone === "core"
      ? "bg-mist/70"
      : tone === "growth"
        ? "bg-amber-50/80"
        : "bg-white/80";
  return (
    <div className={`rounded-xl border border-[var(--line)] px-3 py-2.5 ${bg}`}>
      <p className="text-[10px] uppercase tracking-wider text-ink-soft">{title}</p>
      <p className="mt-1 text-sm leading-6 text-ink">{body}</p>
    </div>
  );
}

export function InsightTileCard({ card }: { card: InsightCardModel }) {
  const [open, setOpen] = useState(false);
  const [c0, c1, c2] = card.palette;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70">
      <svg
        viewBox="0 0 100 100"
        className="pointer-events-none absolute -right-6 top-8 h-36 w-36 text-ink opacity-[0.06]"
        aria-hidden
      >
        <GeometryWatermark kind={card.geometry} />
      </svg>

      <header
        className="insight-header relative flex items-start justify-between gap-3 px-4 py-3"
        style={{
          backgroundImage: `linear-gradient(105deg, ${c0}33, ${c1}22 48%, ${c2}28)`,
        }}
      >
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            {card.systemTag}
          </p>
          <p className="mt-0.5 flex flex-wrap items-baseline gap-2 text-ink">
            <span className="insight-glyph brand text-lg" aria-hidden>
              {card.glyph}
            </span>
            <span className="brand text-lg">
              {card.label} {card.number}
            </span>
            <span className="text-sm text-ink-soft">— {card.keyword}</span>
          </p>
          <span
            className="mt-2 inline-block h-1.5 w-16 rounded-full"
            style={{
              backgroundImage: `linear-gradient(90deg, ${c0}, ${c1}, ${c2})`,
            }}
            title="Colours traditionally linked to this number. Decorative only."
          />
        </div>
        <div
          className="flex gap-1 pt-1"
          title="Three dots: what this number means, how it shows up for you, and what to grow. A filled dot means this card has content for that part."
        >
          {card.dots.map((on, i) => (
            <span
              key={i}
              title={`${["Meaning", "How it shows up", "What to grow"][i] ?? "Section"}: ${on ? "included below" : "not applicable for this number"}`}
              className={`h-2 w-2 rounded-full border ${
                on
                  ? "border-gold-deep bg-gold"
                  : "border-[var(--line)] bg-white"
              }`}
            />
          ))}
        </div>
      </header>

      <div className="relative space-y-2 px-4 py-3">
        <div className="grid gap-2 sm:grid-cols-3">
          <Tile title="Core meaning" body={card.core} tone="core" />
          <Tile title="How it shows up in you" body={card.showsUp} tone="you" />
          <Tile title="Growth cue" body={card.growth} tone="growth" />
        </div>

        <p className="text-sm italic leading-6 text-ink">{card.narrative}</p>

        {card.strengths.length ? (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Strength tie-ins
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {card.strengths.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-[var(--line)] bg-white/80 px-2.5 py-1 text-xs text-ink"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {card.growthTies.length ? (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Growth Mode tie-ins
            </p>
            <ul className="mt-1.5 space-y-1">
              {card.growthTies.map((g) => (
                <li key={g.title} className="text-xs leading-5 text-ink-soft">
                  <span className="font-medium text-ink">{g.title}.</span> {g.body}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-2">
          <p className="text-[11px] text-ink-soft">
            Related:{" "}
            {card.related.map((r) => `${r.label} ${r.value}`).join(" · ")}
          </p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs text-ink"
          >
            {open ? "Hide connections" : "See cross-system harmony"}
          </button>
        </footer>

        {open ? (
          <ul className="space-y-2 rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-2">
            {card.connections.map((c) => (
              <li key={c.pair} className="text-sm">
                <p className="font-medium text-ink">{c.pair}</p>
                <p className="text-xs leading-5 text-ink-soft">
                  {c.kind === "aligned"
                    ? "Aligned · "
                    : c.kind === "complementary"
                      ? "Complementary · "
                      : c.kind === "neutral"
                        ? "Independent · "
                        : "Contrast · "}
                  {c.body}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
