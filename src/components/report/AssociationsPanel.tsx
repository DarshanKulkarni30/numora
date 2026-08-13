import { associationsForNumber } from "@/lib/numerology/associations";

type Props = {
  lifePath: string;
  vedicPsychic: string;
};

function AssocBlock({
  label,
  number,
}: {
  label: string;
  number: string;
}) {
  const a = associationsForNumber(number);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4">
      <p className="text-sm font-medium text-ink">
        {label} · {number}
        {a.number !== Number(number) && Number(number) > 9
          ? ` → ${a.number}`
          : ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {a.colors.map((c) => (
          <span
            key={c.name}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-2.5 py-1 text-xs text-ink"
          >
            <span
              className="h-3.5 w-3.5 rounded-full border border-[var(--line)]"
              style={{ backgroundColor: c.hex }}
              aria-hidden
            />
            {c.name}
          </span>
        ))}
      </div>
      <dl className="mt-3 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wider">Weekdays</dt>
          <dd className="mt-0.5 text-ink">{a.weekdays.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider">Stones</dt>
          <dd className="mt-0.5 text-ink">{a.stones.join(", ")}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-wider">Metals</dt>
          <dd className="mt-0.5 text-ink">{a.metals.join(", ")}</dd>
        </div>
      </dl>
    </div>
  );
}

export function AssociationsPanel({ lifePath, vedicPsychic }: Props) {
  const showPsychic =
    associationsForNumber(lifePath).number !==
      associationsForNumber(vedicPsychic).number ||
    String(lifePath) !== String(vedicPsychic);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Traditional reflective associations by number—colors, weekdays, and
        stones used as personal atmosphere cues, not prescriptions.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <AssocBlock label="Life Path" number={lifePath} />
        {showPsychic ? (
          <AssocBlock label="Vedic Psychic" number={vedicPsychic} />
        ) : null}
      </div>
    </div>
  );
}
