"use client";

import { coreTraitFor } from "@/lib/numerology/meanings";

type Kind = "lifePath" | "destiny" | "psychic";

const LABELS: Record<Kind, string> = {
  lifePath: "Life Path",
  destiny: "Destiny",
  psychic: "Psychic",
};

const BLURBS: Record<Kind, string> = {
  lifePath:
    "Pythagorean Life Path from the country’s independence / formation date",
  destiny: "Vedic Destiny number from the country’s founding date total",
  psychic: "Vedic Psychic number from the day of the country’s founding date",
};

type Props = {
  kind: Kind;
  value: number;
  countryName: string;
};

export function CountryNumberStat({ kind, value, countryName }: Props) {
  const label = LABELS[kind];
  const tip = [
    `${countryName} · ${label} ${value}`,
    coreTraitFor(value),
    BLURBS[kind],
    "Reflective trivia only—not a national character claim.",
  ].join(" — ");

  return (
    <div
      title={tip}
      className="group relative cursor-help rounded-lg bg-mist/70 px-1 py-1.5 transition hover:bg-gold/15"
    >
      <dt className="text-ink-soft">{label}</dt>
      <dd className="brand text-base text-ink underline decoration-dotted decoration-ink-soft/40 underline-offset-2">
        {value}
      </dd>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+0.35rem)] left-1/2 z-20 hidden w-44 -translate-x-1/2 rounded-lg border border-[var(--line)] bg-paper px-2.5 py-2 text-left text-[10px] leading-snug text-ink shadow-md group-hover:block group-focus-within:block"
      >
        <span className="font-medium text-ink">
          {label} {value}
        </span>
        <span className="mt-0.5 block text-ink-soft">{coreTraitFor(value)}</span>
        <span className="mt-1 block text-ink-soft/90">{BLURBS[kind]}</span>
      </span>
    </div>
  );
}
