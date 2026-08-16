"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { personalYearBreakdown } from "@/lib/numerology/cycles";
import {
  projectedYearBreakdown,
  projectedYearMeta,
  type YearTag,
} from "@/lib/numerology/vedicYearNumber";
import {
  defaultExpandedYear,
  VEDIC_YEAR_METHOD_NOTE,
  WESTERN_YEAR_METHOD_NOTE,
  YEAR_PAGE_DISCLAIMER,
  westernYearCopy,
  yearsFromBirthToAge70,
  type YearSystemTab,
} from "@/lib/numerology/yearPage";
import type { PersonRecord } from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";
import { parseDob } from "@/lib/numerology/reduce";

type Props = {
  people: PersonRecord[];
  initialTab?: YearSystemTab;
};

const TAG_STYLE: Record<YearTag, string> = {
  Favourable: "border-teal-200 bg-teal-50 text-teal-950",
  Neutral: "border-slate-200 bg-slate-50 text-slate-800",
  Challenging: "border-amber-300 bg-amber-50 text-amber-950",
};

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

function personKey(p: PersonRecord) {
  return `${p.sort_order}-${p.full_name}`;
}

export function YearOutlookExplorer({
  people,
  initialTab = "western",
}: Props) {
  const selectable = useMemo(
    () =>
      people.filter(
        (p) => (p.full_name || p.preferred_name) && isValidDob(p.date_of_birth),
      ),
    [people],
  );

  const [selectedKey, setSelectedKey] = useState(() => {
    const self = selectable.find((p) => p.is_self);
    const first = self ?? selectable[0];
    return first ? personKey(first) : "";
  });
  const [tab, setTab] = useState<YearSystemTab>(initialTab);
  const nowYear = new Date().getFullYear();
  const [openYear, setOpenYear] = useState<number | "default" | null>(
    "default",
  );

  const selected = selectable.find((p) => personKey(p) === selectedKey);
  const dob = selected?.date_of_birth ?? "";

  const years = useMemo(() => {
    if (!selected || !dob) return [];
    const { year } = parseDob(dob);
    return yearsFromBirthToAge70(year);
  }, [selected, dob]);

  const expandedYear = useMemo(() => {
    if (!years.length) return null;
    if (openYear === "default") return defaultExpandedYear(years, nowYear);
    return openYear;
  }, [years, openYear, nowYear]);

  return (
    <div className="space-y-6">
      <aside className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-950">
        {YEAR_PAGE_DISCLAIMER}
      </aside>

      {selectable.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-8 text-center text-sm text-ink-soft">
          Save at least one complete profile person (name + DOB) to read year
          numbers.{" "}
          <Link href="/profile" className="text-gold-deep underline">
            Open profile
          </Link>
        </div>
      ) : (
        <>
          <div>
            <label
              htmlFor="year-person"
              className="mb-1 block text-sm text-ink-soft"
            >
              Person from your profile
            </label>
            <select
              id="year-person"
              value={selectedKey}
              onChange={(e) => {
                setSelectedKey(e.target.value);
                setOpenYear("default");
              }}
              className="w-full max-w-md rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
            >
              {selectable.map((p) => (
                <option key={personKey(p)} value={personKey(p)}>
                  {personLabel(p)}
                </option>
              ))}
            </select>
            {selected ? (
              <p className="mt-2 text-sm text-ink-soft">
                Years from birth ({parseDob(dob).year}) through age 70. Current
                calendar year is highlighted.
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
            {(
              [
                ["western", "Personal Year"],
                ["vedic", "Vedic"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex-1 rounded-full px-3 py-2 text-sm ${
                  tab === id
                    ? "bg-ink text-paper shadow-sm"
                    : "text-ink-soft"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-sm leading-6 text-ink-soft">
            {tab === "vedic"
              ? VEDIC_YEAR_METHOD_NOTE
              : WESTERN_YEAR_METHOD_NOTE}
          </p>

          {selected && years.length > 0 ? (
            <ol className="divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70">
              {years.map((year) => {
                const isOpen = year === expandedYear;
                const isNow = year === nowYear;
                if (tab === "vedic") {
                  const breakdown = projectedYearBreakdown(dob, year);
                  const meta = projectedYearMeta(breakdown.number);
                  return (
                    <YearRow
                      key={`vedic-${year}`}
                      year={year}
                      number={breakdown.number}
                      tag={meta.tag}
                      shortMeaning={meta.shortMeaning}
                      isOpen={isOpen}
                      isNow={isNow}
                      onToggle={() => setOpenYear(isOpen ? null : year)}
                    >
                      <p className="text-sm text-ink">
                        Ruled by {meta.planet}. {meta.theme}
                      </p>
                      <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                        {meta.details.map((line) => (
                          <li key={line}>· {line}</li>
                        ))}
                      </ul>
                      <p className="mt-3 text-sm text-ink">
                        Practice: {meta.practice}
                      </p>
                      <ol className="mt-4 space-y-1 text-xs text-ink-soft">
                        <li>
                          Month {breakdown.month} + day {breakdown.day} + last
                          two digits {breakdown.yearDigits} + {breakdown.weekdayLabel}{" "}
                          ({breakdown.weekdayDigit}) = {breakdown.compound}
                        </li>
                        <li>Reduce to {breakdown.number}.</li>
                      </ol>
                    </YearRow>
                  );
                }

                const breakdown = personalYearBreakdown(dob, year);
                const copy = westernYearCopy(breakdown.number);
                return (
                  <YearRow
                    key={`western-${year}`}
                    year={year}
                    number={breakdown.number}
                    tag={copy.tag}
                    shortMeaning={copy.shortMeaning}
                    isOpen={isOpen}
                    isNow={isNow}
                    onToggle={() => setOpenYear(isOpen ? null : year)}
                  >
                    <ul className="space-y-1.5 text-sm text-ink-soft">
                      {copy.strengths.map((line) => (
                        <li key={line}>· {line}</li>
                      ))}
                    </ul>
                    {copy.watchouts.length > 0 ? (
                      <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                        {copy.watchouts.map((line) => (
                          <li key={line}>· Watch: {line}</li>
                        ))}
                      </ul>
                    ) : null}
                    <p className="mt-3 text-sm text-ink">
                      Practice: {copy.practice}
                    </p>
                    <ol className="mt-4 space-y-1 text-xs text-ink-soft">
                      <li>
                        Month {breakdown.month} + day {breakdown.day} + {year} ={" "}
                        {breakdown.compound}
                      </li>
                      <li>Reduce to {breakdown.number}.</li>
                    </ol>
                  </YearRow>
                );
              })}
            </ol>
          ) : null}
        </>
      )}
    </div>
  );
}

function YearRow({
  year,
  number,
  tag,
  shortMeaning,
  isOpen,
  isNow,
  onToggle,
  children,
}: {
  year: number;
  number: number;
  tag: YearTag;
  shortMeaning: string;
  isOpen: boolean;
  isNow: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <li className={isNow ? "bg-gold/10" : undefined}>
      <div className="flex flex-wrap items-start gap-3 px-4 py-3 sm:items-center">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className={`brand min-w-[3.5rem] rounded-lg px-2 py-1 text-left text-lg text-ink underline-offset-4 hover:underline ${
            isOpen ? "bg-white/80" : ""
          }`}
        >
          {year}
        </button>
        <span className="brand text-xl text-ink">{number}</span>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs ${TAG_STYLE[tag]}`}
        >
          {tag}
        </span>
        {isNow ? (
          <span className="rounded-full border border-[var(--line)] bg-white/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-soft">
            Now
          </span>
        ) : null}
        <p className="min-w-[12rem] flex-1 text-sm text-ink-soft">
          {shortMeaning}
        </p>
      </div>
      {isOpen ? (
        <div className="border-t border-[var(--line)] bg-white/60 px-4 py-4">
          {children}
        </div>
      ) : null}
    </li>
  );
}
