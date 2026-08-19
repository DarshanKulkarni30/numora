"use client";

import { useMemo, useState } from "react";
import { LoShuChart } from "@/components/report/LoShuChart";
import { LoShuCompare } from "@/components/report/LoShuCompare";
import { calculateLoShu } from "@/lib/numerology/loShu";
import {
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import { parseDob } from "@/lib/numerology/reduce";
import { isValidDob } from "@/lib/profile/date";

export function LoShuDemo() {
  const [dob, setDob] = useState("");

  const result = useMemo(() => {
    if (!isValidDob(dob)) return null;
    try {
      const loShu = calculateLoShu(dob);
      const { day, month, year } = parseDob(dob);
      const bn = vedicPsychicFromDob(dob);
      const dn = vedicDestinyFromDob(dob);
      const dateDigits = `${day}${month}${year}`
        .split("")
        .filter((d) => d !== "0")
        .join(" · ");
      return { loShu, bn, dn, dateDigits, day, month, year };
    } catch {
      return null;
    }
  }, [dob]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <label htmlFor="learn-loshu-dob" className="block text-sm text-ink-soft">
          Date of birth
        </label>
        <input
          id="learn-loshu-dob"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="mt-1 w-full max-w-xs rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
        />
        {result ? (
          <div className="mt-4 space-y-2 text-sm leading-6 text-ink-soft">
            <p>
              Date digits (zeros skipped):{" "}
              <span className="font-mono text-ink">{result.dateDigits}</span>
            </p>
            <p>
              <span className="font-medium text-ink">BN</span> (Psychic) = day{" "}
              {result.day} →{" "}
              <span className="brand text-ink">{result.bn}</span>
              {" · "}
              <span className="font-medium text-ink">DN</span> (Destiny) ={" "}
              {result.day}+{result.month}+{result.year} →{" "}
              <span className="brand text-ink">{result.dn}</span>
            </p>
            <p className="text-xs">
              Both BN and DN are also placed on the Lo Shu grid (common Indian
              practice)—reflective only.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-soft">
            Pick a date to build the Lo Shu grid with BN and DN.
          </p>
        )}
      </div>

      {result ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <LoShuChart loShu={result.loShu} dateOfBirth={dob} />
        </div>
      ) : null}

      <LoShuCompare defaultDobA={dob} labelA="Your chart" />
    </div>
  );
}
