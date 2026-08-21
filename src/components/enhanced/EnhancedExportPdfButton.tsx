"use client";

import { useState } from "react";
import type { NumerologyReport } from "@/lib/numerology/types";
import { downloadEnhancedPdf } from "@/lib/report/exportEnhancedPdf";

type Props = {
  report: NumerologyReport;
  reportId: string;
};

export function EnhancedExportPdfButton({ report, reportId }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setError(null);
    try {
      await downloadEnhancedPdf(report, reportId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create PDF");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={onClick}
        className="btn-tactile rounded-full bg-sea px-4 py-2 text-sm text-paper"
      >
        {busy ? "Preparing…" : "Export enhanced PDF"}
      </button>
      {error ? <p className="text-xs text-rose-800">{error}</p> : null}
    </div>
  );
}
