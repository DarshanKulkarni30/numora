"use client";

import { useMemo, useState } from "react";
import { PanelRating } from "@/components/blueprint/PanelRating";
import {
  buildYearAlignment,
  yearBounds,
  type AlignmentRow,
  type AlignmentVerdict,
  type StarScore,
  type YearAlignment,
} from "@/lib/numerology/blueprint/yearAlignment";
import type { WesternYearAnchor } from "@/lib/numerology/personalYearOutlook";

type Props = {
  dob: string;
  natalName: string;
  bn: number;
  dn: number;
  nameRoot: number;
  nameCompound?: number;
  history?: unknown;
  preferredName?: string;
  year: number;
  onYearChange: (year: number) => void;
  yearAnchor?: WesternYearAnchor;
  focus?: "career" | "life" | "both";
  allowRating?: boolean;
  /** Year stepper + core table. Turn off when a sibling matrix already shows them. */
  showChrome?: boolean;
};

const VERDICT_CLASS: Record<AlignmentVerdict, string> = {
  "strong-now": "border-teal-200 bg-teal-50 text-teal-950",
  "different-approach": "border-slate-200 bg-slate-50 text-slate-800",
  "better-later": "border-amber-200 bg-amber-50 text-amber-950",
  "lighter-core": "border-[var(--line)] bg-white text-ink-soft",
};

