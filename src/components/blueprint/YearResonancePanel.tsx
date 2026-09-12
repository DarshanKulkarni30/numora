"use client";

import { useState } from "react";
import type { HarmonyEdge, HarmonyKind } from "@/lib/numerology/blueprint/harmony";
import { HARMONY_LABEL } from "@/lib/numerology/blueprint/harmony";
import type { YearResonance } from "@/lib/numerology/blueprint/yearResonance";

const KIND_CLASS: Record<HarmonyKind, string> = {
  supportive: "border-teal-200 bg-teal-50 text-teal-950",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  tension: "border-amber-200 bg-amber-50 text-amber-950",
  friction: "border-orange-200 bg-orange-50 text-orange-950",
};

function FitChip({ label, kind }: { label: string; kind: HarmonyKind }) {
  return (
    <p className="text-sm text-ink">
      {label}{" "}
      <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${KIND_CLASS[kind]}`}>
        {HARMONY_LABEL[kind]}
      </span>
    </p>
  );
}

function EdgeList({ edges }: { edges: HarmonyEdge[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!edges.length) return null;
  return (
    <ul className="mt-2 space-y-1">
      {edges.map((edge) => (
        <li key={edge.id}>
          <button
            type="button"
            className="btn-tactile w-full rounded-lg border border-[var(--line)] bg-white/80 px-3 py-2 text-left"
            onClick={() => setOpen(open === edge.id ? null : edge.id)}
            aria-expanded={open === edge.id}
          >
            <span className="text-sm text-ink">
              {edge.leftLabel} {edge.left} ↔ {edge.rightLabel} {edge.right}
            </span>
            <span
              className={`ml-2 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${KIND_CLASS[edge.kind]}`}
            >
              {edge.kindLabel}
            </span>
            {open === edge.id ? (
              <p className="mt-2 text-sm leading-6 text-ink-soft">{edge.why}</p>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

type Props = {
  resonance: YearResonance;
};

export function YearResonancePanel({ resonance }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
        Year Resonance
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        Personal Year {resonance.personalYear} is the year’s theme from the date.
        It does not change because of Name or Soul. Resonance is how your seats
        meet that theme — why two people with the same Personal Year can have a
        different year.
      </p>
      <p className="brand mt-3 text-2xl text-ink">
        {resonance.yearClassLabel}
      </p>
      <p className="text-sm text-ink">{resonance.bandLabel}</p>
      <p className="mt-1 text-xs text-ink-soft">{resonance.pyKeywords}</p>
      <p className="mt-3 text-sm leading-6 text-ink">{resonance.summary}</p>
      <div className="mt-3 space-y-1">
        <FitChip label="Natural fit (BN ↔ PY)" kind={resonance.naturalFit} />
        <FitChip label="Life direction (DN ↔ PY)" kind={resonance.directionFit} />
        <FitChip label="Name / Soul (NN/SN ↔ PY)" kind={resonance.nameFit} />
        {resonance.cycleFit ? (
          <FitChip label="Name Cycle ↔ PY" kind={resonance.cycleFit} />
        ) : null}
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        {resonance.counts.supporting} smooth · {resonance.counts.tension}{" "}
        productive tension · {resonance.counts.friction} friction
      </p>
      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Supporting
        </p>
        <EdgeList edges={resonance.supporting} />
      </div>
      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Challenging
        </p>
        {resonance.challenging.length ? (
          <EdgeList edges={resonance.challenging} />
        ) : (
          <p className="mt-1 text-sm text-ink-soft">
            No hard year-to-seat pull on this chart.
          </p>
        )}
      </div>
      <p className="mt-4 text-sm leading-6 text-ink">{resonance.yearStory}</p>
      <p className="mt-2 text-sm leading-6 text-ink">
        <span className="font-medium">Strategy. </span>
        {resonance.strategy}
      </p>
      <p className="mt-3 text-xs leading-5 text-ink-soft">{resonance.whyDifferent}</p>
    </div>
  );
}
