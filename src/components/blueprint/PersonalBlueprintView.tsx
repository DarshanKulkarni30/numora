"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlignmentMatrix } from "@/components/blueprint/AlignmentMatrix";
import { CoreNumberJourney } from "@/components/blueprint/CoreNumberJourney";
import { LifePatternFlow } from "@/components/blueprint/LifePatternFlow";
import { NameJourney } from "@/components/blueprint/NameJourney";
import { NumberInspector, type InspectorTarget } from "@/components/blueprint/NumberInspector";
import { PanelRating } from "@/components/blueprint/PanelRating";
import { YearReading } from "@/components/blueprint/YearReading";
import { ActionPlanPanel } from "@/components/report/ActionPlanPanel";
import { LoShuChart } from "@/components/report/LoShuChart";
import { PinnacleYearPanel } from "@/components/report/PinnacleYearPanel";
import { TriviaPanel } from "@/components/report/TriviaPanel";
import { VedicSquarePanel } from "@/components/report/VedicSquarePanel";
import { buildBlueprintReading } from "@/lib/numerology/blueprint";
import { buildInspectorCardCopy } from "@/lib/numerology/blueprint/inspectorCopy";
import { formatCompoundRoot } from "@/lib/numerology/chaldeanName";
import { parseChartNumber } from "@/lib/numerology/enhanced/digits";
import { buildActionPlan } from "@/lib/numerology/enhanced/actionPlan";
import { buildEnhancedReading } from "@/lib/numerology/enhanced";
import { applyLivingTiming } from "@/lib/numerology/livingTiming";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import type { NumerologyReport } from "@/lib/numerology/types";

const NAV: { href: string; label: string }[] = [
  { href: "#overview", label: "Overview" },
  { href: "#pattern", label: "Pattern" },
  { href: "#timing", label: "Timing" },
  { href: "#career", label: "Career" },
  { href: "#life", label: "Life" },
  { href: "#grids", label: "Grids" },
  { href: "#explore", label: "Explore" },
  { href: "#next", label: "Next moves" },
];

type Props = {
  report: NumerologyReport;
  reportId: string;
  allowRating?: boolean;
  detailedHref?: string;
  comprehensiveHref?: string;
  roomHref?: string;
  yearsHref?: string;
};

