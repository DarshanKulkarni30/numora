"use client";

import type { DiscoveryPerson } from "@/lib/trivia/discovery";
import { personDiscoveryKey, personInitials } from "@/lib/trivia/discovery";

type Props = {
  rows: DiscoveryPerson[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  compact?: boolean;
  emptyLabel?: string;
};

function SimilarityRings({
  row,
  size,
}: {
  row: DiscoveryPerson;
  size: number;
}) {
  const rings = [
    { layer: row.layers.lifePath, r: 42, label: "Life Path" },
    { layer: row.layers.destiny, r: 32, label: "Destiny" },
    { layer: row.layers.psychic, r: 22, label: "Psychic" },
  ];

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        className="match-similarity-rings absolute inset-0 h-full w-full"
      >
        {rings.map(({ layer, r, label }) => (
          <circle
            key={layer.id}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={layer.color}
            strokeWidth={layer.matched ? 4.2 * layer.strength : 1.4}
            strokeOpacity={layer.matched ? 0.9 : 0.38}
            strokeDasharray={layer.matched ? undefined : "2.4 3.2"}
          >
            <title>
              {label} {layer.value}
              {layer.matched ? " · match" : ` · ${layer.distance} away`}
            </title>
          </circle>
        ))}
      </svg>
      <span
        className="absolute inset-[28%] flex items-center justify-center rounded-full text-[0.7rem] font-semibold text-ink"
        style={{
          background: `linear-gradient(160deg, ${row.toneHex}55, var(--mist))`,
        }}
      >
        {personInitials(row.person.name)}
      </span>
    </div>
  );
}

function NumberGlyphs({ row }: { row: DiscoveryPerson }) {
  const items = [row.layers.lifePath, row.layers.destiny, row.layers.psychic];
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {items.map((layer) => (
        <li
          key={layer.id}
          title={`${layer.label} ${layer.value}${layer.matched ? " · match" : ""}`}
          className={`flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] leading-none ${
            layer.matched
              ? "border-[var(--line)] bg-white/90 text-ink"
              : "border-transparent bg-white/40 text-ink-soft"
          }`}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: layer.color }}
          />
          <span className="uppercase tracking-wider text-ink-soft">
            {layer.id === "lifePath" ? "LP" : layer.id === "destiny" ? "DN" : "PS"}
          </span>
          <span className="brand text-ink">{layer.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function MatchGallery({
  rows,
  selectedKey,
  onSelect,
  compact = false,
  emptyLabel = "No personality matches for this filter.",
}: Props) {
  if (!rows.length) {
    return <p className="mt-2 text-sm text-ink-soft">{emptyLabel}</p>;
  }

  return (
    <ul
      className={`mt-3 grid gap-3 ${
        compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {rows.map((row) => {
        const key = personDiscoveryKey(row.person);
        const selected = selectedKey === key;
        return (
          <li key={key}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(key)}
              className={`trivia-match-card w-full rounded-2xl border p-3 text-left ${
                row.kind === "triad" ? "trivia-match-card--triad" : ""
              } ${
                selected
                  ? "border-gold bg-white shadow-sm ring-2 ring-gold/50"
                  : "border-[var(--line)] bg-white/70"
              }`}
              style={{
                backgroundImage: `linear-gradient(165deg, ${row.toneHex}26, rgba(255,255,255,0.92) 48%)`,
              }}
            >
              <div className="flex gap-3">
                <SimilarityRings row={row} size={compact ? 72 : 88} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="brand text-ink leading-snug">{row.person.name}</p>
                    <span
                      title={row.glyphLabel}
                      className="shrink-0 rounded-full border border-[var(--line)] bg-white/80 px-1.5 py-0.5 text-[11px] text-ink"
                    >
                      {row.glyph}{" "}
                      <span className="text-ink-soft">{row.glyphLabel}</span>
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-ink-soft">
                    {row.person.note}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-soft">{row.person.dob}</p>
                </div>
              </div>
              <NumberGlyphs row={row} />
              <p className="mt-2 text-xs text-ink">{row.reason}</p>
              {selected ? (
                <p className="mt-1 text-xs text-ink-soft">{row.insight}</p>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
