"use client";

import type { PlanetInfo } from "@/lib/numerology/planets";

const TINT_LIGHT: Record<string, string> = {
  sun: "bg-amber-200 text-amber-950 border-amber-400",
  moon: "bg-slate-200 text-slate-900 border-slate-400",
  mars: "bg-red-200 text-red-950 border-red-400",
  mercury: "bg-emerald-200 text-emerald-950 border-emerald-400",
  jupiter: "bg-orange-200 text-orange-950 border-orange-400",
  venus: "bg-rose-200 text-rose-950 border-rose-400",
  saturn: "bg-indigo-200 text-indigo-950 border-indigo-400",
  rahu: "bg-violet-200 text-violet-950 border-violet-400",
  ketu: "bg-stone-200 text-stone-950 border-stone-400",
  uranus: "bg-cyan-200 text-cyan-950 border-cyan-400",
  neptune: "bg-sky-200 text-sky-950 border-sky-400",
};

/** Higher-contrast glyphs on dark panels (Vedic card). */
const TINT_DARK: Record<string, string> = {
  sun: "bg-amber-500 text-white border-amber-300 shadow-sm",
  moon: "bg-slate-400 text-white border-slate-200 shadow-sm",
  mars: "bg-red-500 text-white border-red-300 shadow-sm",
  mercury: "bg-emerald-500 text-white border-emerald-300 shadow-sm",
  jupiter: "bg-orange-500 text-white border-orange-300 shadow-sm",
  venus: "bg-rose-500 text-white border-rose-300 shadow-sm",
  saturn: "bg-indigo-500 text-white border-indigo-300 shadow-sm",
  rahu: "bg-violet-500 text-white border-violet-300 shadow-sm",
  ketu: "bg-stone-500 text-white border-stone-300 shadow-sm",
  uranus: "bg-cyan-500 text-white border-cyan-300 shadow-sm",
  neptune: "bg-sky-500 text-white border-sky-300 shadow-sm",
};

type Props = {
  planet: PlanetInfo;
  size?: "sm" | "md";
  showName?: boolean;
  variant?: "light" | "dark";
};

export function PlanetIcon({
  planet,
  size = "sm",
  showName = true,
  variant = "light",
}: Props) {
  const tint =
    (variant === "dark" ? TINT_DARK : TINT_LIGHT)[planet.id] ??
    (variant === "dark" ? TINT_DARK.sun : TINT_LIGHT.sun);
  const box = size === "md" ? "h-10 w-10 text-xl" : "h-8 w-8 text-base";
  const nameClass =
    variant === "dark"
      ? "text-sm leading-none text-paper/95"
      : "text-sm leading-none text-ink";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        title={planet.name}
        aria-label={planet.name}
        className={`inline-flex shrink-0 ${box} items-center justify-center rounded-full border font-semibold leading-none ${tint}`}
      >
        <span className="block translate-y-px leading-none">{planet.symbol}</span>
      </span>
      {showName ? <span className={nameClass}>{planet.name}</span> : null}
    </span>
  );
}
