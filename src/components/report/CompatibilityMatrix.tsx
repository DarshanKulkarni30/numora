"use client";

import { useState } from "react";
import { TONE_HINT, type CompatTone } from "@/lib/numerology/compatibility";
import {
  masterNumberNote,
  reduceToSingleDigit,
} from "@/lib/numerology/dateNumbers";

type Row = {
  partnerLifePath: number;
  romantic: string;
  business: string;
  friendship: string;
};

type SystemMatrix = {
  rawNumber: string;
  matrix: Row[];
  disclaimer: string;
};

type Props = {
  pythagorean: SystemMatrix;
  vedic: SystemMatrix;
  hideRomantic?: boolean;
};

function TonePill({ tone }: { tone: string }) {
  if (tone === "—") {
    return <span className="text-ink-soft">—</span>;
  }
  const hint = TONE_HINT[tone as CompatTone] ?? tone;
  const color =
    tone === "Supportive"
      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
      : tone === "Growth-oriented"
        ? "bg-amber-50 text-amber-950 border-amber-200"
        : "bg-slate-50 text-slate-800 border-slate-200";
  return (
    <span
      title={hint}
      className={`inline-block rounded-full border px-2 py-0.5 text-xs ${color}`}
    >
      {tone}
    </span>
  );
}

function MatrixTable({
  systemLabel,
  numberLabel,
  rawNumber,
  matrix,
  disclaimer,
  hideRomantic,
}: {
  systemLabel: string;
  numberLabel: string;
  rawNumber: string;
  matrix: Row[];
  disclaimer: string;
  hideRomantic: boolean;
}) {
  const raw = Number(rawNumber);
  const reduced = Number.isFinite(raw) ? reduceToSingleDigit(raw) : rawNumber;
  const masterNote = masterNumberNote(rawNumber);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        {systemLabel}: your {numberLabel}{" "}
        <span className="brand text-ink">{rawNumber}</span>
        {masterNote ? (
          <>
            {" "}
            → traced as <span className="brand text-ink">{reduced}</span> in
            this 1–9 table
          </>
        ) : null}
        . Partner columns are 1–9. Hover a tone for a short note.
      </p>
      {masterNote ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm text-amber-950">
          {masterNote}
        </p>
      ) : null}
      <p className="text-xs leading-5 text-ink-soft/80">{disclaimer}</p>
      <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-mist/60 text-ink-soft">
            <tr>
              <th className="px-3 py-2 font-medium">Partner #</th>
              {!hideRomantic ? (
                <th className="px-3 py-2 font-medium">Romantic</th>
              ) : null}
              <th className="px-3 py-2 font-medium">
                {hideRomantic ? "Team / class" : "Business"}
              </th>
              <th className="px-3 py-2 font-medium">Friendship</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr
                key={row.partnerLifePath}
                className={`border-t border-[var(--line)] ${
                  row.partnerLifePath === Number(reduced)
                    ? "bg-gold/10"
                    : ""
                }`}
              >
                <td className="px-3 py-2">
                  <span className="brand text-lg text-ink">
                    {row.partnerLifePath}
                  </span>
                  {row.partnerLifePath === Number(reduced) ? (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-gold-deep">
                      you
                    </span>
                  ) : null}
                </td>
                {!hideRomantic ? (
                  <td className="px-3 py-2">
                    <TonePill tone={row.romantic} />
                  </td>
                ) : null}
                <td className="px-3 py-2">
                  <TonePill tone={row.business} />
                </td>
                <td className="px-3 py-2">
                  <TonePill tone={row.friendship} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="text-xs text-ink-soft">
        <li>
          <strong className="text-ink">Supportive</strong> — often easier rapport
          in tradition
        </li>
        <li>
          <strong className="text-ink">Balanced</strong> — mix of ease and stretch
        </li>
        <li>
          <strong className="text-ink">Growth-oriented</strong> — may need
          patience and clear boundaries
        </li>
      </ul>
    </div>
  );
}

export function CompatibilityMatrix({
  pythagorean,
  vedic,
  hideRomantic = false,
}: Props) {
  const [tab, setTab] = useState<"pythagorean" | "vedic">("pythagorean");

  return (
    <div className="space-y-4">
      <div className="flex rounded-full border border-[var(--line)] bg-white/50 p-1">
        <button
          type="button"
          onClick={() => setTab("pythagorean")}
          className={`flex-1 rounded-full px-3 py-2 text-sm transition ${
            tab === "pythagorean"
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Pythagorean (Life Path)
        </button>
        <button
          type="button"
          onClick={() => setTab("vedic")}
          className={`flex-1 rounded-full px-3 py-2 text-sm transition ${
            tab === "vedic"
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Vedic (Destiny)
        </button>
      </div>

      {tab === "pythagorean" ? (
        <MatrixTable
          systemLabel="Pythagorean"
          numberLabel="Life Path"
          rawNumber={pythagorean.rawNumber}
          matrix={pythagorean.matrix}
          disclaimer={pythagorean.disclaimer}
          hideRomantic={hideRomantic}
        />
      ) : (
        <MatrixTable
          systemLabel="Vedic"
          numberLabel="Destiny Number"
          rawNumber={vedic.rawNumber}
          matrix={vedic.matrix}
          disclaimer={vedic.disclaimer}
          hideRomantic={hideRomantic}
        />
      )}
    </div>
  );
}
