import type { NameChangeDiff } from "@/lib/numerology/nameChangeDiff";

type Props = {
  diff: NameChangeDiff;
};

export function NameChangeDiffPanel({ diff }: Props) {
  const { debts } = diff;
  const hasDebtMovement =
    debts.appeared.length > 0 || debts.fellAway.length > 0;

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <h2 className="text-xl text-ink">What changed when your name changed</h2>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{diff.intro}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-ink-soft">
            Birth-certificate name
          </p>
          <p className="mt-1 text-ink">{diff.natalName}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">
          <p className="text-[11px] uppercase tracking-wider text-ink-soft">
            Name in force{diff.eraLabel ? ` · ${diff.eraLabel}` : ""}
          </p>
          <p className="mt-1 text-ink">{diff.operatingName}</p>
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-mist/60 px-4 py-3 text-sm leading-6 text-ink">
        {diff.summary}
      </p>

      <h3 className="mt-5 text-ink">Numbers built from your name</h3>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead>
            <tr className="text-ink-soft">
              <th className="pb-2 pr-3 font-medium">Number</th>
              <th className="pb-2 pr-3 font-medium">Birth name</th>
              <th className="pb-2 pr-3 font-medium">Name now</th>
              <th className="pb-2 font-medium">Moved?</th>
            </tr>
          </thead>
          <tbody>
            {diff.nameRows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-[var(--line)] align-top"
              >
                <td className="py-2 pr-3">
                  <span className="text-ink">{row.label}</span>
                  <span className="block text-[12px] leading-5 text-ink-soft">
                    {row.what}
                  </span>
                </td>
                <td className="py-2 pr-3 tabular-nums text-ink-soft">
                  {row.natal}
                </td>
                <td
                  className={`py-2 pr-3 tabular-nums ${
                    row.changed ? "font-medium text-ink" : "text-ink-soft"
                  }`}
                >
                  {row.operating}
                </td>
                <td className="py-2 text-ink-soft">
                  {row.changed ? "Yes" : "No change"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mt-5 text-ink">Numbers built from your birth date</h3>
      <p className="mt-1 text-sm text-ink-soft">
        None of these can move, because no part of the calculation uses your
        name.
      </p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {diff.dateRows.map((row) => (
          <li
            key={row.id}
            className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-sm"
          >
            <span className="text-ink">
              {row.label} {row.operating}
            </span>
            <span className="block text-[12px] leading-5 text-ink-soft">
              {row.what}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mt-5 text-ink">Karmic debts held in the name</h3>
      <p className="mt-1 text-sm leading-6 text-ink-soft">{debts.note}</p>
      {hasDebtMovement || debts.carriedOver.length ? (
        <ul className="mt-2 space-y-2 text-sm">
          {debts.fellAway.map((d) => (
            <li
              key={`gone-${d.label}`}
              className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2"
            >
              <span className="text-ink">{d.label} fell away.</span>{" "}
              <span className="text-ink-soft">
                Your birth name carried it; the spelling you use now does not.
                The habit it describes does not vanish on its own — {d.workOn}
              </span>
            </li>
          ))}
          {debts.appeared.map((d) => (
            <li
              key={`new-${d.label}`}
              className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2"
            >
              <span className="text-ink">{d.label} appeared.</span>{" "}
              <span className="text-ink-soft">
                Your current spelling carries it and your birth name did not.{" "}
                {d.showsUpAs}
              </span>
            </li>
          ))}
          {debts.carriedOver.map((d) => (
            <li
              key={`same-${d.label}`}
              className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2"
            >
              <span className="text-ink">{d.label} is in both spellings.</span>{" "}
              <span className="text-ink-soft">
                Changing your name did not move it. {d.workOn}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 rounded-xl bg-mist/60 px-4 py-3 text-sm leading-6 text-ink">
          Neither spelling carries a karmic debt in its name totals, so there is
          nothing to compare here.
        </p>
      )}
    </section>
  );
}
