"use client";

import { PanelRating } from "@/components/blueprint/PanelRating";
import { YearResonancePanel } from "@/components/blueprint/YearResonancePanel";
import type { YearInterpretation } from "@/lib/numerology/blueprint/yearInterpreter";
import type { YearResonance } from "@/lib/numerology/blueprint/yearResonance";

type Props = {
  reading: YearInterpretation;
  isPast?: boolean;
  isFuture?: boolean;
  allowRating?: boolean;
  onDigit?: (digit: number, label: string) => void;
  resonance?: YearResonance;
};

export function YearReading({
  reading,
  isPast = false,
  isFuture = false,
  allowRating = true,
  onDigit,
  resonance,
}: Props) {
  const nums = reading.numbers;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-[0.2em] text-gold-deep">
          Your {reading.calendarYear}
        </p>
        <h2 className="brand mt-2 text-3xl text-ink md:text-4xl">
          {reading.signatureTitle}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Personal Year{" "}
          <button
            type="button"
            className="btn-tactile inline rounded-md px-1 font-medium text-ink"
            onClick={() => onDigit?.(reading.personalYear, "Personal Year")}
          >
            {reading.personalYear}
          </button>
          {reading.cycleLetter && reading.cycleNumber != null ? (
            <>
              {" · "}Name Cycle {reading.cycleLetter} /{" "}
              <button
                type="button"
                className="btn-tactile inline rounded-md px-1 font-medium text-ink"
                onClick={() => onDigit?.(reading.cycleNumber!, "Name Cycle")}
              >
                {reading.cycleNumber}
              </button>
            </>
          ) : null}
        </p>
        <p className="mt-1 text-lg text-ink">
          {reading.signatureCode} · {reading.pyMode.verb} × {reading.cycleMode.verb}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Theme: {reading.theme} · Strength: {reading.strength} · Risk:{" "}
          {reading.risk}
        </p>
        <p className="mt-1 text-sm text-ink">Best move: {reading.bestMove}</p>
        {resonance ? (
          <div className="mt-4">
            <YearResonancePanel resonance={resonance} />
          </div>
        ) : null}
        <PanelRating
          panelId="year.signature"
          numbers={nums}
          enabled={allowRating}
          interpretationVersion={reading.interpretationVersion}
        />
      </header>

      <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <h3 className="text-lg text-ink">How this year may feel</h3>
        <p className="mt-2 text-sm leading-7 text-ink">{reading.feel}</p>
        <PanelRating
          panelId="year.feel"
          numbers={nums}
          enabled={allowRating}
          interpretationVersion={reading.interpretationVersion}
        />
      </section>

      <section>
        <h3 className="text-lg text-ink">
          {isFuture ? "How to use this year" : "Your year is asking you to"}
        </h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-ink">
          {(isFuture ? reading.prepare : reading.asking).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <h3 className="text-sm font-medium text-ink">Career</h3>
          <p className="mt-2 text-xs uppercase tracking-wider text-ink-soft">
            Strong for
          </p>
          <ul className="mt-1 list-disc pl-4 text-sm text-ink-soft">
            {reading.career.strong.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-ink">Watch: {reading.career.watch}</p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <h3 className="text-sm font-medium text-ink">Money</h3>
          <p className="mt-2 text-sm leading-6 text-ink">{reading.money}</p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <h3 className="text-sm font-medium text-ink">Relationships</h3>
          <p className="mt-2 text-sm leading-6 text-ink">{reading.relationships}</p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <h3 className="text-sm font-medium text-ink">Personal growth</h3>
          <p className="mt-2 text-sm leading-6 text-ink">{reading.growth}</p>
        </div>
      </section>
      <PanelRating
        panelId="year.career"
        numbers={nums}
        enabled={allowRating}
        interpretationVersion={reading.interpretationVersion}
      />

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-ink">Do</h3>
          <ul className="mt-2 space-y-1 text-sm text-ink">
            {reading.dos.map((line) => (
              <li key={line}>✓ {line}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium text-ink">Don&apos;t</h3>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            {reading.donts.map((line) => (
              <li key={line}>× {line}</li>
            ))}
          </ul>
        </div>
      </section>

      <p className="text-lg leading-8 text-ink">
        {isPast ? "Looking back: " : null}
        {reading.oneSentence}
      </p>
    </div>
  );
}
