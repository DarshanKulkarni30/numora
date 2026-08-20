"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AssociationsPanel } from "@/components/report/AssociationsPanel";
import { LearningConceptLink } from "@/components/learning/LearningConceptLink";
import { CompatibilityMatrix } from "@/components/report/CompatibilityMatrix";
import { CoreNumbersChart } from "@/components/report/CoreNumbersChart";
import { ExportPdfButton } from "@/components/report/ExportPdfButton";
import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import { BirthChartsPanel } from "@/components/report/BirthChartsPanel";
import { GrowthAreasPanel } from "@/components/report/GrowthAreasPanel";
import { IdentitySnapshotPanel } from "@/components/report/IdentitySnapshotPanel";
import { StrengthsConstellation } from "@/components/report/StrengthsConstellation";
import { TimingDashboard } from "@/components/report/TimingDashboard";
import { RulingPlanetsPanel } from "@/components/report/RulingPlanetsPanel";
import { SnapshotBySystem } from "@/components/report/SnapshotBySystem";
import { PythagoreanIdentityLayers } from "@/components/report/PythagoreanIdentityLayers";
import { CORE_TRAIT } from "@/lib/numerology/meanings";
import {
  chaldeanInsight,
  pythagoreanInsight,
} from "@/lib/numerology/westernPath";
import { TriviaPanel } from "@/components/report/TriviaPanel";
import { TrioFitPanel } from "@/components/report/TrioFitPanel";
import { VedicPanel } from "@/components/report/VedicPanel";
import { NameEraNote } from "@/components/report/NameEraNote";
import { InsightTileCard } from "@/components/report/InsightTileCard";
import { buildDetailedInsightCards } from "@/lib/numerology/insightTiles";
import type { NumerologyReport } from "@/lib/numerology/types";
import { yearsHrefForPerson } from "@/lib/numerology/yearPage";
import { BRAND_NAME } from "@/lib/site";

type Props = {
  report: NumerologyReport;
  watermarkEmail?: string;
  allowCopy?: boolean;
  allowPdf?: boolean;
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
      {open ? (
        <div className="border-t border-[var(--line)] px-5 py-4">{children}</div>
      ) : null}
    </div>
  );
}

