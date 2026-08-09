"use client";

import { GuideNumberLink } from "@/components/report/GuideNumberLink";

type Props = {
  psychic: string;
  destiny: string;
  nameNumber: string;
  rulingPlanet: string;
};

export function VedicPanel({
  psychic,
  destiny,
  nameNumber,
  rulingPlanet,
}: Props) {
  const cards = [
    { label: "Psychic", topic: "vedic-psychic" as const, value: psychic },
    { label: "Destiny", topic: "vedic-destiny" as const, value: destiny },
    { label: "Name", topic: "vedic-name" as const, value: nameNumber },
  ];

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-gradient-to-br from-ink via-[#1e293b] to-[#0f172a] p-6 text-paper">
      <p className="text-sm uppercase tracking-[0.2em] text-sand">Vedic numbers</p>
      <p className="mt-2 text-sm text-paper/75">
        Reflective panel (not a full kundli). Hover a number · click opens a
        guide in a new tab.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {cards.map((c) => (
          <div
            key={c.topic}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center"
          >
            <p className="text-[10px] uppercase tracking-wider text-sand">
              {c.label}
            </p>
            <GuideNumberLink
              topic={c.topic}
              value={c.value}
              label={`Vedic ${c.label}`}
              className="brand mt-2 inline-block text-3xl text-paper hover:text-sand"
            />
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-paper/80">
        Ruling planet association (psychic):{" "}
        <span className="text-sand">{rulingPlanet}</span>
      </p>
    </div>
  );
}
