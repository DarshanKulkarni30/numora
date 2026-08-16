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

function normTitle(s: string, source: string[]) {
  return source.find((x) => x.toLowerCase() === s) ?? s;
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
  return {
    shared: shared.map((s) => normTitle(s, a)),
    onlyA: onlyA.map((s) => normTitle(s, a)),
    onlyB: onlyB.map((s) => normTitle(s, b)),
  };
}

/** Three-way: shared by all, and unique to each list. */
function tripleParts(a: string[], b: string[], c: string[]) {
  const A = new Set(a.map((x) => x.toLowerCase()));
  const B = new Set(b.map((x) => x.toLowerCase()));
  const C = new Set(c.map((x) => x.toLowerCase()));
  const sharedAll = [...A].filter((x) => B.has(x) && C.has(x));
  const onlyA = [...A].filter((x) => !B.has(x) && !C.has(x));
  const onlyB = [...B].filter((x) => !A.has(x) && !C.has(x));
  const onlyC = [...C].filter((x) => !A.has(x) && !B.has(x));
  return {
    sharedAll: sharedAll.map((s) => normTitle(s, a)),
    onlyA: onlyA.map((s) => normTitle(s, a)),
    onlyB: onlyB.map((s) => normTitle(s, b)),
    onlyC: onlyC.map((s) => normTitle(s, c)),
  };
}

function line(label: string, parts: (string | null)[]) {
  const text = parts.filter(Boolean).join(" · ");
  return (
    <li>
      <strong className="text-ink">{label}:</strong> {text || "—"}
    </li>
  );
}

function cat(
  items: string[],
  prefix?: string,
): string | null {
  if (!items.length) return null;
  return prefix ? `${prefix} ${items.join(", ")}` : items.join(", ");
}

export function AssociationsPanel({
  lifePath,
  vedicDestiny,
  chaldeanName,
}: Props) {
  const lp = associationsForNumber(lifePath);
  const dest = associationsForNumber(vedicDestiny);
  const chal = associationsForNumber(chaldeanName);

  const lpColors = lp.colors.map((c) => c.name);
  const destColors = dest.colors.map((c) => c.name);
  const chalColors = chal.colors.map((c) => c.name);

  const pathPair = {
    colors: setOverlap(lpColors, destColors),
    weekdays: setOverlap(lp.weekdays, dest.weekdays),
    metals: setOverlap(lp.metals, dest.metals),
    stones: setOverlap(lp.stones, dest.stones),
  };

  const triple = {
    colors: tripleParts(lpColors, destColors, chalColors),
    weekdays: tripleParts(lp.weekdays, dest.weekdays, chal.weekdays),
    metals: tripleParts(lp.metals, dest.metals, chal.metals),
    stones: tripleParts(lp.stones, dest.stones, chal.stones),
  };

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
            <span className="text-ink">{chaldeanName}</span> is the name layer.
          </>
        ) : (
          <>
            Path peers: <span className="text-ink">Life Path</span> {lifePath}{" "}
            vs <span className="text-ink">Vedic Destiny</span> {vedicDestiny}.
            Name layer: <span className="text-ink">Chaldean name</span>{" "}
            {chaldeanName}.
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

      <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm text-ink-soft">
        <p className="font-medium text-ink">Common &amp; different</p>
        <ul className="mt-2 space-y-1.5 text-xs leading-5">
          {line("Shared by all three", [
            cat(triple.colors.sharedAll, "colors"),
            cat(triple.weekdays.sharedAll, "weekdays"),
            cat(triple.metals.sharedAll, "metals"),
            cat(triple.stones.sharedAll, "stones"),
          ])}
          {line("Life Path ↔ Destiny (path peers)", [
            cat(pathPair.colors.shared, "colors"),
            cat(pathPair.weekdays.shared, "weekdays"),
            cat(pathPair.metals.shared, "metals"),
            cat(pathPair.stones.shared, "stones"),
          ])}
          {line("Only Life Path", [
            cat(triple.colors.onlyA),
            cat(triple.weekdays.onlyA, "weekdays"),
            cat(triple.metals.onlyA, "metals"),
            cat(triple.stones.onlyA, "stones"),
          ])}
          {line("Only Destiny", [
            cat(triple.colors.onlyB),
            cat(triple.weekdays.onlyB, "weekdays"),
            cat(triple.metals.onlyB, "metals"),
            cat(triple.stones.onlyB, "stones"),
          ])}
          {line("Only Chaldean name", [
            cat(triple.colors.onlyC),
            cat(triple.weekdays.onlyC, "weekdays"),
            cat(triple.metals.onlyC, "metals"),
            cat(triple.stones.onlyC, "stones"),
          ])}
        </ul>
      </div>
    </div>
  );
}
