import type { GrowthArea } from "@/lib/numerology/growthAreas";

type Props = {
  areas: GrowthArea[];
};

export function GrowthAreasPanel({ areas }: Props) {
  if (!areas.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {areas.map((a) => (
        <article
          key={a.id}
          className="rounded-xl border border-[var(--line)] bg-mist/40 p-4"
        >
          <h3 className="text-ink">{a.title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{a.suggestion}</p>
          <p className="mt-3 flex flex-wrap gap-1.5">
            {a.sources.map((s) => (
              <span
                key={s}
                className="rounded-full border border-[var(--line)] bg-white/70 px-2 py-0.5 text-[11px] text-ink-soft"
              >
                {s}
              </span>
            ))}
          </p>
        </article>
      ))}
    </div>
  );
}
