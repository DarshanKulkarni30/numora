"use client";

import {
  normalizeCompatTone,
  type CompatTone,
} from "@/lib/numerology/compatibility";

const TONE_SCORE: Record<CompatTone, number> = {
  Amazing: 4,
  Favourable: 3,
  Neutral: 2,
  Challenging: 1,
};

type Props = {
  romantic: string;
  business: string;
  friendship: string;
  hideRomantic?: boolean;
  size?: number;
};

function score(tone: string): number {
  if (tone === "—") return 0;
  const n = normalizeCompatTone(tone);
  return n in TONE_SCORE ? TONE_SCORE[n as CompatTone] : 2;
}

export function CompatRadar({
  romantic,
  business,
  friendship,
  hideRomantic = false,
  size = 240,
}: Props) {
  const axes = hideRomantic
    ? [
        { key: "business", label: "Business", value: score(business) },
        { key: "friendship", label: "Friendship", value: score(friendship) },
        { key: "team", label: "Team", value: score(business) },
      ]
    : [
        { key: "romantic", label: "Romantic", value: score(romantic) },
        { key: "business", label: "Business", value: score(business) },
        { key: "friendship", label: "Friendship", value: score(friendship) },
      ];

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
  const levels = 4;
  const angleStep = (Math.PI * 2) / axes.length;
  const start = -Math.PI / 2;

  const point = (i: number, v: number) => {
    const a = start + i * angleStep;
    const r = (v / levels) * maxR;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  };

  const gridPolys = Array.from({ length: levels }, (_, li) => {
    const lvl = li + 1;
    return axes
      .map((_, i) => point(i, lvl).join(","))
      .join(" ");
  });

  const dataPoly = axes.map((ax, i) => point(i, ax.value).join(",")).join(" ");

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Compatibility chart. Each spoke is one kind of bond; the further the point sits from the centre, the easier that bond tends to be. ${axes
          .map((ax) => `${ax.key}: ${ax.value} out of ${levels}`)
          .join(". ")}.`}
        className="max-w-full"
      >
        {gridPolys.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="var(--line)"
            strokeWidth={1}
          />
        ))}
        {axes.map((ax, i) => {
          const [x, y] = point(i, levels);
          const [lx, ly] = point(i, levels + 0.55);
          return (
            <g key={ax.key}>
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="var(--line)"
                strokeWidth={1}
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-ink text-[11px]"
              >
                {ax.label}
              </text>
            </g>
          );
        })}
        <polygon
          points={dataPoly}
          fill="rgba(245, 158, 11, 0.35)"
          stroke="#B45309"
          strokeWidth={2}
        />
        {axes.map((ax, i) => {
          const [x, y] = point(i, ax.value);
          return (
            <circle key={ax.key} cx={x} cy={y} r={4} fill="#0F172A" />
          );
        })}
      </svg>
      <p className="text-center text-[11px] leading-4 text-ink-soft">
        The further a point sits from the centre, the easier that kind of bond
        tends to be. The outer ring is the smoothest reading and the centre is
        the one that takes most effort — it describes effort required, not
        whether a relationship will work.
      </p>
      <ul className="w-full space-y-1 text-sm text-ink-soft">
        {(hideRomantic
          ? [
              ["Business / Team", business],
              ["Friendship", friendship],
            ]
          : [
              ["Romantic", romantic],
              ["Business", business],
              ["Friendship", friendship],
            ]
        ).map(([label, tone]) => (
          <li key={label} className="flex justify-between gap-3">
            <span>{label}</span>
            <span className="text-ink">{tone}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function toneToScore(tone: string): number {
  return score(tone);
}
