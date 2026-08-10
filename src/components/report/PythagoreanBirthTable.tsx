"use client";

import Link from "next/link";
import { useState } from "react";
import { ChartTipPanel } from "@/components/report/ChartTipPanel";
import { guideHref, type GuideTopic } from "@/lib/guides/content";
import { coreTraitFor } from "@/lib/numerology/meanings";
import { parseDob, reduceNumber } from "@/lib/numerology/reduce";
import type { NumerologySnapshot } from "@/lib/numerology/types";

type Cell = {
  label: string;
  topic: GuideTopic;
  value: string;
  note: string;
};

type Props = {
  dateOfBirth: string;
  snap: NumerologySnapshot;
};

export function PythagoreanBirthTable({ dateOfBirth, snap }: Props) {
  const [tip, setTip] = useState<string | null>(null);
  let dayR = "—";
  let monthR = "—";
  let yearR = "—";
  try {
    const { day, month, year } = parseDob(dateOfBirth);
    dayR = String(reduceNumber(day));
    monthR = String(reduceNumber(month));
    yearR = String(reduceNumber(year));
  } catch {
    /* keep placeholders */
  }

  const cells: Cell[] = [
    {
      label: "Day digit",
      topic: "birth-day",
      value: dayR,
      note: "Reduced birth day (building block of Life Path).",
    },
    {
      label: "Month digit",
      topic: "life-path",
      value: monthR,
      note: "Reduced birth month used in Life Path totaling.",
    },
    {
      label: "Year digit",
      topic: "life-path",
      value: yearR,
      note: "Reduced birth year used in Life Path totaling.",
    },
    {
      label: "Birth Day",
      topic: "birth-day",
      value: snap.birth_day,
      note: "Pythagorean Birth Day number from the day of month.",
    },
    {
      label: "Life Path",
      topic: "life-path",
      value: snap.life_path,
      note: "Full-date Life Path theme.",
    },
    {
      label: "Expression",
      topic: "expression",
      value: snap.expression_number,
      note: "Name-letter Expression / outer talents.",
    },
    {
      label: "Soul Urge",
      topic: "soul-urge",
      value: snap.soul_urge_number,
      note: "Vowel-based inner motivation.",
    },
    {
      label: "Personality",
      topic: "personality",
      value: snap.personality_number,
      note: "Consonant-based first impression.",
    },
    {
      label: "Maturity",
      topic: "maturity",
      value: snap.maturity_number,
      note: "Life Path + Expression later-life blend.",
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        Pythagorean birth table from your date of birth and name numbers—not a
        Lo Shu digit grid. Hover for meaning; click a tile to open its guide.
      </p>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
        {cells.map((cell) => {
          const trait = coreTraitFor(cell.value);
          const tileTip = [
            `${cell.label} ${cell.value}`,
            trait,
            cell.note,
          ].join("\n");
          return (
            <Link
              key={`${cell.label}-${cell.value}`}
              href={guideHref(cell.topic, cell.value)}
              target="_blank"
              rel="noopener noreferrer"
              title={`Click for more about ${cell.label} ${cell.value}`}
              onMouseEnter={() => setTip(tileTip)}
              onMouseLeave={() => setTip(null)}
              onFocus={() => setTip(tileTip)}
              onBlur={() => setTip(null)}
              className="flex aspect-square flex-col items-center justify-center rounded-xl border border-sky-200/80 bg-sky-50 px-2 text-center text-sky-950 outline-none transition hover:border-gold/50 hover:bg-white focus-visible:ring-2 focus-visible:ring-gold"
            >
              <span className="text-[10px] uppercase tracking-wider text-sky-800/80">
                {cell.label}
              </span>
              <span className="brand mt-1 text-2xl leading-none">{cell.value}</span>
              <span className="mt-1 line-clamp-2 text-[10px] leading-snug text-sky-900/70">
                {trait}
              </span>
            </Link>
          );
        })}
      </div>

      <ChartTipPanel
        tip={tip}
        empty="Hover a tile for its Pythagorean aspect and core trait."
      />
    </div>
  );
}
