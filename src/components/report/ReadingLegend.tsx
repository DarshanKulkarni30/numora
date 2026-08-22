const START_HERE_WHY: Record<string, string> = {
  "Life Path": "your long-term direction, from your birth date",
  Expression: "how you come across and work, from your birth name",
  Psychic: "your first instinct, from the day you were born",
};

type Props = {
  lines: string[];
  /** Primary numbers to read first, so a beginner is not facing every panel at once. */
  startHere?: { label: string; value: string }[];
  sessionHref?: string | null;
};

export function ReadingLegend({ lines, startHere, sessionHref }: Props) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <h2 className="text-xl text-ink">How to read this</h2>
      {startHere?.length ? (
        <div className="mt-3 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3">
          <p className="text-sm font-medium text-ink">
            If you only read three numbers, read these
          </p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-ink-soft">
            {startHere.map((s) => (
              <li key={s.label}>
                <span className="font-medium text-ink">
                  {s.label} {s.value}
                </span>{" "}
                — {START_HERE_WHY[s.label] ?? "see its panel below"}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs leading-5 text-ink-soft">
            Everything else on this page adds detail to those three. You do not
            need to read it in order, and nothing here predicts events.
            {sessionHref ? (
              <>
                {" "}
                Prefer to be walked through it?{" "}
                <a
                  href={sessionHref}
                  className="underline decoration-gold/60 underline-offset-2 hover:text-gold-deep"
                >
                  Start the guided walkthrough
                </a>
                .
              </>
            ) : null}
          </p>
        </div>
      ) : null}
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-ink-soft">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
