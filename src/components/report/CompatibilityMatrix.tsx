"use client";

import { useState } from "react";
import {
  CHANNEL_HINT,
  TONE_HINT,
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
        . Each row is a partner’s matching number (1–9). Hover a tone pill for a
        short plain-language note.
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

      <p className="text-xs leading-5 text-ink-soft/80">{disclaimer}</p>
      <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-mist/60 text-ink-soft">
            <tr>
              <th className="px-3 py-2 font-medium" title="Partner’s matching number (1–9)">
                Partner #
              </th>
              {!hideRomantic ? (
                <th
                  className="px-3 py-2 font-medium"
                  title={CHANNEL_HINT.romantic}
                >
                  Romantic
                </th>
              ) : null}
              <th
                className="px-3 py-2 font-medium"
                title={hideRomantic ? CHANNEL_HINT.team : CHANNEL_HINT.business}
              >
                {hideRomantic ? "Team / class" : "Business"}
              </th>
              <th
                className="px-3 py-2 font-medium"
                title={CHANNEL_HINT.friendship}
              >
                Friendship
              </th>
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
          <li>
            <strong className="text-ink">Supportive</strong> —{" "}
            {TONE_HINT.Supportive}
          </li>
          <li>
            <strong className="text-ink">Balanced</strong> — {TONE_HINT.Balanced}
          </li>
          <li>
            <strong className="text-ink">Growth-oriented</strong> —{" "}
            {TONE_HINT["Growth-oriented"]}
          </li>
        </ul>
      </div>
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
      {sameCore ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50/80 px-3 py-2 text-sm text-sky-950">
          Not a mistake: your Pythagorean Life Path{" "}
          <span className="brand">{pythagorean.rawNumber}</span> and Vedic Destiny{" "}
          <span className="brand">{vedic.rawNumber}</span> reduce to the same
          1–9 core for this table, so both tabs show matching partner tones.
          The systems still differ elsewhere (e.g. Expression vs Psychic/Name).
        </p>
      ) : (
        <p className="text-sm text-ink-soft">
          Toggle systems below — Pythagorean uses Life Path{" "}
          <span className="brand text-ink">{pythagorean.rawNumber}</span>; Vedic
          uses Destiny <span className="brand text-ink">{vedic.rawNumber}</span>.
        </p>
      )}
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
