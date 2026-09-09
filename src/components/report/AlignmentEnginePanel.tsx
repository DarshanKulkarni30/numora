"use client";

import type { SoulBirthNameAlignment } from "@/lib/numerology/alignment";
import type { TaggedNumber } from "@/lib/numerology/alignment";

type Props = {
  reading: SoulBirthNameAlignment;
  /** Detailed catalog keeps tagged metadata visible. */
  showMeta?: boolean;
  note?: string;
};

function Bar({ percent }: { percent: number }) {
  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-mist"
      aria-hidden
    >
      <div
        className="h-full rounded-full bg-sea"
        style={{ width: `${Math.max(8, Math.min(100, percent))}%` }}
      />
    </div>
  );
}

function MetaChip({ n }: { n: TaggedNumber }) {
  const fortuna = n.role === "fortuna";
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 px-3 py-3">
      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
        {n.role}
      </p>
      <p className="brand mt-1 text-2xl text-ink">
        {fortuna && n.number > 0 ? `+${n.number}` : n.number}
      </p>
      <p className="mt-1 text-[11px] text-ink-soft">
        {n.system}
        {fortuna
          ? " · Destiny minus Birth"
          : ` · ${n.source}${n.compound !== n.number ? ` · compound ${n.compound}` : ""}`}
      </p>
    </div>
  );
}

export function AlignmentEnginePanel({
  reading,
  showMeta = false,
  note,
}: Props) {
  return (
    <div className="space-y-5">
      {note ? <p className="text-sm text-ink-soft">{note}</p> : null}

      <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
          Soul → Birth → Name
        </p>
        <p className="brand mt-2 text-3xl text-ink md:text-4xl">
          {reading.flowLabel}
        </p>
        <p className="mt-3 text-lg leading-7 text-ink">{reading.headline}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            ["Inner driver", reading.soul.number, "Soul"],
            ["Natural energy", reading.birth.number, "Birth · bridge"],
            ["Outer expression", reading.name.number, "Name / luck"],
          ].map(([label, value, role]) => (
            <div
              key={String(role)}
              className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3 text-center"
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                {label}
              </p>
              <p className="brand mt-1 text-3xl text-ink">{value}</p>
              <p className="mt-1 text-xs text-ink-soft">{role}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          Fortuna {reading.fortuna.number} — Destiny {reading.destiny.number} minus
          Birth {reading.birth.number}
          {reading.fortuna.number === 0
            ? ". The date path and the day tone match."
            : "."}{" "}
          Birth stays the bridge in the flow above.
        </p>
      </div>

      {showMeta ? (
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            reading.soul,
            reading.birth,
            reading.destiny,
            reading.name,
            reading.personality,
            reading.fortuna,
          ].map((n) => (
            <MetaChip key={n.role} n={n} />
          ))}
        </div>
      ) : null}

      <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <h3 className="text-lg text-ink">Alignment profile</h3>
        <p className="mt-1 text-sm font-medium text-ink">{reading.overallLabel}</p>
        <p className="mt-1 text-xs text-ink-soft">
          Percents are derived from pair bands. They explain the relationship —
          they are not a single compatibility score.
        </p>
        <ul className="mt-4 space-y-3">
          {reading.pairs.map((p) => (
            <li key={p.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm text-ink">
                  {p.from.role === "soul" ? "Soul" : p.from.role === "birth" ? "Birth" : "Soul"}{" "}
                  {p.from.number} →{" "}
                  {p.to.role === "birth" ? "Birth" : "Name"} {p.to.number}
                </p>
                <p className="text-sm text-ink-soft">
                  {p.percent}% · {p.label}
                </p>
              </div>
              <div className="mt-1.5">
                <Bar percent={p.percent} />
              </div>
              <p className="mt-2 text-xs text-ink-soft">{p.question}</p>
              <p className="mt-1 text-sm leading-6 text-ink">{p.interpretation}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Strength
          </p>
          <p className="mt-1 text-ink">{reading.strength.pair}</p>
          <p className="mt-1 text-sm font-medium text-ink">
            {reading.strength.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {reading.strength.body}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-ink-soft">
            {reading.strength.uses.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Tension
          </p>
          <p className="mt-1 text-ink">{reading.tension.pair}</p>
          <p className="mt-1 text-sm font-medium text-ink">
            {reading.tension.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {reading.tension.body}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink">
            {reading.tension.pattern}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/80 p-4">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Bridge
          </p>
          <p className="brand mt-1 text-3xl text-ink">{reading.bridge.number}</p>
          <p className="mt-1 text-sm font-medium text-ink">
            {reading.bridge.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {reading.bridge.body}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white/55">
        <h3 className="border-b border-[var(--line)] px-4 py-3 text-lg text-ink">
          Life domains
        </h3>
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-ink-soft">
              <th className="px-4 py-2 font-medium">Domain</th>
              <th className="px-4 py-2 font-medium">Score</th>
              <th className="px-4 py-2 font-medium">From</th>
              <th className="px-4 py-2 font-medium">Insight</th>
            </tr>
          </thead>
          <tbody>
            {reading.domains.map((d) => (
              <tr key={d.id} className="border-t border-[var(--line)]">
                <td className="px-4 py-2.5 text-ink">{d.label}</td>
                <td className="px-4 py-2.5 text-ink">{d.score}%</td>
                <td className="px-4 py-2.5 text-ink-soft">{d.primaryInteraction}</td>
                <td className="px-4 py-2.5 text-ink-soft">
                  {d.insight}{" "}
                  <span className="block text-[11px]">{d.why}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <h3 className="text-lg text-ink">Recommended strategy</h3>
        <p className="mt-2 text-base text-ink">{reading.strategy}</p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">{reading.strategyWhy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-ink">Do more</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {reading.doMore.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Watch for</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              {reading.watchFor.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
