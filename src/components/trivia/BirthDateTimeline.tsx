"use client";

import {
  birthYear,
  personDiscoveryKey,
  personInitials,
  type DiscoveryPerson,
} from "@/lib/trivia/discovery";
import { dayMonthKey } from "@/lib/trivia/match";

type Props = {
  rows: DiscoveryPerson[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  viewerDob?: string;
  compact?: boolean;
};

export function BirthDateTimeline({
  rows,
  selectedKey,
  onSelect,
  viewerDob,
  compact = false,
}: Props) {
  const dateGlyph = viewerDob ? dayMonthKey(viewerDob) : null;

  if (!rows.length) {
    return (
      <p className="mt-2 text-sm text-ink-soft">
        No one in the current bank shares this day and month.
      </p>
    );
  }

  return (
    <div className="mt-3">
      {dateGlyph ? (
        <p className="mb-2 text-xs uppercase tracking-wider text-ink-soft">
          Date glyph {dateGlyph}
        </p>
      ) : null}
      <ol className="birth-timeline flex gap-3 overflow-x-auto pb-2">
        {rows.map((row) => {
          const key = personDiscoveryKey(row.person);
          const selected = selectedKey === key;
          const year = birthYear(row.person.dob);
          const glow = row.exact > 0;
          return (
            <li key={key} className="shrink-0 snap-start">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(key)}
                className={`birth-timeline-node w-[11.5rem] rounded-2xl border p-3 text-left ${
                  selected
                    ? "border-gold bg-white ring-2 ring-gold/45"
                    : "border-[var(--line)] bg-white/70"
                } ${glow ? "birth-timeline-node--match" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-ink"
                    style={{
                      background: `linear-gradient(160deg, ${row.toneHex}55, var(--mist))`,
                    }}
                  >
                    {personInitials(row.person.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{row.person.name}</p>
                    <p className="text-[11px] text-ink-soft">{year || row.person.dob}</p>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] text-ink-soft">
                  {row.person.note}
                </p>
                <p className="brand mt-2 text-xs text-ink">
                  {row.person.lifePath} · {row.person.destiny} · {row.person.psychic}
                </p>
                {!compact ? (
                  <p className="mt-1 text-[11px] text-ink">{row.insight}</p>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
