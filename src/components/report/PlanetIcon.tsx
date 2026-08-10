"use client";

import Link from "next/link";
import type { PlanetInfo } from "@/lib/numerology/planets";

const TINT_LIGHT: Record<string, string> = {
  sun: "bg-amber-300 text-amber-950 border-amber-500",
  moon: "bg-slate-300 text-slate-950 border-slate-500",
  mars: "bg-red-300 text-red-950 border-red-500",
  mercury: "bg-emerald-300 text-emerald-950 border-emerald-500",
  jupiter: "bg-orange-300 text-orange-950 border-orange-500",
  venus: "bg-rose-300 text-rose-950 border-rose-500",
  saturn: "bg-indigo-300 text-indigo-950 border-indigo-500",
  rahu: "bg-violet-300 text-violet-950 border-violet-500",
  ketu: "bg-stone-300 text-stone-950 border-stone-500",
  uranus: "bg-cyan-300 text-cyan-950 border-cyan-500",
  neptune: "bg-sky-300 text-sky-950 border-sky-500",
};

const TINT_DARK: Record<string, string> = {
  sun: "bg-amber-500 text-white border-amber-200 shadow-sm",
  moon: "bg-slate-500 text-white border-slate-200 shadow-sm",
  mars: "bg-red-500 text-white border-red-200 shadow-sm",
  mercury: "bg-emerald-500 text-white border-emerald-200 shadow-sm",
  jupiter: "bg-orange-500 text-white border-orange-200 shadow-sm",
  venus: "bg-rose-500 text-white border-rose-200 shadow-sm",
  saturn: "bg-indigo-500 text-white border-indigo-200 shadow-sm",
  rahu: "bg-violet-500 text-white border-violet-200 shadow-sm",
  ketu: "bg-stone-500 text-white border-stone-200 shadow-sm",
  uranus: "bg-cyan-500 text-white border-cyan-200 shadow-sm",
  neptune: "bg-sky-500 text-white border-sky-200 shadow-sm",
};

type Props = {
  planet: PlanetInfo;
  size?: "sm" | "md";
  showName?: boolean;
  variant?: "light" | "dark";
  /** When set, the icon (and name) link to a planet guide in a new tab */
  href?: string;
};

export function PlanetIcon({
  planet,
  size = "sm",
  showName = true,
  variant = "light",
  href,
}: Props) {
  const tint =
    (variant === "dark" ? TINT_DARK : TINT_LIGHT)[planet.id] ??
    (variant === "dark" ? TINT_DARK.sun : TINT_LIGHT.sun);
  const box = size === "md" ? "h-10 w-10 text-xl" : "h-8 w-8 text-[15px]";
  const nameClass =
    variant === "dark"
      ? "text-sm leading-none text-paper/95"
      : "text-sm leading-none text-ink";

  const tip = href
    ? `Click for more about ${planet.name}`
    : planet.name;

  const inner = (
    <>
      <span
        title={tip}
        aria-label={tip}
        className={`inline-flex shrink-0 ${box} items-center justify-center rounded-full border font-bold ${tint}`}
        style={{ lineHeight: 1 }}
      >
        <span
          aria-hidden
          className="flex h-full w-full items-center justify-center"
          style={{ lineHeight: 1, fontSize: "inherit" }}
        >
          {planet.symbol}
        </span>
      </span>
      {showName ? (
        <span className={`${nameClass} self-center`}>{planet.name}</span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={tip}
        className="inline-flex h-8 items-center gap-2 outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold"
      >
        {inner}
      </Link>
    );
  }

  return <span className="inline-flex h-8 items-center gap-2">{inner}</span>;
}
