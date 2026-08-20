"use client";

import { LearningConceptLink } from "@/components/learning/LearningConceptLink";
import { ProjectedYearPanel } from "@/components/report/ProjectedYearPanel";
import { PinnacleYearPanel } from "@/components/report/PinnacleYearPanel";
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
  lifePath: string;
  expression: string;
};

/**
 * Unified timing dashboard: Annual rhythm (climate clock · month weather ·
 * Outlook mirror · astro backdrop) plus Pinnacle Year and Year Outlook Mandala.
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
  lifePath,
  expression,
}: Props) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl text-ink">Timing dashboard</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Climate (Personal Year), weather (Personal Month), Outlook as a second
          climate, and astro season as backdrop — Western pacing beside Vedic
          birthday-cycle tone.{" "}
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
          dateOfBirth={dateOfBirth}
          hideSectionTitle
        />
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <PinnacleYearPanel
          dateOfBirth={dateOfBirth}
          lifePath={lifePath}
          personalYear={personalYear.number}
          expression={expression}
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
