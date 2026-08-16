import { associationsForNumber } from "@/lib/numerology/associations";

type Props = {
  lifePath: string;
  vedicDestiny: string;
  chaldeanName: string;
};

type System = "pythagorean" | "vedic" | "chaldean";

const SYS: Record<System, string> = {
  pythagorean: "sys-pyth",
  vedic: "sys-vedic",
  chaldean: "sys-chal",
};

const SYS_LABEL: Record<System, string> = {
  pythagorean: "Pythagorean",
  vedic: "Vedic",
  chaldean: "Chaldean",
};

function AssocBlock({
  label,
  number,
  system,
  blurb,
}: {
  label: string;
  number: string;
  system: System;
  blurb: string;
}) {
  const a = associationsForNumber(number);
  const dark = system === "vedic";
  return (
    <div className={`rounded-xl border p-4 ${SYS[system]}`}>
      <p className="text-[10px] uppercase tracking-wider opacity-70">
        {SYS_LABEL[system]}
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

function fmtDiff(
  label: string,
  colors: ReturnType<typeof setOverlap>,
  weekdays: ReturnType<typeof setOverlap>,
  metals: ReturnType<typeof setOverlap>,
  stones: ReturnType<typeof setOverlap>,
  side: "onlyA" | "onlyB" | "shared",
) {
  const pick = (o: ReturnType<typeof setOverlap>, prefix?: string) => {
    const list = o[side];
    if (!list.length) return null;
    return prefix ? `${prefix} ${list.join(", ")}` : list.join(", ");
  };
  const parts = [
    pick(colors, side === "shared" ? "colors" : undefined),
    pick(weekdays, "weekdays"),
    pick(metals, "metals"),
    pick(stones, "stones"),
  ].filter(Boolean);
  return (
    <li>
      <strong className="text-ink">{label}:</strong> {parts.join(" · ") || "—"}
    </li>
  );
}

export function AssociationsPanel({
  lifePath,
  vedicDestiny,
  chaldeanName,
}: Props) {
  const lp = associationsForNumber(lifePath);
  const dest = associationsForNumber(vedicDestiny);
  const chal = associationsForNumber(chaldeanName);

  const pathColors = setOverlap(
    lp.colors.map((c) => c.name),
    dest.colors.map((c) => c.name),
  );
  const pathWeekdays = setOverlap(lp.weekdays, dest.weekdays);
  const pathMetals = setOverlap(lp.metals, dest.metals);
  const pathStones = setOverlap(lp.stones, dest.stones);

  const samePathDigit = lp.number === dest.number;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Traditional reflective associations by number—colors, weekdays, and
        stones as atmosphere cues, not prescriptions or purchases to make. Life
        Path and Destiny both come from the full birth date; Chaldean name is
        the name vibration in this product.
      </p>
      <p className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-sm text-ink-soft">
        {samePathDigit ? (
          <>
            Life Path and Vedic Destiny reduce to the same core digit (
            {lp.number})
            {String(lifePath) !== String(vedicDestiny)
              ? ` (${lifePath} / ${vedicDestiny})`
              : ""}
            —path cards may look similar. Chaldean name{" "}
            <span className="text-ink">{chaldeanName}</span> is shown for the
            name layer.
          </>
        ) : (
          <>
            Path peers: <span className="text-ink">Life Path</span>{" "}
            {lifePath} vs <span className="text-ink">Vedic Destiny</span>{" "}
            {vedicDestiny}. Name layer:{" "}
            <span className="text-ink">Chaldean name</span> {chaldeanName}.
          </>
        )}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <AssocBlock
          label="Life Path"
          number={lifePath}
          system="pythagorean"
          blurb="From your full birth date (Pythagorean)."
        />
        <AssocBlock
          label="Vedic Destiny"
          number={vedicDestiny}
          system="vedic"
          blurb="From your full birth date (Vedic DN / Bhagyank)."
        />
        <AssocBlock
          label="Chaldean name"
          number={chaldeanName}
          system="chaldean"
          blurb="From your written name (Chaldean map)—not a birth-path digit."
        />
      </div>
      {!samePathDigit ? (
        <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm text-ink-soft">
          <p className="font-medium text-ink">
            Life Path ↔ Destiny (birth-path peers)
          </p>
          <ul className="mt-2 space-y-1.5 text-xs leading-5">
            {fmtDiff(
              "Shared",
              pathColors,
              pathWeekdays,
              pathMetals,
              pathStones,
              "shared",
            )}
            {fmtDiff(
              "Only Life Path",
              pathColors,
              pathWeekdays,
              pathMetals,
              pathStones,
              "onlyA",
            )}
            {fmtDiff(
              "Only Destiny",
              pathColors,
              pathWeekdays,
              pathMetals,
              pathStones,
              "onlyB",
            )}
          </ul>
          <p className="mt-2 text-xs">
            Chaldean associations (name {chal.number}) sit beside these as a
            separate spelling layer—compare colors and stones by eye rather
            than as a third birth-path digit.
          </p>
        </div>
      ) : null}
    </div>
  );
}
