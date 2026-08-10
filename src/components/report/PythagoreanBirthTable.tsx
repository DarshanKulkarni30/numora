"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LoShuChart } from "@/components/report/LoShuChart";
import { guideHref, type GuideTopic } from "@/lib/guides/content";
import { loShuFromCoreNumbers } from "@/lib/numerology/loShu";
import { parseDob, reduceNumber } from "@/lib/numerology/reduce";
import type { NumerologySnapshot } from "@/lib/numerology/types";

type Aspect = {
  label: string;
  topic: GuideTopic;
  value: string;
};

type Props = {
  dateOfBirth: string;
  snap: NumerologySnapshot;
};

export function PythagoreanBirthTable({ dateOfBirth, snap }: Props) {
  const aspects: Aspect[] = useMemo(() => {
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
    return [
      { label: "Day digit", topic: "birth-day", value: dayR },
      { label: "Month digit", topic: "life-path", value: monthR },
      { label: "Year digit", topic: "life-path", value: yearR },
      { label: "Birth Day", topic: "birth-day", value: snap.birth_day },
      { label: "Life Path", topic: "life-path", value: snap.life_path },
      { label: "Expression", topic: "expression", value: snap.expression_number },
      { label: "Soul Urge", topic: "soul-urge", value: snap.soul_urge_number },
      {
        label: "Personality",
        topic: "personality",
        value: snap.personality_number,
      },
      { label: "Maturity", topic: "maturity", value: snap.maturity_number },
    ];
  }, [dateOfBirth, snap]);

  const loShu = useMemo(
    () =>
      loShuFromCoreNumbers(
        aspects.map((a) => a.value).filter((v) => v !== "—"),
        "Pythagorean birth table mapped onto a Lo Shu-style 1–9 grid (masters reduced to single digits). Same plane / arrow reading as Lo Shu—for reflection only.",
      ),
    [aspects],
  );

  return (
    <LoShuChart
      loShu={loShu}
      intro={
        <p className="text-sm text-ink-soft">
          Same size and layout as Lo Shu: pastel planes, present/missing cells,
          and dotted arrows. Digits come from your Pythagorean day/month/year
          reductions and core numbers (masters reduced to 1–9)—not the raw DOB
          digit Lo Shu fill.
        </p>
      }
      aspectLegend={
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Pythagorean aspects on this grid
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {aspects.map((a) => (
              <li key={a.label}>
                {a.value === "—" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-mist/50 px-2.5 py-1 text-xs text-ink-soft">
                    {a.label} —
                  </span>
                ) : (
                  <Link
                    href={guideHref(a.topic, a.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Click for more about ${a.label} ${a.value}`}
                    className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs text-sky-950 transition hover:border-gold/50 hover:bg-white"
                  >
                    {a.label}{" "}
                    <span className="brand text-sm">{a.value}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
