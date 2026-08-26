import type { NumerologyReport } from "@/lib/numerology/types";

type Props = {
  block: NonNullable<NumerologyReport["karmic_debt"]>;
};

const SOURCE_BADGE: Record<string, string> = {
  "birth-day": "from the date · fixed for life",
  "life-path": "from the date · fixed for life",
  expression: "from the name · moves if you respell it",
  "soul-urge": "from the name · moves if you respell it",
  personality: "from the name · moves if you respell it",
};

export function KarmicDebtPanel({ block }: Props) {
  const hasNameDebt = block.items.some((item) =>
    item.positions.some((position) => !position.fixed),
  );

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-ink-soft">{block.intro}</p>

      {block.items.length === 0 ? (
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-4">
          <p className="brand text-lg text-ink">No karmic debts in this chart</p>
          <p className="mt-1.5 text-sm leading-6 text-ink-soft">
            {block.none_note}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {block.items.map((item) => (
            <li
              key={item.label}
              className="flex flex-col rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-4"
            >
              <div className="flex items-baseline gap-2">
                <span className="brand text-2xl text-gold-deep tabular-nums">
                  {item.label}
                </span>
                <span className="text-sm text-ink">
                  reads as a {item.reduced} that has to be earned
                </span>
              </div>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-ink-soft">
                Found in your{" "}
                {item.positions.map((p) => p.label.toLowerCase()).join(" and ")}
              </p>

              <dl className="mt-3 space-y-2.5 text-sm leading-6">
                {item.positions.map((position) => (
                  <div key={`${item.label}-${position.source}`}>
                    <dt className="font-medium text-ink">
                      {position.label}
                      <span className="ml-2 font-normal text-[11px] uppercase tracking-wider text-ink-soft">
                        {SOURCE_BADGE[position.source] ?? "from your chart"}
                      </span>
                    </dt>
                    <dd className="text-ink-soft">{position.meaning}</dd>
                  </div>
                ))}
                <div>
                  <dt className="font-medium text-ink">What it looks like</dt>
                  <dd className="text-ink-soft">{item.shows_up_as}</dd>
                </div>
                <div>
                  <dt className="font-medium text-ink">What to work on</dt>
                  <dd className="text-ink-soft">{item.work_on}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}

      {hasNameDebt ? (
        <p className="rounded-xl bg-mist/60 px-4 py-3 text-sm leading-6 text-ink">
          {block.name_note}
        </p>
      ) : null}
    </div>
  );
}
