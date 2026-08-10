"use client";

import { useState } from "react";
import {
  CHANNEL_HINT,
  COMPAT_DISCLAIMER,
  TONE_HINT,
  normalizeCompatTone,
  type CompatTone,
} from "@/lib/numerology/compatibility";
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

const TONE_COLOR: Record<CompatTone, string> = {
  Amazing: "bg-emerald-100 text-emerald-950 border-emerald-300",
  Favourable: "bg-teal-50 text-teal-900 border-teal-200",
  Neutral: "bg-slate-50 text-slate-800 border-slate-200",
  Challenging: "bg-amber-50 text-amber-950 border-amber-200",
};

function TonePill({ tone }: { tone: string }) {
  if (tone === "—") {
    return <span className="text-ink-soft">—</span>;
  }
  const normalized = normalizeCompatTone(tone);
  const known = normalized in TONE_HINT ? (normalized as CompatTone) : null;
  const label = known ?? normalized;
  const hint = known ? TONE_HINT[known] : String(normalized);
  const color = known
    ? TONE_COLOR[known]
    : "bg-slate-50 text-slate-800 border-slate-200";
  return (
    <span
      title={hint}
      className={`inline-block rounded-full border px-2 py-0.5 text-xs ${color}`}
    >
      {label}
    </span>
  );
}

function MatrixTable({
  systemLabel,
  numberLabel,
  rawNumber,
  matrix,
  hideRomantic,
}: {
  systemLabel: string;
  numberLabel: string;
  rawNumber: string;
  matrix: Row[];
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
        . Tones: Amazing · Favourable · Neutral · Challenging. Hover a pill for
        a short note.
      </p>
      {masterNote ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm text-amber-950">
          {masterNote}
        </p>
      ) : null}

      <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3 text-xs leading-5 text-ink-soft">
        <p className="font-medium text-ink">What the columns mean</p>
        <ul className="mt-2 space-y-1.5">
          {!hideRomantic ? (
            <li>
              <strong className="text-ink">Romantic</strong> —{" "}
              {CHANNEL_HINT.romantic}
            </li>
          ) : null}
          <li>
            <strong className="text-ink">
              {hideRomantic ? "Team / class" : "Business"}
            </strong>{" "}
            — {hideRomantic ? CHANNEL_HINT.team : CHANNEL_HINT.business}
          </li>
          <li>
            <strong className="text-ink">Friendship</strong> —{" "}
            {CHANNEL_HINT.friendship}
          </li>
        </ul>
      </div>

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
                  row.partnerLifePath === Number(reduced) ? "bg-gold/10" : ""
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

      <div className="rounded-xl border border-[var(--line)] bg-white/50 px-3 py-3 text-xs leading-5 text-ink-soft">
        <p className="font-medium text-ink">What the tones mean</p>
        <ul className="mt-2 space-y-2">
          {(
            ["Amazing", "Favourable", "Neutral", "Challenging"] as CompatTone[]
          ).map((t) => (
            <li key={t}>
              <strong className="text-ink">{t}</strong> — {TONE_HINT[t]}
            </li>
          ))}
        </ul>
      </div>

      <p className="rounded-xl border border-[var(--line)] bg-mist/50 px-3 py-2 text-xs leading-5 text-ink-soft">
        {COMPAT_DISCLAIMER}
      </p>
    </div>
  );
}

export function CompatibilityMatrix({
  pythagorean,
  vedic,
  hideRomantic = false,
}: Props) {
  const [tab, setTab] = useState<"pythagorean" | "vedic">("pythagorean");
  const sameCore =
    reduceToSingleDigit(Number(pythagorean.rawNumber)) ===
    reduceToSingleDigit(Number(vedic.rawNumber));

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Same four-tone scale for both systems (recommended for clarity):{" "}
        <span className="text-ink">Amazing</span>, Favourable, Neutral,
        Challenging — Vedic Destiny and Pythagorean Life Path each get their own
        tab.
      </p>
      {sameCore ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50/80 px-3 py-2 text-sm text-sky-950">
          Not a mistake: your Pythagorean Life Path{" "}
          <span className="brand">{pythagorean.rawNumber}</span> and Vedic Destiny{" "}
          <span className="brand">{vedic.rawNumber}</span> reduce to the same
          1–9 core for this table, so both tabs show matching partner tones.
        </p>
      ) : null}
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
          hideRomantic={hideRomantic}
        />
      ) : (
        <MatrixTable
          systemLabel="Vedic"
          numberLabel="Destiny Number"
          rawNumber={vedic.rawNumber}
          matrix={vedic.matrix}
          hideRomantic={hideRomantic}
        />
      )}
    </div>
  );
}
