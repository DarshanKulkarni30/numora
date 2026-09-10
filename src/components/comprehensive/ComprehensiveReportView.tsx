"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { PythagoreanCompareStrip } from "@/components/report/PythagoreanCompareStrip";
import { ShareLinkButton } from "@/components/report/ShareLinkButton";
import { applyLivingTiming } from "@/lib/numerology/livingTiming";
import { buildComprehensiveReading } from "@/lib/numerology/comprehensive";
import { HOW_TO_READ_COMPREHENSIVE } from "@/lib/numerology/enhanced/howToRead";
import type { NumerologyReport } from "@/lib/numerology/types";
import { BRAND_NAME } from "@/lib/site";

type Props = {
  report: NumerologyReport;
  reportId: string;
  watermarkEmail?: string;
  allowCopy?: boolean;
};

const GLOSS: [string, string][] = [
  [
    "Soul number",
    "Vowels in the name on the Chaldean letter chart. What you want inside.",
  ],
  [
    "Birth number",
    "The day of the month, reduced to 1–9. How you tend to act.",
  ],
  [
    "Destiny number",
    "All digits of the birth date, reduced to 1–9. The longer path from the date.",
  ],
  [
    "Name number",
    "The whole name as a long total / one digit (example 43/7). How the spelling shows.",
  ],
  [
    "Personality",
    "Consonants in the name. The first impression of the spelling.",
  ],
  [
    "First letter",
    "First letter of the first name. A supporting note, not equal to Soul or Name.",
  ],
  [
    "Year number",
    "Last two digits of the birth year, added until 1–9.",
  ],
  [
    "Fortuna",
    "Destiny minus Birth. A Numora extra, not a classic Chaldean number.",
  ],
];

function Bar({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-mist" aria-hidden>
      <div
        className="h-full rounded-full bg-sea"
        style={{ width: `${Math.max(8, Math.min(100, percent))}%` }}
      />
    </div>
  );
}

