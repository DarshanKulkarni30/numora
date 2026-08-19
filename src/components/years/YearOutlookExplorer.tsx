"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { personalYearCycleAt } from "@/lib/numerology/cycles";
import {
  LAND_LABEL,
  WESTERN_BIRTHDAY_NOTE,
  WESTERN_CALENDAR_NOTE,
  westernYearOutlook,
  type LandBand,
  type WesternYearAnchor,
} from "@/lib/numerology/personalYearOutlook";
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
  yearsFromBirthToAge90,
  type YearSystemTab,
} from "@/lib/numerology/yearPage";
import type { PersonRecord } from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";
import { parseDob } from "@/lib/numerology/reduce";

type Props = {
  people: PersonRecord[];
  initialTab?: YearSystemTab;
  /** From report deep-link (`?dob=`). */
  initialDob?: string;
  /** From report deep-link (`?name=`) — disambiguates shared DOBs. */
  initialName?: string;
};

const TAG_STYLE: Record<YearTag, string> = {
  Favourable: "border-teal-200 bg-teal-50 text-teal-950",
  Neutral: "border-slate-200 bg-slate-50 text-slate-800",
  Challenging: "border-amber-300 bg-amber-50 text-amber-950",
};

const LAND_STYLE: Record<LandBand, string> = {
  lighter: "border-teal-200 bg-teal-50 text-teal-950",
  mixed: "border-slate-200 bg-slate-50 text-slate-800",
  heavier: "border-amber-300 bg-amber-50 text-amber-950",
};

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

function personKey(p: PersonRecord) {
  return `${p.sort_order}-${p.full_name}`;
}

function resolveInitialKey(
  selectable: PersonRecord[],
  initialDob?: string,
  initialName?: string,
): string {
  const dob = initialDob?.trim();
  const name = initialName?.trim().toLowerCase();
  if (dob) {
    const byDob = selectable.filter((p) => p.date_of_birth === dob);
    if (byDob.length === 1) return personKey(byDob[0]);
    if (byDob.length > 1 && name) {
      const match = byDob.find(
        (p) =>
          p.full_name.trim().toLowerCase() === name ||
          p.preferred_name.trim().toLowerCase() === name,
      );
      if (match) return personKey(match);
    }
    if (byDob[0]) return personKey(byDob[0]);
  }
  const self = selectable.find((p) => p.is_self);
  const first = self ?? selectable[0];
  return first ? personKey(first) : "";
}

