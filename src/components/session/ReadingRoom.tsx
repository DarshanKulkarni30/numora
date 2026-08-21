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
  chips?: { label: string; value: string }[];
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

  return [
    {
      kicker: "Session",
      title: reading.hero.archetype,
      body: `${reading.hero.throughline} Current focus: ${reading.hero.currentFocus.join(" · ")}.`,
    },
    {
      kicker: "Identity seats",
      title: "The long walk",
      body: "Life Path, day talent, and how the name builds. Click nothing — sit with one number at a time.",
      chips: identity.map((c) => ({ label: c.label, value: c.value })),
    },
    {
      kicker: "Inner / outer",
      title: "Want, face, maturity",
      body: "Soul Urge is the inner ask. Personality is the first impression. Maturity is what deepens with practice.",
      chips: inner.map((c) => ({ label: c.label, value: c.value })),
    },
    {
      kicker: "Vedic + Chaldean",
      title: "Day, path, name vibration",
      body: "Psychic and Destiny from the date; name seats from the spelling in force.",
      chips: vedic.map((c) => ({ label: c.label, value: c.value })),
    },
    {
      kicker: "This season",
      title: reading.season.yearTitle,
      body: reading.season.combined,
      chips: timing.map((c) => ({ label: c.label, value: c.value })),
    },
    {
      kicker: "Today",
      title: `Personal Day ${day.number}`,
      body: `${day.summary} ${essence.summary}`,
    },
    {
      kicker: "Story",
      title: "The through-line",
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
            {BRAND_NAME} · reading room
          </p>
          <p className="text-sm text-ink">{displayName}</p>
        </div>
        <p className="text-sm text-ink-soft">
          {i + 1} / {steps.length}
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
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {step.chips.map((c) => (
              <div
                key={c.label}
                className="rounded-2xl border border-[var(--line)] bg-white/70 px-3 py-4 text-center"
              >
                <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                  {c.label}
                </p>
                <p className="brand mt-1 text-3xl text-ink">{c.value}</p>
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
                Full catalog
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
