"use client";

import Link from "next/link";
import { useState } from "react";
import { ChartTipPanel } from "@/components/report/ChartTipPanel";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import { guideHref } from "@/lib/guides/content";
import { planetGuideHref } from "@/lib/guides/planets";
import { coreTraitFor } from "@/lib/numerology/meanings";
import { planetForVedic } from "@/lib/numerology/planets";

type Props = {
  psychic: string;
  destiny: string;
  nameNumber: string;
};

export function VedicBirthChart({ psychic, destiny, nameNumber }: Props) {
  const [tip, setTip] = useState<string | null>(null);

  const nodes = [
    {
      label: "Psychic",
      topic: "vedic-psychic" as const,
      value: psychic,
      ring: "border-amber-300/70 bg-amber-50 text-amber-950",
    },
    {
      label: "Destiny",
      topic: "vedic-destiny" as const,
      value: destiny,
      ring: "border-orange-300/70 bg-orange-50 text-orange-950",
    },
    {
      label: "Name",
      topic: "vedic-name" as const,
      value: nameNumber,
      ring: "border-stone-300/70 bg-stone-50 text-stone-950",
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        Reflective Vedic <span className="text-ink">number</span> birth
        chart—not a full kundli with houses, dashas, or planetary placements.
        Hover for meaning; click numbers or planets for guides.
      </p>

      <div className="relative mx-auto flex max-w-md flex-col items-center gap-4 py-2">
        <div className="grid w-full grid-cols-3 gap-3">
          {nodes.map((n) => {
            const planet = planetForVedic(n.value);
            const trait = coreTraitFor(n.value);
            const tileTip = [
              `Vedic ${n.label} ${n.value}`,
              trait,
              `Ruling planet association: ${planet.name}`,
            ].join("\n");
            return (
              <div key={n.topic} className="flex flex-col items-center gap-2">
                <Link
                  href={guideHref(n.topic, n.value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Click for more about Vedic ${n.label} ${n.value}`}
                  onMouseEnter={() => setTip(tileTip)}
                  onMouseLeave={() => setTip(null)}
                  onFocus={() => setTip(tileTip)}
                  onBlur={() => setTip(null)}
                  className={`flex aspect-square w-full flex-col items-center justify-center rounded-2xl border px-2 text-center outline-none transition hover:border-gold/50 hover:bg-white focus-visible:ring-2 focus-visible:ring-gold ${n.ring}`}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-80">
                    {n.label}
                  </span>
                  <span className="brand mt-1 text-3xl leading-none">{n.value}</span>
                  <span className="mt-1 text-[10px] leading-snug opacity-80">
                    {trait}
                  </span>
                </Link>
                <Link
                  href={planetGuideHref("vedic", planet.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Click for more about ${planet.name}`}
                  onMouseEnter={() =>
                    setTip(
                      `${planet.name} · Vedic association for ${n.label} ${n.value}`,
                    )
                  }
                  onMouseLeave={() => setTip(null)}
                  className="outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <PlanetIcon planet={planet} size="sm" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <ChartTipPanel
        tip={tip}
        empty="Hover a number or planet chip for its Vedic emphasis."
      />

      <p className="text-xs text-ink-soft">
        Belief-based number chart only. Not Jyotish house placement, not medical
        or relationship advice.
      </p>
    </div>
  );
}
