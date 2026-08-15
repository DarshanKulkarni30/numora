"use client";

import Link from "next/link";
import { guideHref, type GuideTopic } from "@/lib/guides/content";
import { coreTraitFor } from "@/lib/numerology/meanings";
import type { NumerologySystem } from "@/components/report/SnapshotBySystem";

type Item = {
  label: string;
  topic: GuideTopic;
  value: string;
  system?: NumerologySystem;
  subtitle?: string;
};

type Props = {
  items: Item[];
  intro?: string;
};

const SYS_CLASS: Record<NumerologySystem, string> = {
  pythagorean: "sys-pyth",
  chaldean: "sys-chal",
  vedic: "sys-vedic",
  timing: "sys-timing",
  astro: "sys-astro",
};

const SYS_LABEL: Record<NumerologySystem, string> = {
  pythagorean: "Pythagorean",
  chaldean: "Chaldean",
  vedic: "Vedic",
  timing: "Timing",
  astro: "Astrology",
};

/** Visual map of calculated core numbers by system. */
export function CoreNumbersChart({ items, intro }: Props) {
  return (
    <div>
      <p className="text-sm leading-6 text-ink-soft">
        {intro ??
          "Your main calculated numbers at a glance. Click a tile for a short guide."}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {items.map((item) => {
          const system = item.system ?? "pythagorean";
          const tip = `${item.label} ${item.value}: ${coreTraitFor(item.value)}. Click for guide.`;
          const dark = system === "vedic";
          return (
            <Link
              key={`${item.topic}-${item.value}`}
              href={guideHref(item.topic, item.value)}
              target="_blank"
              rel="noopener noreferrer"
              title={tip}
              aria-label={tip}
              className={`btn-tactile rounded-xl border px-3 py-4 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${SYS_CLASS[system]}`}
            >
              <p
                className={`text-[10px] uppercase tracking-wider ${
                  dark ? "sys-muted" : "opacity-70"
                }`}
              >
                {SYS_LABEL[system]}
              </p>
              <p
                className={`mt-1 text-[11px] uppercase tracking-wider ${
                  dark ? "text-sand" : "opacity-80"
                }`}
              >
                {item.label}
              </p>
              <p
                className={`brand mt-2 text-3xl leading-none ${
                  dark ? "text-paper" : ""
                }`}
              >
                {item.value}
              </p>
              <p
                className={`mt-2 text-[11px] leading-snug ${
                  dark ? "sys-muted" : "opacity-80"
                }`}
              >
                {item.subtitle ?? coreTraitFor(item.value)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
