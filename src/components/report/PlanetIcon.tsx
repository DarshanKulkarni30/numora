"use client";

import type { PlanetInfo } from "@/lib/numerology/planets";

const TINT: Record<string, string> = {
  sun: "bg-amber-100 text-amber-900 border-amber-300/80",
  moon: "bg-slate-100 text-slate-700 border-slate-300/80",
  mars: "bg-red-100 text-red-800 border-red-300/70",
  mercury: "bg-emerald-100 text-emerald-800 border-emerald-300/70",
  jupiter: "bg-orange-100 text-orange-900 border-orange-300/70",
  venus: "bg-rose-100 text-rose-800 border-rose-300/70",
  saturn: "bg-indigo-100 text-indigo-900 border-indigo-300/70",
  rahu: "bg-violet-100 text-violet-900 border-violet-300/70",
  ketu: "bg-stone-100 text-stone-800 border-stone-300/70",
  uranus: "bg-cyan-100 text-cyan-900 border-cyan-300/70",
  neptune: "bg-sky-100 text-sky-900 border-sky-300/70",
};

type Props = {
  planet: PlanetInfo;
  size?: "sm" | "md";
  showName?: boolean;
};

export function PlanetIcon({ planet, size = "sm", showName = true }: Props) {
  const tint = TINT[planet.id] ?? TINT.sun;
  const box = size === "md" ? "h-10 w-10 text-lg" : "h-8 w-8 text-base";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        title={planet.name}
        aria-label={planet.name}
        className={`inline-flex ${box} items-center justify-center rounded-full border ${tint}`}
      >
        {planet.symbol}
      </span>
      {showName ? (
        <span className="text-sm text-ink">{planet.name}</span>
      ) : null}
    </span>
  );
}
