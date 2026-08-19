"use client";

import { useState } from "react";
import { LoShuChart } from "@/components/report/LoShuChart";
import { LoShuCompare } from "@/components/report/LoShuCompare";
import { NameBookendsPanel } from "@/components/report/NameBookendsPanel";
import { PythagoreanBirthTable } from "@/components/report/PythagoreanBirthTable";
import { VedicBirthChart } from "@/components/report/VedicBirthChart";
import { VedicSquarePanel } from "@/components/report/VedicSquarePanel";
import type { LoShuResult, NumerologySnapshot } from "@/lib/numerology/types";

type Tab = "lo-shu" | "pythagorean" | "vedic" | "vedic-square" | "name-letters";

type Props = {
  loShu: LoShuResult;
  dateOfBirth: string;
  snap: NumerologySnapshot;
  fullName: string;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "lo-shu", label: "Lo Shu" },
  { id: "pythagorean", label: "Pythagorean wheel" },
  { id: "vedic", label: "Vedic birth chart" },
  { id: "vedic-square", label: "Vedic Square" },
  { id: "name-letters", label: "Name letters" },
];

/** Convert DD/MM/YYYY to YYYY-MM-DD for date inputs when possible. */
function toInputDate(dob: string): string {
  const m = dob.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    return `${m[3]}-${mm}-${dd}`;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) return dob;
  return "";
}

export function BirthChartsPanel({
  loShu,
  dateOfBirth,
  snap,
  fullName,
}: Props) {
  const [tab, setTab] = useState<Tab>("lo-shu");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm transition ${
              tab === t.id
                ? "bg-ink text-paper"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "lo-shu" ? (
        <div className="space-y-6">
          <LoShuChart
            loShu={loShu}
            dateOfBirth={dateOfBirth}
            personName={fullName}
          />
          <LoShuCompare
            defaultDobA={toInputDate(dateOfBirth)}
            labelA={fullName.split(" ")[0] || "You"}
          />
        </div>
      ) : null}
      {tab === "pythagorean" ? (
        <PythagoreanBirthTable
          dateOfBirth={dateOfBirth}
          snap={snap}
          fullName={fullName}
        />
      ) : null}
      {tab === "vedic" ? (
        <VedicBirthChart dateOfBirth={dateOfBirth} />
      ) : null}
      {tab === "vedic-square" ? (
        <VedicSquarePanel
          psychic={snap.vedic_psychic}
          destiny={snap.vedic_destiny}
          nameNumber={snap.vedic_name}
          unitName={snap.unit_name}
        />
      ) : null}
      {tab === "name-letters" ? (
        <NameBookendsPanel fullName={fullName} />
      ) : null}
    </div>
  );
}
