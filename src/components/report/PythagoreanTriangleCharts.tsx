"use client";

import { useState } from "react";
import { PythagoreanBirthPyramid } from "@/components/report/PythagoreanBirthPyramid";
import { PythagoreanTrigonum } from "@/components/report/PythagoreanTrigonum";

type Mode = "trigonum" | "pyramid";

type Props = {
  dateOfBirth: string;
};

/**
 * Birth charts tab: toggle inverted Trigonum vs upright Birth Pyramid.
 */
export function PythagoreanTriangleCharts({ dateOfBirth }: Props) {
  const [mode, setMode] = useState<Mode>("trigonum");

  return (
    <div className="space-y-4">
      <div className="flex rounded-full border border-[var(--line)] bg-white/50 p-1">
        <button
          type="button"
          onClick={() => setMode("trigonum")}
          className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
            mode === "trigonum"
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Trigonum (inverted)
        </button>
        <button
          type="button"
          onClick={() => setMode("pyramid")}
          className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
            mode === "pyramid"
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Birth Pyramid (upright)
        </button>
      </div>

      {mode === "trigonum" ? (
        <PythagoreanTrigonum dateOfBirth={dateOfBirth} />
      ) : (
        <PythagoreanBirthPyramid dateOfBirth={dateOfBirth} />
      )}
    </div>
  );
}
