"use client";

import { useMemo, useState } from "react";
import { LoShuChart } from "@/components/report/LoShuChart";
import { calculateLoShu } from "@/lib/numerology/loShu";
import {
  buildLoShuArchitecture,
  compareLoShuArchitectures,
} from "@/lib/numerology/loShuArchitecture";
import { isValidDob } from "@/lib/profile/date";

type Props = {
  /** Prefill chart A from the open report */
  defaultDobA?: string;
  labelA?: string;
};

export function LoShuCompare({
  defaultDobA = "",
  labelA = "Chart A",
}: Props) {
  const [dobA, setDobA] = useState(defaultDobA);
  const [dobB, setDobB] = useState("");

  const pair = useMemo(() => {
    if (!isValidDob(dobA) || !isValidDob(dobB)) return null;
    try {
      const a = calculateLoShu(dobA);
      const b = calculateLoShu(dobB);
      const archA = buildLoShuArchitecture(a);
      const archB = buildLoShuArchitecture(b);
      const delta = compareLoShuArchitectures(archA, archB);
      return { a, b, archA, archB, delta };
    } catch {
      return null;
    }
  }, [dobA, dobB]);

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--line)] bg-white/45 p-4 sm:p-5">
      <div>
        <h3 className="text-ink">Compare Lo Shu grids</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Two birth dates → shared engines, catalyst gaps, and tension delta.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm text-ink-soft">
          {labelA}
          <input
            type="date"
            value={dobA}
            onChange={(e) => setDobA(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-ink outline-none ring-gold focus:ring-2"
          />
        </label>
        <label className="block text-sm text-ink-soft">
          Chart B
          <input
            type="date"
            value={dobB}
            onChange={(e) => setDobB(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-ink outline-none ring-gold focus:ring-2"
          />
        </label>
      </div>

      {pair ? (
        <>
          <p className="text-sm leading-6 text-ink-soft">{pair.delta.summary}</p>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
              <p className="mb-2 text-xs uppercase tracking-wider text-ink-soft">
                {labelA}
              </p>
              <LoShuChart loShu={pair.a} showArchitecture={false} />
              <p className="mt-2 text-xs text-ink-soft">
                Flow: {pair.archA.decisionFlowLabel} · Tension{" "}
                {Math.round(pair.archA.tension.position * 100)}%
              </p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
              <p className="mb-2 text-xs uppercase tracking-wider text-ink-soft">
                Chart B
              </p>
              <LoShuChart loShu={pair.b} showArchitecture={false} />
              <p className="mt-2 text-xs text-ink-soft">
                Flow: {pair.archB.decisionFlowLabel} · Tension{" "}
                {Math.round(pair.archB.tension.position * 100)}%
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-ink-soft">
          Enter two valid dates to compare.
        </p>
      )}
    </div>
  );
}
