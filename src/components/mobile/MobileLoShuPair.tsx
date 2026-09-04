import type { DigitFlag, LoShuImpact } from "@/lib/numerology/mobileFit";
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
  impact: LoShuImpact;
};

function cellClass(
  count: number,
  flagged: boolean,
  fillsGap: boolean,
  isMobile: boolean,
): string {
  if (isMobile && flagged) {
    return "border-rose-300 bg-rose-50 text-rose-950";
  }
  if (isMobile && fillsGap && count > 0) {
    return "border-teal-400 bg-teal-50 text-teal-950";
  }
  if (count === 0) {
    return "border-dashed border-[var(--line)] bg-white/50 text-ink-soft/50";
  }
  if (!isMobile) {
    return "border-amber-200/80 bg-amber-50/40 text-ink";
  }
  return "border-[var(--line)] bg-white text-ink";
}

function MiniGrid({
  loShu,
  title,
  hint,
  flags,
  filledMissing,
  isMobile,
  tone,
}: {
  loShu: LoShuResult;
  title: string;
  hint: string;
  flags: DigitFlag[];
  filledMissing: number[];
  isMobile: boolean;
  tone: "birth" | "number";
}) {
  const flagged = new Set(
    flags.filter((f) => f.digit >= 1).map((f) => f.digit),
  );
  const shell =
    tone === "birth"
      ? "border-amber-200/80 bg-amber-50/50"
      : "border-teal-200 bg-teal-50/40";
  return (
    <div className={`rounded-2xl border p-3 ${shell}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
        {title}
      </p>
      <p className="mb-2 mt-0.5 text-[11px] leading-4 text-ink-soft">{hint}</p>
      <div className="grid grid-cols-3 gap-1.5">
        {ROWS.flat().map((n) => {
          const count = loShu.grid[n] ?? 0;
          const clash = flags.some(
            (f) => f.digit === n && f.kind === "alreadyInGrid",
          );
          const isFlag = isMobile ? flagged.has(n) : clash;
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
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-center ${cellClass(count, isFlag, fills, isMobile)}`}
            >
              <span className="brand text-lg leading-none">{n}</span>
              <span className="mt-0.5 text-[10px] uppercase tracking-wider">
                {count === 0 ? "—" : `×${count}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function chipList(nums: number[], empty: string): string {
  return nums.length ? nums.join(", ") : empty;
}

export function MobileLoShuPair({
  person,
  mobile,
  flags,
  filledMissing,
  impact,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MiniGrid
          loShu={person}
          title="Birth Lo Shu"
          hint="From the date of birth. Quiet cells have no count."
          flags={flags}
          filledMissing={filledMissing}
          isMobile={false}
          tone="birth"
        />
        <MiniGrid
          loShu={mobile}
          title="This number"
          hint="Teal covers a quiet birth cell. Rose marks pile-up or a flag."
          flags={flags}
          filledMissing={filledMissing}
          isMobile
          tone="number"
        />
      </div>
      <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
          Overall Lo Shu impact
        </p>
        <p className="mt-1 text-sm leading-5 text-ink">{impact.line}</p>
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-ink-soft sm:grid-cols-3">
          <div>
            <dt className="uppercase tracking-wider">Covers</dt>
            <dd className="font-medium text-teal-800">
              {chipList(impact.covers, "none")}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider">Still quiet</dt>
            <dd className="font-medium text-ink">
              {chipList(impact.stillQuiet, "none")}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider">Piles on</dt>
            <dd className="font-medium text-ink">
              {chipList(impact.pilesOn, "none")}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider">Overload</dt>
            <dd className="font-medium text-rose-800">
              {chipList(impact.overdose, "none")}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider">Cover</dt>
            <dd className="font-medium text-ink">{Math.round(impact.raw)}/15</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider">Integrity</dt>
            <dd className="font-medium text-ink">
              {Math.round(impact.integrity)}/5
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
