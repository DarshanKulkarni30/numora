"use client";

import { useMemo, useState } from "react";
import type {
  FigureField,
  PublicFigureGold,
  PublicFigureSummary,
} from "@/lib/research/publicFigures";
import { summarizePublicFigures } from "@/lib/research/publicFigures";

type Props = {
  gold: PublicFigureGold;
};

const FIELDS: Array<FigureField | "all"> = [
  "all",
  "wealth",
  "film",
  "sport",
  "politics",
];

function BarList({
  title,
  rows,
  label,
}: {
  title: string;
  rows: { key: string; count: number }[];
  label?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
      <h2 className="text-lg text-ink">{title}</h2>
      {label ? <p className="mt-1 text-xs text-ink-soft">{label}</p> : null}
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.key}>
            <div className="flex justify-between text-sm text-ink">
              <span>{r.key}</span>
              <span>{r.count}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-mist">
              <div
                className="h-2 rounded-full bg-sea/80"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function filterGold(gold: PublicFigureGold, field: FigureField | "all"): PublicFigureGold {
  if (field === "all") return gold;
  return { ...gold, figures: gold.figures.filter((f) => f.field === field) };
}

export function ResearchDashboard({ gold }: Props) {
  const [field, setField] = useState<FigureField | "all">("all");
  const slice = useMemo(() => filterGold(gold, field), [gold, field]);
  const summary: PublicFigureSummary = useMemo(
    () => summarizePublicFigures(slice),
    [slice],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Public-figure research</h1>
        <p className="mt-2 text-sm text-ink-soft">{gold.disclaimer}</p>
        <p className="mt-1 text-sm text-ink-soft">
          Awards and office starts can crowd the bars. Filter a field, then read
          marriage / union ended as the smaller set.
        </p>
        <p className="mt-1 text-xs text-ink-soft">
          Built {new Date(gold.generatedAt).toLocaleString("en-GB")} · Wikidata
          only · date numbers only
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FIELDS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setField(f)}
            className={`btn-tactile rounded-full border px-3 py-1.5 text-sm ${
              field === f
                ? "border-ink bg-ink text-paper"
                : "border-[var(--line)] bg-white text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">People</p>
          <p className="brand mt-1 text-3xl text-ink">{summary.figureCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Dated events
          </p>
          <p className="brand mt-1 text-3xl text-ink">{summary.eventCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-ink-soft">
            Skipped (no day DOB)
          </p>
          <p className="brand mt-1 text-3xl text-ink">{gold.skipped.length}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BarList
          title="Personal Year at event"
          label="Birthday-cycle year, not calendar year."
          rows={summary.personalYearHits.map((r) => ({
            key: `Year ${r.digit}`,
            count: r.count,
          }))}
        />
        <BarList
          title="Pinnacle chapter at event"
          rows={summary.pinnacleHits.map((r) => ({
            key: `P${r.id}`,
            count: r.count,
          }))}
        />
        <BarList
          title="Event types"
          rows={summary.byEventType.map((r) => ({
            key: r.type.replaceAll("_", " "),
            count: r.count,
          }))}
        />
        <BarList
          title="Field mix"
          rows={summary.byField.map((r) => ({
            key: r.field,
            count: r.count,
          }))}
        />
      </div>

      <section className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
        <h2 className="text-lg text-ink">Personal Year by event type</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["marriage", summary.pyByEventType.marriage],
              ["union ended", summary.pyByEventType.union_ended],
              ["award", summary.pyByEventType.award],
              ["office start", summary.pyByEventType.office_start],
            ] as const
          ).map(([label, rows]) => (
            <div key={label}>
              <p className="text-sm font-medium text-ink">{label}</p>
              <p className="mt-1 text-xs text-ink-soft">
                {rows.length
                  ? rows
                      .slice(0, 5)
                      .map((r) => `${r.digit}×${r.count}`)
                      .join(" · ")
                  : "None in this filter"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {gold.skipped.length ? (
        <p className="text-xs text-ink-soft">
          Skipped: {gold.skipped.map((s) => `${s.name} (${s.reason})`).join("; ")}
        </p>
      ) : null}

      <section className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
        <h2 className="text-lg text-ink">People</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="text-ink-soft">
                <th className="pb-2 pr-3 font-medium">Name</th>
                <th className="pb-2 pr-3 font-medium">Field</th>
                <th className="pb-2 pr-3 font-medium">LP</th>
                <th className="pb-2 pr-3 font-medium">BN</th>
                <th className="pb-2 pr-3 font-medium">DN</th>
                <th className="pb-2 font-medium">Events</th>
              </tr>
            </thead>
            <tbody>
              {slice.figures.map((f) => (
                <tr key={f.qid} className="border-t border-[var(--line)] align-top">
                  <td className="py-2 pr-3 text-ink">
                    {f.name}
                    <span className="mt-0.5 block text-[11px] text-ink-soft">
                      {f.dob} · {f.country}
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-ink-soft">{f.field}</td>
                  <td className="py-2 pr-3 text-ink">{f.lifePath}</td>
                  <td className="py-2 pr-3 text-ink">{f.psychic}</td>
                  <td className="py-2 pr-3 text-ink">{f.destiny}</td>
                  <td className="py-2 text-ink-soft">
                    {f.events.length
                      ? f.events
                          .slice(0, 4)
                          .map(
                            (e) =>
                              `${e.year} ${e.type} · PY ${e.personalYear} · P${e.pinnacleId}`,
                          )
                          .join("; ")
                      : "No dated events"}
                    {f.events.length > 4
                      ? ` · +${f.events.length - 4} more`
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
