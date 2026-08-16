"use client";

import { useState } from "react";
import type { NumerologyReport } from "@/lib/numerology/types";
import { downloadReportPdf } from "@/lib/report/exportPdf";

type Props = {
  report: NumerologyReport;
};

export function ExportPdfButton({ report }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setError(null);
    try {
      downloadReportPdf(report);
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
        className="rounded-full bg-sea px-4 py-2 text-sm text-paper shadow-sm transition hover:bg-sea-deep disabled:opacity-60"
      >
        {busy ? "Preparing…" : "Export PDF"}
      </button>
      {error ? <p className="text-xs text-rose-800">{error}</p> : null}
    </div>
  );
}
