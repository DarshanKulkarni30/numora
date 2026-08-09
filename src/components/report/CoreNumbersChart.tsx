"use client";

import Link from "next/link";
import { guideHref, type GuideTopic } from "@/lib/guides/content";

type Item = {
  label: string;
  topic: GuideTopic;
  value: string;
};

type Props = {
  items: Item[];
};

export function CoreNumbersChart({ items }: Props) {
  const max = 33;
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const n = Number(item.value) || 0;
        const width = Math.max(8, Math.min(100, (n / max) * 100));
        return (
          <div key={item.topic} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-3">
            <span className="text-sm text-ink-soft">{item.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ink to-gold"
                style={{ width: `${width}%` }}
              />
            </div>
            <Link
              href={guideHref(item.topic, item.value)}
              className="brand min-w-8 text-right text-lg text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
            >
              {item.value}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