export function ComprehensiveReportView({
  report,
  reportId,
  watermarkEmail,
  allowCopy = false,
}: Props) {
  const live = useMemo(() => applyLivingTiming(report), [report]);
  const reading = useMemo(() => buildComprehensiveReading(live), [live]);
  const p = reading.profile;

  useEffect(() => {
    if (allowCopy) return;
    const block = (e: Event) => e.preventDefault();
    const keys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "x", "a", "s", "p", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
      if (e.key === "PrintScreen") e.preventDefault();
    };
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    document.addEventListener("keydown", keys);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
      document.removeEventListener("keydown", keys);
    };
  }, [allowCopy]);

  return (
    <article
      className={`${allowCopy ? "" : "report-protected "}relative mx-auto max-w-3xl px-5 pb-24 pt-4`}
    >
      {watermarkEmail ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 flex flex-wrap content-around justify-around overflow-hidden opacity-[0.06]"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="rotate-[-24deg] text-sm text-ink">
              {watermarkEmail} · {BRAND_NAME}
            </span>
          ))}
        </div>
      ) : null}

      <nav className="sticky top-0 z-20 -mx-5 mb-8 border-b border-[var(--line)] bg-paper/95 px-5 py-2 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/report/${reportId}/enhanced`}
            className="btn-tactile rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-ink"
          >
            Enhanced
          </Link>
          <Link
            href={`/report/${reportId}`}
            className="btn-tactile rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-ink"
          >
            Detailed
          </Link>
          <Link
            href={`/report/${reportId}/session`}
            className="btn-tactile rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-ink"
          >
            Reading room
          </Link>
        </div>
      </nav>

      <div className="relative z-10 space-y-10">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gold-deep">
              Comprehensive report
            </p>
            <h1 className="mt-2 text-4xl text-ink md:text-5xl">
              {reading.displayName}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">{reading.methodNote}</p>
          </div>
          <ShareLinkButton reportId={reportId} />
        </header>

        <p className="text-sm leading-6 text-ink-soft">
          {HOW_TO_READ_COMPREHENSIVE.join(" ")}
        </p>

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
            Soul → Birth → Destiny → Name
          </p>
          <p className="brand mt-2 text-3xl text-ink md:text-4xl">
            {reading.flowLabel}
          </p>
          <p className="mt-3 text-lg leading-7 text-ink">{reading.headline}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {[
              ["Soul", p.soul.label, "Vowels — what you want inside"],
              ["Birth", p.birth.label, "Day of the month — how you tend to act"],
              ["Destiny", p.destiny.label, "Full date — the longer path"],
              ["Name", p.name.label, "Whole name — long total / one digit"],
            ].map(([label, value, meaning]) => (
              <div
                key={label}
                className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3 text-center"
              >
                <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                  {label}
                </p>
                <p className="brand mt-1 text-3xl text-ink">{value}</p>
                <p className="mt-1 text-xs text-ink-soft">{meaning}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Fortuna {p.fortuna.label}. Destiny {p.destiny.root} minus Birth{" "}
            {p.birth.root}. Birth stays the working habit between Soul and Name.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-lg text-ink">What each number is</h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {GLOSS.map(([term, meaning]) => (
              <div key={term}>
                <dt className="text-sm font-medium text-ink">{term}</dt>
                <dd className="mt-0.5 text-sm text-ink-soft">{meaning}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-lg text-ink">Name parts</h2>
          <p className="mt-1 text-sm text-ink-soft">
            First letter, then vowels (Soul), then consonants (Personality),
            then the whole name.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                First letter
              </p>
              <p className="brand mt-1 text-2xl text-ink">
                {p.firstLetter
                  ? `${p.firstLetter.letter} / ${p.firstLetter.value}`
                  : "—"}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                Soul (vowels)
              </p>
              <p className="brand mt-1 text-2xl text-ink">{p.soul.label}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                Personality (consonants)
              </p>
              <p className="brand mt-1 text-2xl text-ink">
                {p.personality.label}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                Full name
              </p>
              <p className="brand mt-1 text-2xl text-ink">{p.name.label}</p>
            </div>
          </div>
        </section>

        <PythagoreanCompareStrip
          fullName={live.person.operating_name || live.person.full_name}
          dob={live.person.date_of_birth}
        />

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-lg text-ink">How the numbers sit together</h2>
          <p className="mt-1 text-sm font-medium text-ink">{reading.overallLabel}</p>
          <p className="mt-1 text-xs text-ink-soft">
            Percents are Numora’s check of how two numbers sit. They are not
            extra Chaldean digits and not a promise.
          </p>
          <ul className="mt-4 space-y-3">
            {reading.pairs.map((pair) => (
              <li key={pair.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm text-ink">
                    {pair.fromLabel} {pair.from} → {pair.toLabel} {pair.to}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {pair.percent}% · {pair.sitLabel}
                  </p>
                </div>
                <div className="mt-1.5">
                  <Bar percent={pair.percent} />
                </div>
                <p className="mt-2 text-xs text-ink-soft">{pair.question}</p>
                <p className="mt-1 text-sm leading-6 text-ink">
                  {pair.interpretation}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Easiest match
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {reading.strength.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {reading.strength.body}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-ink-soft">
              {reading.strength.uses.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Tightest stretch
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {reading.tension.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {reading.tension.body}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-white/80 p-4">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Working habit
            </p>
            <p className="brand mt-1 text-3xl text-ink">{reading.bridge.number}</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {reading.bridge.body}
            </p>
          </div>
        </div>

        <section className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white/55">
          <h2 className="border-b border-[var(--line)] px-4 py-3 text-lg text-ink">
            Life areas
          </h2>
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-2 font-medium">Area</th>
                <th className="px-4 py-2 font-medium">Score</th>
                <th className="px-4 py-2 font-medium">From</th>
                <th className="px-4 py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {reading.domains.map((d) => (
                <tr key={d.id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-2.5 text-ink">{d.label}</td>
                  <td className="px-4 py-2.5 text-ink">{d.score}%</td>
                  <td className="px-4 py-2.5 text-ink-soft">{d.from}</td>
                  <td className="px-4 py-2.5 text-ink-soft">
                    {d.insight}{" "}
                    <span className="block text-[11px]">{d.why}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-lg text-ink">Try and watch</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-ink">Do more</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {reading.doMore.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Watch for</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {reading.watchFor.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-lg text-ink">Year number</h2>
          <p className="mt-2 text-sm leading-6 text-ink">{reading.yearNote}</p>
          <h3 className="mt-4 text-sm font-medium text-ink">
            Kua (Lo Shu compass)
          </h3>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{reading.kuaNote}</p>
        </section>

        <p className="text-xs text-ink-soft">{reading.disclaimer}</p>
      </div>
    </article>
  );
}
