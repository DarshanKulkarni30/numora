"use client";

type Props = {
  natalName: string;
  operatingName: string;
  label: string;
  natalNn?: string | number | null;
  operatingNn?: string | number | null;
  givenUnchanged?: boolean;
  compact?: boolean;
};

export function NameEraNote({
  natalName,
  operatingName,
  label,
  natalNn,
  operatingNn,
  givenUnchanged = true,
  compact = false,
}: Props) {
  if (!operatingName || operatingName === natalName) return null;

  return (
    <div
      className={`rounded-xl border border-[var(--line)] bg-white/60 ${
        compact ? "px-3 py-2" : "px-4 py-3"
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
        Name in force
      </p>
      <p className={`${compact ? "mt-0.5 text-xs" : "mt-1 text-sm"} text-ink`}>
        Current legal spelling{" "}
        <span className="font-medium">{operatingName}</span>
        {operatingNn != null ? (
          <>
            {" "}
            · name number <span className="brand">{operatingNn}</span>
          </>
        ) : null}
        . Birth-certificate name stays{" "}
        <span className="font-medium">{natalName}</span>
        {natalNn != null ? (
          <>
            {" "}
            · name number <span className="brand">{natalNn}</span>
          </>
        ) : null}
        .
      </p>
      <p className="mt-1 text-[11px] leading-5 text-ink-soft">
        {label}. Psychic and Destiny do not change with a name
        {givenUnchanged
          ? "; this look is mainly a later surname layer."
          : "; the given name also changed."}{" "}
        Reflective only—not legal or marriage advice.
      </p>
    </div>
  );
}
