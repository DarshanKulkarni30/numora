"use client";

import { useMemo, useState } from "react";
import {
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import { vedicDigitTheme } from "@/lib/numerology/vedicNumberThemes";
import { parseDob } from "@/lib/numerology/reduce";
import { isValidDob } from "@/lib/profile/date";

export function DobPsychicDestinyDemo() {
  const [dob, setDob] = useState("");

  const steps = useMemo(() => {
    if (!isValidDob(dob)) return null;
    const { day, month, year } = parseDob(dob);
    const psychic = vedicPsychicFromDob(dob);
    const destiny = vedicDestinyFromDob(dob);
    const digitSum = String(day + month + year)
      .split("")
      .join(" + ");
    return {
      day,
      month,
      year,
      sum: day + month + year,
      digitSum,
      psychic,
      destiny,
    };
  }, [dob]);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <label htmlFor="learn-dob-pd" className="block text-sm text-ink-soft">
        Date of birth
      </label>
      <input
        id="learn-dob-pd"
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="mt-1 w-full max-w-xs rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
      />
      {steps ? (
        <div className="mt-4 space-y-3 text-sm leading-6 text-ink-soft">
          <p>
            <span className="font-medium text-ink">Psychic</span> = birth day{" "}
            <span className="brand text-ink">{steps.day}</span>
            {steps.day > 9 ? (
              <>
                {" "}
                reduced → <span className="brand text-ink">{steps.psychic}</span>
              </>
            ) : (
              <>
                {" "}
                → <span className="brand text-ink">{steps.psychic}</span>
              </>
            )}
            {" · "}
            <span className="text-gold-deep">
              {vedicDigitTheme(steps.psychic).keyword}
            </span>
          </p>
          <p className="text-xs">
            {vedicDigitTheme(steps.psychic).psychicFocus}
          </p>
          <p>
            <span className="font-medium text-ink">Destiny</span> = {steps.day} +{" "}
            {steps.month} + {steps.year} ={" "}
            <span className="brand text-ink">{steps.sum}</span>
            {steps.sum > 9 ? (
              <>
                {" "}
                → reduce digits →{" "}
                <span className="brand text-ink">{steps.destiny}</span>
              </>
            ) : (
              <>
                {" "}
                → <span className="brand text-ink">{steps.destiny}</span>
              </>
            )}
            {" · "}
            <span className="text-gold-deep">
              {vedicDigitTheme(steps.destiny).keyword}
            </span>
          </p>
          <p className="text-xs">
            {vedicDigitTheme(steps.destiny).destinyFocus}
          </p>
          <p className="text-xs">
            Reflective Vedic (Indian-style) tradition only—not medical or
            predictive advice. Keywords: Leader, Harmony, Creativity, Stability,
            Freedom, Care, Wisdom, Success, Humanity.
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-soft">
          Pick a date to see Psychic and Destiny step by step.
        </p>
      )}
    </div>
  );
}
