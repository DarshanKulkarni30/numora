"use client";

import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import { planetGuideHref } from "@/lib/guides/planets";
import { planetForVedic } from "@/lib/numerology/planets";

type Props = {
  psychic: string;
  destiny: string;
  nameNumber: string;
  rulingPlanet: string;
  destinyRulingPlanet?: string;
};

export function VedicPanel({
  psychic,
  destiny,
  nameNumber,
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
        Reflective panel (not a full kundli). Hover a number or planet · click
        opens a guide in a new tab.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {cards.map((c) => {
          const planet = planetForVedic(c.value);
          return (
            <div
              key={c.topic}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center"
              title={`Vedic ${c.label} ${c.value} · ${planet.name}`}
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
              <div className="mt-3 flex justify-center">
                <PlanetIcon
                  planet={planet}
                  size="sm"
                  variant="dark"
                  href={planetGuideHref("vedic", planet.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 space-y-2 text-sm text-paper/80">
        <p className="flex flex-wrap items-center gap-2">
          <span>Psychic ruling planet:</span>
          <PlanetIcon
            planet={planetForVedic(psychic)}
            size="sm"
            variant="dark"
            href={planetGuideHref("vedic", planetForVedic(psychic).id)}
          />
        </p>
        <p className="flex flex-wrap items-center gap-2">
          <span>Destiny ruling planet:</span>
          <PlanetIcon
            planet={planetForVedic(destiny)}
            size="sm"
            variant="dark"
            href={planetGuideHref("vedic", planetForVedic(destiny).id)}
          />
        </p>
      </div>
    </div>
  );
}
