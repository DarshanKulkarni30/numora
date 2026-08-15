"use client";

import { useState } from "react";
import {
  TRIO_BAND_HINT,
  TRIO_NOTE,
  chaldeanTableForBirth,
  chaldeanTrio,
  pythagoreanTrio,
  trioCodeBand,
  trioCodeLabel,
  vedicTableForBirth,
  vedicTrio,
  type TrioBand,
  type TrioSystem,
} from "@/lib/numerology/trioMatrix";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";

type Props = {
  vedicBirth: string;
  vedicDestiny: string;
  vedicName: string;
  chaldeanName: string;
  pythBirth: string;
  pythDestiny: string;
  pythName: string;
  compactVedicOnly?: boolean;
  variant?: "light" | "dark";
};

const BAND_STYLE: Record<TrioBand, string> = {
  amazing: "border-emerald-300 bg-emerald-50 text-emerald-950",
  favourable: "border-teal-200 bg-teal-50 text-teal-950",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  friction: "border-amber-300 bg-amber-50 text-amber-950",
  block: "border-rose-200 bg-rose-50 text-rose-950",
};

const BAND_CELL: Record<TrioBand, string> = {
  amazing: "bg-emerald-100 text-emerald-950",
  favourable: "bg-teal-50 text-teal-900",
  neutral: "bg-slate-50 text-slate-700",
  friction: "bg-amber-50 text-amber-950",
  block: "bg-rose-50 text-rose-900",
};

const BAND_WORD: Record<TrioBand, string> = {
  amazing: "Amazing",
  favourable: "Favourable",
  neutral: "Neutral",
  friction: "Friction",
  block: "Heavy",
};

function digits(raw: string): { raw: string; core: number } {
  const n = Number(raw);
  return { raw, core: Number.isFinite(n) ? reduceToSingleDigit(n) : 1 };
}

