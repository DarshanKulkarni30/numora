"use client";

import { useId, useMemo, useState } from "react";
import { ChartTipPanel } from "@/components/report/ChartTipPanel";
import { PlanetIcon } from "@/components/report/PlanetIcon";
import { planetGuideHref } from "@/lib/guides/planets";
import {
  buildAuraIdentity,
  synergyKindLabel,
  type AuraClimate,
  type AuraIdentity,
  type AuraLayer,
  type AuraLayerId,
  type AuraSwatch,
} from "@/lib/numerology/auraIdentity";

type Props = {
  lifePath: string;
  vedicDestiny: string;
  chaldeanName: string;
  fullName?: string;
  personalYear?: string;
  personalMonth?: string;
};

const RING: Record<
  AuraLayerId,
  { r: number; width: number }
> = {
  path: { r: 82, width: 22 },
  destiny: { r: 58, width: 20 },
  name: { r: 36, width: 18 },
};

const LAYER_CHIP: Record<AuraLayerId, string> = {
  path: "bg-sky-100 text-sky-900 border-sky-200",
  destiny: "bg-indigo-100 text-indigo-950 border-indigo-200",
  name: "bg-amber-100 text-amber-950 border-amber-200",
};

function gradientId(uid: string, id: AuraLayerId) {
  return `aura-${uid}-${id}`;
}

function layerTip(layer: AuraLayer): string {
  return [
    `${layer.label} — ${layer.raw}${layer.raw !== String(layer.digit) ? ` (reduces to ${layer.digit})` : ""}: ${layer.trait}`,
    layer.represents,
    `Optional reminders for this number: colours ${layer.assoc.colors
      .map((c) => c.name)
      .join(", ")}; stones ${layer.assoc.stones.join(", ")}; metal ${layer.assoc.metals.join(", ")}; weekday ${layer.assoc.weekdays.join(", ")} (${layer.planet.name}).`,
  ].join("\n");
}

function LayerPills({ ids }: { ids: AuraLayerId[] }) {
  const labels: Record<AuraLayerId, string> = {
    path: "Path",
    destiny: "Destiny",
    name: "Name",
  };
  return (
    <span className="ml-1 inline-flex flex-wrap gap-0.5">
      {ids.map((id) => (
        <span
          key={id}
          className={`rounded-full border px-1.5 py-0 text-[9px] uppercase tracking-wide ${LAYER_CHIP[id]}`}
        >
          {labels[id]}
        </span>
      ))}
    </span>
  );
}

function AuraMandala({
  aura,
  uid,
  selected,
  onSelect,
  onTip,
}: {
  aura: AuraIdentity;
  uid: string;
  selected: AuraLayerId | null;
  onSelect: (id: AuraLayerId) => void;
  onTip: (text: string | null) => void;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Three rings showing your Life Path, Vedic Destiny and Name numbers"
      >
        <defs>
          {aura.layers.map((layer) => {
            const colors = layer.assoc.colors;
            const a = colors[0]?.hex ?? "#94a3b8";
            const b = colors[1]?.hex ?? colors[0]?.hex ?? "#cbd5e1";
            const c = colors[2]?.hex ?? b;
            return (
              <linearGradient
                key={layer.id}
                id={gradientId(uid, layer.id)}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={a} />
                <stop offset="55%" stopColor={b} />
                <stop offset="100%" stopColor={c} />
              </linearGradient>
            );
          })}
        </defs>
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="rgba(255,255,255,0.55)"
          stroke="rgba(35, 79, 150, 0.14)"
          strokeWidth="0.6"
        />
        {aura.layers.map((layer) => {
          const ring = RING[layer.id];
          const active = selected === layer.id;
          return (
            <circle
              key={layer.id}
              cx="100"
              cy="100"
              r={ring.r}
              fill="none"
              stroke={`url(#${gradientId(uid, layer.id)})`}
              strokeWidth={ring.width}
              className="aura-ring-pulse"
              opacity={selected && !active ? 0.45 : 0.92}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => onTip(layerTip(layer))}
              onMouseLeave={() => onTip(null)}
              onClick={() => onSelect(layer.id)}
            />
          );
        })}
        <circle
          cx="100"
          cy="100"
          r="22"
          fill="rgba(255,255,255,0.94)"
          stroke="rgba(35, 79, 150, 0.22)"
          strokeWidth="0.8"
        />
        <text
          x="100"
          y="96"
          textAnchor="middle"
          fill="#183a6b"
          fontSize="8"
          fontWeight="700"
        >
          {aura.layers.map((l) => l.digit).join(" · ")}
        </text>
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fill="#355680"
          fontSize="4.5"
        >
          your 3 numbers
        </text>
      </svg>
    </div>
  );
}

