"use client";

import { CountryNumberStat } from "@/components/trivia/CountryNumberStat";
import { CountryWikiMap } from "@/components/trivia/CountryWikiMap";

export type CountryCardRow = {
  name: string;
  iso2: string;
  dob: string;
  lifePath: number;
  destiny: number;
  psychic: number;
};

export function CountryCards({
  rows,
  emptyLabel = "No countries match these filters.",
}: {
  rows: CountryCardRow[];
  emptyLabel?: string;
}) {
  if (!rows.length) {
    return <p className="mt-2 text-sm text-ink-soft">{emptyLabel}</p>;
  }
  return (
    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
      {rows.map((c) => (
        <li
          key={c.iso2}
          className="flex gap-3 rounded-xl border border-[var(--line)] bg-white/50 p-3"
        >
          <div className="flex w-[5.5rem] shrink-0 flex-col items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/w80/${c.iso2}.png`}
              alt={`${c.name} flag`}
              width={80}
              height={53}
              className="h-auto w-full rounded border border-[var(--line)]"
              loading="lazy"
            />
            <CountryWikiMap name={c.name} iso2={c.iso2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-ink">{c.name}</p>
            <p className="mt-0.5 text-xs text-ink-soft">
              Founding / independence: {c.dob}
            </p>
            <dl className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
              <CountryNumberStat
                kind="lifePath"
                value={c.lifePath}
                countryName={c.name}
              />
              <CountryNumberStat
                kind="destiny"
                value={c.destiny}
                countryName={c.name}
              />
              <CountryNumberStat
                kind="psychic"
                value={c.psychic}
                countryName={c.name}
              />
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
