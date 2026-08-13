"use client";

import { useMemo, useState } from "react";
import { CompatRadar } from "@/components/report/CompatRadar";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import {
  CHANNEL_HINT,
  TONE_HINT,
  normalizeCompatTone,
  type CompatTone,
} from "@/lib/numerology/compatibility";
import {
  masterNumberNote,
  reduceToSingleDigit,
} from "@/lib/numerology/dateNumbers";
import { planetForVedic } from "@/lib/numerology/planets";
import { VEDIC_COMPAT_NOTE } from "@/lib/numerology/vedicCompatibility";

type Row = {
  partnerLifePath: number;
  romantic: string;
  business: string;
  friendship: string;
};

type LayerMatrix = {
  rawNumber: string;
  matrix: Row[];
};

type SystemMatrix = {
  rawNumber: string;
  matrix: Row[];
  disclaimer: string;
};

type VedicLayers = {
  moolank?: LayerMatrix;
  bhagyank?: LayerMatrix;
  namank?: LayerMatrix;
  /** Legacy Destiny-only snapshot */
  rawNumber?: string;
  matrix?: Row[];
  disclaimer: string;
};

type Props = {
  pythagorean: SystemMatrix;
  vedic: VedicLayers;
  hideRomantic?: boolean;
};

type VedicLayerId = "moolank" | "bhagyank" | "namank";

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

