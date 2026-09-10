"use client";

import { pythagoreanNameCompare } from "@/lib/numerology/chaldeanName";

type Props = {
  fullName: string;
  dob: string;
};

export function PythagoreanCompareStrip({ fullName, dob }: Props) {
  if (!fullName.trim() || !dob.trim()) return null;
  let compare: ReturnType<typeof pythagoreanNameCompare>;
  try {
    compare = pythagoreanNameCompare(fullName, dob);
  } catch {
    return null;
  }

  return (
    <section className="rounded-2xl border border-dashed border-[var(--line)] bg-white/40 p-5">
      <h2 className="text-lg text-ink">Pythagorean letters (comparison)</h2>
      <p className="mt-1 text-sm text-ink-soft">{compare.note}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {(
          [
            ["Expression", compare.expression],
            ["Soul", compare.soul],
            ["Personality", compare.personality],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-[var(--line)] bg-white/80 px-2 py-3"
          >
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              {label}
            </p>
            <p className="brand mt-1 text-2xl text-ink">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
