"use client";

import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import type { GuideTopic } from "@/lib/guides/content";

export type NumerologySystem =
  | "pythagorean"
  | "chaldean"
  | "vedic"
  | "timing"
  | "astro";

export type SnapshotCell = {
  label: string;
  value: string;
  topic?: GuideTopic;
  display?: string;
  hint?: string;
};

type Group = {
  system: NumerologySystem;
  title: string;
  blurb: string;
  rows: SnapshotCell[];
};

const SYS_CLASS: Record<NumerologySystem, string> = {
  pythagorean: "sys-pyth",
  chaldean: "sys-chal",
  vedic: "sys-vedic",
  timing: "sys-timing",
  astro: "sys-astro",
};

type Props = {
  groups: Group[];
};

export function SnapshotBySystem({ groups }: Props) {
  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div
          key={g.system + g.title}
          className={`rounded-2xl border p-4 ${SYS_CLASS[g.system]}`}
        >
          <p className="text-sm font-medium tracking-wide">{g.title}</p>
          <p
            className={`mt-0.5 text-xs ${
              g.system === "vedic" ? "sys-muted" : "opacity-80"
            }`}
          >
            {g.blurb}
          </p>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            {g.rows.map((row) => (
              <div
                key={`${row.label}-${row.value}`}
                className={`flex items-baseline justify-between gap-3 rounded-xl border px-3 py-2 text-sm ${
                  g.system === "vedic"
                    ? "border-white/10 bg-white/5"
                    : "border-black/5 bg-white/50"
                }`}
              >
                <dt
                  className={
                    g.system === "vedic" ? "sys-muted" : "text-ink-soft"
                  }
                  title={row.hint}
                >
                  {row.label}
                </dt>
                <dd>
                  {row.topic ? (
                    <GuideNumberLink
                      topic={row.topic}
                      value={row.value}
                      label={row.label}
                      display={row.display}
                      className={
                        g.system === "vedic"
                          ? "brand text-base text-paper underline decoration-sand/50 underline-offset-2 hover:text-sand"
                          : "brand text-base text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
                      }
                    />
                  ) : (
                    <span
                      className={
                        g.system === "vedic"
                          ? "brand text-base text-paper"
                          : "brand text-base text-ink"
                      }
                      title={row.hint}
                    >
                      {row.display ?? row.value}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
