"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

export type DashboardReport = {
  id: string;
  full_name: string;
  preferred_name: string | null;
  date_of_birth: string;
  age: number;
  report_type: string;
  created_at: string;
  snapshot: {
    life_path?: string;
    vedic_destiny?: string;
    vedic_psychic?: string;
  } | null;
};

type Props = {
  initialReports: DashboardReport[];
};

export function ReportsList({ initialReports }: Props) {
  const router = useRouter();
  const titleId = useId();
  const [reports, setReports] = useState(initialReports);
  const [pending, setPending] = useState<DashboardReport | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deleting) setPending(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, deleting]);

  async function confirmDelete() {
    if (!pending || deleting) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports/${pending.id}`, { method: "DELETE" });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(body.error || "Could not delete report.");
      }
      setReports((prev) => prev.filter((r) => r.id !== pending.id));
      setPending(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete report.");
    } finally {
      setDeleting(false);
    }
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/40 px-6 py-12 text-center text-ink-soft">
        No saved readings yet.{" "}
        <Link href="/report/new" className="text-gold-deep underline">
          Create your first report
        </Link>
        .
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {reports.map((r) => {
          const name = r.preferred_name || r.full_name;
          return (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-4"
            >
              <Link
                href={`/report/${r.id}`}
                className="min-w-0 flex-1 transition hover:opacity-90"
              >
                <p className="text-lg text-ink">{name}</p>
                <p className="text-sm text-ink-soft">
                  {r.date_of_birth} · Age {r.age} · {r.report_type}
                </p>
              </Link>
              <div className="flex items-center gap-4">
                <Link href={`/report/${r.id}`} className="text-right">
                  <div className="flex items-end justify-end gap-3">
                    <div className="text-center">
                      <p className="brand text-xl text-ink">
                        {r.snapshot?.life_path ?? "—"}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                        Life Path
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="brand text-xl text-ink">
                        {r.snapshot?.vedic_destiny ?? "—"}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                        Destiny
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="brand text-xl text-ink">
                        {r.snapshot?.vedic_psychic ?? "—"}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                        Psychic
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setPending(r);
                  }}
                  className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm text-rose-800 hover:bg-rose-100"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {pending ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          role="presentation"
          onClick={() => {
            if (!deleting) setPending(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-paper p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id={titleId} className="text-2xl text-ink">
              Delete this reading?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              This will{" "}
              <span className="font-semibold text-rose-800">
                permanently delete
              </span>{" "}
              the report for{" "}
              <span className="font-medium text-ink">
                {pending.preferred_name || pending.full_name}
              </span>{" "}
              ({pending.date_of_birth}). This is a hard delete — the reading
              cannot be recovered.
            </p>
            {error ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setPending(null)}
                className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink hover:bg-white/80 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="rounded-full bg-rose-700 px-4 py-2 text-sm text-white hover:bg-rose-800 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
