"use client";

import { useState } from "react";
import { VedicSquarePanel } from "@/components/report/VedicSquarePanel";

export function VedicSquareDemo() {
  const [psychic, setPsychic] = useState("2");
  const [destiny, setDestiny] = useState("7");
  const [nameNumber, setNameNumber] = useState("5");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <p className="text-sm text-ink-soft">
          Try sample Psychic, Destiny, and Name digits on the Vedic Square
          lattice (digital-root multiplication table—not Ank Kundli).
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {(
            [
              ["Psychic", psychic, setPsychic],
              ["Destiny", destiny, setDestiny],
              ["Name", nameNumber, setNameNumber],
            ] as const
          ).map(([label, value, set]) => (
            <label key={label} className="block text-sm text-ink-soft">
              {label}
              <select
                value={value}
                onChange={(e) => set(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-ink outline-none ring-gold focus:ring-2"
              >
                {Array.from({ length: 9 }, (_, i) => String(i + 1)).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
      <VedicSquarePanel
        psychic={psychic}
        destiny={destiny}
        nameNumber={nameNumber}
      />
    </div>
  );
}
