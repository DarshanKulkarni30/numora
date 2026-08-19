import type { GrowthArea } from "@/lib/numerology/growthAreas";

type Props = {
  areas: GrowthArea[];
  /** Growth Mode: emphasize catalyst roadmaps */
  growthMode?: boolean;
};

export function GrowthAreasPanel({ areas, growthMode = true }: Props) {
  if (!areas.length) return null;
  return (
    <div>
      <p className="text-sm text-ink-soft">
        {growthMode
          ? "Growth Mode — Lo Shu catalysts and cross-chart themes as a practice roadmap."
          : "Themes that showed up across more than one part of this reading—read as one continuous practice list."}
      </p>
      <ol className="mt-4 space-y-0 overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70">
        {areas.map((a, i) => (
          <li
            key={a.id}
            className="border-b border-[var(--line)] px-4 py-4 last:border-0"
          >
            <div className="flex gap-3">
              <span className="brand text-lg text-gold-deep tabular-nums">
                {i + 1}.
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-ink">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink-soft">
                  {a.suggestion}
                </p>
                {growthMode && a.actions?.length ? (
                  <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-ink-soft">
                    {a.actions.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                ) : null}
                {a.sources.length ? (
                  <p className="mt-2 text-[11px] text-ink-soft/80">
                    Seen in: {a.sources.join(" · ")}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
