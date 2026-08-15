import { associationsForNumber } from "@/lib/numerology/associations";

type Props = {
  lifePath: string;
  vedicPsychic: string;
};

const SYS: Record<"pythagorean" | "vedic", string> = {
  pythagorean: "sys-pyth",
  vedic: "sys-vedic",
};

function AssocBlock({
  label,
  number,
  system,
  blurb,
}: {
  label: string;
  number: string;
  system: "pythagorean" | "vedic";
  blurb: string;
}) {
  const a = associationsForNumber(number);
  const dark = system === "vedic";
  return (
    <div className={`rounded-xl border p-4 ${SYS[system]}`}>
      <p className="text-[10px] uppercase tracking-wider opacity-70">
        {system === "pythagorean" ? "Pythagorean" : "Vedic"}
      </p>
      <p className={`text-sm font-medium ${dark ? "text-paper" : "text-ink"}`}>
        {label} · {number}
        {a.number !== Number(number) && Number(number) > 9
          ? ` → ${a.number}`
          : ""}
      </p>
      <p className={`mt-1 text-xs ${dark ? "sys-muted" : "opacity-80"}`}>
        {blurb}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {a.colors.map((c) => (
          <span
            key={c.name}
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs ${
              dark
                ? "border-white/15 bg-white/10 text-paper"
                : "border-[var(--line)] bg-white/70 text-ink"
            }`}
          >
            <span
              className="h-3.5 w-3.5 rounded-full border border-black/10"
              style={{ backgroundColor: c.hex }}
              aria-hidden
            />
            {c.name}
          </span>
        ))}
      </div>
      <dl
        className={`mt-3 grid gap-2 text-sm sm:grid-cols-2 ${
          dark ? "text-paper/80" : "text-ink-soft"
        }`}
      >
        <div>
          <dt className="text-xs uppercase tracking-wider opacity-70">
            Weekdays
          </dt>
          <dd className={`mt-0.5 ${dark ? "text-paper" : "text-ink"}`}>
            {a.weekdays.join(", ")}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider opacity-70">
            Stones
          </dt>
          <dd className={`mt-0.5 ${dark ? "text-paper" : "text-ink"}`}>
            {a.stones.join(", ")}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs uppercase tracking-wider opacity-70">
            Metals
          </dt>
          <dd className={`mt-0.5 ${dark ? "text-paper" : "text-ink"}`}>
            {a.metals.join(", ")}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function setOverlap(a: string[], b: string[]): {
  shared: string[];
  onlyA: string[];
  onlyB: string[];
} {
  const A = new Set(a.map((x) => x.toLowerCase()));
  const B = new Set(b.map((x) => x.toLowerCase()));
  const shared = [...A].filter((x) => B.has(x));
  const onlyA = [...A].filter((x) => !B.has(x));
  const onlyB = [...B].filter((x) => !A.has(x));
  const title = (s: string, source: string[]) =>
    source.find((x) => x.toLowerCase() === s) ?? s;
  return {
    shared: shared.map((s) => title(s, a)),
    onlyA: onlyA.map((s) => title(s, a)),
    onlyB: onlyB.map((s) => title(s, b)),
  };
}

export function AssociationsPanel({ lifePath, vedicPsychic }: Props) {
  const lp = associationsForNumber(lifePath);
  const psy = associationsForNumber(vedicPsychic);
  const showPsychic = lp.number !== psy.number || String(lifePath) !== String(vedicPsychic);

  const colors = setOverlap(
    lp.colors.map((c) => c.name),
    psy.colors.map((c) => c.name),
  );
  const weekdays = setOverlap(lp.weekdays, psy.weekdays);
  const metals = setOverlap(lp.metals, psy.metals);
  const stones = setOverlap(lp.stones, psy.stones);

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Traditional reflective associations by number—colors, weekdays, and
        stones as atmosphere cues, not prescriptions or purchases to make.
      </p>
      {showPsychic ? (
        <p className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-sm text-ink-soft">
          Two cards because <span className="text-ink">Life Path</span> (full
          birth date, Pythagorean) and{" "}
          <span className="text-ink">Vedic Psychic</span> (birth day) are
          different digits here—{lifePath} vs {vedicPsychic}. Same association
          table, two lead numbers.
        </p>
      ) : (
        <p className="text-sm text-ink-soft">
          Life Path and Vedic Psychic reduce to the same digit, so one
          association card is enough.
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <AssocBlock
          label="Life Path"
          number={lifePath}
          system="pythagorean"
          blurb="From your full birth date (Pythagorean)."
        />
        {showPsychic ? (
          <AssocBlock
            label="Vedic Psychic"
            number={vedicPsychic}
            system="vedic"
            blurb="From your birth day (Vedic)."
          />
        ) : null}
      </div>
      {showPsychic ? (
        <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm text-ink-soft">
          <p className="font-medium text-ink">Common & different</p>
          <ul className="mt-2 space-y-1.5 text-xs leading-5">
            <li>
              <strong className="text-ink">Shared:</strong>{" "}
              {[
                colors.shared.length
                  ? `colors ${colors.shared.join(", ")}`
                  : null,
                weekdays.shared.length
                  ? `weekdays ${weekdays.shared.join(", ")}`
                  : null,
                metals.shared.length
                  ? `metals ${metals.shared.join(", ")}`
                  : null,
                stones.shared.length
                  ? `stones ${stones.shared.join(", ")}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ") || "none in this bank"}
            </li>
            <li>
              <strong className="text-ink">Only Life Path:</strong>{" "}
              {[
                colors.onlyA.length ? colors.onlyA.join(", ") : null,
                weekdays.onlyA.length
                  ? `weekdays ${weekdays.onlyA.join(", ")}`
                  : null,
                metals.onlyA.length
                  ? `metals ${metals.onlyA.join(", ")}`
                  : null,
                stones.onlyA.length
                  ? `stones ${stones.onlyA.join(", ")}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ") || "—"}
            </li>
            <li>
              <strong className="text-ink">Only Psychic:</strong>{" "}
              {[
                colors.onlyB.length ? colors.onlyB.join(", ") : null,
                weekdays.onlyB.length
                  ? `weekdays ${weekdays.onlyB.join(", ")}`
                  : null,
                metals.onlyB.length
                  ? `metals ${metals.onlyB.join(", ")}`
                  : null,
                stones.onlyB.length
                  ? `stones ${stones.onlyB.join(", ")}`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ") || "—"}
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
