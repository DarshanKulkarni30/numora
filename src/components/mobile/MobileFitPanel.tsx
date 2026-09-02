"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { MobileDigitSplit } from "@/components/mobile/MobileDigitSplit";
import { MobileLoShuPair } from "@/components/mobile/MobileLoShuPair";
import {
  evaluateMobileFit,
  type DigitFlag,
  type MobileUse,
  type MobileVerdict,
} from "@/lib/numerology/mobileFit";
import { stripMobileInput } from "@/lib/numerology/mobileNumber";
import type { RootFitTone } from "@/lib/numerology/mobileRootFit";
import { isValidDob } from "@/lib/profile/date";

type Props = {
  dob: string;
  use: MobileUse;
  value: string;
  onChange: (next: string) => void;
  title: string;
};

const VERDICT_STYLE: Record<MobileVerdict, string> = {
  Supportive: "border-emerald-300 bg-emerald-50 text-emerald-950",
  Mixed: "border-slate-200 bg-slate-50 text-slate-800",
  Caution: "border-rose-200 bg-rose-50 text-rose-950",
};

const TONE_STYLE: Record<RootFitTone, string> = {
  Favourable: "border-emerald-200 bg-emerald-50 text-emerald-950",
  Steady: "border-slate-200 bg-slate-50 text-slate-800",
  Heavy: "border-amber-200 bg-amber-50 text-amber-950",
};

const PAIR_STYLE = {
  supportive: "border-emerald-200 bg-emerald-50 text-emerald-950",
  mixed: "border-slate-200 bg-slate-50 text-slate-800",
  caution: "border-rose-200 bg-rose-50 text-rose-950",
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
  if (kinds.includes("strainSequence")) return "This run stacks a heavy digit.";
  if (kinds.includes("strainRepeat")) {
    return "This digit already sits heavy on this chart.";
  }
  if (kinds.includes("overCount") || kinds.includes("alreadyInGrid")) {
    return "Repeated more than this chart likes.";
  }
  return undefined;
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
              Overall · root {fit.core}
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight">
              {fit.score} · {fit.verdict}
            </p>
            <p className="mt-1 text-sm leading-5">{fit.line}</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-[10px] leading-tight">
              {(
                [
                  ["Root", fit.pillars.root, 50],
                  ["Gaps", fit.pillars.gaps, 20],
                  ["Pairs", fit.pillars.pairs, 20],
                  ["Repeats", fit.pillars.repeats, 10],
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
                    {Math.round(value * 100)}
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
                {label} {n} → {fit.core} · {tone}
              </span>
            ))}
          </div>

          <p className="flex flex-wrap gap-0.5 font-mono text-lg tracking-wide">
            {fit.parsed.digits.split("").map((ch, i) => {
              const inStrain = fit.strainRuns.some(
                (r) => i >= r.start && i < r.start + r.length,
              );
              return (
                <span
                  key={`${i}-${ch}`}
                  className={
                    inStrain
                      ? "rounded bg-rose-200 px-0.5 font-semibold text-rose-950"
                      : "text-ink"
                  }
                  title={
                    inStrain ? "This run stacks a heavy digit." : undefined
                  }
                >
                  {ch}
                </span>
              );
            })}
          </p>
          {fit.strainRuns.length > 0 ? (
            <p className="text-xs text-rose-900">
              This run stacks a heavy digit:{" "}
              {fit.strainRuns
                .map((r) => r.digit.repeat(r.length))
                .join(" · ")}
            </p>
          ) : null}

          <MobileLoShuPair
            person={fit.personLoShu}
            mobile={fit.mobileLoShu}
            flags={fit.flags}
            filledMissing={fit.filledMissing}
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

          <div>
            <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-soft">
              Adjacent pairs
            </p>
            <div className="flex flex-wrap gap-1">
              {fit.pairs.map((p, i) => {
                const key = `${p.pair}-${i}`;
                const open = openPair === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setOpenPair(open ? null : key)}
                    className={`btn-tactile rounded-lg border px-2 py-1 text-xs ${PAIR_STYLE[p.polarity]}`}
                  >
                    {p.pair}
                  </button>
                );
              })}
            </div>
            {openPair ? (
              <p className="mt-2 text-xs leading-5 text-ink-soft">
                {fit.pairs.find((p, i) => `${p.pair}-${i}` === openPair)?.motif}
              </p>
            ) : (
              <p className="mt-2 text-xs text-ink-soft">
                Tap a pair for a short note.
              </p>
            )}
          </div>

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
