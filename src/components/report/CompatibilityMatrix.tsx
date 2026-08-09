"use client";

import { TONE_HINT, type CompatTone } from "@/lib/numerology/compatibility";

type Row = {
  partnerLifePath: number;
  romantic: string;
  business: string;
  friendship: string;
};

type Props = {
  lifePath: string;
  matrix: Row[];
  disclaimer: string;
  hideRomantic?: boolean;
};

function TonePill({ tone }: { tone: string }) {
  if (tone === "—") {
    return <span className="text-ink-soft">—</span>;
  }
  const hint = TONE_HINT[tone as CompatTone] ?? tone;
  const color =
    tone === "Supportive"
      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
      : tone === "Growth-oriented"
        ? "bg-amber-50 text-amber-950 border-amber-200"
        : "bg-slate-50 text-slate-800 border-slate-200";
  return (
    <span
      title={hint}
      className={`inline-block rounded-full border px-2 py-0.5 text-xs ${color}`}
    >
      {tone}
    </span>
  );
}

export function CompatibilityMatrix({
  lifePath,
  matrix,
  disclaimer,
  hideRomantic = false,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-amber-700/30 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
        {disclaimer}
      </p>
      <p className="text-sm text-ink-soft">
        Your Life Path <span className="brand text-ink">{lifePath}</span> with
        another person’s Life Path (1–9). Hover a tone for a short note.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead className="bg-mist/60 text-ink-soft">
            <tr>
              <th className="px-3 py-2 font-medium">Partner LP</th>
              {!hideRomantic ? (
                <th className="px-3 py-2 font-medium">Romantic</th>
              ) : null}
              <th className="px-3 py-2 font-medium">
                {hideRomantic ? "Team / class" : "Business"}
              </th>
              <th className="px-3 py-2 font-medium">Friendship</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr
                key={row.partnerLifePath}
                className="border-t border-[var(--line)]"
              >
                <td className="px-3 py-2">
                  <span className="brand text-lg text-ink">
                    {row.partnerLifePath}
                  </span>
                </td>
                {!hideRomantic ? (
                  <td className="px-3 py-2">
                    <TonePill tone={row.romantic} />
                  </td>
                ) : null}
                <td className="px-3 py-2">
                  <TonePill tone={row.business} />
                </td>
                <td className="px-3 py-2">
                  <TonePill tone={row.friendship} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="text-xs text-ink-soft">
        <li>
          <strong className="text-ink">Supportive</strong> — often easier rapport
          in tradition
        </li>
        <li>
          <strong className="text-ink">Balanced</strong> — mix of ease and stretch
        </li>
        <li>
          <strong className="text-ink">Growth-oriented</strong> — may need
          patience and clear boundaries
        </li>
      </ul>
    </div>
  );
}
