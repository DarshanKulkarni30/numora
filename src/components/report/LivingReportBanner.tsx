"use client";

import { livingAsOfLabel } from "@/lib/numerology/livingTiming";

type Props = {
  variant?: "owner" | "shared";
  expiresAt?: string | null;
};

export function LivingReportBanner({
  variant = "owner",
  expiresAt,
}: Props) {
  const asOf = livingAsOfLabel();
  const exp = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="rounded-2xl border border-emerald/35 bg-emerald/10 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-deep">
        Live HTML reading
      </p>
      <p className="mt-1 text-sm leading-6 text-ink">
        As of <span className="font-medium">{asOf}</span>. Personal Year, Month,
        Day, Essence, and the twelve-month chapter refresh when you open this
        page. A PDF is a snapshot from the moment you download it.
      </p>
      {variant === "shared" ? (
        <p className="mt-1 text-xs text-ink-soft">
          Shared view-only link
          {exp ? ` · expires ${exp}` : ""}. No account required. This is not a
          file.
        </p>
      ) : null}
    </div>
  );
}
