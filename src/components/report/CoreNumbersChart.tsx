"use client";

import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import type { GuideTopic } from "@/lib/guides/content";
import { coreTraitFor } from "@/lib/numerology/meanings";

type Item = {
  label: string;
  topic: GuideTopic;
  value: string;
};

type Props = {
  items: Item[];
};

/** Visual map of calculated core numbers — not strength, intensity, or ranking. */
export function CoreNumbersChart({ items }: Props) {
  return (
    <div>
      <p className="text-sm leading-6 text-ink-soft">
        These tiles show your <span className="text-ink">calculated core numbers</span>{" "}
        (Life Path, Expression, etc.). The figure is the number itself —{" "}
        <span className="text-ink">not</span> intensity, strength, progress, or a
        score out of 100. A short core trait sits under each number. Hover a
        number and click to open a short guide.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.topic}
            title={`${item.label} ${item.value}: ${coreTraitFor(item.value)}`}
            className="rounded-xl border border-[var(--line)] bg-mist/60 px-3 py-4 text-center transition hover:border-gold/40 hover:bg-white/80"
          >
            <p className="text-[11px] uppercase tracking-wider text-ink-soft">
              {item.label}
            </p>
            <GuideNumberLink
              topic={item.topic}
              value={item.value}
              label={item.label}
              className="brand mt-2 inline-block text-3xl leading-none text-ink hover:text-gold-deep"
            />
            <p className="mt-2 text-[11px] leading-snug text-ink-soft">
              {coreTraitFor(item.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
