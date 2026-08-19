"use client";

import { useMemo, useState } from "react";
import {
  CompatArcWheel,
} from "@/components/report/CompatCompass";
import { CompatRadar } from "@/components/report/CompatRadar";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import {
  buildGrahaMandala,
  visualStateLegend,
} from "@/lib/numerology/compatCompass";

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

const STATE_CHIP: Record<string, string> = {
  radiant: "border-emerald-300 bg-emerald-50 text-emerald-950",
  supportive: "border-teal-200 bg-teal-50 text-teal-950",
  balanced: "border-slate-200 bg-slate-50 text-slate-800",
  friction: "border-amber-300 bg-amber-50 text-amber-950",
};

type Props = {
  moolank: LayerMatrix;
  bhagyank: LayerMatrix;
  namank: LayerMatrix;
  partner: number;
  onPartnerChange: (n: number) => void;
  hideRomantic: boolean;
};

export function VedicGrahaMandala({
  moolank,
  bhagyank,
  namank,
  partner,
  onPartnerChange,
  hideRomantic,
}: Props) {
  const mN = Number(moolank.rawNumber);
  const bN = Number(bhagyank.rawNumber);
  const nN = Number(namank.rawNumber);

  const empty: Row = {
    partnerLifePath: partner,
    romantic: "—",
    business: "—",
    friendship: "—",
  };

  const mRow =
    moolank.matrix.find((r) => r.partnerLifePath === partner) ?? empty;
  const bRow =
    bhagyank.matrix.find((r) => r.partnerLifePath === partner) ?? empty;
  const nRow =
    namank.matrix.find((r) => r.partnerLifePath === partner) ?? empty;

  const model = useMemo(
    () =>
      buildGrahaMandala({
        moolank: mN,
        bhagyank: bN,
        namank: nN,
        partner,
        moolankRow: {
          romantic: mRow.romantic,
          business: mRow.business,
          friendship: mRow.friendship,
        },
        bhagyankRow: {
          romantic: bRow.romantic,
          business: bRow.business,
          friendship: bRow.friendship,
        },
        namankRow: {
          romantic: nRow.romantic,
          business: nRow.business,
          friendship: nRow.friendship,
        },
        hideRomantic,
      }),
    [
      mN,
      bN,
      nN,
      partner,
      mRow.romantic,
      mRow.business,
      mRow.friendship,
      bRow.romantic,
      bRow.business,
      bRow.friendship,
      nRow.romantic,
      nRow.business,
      nRow.friendship,
      hideRomantic,
    ],
  );

  const [classic, setClassic] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [focusLayer, setFocusLayer] = useState<string | null>(null);

  const activeChannel =
    model.compass.channels.find((c) => c.id === focus) ?? null;
  const activeLayer =
    model.yourLayers.find((l) => l.id === focusLayer) ?? null;

  const partners = bhagyank.matrix.map((r) => r.partnerLifePath);
  const romanticTone =
    model.compass.channels.find((c) => c.id === "romantic")?.tone ?? "Neutral";
  const businessTone =
    model.compass.channels.find((c) => c.id === "business" || c.id === "team")
      ?.tone ?? "Neutral";
  const friendshipTone =
    model.compass.channels.find((c) => c.id === "friendship")?.tone ??
    "Neutral";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Vedic Compatibility Mandala
          </p>
          <p className="mt-0.5 text-sm text-ink-soft">
            How Psychic, Destiny, and Name tones meet one partner digit
          </p>
        </div>
        <button
          type="button"
          className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs text-ink"
          onClick={() => setClassic((v) => !v)}
        >
          {classic ? "Mandala view" : "Classic radar"}
        </button>
      </div>

      <div
        className="flex flex-wrap gap-1.5"
        role="group"
        aria-label="Partner digit"
      >
        {partners.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPartnerChange(p)}
            className={`btn-tactile min-w-[2.25rem] rounded-full border px-2.5 py-1.5 text-sm ${
              partner === p
                ? "border-ink bg-ink text-paper"
                : "border-[var(--line)] bg-white/70 text-ink hover:border-gold"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {classic ? (
        <CompatRadar
          romantic={romanticTone}
          business={businessTone}
          friendship={friendshipTone}
          hideRomantic={hideRomantic}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
          <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
            <CompatArcWheel
              model={model.compass}
              focus={focus}
              onFocus={setFocus}
              vedicLabels
              size={260}
            />
            <div className="mt-2 flex justify-center">
              <PlanetIcon planet={model.partnerPlanet} size="sm" />
            </div>
          </div>

          <div className="space-y-2">
            {model.yourLayers.map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() =>
                  setFocusLayer((cur) =>
                    cur === layer.id ? null : layer.id,
                  )
                }
                className={`btn-tactile w-full rounded-xl border px-3 py-3 text-left ${
                  focusLayer === layer.id
                    ? "border-ink bg-white shadow-sm"
                    : "border-[var(--line)] bg-white/55 hover:border-gold/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                      {layer.shortLabel}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-ink">
                      <span className="brand">{layer.digit}</span>
                      <PlanetIcon
                        planet={layer.planet}
                        size="sm"
                        showName={false}
                      />
                      <span className="text-sm font-normal text-ink-soft">
                        {layer.planet.name}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${STATE_CHIP[layer.state]}`}
                  >
                    {layer.stateLabel}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-ink-soft">
                  {layer.dynamics}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeChannel && !classic ? (
        <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3 text-xs leading-5 text-ink-soft">
          <p className="font-medium text-ink">
            {activeChannel.vedicLabel} · {activeChannel.stateLabel} (
            {activeChannel.tone})
          </p>
          <p className="mt-1 text-ink">{activeChannel.dynamics}</p>
        </div>
      ) : null}

      {activeLayer && !classic ? (
        <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3 text-sm leading-6 text-ink">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Graha bond · {activeLayer.label}
          </p>
          <p className="mt-1">{activeLayer.dynamics}</p>
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3 text-sm leading-6 text-ink">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Combined Vedic summary
        </p>
        <p className="mt-1">{model.combinedSummary}</p>
        <p className="mt-2 text-xs text-ink-soft">
          {model.reflectivePractice}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--line)] bg-white/50 px-3 py-3 text-xs leading-5 text-ink-soft">
        <p className="font-medium text-ink">Visual states</p>
        <ul className="mt-2 space-y-1.5">
          {visualStateLegend().map((row) => (
            <li key={row.state}>
              <span className="mr-1.5 font-medium text-ink">
                {row.symbol} {row.label}
              </span>
              ({row.tone}) — {row.hint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