function SectionBody({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const isListHeavy =
    lines.filter((l) => /^[•\-\d]/.test(l.trim()) || l.includes(" · ")).length >=
    Math.max(2, Math.floor(lines.length * 0.4));

  if (isListHeavy) {
    const preview = lines.slice(0, 6);
    const rest = lines.slice(6);
    return (
      <div className="space-y-2 text-sm leading-7 text-ink-soft">
        <ul className="space-y-1.5">
          {preview.map((line) => (
            <li key={line}>{line.replace(/^•\s*/, "")}</li>
          ))}
        </ul>
        {rest.length ? (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="text-sm text-gold-deep underline decoration-gold/50 underline-offset-2 hover:text-ink"
            >
              {open ? "Hide detail" : "More detail"}
            </button>
            {open ? (
              <ul className="space-y-1.5">
                {rest.map((line) => (
                  <li key={line}>{line.replace(/^•\s*/, "")}</li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
      </div>
    );
  }

  const lead = text.split(/\n\n/)[0] ?? text;
  const hasMore = text.length > lead.length + 40;
  return (
    <div className="space-y-3 text-ink-soft">
      <p className="leading-7 whitespace-pre-wrap">{lead}</p>
      {hasMore ? (
        <>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-sm text-gold-deep underline decoration-gold/50 underline-offset-2 hover:text-ink"
          >
            {open ? "Hide detail" : "More detail"}
          </button>
          {open ? (
            <div className="whitespace-pre-wrap text-sm leading-7 opacity-90">
              {text.slice(lead.length).trim()}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function MoreDetail({ text }: { text: string }) {
  return <SectionBody text={text} />;
}

function ClassicProseToggle({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs text-ink"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide" : "View"} classic prose
      </button>
      {open ? (
        <div className="mt-3">
          <MoreDetail text={text} />
        </div>
      ) : null}
    </div>
  );
}

const INSIGHT_SECTIONS = new Set([
  "pythagorean",
  "chaldean",
  "vedic",
  "lo-shu",
  "core-personality",
  "strengths",
  "growth",
  "career",
  "relationships",
  "communication",
  "age-guidance",
  "personal-year",
  "projected-year",
  "personal-month",
  "current-month",
  "recommendations",
]);

export function ReportView({
  report,
  watermarkEmail,
  allowCopy = false,
  allowPdf = false,
}: Props) {
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

  const snap = report.numerology_snapshot;
  const person = report.person;

  const snapshotGroups = [
    {
      system: "pythagorean" as const,
      title: "Pythagorean",
      blurb: "Western core map from full name and birth date — path, name craft, inner want, and outer face.",
      insight: pythagoreanInsight({
        birthDay: snap.birth_day,
        lifePath: snap.life_path,
        expression: snap.expression_number,
        soulUrge: snap.soul_urge_number,
        personality: snap.personality_number,
        maturity: snap.maturity_number,
      }),
      rows: [
        {
          label: "Life Path",
          topic: "life-path" as const,
          value: snap.life_path,
          note: `The long walk from your full birth date · ${CORE_TRAIT[Number(snap.life_path)] ?? ""}`.trim(),
        },
        {
          label: "Birth Day",
          topic: "birth-day" as const,
          value: snap.birth_day,
          note: `Innate day talent · ${CORE_TRAIT[Number(snap.birth_day)] ?? ""}`.trim(),
        },
        {
          label: "Expression",
          topic: "expression" as const,
          value: snap.expression_number,
          note: `Name in force now · ${CORE_TRAIT[Number(snap.expression_number)] ?? ""}`.trim(),
        },
        ...(snap.natal_expression_number
          ? [
              {
                label: "Natal Expression",
                topic: "expression" as const,
                value: snap.natal_expression_number,
                note: "Birth-certificate spelling — original craft layer",
              },
            ]
          : []),
        {
          label: "Soul Urge",
          topic: "soul-urge" as const,
          value: snap.soul_urge_number,
          note: `Vowels — inner want · ${CORE_TRAIT[Number(snap.soul_urge_number)] ?? ""}`.trim(),
        },
        {
          label: "Personality",
          topic: "personality" as const,
          value: snap.personality_number,
          note: `Consonants — outer face · ${CORE_TRAIT[Number(snap.personality_number)] ?? ""}`.trim(),
        },
        {
          label: "Maturity",
          topic: "maturity" as const,
          value: snap.maturity_number,
          note: `Later blend of Life Path + Expression · ${CORE_TRAIT[Number(snap.maturity_number)] ?? ""}`.trim(),
        },
      ],
    },
    {
      system: "chaldean" as const,
      title: "Chaldean",
      blurb: "Name vibration on the older 1–8 letter chart — keep the compound and the reduced digit together.",
      insight: chaldeanInsight({
        compound: snap.compound_number,
        reduced: snap.chaldean_name_number,
        pythExpression: snap.expression_number,
      }),
      rows: [
        {
          label: "Name number",
          topic: "chaldean-name" as const,
          value: snap.chaldean_name_number,
          note: `Reduced name vibration · ${CORE_TRAIT[Number(snap.chaldean_name_number)] ?? ""}`.trim(),
        },
        {
          label: "Before reduce",
          value: snap.compound_number,
          hint: "Total before reducing to a single digit",
          note: "Compound texture of this spelling — not a second person.",
        },
      ],
    },
    {
      system: "vedic" as const,
      title: "Vedic",
      blurb: "Day temperament, full-date path, and name tone.",
      rows: [
        {
          label: "Psychic (birth day)",
          topic: "vedic-psychic" as const,
          value: snap.vedic_psychic,
        },
        {
          label: "Destiny (full date)",
          topic: "vedic-destiny" as const,
          value: snap.vedic_destiny,
        },
        {
          label: "Name",
          topic: "vedic-name" as const,
          value: snap.vedic_name,
          note: snap.operating_name
            ? `Current legal spelling · ${snap.operating_name}`
            : undefined,
        },
        ...(snap.natal_vedic_name
          ? [
              {
                label: "Natal name",
                topic: "vedic-name" as const,
                value: snap.natal_vedic_name,
                note: `Birth-certificate spelling · ${snap.natal_name ?? person.full_name}`,
              },
            ]
          : []),
        ...(snap.unit_name
          ? [
              {
                label: "Name (second map)",
                value: snap.unit_name,
                hint: "Alternate letter map for the same name",
              },
            ]
          : []),
      ],
    },
    {
      system: "timing" as const,
      title: "This year timing",
      blurb: "Birthday-cycle Personal Year, month pacing, and Vedic Year outlook — open the Annual rhythm wheel below.",
      actionHref: yearsHrefForPerson({
        dateOfBirth: person.date_of_birth,
        fullName: person.operating_name || person.full_name,
      }),
      actionLabel: "View all years",
      rows: [
        {
          label: "Personal Year",
          topic: "personal-year" as const,
          value: snap.personal_year,
        },
        {
          label: "Personal Month",
          topic: "personal-month" as const,
          value: snap.personal_month,
        },
        ...(snap.projected_year
          ? [
              {
                label: "Year outlook",
                topic: "projected-year" as const,
                value: snap.projected_year,
                hint: snap.projected_year_calendar
                  ? `Birthday cycle ${snap.projected_year_calendar}`
                  : undefined,
              },
            ]
          : []),
      ],
    },
    ...(snap.sun_sign && snap.sun_sign_label
      ? [
          {
            system: "astro" as const,
            title: "Sun sign",
            blurb: "Tropical sun sign from month and day of birth.",
            rows: [
              {
                label: "Sun sign",
                topic: "sun-sign" as const,
                value: snap.sun_sign,
                display: snap.sun_sign_label,
              },
            ],
          },
        ]
      : []),
  ];

  const chartItems = [
    {
      label: "Life Path",
      topic: "life-path" as const,
      value: snap.life_path,
      system: "pythagorean" as const,
    },
    {
      label: "Expression",
      topic: "expression" as const,
      value: snap.expression_number,
      system: "pythagorean" as const,
    },
    {
      label: "Soul Urge",
      topic: "soul-urge" as const,
      value: snap.soul_urge_number,
      system: "pythagorean" as const,
    },
    {
      label: "Personality",
      topic: "personality" as const,
      value: snap.personality_number,
      system: "pythagorean" as const,
    },
    {
      label: "Maturity",
      topic: "maturity" as const,
      value: snap.maturity_number,
      system: "pythagorean" as const,
    },
  ];

  const vedicChartItems = [
    {
      label: "Psychic",
      topic: "vedic-psychic" as const,
      value: snap.vedic_psychic,
      system: "vedic" as const,
      subtitle: "Birth day",
    },
    {
      label: "Destiny",
      topic: "vedic-destiny" as const,
      value: snap.vedic_destiny,
      system: "vedic" as const,
      subtitle: "Full date",
    },
    {
      label: "Name",
      topic: "vedic-name" as const,
      value: snap.vedic_name,
      system: "vedic" as const,
      subtitle: snap.operating_name ? "Name in force now" : "Name letters",
    },
    ...(snap.natal_vedic_name
      ? [
          {
            label: "Natal name",
            topic: "vedic-name" as const,
            value: snap.natal_vedic_name,
            system: "vedic" as const,
            subtitle: "Birth-certificate spelling",
          },
        ]
      : []),
  ];

  const summary = report.sections.find((s) => s.id === "executive-summary");
  const closing = report.sections.find((s) => s.id === "closing");
  const detailSections = report.sections.filter(
    (s) =>
      s.id !== "executive-summary" &&
      s.id !== "snapshot" &&
      s.id !== "compatibility" &&
      s.id !== "closing",
  );
  const insightPack = buildDetailedInsightCards(report);

  return (
    <article className="report-protected relative mx-auto max-w-3xl px-5 pb-20 pt-4">
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

      <div className="relative z-10 space-y-10">
        <header>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gold-deep">
                Private reading
              </p>
              <h1 className="mt-2 text-4xl text-ink md:text-5xl">
                {person.preferred_name || person.full_name}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {allowPdf ? (
                <ExportPdfButton report={report} />
              ) : (
                <Link
                  href="/pricing"
                  className="rounded-full border border-emerald/40 bg-emerald/10 px-4 py-2 text-sm text-ink hover:bg-emerald/15"
                >
                  Unlock PDF
                </Link>
              )}
            </div>
          </div>
          {snap.sun_sign && snap.sun_sign_label ? (
            <p className="mt-3 text-lg text-ink-soft">
              Sun sign{" "}
              <GuideNumberLink
                topic="sun-sign"
                value={snap.sun_sign}
                label="Sun sign"
                display={snap.sun_sign_label}
                className="brand text-xl text-ink underline decoration-gold/60 underline-offset-2 hover:text-gold-deep"
              />
            </p>
          ) : null}
          <p className="mt-4 text-sm text-ink-soft">
            <a
              href="#trivia-cities"
              className="text-gold-deep underline underline-offset-2 hover:text-ink"
            >
              City name-number matrix
            </a>
            {" · "}
            <Link
              href="/name"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-deep underline underline-offset-2 hover:text-ink"
            >
              What&apos;s my name
            </Link>
          </p>
        </header>

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-xl text-ink">Person details</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["Birth-certificate name", person.full_name],
              [
                "Current legal name",
                person.operating_name && person.operating_name !== person.full_name
                  ? `${person.operating_name}${
                      person.name_era_label ? ` · ${person.name_era_label}` : ""
                    }`
                  : "Same as birth-certificate name",
              ],
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
            Grouped by system · hover a number · click opens its guide.
          </p>
          <div className="mt-4">
            <SnapshotBySystem groups={snapshotGroups} />
          </div>
          <div className="mt-6">
            <PythagoreanIdentityLayers
              birthDay={snap.birth_day}
              lifePath={snap.life_path}
              expression={snap.expression_number}
              soulUrge={snap.soul_urge_number}
              personality={snap.personality_number}
              maturity={snap.maturity_number}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl text-ink">Core numbers at a glance</h2>
          <div className="mt-4 space-y-6 rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <CoreNumbersChart items={chartItems} />
            <div>
              <p className="text-sm font-medium text-ink">Vedic trio</p>
              <div className="mt-3">
                <CoreNumbersChart
                  items={vedicChartItems}
                  intro="Day, full date, and name digits from the Vedic layer."
                />
              </div>
            </div>
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
          <div className="mt-4 space-y-3">
            {snap.natal_vedic_name && snap.operating_name ? (
              <NameEraNote
                natalName={snap.natal_name || person.full_name}
                operatingName={snap.operating_name}
                label={snap.name_era_label || "Later name in force"}
                natalNn={snap.natal_vedic_name}
                operatingNn={snap.vedic_name}
                givenUnchanged={
                  snap.given_vedic_name != null &&
                  snap.natal_given_vedic_name != null &&
                  String(snap.given_vedic_name) ===
                    String(snap.natal_given_vedic_name)
                }
              />
            ) : null}
            <VedicPanel
              psychic={snap.vedic_psychic}
              destiny={snap.vedic_destiny}
              nameNumber={snap.vedic_name}
              natalNameNumber={snap.natal_vedic_name}
              unitName={snap.unit_name}
              unitCompound={snap.unit_name_compound}
              nameCompound={snap.vedic_name_compound}
              rulingPlanet={report.vedic.ruling_planet}
              destinyRulingPlanet={
                report.vedic.destiny_ruling_planet ||
                report.vedic.ruling_planet
              }
              unitSystem={report.vedic.unitSystem}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h2 className="text-xl text-ink">Tri-Identity Harmony</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Birth, Destiny, and Name as a triangle — pair lines, center score,
            and classic table on demand. The Vedic panel above still explains
            Birth → Destiny in plain language.
          </p>
          <div className="mt-4">
            <TrioFitPanel
              vedicBirth={snap.vedic_psychic}
              vedicDestiny={snap.vedic_destiny}
              vedicName={snap.vedic_name}
              chaldeanName={snap.chaldean_name_number}
              pythBirth={snap.birth_day}
              pythDestiny={snap.life_path}
              pythName={snap.expression_number}
            />
          </div>
        </section>

        <TimingDashboard
          personalYear={report.personal_year}
          personalMonth={report.personal_month}
          projectedYear={report.projected_year}
          sunSignId={snap.sun_sign}
          sunSignLabel={snap.sun_sign_label}
          dateOfBirth={person.date_of_birth}
          initialOutlookYear={
            report.projected_year
              ? Number(report.projected_year.calendar_year)
              : undefined
          }
          yearsHref={yearsHrefForPerson({
            dateOfBirth: person.date_of_birth,
            fullName: person.operating_name || person.full_name,
            tab: "vedic",
          })}
          lifePath={snap.life_path}
          expression={snap.expression_number}
        />

        <section>
          <h2 className="text-xl text-ink">Birth charts</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Lo Shu grid, Pythagorean personality wheel, and Vedic number
            chart—same hover tips and click-through guides. Not a full kundli.{" "}
            <LearningConceptLink conceptKey="lo-shu" />
          </p>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <BirthChartsPanel
              loShu={report.lo_shu}
              dateOfBirth={person.date_of_birth}
              snap={snap}
              fullName={person.operating_name || person.full_name}
            />
          </div>
        </section>

        {summary ? (
          <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <h2 className="text-xl text-ink">Executive summary</h2>
            <div className="mt-4">
              <IdentitySnapshotPanel
                snap={snap}
                loShu={report.lo_shu}
                preferredName={person.preferred_name || person.full_name}
                legacyBody={summary.body}
              />
            </div>
          </section>
        ) : null}

        {report.growth_areas?.length ? (
          <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <h2 className="text-xl text-ink">Growth Mode</h2>
            <div className="mt-4">
              <GrowthAreasPanel
                areas={report.growth_areas}
                growthMode
                personalYear={snap.personal_year}
                personalMonth={snap.personal_month}
                lifePath={snap.life_path}
              />
            </div>
          </section>
        ) : null}

        {report.strengths.length ? (
          <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <h2 className="text-xl text-ink">Strengths at a glance</h2>
            <div className="mt-4">
              <StrengthsConstellation
                strengths={report.strengths}
                lifePath={snap.life_path}
                expression={snap.expression_number}
                soulUrge={snap.soul_urge_number}
                vedicPsychic={snap.vedic_psychic}
              />
            </div>
          </section>
        ) : null}

        <section className="space-y-3">
          <h2 className="text-xl text-ink">Detailed reading</h2>
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm leading-6 text-amber-950">
            <p className="font-medium text-ink">Before you read</p>
            <p className="mt-1">{report.disclaimer}</p>
            {report.safety_notices?.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {report.safety_notices.map((n) => (
                  <li key={n.slice(0, 48)}>{n}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <p className="text-sm text-ink-soft">
            Skim the visuals above first—open a section only when you want more
            detail. Section text does not repeat the disclaimer.
          </p>
          {detailSections.map((section) => (
            <Accordion
              key={section.id}
              title={section.title}
              defaultOpen={section.id === "recommendations"}
            >
              {section.id === "career" && report.career_suggestions ? (
                <div className="space-y-4">
                  {(insightPack.career ?? []).map((card) => (
                    <InsightTileCard key={card.key} card={card} />
                  ))}
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
                  <ClassicProseToggle text={section.body} />
                </div>
              ) : INSIGHT_SECTIONS.has(section.id) ? (
                <div className="space-y-4">
                  {(insightPack[section.id] ?? []).map((card) => (
                    <InsightTileCard key={card.key} card={card} />
                  ))}
                  <ClassicProseToggle text={section.body} />
                </div>
              ) : (
                <MoreDetail text={section.body} />
              )}
            </Accordion>
          ))}
        </section>

        {report.compatibility ? (
          <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
            <h2 className="text-xl text-ink">Compatibility Compass</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Tri-bond wheel across Romantic, Business, and Friendship — plus
              Vedic Graha Mandala for Psychic · Destiny · Name.
            </p>
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
                  moolank: report.compatibility.vedic?.moolank
                    ? {
                        rawNumber:
                          report.compatibility.vedic.moolank.raw_number,
                        matrix: report.compatibility.vedic.moolank.matrix,
                      }
                    : undefined,
                  bhagyank: report.compatibility.vedic?.bhagyank
                    ? {
                        rawNumber:
                          report.compatibility.vedic.bhagyank.raw_number,
                        matrix: report.compatibility.vedic.bhagyank.matrix,
                      }
                    : undefined,
                  namank: report.compatibility.vedic?.namank
                    ? {
                        rawNumber:
                          report.compatibility.vedic.namank.raw_number,
                        matrix: report.compatibility.vedic.namank.matrix,
                      }
                    : undefined,
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
          <h2 className="text-xl text-ink">Reflective associations</h2>
          <div className="mt-4">
            <AssociationsPanel
              lifePath={snap.life_path}
              vedicDestiny={snap.vedic_destiny}
              chaldeanName={snap.chaldean_name_number}
              fullName={person.operating_name || person.full_name}
            />
          </div>
        </section>

        <section
          id="trivia-cities"
          className="scroll-mt-6 rounded-2xl border border-[var(--line)] bg-white/55 p-5"
        >
          <h2 className="text-xl text-ink">Trivia · similar numbers</h2>
          <div className="mt-4">
            <TriviaPanel
              lifePath={snap.life_path}
              destiny={snap.vedic_destiny}
              psychic={snap.vedic_psychic}
              expression={snap.expression_number}
              vedicName={snap.vedic_name}
              natalVedicName={snap.natal_vedic_name}
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
              {closing ? (
                <p className="whitespace-pre-wrap">{closing.body}</p>
              ) : null}
              <p>{report.disclaimer}</p>
              {(report.safety_notices ?? []).map((notice) => (
                <p key={notice.slice(0, 40)}>{notice}</p>
              ))}
              {report.recommendations_disclaimer ? (
                <p>{report.recommendations_disclaimer}</p>
              ) : null}
              {report.career_suggestions?.disclaimer ? (
                <p>{report.career_suggestions.disclaimer}</p>
              ) : null}
              {report.compatibility?.disclaimer ? (
                <p>{report.compatibility.disclaimer}</p>
              ) : null}
              <p>
                {allowPdf
                  ? "PDF export is available on your plan. Guide links open standard reference pages."
                  : "On-screen viewing only. Copying, downloading, and printing are disabled on free reports. Guide links open standard reference pages."}
              </p>
            </div>
          </details>
        </footer>
      </div>
    </article>
  );
}
