"use client";

import { useEffect, useState } from "react";
import { CompatibilityMatrix } from "@/components/report/CompatibilityMatrix";
import { CoreNumbersChart } from "@/components/report/CoreNumbersChart";
import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import { BirthChartsPanel } from "@/components/report/BirthChartsPanel";
import { RulingPlanetsPanel } from "@/components/report/RulingPlanetsPanel";
import { TriviaPanel } from "@/components/report/TriviaPanel";
import { VedicPanel } from "@/components/report/VedicPanel";
import type { GuideTopic } from "@/lib/guides/content";
import type { NumerologyReport } from "@/lib/numerology/types";

type Props = {
  report: NumerologyReport;
  watermarkEmail?: string;
};

type SnapshotRow = {
  label: string;
  topic: GuideTopic;
  value: string;
};

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/45">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-lg text-ink">{title}</span>
        <span className="text-ink-soft">{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="border-t border-[var(--line)] px-5 py-4">{children}</div> : null}
    </div>
  );
}

export function ReportView({ report, watermarkEmail }: Props) {
  useEffect(() => {
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
  }, []);

  const snap = report.numerology_snapshot;
  const person = report.person;

  const rows: SnapshotRow[] = [
    { label: "Life Path", topic: "life-path", value: snap.life_path },
    { label: "Birth Day", topic: "birth-day", value: snap.birth_day },
    { label: "Expression", topic: "expression", value: snap.expression_number },
    { label: "Soul Urge", topic: "soul-urge", value: snap.soul_urge_number },
    { label: "Personality", topic: "personality", value: snap.personality_number },
    { label: "Maturity", topic: "maturity", value: snap.maturity_number },
    { label: "Chaldean Name", topic: "chaldean-name", value: snap.chaldean_name_number },
    { label: "Vedic Psychic", topic: "vedic-psychic", value: snap.vedic_psychic },
    { label: "Vedic Destiny", topic: "vedic-destiny", value: snap.vedic_destiny },
    { label: "Vedic Name", topic: "vedic-name", value: snap.vedic_name },
    { label: "Personal Year", topic: "personal-year", value: snap.personal_year },
    { label: "Personal Month", topic: "personal-month", value: snap.personal_month },
  ];

  const chartItems = [
    { label: "Life Path", topic: "life-path" as const, value: snap.life_path },
    { label: "Expression", topic: "expression" as const, value: snap.expression_number },
    { label: "Soul Urge", topic: "soul-urge" as const, value: snap.soul_urge_number },
    { label: "Personality", topic: "personality" as const, value: snap.personality_number },
    { label: "Maturity", topic: "maturity" as const, value: snap.maturity_number },
  ];

  const summary = report.sections.find((s) => s.id === "executive-summary");
  const detailSections = report.sections.filter(
    (s) =>
      s.id !== "executive-summary" &&
      s.id !== "snapshot" &&
      s.id !== "compatibility",
  );

  return (
    <article className="report-protected relative mx-auto max-w-3xl px-5 pb-20 pt-4">
      {watermarkEmail ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 flex flex-wrap content-around justify-around overflow-hidden opacity-[0.06]"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="rotate-[-24deg] text-sm text-ink">
              {watermarkEmail} · Numora
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 space-y-10">
        <header>
          <p className="text-sm uppercase tracking-[0.2em] text-gold-deep">
            Private reading
          </p>
          <h1 className="mt-2 text-4xl text-ink md:text-5xl">
            {person.preferred_name || person.full_name}
          </h1>
        </header>

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-xl text-ink">Person details</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["Full name", person.full_name],
              ["Preferred name", person.preferred_name || "—"],
              ["Date of birth", person.date_of_birth],
              ["Age", String(person.age)],
              ["Gender", person.gender || "—"],
              ["Purpose", person.purpose || "—"],
              ["Report type", person.report_type],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-ink-soft">{k}</dt>
                <dd className="mt-0.5 text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-xl text-ink">Numerology snapshot</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Hover a number for a tip · click to open its guide in a new tab.
          </p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--line)] bg-white/55">
            <table className="w-full min-w-[22rem] text-left text-sm">
              <thead className="border-b border-[var(--line)] bg-mist/50 text-ink-soft">
                <tr>
                  <th className="px-3 py-2 font-medium">Aspect</th>
                  <th className="px-3 py-2 font-medium">No.</th>
                  <th className="px-3 py-2 font-medium">Aspect</th>
                  <th className="px-3 py-2 font-medium">No.</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(rows.length / 2) }, (_, i) => {
                  const left = rows[i * 2];
                  const right = rows[i * 2 + 1];
                  return (
                    <tr
                      key={left.topic}
                      className="border-b border-[var(--line)] last:border-0"
                    >
                      <td className="px-3 py-2 text-ink">{left.label}</td>
                      <td className="px-3 py-2">
                        <GuideNumberLink
                          topic={left.topic}
                          value={left.value}
                          label={left.label}
                        />
                      </td>
                      {right ? (
                        <>
                          <td className="px-3 py-2 text-ink">{right.label}</td>
                          <td className="px-3 py-2">
                            <GuideNumberLink
                              topic={right.topic}
                              value={right.value}
                              label={right.label}
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2 text-ink">
                            Chaldean compound
                          </td>
                          <td
                            className="px-3 py-2 text-ink"
                            title="Compound total before reduction"
                          >
                            {snap.compound_number}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
                {rows.length % 2 === 0 ? (
                  <tr>
                    <td className="px-3 py-2 text-ink">Chaldean compound</td>
                    <td
                      className="px-3 py-2 text-ink"
                      title="Compound total before reduction"
                    >
                      {snap.compound_number}
                    </td>
                    <td className="px-3 py-2" colSpan={2} />
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl text-ink">Core numbers at a glance</h2>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <CoreNumbersChart items={chartItems} />
          </div>
        </section>

        <section>
          <h2 className="text-xl text-ink">Ruling planets</h2>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <RulingPlanetsPanel
              lifePath={snap.life_path}
              birthDay={snap.birth_day}
              expression={snap.expression_number}
              vedicPsychic={snap.vedic_psychic}
              vedicDestiny={snap.vedic_destiny}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl text-ink">Vedic number panel</h2>
          <div className="mt-4">
            <VedicPanel
              psychic={snap.vedic_psychic}
              destiny={snap.vedic_destiny}
              nameNumber={snap.vedic_name}
              rulingPlanet={report.vedic.ruling_planet}
              destinyRulingPlanet={
                report.vedic.destiny_ruling_planet ||
                report.vedic.ruling_planet
              }
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl text-ink">Birth charts</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Lo Shu grid, Pythagorean birth table, and Vedic number chart—same
            hover tips and click-through guides. Not a full kundli.
          </p>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <BirthChartsPanel
              loShu={report.lo_shu}
              dateOfBirth={person.date_of_birth}
              snap={snap}
            />
          </div>
        </section>

        {summary ? (
          <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <h2 className="text-xl text-ink">Executive summary</h2>
            <div className="mt-3 whitespace-pre-wrap leading-8 text-ink-soft">
              {summary.body}
            </div>
          </section>
        ) : null}

        <section className="space-y-3">
          <h2 className="text-xl text-ink">Detailed reading</h2>
          <p className="text-sm text-ink-soft">
            Expand a section when you want the fuller narrative.
          </p>
          {detailSections.map((section, i) => (
            <Accordion
              key={section.id}
              title={section.title}
              defaultOpen={i === 0 || section.id === "recommendations"}
            >
              {section.id === "career" && report.career_suggestions ? (
                <div className="space-y-4">
                  <div className="whitespace-pre-wrap leading-8 text-ink-soft">
                    {report.personality.career_style}
                  </div>
                  <p className="text-xs leading-5 text-ink-soft/90">
                    {report.career_suggestions.disclaimer}
                  </p>
                  <div>
                    <h3 className="text-ink">
                      {person.report_type === "child"
                        ? "Interest ideas to explore"
                        : "Modern profession ideas"}
                    </h3>
                    <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                      {report.career_suggestions.professions.map((p) => (
                        <li
                          key={p}
                          className="rounded-xl border border-[var(--line)] bg-mist/50 px-3 py-2 text-sm text-ink"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-8 text-ink-soft">
                  {section.body}
                </div>
              )}
            </Accordion>
          ))}
        </section>

        {report.compatibility ? (
          <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <h2 className="text-xl text-ink">Compatibility matrix</h2>
            <div className="mt-4">
              <CompatibilityMatrix
                pythagorean={{
                  rawNumber:
                    report.compatibility.pythagorean?.raw_number ??
                    report.compatibility.life_path ??
                    snap.life_path,
                  matrix:
                    report.compatibility.pythagorean?.matrix ??
                    report.compatibility.matrix ??
                    [],
                  disclaimer: report.compatibility.disclaimer,
                }}
                vedic={{
                  rawNumber:
                    report.compatibility.vedic?.raw_number ??
                    snap.vedic_destiny,
                  matrix:
                    report.compatibility.vedic?.matrix ??
                    report.compatibility.pythagorean?.matrix ??
                    report.compatibility.matrix ??
                    [],
                  disclaimer: report.compatibility.disclaimer,
                }}
                hideRomantic={person.report_type === "child"}
              />
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-xl text-ink">Trivia · similar numbers</h2>
          <div className="mt-4">
            <TriviaPanel
              lifePath={snap.life_path}
              destiny={snap.vedic_destiny}
              psychic={snap.vedic_psychic}
              dateOfBirth={person.date_of_birth}
            />
          </div>
        </section>

        <footer className="border-t border-[var(--line)] pt-6">
          <details className="group">
            <summary className="cursor-pointer text-xs text-ink-soft/80 hover:text-ink-soft">
              About this reading · reflective guidance notes
            </summary>
            <div className="mt-3 space-y-2 text-xs leading-5 text-ink-soft/75">
              <p>{report.disclaimer}</p>
              {(report.safety_notices ?? []).map((notice) => (
                <p key={notice.slice(0, 40)}>{notice}</p>
              ))}
              {report.recommendations_disclaimer ? (
                <p>{report.recommendations_disclaimer}</p>
              ) : null}
              <p>
                On-screen viewing only. Copying, downloading, and printing are
                disabled on free reports. Guide links open standard reference
                pages.
              </p>
            </div>
          </details>
        </footer>
      </div>
    </article>
  );
}
