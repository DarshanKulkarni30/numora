"use client";

import type { NumberJourneyReading } from "@/lib/numerology/blueprint/numberJourney";

type Props = {
  reading: NumberJourneyReading;
  onDigit?: (digit: number, label: string) => void;
};

export function CoreNumberJourney({ reading, onDigit }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
        Your Number Journey
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        Inside → natural self → life direction → how you show up. Bridge is the
        adjustment, not another personality label.
      </p>

      <ol className="mt-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-stretch">
        {reading.layers.map((layer, i) => (
          <li
            key={layer.id}
            className="flex-1 min-w-[9rem] rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3"
          >
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              {i + 1}. {layer.role}
            </p>
            <button
              type="button"
              className="btn-tactile mt-1 rounded-md px-1 text-left"
              onClick={() => onDigit?.(layer.digit, layer.role)}
            >
              <span className="brand block text-2xl text-ink">{layer.display}</span>
            </button>
            <p className="mt-1 text-xs text-ink">{layer.question}</p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{layer.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-2 text-xs text-ink-soft">
        {reading.flowCounts.supporting} smooth · {reading.flowCounts.tension}{" "}
        productive tension · {reading.flowCounts.friction} friction — from the
        planetary pair table, not from how far the digits sit apart.
      </p>

      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Inner–outer flow
        </p>
        <ul className="mt-2 space-y-2">
          {reading.edges.map((edge) => (
            <li
              key={edge.id}
              className="rounded-lg border border-[var(--line)] bg-white/80 px-3 py-2"
            >
              <p className="text-sm text-ink">
                {edge.leftLabel} {edge.left} → {edge.rightLabel} {edge.right}{" "}
                <span className="text-ink-soft">· {edge.kindLabel}</span>
              </p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{edge.why}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border border-gold-deep/30 bg-gold/10 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-gold-deep">
          {reading.bridgeTitle}
        </p>
        <p className="mt-1 text-xs text-ink-soft">{reading.bridgeCalc}</p>
        <p className="mt-2 text-sm leading-6 text-ink">{reading.bridgeBody}</p>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            The pattern
          </p>
          <p className="mt-1 text-ink">{reading.pattern}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Your recurring challenge
          </p>
          <p className="mt-1 text-ink">{reading.challenge}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Try this
          </p>
          <p className="mt-1 text-ink">{reading.tryThis}</p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          {reading.balanceTitle}
        </p>
        <table className="mt-2 w-full min-w-[16rem] text-left text-sm">
          <thead>
            <tr className="text-ink-soft">
              <th className="py-1 font-medium">When balanced</th>
              <th className="py-1 font-medium">When overloaded</th>
            </tr>
          </thead>
          <tbody>
            {reading.balance.map((row) => (
              <tr key={row.balanced} className="border-t border-[var(--line)]">
                <td className="py-1.5 text-ink">{row.balanced}</td>
                <td className="py-1.5 text-ink-soft">{row.overloaded}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-sm text-ink">Reset: {reading.reset}</p>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Your pattern story
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">{reading.story}</p>
      </div>

      <div className="mt-4 rounded-xl bg-ink px-4 py-3 text-paper">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold">
          If you remember only one thing
        </p>
        <p className="mt-2 text-sm leading-6">{reading.remember}</p>
        <p className="mt-2 text-sm font-medium">{reading.rememberAction}</p>
      </div>
    </div>
  );
}
