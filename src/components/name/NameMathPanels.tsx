"use client";

import { useMemo } from "react";
import { analyzeNameByMap } from "@/lib/numerology/nameLetterBreakdown";

type Props = {
  fullName: string;
};

function MathPanel({
  title,
  subtitle,
  name,
  mapId,
}: {
  title: string;
  subtitle: string;
  name: string;
  mapId: "pythagorean" | "chaldean";
}) {
  const breakdown = useMemo(
    () => analyzeNameByMap(name, mapId),
    [name, mapId],
  );

  if (!breakdown) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-4 py-5">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-1 text-xs text-ink-soft">{subtitle}</p>
        <p className="mt-3 text-sm text-ink-soft">
          Enter a trial name (or use your profile name) to see letter math.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-4">
      <p className="text-sm font-medium text-ink">{title}</p>
      <p className="mt-1 text-xs leading-5 text-ink-soft">{subtitle}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {breakdown.words.map((w) => (
          <li
            key={`${mapId}-${w.word}`}
            className="rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2"
          >
            <p className="font-medium text-ink">{w.word.toUpperCase()}</p>
            <p className="mt-1 font-mono text-xs leading-5 text-ink-soft">
              {w.equation} → {w.reduced}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink">
        Total{" "}
        <span className="brand">
          {breakdown.words.map((w) => w.compound).join(" + ")} ={" "}
          {breakdown.grandCompound}
        </span>{" "}
        → name number{" "}
        <span className="brand">{breakdown.nameNumber}</span>
        {breakdown.nameNumber !== breakdown.singleDigit ? (
          <span className="text-ink-soft">
            {" "}
            (core {breakdown.singleDigit})
          </span>
        ) : null}
      </p>
    </div>
  );
}

export function NameMathPanels({ fullName }: Props) {
  const unit = useMemo(
    () => analyzeNameByMap(fullName, "unit"),
    [fullName],
  );
  const chaldean = useMemo(
    () => analyzeNameByMap(fullName, "chaldean"),
    [fullName],
  );
  const unitDiffers =
    unit &&
    chaldean &&
    unit.nameNumber !== chaldean.nameNumber;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg text-ink">How name numbers are calculated</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Two common letter maps side by side. Vedic name in NumoraWisdom uses
          the same Chaldean-style map (Indian-style). Reflective math only.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <MathPanel
          title="Pythagorean Expression"
          subtitle="Western letter map 1–9. Vowels and consonants use the same values; Expression is the full-name total."
          name={fullName}
          mapId="pythagorean"
        />
        <MathPanel
          title="Chaldean / Vedic name"
          subtitle="Indian-style 1–8 letter map (no 9 for letters). Same values power Chaldean and Vedic name in this product."
          name={fullName}
          mapId="chaldean"
        />
      </div>
      {unitDiffers ? (
        <p className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-2 text-xs leading-5 text-ink-soft">
          Unit System (Map B) for this spelling reduces to{" "}
          <span className="brand text-ink">{unit.nameNumber}</span>
          —different from Chaldean/Vedic{" "}
          <span className="brand text-ink">{chaldean!.nameNumber}</span>{" "}
          because letters such as C and H use other values.
        </p>
      ) : null}
    </section>
  );
}
