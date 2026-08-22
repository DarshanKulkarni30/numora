"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LivingReportBanner } from "@/components/report/LivingReportBanner";
import type { EnhancedReading } from "@/lib/numerology/enhanced";
import { BRAND_NAME } from "@/lib/site";

type Step = {
  kicker: string;
  title: string;
  body: string;
  /** A chip is never just a label and a number: `meaning` says what it is for. */
  chips?: { label: string; value: string; meaning: string }[];
};

type Props = {
  reading: EnhancedReading;
  displayName: string;
  exitHref: string;
  detailedHref?: string | null;
  shared?: boolean;
  expiresAt?: string | null;
};

function buildSteps(reading: EnhancedReading): Step[] {
  const core = reading.coreStrip;
  const take = (...labels: string[]) =>
    core.filter((c) => labels.includes(c.label));

  const identity = take("Life Path", "Birth Day", "Expression", "Minor Expression");
  const inner = take("Soul Urge", "Personality", "Maturity");
  const vedic = take("Psychic", "Destiny", "Name", "Chaldean");
  const timing = take(
    "Personal Year",
    "Personal Day",
    "Attitude",
    "Subconscious Self",
  );

  const day = reading.pythagoreanChart.personalDay;
  const essence = reading.pythagoreanChart.essence;

  const chip = (c: (typeof core)[number]) => ({
    label: c.label,
    value: c.value,
    meaning: c.trait,
  });

  return [
    {
      kicker: "Start here",
      title: reading.hero.archetype,
      body: `${reading.hero.throughline} The next few screens go through your numbers one group at a time. Nothing here predicts events — it describes tendencies you can check against your own life. Right now the reading points at: ${reading.hero.currentFocus.join("; ")}.`,
    },
    {
      kicker: "Group 1 of 4",
      title: "The numbers that do not change",
      body: "These come from your birth date and your birth name, so they stay the same for life. They describe your long-term direction and how you tend to operate. Each card below shows the number and what it is for.",
      chips: identity.map(chip),
    },
    {
      kicker: "Group 2 of 4",
      title: "What you want, what people see, what grows",
      body: "Soul Urge is what you actually want, which you may not say out loud. Personality is the impression people form before they know you. Maturity is what tends to come forward in the second half of life — it is a direction, not a switch that flips on a birthday.",
      chips: inner.map(chip),
    },
    {
      kicker: "Group 3 of 4",
      title: "The same date read a different way",
      body: "Indian and Chaldean numerology read your details with different rules, so they give different numbers rather than contradicting the ones above. Psychic is your first reaction, Destiny is your longer direction, and the name numbers describe how you come across. If you change your name, only the name numbers move — the date numbers stay put.",
      chips: vedic.map(chip),
    },
    {
      kicker: "Group 4 of 4",
      title: `This year: ${reading.season.yearTitle.toLowerCase()}`,
      body: `${reading.season.yearJob} ${reading.season.monthJob ?? ""} Try this month: ${reading.season.yearFocus[0] ?? "one small step"}.`.trim(),
      chips: timing.map(chip),
    },
    {
      kicker: "Today only",
      title: `Today is a ${day.number} day`,
      body: `${day.summary} ${essence.summary} This one changes daily, so treat it as a nudge about pacing rather than anything to plan around.`,
    },
    {
      kicker: "Putting it together",
      title: "What the numbers keep pointing at",
      body: reading.narrative.teaser,
    },
  ];
}

export function ReadingRoom({
  reading,
  displayName,
  exitHref,
  detailedHref,
  shared = false,
  expiresAt,
}: Props) {
  const steps = useMemo(() => buildSteps(reading), [reading]);
  const [i, setI] = useState(0);
  const step = steps[i];
  const last = i === steps.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setI((n) => Math.min(steps.length - 1, n + 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setI((n) => Math.max(0, n - 1));
      }
      if (e.key === "Escape") {
        window.location.href = exitHref;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exitHref, steps.length]);

  if (!step) return null;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold-deep">
            {BRAND_NAME} · guided walkthrough
          </p>
          <p className="text-sm text-ink">{displayName}</p>
        </div>
        <p className="text-sm text-ink-soft">
          Step {i + 1} of {steps.length}
          <span className="ml-2 hidden text-xs sm:inline">
            (arrow keys work too)
          </span>
        </p>
        <Link
          href={exitHref}
          className="btn-tactile rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink"
        >
          Exit
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-10">
        <LivingReportBanner
          variant={shared ? "shared" : "owner"}
          expiresAt={expiresAt}
        />
        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-gold-deep">
          {step.kicker}
        </p>
        <h1 className="brand mt-3 text-4xl text-ink md:text-5xl">{step.title}</h1>
        <p className="mt-5 text-lg leading-8 text-ink-soft">{step.body}</p>
        {step.chips?.length ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {step.chips.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3"
              >
                <p className="flex items-baseline gap-2">
                  <span className="text-xs uppercase tracking-wider text-ink-soft">
                    {c.label}
                  </span>
                  <span className="brand text-3xl leading-none text-ink">
                    {c.value}
                  </span>
                </p>
                <p className="mt-1.5 text-sm leading-6 text-ink-soft">
                  {c.meaning}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-5 py-4">
        <button
          type="button"
          disabled={i === 0}
          onClick={() => setI((n) => Math.max(0, n - 1))}
          className="btn-tactile rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>
        {last ? (
          <div className="flex flex-wrap gap-2">
            {detailedHref ? (
              <Link
                href={detailedHref}
                className="btn-tactile rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm text-ink"
              >
                Open the full report
              </Link>
            ) : null}
            <Link
              href={exitHref}
              className="btn-tactile rounded-full bg-ink px-5 py-2.5 text-sm text-paper"
            >
              End session
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setI((n) => Math.min(steps.length - 1, n + 1))}
            className="btn-tactile rounded-full bg-ink px-5 py-2.5 text-sm text-paper"
          >
            Next
          </button>
        )}
      </footer>
    </div>
  );
}
