import type { DiscoveryNarratives, DiscoveryPerson } from "@/lib/trivia/discovery";

type Props = {
  narratives: DiscoveryNarratives;
  selected: DiscoveryPerson | null;
  compact?: boolean;
};

export function MatchInsightPanel({
  narratives,
  selected,
  compact = false,
}: Props) {
  return (
    <aside
      className={`rounded-2xl border border-[var(--line)] bg-white/60 ${
        compact ? "space-y-3 p-3" : "space-y-4 p-4"
      }`}
    >
      <div>
        <h3 className="text-sm uppercase tracking-wider text-ink-soft">
          Triad likeness
        </h3>
        <p className={`mt-1 text-ink ${compact ? "text-sm" : "text-sm"}`}>
          {narratives.triad}
        </p>
      </div>
      <div>
        <h3 className="text-sm uppercase tracking-wider text-ink-soft">
          Day &amp; month
        </h3>
        <p className="mt-1 text-sm text-ink">{narratives.dayMonth}</p>
      </div>
      <div>
        <h3 className="text-sm uppercase tracking-wider text-ink-soft">
          Why this match matters
        </h3>
        {selected ? (
          <p className="mt-1 text-sm text-ink">
            <span className="brand">{selected.person.name}</span>
            {" — "}
            {selected.insight}. {selected.reason}.
          </p>
        ) : (
          <p className="mt-1 text-sm text-ink-soft">
            Select a card to see why that likeness is in view.
          </p>
        )}
      </div>
    </aside>
  );
}
