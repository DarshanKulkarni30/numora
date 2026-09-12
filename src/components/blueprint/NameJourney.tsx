"use client";

import type { NameCycle } from "@/lib/numerology/blueprint/nameCycle";
import { cycleCaption } from "@/lib/numerology/blueprint/nameCycle";
import { plainTrait } from "@/lib/numerology/layeredCopy";

type Props = {
  cycle: NameCycle;
  onSelectLetter?: (letter: string, value: number) => void;
};

export function NameJourney({ cycle, onSelectLetter }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
        Your Name Cycle
      </p>
      <p className="mt-2 text-sm leading-6 text-ink">
        Your name moves through a repeating annual letter cycle. Each year
        activates the next letter in your first name. Name Number{" "}
        {cycle.nameDisplay} stays the permanent name vibration.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {cycle.letters.map((row) => {
          const active = row.index === cycle.active.index;
          return (
            <button
              key={`${row.letter}-${row.index}`}
              type="button"
              className={`btn-tactile min-w-[3.25rem] rounded-xl border px-2 py-2 text-center ${
                active
                  ? "border-gold-deep bg-gold/20 text-ink"
                  : "border-[var(--line)] bg-white text-ink"
              }`}
              onClick={() => onSelectLetter?.(row.letter, row.value)}
            >
              <span className="brand block text-xl">{row.letter}</span>
              <span className="block text-[10px] text-ink-soft">{row.value}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm font-medium text-ink">{cycleCaption(cycle)}</p>
      <p className="mt-1 text-sm text-ink-soft">
        {cycle.active.letter} — {cycle.active.value}: {plainTrait(cycle.active.value)}.
      </p>
      {cycle.echoLetters.length ? (
        <p className="mt-2 text-xs text-ink-soft">
          Also in the name with this year’s Personal Year vibration:{" "}
          {cycle.echoLetters.map((e) => `${e.letter}/${e.value}`).join(", ")}.
        </p>
      ) : null}
    </div>
  );
}
