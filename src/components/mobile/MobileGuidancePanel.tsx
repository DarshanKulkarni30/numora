"use client";

import type {
  MobileGuidance,
  NumberChange,
} from "@/lib/numerology/alignment";

type Props = {
  guidance: MobileGuidance;
  change?: NumberChange | null;
};

function Bar({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-mist" aria-hidden>
      <div
        className="h-full rounded-full bg-sea"
        style={{ width: `${Math.max(8, Math.min(100, percent))}%` }}
      />
    </div>
  );
}

const CHIP: Record<"strong" | "ok" | "caution", string> = {
  strong: "border-emerald-200 bg-emerald-50 text-emerald-950",
  ok: "border-amber-200 bg-amber-50 text-amber-950",
  caution: "border-rose-200 bg-rose-50 text-rose-950",
};

export function MobileGuidancePanel({ guidance, change }: Props) {
  const { blueprint, personality, personMobile, dna, receiverCaller, zeros, repetition, purposeWhy, bestUse, verdict } =
    guidance;

  return (
    <div className="space-y-4 border-t border-[var(--line)] pt-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
        Decision layer
      </p>

      <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
        <h3 className="text-lg text-ink">How this number sits</h3>
        <p className="mt-1 font-mono text-sm text-ink-soft">{blueprint.digits}</p>
        <p className="mt-2 text-xl font-semibold text-ink">
          {blueprint.overallLabel}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {blueprint.dimensions.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-2 py-2 text-center"
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                {d.label}
              </p>
              <p className="mt-1 text-lg text-ink">{d.score}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm leading-6 text-ink">{blueprint.primaryFinding}</p>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
        <h3 className="text-lg text-ink">Number personality</h3>
        <p className="brand mt-1 text-3xl text-ink">Root {personality.root}</p>
        <p className="mt-1 text-sm text-ink">{personality.primaryEnergy}</p>
        <p className="mt-2 text-sm text-ink-soft">
          Supporting: {personality.supporting.length ? personality.supporting.join(" · ") : "—"}
        </p>
        {personality.challenging.length ? (
          <p className="mt-1 text-sm text-ink-soft">
            Challenging: {personality.challenging.join(" · ")}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-ink-soft">
          Root is only the first layer. Digits, position, sequence, personal fit,
          and purpose complete the profile.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
        <h3 className="text-lg text-ink">Person ↔ mobile</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Overall personal fit {personMobile.overall} / 100
        </p>
        <ul className="mt-3 space-y-3">
          {personMobile.links.map((l) => (
            <li key={l.id}>
              <div className="flex justify-between gap-2 text-sm">
                <span className="text-ink">{l.label} ↔ root {l.mobileRoot}</span>
                <span className="text-ink-soft">{l.percent}%</span>
              </div>
              <div className="mt-1">
                <Bar percent={l.percent} />
              </div>
              <p className="mt-1 text-xs text-ink-soft">{l.interpretation}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
        <h3 className="text-lg text-ink">Number layers</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-5">
          {dna.map((layer) => (
            <div
              key={layer.id}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-2 py-2"
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                {layer.label}
              </p>
              <p className="mt-1 text-lg text-ink">{layer.score}</p>
              <p className="mt-1 text-[11px] leading-4 text-ink-soft">{layer.note}</p>
            </div>
          ))}
        </div>
      </div>

      {receiverCaller ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
          <h3 className="text-lg text-ink">Receiver ↔ caller</h3>
          <p className="mt-2 text-sm text-ink">
            Receiver {receiverCaller.receiver} · Caller {receiverCaller.caller}
          </p>
          <p className="mt-1 text-sm text-ink-soft">{receiverCaller.receiverNote}</p>
          <p className="mt-1 text-sm text-ink-soft">{receiverCaller.callerNote}</p>
          <p className="mt-3 text-sm font-medium text-ink">
            Communication balance {receiverCaller.balance} / 100
          </p>
          <p className="mt-1 text-sm text-ink-soft">{receiverCaller.balanceNote}</p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
        <h3 className="text-lg text-ink">Zeros and repetition</h3>
        {zeros.notes.map((n) => (
          <p key={n} className="mt-1 text-sm text-ink-soft">
            {n}
          </p>
        ))}
        {zeros.adjacent.length ? (
          <p className="mt-2 font-mono text-xs text-ink">
            {zeros.adjacent.join(" · ")}
          </p>
        ) : null}
        <p className="mt-3 text-sm text-ink">
          Reinforced: {repetition.reinforced.join(", ") || "—"}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Strong / repeated: {repetition.excessive.join(", ") || "—"}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Lower representation: {repetition.missing.join(", ") || "none"}
        </p>
        <p className="mt-2 text-xs text-ink-soft">{repetition.missingNote}</p>
      </div>

      {purposeWhy.length ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
          <h3 className="text-lg text-ink">Purpose — why</h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {bestUse.map((c) => (
              <span
                key={c.purpose}
                className={`rounded-full border px-2.5 py-1 text-xs ${CHIP[c.tone]}`}
              >
                {c.purpose}
              </span>
            ))}
          </div>
          <ul className="mt-3 space-y-3">
            {purposeWhy.map((p) => (
              <li key={p.id} className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2">
                <p className="text-sm text-ink">
                  {p.label} {p.score}%
                </p>
                <p className="mt-1 text-xs text-ink-soft">Supports: {p.supports}</p>
                <p className="text-xs text-ink-soft">Friction: {p.friction}</p>
                <p className="mt-1 text-sm text-ink">{p.bestUse}</p>
                <p className="text-xs text-ink-soft">{p.lessIdeal}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {change ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
          <h3 className="text-lg text-ink">Number change</h3>
          <table className="mt-2 w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-ink-soft">
                <th className="py-1 font-medium">Dimension</th>
                <th className="py-1 font-medium">Current</th>
                <th className="py-1 font-medium">Candidate</th>
                <th className="py-1 font-medium">Better</th>
              </tr>
            </thead>
            <tbody>
              {change.rows.map((r) => (
                <tr key={r.dimension} className="border-t border-[var(--line)]">
                  <td className="py-1.5 text-ink">{r.dimension}</td>
                  <td className="py-1.5">{r.current}</td>
                  <td className="py-1.5">{r.candidate}</td>
                  <td className="py-1.5 text-ink-soft">
                    {r.better === "tie" ? "Tie" : r.better === "candidate" ? "New" : "Current"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-sm text-ink-soft">
            Strengthened: {change.strengthened.join(", ") || "—"} · Reduced:{" "}
            {change.reduced.join(", ") || "—"}
          </p>
          <p className="mt-2 text-sm text-ink">{change.recommendation}</p>
        </div>
      ) : null}

      <div className="rounded-2xl border-2 border-ink/10 bg-white p-4">
        <h3 className="text-lg text-ink">Final mobile verdict</h3>
        <p className="mt-1 text-xl font-semibold text-ink">
          {verdict.score} / 100 — {verdict.verdict}
        </p>
        <p className="mt-2 text-sm text-ink">
          <span className="font-medium">Primary strength. </span>
          {verdict.primaryStrength}
        </p>
        <p className="mt-1 text-sm text-ink">
          <span className="font-medium">Primary concern. </span>
          {verdict.primaryConcern}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Best suited for: {verdict.bestSuited.join(" · ") || "mixed use"}
        </p>
        {verdict.useCaution.length ? (
          <p className="mt-1 text-sm text-ink-soft">
            Use caution for: {verdict.useCaution.join(" · ")}
          </p>
        ) : null}
        <p className="mt-3 text-sm font-medium text-ink">{verdict.recommendation}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[11px] text-ink-soft">
          {verdict.methodology.map((m) => (
            <li key={m.slice(0, 40)}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
