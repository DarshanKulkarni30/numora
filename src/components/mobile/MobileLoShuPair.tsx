import type { DigitFlag } from "@/lib/numerology/mobileFit";
import type { LoShuResult } from "@/lib/numerology/types";

const ROWS = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
] as const;

type Props = {
  person: LoShuResult;
  mobile: LoShuResult;
  flags: DigitFlag[];
  filledMissing: number[];
};

function cellClass(
  n: number,
  count: number,
  flagged: boolean,
  fillsGap: boolean,
): string {
  if (flagged) {
    return "border-rose-300 bg-rose-50 text-rose-950";
  }
  if (fillsGap && count > 0) {
    return "border-teal-300 bg-teal-50 text-teal-950";
  }
  if (count === 0) {
    return "border-dashed border-[var(--line)] bg-white/40 text-ink-soft/50";
  }
  return "border-[var(--line)] bg-white/80 text-ink";
}

function MiniGrid({
  loShu,
  title,
  flags,
  filledMissing,
  isMobile,
}: {
  loShu: LoShuResult;
  title: string;
  flags: DigitFlag[];
  filledMissing: number[];
  isMobile: boolean;
}) {
  const flagged = new Set(
    flags.filter((f) => f.digit >= 1).map((f) => f.digit),
  );
  return (
    <div>
      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-ink-soft">
        {title}
      </p>
      <div className="grid grid-cols-3 gap-1">
        {ROWS.flat().map((n) => {
          const count = loShu.grid[n] ?? 0;
          const clash = flags.some(
            (f) => f.digit === n && f.kind === "alreadyInGrid",
          );
          const isFlag = isMobile
            ? flagged.has(n)
            : clash;
          const fills = isMobile && filledMissing.includes(n);
          return (
            <div
              key={`${title}-${n}`}
              title={
                isFlag
                  ? flags.some((f) => f.digit === n && f.kind === "strainSequence")
                    ? "This run stacks a heavy digit."
                    : flags.some((f) => f.digit === n && f.kind === "strainRepeat")
                      ? "This digit already sits heavy on this chart."
                      : "Repeated more than this chart likes."
                  : fills
                    ? "Covers a quiet cell on the birth grid."
                    : count === 0
                      ? "Quiet"
                      : `×${count}`
              }
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-center ${cellClass(n, count, isFlag, fills)}`}
            >
              <span className="brand text-base leading-none">{n}</span>
              <span className="mt-0.5 text-[9px] uppercase tracking-wider">
                {count === 0 ? "—" : `×${count}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MobileLoShuPair({
  person,
  mobile,
  flags,
  filledMissing,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <MiniGrid
        loShu={person}
        title="Birth grid"
        flags={flags}
        filledMissing={filledMissing}
        isMobile={false}
      />
      <MiniGrid
        loShu={mobile}
        title="This number"
        flags={flags}
        filledMissing={filledMissing}
        isMobile
      />
    </div>
  );
}
