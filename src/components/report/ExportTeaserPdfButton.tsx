"use client";

import { useState } from "react";
import type { NumerologyReport } from "@/lib/numerology/types";
import { downloadTeaserPdf } from "@/lib/report/exportTeaserPdf";

type Props = {
  report: NumerologyReport;
};

export function ExportTeaserPdfButton({ report }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setError(null);
    try {
      await downloadTeaserPdf(report);
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
        className="btn-tactile rounded-full border border-emerald/40 bg-emerald/10 px-4 py-2 text-sm text-ink"
      >
        {busy ? "Preparing…" : "Teaser PDF"}
      </button>
      {error ? <p className="text-xs text-rose-800">{error}</p> : null}
    </div>
  );
}
