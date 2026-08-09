"use client";

import { useEffect } from "react";
import type { NumerologyReport } from "@/lib/numerology/types";

type Props = {
  report: NumerologyReport;
  watermarkEmail?: string;
};

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

  return (
    <article className="report-protected relative mx-auto max-w-3xl px-5 pb-20 pt-4">
      {watermarkEmail ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 flex flex-wrap content-around justify-around overflow-hidden opacity-[0.06]"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="rotate-[-24deg] text-sm text-ink">
              {watermarkEmail} · Numerora
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-sea">
          Private reading
        </p>
        <h1 className="mt-2 text-4xl text-ink md:text-5xl">
          {report.person.preferred_name || report.person.full_name}
        </h1>
        <p className="mt-3 text-ink-soft">
          Born {report.person.date_of_birth} · Age {report.person.age} ·{" "}
          {report.person.report_type} report
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Life Path", snap.life_path],
            ["Expression", snap.expression_number],
            ["Vedic Destiny", snap.vedic_destiny],
            ["Personal Year", snap.personal_year],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--line)] bg-white/50 px-4 py-3 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-wider text-ink-soft">
                {label}
              </p>
              <p className="brand mt-1 text-2xl text-sea-deep">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-10">
          {report.sections.map((section) => (
            <section key={section.id}>
              <h2 className="text-2xl text-ink">{section.title}</h2>
              <div className="mt-3 whitespace-pre-wrap text-[1.05rem] leading-8 text-ink-soft">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 border-t border-[var(--line)] pt-6 text-sm text-ink-soft">
          {report.disclaimer}
        </p>
        <p className="mt-2 text-xs text-ink-soft/80">
          On-screen viewing only. Copying, downloading, and printing are
          disabled on free reports. PDF export arrives in a future paid plan.
        </p>
      </div>
    </article>
  );
}
