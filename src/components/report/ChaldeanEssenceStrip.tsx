"use client";

import { useMemo } from "react";
import type { ChaldeanStory } from "@/lib/numerology/enhanced/chaldeanStory";
import { analyzeNameByMap } from "@/lib/numerology/nameLetterBreakdown";

type Props = {
  story: ChaldeanStory;
  operatingName?: string;
};

export function ChaldeanEssenceStrip({ story, operatingName }: Props) {
  const breakdown = useMemo(
    () =>
      operatingName?.trim()
        ? analyzeNameByMap(operatingName, "chaldean")
        : null,
    [operatingName],
  );
  const letters = breakdown?.words.flatMap((w) => w.letters) ?? [];

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <h2 className="text-xl text-ink">Name vibration (Chaldean)</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Letters add to a long total, then reduce to one digit. Both describe
        this spelling — not a second person.
      </p>
      {operatingName?.trim() ? (
        <p className="mt-2 text-sm text-ink">
          Spelling in force now:{" "}
          <span className="font-medium">{operatingName.trim()}</span>
        </p>
      ) : null}

      <p className="brand mt-3 text-3xl text-ink">
        {story.compound || "—"}
        <span className="mx-2 text-lg text-ink-soft">→</span>
        {story.reduced}
      </p>

      {letters.length ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {letters.map((item, i) => (
            <span
              key={`${item.letter}-${i}`}
              className="inline-flex min-w-[2.25rem] flex-col items-center rounded-lg border border-[var(--line)] bg-white/80 px-1.5 py-1"
            >
              <span className="text-sm font-medium text-ink">{item.letter}</span>
              <span className="text-[10px] text-ink-soft">{item.value}</span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
            Letters
          </p>
          <p className="mt-2 text-sm leading-6 text-ink">
            Each letter gets a number from 1 to 8. Add them. That is the long
            total.
          </p>
        </article>
        <article className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
            Long total
          </p>
          <p className="brand mt-2 text-2xl text-ink">{story.compound || "—"}</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{story.texture}</p>
        </article>
        <article className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
            Short number
          </p>
          <p className="brand mt-2 text-2xl text-ink">{story.reduced}</p>
          <p className="mt-2 text-sm leading-6 text-ink">{story.essence}</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{story.combined}</p>
        </article>
      </div>

      <p className="mt-4 text-sm leading-7 text-ink-soft">{story.compare}</p>
    </section>
  );
}