function PartnerRadarView({
  systemLabel,
  numberLabel,
  rawNumber,
  matrix,
  hideRomantic,
  showPlanet = false,
}: {
  systemLabel: string;
  numberLabel: string;
  rawNumber: string;
  matrix: Row[];
  hideRomantic: boolean;
  showPlanet?: boolean;
}) {
  const raw = Number(rawNumber);
  const reduced = Number.isFinite(raw) ? reduceToSingleDigit(raw) : Number(rawNumber);
  const masterNote = masterNumberNote(rawNumber);
  const planet =
    showPlanet && Number.isFinite(reduced)
      ? planetForVedic(reduced)
      : null;

  const defaultPartner =
    matrix.find((r) => r.partnerLifePath === reduced)?.partnerLifePath ??
    matrix[0]?.partnerLifePath ??
    1;
  const [partner, setPartner] = useState(defaultPartner);

  const row =
    matrix.find((r) => r.partnerLifePath === partner) ?? matrix[0] ?? {
      partnerLifePath: partner,
      romantic: "—",
      business: "—",
      friendship: "—",
    };

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        {systemLabel}: your {numberLabel}{" "}
        <span className="brand text-ink">{rawNumber}</span>
        {masterNote ? (
          <>
            {" "}
            → traced as <span className="brand text-ink">{reduced}</span> for
            1–9 pairing
          </>
        ) : null}
        . Select a partner digit to update the radar.
      </p>
      {planet ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
          <span>Ruling planet association:</span>
          <PlanetIcon planet={planet} size="sm" />
        </div>
      ) : null}
      {masterNote ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm text-amber-950">
          {masterNote}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Partner number">
        {matrix.map((r) => (
          <button
            key={r.partnerLifePath}
            type="button"
            onClick={() => setPartner(r.partnerLifePath)}
            className={`min-w-[2.25rem] rounded-full border px-2.5 py-1.5 text-sm transition ${
              partner === r.partnerLifePath
                ? "border-ink bg-ink text-paper"
                : "border-[var(--line)] bg-white/70 text-ink hover:border-gold"
            } ${
              r.partnerLifePath === reduced ? "ring-1 ring-gold-deep/40" : ""
            }`}
          >
            {r.partnerLifePath}
            {r.partnerLifePath === reduced ? (
              <span className="sr-only"> (you)</span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:items-start">
        <CompatRadar
          romantic={row.romantic}
          business={row.business}
          friendship={row.friendship}
          hideRomantic={hideRomantic}
        />
        <div className="space-y-3">
          <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3 text-xs leading-5 text-ink-soft">
            <p className="font-medium text-ink">
              Partner {row.partnerLifePath}
              {row.partnerLifePath === reduced ? " · you" : ""}
            </p>
            <ul className="mt-2 space-y-1.5">
              {!hideRomantic ? (
                <li className="flex flex-wrap items-center gap-2">
                  <strong className="text-ink">Romantic</strong>
                  <TonePill tone={row.romantic} />
                  <span>— {CHANNEL_HINT.romantic}</span>
                </li>
              ) : null}
              <li className="flex flex-wrap items-center gap-2">
                <strong className="text-ink">
                  {hideRomantic ? "Team / class" : "Business"}
                </strong>
                <TonePill tone={row.business} />
                <span>
                  — {hideRomantic ? CHANNEL_HINT.team : CHANNEL_HINT.business}
                </span>
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <strong className="text-ink">Friendship</strong>
                <TonePill tone={row.friendship} />
                <span>— {CHANNEL_HINT.friendship}</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-white/50 px-3 py-3 text-xs leading-5 text-ink-soft">
            <p className="font-medium text-ink">Tone scale</p>
            <ul className="mt-2 space-y-2">
              {(
                [
                  "Amazing",
                  "Favourable",
                  "Neutral",
                  "Challenging",
                ] as CompatTone[]
              ).map((t) => (
                <li key={t}>
                  <strong className="text-ink">{t}</strong> — {TONE_HINT[t]}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
  const [vedicLayer, setVedicLayer] = useState<VedicLayerId>("moolank");

  const layers = useMemo(() => {
    const hasNew =
      vedic.moolank?.matrix?.length &&
      vedic.bhagyank?.matrix?.length &&
      vedic.namank?.matrix?.length;
    if (hasNew) {
      return {
        mode: "layered" as const,
        moolank: vedic.moolank!,
        bhagyank: vedic.bhagyank!,
        namank: vedic.namank!,
      };
    }
    return {
      mode: "legacy" as const,
      legacy: {
        rawNumber: vedic.rawNumber ?? vedic.bhagyank?.rawNumber ?? "—",
        matrix: vedic.matrix ?? vedic.bhagyank?.matrix ?? [],
      },
    };
  }, [vedic]);

  const activeVedic =
    layers.mode === "layered"
      ? layers[vedicLayer]
      : layers.legacy;

  const layerLabel: Record<VedicLayerId, string> = {
    moolank: "Psychic (Moolank)",
    bhagyank: "Destiny (Bhagyank)",
    namank: "Name (Namank)",
  };

  const destinyRaw =
    layers.mode === "layered"
      ? layers.bhagyank.rawNumber
      : layers.legacy.rawNumber;

  const sameCore =
    reduceToSingleDigit(Number(pythagorean.rawNumber)) ===
    reduceToSingleDigit(Number(destinyRaw));

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Same four-tone scale for both systems:{" "}
        <span className="text-ink">Amazing</span>, Favourable, Neutral,
        Challenging. Pythagorean uses Life Path; Vedic uses Psychic, Destiny, and
        Name layers with a traditional 1–9 relationship table.
      </p>
      {sameCore ? (
        <p className="rounded-xl border border-sky-200 bg-sky-50/80 px-3 py-2 text-sm text-sky-950">
          Note: Pythagorean Life Path{" "}
          <span className="brand">{pythagorean.rawNumber}</span> and Vedic Destiny{" "}
          <span className="brand">{destinyRaw}</span> reduce to the same 1–9
          core. Vedic Psychic and Name may still differ.
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
          Vedic layers
        </button>
      </div>

      {tab === "pythagorean" ? (
        <PartnerRadarView
          systemLabel="Pythagorean"
          numberLabel="Life Path"
          rawNumber={pythagorean.rawNumber}
          matrix={pythagorean.matrix}
          hideRomantic={hideRomantic}
        />
      ) : (
        <div className="space-y-4">
          {layers.mode === "layered" ? (
            <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/40 p-1">
              {(
                [
                  "moolank",
                  "bhagyank",
                  "namank",
                ] as VedicLayerId[]
              ).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setVedicLayer(id)}
                  className={`flex-1 rounded-full px-3 py-2 text-sm transition ${
                    vedicLayer === id
                      ? "bg-ink text-paper"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {layerLabel[id]}
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm text-amber-950">
              Legacy snapshot: this saved reading stores a single Vedic Destiny
              matrix. New readings include Psychic, Destiny, and Name layers.
            </p>
          )}

          <p className="text-xs leading-5 text-ink-soft">{VEDIC_COMPAT_NOTE}</p>

          {layers.mode === "layered" && vedicLayer === "namank" ? (
            <p className="text-xs leading-5 text-ink-soft">
              For first-letter approach cues (Cornerstone / Capstone / First
              vowel), open Birth charts → Name letters on this report.
            </p>
          ) : null}

          <PartnerRadarView
            key={`vedic-${vedicLayer}-${activeVedic.rawNumber}`}
            systemLabel="Vedic"
            numberLabel={
              layers.mode === "layered"
                ? layerLabel[vedicLayer]
                : "Destiny Number"
            }
            rawNumber={activeVedic.rawNumber}
            matrix={activeVedic.matrix}
            hideRomantic={hideRomantic}
            showPlanet
          />
        </div>
      )}
    </div>
  );
}
