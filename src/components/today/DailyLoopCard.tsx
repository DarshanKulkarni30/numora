"use client";

import { useMemo, useState } from "react";
import { buildDailyLoop } from "@/lib/numerology/dailyLoop";
import { isValidDob } from "@/lib/profile/date";

type Props = {
  natalName: string;
  dateOfBirth: string;
  compact?: boolean;
};

const CHECKIN_KEY = "numora-personal-day-checkin";

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function DailyLoopCard({ natalName, dateOfBirth, compact = false }: Props) {
  const loop = useMemo(() => {
    if (!isValidDob(dateOfBirth)) return null;
    return buildDailyLoop({ natalName, dateOfBirth });
  }, [natalName, dateOfBirth]);

  const [checked, setChecked] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(CHECKIN_KEY) === todayKey();
    } catch {
      return false;
    }
  });

  if (!loop) return null;

  function onCheckIn() {
    try {
      window.localStorage.setItem(CHECKIN_KEY, todayKey());
    } catch {
      /* ignore */
    }
    setChecked(true);
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5">
      <p className="text-sm uppercase tracking-[0.18em] text-gold-deep">
        Today’s Personal Day
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand text-4xl text-ink">{loop.today.personalDay}</p>
          <p className="text-sm text-ink-soft">{loop.today.trait}</p>
        </div>
        <p className="text-xs text-ink-soft">
          Month {loop.today.personalMonth} · Year {loop.today.personalYear}
        </p>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{loop.checkInPrompt}</p>

      {!compact ? (
        <>
          <div className="mt-4 grid grid-cols-7 gap-1">
            {loop.week.map((d) => (
              <div
                key={`${d.weekday}-${d.asOf}`}
                className={`rounded-xl border px-1 py-2 text-center ${
                  d.isToday
                    ? "border-gold/50 bg-gold/10"
                    : "border-[var(--line)] bg-white/55"
                }`}
              >
                <p className="text-[10px] uppercase text-ink-soft">{d.weekday}</p>
                <p className="brand text-lg text-ink">{d.personalDay}</p>
                <p className="text-[10px] text-ink-soft">{d.asOf}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-ink-soft">
            {loop.essence.summary}
          </p>
        </>
      ) : null}

      <button
        type="button"
        onClick={onCheckIn}
        disabled={checked}
        className="btn-tactile mt-4 rounded-full bg-ink px-4 py-2 text-sm text-paper disabled:cursor-not-allowed disabled:opacity-60"
      >
        {checked ? "Noted for today" : "Mark today’s number"}
      </button>
      <p className="mt-3 text-xs leading-5 text-ink-soft">{loop.disclaimer}</p>
    </div>
  );
}
