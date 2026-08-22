"use client";

import type { RadarAxis } from "@/lib/numerology/enhanced/radarModel";

type Props = {
  axes: RadarAxis[];
};

/** Chart-presence radar from theme seat counts (not personality percentages). */
export function EnhancedThemeRadar({ axes }: Props) {
  const max = Math.max(1, ...axes.map((a) => a.count));
  const cx = 110;
  const cy = 110;
  const r = 78;
  const n = axes.length;
  const pts = axes.map((a, i) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const rr = (a.count / max) * r;
    return `${cx + Math.cos(ang) * rr},${cy + Math.sin(ang) * rr}`;
  });
  const ring = (frac: number) =>
    axes
      .map((_, i) => {
        const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        return `${cx + Math.cos(ang) * r * frac},${cy + Math.sin(ang) * r * frac}`;
      })
      .join(" ");

  return (
    <figure className="mx-auto max-w-sm">
      <svg
        viewBox="0 0 220 220"
        className="h-auto w-full"
        role="img"
        aria-label={`How many of your chart positions mention each theme. ${axes
          .map((a) => `${a.label}: ${a.count}`)
          .join(". ")}.`}
      >
        <polygon
          points={ring(1)}
          fill="none"
          stroke="currentColor"
          className="text-[var(--line)]"
          strokeWidth="1"
        />
        <polygon
          points={ring(0.5)}
          fill="none"
          stroke="currentColor"
          className="text-[var(--line)]"
          strokeWidth="1"
        />
        {axes.map((_, i) => {
          const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(ang) * r}
              y2={cy + Math.sin(ang) * r}
              className="text-[var(--line)]"
              stroke="currentColor"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={pts.join(" ")}
          className="fill-sea/20 stroke-sea"
          strokeWidth="1.5"
        />
        {axes.map((a, i) => {
          const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
          const lx = cx + Math.cos(ang) * (r + 18);
          const ly = cy + Math.sin(ang) * (r + 18);
          return (
            <text
              key={a.id}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-ink"
              fontSize="9"
            >
              {a.label} {a.count}
            </text>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-xs leading-5 text-ink-soft">
        Each spoke counts how many of your chart positions point at that theme.
        A longer spoke means the theme turns up in more places, so you are
        likely to meet it often. It is a count, not a score, and a short spoke
        is not a weakness.
      </figcaption>
    </figure>
  );
}
