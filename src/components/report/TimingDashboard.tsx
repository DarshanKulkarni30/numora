"use client";

import { LearningConceptLink } from "@/components/learning/LearningConceptLink";
import { ProjectedYearPanel } from "@/components/report/ProjectedYearPanel";
import { YearRhythmPanel } from "@/components/report/YearRhythmPanel";
import type { NumerologyReport } from "@/lib/numerology/types";

type Props = {
  personalYear: NumerologyReport["personal_year"];
  personalMonth: NumerologyReport["personal_month"];
  projectedYear?: NumerologyReport["projected_year"];
  sunSignId?: string | null;
  sunSignLabel?: string | null;
  dateOfBirth: string;
  yearsHref: string;
  initialOutlookYear?: number;
};

/**
 * Unified timing dashboard: Annual rhythm (PY · Month · Outlook rings)
 * plus Year Outlook Mandala (birthday-cycle Vedic tone).
 */
export function TimingDashboard({
  personalYear,
  personalMonth,
  projectedYear,
  sunSignId,
  sunSignLabel,
  dateOfBirth,
  yearsHref,
  initialOutlookYear,
}: Props) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl text-ink">Timing dashboard</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Personal Year, Personal Month, and Year Outlook as one seasonal
          map — Western pacing beside Vedic birthday-cycle tone.{" "}
          <LearningConceptLink conceptKey="personal-year" />
          {" · "}
          <LearningConceptLink conceptKey="personal-month" />
          {" · "}
          <LearningConceptLink conceptKey="projected-year" />
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <YearRhythmPanel
          personalYear={personalYear}
          personalMonth={personalMonth}
          projectedYear={projectedYear}
          sunSignId={sunSignId}
          sunSignLabel={sunSignLabel}
          hideSectionTitle
        />
      </div>

      <ProjectedYearPanel
        dateOfBirth={dateOfBirth}
        initialYear={initialOutlookYear}
        yearsHref={yearsHref}
        embedded
      />
    </section>
  );
}
