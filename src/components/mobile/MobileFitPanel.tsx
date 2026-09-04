"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { MobileDigitSplit } from "@/components/mobile/MobileDigitSplit";
import { MobileLastFour } from "@/components/mobile/MobileLastFour";
import { MobileLoShuPair } from "@/components/mobile/MobileLoShuPair";
import {
  evaluateMobileFit,
  type DigitFlag,
  type MobileUse,
  type MobileVerdict,
} from "@/lib/numerology/mobileFit";
import { PAIR_LABEL, type CompoundPair } from "@/lib/numerology/mobileCompoundPairs";
import { stripMobileInput } from "@/lib/numerology/mobileNumber";
import type { PairInsight, SequenceBreakdown } from "@/lib/numerology/mobileSequence";
import { strainRunCaption, type RootFitTone } from "@/lib/numerology/mobileRootFit";
import { isValidDob } from "@/lib/profile/date";

type Props = {
  dob: string;
  use: MobileUse;
  value: string;
  onChange: (next: string) => void;
  title: string;
};

const VERDICT_STYLE: Record<MobileVerdict, string> = {
  Exceptional: "border-emerald-400 bg-emerald-50 text-emerald-950",
  Excellent: "border-emerald-300 bg-emerald-50 text-emerald-950",
  Good: "border-teal-200 bg-teal-50 text-teal-950",
  Acceptable: "border-slate-200 bg-slate-50 text-slate-800",
  Weak: "border-amber-200 bg-amber-50 text-amber-950",
  Avoid: "border-rose-200 bg-rose-50 text-rose-950",
};

const TONE_STYLE: Record<RootFitTone, string> = {
  Favourable: "border-emerald-200 bg-emerald-50 text-emerald-950",
  Steady: "border-slate-200 bg-slate-50 text-slate-800",
  Heavy: "border-amber-200 bg-amber-50 text-amber-950",
};

const PAIR_STYLE = {
  highlyFavourable: "border-emerald-300 bg-emerald-50 text-emerald-950",
  favourable: "border-teal-200 bg-teal-50 text-teal-950",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  mildConflict: "border-amber-200 bg-amber-50 text-amber-950",
  strongConflict: "border-orange-200 bg-orange-50 text-orange-950",
  severeConflict: "border-rose-300 bg-rose-50 text-rose-950",
} as const;

function IconBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="btn-tactile inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-white/80 text-ink disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function flagTitle(flags: DigitFlag[], digit: number): string | undefined {
  const kinds = flags.filter((f) => f.digit === digit).map((f) => f.kind);
  if (kinds.includes("strainSequence")) {
    return "A same-digit run sits uneasy vs birth or destiny — not a high-conflict pair.";
  }
  if (kinds.includes("strainRepeat")) {
    return "This digit already sits uneasy on this chart.";
  }
  if (kinds.includes("overCount") || kinds.includes("alreadyInGrid")) {
    return "Repeated more than this chart likes.";
  }
  return undefined;
}

function runNote(insight: PairInsight): string {
  if (!insight.inRun) {
    return "This join is not inside a same-digit run.";
  }
  const n = insight.runLength;
  const digit = insight.pair[0];
  if (n === 2) {
    return `Sits in a short ${digit}${digit} run. Repetition amplifies the pair; it is not automatically negative.`;
  }
  if (n === 3) {
    return `Sits in a ${digit.repeat(3)} run — the vibration is concentrated. Traditional schools treat this more cautiously than a single ${digit}${digit}.`;
  }
  return `Sits in a ${digit.repeat(n)} run. Traditional mobile readings treat long same-digit stretches as excess, even when a short ${digit}${digit} is useful.`;
}