export function AssociationsPanel({
  lifePath,
  vedicDestiny,
  chaldeanName,
  fullName,
  personalYear,
  personalMonth,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const aura = useMemo(
    () =>
      buildAuraIdentity({
        lifePath,
        vedicDestiny,
        chaldeanName,
        personalYear,
        personalMonth,
      }),
    [lifePath, vedicDestiny, chaldeanName, personalYear, personalMonth],
  );
  const [tip, setTip] = useState<string | null>(null);
  const [selected, setSelected] = useState<AuraLayerId | null>(null);
  const selectedLayer =
    aura.layers.find((l) => l.id === selected) ?? null;
  const displayName = fullName?.trim() || null;

  function toggleLayer(id: AuraLayerId) {
    const next = selected === id ? null : id;
    setSelected(next);
    const layer = aura.layers.find((l) => l.id === id);
    if (next && layer) setTip(layerTip(layer));
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-ink-soft">
        Three rings, one per number:{" "}
        <span className="font-medium text-ink">Life Path</span> on the outside
        (from your birth date),{" "}
        <span className="font-medium text-ink">Vedic Destiny</span> in the
        middle (same date, different method), and{" "}
        <span className="font-medium text-ink">Name number</span> in the centre
        (from your spelling). Tap a ring to see what that number is for. The
        colours, stones, metals and weekdays below are traditional associations
        you can use as reminders — nothing here needs to be bought, worn or
        scheduled.
      </p>

      <div className="rounded-2xl border border-[var(--line)] bg-white/55 px-4 py-3">
        <div className="space-y-3">
          <div>
            {displayName ? (
              <p className="text-sm font-medium text-ink">{displayName}</p>
            ) : null}
            <p className="text-xs text-ink-soft">
              Path{" "}
              <span className="brand text-base text-ink">{lifePath}</span>
              <span className="mx-1.5 text-ink/30">·</span>
              Destiny{" "}
              <span className="brand text-base text-ink">{vedicDestiny}</span>
              <span className="mx-1.5 text-ink/30">·</span>
              Name{" "}
              <span className="brand text-base text-ink">{chaldeanName}</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Do these three numbers pull the same way?
            </p>
            <p className="mt-0.5 text-sm font-medium text-ink">
              {aura.synergyLabel}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink-soft">
              {aura.synergySummary}
            </p>
          </div>
        </div>
      </div>

      <PaletteCard aura={aura} />
      {aura.climate ? <ClimateCard climate={aura.climate} /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <div className="space-y-4">
          <AuraMandala
            aura={aura}
            uid={uid}
            selected={selected}
            onSelect={toggleLayer}
            onTip={setTip}
          />
          <div className="flex flex-wrap justify-center gap-2">
            {aura.layers.map((layer) => (
              <button
                key={layer.id}
                type="button"
                aria-pressed={selected === layer.id}
                onClick={() => toggleLayer(layer.id)}
                onMouseEnter={() => setTip(layerTip(layer))}
                onMouseLeave={() => setTip(null)}
                className={`btn-tactile rounded-full border px-3 py-1.5 text-xs ${LAYER_CHIP[layer.id]} ${
                  selected === layer.id ? "ring-2 ring-gold" : ""
                }`}
              >
                {layer.label} {layer.digit} · {layer.trait}
              </button>
            ))}
          </div>
          <ChartTipPanel
            tip={tip}
            empty="Tap a ring or a chip below to see what that number is for and the traditional colours, stones and weekday linked to it."
          />
          {selectedLayer ? (
            <SelectedLayerCard layer={selectedLayer} />
          ) : null}
        </div>

        <div className="space-y-4">
          <CrystalsCard aura={aura} />
          <AnchorsCard aura={aura} />
          <RhythmCard aura={aura} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <h3 className="text-ink">How the three read together</h3>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{aura.narrative}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
          <h3 className="text-ink">Each pair, one at a time</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-ink-soft">
            {aura.pairs.map((p) => (
              <li key={`${p.a}-${p.b}`}>
                <span className="font-medium text-ink">
                  {synergyKindLabel(p.kind)}.
                </span>{" "}
                {p.summary}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SelectedLayerCard({ layer }: { layer: AuraLayer }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${LAYER_CHIP[layer.id]}`}>
      <p className="text-[10px] uppercase tracking-wider opacity-80">
        {layer.role}
      </p>
      <p className="mt-0.5 text-sm font-medium">
        {layer.label} · {layer.raw}
      </p>
      <p className="mt-1 text-[12px] leading-snug opacity-90">
        {layer.represents}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {layer.assoc.colors.map((c) => (
          <span
            key={c.name}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-2 py-0.5 text-[11px] text-ink"
          >
            <span
              className="h-2.5 w-2.5 rounded-full border border-black/10"
              style={{ backgroundColor: c.hex }}
            />
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SwatchBadges({ sources }: { sources: AuraSwatch["sources"] }) {
  const labels: Record<AuraLayerId, string> = {
    path: "PATH",
    destiny: "DESTINY",
    name: "NAME",
  };
  if (!sources.length) return null;
  return (
    <span className="inline-flex flex-wrap gap-0.5">
      {sources.map((s) => (
        <span
          key={`${s.id}-${s.raw}`}
          className={`rounded-full border px-1.5 py-0 text-[9px] uppercase tracking-wide ${LAYER_CHIP[s.id]}`}
        >
          {labels[s.id]} {s.raw}
        </span>
      ))}
    </span>
  );
}

function PaletteCard({ aura }: { aura: AuraIdentity }) {
  const swatches = [
    aura.palette.primary,
    aura.palette.secondary,
    aura.palette.highlight,
  ];
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Your aura palette
      </p>
      <div
        className="mt-2 flex h-10 overflow-hidden rounded-full border border-[var(--line)]"
        aria-hidden
      >
        {swatches.map((s) => (
          <span
            key={s.role}
            className="h-full min-w-0 flex-1"
            style={{ backgroundColor: s.hex }}
            title={`${s.name} · ${s.role}`}
          />
        ))}
      </div>
      <ul className="mt-3 space-y-2">
        {swatches.map((s) => {
          const expanded = open === s.role;
          return (
            <li key={s.role}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen((cur) => (cur === s.role ? null : s.role))}
                className="btn-tactile flex w-full items-start gap-3 rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-left hover:bg-white"
              >
                <span
                  className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: s.hex }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[10px] uppercase tracking-wide text-ink-soft">
                      {s.role}
                    </span>
                    <span className="text-sm font-medium text-ink">{s.name}</span>
                    <SwatchBadges sources={s.sources} />
                  </span>
                  <span className="mt-0.5 block text-sm text-ink">
                    {s.title} — {s.job}
                  </span>
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-wide text-ink-soft">
                  {expanded ? "Less" : "More"}
                </span>
              </button>
              {expanded ? (
                <div className="border-x border-b border-[var(--line)] bg-white/70 px-3 py-3">
                  <p className="text-[11px] leading-5 text-ink-soft">{s.indicates}</p>
                  <p className="mt-1 text-[11px] text-ink-soft">
                    {s.tags.join(" · ")}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink">{s.line}</p>
                  <p className="mt-2 text-sm leading-6 text-ink">
                    <span className="font-medium">Try this: </span>
                    {s.action}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-ink-soft">{s.use}</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm leading-6 text-ink">{aura.paletteSummary}</p>
    </div>
  );
}

function ClimateCard({ climate }: { climate: AuraClimate }) {
  const bands = [climate.year, climate.month];
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        This season&apos;s tint
      </p>
      <p className="mt-1 text-[12px] leading-5 text-ink-soft">{climate.caption}</p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {bands.map((b) => (
          <li
            key={b.kind}
            className="flex items-start gap-2 rounded-lg border border-[var(--line)] bg-white/70 px-3 py-2"
          >
            <span
              className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-black/10"
              style={{ backgroundColor: b.hex }}
              aria-hidden
            />
            <span>
              <span className="text-[10px] uppercase tracking-wide text-ink-soft">
                {b.kind === "year" ? "Personal Year" : "Personal Month"} {b.number}
              </span>
              <span className="mt-0.5 block text-sm font-medium text-ink">
                {b.name} · {b.title}
              </span>
              <span className="mt-0.5 block text-[12px] leading-5 text-ink-soft">
                {b.line}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CrystalsCard({ aura }: { aura: AuraIdentity }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Stones traditionally linked to these numbers
      </p>
      <ul className="mt-2 space-y-2">
        {aura.crystals.map((c) => (
          <li key={c.name} className="flex gap-2 text-sm">
            <span
              className="mt-0.5 inline-block h-3.5 w-3.5 shrink-0 rotate-45 rounded-[2px] border border-black/15"
              style={{ backgroundColor: c.hex }}
              aria-hidden
            />
            <span>
              <span className="font-medium text-ink">
                {c.name} · {c.keyword}
              </span>
              <LayerPills ids={c.layers} />
              <span className="mt-0.5 block text-[12px] leading-snug text-ink-soft">
                {c.body}
                {c.shared ? " Shared across layers." : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnchorsCard({ aura }: { aura: AuraIdentity }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Elemental anchors
      </p>
      <ul className="mt-2 space-y-2">
        {aura.anchors.map((a) => (
          <li key={a.name} className="text-sm">
            <span className="font-medium text-ink">
              {a.name} · {a.keyword}
            </span>
            <LayerPills ids={a.layers} />
            <span className="mt-0.5 block text-[12px] leading-snug text-ink-soft">
              {a.body}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RhythmCard({ aura }: { aura: AuraIdentity }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/45 px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-ink-soft">
        Planetary rhythm
      </p>
      <ul className="mt-2 space-y-3">
        {aura.rhythms.map((r) => (
          <li key={r.weekday} className="text-sm">
            <span className="flex items-center gap-2">
              <PlanetIcon
                planet={r.planet}
                size="sm"
                href={planetGuideHref("vedic", r.planet.id)}
              />
              <span className="font-medium text-ink">{r.weekday}</span>
              <LayerPills ids={r.layers} />
            </span>
            <span className="mt-1 block text-[11px] text-ink-soft">
              {r.energy}
            </span>
            <span className="mt-0.5 block text-[12px] leading-snug text-ink-soft">
              {r.invitation}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
