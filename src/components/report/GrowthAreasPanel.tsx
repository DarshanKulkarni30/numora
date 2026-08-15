import type { GrowthArea } from "@/lib/numerology/growthAreas";

type Props = {
  areas: GrowthArea[];
};

export function GrowthAreasPanel({ areas }: Props) {
  if (!areas.length) return null;
  return (
    <div>
      <p className="text-sm text-ink-soft">
        Themes that showed up across more than one part of this reading—read as
        one continuous practice list.
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
