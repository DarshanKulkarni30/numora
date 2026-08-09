"use client";

import { PlanetIcon } from "@/components/report/PlanetIcon";
import {
  planetForPythagorean,
  planetForVedic,
} from "@/lib/numerology/planets";

type Row = {
  aspect: string;
  number: string;
  system: "pythagorean" | "vedic";
};

type Props = {
  lifePath: string;
  birthDay: string;
  expression: string;
  vedicPsychic: string;
  vedicDestiny: string;
};

export function RulingPlanetsPanel({
  lifePath,
  birthDay,
  expression,
  vedicPsychic,
  vedicDestiny,
}: Props) {
  const pythagorean: Row[] = [
    { aspect: "Life Path", number: lifePath, system: "pythagorean" },
    { aspect: "Birth Day", number: birthDay, system: "pythagorean" },
    { aspect: "Expression", number: expression, system: "pythagorean" },
  ];
  const vedic: Row[] = [
    { aspect: "Psychic", number: vedicPsychic, system: "vedic" },
    { aspect: "Destiny", number: vedicDestiny, system: "vedic" },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-ink-soft">
        Traditional planet links by number (belief-based associations—not
        astronomy or astrology forecasts). Icons are symbolic labels only.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
          <h3 className="text-ink">Pythagorean ruling planets</h3>
          <ul className="mt-3 space-y-3">
            {pythagorean.map((row) => {
              const planet = planetForPythagorean(row.number);
              return (
                <li
                  key={row.aspect}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-ink-soft">
                    {row.aspect}{" "}
                    <span className="brand text-ink">{row.number}</span>
                  </span>
                  <PlanetIcon planet={planet} />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
          <h3 className="text-ink">Vedic ruling planets</h3>
          <ul className="mt-3 space-y-3">
            {vedic.map((row) => {
              const planet = planetForVedic(row.number);
              return (
                <li
                  key={row.aspect}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-ink-soft">
                    {row.aspect}{" "}
                    <span className="brand text-ink">{row.number}</span>
                  </span>
                  <PlanetIcon planet={planet} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