export function PersonalBlueprintView({
  report,
  reportId,
  allowRating = true,
  detailedHref,
  comprehensiveHref,
  roomHref,
  yearsHref,
}: Props) {
  const live = useMemo(() => applyLivingTiming(report), [report]);
  const enhanced = useMemo(
    () => buildEnhancedReading(live, { reportId }),
    [live, reportId],
  );
  const blueprint = useMemo(
    () => buildBlueprintReading(live, { reportId }),
    [live, reportId],
  );
  const actionPlan = useMemo(
    () =>
      buildActionPlan({
        report: live,
        season: enhanced.season,
        themes: enhanced.themes,
      }),
    [live, enhanced],
  );
  const [inspect, setInspect] = useState<InspectorTarget | null>(null);
  const [openArea, setOpenArea] = useState<string | null>(null);
  const [openDomain, setOpenDomain] = useState<string | null>(null);
  const [alignYear, setAlignYear] = useState<number | null>(null);
  const [gridTab, setGridTab] = useState<"loshu" | "vedic">("loshu");
  const [showPastJourney, setShowPastJourney] = useState(false);

  const snap = live.numerology_snapshot;
  const person = live.person;
  const { cycle, interpretation, interactions } = blueprint;
  const nameLabel = formatCompoundRoot(blueprint.nameCompound, blueprint.nameRoot);

  function openDigit(digit: number, label: string, extra?: Partial<InspectorTarget>) {
    const occurrences = [
      blueprint.bn === digit ? "Birth Number" : null,
      blueprint.dn === digit ? "Destiny Number" : null,
      blueprint.nameRoot === digit ? "Name root" : null,
      blueprint.soul === digit ? "Soul" : null,
      blueprint.py === digit ? "Personal Year" : null,
      cycle?.active.value === digit
        ? `Name Cycle ${cycle.active.letter}`
        : null,
      live.lo_shu?.present_numbers?.includes(digit) ? "Lo Shu present" : null,
    ].filter(Boolean) as string[];
    const copy = buildInspectorCardCopy({
      label,
      digit,
      dob: person.date_of_birth,
      operatingName: person.operating_name || person.full_name,
      soulCompound: parseChartNumber(snap.soul_urge_compound) ?? undefined,
      cycle,
      pinnacle: blueprint.pinnacle,
    });
    setInspect({
      label,
      digit,
      occurrences,
      meaning: copy.meaning,
      alsoKnownAs: copy.alsoKnownAs,
      calc: extra?.calc?.length ? extra.calc : copy.calc,
      compound: extra?.compound ?? copy.compound,
      letter: extra?.letter ?? copy.letter,
    });
  }

  const pastJourney = blueprint.journey.filter((row) => row.year < blueprint.year);
  const restJourney = blueprint.journey.filter((row) => row.year >= blueprint.year);

  return (
    <div className="relative z-10 space-y-12">
      <p className="text-sm uppercase tracking-[0.2em] text-gold-deep">
        Personal Blueprint
      </p>
      <h1 className="text-4xl text-ink md:text-5xl">{blueprint.displayName}</h1>
      <p className="text-ink-soft">
        Your numbers. Your patterns. Your timing. Your next moves.
      </p>

      <nav className="sticky top-0 z-20 -mx-5 border-b border-[var(--line)] bg-paper/95 px-5 py-2 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="btn-tactile rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-ink"
            >
              {item.label}
            </a>
          ))}
          {detailedHref ? (
            <Link
              href={detailedHref}
              className="btn-tactile rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-ink"
            >
              Detailed catalog
            </Link>
          ) : null}
          {comprehensiveHref ? (
            <Link
              href={comprehensiveHref}
              className="btn-tactile rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-ink"
            >
              Comprehensive
            </Link>
          ) : null}
          {roomHref ? (
            <Link
              href={roomHref}
              className="btn-tactile rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-sm text-ink"
            >
              Reading room
            </Link>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {[
            ["BN", blueprint.bn, "Birth Number"],
            ["DN", blueprint.dn, "Destiny Number"],
            ["NAME", blueprint.nameRoot, "Name Number"],
            ["SOUL", blueprint.soul, "Soul"],
            ["PY", blueprint.py, "Personal Year"],
            ["PIN", blueprint.pinnacle.number, "Pinnacle"],
          ].map(([label, value, title]) => (
            <button
              key={String(label)}
              type="button"
              className="btn-tactile rounded-full border border-[var(--line)] bg-white px-2.5 py-1 text-ink"
              onClick={() => openDigit(Number(value), String(title))}
            >
              {label} {value}
            </button>
          ))}
          {cycle ? (
            <button
              type="button"
              className="btn-tactile rounded-full border border-gold-deep/40 bg-gold/15 px-2.5 py-1 text-ink"
              onClick={() =>
                openDigit(cycle.active.value, "Name Cycle", {
                  letter: cycle.active.letter,
                  calc: cycle.calcLines,
                })
              }
            >
              CYCLE {cycle.active.letter}/{cycle.active.value}
            </button>
          ) : null}
        </div>
      </nav>

      <section id="overview" className="scroll-mt-28 space-y-5">
        <h2 className="text-2xl text-ink">My numbers</h2>
        <p className="text-sm text-ink-soft">
          Core Code is permanent. Name Cycle below is this year’s active letter —
          not a fifth core number.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Birth Number", blueprint.bn, "Driver", "The day you were born reduced."],
            ["Destiny Number", blueprint.dn, "Pathway", "The full date reduced."],
            ["Name Number", nameLabel, "Depth", "Chaldean letters of the name in force."],
            ["Soul", String(blueprint.soul), "Inner motive", "Chaldean vowels."],
          ].map(([label, value, role, hint]) => (
            <button
              key={label}
              type="button"
              className="btn-tactile rounded-2xl border border-[var(--line)] bg-white/80 p-4 text-left"
              onClick={() => {
                const digit =
                  label === "Name Number" ? blueprint.nameRoot : Number(value);
                openDigit(digit, String(label), {
                  compound: label === "Name Number" ? blueprint.nameCompound : undefined,
                });
              }}
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                {label}
              </p>
              <p className="brand mt-1 text-3xl text-ink">{value}</p>
              <p className="mt-1 text-sm text-ink">{role}</p>
              <p className="mt-1 text-xs text-ink-soft">{hint}</p>
            </button>
          ))}
        </div>
        <CoreNumberJourney
          reading={blueprint.coreJourney}
          onDigit={(digit, label) => {
            const mapped =
              label === "Inner drive"
                ? "Soul"
                : label === "Natural response"
                  ? "Birth Number"
                  : label === "Life direction"
                    ? "Destiny Number"
                    : label === "Outer expression"
                      ? "Name Number"
                      : label === "What others see"
                      ? "Personality"
                      : label;
            openDigit(
              digit,
              mapped,
              mapped === "Name Number"
                ? { compound: blueprint.nameCompound }
                : mapped === "Personality"
                  ? { compound: blueprint.personalityCompound }
                  : undefined,
            );
          }}
        />
        {cycle ? (
          <NameJourney
            cycle={cycle}
            onSelectLetter={(letter, value) =>
              openDigit(value, "Name Cycle", { letter, calc: cycle.calcLines })
            }
          />
        ) : (
          <p className="text-sm text-ink-soft">
            Add a Latin first name to read the annual Name Cycle.
          </p>
        )}
        <PanelRating
          panelId="blueprint.core"
          numbers={blueprint.numbersUsed}
          enabled={allowRating}
        />
      </section>

      <section id="pattern" className="scroll-mt-28 space-y-5">
        <h2 className="text-2xl text-ink">My life pattern</h2>
        <LifePatternFlow
          map={interactions}
          onDigit={(digit, label) =>
            openDigit(
              digit,
              label,
              label === "Name Number"
                ? { compound: blueprint.nameCompound }
                : undefined,
            )
          }
        />
        <div>
          <h3 className="text-lg text-ink">Where life feels easy / where it needs work</h3>
          <ul className="mt-3 space-y-2">
            {blueprint.areas.map((area) => (
              <li key={area.id}>
                <button
                  type="button"
                  className="btn-tactile w-full rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-left"
                  onClick={() =>
                    setOpenArea(openArea === area.id ? null : area.id)
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-ink">{area.label}</span>
                    <span
                      className="h-2 flex-1 overflow-hidden rounded-full bg-mist"
                      aria-hidden
                    >
                      <span
                        className="block h-full rounded-full bg-sea"
                        style={{
                          width: `${Math.round((area.count / Math.max(1, area.max)) * 100)}%`,
                        }}
                      />
                    </span>
                  </div>
                </button>
                {openArea === area.id ? (
                  <div className="mt-2 rounded-xl bg-white/80 px-3 py-3 text-sm leading-6 text-ink-soft">
                    <p className="text-ink">{area.advantage}</p>
                    <p className="mt-1">Watch: {area.watch}</p>
                    <p className="mt-1 text-ink">{area.adjustment}</p>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-lg text-ink">Strengths</h3>
            <ul className="mt-2 space-y-2">
              {blueprint.manual.strengths.map((card) => (
                <li
                  key={card.title}
                  className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3"
                >
                  <p className="text-xs font-medium tracking-wider text-ink">
                    {card.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{card.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg text-ink">Friction</h3>
            <ul className="mt-2 space-y-2">
              {blueprint.manual.friction.map((card) => (
                <li
                  key={card.title}
                  className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3"
                >
                  <p className="text-xs font-medium tracking-wider text-ink">
                    {card.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{card.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h3 className="text-lg text-ink">Adjustment playbook</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            {blueprint.manual.playbook.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <PanelRating
          panelId="blueprint.pattern"
          numbers={blueprint.numbersUsed}
          enabled={allowRating}
        />
      </section>

      <section id="timing" className="scroll-mt-28 space-y-5">
        <h2 className="text-2xl text-ink">My timing</h2>
        <p className="text-sm text-ink-soft">
          Personal Year is the season (date only). Year Resonance is how your
          Birth architecture, Name architecture, and Name Cycle meet that
          season. Western Essence transits stay on the Detailed catalog.
        </p>
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5">
          <YearReading
            reading={interpretation}
            resonance={blueprint.resonance}
            allowRating={allowRating}
            onDigit={(digit, label) => openDigit(digit, label)}
          />
          <Link
            href={yearsHref ?? blueprint.yearsHref}
            className="btn-tactile mt-4 inline-flex rounded-full bg-ink px-4 py-2 text-sm text-paper"
          >
            Open full year report
          </Link>
        </div>
        <div>
          <h3 className="text-lg text-ink">Year journey</h3>
          {pastJourney.length ? (
            <button
              type="button"
              className="btn-tactile mt-2 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-sm text-ink"
              onClick={() => setShowPastJourney((v) => !v)}
            >
              {showPastJourney ? "Hide previous years" : "Show previous years"}
            </button>
          ) : null}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[32rem] table-fixed text-left text-sm">
              <thead>
                <tr className="text-ink-soft">
                  <th className="w-16 py-2 pr-3 font-medium">Year</th>
                  <th className="w-12 py-2 pr-3 font-medium">PY</th>
                  <th className="w-[5.5rem] py-2 pr-3 font-medium">Letter</th>
                  <th className="py-2 font-medium">Practise this year</th>
                </tr>
              </thead>
              <tbody>
                {(showPastJourney ? blueprint.journey : restJourney).map((row) => (
                  <tr
                    key={row.year}
                    className={`border-t border-[var(--line)] ${
                      row.isCurrent ? "bg-gold/15 font-medium" : "text-ink-soft"
                    }`}
                  >
                    <td className="py-2 pr-3 align-top text-ink">{row.year}</td>
                    <td className="py-2 pr-3 align-top text-ink">{row.py}</td>
                    <td className="py-2 pr-3 align-top whitespace-nowrap text-ink">
                      {row.cycle
                        ? `${row.cycle.active.letter} / ${row.cycle.active.value}`
                        : "—"}
                    </td>
                    <td className="py-2 align-top">
                      <p className="text-ink">{row.reading.tableDo}</p>
                      <p className="mt-0.5 text-xs font-normal text-ink-soft">
                        {row.reading.signatureTitle}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <PinnacleYearPanel
          dateOfBirth={person.date_of_birth}
          lifePath={snap.life_path}
          personalYear={String(blueprint.py)}
          expression={snap.expression_number}
        />
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <h3 className="text-lg text-ink">Transition</h3>
          <p className="mt-2 text-sm leading-6 text-ink">{blueprint.transition.changes}</p>
          <p className="mt-3 text-sm leading-6 text-ink">
            <span className="font-medium">Leave behind. </span>
            {blueprint.transition.stopCarrying}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink">
            <span className="font-medium">This week. </span>
            {blueprint.transition.doMore}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink">
            <span className="font-medium">Next year. </span>
            {blueprint.transition.prepareNext}
          </p>
        </div>
        <PanelRating
          panelId="blueprint.timing.current"
          numbers={blueprint.numbersUsed}
          enabled={allowRating}
        />
      </section>

      <section id="career" className="scroll-mt-28 space-y-4">
        <h2 className="text-2xl text-ink">Career Compass</h2>
        <p className="text-lg text-ink">{blueprint.career.modeLine}</p>
        <p className="text-sm text-ink-soft">{blueprint.career.meaning}</p>
        <ul className="space-y-2">
          {blueprint.career.moves.map((move) => (
            <li
              key={move.title}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3"
            >
              <p className="text-ink">{move.title}</p>
              <p className="mt-2 text-sm text-ink">Do this: {move.doThis}</p>
              <p className="mt-1 text-sm text-ink-soft">Watch: {move.watch}</p>
            </li>
          ))}
        </ul>
        <h3 className="text-lg text-ink">If this is already your kind of work</h3>
        <p className="text-sm text-ink-soft">
          These are not jobs to switch into. Open the one that matches work you
          already do.
        </p>
        <ul className="space-y-2">
          {blueprint.career.domains.map((domain) => (
            <li key={domain.id}>
              <button
                type="button"
                className="btn-tactile w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-left"
                onClick={() =>
                  setOpenDomain(openDomain === domain.id ? null : domain.id)
                }
                aria-expanded={openDomain === domain.id}
              >
                <p className="text-ink">{domain.title}</p>
                {openDomain === domain.id ? (
                  <div className="mt-2 space-y-1 text-sm leading-6">
                    <p className="text-ink-soft">{domain.why}</p>
                    <p className="text-ink">Use this year: {domain.useThisYear}</p>
                    <p className="text-ink-soft">Watch: {domain.watch}</p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-ink-soft">{domain.useThisYear}</p>
                )}
              </button>
            </li>
          ))}
        </ul>
        <PanelRating
          panelId="compass.career"
          numbers={blueprint.numbersUsed}
          enabled={allowRating}
        />
        <AlignmentMatrix
          dob={person.date_of_birth}
          natalName={snap.natal_name || person.full_name}
          preferredName={person.preferred_name}
          bn={blueprint.bn}
          dn={blueprint.dn}
          nameRoot={blueprint.nameRoot}
          nameCompound={blueprint.nameCompound}
          year={alignYear ?? blueprint.year}
          onYearChange={setAlignYear}
          focus="career"
          allowRating={allowRating}
        />
      </section>

      <section id="life" className="scroll-mt-28 space-y-4">
        <h2 className="text-2xl text-ink">Life Compass</h2>
        <AlignmentMatrix
          dob={person.date_of_birth}
          natalName={snap.natal_name || person.full_name}
          preferredName={person.preferred_name}
          bn={blueprint.bn}
          dn={blueprint.dn}
          nameRoot={blueprint.nameRoot}
          nameCompound={blueprint.nameCompound}
          year={alignYear ?? blueprint.year}
          onYearChange={setAlignYear}
          focus="life"
          showChrome={false}
          allowRating={allowRating}
        />
        <p className="text-sm text-ink-soft">{blueprint.life.intro}</p>
        <ul className="space-y-2">
          {blueprint.life.themes.map((theme) => (
            <li
              key={theme.id}
              className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                {theme.band}
              </p>
              <p className="text-ink">{theme.title}</p>
              <p className="mt-2 text-sm text-ink-soft">{theme.why}</p>
              <p className="mt-2 text-sm text-ink">Do this: {theme.doThis}</p>
              <p className="mt-1 text-sm text-ink-soft">Watch: {theme.watch}</p>
            </li>
          ))}
        </ul>
        <h3 className="text-lg text-ink">Goal action planner</h3>
        <ActionPlanPanel plan={actionPlan} />
        <PanelRating
          panelId="compass.life"
          numbers={blueprint.numbersUsed}
          enabled={allowRating}
        />
      </section>

      <section id="grids" className="scroll-mt-28 space-y-4">
        <h2 className="text-2xl text-ink">My grids</h2>
        <p className="text-sm text-ink-soft">
          Lo Shu and Vedic Square stay separate. They do not share calculation
          rules. Number Journey (above) is who you are. The square below shows
          how a digit’s footprint reinforces or complicates that.
        </p>
        <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
          {(
            [
              ["loshu", "Lo Shu"],
              ["vedic", "Vedic Square"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
                gridTab === id ? "bg-ink text-paper" : "text-ink-soft"
              }`}
              onClick={() => setGridTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {gridTab === "loshu" ? (
          <div>
            <p className="mb-3 text-sm text-ink-soft">{enhanced.loShuLived.summary}</p>
            <LoShuChart loShu={live.lo_shu} dateOfBirth={person.date_of_birth} />
          </div>
        ) : (
          <VedicSquarePanel
            psychic={snap.vedic_psychic}
            destiny={snap.vedic_destiny}
            nameNumber={snap.vedic_name}
            unitName={snap.unit_name}
          />
        )}
      </section>

      <section id="explore" className="scroll-mt-28 space-y-4">
        <h2 className="text-2xl text-ink">Connections and trivia</h2>
        <TriviaPanel
          lifePath={snap.life_path}
          destiny={snap.vedic_destiny}
          psychic={snap.vedic_psychic}
          expression={snap.expression_number}
          vedicName={snap.vedic_name}
          natalVedicName={snap.natal_vedic_name}
          dateOfBirth={person.date_of_birth}
        />
      </section>

      <section id="next" className="scroll-mt-28 space-y-4">
        <h2 className="text-2xl text-ink">Your next moves</h2>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-7 text-ink">
          <li>{blueprint.nextMoves.career}</li>
          <li>{blueprint.nextMoves.relationships}</li>
          <li>{blueprint.nextMoves.growth}</li>
          <li>{blueprint.nextMoves.timing}</li>
          <li>
            Journal prompt: {blueprint.nextMoves.prompt}
          </li>
        </ol>
        <p className="text-sm text-ink-soft">
          Energy flow this year sits on {plainTrait(blueprint.bn)} /{" "}
          {plainTrait(blueprint.dn)} / {plainTrait(blueprint.nameRoot)}.
        </p>
      </section>

      <NumberInspector target={inspect} onClose={() => setInspect(null)} />
    </div>
  );
}