function Stars({ n, label }: { n: StarScore; label: string }) {
  return (
    <span
      className="font-medium tracking-tight text-gold-deep"
      aria-label={`${label}: ${n} out of 5`}
    >
      {"★".repeat(n)}
      <span className="text-ink-soft/40">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function RoleCard({
  row,
  open,
  onToggle,
}: {
  row: AlignmentRow;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        className="btn-tactile w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-left"
        onClick={onToggle}
        aria-expanded={open}
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-ink">{row.title}</p>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${VERDICT_CLASS[row.verdict]}`}
          >
            {row.verdictLabel}
          </span>
        </div>
        <p className="mt-2 text-sm text-ink">Best approach: {row.approach}</p>
        <dl className="mt-2 grid grid-cols-3 gap-2 text-xs text-ink-soft">
          <div>
            <dt>Core fit</dt>
            <dd>
              <Stars n={row.core} label="Core fit" />
            </dd>
          </div>
          <div>
            <dt>This year</dt>
            <dd>
              <Stars n={row.year} label="Year fit" />
            </dd>
          </div>
          <div>
            <dt>Name Cycle</dt>
            <dd>
              <Stars n={row.cycle} label="Name Cycle fit" />
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-sm leading-6 text-ink">{row.starRead}</p>
        {open ? (
          <div className="mt-3 space-y-1 text-sm leading-6 text-ink-soft">
            <p>{row.why.bn}</p>
            <p>{row.why.dn}</p>
            <p>{row.why.name}</p>
            <p>{row.why.year}</p>
            <p>{row.why.cycle}</p>
            <p className="text-ink">{row.result}</p>
          </div>
        ) : null}
      </button>
    </li>
  );
}

function StarLegend({ keyCopy }: { keyCopy: YearAlignment["starKey"] }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm leading-6 text-ink">
      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
        How to read the three star rows
      </p>
      <ul className="mt-2 space-y-1 text-ink-soft">
        <li>
          <span className="text-ink">Core fit. </span>
          {keyCopy.core}
        </li>
        <li>
          <span className="text-ink">This year. </span>
          {keyCopy.year}
        </li>
        <li>
          <span className="text-ink">Name Cycle. </span>
          {keyCopy.cycle}
        </li>
      </ul>
      <p className="mt-2 text-ink">{keyCopy.whenTheyDiffer}</p>
    </div>
  );
}

function RoleList({
  rows,
  previewCount,
}: {
  rows: AlignmentRow[];
  previewCount: number;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? rows : rows.slice(0, previewCount);
  return (
    <>
      <ul className="space-y-2">
        {visible.map((row) => (
          <RoleCard
            key={row.id}
            row={row}
            open={openId === row.id}
            onToggle={() => setOpenId(openId === row.id ? null : row.id)}
          />
        ))}
      </ul>
      {rows.length > previewCount ? (
        <button
          type="button"
          className="btn-tactile mt-3 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? "Show top directions" : "View all"}
        </button>
      ) : null}
    </>
  );
}

export function AlignmentMatrix({
  dob,
  natalName,
  bn,
  dn,
  nameRoot,
  nameCompound,
  history,
  preferredName,
  year,
  onYearChange,
  yearAnchor = "birthday",
  focus = "both",
  allowRating = true,
  showChrome = true,
}: Props) {
  const bounds = useMemo(() => yearBounds(dob), [dob]);
  const reading: YearAlignment = useMemo(
    () =>
      buildYearAlignment({
        dob,
        natalName,
        calendarYear: year,
        bn,
        dn,
        nameRoot,
        nameCompound,
        history,
        preferredName,
        yearAnchor,
      }),
    [
      dob,
      natalName,
      year,
      bn,
      dn,
      nameRoot,
      nameCompound,
      history,
      preferredName,
      yearAnchor,
    ],
  );
  const atMin = year <= bounds.min;
  const atMax = year >= bounds.max;
  const numbers = {
    bn: reading.bn,
    dn: reading.dn,
    name: reading.nameDisplay,
    py: reading.personalYear,
    cycle: reading.cycleLetter
      ? `${reading.cycleLetter}/${reading.cycleNumber}`
      : null,
    year: reading.calendarYear,
  };

  return (
    <div className="space-y-4">
      {showChrome ? (
        <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg text-ink">
          Your {reading.calendarYear} alignment
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-tactile h-10 w-10 rounded-full border border-[var(--line)] bg-white text-lg text-ink"
            onClick={() => onYearChange(year - 1)}
            disabled={atMin}
            aria-label="Previous year"
          >
            −
          </button>
          <p className="brand min-w-[4.5rem] text-center text-2xl text-ink">
            {reading.calendarYear}
          </p>
          <button
            type="button"
            className="btn-tactile h-10 w-10 rounded-full border border-[var(--line)] bg-white text-lg text-ink"
            onClick={() => onYearChange(year + 1)}
            disabled={atMax}
            aria-label="Next year"
          >
            +
          </button>
        </div>
      </div>
      <p className="text-sm text-ink-soft">{reading.coreIntro}</p>
      <p className="text-sm text-ink">{reading.yearIntro}</p>
      <p className="text-xs text-ink-soft">
        Stars are a rank from this engine (core × year × Name Cycle), not a score
        out of 100.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[18rem] text-left text-sm">
          <caption className="sr-only">Core numbers for {reading.calendarYear}</caption>
          <tbody>
            {[
              ["Birth Number (BN)", String(reading.bn)],
              ["Destiny Number (DN)", String(reading.dn)],
              ["Name", reading.nameDisplay],
              [
                "Name Cycle",
                reading.cycleLetter && reading.cycleNumber != null
                  ? `${reading.cycleLetter}/${reading.cycleNumber}`
                  : "—",
              ],
              ["Personal Year", String(reading.personalYear)],
            ].map(([label, value]) => (
              <tr key={label} className="border-t border-[var(--line)]">
                <th className="py-1.5 font-medium text-ink-soft">{label}</th>
                <td className="py-1.5 text-right text-ink">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      ) : null}

      {focus === "life" || focus === "both" ? (
        <div>
          <h4 className="text-ink">Where to put energy this year</h4>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink">
            {reading.priorities.slice(0, 5).map((row) => (
              <li key={row.id}>
                {row.title}
                <span className="text-ink-soft"> — {row.verdictLabel}</span>
              </li>
            ))}
          </ol>
          <p className="mt-2 text-sm text-ink-soft">{reading.priorityLine}</p>
        </div>
      ) : null}

      {focus === "career" || focus === "both" ? (
        <div>
          <h4 className="text-ink">Career directions this year</h4>
          <p className="mt-1 text-sm text-ink-soft">
            Not jobs to switch into. How aligned is this kind of work right now,
            and what is the best way to approach it.
          </p>
          <div className="mt-3">
            <StarLegend keyCopy={reading.starKey} />
          </div>
          <div className="mt-3">
            <RoleList rows={reading.careers} previewCount={5} />
          </div>
        </div>
      ) : null}

      {focus === "life" || focus === "both" ? (
        <div>
          {focus === "life" ? (
            <div className="mb-3">
              <StarLegend keyCopy={reading.starKey} />
            </div>
          ) : null}
          <h4 className="text-ink">
            Life areas this year
            {!showChrome ? ` (${reading.calendarYear})` : ""}
          </h4>
          <RoleList rows={reading.life} previewCount={6} />
        </div>
      ) : null}

      <PanelRating
        panelId={`align.${focus}.${reading.calendarYear}`}
        numbers={numbers}
        enabled={allowRating}
      />
    </div>
  );
}
