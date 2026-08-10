"use client";

import Link from "next/link";
import { guideHref, type GuideTopic } from "@/lib/guides/content";
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
        tile and click to open a short guide.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {items.map((item) => {
          const tip = `${item.label} ${item.value}: ${coreTraitFor(item.value)}. Click for guide.`;
          return (
            <Link
              key={item.topic}
              href={guideHref(item.topic, item.value)}
              target="_blank"
              rel="noopener noreferrer"
              title={tip}
              aria-label={tip}
              className="rounded-xl border border-[var(--line)] bg-mist/60 px-3 py-4 text-center transition hover:border-gold/40 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <p className="text-[11px] uppercase tracking-wider text-ink-soft">
                {item.label}
              </p>
              <p className="brand mt-2 text-3xl leading-none text-ink">
                {item.value}
              </p>
              <p className="mt-2 text-[11px] leading-snug text-ink-soft">
                {coreTraitFor(item.value)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
