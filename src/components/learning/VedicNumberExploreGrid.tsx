"use client";

import { useState } from "react";
import {
  VEDIC_DIGIT_THEMES,
  vedicDigitTheme,
} from "@/lib/numerology/vedicNumberThemes";
import { LearningConceptLink } from "@/components/learning/LearningConceptLink";

/** 3×3 explore grid for Vedic digits 1–9 (Learning). */
export function VedicNumberExploreGrid() {
  const [selected, setSelected] = useState(1);
  const theme = vedicDigitTheme(selected);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg text-ink">Explore number meanings</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Indian-style Vedic digits often used for Psychic (birth day) and
          Destiny (full date). Tap a number—reflective themes only, not
          predictions.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
          const t = VEDIC_DIGIT_THEMES[n];
          const active = selected === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setSelected(n)}
              className={`btn-tactile rounded-2xl border px-3 py-4 text-center transition ${
                active
                  ? "border-ink bg-ink text-paper shadow-sm"
                  : "border-[var(--line)] bg-white/70 text-ink hover:-translate-y-px hover:shadow-sm"
              }`}
            >
              <span
                className={`brand block text-2xl ${
                  active ? "text-sand" : "text-gold-deep"
                }`}
              >
                {n}
              </span>
              <span
                className={`mt-1 block text-xs ${
                  active ? "text-paper/80" : "text-ink-soft"
                }`}
              >
                {t.keyword}
              </span>
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-4">
        <p className="text-sm font-medium text-ink">
          {selected} · {theme.keyword}{" "}
          <span className="font-normal text-ink-soft">({theme.planet})</span>
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          <span className="font-medium text-ink">As Psychic:</span>{" "}
          {theme.psychicFocus}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          <span className="font-medium text-ink">As Destiny:</span>{" "}
          {theme.destinyFocus}
        </p>
        <ul className="mt-3 list-inside list-disc text-sm text-ink-soft">
          {theme.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-soft">
          Watch: {theme.watchouts.join(" · ")}
        </p>
        <p className="mt-2 text-xs text-ink-soft">Practice: {theme.practice}</p>
        <p className="mt-3 text-xs">
          <LearningConceptLink conceptKey="vedic-psychic" />
          {" · "}
          <LearningConceptLink conceptKey="vedic-destiny" />
        </p>
      </div>
    </div>
  );
}
