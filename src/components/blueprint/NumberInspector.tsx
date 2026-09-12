"use client";

import { useState } from "react";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import { plainJob, plainTrait, plainWatch } from "@/lib/numerology/layeredCopy";
import { planetForVedic } from "@/lib/numerology/planets";

export type InspectorTarget = {
  label: string;
  digit: number;
  compound?: number;
  letter?: string;
  occurrences: string[];
  calc?: string[];
};

type Props = {
  target: InspectorTarget | null;
  onClose: () => void;
};

export function NumberInspector({ target, onClose }: Props) {
  const [openCalc, setOpenCalc] = useState(false);
  if (!target) return null;
  const planet = planetForVedic(target.digit);
  const display =
    target.compound && target.compound !== target.digit
      ? `${target.compound}/${target.digit}`
      : target.letter
        ? `${target.letter} / ${target.digit}`
        : String(target.digit);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="number-inspector-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[var(--line)] bg-paper p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
          {target.label}
        </p>
        <h2 id="number-inspector-title" className="brand mt-1 text-3xl text-ink">
          {display}
        </h2>
        <div className="mt-3 flex items-center gap-2">
          <PlanetIcon planet={planet} size="sm" showName />
        </div>
        <p className="mt-3 text-sm leading-6 text-ink">
          Strength: {plainTrait(target.digit)}.
        </p>
        <p className="mt-1 text-sm leading-6 text-ink-soft">
          Potential friction: {plainWatch(target.digit)}.
        </p>
        <p className="mt-1 text-sm leading-6 text-ink">
          Use it: {plainJob(target.digit)}.
        </p>
        {target.occurrences.length ? (
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              In your profile
            </p>
            <ul className="mt-1 space-y-1 text-sm text-ink">
              {target.occurrences.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {target.calc?.length ? (
          <div className="mt-4">
            <button
              type="button"
              className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-sm text-ink"
              onClick={() => setOpenCalc((v) => !v)}
            >
              {openCalc ? "Hide calculation" : "How is this calculated?"}
            </button>
            {openCalc ? (
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs text-ink-soft">
                {target.calc.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            ) : null}
          </div>
        ) : null}
        <button
          type="button"
          className="btn-tactile mt-5 w-full rounded-full bg-ink px-4 py-2 text-sm text-paper"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
