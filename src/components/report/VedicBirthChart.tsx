"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LoShuChart } from "@/components/report/LoShuChart";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import { guideHref } from "@/lib/guides/content";
import { planetGuideHref } from "@/lib/guides/planets";
import { loShuFromCoreNumbers } from "@/lib/numerology/loShu";
import { planetForVedic } from "@/lib/numerology/planets";

type Props = {
  psychic: string;
  destiny: string;
  nameNumber: string;
};

export function VedicBirthChart({ psychic, destiny, nameNumber }: Props) {
  const aspects = useMemo(
    () => [
      {
        label: "Psychic",
        topic: "vedic-psychic" as const,
        value: psychic,
      },
      {
        label: "Destiny",
        topic: "vedic-destiny" as const,
        value: destiny,
      },
      {
        label: "Name",
        topic: "vedic-name" as const,
        value: nameNumber,
      },
    ],
    [psychic, destiny, nameNumber],
  );

  const loShu = useMemo(
    () =>
      loShuFromCoreNumbers(
        aspects.map((a) => a.value),
        "Vedic number birth chart mapped onto a Lo Shu-style 1–9 grid (Psychic, Destiny, Name). Present/missing digits and arrows follow the same reflective pattern—not a full kundli.",
      ),
    [aspects],
  );

  return (
    <LoShuChart
      loShu={loShu}
      intro={
        <p className="text-sm text-ink-soft">
          Same size and layout as Lo Shu: pastel planes, present/missing cells,
          and dotted arrows. Only Vedic Psychic, Destiny, and Name numbers are
          placed (reduced to 1–9). This is a reflective number chart—not
          houses, dashas, or planetary placements.
        </p>
      }
      aspectLegend={
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Vedic aspects on this grid
          </p>
          <ul className="mt-2 flex flex-wrap gap-3">
            {aspects.map((a) => {
              const planet = planetForVedic(a.value);
              return (
                <li
                  key={a.topic}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-2.5 py-1"
                >
                  <Link
                    href={guideHref(a.topic, a.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Click for more about Vedic ${a.label} ${a.value}`}
                    className="text-xs text-amber-950 hover:text-gold-deep"
                  >
                    {a.label}{" "}
                    <span className="brand text-sm">{a.value}</span>
                  </Link>
                  <PlanetIcon
                    planet={planet}
                    size="sm"
                    showName={false}
                    href={planetGuideHref("vedic", planet.id)}
                  />
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-[11px] text-ink-soft">
            Missing grid numbers are digits not present among Psychic, Destiny,
            and Name—growth invites, not deficits.
          </p>
        </div>
      }
    />
  );
}