export function TrioFitPanel({
  vedicBirth,
  vedicDestiny,
  vedicName,
  chaldeanName,
  pythBirth,
  pythDestiny,
  pythName,
  compactVedicOnly = false,
  variant = "light",
}: Props) {
  const [tab, setTab] = useState<TrioSystem>("vedic");
  const [showGrid, setShowGrid] = useState(false);

  const vBirth = digits(vedicBirth);
  const vDest = digits(vedicDestiny);
  const vName = digits(vedicName);
  const cName = digits(chaldeanName);
  const pBirth = digits(pythBirth);
  const pDest = digits(pythDestiny);
  const pName = digits(pythName);

  const vedic = vedicTrio(vBirth.core, vDest.core, vName.core);
  const chaldean = chaldeanTrio(vBirth.core, vDest.core, cName.core);
  const pyth = pythagoreanTrio(pBirth.core, pDest.core, pName.core);

  const dark = variant === "dark";
  const wrap = dark
    ? "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-paper"
    : "space-y-4";

  if (compactVedicOnly) {
    return (
      <div className={wrap}>
        <p className={`text-[10px] uppercase tracking-wider ${dark ? "text-sand" : "text-ink-soft"}`}>
          Birth × Destiny × Name
        </p>
        <p className={`mt-1 text-sm ${dark ? "text-paper" : "text-ink"}`}>
          Psychic {vBirth.raw} · Destiny {vDest.raw} · Name {vName.raw}
          {vName.raw !== String(vName.core) ? ` → ${vName.core}` : ""}
        </p>
        <p
          className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs ${BAND_STYLE[vedic.band]}`}
        >
          {BAND_WORD[vedic.band]} · {vedic.label}
        </p>
        <p className={`mt-2 text-xs leading-5 ${dark ? "text-paper/70" : "text-ink-soft"}`}>
          {vedic.summary}
        </p>
      </div>
    );
  }

  const active =
    tab === "vedic" ? vedic : tab === "chaldean" ? chaldean : pyth;

  const table =
    tab === "vedic"
      ? vedicTableForBirth(vBirth.core)
      : tab === "chaldean"
        ? chaldeanTableForBirth(vBirth.core)
        : null;

  const highlight =
    tab === "vedic"
      ? { d: vDest.core, n: vName.core }
      : tab === "chaldean"
        ? { d: vDest.core, n: cName.core }
        : { d: pDest.core, n: pName.core };

  const numberLine =
    tab === "vedic"
      ? `Psychic ${vBirth.raw} · Destiny ${vDest.raw} · Name ${vName.raw}`
      : tab === "chaldean"
        ? `Birth day ${vBirth.raw} · Destiny ${vDest.raw} · Chaldean name ${cName.raw}${
            cName.raw !== String(cName.core) ? ` → ${cName.core}` : ""
          }`
        : `Birth day ${pBirth.raw} · Life Path ${pDest.raw} · Expression ${pName.raw}${
            pName.raw !== String(pName.core) ? ` → ${pName.core}` : ""
          }`;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        How Birth, Destiny, and Name sit together in each system. This is not
        the partner radar.
      </p>

      <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
        {(
          [
            ["vedic", "Vedic"],
            ["chaldean", "Chaldean"],
            ["pythagorean", "Pythagorean"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setShowGrid(false);
            }}
            className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
              tab === id ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-sm text-ink">
        {numberLine}
      </p>

      <div className={`rounded-xl border px-4 py-3 ${BAND_STYLE[active.band]}`}>
        <p className="text-[10px] uppercase tracking-wider opacity-80">
          Your cell
        </p>
        <p className="mt-1 font-medium">
          {BAND_WORD[active.band]} · {active.label}
        </p>
        <p className="mt-1 text-sm leading-6">{active.summary}</p>
      </div>

      {tab === "pythagorean" ? (
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm text-ink-soft">
          <p className="font-medium text-ink">{pyth.patternLabel}</p>
          <p className="mt-1">{pyth.patternEffect}</p>
          <p className="mt-2">{pyth.alignNote}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pyth.favNames.map((n) => (
              <span
                key={`f-${n}`}
                className={`rounded-full border px-2 py-0.5 text-xs ${
                  n === pName.core
                    ? "border-emerald-400 bg-emerald-100 text-emerald-950"
                    : "border-emerald-200 bg-emerald-50 text-emerald-900"
                }`}
              >
                Often easier · {n}
              </span>
            ))}
            {pyth.unfavNames.map((n) => (
              <span
                key={`u-${n}`}
                className={`rounded-full border px-2 py-0.5 text-xs ${
                  n === pName.core
                    ? "border-rose-300 bg-rose-100 text-rose-950"
                    : "border-rose-200 bg-rose-50 text-rose-900"
                }`}
              >
                Needs care · {n}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
          <button
            type="button"
            className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-sm text-ink"
            onClick={() => setShowGrid((v) => !v)}
          >
            {showGrid ? "Hide" : "View"} Birth {vBirth.core} table
          </button>
          {showGrid && table ? (
            <div className="mt-3 overflow-x-auto">
              <p className="mb-2 text-xs text-ink-soft">
                Rows = Destiny · columns = Name. Your cell is outlined.
              </p>
              <table className="w-full min-w-[22rem] border-collapse text-center text-[11px]">
                <thead>
                  <tr>
                    <th className="border-b border-[var(--line)] p-1 text-left font-medium text-ink">
                      D \ N
                    </th>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                      <th
                        key={n}
                        className={`border-b border-[var(--line)] p-1 font-medium text-ink ${
                          n === highlight.n ? "bg-ink/5" : ""
                        }`}
                      >
                        {n}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.map((row, di) => {
                    const destinyN = di + 1;
                    return (
                      <tr key={destinyN}>
                        <td className="border-b border-[var(--line)] p-1 text-left font-medium text-ink">
                          {destinyN}
                        </td>
                        {row.map((code, ni) => {
                          const nameN = ni + 1;
                          const isYou =
                            destinyN === highlight.d && nameN === highlight.n;
                          const band = trioCodeBand(code);
                          return (
                            <td
                              key={nameN}
                              title={trioCodeLabel(code)}
                              className={`border-b border-[var(--line)] p-1 ${BAND_CELL[band]} ${
                                isYou ? "ring-2 ring-ink ring-inset font-semibold" : ""
                              }`}
                            >
                              {trioCodeLabel(code).slice(0, 3)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      )}

      <div className="rounded-xl border border-[var(--line)] bg-white/50 px-3 py-3 text-xs leading-5 text-ink-soft">
        <p className="font-medium text-ink">Five-band scale</p>
        <ul className="mt-2 space-y-1.5">
          {(Object.keys(TRIO_BAND_HINT) as TrioBand[]).map((b) => (
            <li key={b}>
              <strong className="text-ink">{BAND_WORD[b]}</strong> —{" "}
              {TRIO_BAND_HINT[b]}
            </li>
          ))}
        </ul>
        <p className="mt-3">{TRIO_NOTE}</p>
      </div>
    </div>
  );
}
