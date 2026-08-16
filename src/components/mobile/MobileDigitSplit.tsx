import { planetForVedic } from "@/lib/numerology/planets";
import type { MobileParseOk } from "@/lib/numerology/mobileNumber";

type Props = {
  mobile: MobileParseOk;
  /** Extra emphasis line for last-4 (business panel). */
  emphasizeLast4?: boolean;
  /**
   * `split` — number split only (place results next).
   * `detail` — core math + frequency (after results).
   * `all` — both (legacy default).
   */
  part?: "all" | "split" | "detail";
};

function DigitsWithRuns({
  digits,
  runs,
}: {
  digits: string;
  runs: MobileParseOk["consecutiveRuns"];
}) {
  const highlight = new Set<number>();
  for (const run of runs) {
    for (let i = run.start; i < run.start + run.length; i++) {
      highlight.add(i);
    }
  }
  return (
    <span className="inline-flex flex-wrap gap-0.5 font-mono text-lg tracking-wide">
      {digits.split("").map((ch, i) => (
        <span
          key={`${i}-${ch}`}
          className={
            highlight.has(i)
              ? "rounded bg-rose-200 px-0.5 font-semibold text-rose-950"
              : "text-ink"
          }
          title={highlight.has(i) ? "Repeated 3+ times in a row" : undefined}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

function SplitCard({ mobile }: { mobile: MobileParseOk }) {
  const { prefix, last4, consecutiveRuns } = mobile;
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
        Number split
      </p>
      {prefix && last4 ? (
        <p className="mt-2 flex flex-wrap items-center gap-2 font-mono text-lg tracking-wide text-ink">
          <span
            className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-teal-950"
            title={`First ${prefix.digits.length} digits`}
          >
            {prefix.digits}
          </span>
          <span className="text-ink-soft">+</span>
          <span
            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-950"
            title="Last 4 digits"
          >
            {last4.digits}
          </span>
          <span className="text-sm text-ink-soft">=</span>
          <DigitsWithRuns digits={mobile.digits} runs={consecutiveRuns} />
        </p>
      ) : (
        <div className="mt-2">
          <DigitsWithRuns digits={mobile.digits} runs={consecutiveRuns} />
        </div>
      )}
      {consecutiveRuns.length > 0 ? (
        <p className="mt-2 text-xs text-rose-900">
          Repeated pattern:{" "}
          {consecutiveRuns
            .map(
              (r) =>
                `${r.digit.repeat(r.length)} (${r.length}× digit ${r.digit})`,
            )
            .join(" · ")}
        </p>
      ) : (
        <p className="mt-2 text-xs text-ink-soft">
          No digit repeats 3+ times in a row.
        </p>
      )}
    </div>
  );
}

function DetailCards({
  mobile,
  emphasizeLast4,
}: {
  mobile: MobileParseOk;
  emphasizeLast4: boolean;
}) {
  const { prefix, last4, digitCounts } = mobile;

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
        How the cores are calculated
      </p>
      {prefix && last4 ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-teal-200/80 bg-teal-50/50 px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-teal-900/70">
                First {prefix.digits.length} digits
              </p>
              <p className="mt-1 font-mono text-sm text-teal-950">
                {prefix.digits}
              </p>
              <p className="mt-3 text-sm text-ink">
                Sum{" "}
                <span className="brand text-2xl text-ink">
                  {prefix.compound}
                </span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                → core{" "}
                <span className="brand text-xl text-ink">{prefix.core}</span>
                <span className="ml-1 text-xs">
                  ({planetForVedic(prefix.core).name})
                </span>
              </p>
            </div>

            <div
              className={`rounded-xl border px-4 py-3 ${
                emphasizeLast4
                  ? "border-amber-300 bg-amber-50/70 ring-1 ring-amber-200/80"
                  : "border-amber-200/80 bg-amber-50/50"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider text-amber-900/70">
                Last 4 digits
                {emphasizeLast4 ? " · primary with full total" : ""}
              </p>
              <p className="mt-1 font-mono text-sm text-amber-950">
                {last4.digits}
              </p>
              <p className="mt-3 text-sm text-ink">
                Sum{" "}
                <span className="brand text-2xl text-ink">{last4.compound}</span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                → core{" "}
                <span className="brand text-xl text-ink">{last4.core}</span>
                <span className="ml-1 text-xs">
                  ({planetForVedic(last4.core).name})
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-ink/15 bg-white/80 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Full number total (also primary for compatibility)
            </p>
            <p className="mt-2 text-sm text-ink">
              <span className="brand">{prefix.compound}</span>
              <span className="text-ink-soft"> + </span>
              <span className="brand">{last4.compound}</span>
              <span className="text-ink-soft"> = </span>
              <span className="brand text-lg">{mobile.compound}</span>
              <span className="text-ink-soft"> → core </span>
              <span className="brand text-xl">{mobile.core}</span>
              <span className="ml-1 text-xs text-ink-soft">
                ({planetForVedic(mobile.core).name})
              </span>
            </p>
            <p className="mt-2 text-xs leading-5 text-ink-soft">
              Compatibility uses <strong className="text-ink">full core</strong>{" "}
              and <strong className="text-ink">last-4 core</strong> equally
              against Psychic / Destiny / name (and domain on Business).
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 text-sm">
          <p>
            Full sum <span className="brand">{mobile.compound}</span> → core{" "}
            <span className="brand">{mobile.core}</span>
          </p>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white/55">
        <p className="border-b border-[var(--line)] px-3 py-2 text-[10px] uppercase tracking-wider text-ink-soft">
          Digit frequency (0–9)
        </p>
        <table className="w-full min-w-[20rem] text-center text-sm">
          <thead className="bg-mist/50 text-ink-soft">
            <tr>
              {Array.from({ length: 10 }, (_, d) => (
                <th key={d} className="px-1.5 py-1.5 font-medium">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {digitCounts.map((count, d) => (
                <td
                  key={d}
                  className={`border-t border-[var(--line)] px-1.5 py-2 ${
                    count >= 3
                      ? "bg-rose-50 font-semibold text-rose-950"
                      : count > 0
                        ? "brand text-ink"
                        : "text-ink-soft/40"
                  }`}
                >
                  {count}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p className="border-t border-[var(--line)] px-3 py-2 text-xs text-ink-soft">
          Counts how often each digit appears in the full number (not only
          consecutive). Cells with 3+ total appearances are tinted.
        </p>
      </div>
    </div>
  );
}

export function MobileDigitSplit({
  mobile,
  emphasizeLast4 = true,
  part = "all",
}: Props) {
  if (part === "split") {
    return <SplitCard mobile={mobile} />;
  }
  if (part === "detail") {
    return (
      <DetailCards mobile={mobile} emphasizeLast4={emphasizeLast4} />
    );
  }
  return (
    <div className="space-y-3">
      <SplitCard mobile={mobile} />
      <DetailCards mobile={mobile} emphasizeLast4={emphasizeLast4} />
    </div>
  );
}
