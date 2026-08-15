"use client";

import { useMemo, useState } from "react";
import { calculateChaldean } from "@/lib/numerology/chaldean";
import { calculatePythagorean } from "@/lib/numerology/pythagorean";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import {
  TRIO_BAND_HINT,
  TRIO_BAND_ICON,
  vedicTrio,
  type TrioBand,
} from "@/lib/numerology/trioMatrix";
import { calculateVedic } from "@/lib/numerology/vedic";

type Props = {
  dateOfBirth: string;
  currentFullName: string;
  vedicPsychic: string;
  vedicDestiny: string;
};

const BAND_WORD: Record<TrioBand, string> = {
  amazing: "Amazing",
  favourable: "Favourable",
  neutral: "Neutral",
  friction: "Friction",
  block: "Heavy",
};

const BAND_RANK: Record<TrioBand, number> = {
  amazing: 5,
  favourable: 4,
  neutral: 3,
  friction: 2,
  block: 1,
};

const BAND_STYLE: Record<TrioBand, string> = {
  amazing: "border-emerald-300 bg-emerald-50 text-emerald-950",
  favourable: "border-teal-200 bg-teal-50 text-teal-950",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  friction: "border-amber-300 bg-amber-50 text-amber-950",
  block: "border-rose-200 bg-rose-50 text-rose-950",
};

function nameSnapshot(fullName: string, dob: string) {
  const pyth = calculatePythagorean(fullName, dob);
  const chald = calculateChaldean(fullName);
  const vedic = calculateVedic(fullName, dob);
  const psychic = reduceToSingleDigit(vedic.psychic);
  const destiny = reduceToSingleDigit(vedic.destiny);
  const name = reduceToSingleDigit(vedic.nameNumber);
  const trio = vedicTrio(psychic, destiny, name);
  return {
    expression: pyth.expression,
    chaldean: chald.nameNumber,
    vedicName: vedic.nameNumber,
    unitName: vedic.unitSystemNameNumber,
    psychic,
    destiny,
    trio,
  };
}

export function NameWhatIfPanel({
  dateOfBirth,
  currentFullName,
  vedicPsychic,
  vedicDestiny,
}: Props) {
  const [trial, setTrial] = useState("");

  const current = useMemo(
    () => nameSnapshot(currentFullName, dateOfBirth),
    [currentFullName, dateOfBirth],
  );

  const trialSnap = useMemo(() => {
    const name = trial.trim();
    if (name.length < 2) return null;
    return nameSnapshot(name, dateOfBirth);
  }, [trial, dateOfBirth]);

  const delta =
    trialSnap != null
      ? BAND_RANK[trialSnap.trio.band] - BAND_RANK[current.trio.band]
      : null;

  const deltaLabel =
    delta == null
      ? null
      : delta > 0
        ? "Trial name scores higher on the Birth×Destiny×Name band"
        : delta < 0
          ? "Current name scores higher on the Birth×Destiny×Name band"
          : "Same band level—compare the digit rows for nuance";

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Type another spelling or name while keeping this birth date. Compare
        Expression, name numbers, and the Vedic Birth×Destiny×Name band. Reflective
        experiment only—not legal naming advice.
      </p>
      <p className="text-xs text-ink-soft">
        Fixed: Psychic {vedicPsychic} · Destiny {vedicDestiny} (from DOB). Only
        the name layers change.
      </p>

      <label className="block text-sm text-ink">
        Trial full name
        <input
          type="text"
          value={trial}
          onChange={(e) => setTrial(e.target.value)}
          placeholder="e.g. an alternate spelling"
          className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink"
          autoComplete="off"
        />
      </label>

      <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-mist/60 text-ink-soft">
            <tr>
              <th className="px-3 py-2 font-medium">Layer</th>
              <th className="px-3 py-2 font-medium">Current</th>
              <th className="px-3 py-2 font-medium">Trial</th>
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["Expression (Pythagorean)", "expression"],
                ["Chaldean name", "chaldean"],
                ["Vedic name", "vedicName"],
                ["Unit name map", "unitName"],
              ] as const
            ).map(([label, key]) => (
              <tr key={key} className="border-t border-[var(--line)]">
                <td className="px-3 py-2 text-ink-soft">{label}</td>
                <td className="brand px-3 py-2 text-ink">{current[key]}</td>
                <td className="brand px-3 py-2 text-ink">
                  {trialSnap ? trialSnap[key] : "—"}
                </td>
              </tr>
            ))}
            <tr className="border-t border-[var(--line)]">
              <td className="px-3 py-2 text-ink-soft">
                Birth×Destiny×Name band
              </td>
              <td className="px-3 py-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${BAND_STYLE[current.trio.band]}`}
                  title={TRIO_BAND_HINT[current.trio.band]}
                >
                  {TRIO_BAND_ICON[current.trio.band]}{" "}
                  {BAND_WORD[current.trio.band]} · {current.trio.label}
                </span>
              </td>
              <td className="px-3 py-2">
                {trialSnap ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${BAND_STYLE[trialSnap.trio.band]}`}
                    title={TRIO_BAND_HINT[trialSnap.trio.band]}
                  >
                    {TRIO_BAND_ICON[trialSnap.trio.band]}{" "}
                    {BAND_WORD[trialSnap.trio.band]} · {trialSnap.trio.label}
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {deltaLabel ? (
        <p className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-sm text-ink">
          {deltaLabel}. {trialSnap?.trio.summary}
        </p>
      ) : null}
    </div>
  );
}
