import type { LoShuImpact } from "@/lib/numerology/mobileFit";
import type { LoShuCellTone } from "@/lib/numerology/mobileLoShu";
import type { LoShuResult } from "@/lib/numerology/types";

const ROWS = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
] as const;

type Props = {
  person: LoShuResult;
  mobile: LoShuResult;
  impact: LoShuImpact;
};

function mobileCellClass(tone: LoShuCellTone, count: number): string {
  if (count === 0) {
    return "border-dashed border-[var(--line)] bg-white/50 text-ink-soft/50";
  }
  if (tone === "cleanRemedy") {
    return "border-teal-400 bg-teal-50 text-teal-950";
  }
  if (tone === "watchRemedy") {
    return "border-amber-300 bg-amber-50 text-amber-950";
  }
  if (
    tone === "patternFlag" ||
    tone === "conflictRemedy" ||
    tone === "pileUp"
  ) {
    return "border-rose-300 bg-rose-50 text-rose-950";
  }
  return "border-[var(--line)] bg-white text-ink";
}

function BirthGrid({ loShu }: { loShu: LoShuResult }) {
  return (
    <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
        Birth Lo Shu
      </p>
      <p className="mb-2 mt-0.5 text-[11px] leading-4 text-ink-soft">
        From the date of birth. Quiet cells have no count.
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {ROWS.flat().map((n) => {
          const count = loShu.grid[n] ?? 0;
          return (
            <div
              key={`birth-${n}`}
              title={count === 0 ? "Quiet" : `×${count}`}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-center ${
                count === 0
                  ? "border-dashed border-[var(--line)] bg-white/50 text-ink-soft/50"
                  : "border-amber-200/80 bg-amber-50/40 text-ink"
              }`}
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

function NumberGrid({
  loShu,
  impact,
}: {
  loShu: LoShuResult;
  impact: LoShuImpact;
}) {
  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
        This number
      </p>
      <p className="mb-2 mt-0.5 text-[11px] leading-4 text-ink-soft">
        Teal = useful cover. Amber = mild repeat. Rose = pile-up or a strong
        pattern. Pair joins are scored in the sequence, not by this color.
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {ROWS.flat().map((n) => {
          const count = loShu.grid[n] ?? 0;
          const cell = impact.cells[n];
          return (
            <div
              key={`number-${n}`}
              title={cell?.note ?? (count === 0 ? "Quiet" : `×${count}`)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-center ${mobileCellClass(cell?.tone ?? "quiet", count)}`}
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

export function MobileLoShuPair({ person, mobile, impact }: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BirthGrid loShu={person} />
        <NumberGrid loShu={mobile} impact={impact} />
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