function AdjacentPairsBlock({
  digits,
  pairs,
  insights,
  pairing,
  openPair,
  onToggle,
}: {
  digits: string;
  pairs: CompoundPair[];
  insights: PairInsight[];
  pairing: SequenceBreakdown;
  openPair: string | null;
  onToggle: (next: string | null) => void;
}) {
  const selected = insights.find((p) => p.pair === openPair) ?? null;
  return (
    <div className="space-y-2.5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink">
          Adjacent pairs
        </p>
        <p className="mt-0.5 text-[11px] leading-4 text-ink-soft">
          {digits.length} digits → {pairs.length} conjunctions. Direction is
          kept (84 is not 48). Tap a pair for rating, count, and chart note.
        </p>
      </div>
      <p className="font-mono text-sm tracking-wide text-ink">
        {pairs.map((p, i) => (
          <span key={`${p.pair}-${p.index}`}>
            {i > 0 ? (
              <span className="px-0.5 text-ink-soft/50">·</span>
            ) : null}
            <button
              type="button"
              onClick={() => onToggle(openPair === p.pair ? null : p.pair)}
              className={`btn-tactile rounded px-0.5 ${
                openPair === p.pair ? "bg-white font-semibold" : ""
              }`}
            >
              {p.pair}
            </button>
          </span>
        ))}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {insights.map((p) => {
          const open = openPair === p.pair;
          return (
            <button
              key={p.pair}
              type="button"
              onClick={() => onToggle(open ? null : p.pair)}
              className={`btn-tactile rounded-xl border px-3 py-2.5 text-left ${PAIR_STYLE[p.kind]} ${
                open ? "ring-2 ring-gold" : ""
              }`}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="brand text-xl leading-none">{p.pair}</span>
                <span className="text-[11px] font-medium">×{p.count}</span>
              </span>
              <span className="mt-1 block text-[11px] leading-4">
                {PAIR_LABEL[p.kind]}
              </span>
            </button>
          );
        })}
      </div>
      {selected ? (
        <div className={`rounded-xl border px-3 py-3 ${PAIR_STYLE[selected.kind]}`}>
          <p className="text-[10px] uppercase tracking-wider opacity-80">
            {PAIR_LABEL[selected.kind]} · {selected.count}{" "}
            {selected.count === 1 ? "join" : "joins"}
          </p>
          <p className="mt-1 text-base font-medium">{selected.motif}</p>
          <ul className="mt-2 space-y-1 text-sm leading-5">
            <li>{selected.directionNote}</li>
            <li>
              Occurs {selected.count} time{selected.count === 1 ? "" : "s"} in
              this number
              {selected.count >= 2
                ? " — later joins weigh more than the first, not a simple ×2."
                : "."}
            </li>
            <li>{runNote(selected)}</li>
            <li>{selected.chartNote}</li>
          </ul>
        </div>
      ) : (
        <p className="text-xs text-ink-soft">
          Tap a pair card for direction, how often it occurs, any run, and how
          it sits on this birth chart.
        </p>
      )}
      <p className="text-[11px] leading-4 text-ink-soft">
        Sequence split: base {Math.round(pairing.base)} · frequency{" "}
        {Math.round(pairing.frequency)} · run {Math.round(pairing.run)} · last
        four {Math.round(pairing.ending)} · conflict density{" "}
        {Math.round(pairing.density)} / 3
        {pairing.conflictDensity > 0
          ? ` (${Math.round(pairing.conflictDensity * 100)}% adverse weight).`
          : "."}{" "}
        Traditional reading only.
      </p>
    </div>
  );
}