export function YearOutlookExplorer({
  people,
  initialTab = "western",
  initialDob,
  initialName,
}: Props) {
  const selectable = useMemo(
    () =>
      people.filter(
        (p) => (p.full_name || p.preferred_name) && isValidDob(p.date_of_birth),
      ),
    [people],
  );

  const [selectedKey, setSelectedKey] = useState(() =>
    resolveInitialKey(selectable, initialDob, initialName),
  );  const [tab, setTab] = useState<YearSystemTab>(initialTab);
  const [westernAnchor, setWesternAnchor] =
    useState<WesternYearAnchor>("birthday");
  const nowYear = new Date().getFullYear();
  const [openYear, setOpenYear] = useState<number | "default" | null>(
    "default",
  );
  const [showPast, setShowPast] = useState(false);

  const selected = selectable.find((p) => personKey(p) === selectedKey);
  const dob = selected?.date_of_birth ?? "";

  const years = useMemo(() => {
    if (!selected || !dob) return [];
    const { year } = parseDob(dob);
    return yearsFromBirthToAge90(year);
  }, [selected, dob]);

  const birthYear = useMemo(() => {
    if (!dob) return null;
    try {
      return parseDob(dob).year;
    } catch {
      return null;
    }
  }, [dob]);

  const currentKeyYear = useMemo(() => {
    if (!dob) return nowYear;
    try {
      if (tab === "western" && westernAnchor === "birthday") {
        return personalYearCycleAt(dob, new Date()).calendarYearUsed;
      }
    } catch {
      return nowYear;
    }
    return nowYear;
  }, [dob, tab, westernAnchor, nowYear]);

  const { pastYears, visibleYears } = useMemo(() => {
    const current = years.includes(currentKeyYear) ? currentKeyYear : null;
    const past = years.filter((y) => y < currentKeyYear);
    const future = years.filter((y) => y > currentKeyYear);
    const featured = current ?? future[0] ?? past[past.length - 1] ?? null;
    const hiddenPast = past.filter((y) => y !== featured);
    const visible = [
      ...(featured != null && featured <= currentKeyYear ? [featured] : []),
      ...future,
    ];
    return { pastYears: hiddenPast, visibleYears: visible };
  }, [years, currentKeyYear]);

  const expandedYear = useMemo(() => {
    if (!years.length) return null;
    if (openYear === "default") return defaultExpandedYear(years, currentKeyYear);
    return openYear;
  }, [years, openYear, currentKeyYear]);

  const pastOpen = showPast || (expandedYear != null && pastYears.includes(expandedYear));

  function renderEntry(year: number) {
    const age = birthYear != null ? year - birthYear : null;
    return (
      <YearEntry
        key={`${tab}-${westernAnchor}-${year}`}
        year={year}
        age={age}
        dob={dob}
        fullName={selected?.full_name}
        tab={tab}
        westernAnchor={westernAnchor}
        isOpen={year === expandedYear}
        isNow={year === currentKeyYear}
        onToggle={() => setOpenYear(year === expandedYear ? null : year)}
      />
    );
  }

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
                setShowPast(false);
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
                Current year is open below. Click any other year for the same
                collapsible reading. Earlier years stay hidden until you ask
                for them.
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
                onClick={() => {
                  setTab(id);
                  setOpenYear("default");
                  setShowPast(false);
                }}
                className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
                  tab === id
                    ? "bg-ink text-paper shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === "western" ? (
            <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
              {(
                [
                  ["birthday", "Birthday cycle"],
                  ["calendar", "Calendar year"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setWesternAnchor(id);
                    setOpenYear("default");
                    setShowPast(false);
                  }}
                  className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
                    westernAnchor === id
                      ? "bg-ink text-paper"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          <p className="text-sm leading-6 text-ink-soft">
            {tab === "vedic"
              ? VEDIC_YEAR_METHOD_NOTE
              : westernAnchor === "birthday"
                ? WESTERN_BIRTHDAY_NOTE
                : WESTERN_CALENDAR_NOTE}
            {tab === "western" ? (
              <span className="mt-2 block text-xs">{WESTERN_YEAR_METHOD_NOTE}</span>
            ) : null}
          </p>

          {selected && years.length > 0 ? (
            <div className="space-y-3">
              {pastYears.length > 0 ? (
                <button
                  type="button"
                  aria-expanded={pastOpen}
                  onClick={() => {
                    const next = !pastOpen;
                    setShowPast(next);
                    if (!next && expandedYear != null && pastYears.includes(expandedYear)) {
                      setOpenYear("default");
                    }
                  }}
                  className="btn-tactile w-full rounded-2xl border border-[var(--line)] bg-white/80 px-4 py-3 text-left text-sm text-ink sm:w-auto"
                >
                  {pastOpen
                    ? "Hide previous years"
                    : `Show previous years (${pastYears.length})`}
                </button>
              ) : null}

              {pastOpen && pastYears.length > 0 ? (
                <ol className="divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70">
                  {pastYears.map(renderEntry)}
                </ol>
              ) : null}

              {visibleYears.length > 0 ? (
                <ol className="divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70">
                  {visibleYears.map(renderEntry)}
                </ol>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function YearEntry({
  year,
  age,
  dob,
  fullName,
  tab,
  westernAnchor,
  isOpen,
  isNow,
  onToggle,
}: {
  year: number;
  age: number | null;
  dob: string;
  fullName?: string;
  tab: YearSystemTab;
  westernAnchor: WesternYearAnchor;
  isOpen: boolean;
  isNow: boolean;
  onToggle: () => void;
}) {
  if (tab === "vedic") {
    const breakdown = projectedYearBreakdown(dob, year);
    const meta = projectedYearMeta(breakdown.number);
    return (
      <YearRow
        yearLabel={String(year)}
        age={age}
        number={breakdown.number}
        tag={meta.tag}
        tagClass={TAG_STYLE[meta.tag]}
        shortMeaning={meta.shortMeaning}
        isOpen={isOpen}
        isNow={isNow}
        onToggle={onToggle}
      >
        <YearDetail
          intro={`Ruled by ${meta.planet}. ${meta.theme}`}
          points={meta.details}
          practice={meta.practice}
          calc={[
            `Month ${breakdown.month} + day ${breakdown.day} + last two digits ${breakdown.yearDigits} + ${breakdown.weekdayLabel} (${breakdown.weekdayDigit}) = ${breakdown.compound}`,
            `Reduce to ${breakdown.number}.`,
          ]}
        />
      </YearRow>
    );
  }

  const outlook = westernYearOutlook({
    dob,
    fullName,
    anchor: westernAnchor,
    year,
  });
  const pin = outlook.pinnacle;
  const pinCopy = outlook.pinnacleCopy;
  const debtLine =
    outlook.debts.length > 0
      ? outlook.debts
          .map((d) => `${d.label} (${d.source === "birth-day" ? "birth day" : "life path"}): ${d.lesson}`)
          .join(" ")
      : null;

  return (
    <YearRow
      yearLabel={
        outlook.rangeLabel
          ? outlook.rangeLabel
          : String(year)
      }
      age={age}
      number={outlook.number}
      tag={outlook.nature.nature}
      tagClass={LAND_STYLE[outlook.land.band]}
      shortMeaning={outlook.nature.short}
      isOpen={isOpen}
      isNow={isNow}
      onToggle={onToggle}
    >
      <YearDetail
        intro={`${LAND_LABEL[outlook.land.band]}. ${outlook.nature.typical}`}
        points={[
          outlook.land.resonanceLine,
          `Pinnacle ${pin.id} (${pin.number} · ${pinCopy.name}): ${pinCopy.theme} Shadow: ${pinCopy.shadow}`,
          ...(debtLine ? [`Karmic: ${debtLine}`] : []),
          ...(outlook.land.momentNote ? [outlook.land.momentNote] : []),
        ]}
        practice={outlook.nature.practice}
        calc={outlook.calcLines}
      />
    </YearRow>
  );
}

function YearDetail({
  intro,
  points,
  practice,
  calc,
}: {
  intro?: string;
  points: string[];
  practice: string;
  calc: string[];
}) {
  return (
    <>
      {intro ? <p className="text-sm text-ink">{intro}</p> : null}
      <ul className={`${intro ? "mt-3" : ""} space-y-1.5 text-sm text-ink-soft`}>
        {points.map((line) => (
          <li key={line}>· {line}</li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-ink">Practice: {practice}</p>
      <ol className="mt-4 space-y-1 text-xs text-ink-soft">
        {calc.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ol>
    </>
  );
}

function YearRow({
  yearLabel,
  age,
  number,
  tag,
  tagClass,
  shortMeaning,
  isOpen,
  isNow,
  onToggle,
  children,
}: {
  yearLabel: string;
  age: number | null;
  number: number;
  tag: string;
  tagClass: string;
  shortMeaning: string;
  isOpen: boolean;
  isNow: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <li className={isNow ? "bg-gold/10" : undefined}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full flex-wrap items-start gap-3 px-4 py-3 text-left sm:items-center"
      >
        <span
          className={`brand min-w-[3.5rem] max-w-[14rem] rounded-lg px-2 py-1 text-sm text-ink sm:text-lg ${
            isOpen ? "bg-white/80" : ""
          }`}
        >
          {yearLabel}
        </span>
        {age != null ? (
          <span className="min-w-[3.25rem] text-sm text-ink-soft">
            Age {age}
          </span>
        ) : null}
        <span className="brand text-xl text-ink">{number}</span>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-xs ${tagClass}`}
        >
          {tag}
        </span>
        {isNow ? (
          <span className="rounded-full border border-[var(--line)] bg-white/80 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-soft">
            Now
          </span>
        ) : null}
        <span className="min-w-[12rem] flex-1 text-sm text-ink-soft">
          {shortMeaning}
        </span>
        <span className="text-xs text-ink-soft" aria-hidden>
          {isOpen ? "Hide" : "Show"}
        </span>
      </button>
      {isOpen ? (
        <div className="border-t border-[var(--line)] bg-white/60 px-4 py-4">
          {children}
        </div>
      ) : null}
    </li>
  );
}
