"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EnhancedExportPdfButton } from "@/components/enhanced/EnhancedExportPdfButton";
import { EnhancedThemeRadar } from "@/components/enhanced/EnhancedThemeRadar";
import { LoShuChart } from "@/components/report/LoShuChart";
import { NameEraNote } from "@/components/report/NameEraNote";
import { TimingDashboard } from "@/components/report/TimingDashboard";
import { VedicPanel } from "@/components/report/VedicPanel";
import { PythagoreanChartPanel } from "@/components/report/PythagoreanChartPanel";
import { buildEnhancedReading } from "@/lib/numerology/enhanced";
import type { NumerologyReport } from "@/lib/numerology/types";
import { yearsHrefForPerson } from "@/lib/numerology/yearPage";
import { BRAND_NAME } from "@/lib/site";

type Props = {
  report: NumerologyReport;
  reportId: string;
  watermarkEmail?: string;
  allowCopy?: boolean;
  allowPdf?: boolean;
};

export function EnhancedReportView({
  report,
  reportId,
  watermarkEmail,
  allowCopy = false,
  allowPdf = false,
}: Props) {
  const reading = useMemo(
    () => buildEnhancedReading(report, { reportId }),
    [report, reportId],
  );
  const [storyOpen, setStoryOpen] = useState(false);

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

  const person = report.person;
  const snap = report.numerology_snapshot;
  const yearsHref = yearsHrefForPerson({
    dateOfBirth: person.date_of_birth,
    fullName: person.operating_name || person.full_name,
  });

  return (
    <article className="report-protected relative mx-auto max-w-3xl px-5 pb-24 pt-4">
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
          {[
            ["#quick", "Quick"],
            ["#insights", "Insights"],
            ["#expert", "Expert"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="btn-tactile rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-ink"
            >
              {label}
            </a>
          ))}
          <Link
            href={reading.detailedHref}
            className="btn-tactile rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-ink"
          >
            Detailed report
          </Link>
        </div>
      </nav>

      <div className="relative z-10 space-y-10">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gold-deep">
              Enhanced reading
            </p>
            <h1 className="mt-2 text-4xl text-ink md:text-5xl">
              {reading.hero.displayName}
            </h1>
          </div>
          {allowPdf ? (
            <EnhancedExportPdfButton report={report} reportId={reportId} />
          ) : (
            <Link
              href="/pricing"
              className="btn-tactile rounded-full border border-emerald/40 bg-emerald/10 px-4 py-2 text-sm text-ink"
            >
              Unlock PDF
            </Link>
          )}
        </header>

        <section
          id="quick"
          className="scroll-mt-16 space-y-6 rounded-2xl border border-[var(--line)] bg-white/55 p-5"
        >
          <h2 className="text-xl text-ink">How to read this</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-ink-soft">
            {reading.howToRead.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <p className="text-sm uppercase tracking-[0.18em] text-gold-deep">
            Your numerology DNA
          </p>
          <h2 className="brand text-3xl text-ink md:text-4xl">
            {reading.hero.archetype}
          </h2>
          <p className="text-lg leading-8 text-ink">{reading.hero.throughline}</p>
          <p className="text-sm text-ink-soft">
            Current focus: {reading.hero.currentFocus.join(" · ")}
          </p>
          {reading.hero.nameEra ? (
            <p className="text-sm text-ink-soft">{reading.hero.nameEra}</p>
          ) : null}
          <NameEraNote
            natalName={snap.natal_name || person.full_name}
            operatingName={snap.operating_name || person.operating_name || person.full_name}
            label={snap.name_era_label || person.name_era_label || ""}
            natalNn={snap.natal_vedic_name}
            operatingNn={snap.vedic_name}
          />
        </section>

        <section>
          <h2 className="text-xl text-ink">Core numbers</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Every seat is shown. Visual story never replaces the data.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {reading.coreStrip.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[var(--line)] bg-white/55 px-3 py-3"
              >
                <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                  {item.label}
                </p>
                <p className="brand mt-1 text-2xl text-ink">{item.value}</p>
                <p className="mt-1 text-xs text-ink-soft">{item.trait}</p>
                <p className="mt-0.5 text-[11px] text-ink-soft">{item.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl text-ink">Recurring themes</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Strength is a count of independent chart seats, not a star rating.
          </p>
          <div className="mt-4 space-y-3">
            {reading.themes.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg text-ink">{t.label}</h3>
                  <p className="text-sm text-ink-soft">
                    {t.count} seat{t.count === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  Appears in: {t.appearsIn.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl text-ink">Your numerological story</h2>
          <p className="mt-3 text-sm leading-7 text-ink">{reading.narrative.teaser}</p>
          {storyOpen ? (
            <div className="mt-4 space-y-4 text-sm leading-7 text-ink-soft">
              {reading.narrative.full.split("\n\n").map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          ) : null}
          <button
            type="button"
            className="btn-tactile mt-4 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink"
            onClick={() => setStoryOpen((v) => !v)}
          >
            {storyOpen ? "Show shorter opening" : "Read the full story"}
          </button>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-xl text-ink">Your current season</h2>
          <p className="mt-1 text-xs uppercase tracking-wider text-ink-soft">
            As of {reading.season.asOf}
          </p>
          <p className="mt-3 text-lg text-ink">
            Personal Year {reading.season.yearNumber} — {reading.season.yearTitle}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Feels {reading.season.yearImage}. Focus: {reading.season.yearFocus.join(" · ")}
          </p>
          {reading.season.monthNumber != null ? (
            <>
              <p className="mt-4 text-lg text-ink">
                Personal Month {reading.season.monthNumber} — {reading.season.monthTitle}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Feels {reading.season.monthImage}. Focus:{" "}
                {reading.season.monthFocus.join(" · ")}
              </p>
            </>
          ) : null}
          <p className="mt-4 text-sm leading-7 text-ink">{reading.season.combined}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-ink">What to practise</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {reading.season.doThis.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-ink">What to ease off</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {reading.season.easeOff.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            30-day focus: {reading.actionPlan.days30.items[0]}
          </p>
        </section>

        <section id="insights" className="scroll-mt-16 space-y-8">
          <h2 className="text-2xl text-ink">Deep insights</h2>

          <div>
            <h3 className="text-xl text-ink">How your numbers work together</h3>
            <ol className="mt-4 space-y-2">
              {reading.flow.primary.map((n, i) => (
                <li key={n.id} className="flex items-center gap-3 text-sm text-ink">
                  <span className="brand w-8 text-2xl">{n.number}</span>
                  <span>
                    {n.label} · {n.trait}
                    {i < reading.flow.primary.length - 1 ? " →" : ""}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              {reading.flow.primaryNarrative}
            </p>
            <p className="mt-4 text-sm font-medium text-ink">Inner and outer</p>
            <p className="mt-1 text-sm text-ink">
              {reading.flow.secondary
                .map((n) => `${n.label} ${n.number}`)
                .join(" ↔ ")}
            </p>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              {reading.flow.secondaryNarrative}
            </p>
          </div>

          {reading.tensions.length ? (
            <div>
              <h3 className="text-xl text-ink">Productive stretch</h3>
              <div className="mt-3 space-y-3">
                {reading.tensions.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3"
                  >
                    <p className="text-ink">{t.title}</p>
                    <p className="mt-1 text-xs text-ink-soft">{t.values.join(" · ")}</p>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">{t.insight}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="text-xl text-ink">Name vibration (Chaldean)</h3>
            <p className="mt-2 brand text-3xl text-ink">
              {reading.chaldean.compound || "—"}
              <span className="mx-2 text-lg text-ink-soft">→</span>
              {reading.chaldean.reduced}
            </p>
            <p className="mt-3 text-sm leading-7 text-ink-soft">
              {reading.chaldean.texture}
            </p>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              {reading.chaldean.essence}
            </p>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              {reading.chaldean.combined}
            </p>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              {reading.chaldean.compare}
            </p>
          </div>

          <div>
            <h3 className="text-xl text-ink">Vedic energy</h3>
            <VedicPanel
              psychic={snap.vedic_psychic}
              destiny={snap.vedic_destiny}
              nameNumber={snap.vedic_name}
              unitName={snap.unit_name}
              unitCompound={snap.unit_name_compound}
              nameCompound={snap.vedic_name_compound}
              natalNameNumber={snap.natal_vedic_name}
              rulingPlanet={report.vedic.ruling_planet}
              destinyRulingPlanet={report.vedic.destiny_ruling_planet}
              unitSystem={report.vedic.unitSystem}
            />
          </div>

          <div>
            <h3 className="text-xl text-ink">Lo Shu — lived effects</h3>
            <p className="mt-2 text-sm leading-7 text-ink-soft">
              {reading.loShuLived.summary}
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-soft">
              {reading.loShuLived.items.map((item) => (
                <li key={`${item.kind}-${item.number}`}>
                  <span className="font-medium text-ink">
                    {item.kind === "missing" ? "Edge" : "Emphasis"} {item.number}.
                  </span>{" "}
                  {item.effect}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <LoShuChart loShu={report.lo_shu} dateOfBirth={person.date_of_birth} />
            </div>
          </div>

          <div>
            <h3 className="text-xl text-ink">Timing dashboard</h3>
            <TimingDashboard
              personalYear={report.personal_year}
              personalMonth={report.personal_month}
              projectedYear={report.projected_year}
              sunSignId={snap.sun_sign}
              sunSignLabel={snap.sun_sign_label}
              dateOfBirth={person.date_of_birth}
              yearsHref={yearsHref}
              lifePath={snap.life_path}
              expression={snap.expression_number}
            />
          </div>

          <div>
            <h3 className="text-xl text-ink">Pythagorean chart</h3>
            <p className="mt-1 text-sm text-ink-soft">
              Challenges, Period Cycles, Balance, Hidden Passion, missing-letter
              Lessons, name Planes, Personal Day, and Essence — birth-certificate
              spelling. Full windows live in the detailed report.
            </p>
            <div className="mt-4">
              <PythagoreanChartPanel
                chart={reading.pythagoreanChart}
                compact
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <h3 className="text-xl text-ink">Lifestyle tendencies</h3>
            <dl className="mt-3 space-y-3 text-sm">
              {(
                [
                  ["Learning", reading.lifestyle.learning],
                  ["Leadership", reading.lifestyle.leadership],
                  ["Communication", reading.lifestyle.communication],
                  ["Under strain", reading.lifestyle.stress],
                  ["Recovery", reading.lifestyle.recovery],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-ink">{k}</dt>
                  <dd className="mt-0.5 text-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <h3 className="text-xl text-ink">Personal energies</h3>
            <p className="mt-1 text-xs text-ink-soft">{reading.trivia.note}</p>
            <p className="mt-3 text-sm text-ink">
              Motto: <span className="italic">{reading.trivia.motto}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {reading.trivia.colorsPrimary.map((c) => (
                <span
                  key={c.name}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs text-ink"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-[var(--line)]"
                    style={{ background: c.hex }}
                  />
                  {c.name}
                </span>
              ))}
              {reading.trivia.colorsSupport.map((c) => (
                <span
                  key={`s-${c.name}`}
                  className="inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--line)] bg-white/40 px-3 py-1 text-xs text-ink-soft"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-[var(--line)]"
                    style={{ background: c.hex }}
                  />
                  {c.name}
                </span>
              ))}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-ink-soft">
              {reading.trivia.weekdays.map((w) => (
                <li key={w.label}>
                  {w.label}: {w.day}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-ink-soft">
              Recurring digits: {reading.trivia.recurringDigits.join(", ")}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Element tones: {reading.trivia.elements.join(" · ")}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Workspace ideas: {reading.trivia.workspaces.join(" · ")}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <h3 className="text-xl text-ink">Personal action plan</h3>
            <p className="mt-1 text-xs text-ink-soft">{reading.actionPlan.purposeNote}</p>
            {(
              [
                reading.actionPlan.days30,
                reading.actionPlan.days90,
              ] as const
            ).map((block) => (
              <div key={block.title} className="mt-4">
                <p className="font-medium text-ink">{block.title}</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                  {block.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-4">
              <p className="font-medium text-ink">{reading.actionPlan.year.title}</p>
              <p className="mt-1 text-sm text-ink">
                Primary: {reading.actionPlan.year.primary}
              </p>
              <p className="text-sm text-ink">
                Secondary: {reading.actionPlan.year.secondary}
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {reading.actionPlan.year.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="expert" className="scroll-mt-16 space-y-4">
          <h2 className="text-2xl text-ink">Expert mode</h2>
          <p className="text-sm text-ink-soft">
            Calculation details, school comparison, and chart-presence maps.
            Closed by default so a first read can stay short.
          </p>

          <details className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <summary className="cursor-pointer text-lg text-ink">
              Why these numbers were calculated
            </summary>
            <div className="mt-4 space-y-4 text-sm text-ink-soft">
              <p className="font-medium text-ink">Life Path steps</p>
              <ol className="list-decimal space-y-1 pl-5">
                {reading.student.lifePathSteps.map((s) => (
                  <li key={s.label}>
                    <span className="text-ink">{s.label}:</span> {s.detail}
                  </li>
                ))}
              </ol>
              <p className="font-medium text-ink">Name mapping</p>
              <ul className="list-disc space-y-1 pl-5">
                {reading.student.nameSteps.map((s) => (
                  <li key={s.label}>
                    <span className="text-ink">{s.label}:</span> {s.detail}
                  </li>
                ))}
              </ul>
              <p className="font-medium text-ink">Master-number rules</p>
              <ul className="list-disc space-y-1 pl-5">
                {reading.student.masterRules.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </details>

          <details className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <summary className="cursor-pointer text-lg text-ink">
              Compare schools
            </summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="text-ink-soft">
                    <th className="pb-2 pr-3 font-medium">Topic</th>
                    <th className="pb-2 pr-3 font-medium">Pythagorean</th>
                    <th className="pb-2 pr-3 font-medium">Chaldean</th>
                    <th className="pb-2 font-medium">Vedic</th>
                  </tr>
                </thead>
                <tbody>
                  {reading.schoolCompare.map((row) => (
                    <tr key={row.topic} className="border-t border-[var(--line)] align-top">
                      <td className="py-2 pr-3 text-ink">{row.topic}</td>
                      <td className="py-2 pr-3 text-ink-soft">{row.pythagorean}</td>
                      <td className="py-2 pr-3 text-ink-soft">{row.chaldean}</td>
                      <td className="py-2 text-ink-soft">{row.vedic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <details className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <summary className="cursor-pointer text-lg text-ink">
              Chart presence (themes and planets)
            </summary>
            <div className="mt-4">
              <EnhancedThemeRadar axes={reading.radar} />
              <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                {reading.planets.map((p) => (
                  <li key={p.name}>
                    <span className="text-ink">
                      {p.symbol} {p.name}
                    </span>{" "}
                    — {p.count} seat{p.count === 1 ? "" : "s"}: {p.seats.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          </details>

          <details className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <summary className="cursor-pointer text-lg text-ink">
              Methodology notes
            </summary>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {reading.student.methodNotes.map((s) => (
                <li key={s.slice(0, 40)}>{s}</li>
              ))}
            </ul>
          </details>
        </section>

        <footer className="space-y-3 text-sm leading-7 text-ink-soft">
          <p>{reading.disclaimer}</p>
          {(report.safety_notices ?? []).map((n) => (
            <p key={n}>{n}</p>
          ))}
          <p>
            <Link href={reading.detailedHref} className="text-gold-deep underline">
              Open the detailed report
            </Link>
            {" · "}
            <Link href="/dashboard" className="text-gold-deep underline">
              Dashboard
            </Link>
          </p>
        </footer>
      </div>
    </article>
  );
}
