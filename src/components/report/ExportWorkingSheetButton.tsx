"use client";

import { useState } from "react";
import type { NumerologyReport } from "@/lib/numerology/types";
import { downloadWorkingSheetPdf } from "@/lib/report/exportWorkingSheetPdf";

type Props = {
  report: NumerologyReport;
};

export function ExportWorkingSheetButton({ report }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setError(null);
    try {
      await downloadWorkingSheetPdf(report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create working sheet");
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
        title="A print-friendly sheet showing the arithmetic behind every number, so you can check the chart by hand."
        className="btn-tactile rounded-full border border-sea/40 bg-white/80 px-4 py-2 text-sm text-sea"
      >
        {busy ? "Preparing…" : "Working sheet"}
      </button>
      {error ? <p className="text-xs text-rose-800">{error}</p> : null}
    </div>
  );
}
