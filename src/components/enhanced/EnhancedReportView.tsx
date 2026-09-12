"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { PersonalBlueprintView } from "@/components/blueprint/PersonalBlueprintView";
import { EnhancedExportPdfButton } from "@/components/enhanced/EnhancedExportPdfButton";
import { ExportTeaserPdfButton } from "@/components/report/ExportTeaserPdfButton";
import { ExportWorkingSheetButton } from "@/components/report/ExportWorkingSheetButton";
import { LivingReportBanner } from "@/components/report/LivingReportBanner";
import { NameEraNote } from "@/components/report/NameEraNote";
import { ShareLinkButton } from "@/components/report/ShareLinkButton";
import { applyLivingTiming } from "@/lib/numerology/livingTiming";
import { buildEnhancedReading } from "@/lib/numerology/enhanced";
import type { NumerologyReport } from "@/lib/numerology/types";
import { BRAND_NAME } from "@/lib/site";

type Props = {
  report: NumerologyReport;
  reportId: string;
  watermarkEmail?: string;
  allowCopy?: boolean;
  allowPdf?: boolean;
  mode?: "owner" | "shared";
  expiresAt?: string | null;
  sessionHref?: string;
};

export function EnhancedReportView({
  report,
  reportId,
  watermarkEmail,
  allowCopy = false,
  allowPdf = false,
  mode = "owner",
  expiresAt,
  sessionHref,
}: Props) {
  const live = useMemo(() => applyLivingTiming(report), [report]);
  const reading = useMemo(
    () => buildEnhancedReading(live, { reportId }),
    [live, reportId],
  );

  useEffect(() => {
    if (allowCopy) return;
    const block = (e: Event) => e.preventDefault();
    const keys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["c", "x", "a", "s", "p", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }
      if (e.key === "PrintScreen") e.preventDefault();
    };
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    document.addEventListener("keydown", keys);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
      document.removeEventListener("keydown", keys);
    };
  }, [allowCopy]);

  const person = live.person;
  const snap = live.numerology_snapshot;
  const roomHref = sessionHref || `/report/${reportId}/session`;
  const shared = mode === "shared";

  return (
    <article className={`${allowCopy ? "" : "report-protected "}relative mx-auto max-w-3xl px-5 pb-24 pt-4`}>
      {watermarkEmail ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 flex flex-wrap content-around justify-around overflow-hidden opacity-[0.06]"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="rotate-[-24deg] text-sm text-ink">
              {watermarkEmail} · {BRAND_NAME}
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 mb-6 flex flex-wrap items-start justify-end gap-2">
        {shared ? null : (
          <>
            <ShareLinkButton reportId={reportId} />
            <ExportTeaserPdfButton report={live} />
            {allowPdf ? <ExportWorkingSheetButton report={live} /> : null}
            {allowPdf ? (
              <EnhancedExportPdfButton report={live} reportId={reportId} />
            ) : (
              <Link
                href="/pricing"
                className="btn-tactile rounded-full border border-emerald/40 bg-emerald/10 px-4 py-2 text-sm text-ink"
              >
                Full PDF on plans
              </Link>
            )}
          </>
        )}
      </div>

      <LivingReportBanner
        variant={shared ? "shared" : "owner"}
        expiresAt={expiresAt}
      />
      <NameEraNote
        natalName={snap.natal_name || person.full_name}
        operatingName={snap.operating_name || person.operating_name || person.full_name}
        label={snap.name_era_label || person.name_era_label || ""}
        natalNn={snap.natal_vedic_name}
        operatingNn={snap.vedic_name}
      />

      <PersonalBlueprintView
        report={live}
        reportId={reportId}
        allowRating={!shared}
        detailedHref={shared ? undefined : reading.detailedHref}
        comprehensiveHref={shared ? undefined : `/report/${reportId}/comprehensive`}
        roomHref={roomHref}
      />

      <footer className="relative z-10 mt-12 space-y-3 text-sm leading-7 text-ink-soft">
        <p>{reading.disclaimer}</p>
        {(live.safety_notices ?? []).map((n) => (
          <p key={n}>{n}</p>
        ))}
        {shared ? (
          <p>This shared link is view-only HTML. It is not a downloadable file.</p>
        ) : (
          <p>
            <Link href={reading.detailedHref} className="text-gold-deep underline">
              Open the detailed report
            </Link>
            {" · "}
            <Link href="/dashboard" className="text-gold-deep underline">
              Dashboard
            </Link>
          </p>
        )}
      </footer>
    </article>
  );
}
