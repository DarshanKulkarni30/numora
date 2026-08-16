import { planetForVedic } from "@/lib/numerology/planets";
import type { MobileParseOk } from "@/lib/numerology/mobileNumber";

type Props = {
  mobile: MobileParseOk;
  /** Extra emphasis line for last-4 (business panel). */
  emphasizeLast4?: boolean;
};

export function MobileDigitSplit({ mobile, emphasizeLast4 = true }: Props) {
  const { prefix, last4 } = mobile;
  if (!prefix || !last4) {
    return (
      <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
        <table className="w-full min-w-[20rem] text-left text-sm">
          <tbody>
            <tr className="border-b border-[var(--line)]">
              <td className="px-3 py-2 text-ink-soft">Digits</td>
              <td className="brand px-3 py-2 text-ink">{mobile.digits}</td>
            </tr>
            <tr className="border-b border-[var(--line)]">
              <td className="px-3 py-2 text-ink-soft">Full sum</td>
              <td className="brand px-3 py-2 text-ink">{mobile.compound}</td>
            </tr>
            <tr>
              <td className="px-3 py-2 text-ink-soft">Full core</td>
              <td className="brand px-3 py-2 text-ink">{mobile.core}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Number split
        </p>
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
          <span className="brand text-ink">{mobile.digits}</span>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-teal-200/80 bg-teal-50/50 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-teal-900/70">
            First {prefix.digits.length} digits
          </p>
          <p className="mt-1 font-mono text-sm text-teal-950">{prefix.digits}</p>
          <p className="mt-3 text-sm text-ink">
            Sum{" "}
            <span className="brand text-2xl text-ink">{prefix.compound}</span>
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
            Last 4 digits{emphasizeLast4 ? " · weighted" : ""}
          </p>
          <p className="mt-1 font-mono text-sm text-amber-950">{last4.digits}</p>
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

      <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Full number (prefix sum + last-4 sum)
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
          Last-4 sum/core is read for everyday tone; full core still drives
          Birth×Destiny fit.
        </p>
      </div>
    </div>
  );
}