export function MobileFitPanel({ dob, use, value, onChange, title }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [openPair, setOpenPair] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const hasText = value.trim().length > 0;
  const ready = isValidDob(dob);
  const result = useMemo(() => {
    if (!ready || !hasText) return null;
    return evaluateMobileFit(dob, value, use);
  }, [dob, value, use, ready, hasText]);

  const fit = result?.ok ? result.fit : null;
  const parseError = result && !result.ok ? result.error : null;

  async function copyDigits() {
    const digits = stripMobileInput(value).replace(/\D/g, "");
    if (!digits) return;
    try {
      await navigator.clipboard.writeText(digits);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="space-y-3 rounded-2xl border border-[var(--line)] bg-white/60 p-4">
      <h2 className="text-lg text-ink">{title}</h2>

      <div>
        <label
          htmlFor={`mobile-${use}`}
          className="mb-1 block text-sm text-ink-soft"
        >
          National number
        </label>
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            id={`mobile-${use}`}
            type="tel"
            inputMode="numeric"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. 98765 43210"
            className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-ink outline-none ring-gold focus:ring-2"
            autoComplete="off"
          />
          <IconBtn
            label="Select number"
            disabled={!hasText}
            onClick={() => inputRef.current?.select()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8 4h8M6 8h12M6 12h12M8 16h8M9 20h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </IconBtn>
          <IconBtn
            label={copied ? "Copied" : "Copy number"}
            disabled={!hasText}
            onClick={() => void copyDigits()}
          >
            {copied ? (
              <span className="text-[10px] font-medium">OK</span>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect
                  x="8"
                  y="8"
                  width="11"
                  height="13"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            )}
          </IconBtn>
          <IconBtn
            label="Clear number"
            disabled={!hasText}
            onClick={() => {
              onChange("");
              setOpenPair(null);
              inputRef.current?.focus();
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </IconBtn>
        </div>
        <p className="mt-1.5 text-xs text-ink-soft">
          8–12 digits, no country code. Spaces or dashes are fine.
        </p>
        {parseError ? (
          <p className="mt-1.5 text-sm text-rose-800">{parseError}</p>
        ) : null}
      </div>

      {!ready ? (
        <p className="text-sm text-ink-soft">
          Save a date of birth on this person to score a number.
        </p>
      ) : !fit ? (
        <p className="text-sm text-ink-soft">
          Type or paste a national number to see the result here.
        </p>
      ) : (
        <>
          <div
            className={`rounded-2xl border-2 px-4 py-3 ${VERDICT_STYLE[fit.verdict]}`}
          >
            <p className="text-[10px] uppercase tracking-wider opacity-80">
              Digit total {fit.compound} → root {fit.core}
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight">
              {fit.score} · {fit.verdict}
            </p>
            <p className="mt-1 text-sm leading-5">{fit.line}</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-[10px] leading-tight">
              {(
                [
                  ["Sequence", fit.pillars.sequence, 35],
                  ["Destiny", fit.pillars.destiny, 25],
                  ["Birth", fit.pillars.birth, 20],
                  ["Lo Shu", fit.pillars.loShu, 20],
                ] as const
              ).map(([label, value, weight]) => (
                <div
                  key={label}
                  className="rounded-lg border border-black/10 bg-white/50 px-1 py-1.5"
                >
                  <p className="font-medium text-ink">
                    {label} {weight}
                  </p>
                  <p className="mt-0.5 text-ink-soft">
                    {Math.round(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(
              [
                ["Birth", fit.birthNumber, fit.bnTone],
                ["Destiny", fit.destinyNumber, fit.dnTone],
                ["Life Path", fit.lifePath, fit.lpTone],
              ] as const
            ).map(([label, n, tone]) => (
              <span
                key={label}
                className={`rounded-full border px-2.5 py-1 text-xs ${TONE_STYLE[tone]}`}
              >
                {label} {n} ↔ root {fit.core} · {tone}
              </span>
            ))}
          </div>

          <p className="flex flex-wrap gap-0.5 font-mono text-lg tracking-wide">
            {fit.parsed.digits.split("").map((ch, i) => {
              const inStrain = fit.strainRuns.some(
                (r) => i >= r.start && i < r.start + r.length,
              );
              const inSevere = fit.pairs.some(
                (p) =>
                  p.kind === "severeConflict" &&
                  (i === p.index || i === p.index + 1),
              );
              const cls = inSevere
                ? "rounded bg-rose-200 px-0.5 font-semibold text-rose-950"
                : inStrain
                  ? "rounded bg-amber-100 px-0.5 text-amber-950"
                  : "text-ink";
              return (
                <span
                  key={`${i}-${ch}`}
                  className={cls}
                  title={
                    inSevere
                      ? "Traditionally high-conflict pair."
                      : inStrain
                        ? "Same-digit run sits uneasy vs birth or destiny — not a high-conflict pair."
                        : undefined
                  }
                >
                  {ch}
                </span>
              );
            })}
          </p>
          {fit.strainRuns.length > 0 ? (
            <p className="text-xs text-amber-900">
              {fit.strainRuns
                .map((r) =>
                  strainRunCaption(
                    Number(r.digit),
                    r.length,
                    fit.birthNumber,
                    fit.destinyNumber,
                  ),
                )
                .join(" ")}
            </p>
          ) : null}

          {fit.lastFour && fit.purpose ? (
            <MobileLastFour
              lastFour={fit.lastFour}
              purpose={fit.purpose}
              birthNumber={fit.birthNumber}
              destinyNumber={fit.destinyNumber}
            />
          ) : null}

          <MobileLoShuPair
            person={fit.personLoShu}
            mobile={fit.mobileLoShu}
            impact={fit.loShuImpact}
          />

          <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white/55">
            <p className="border-b border-[var(--line)] px-3 py-1.5 text-[10px] uppercase tracking-wider text-ink-soft">
              Digit counts 0–9
            </p>
            <div className="grid grid-cols-10 text-center text-xs">
              {fit.digitCounts.map((count, d) => {
                const flagged = fit.flags.some((f) => f.digit === d);
                return (
                  <div
                    key={d}
                    title={flagTitle(fit.flags, d)}
                    className={`border-t border-[var(--line)] px-0.5 py-2 ${
                      flagged
                        ? "bg-rose-50 font-semibold text-rose-950"
                        : count > 0
                          ? "text-ink"
                          : "text-ink-soft/40"
                    }`}
                  >
                    <p className="text-[10px] text-ink-soft">{d}</p>
                    <p>{count}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <AdjacentPairsBlock
            digits={fit.parsed.digits}
            pairs={fit.pairs}
            insights={fit.pairInsights}
            pairing={fit.pillars.pairing}
            openPair={openPair}
            onToggle={setOpenPair}
          />

          <div>
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              className="btn-tactile rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-xs text-ink"
            >
              {detailsOpen ? "Hide digit math" : "Show digit math"}
            </button>
            {detailsOpen ? (
              <div className="mt-3">
                <MobileDigitSplit
                  mobile={fit.parsed}
                  emphasizeLast4={use === "business"}
                  part="detail"
                />
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
