"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { normalizeDobToSlash } from "@/lib/profile/date";

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

type PersonOption = {
  key: string;
  label: string;
  count: number;
};

function displayName(r: DashboardReport): string {
  return (r.preferred_name || r.full_name).trim() || r.full_name;
}

function personKey(r: DashboardReport): string {
  const dob = normalizeDobToSlash(r.date_of_birth) ?? r.date_of_birth.trim();
  return `${r.full_name.trim()}|${dob}`;
}

export function ReportsList({ initialReports }: Props) {
  const router = useRouter();
  const titleId = useId();
  const filterId = useId();
  const personId = useId();
  const [reports, setReports] = useState(initialReports);
  const [query, setQuery] = useState("");
  const [personFilter, setPersonFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingIds, setPendingIds] = useState<string[] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReports(initialReports);
    setSelected(new Set());
  }, [initialReports]);

  const people = useMemo<PersonOption[]>(() => {
    const map = new Map<string, PersonOption>();
    for (const r of reports) {
      const key = personKey(r);
      const cur = map.get(key);
      if (cur) {
        cur.count += 1;
      } else {
        map.set(key, {
          key,
          label: `${displayName(r)} · ${r.date_of_birth}`,
          count: 1,
        });
      }
    }
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [reports]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports.filter((r) => {
      if (personFilter !== "all" && personKey(r) !== personFilter) return false;
      if (!q) return true;
      return (
        r.full_name.toLowerCase().includes(q) ||
        (r.preferred_name || "").toLowerCase().includes(q)
      );
    });
  }, [reports, query, personFilter]);

  const visibleIds = visible.map((r) => r.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  useEffect(() => {
    if (!pendingIds) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deleting) setPendingIds(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingIds, deleting]);

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        for (const id of visibleIds) next.delete(id);
      } else {
        for (const id of visibleIds) next.add(id);
      }
      return next;
    });
  }

  async function confirmDelete() {
    if (!pendingIds?.length || deleting) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/reports/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: pendingIds }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        deleted?: string[];
      };
      if (!res.ok) {
        throw new Error(body.error || "Could not delete reports.");
      }
      const gone = new Set(body.deleted ?? pendingIds);
      setReports((prev) => prev.filter((r) => !gone.has(r.id)));
      setSelected((prev) => {
        const next = new Set(prev);
        for (const id of gone) next.delete(id);
        return next;
      });
      setPendingIds(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete reports.");
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

  const pendingReports = pendingIds
    ? reports.filter((r) => pendingIds.includes(r.id))
    : [];

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-white/55 p-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-[12rem] flex-1">
          <label htmlFor={filterId} className="mb-1 block text-xs uppercase tracking-wider text-ink-soft">
            Filter by name
          </label>
          <input
            id={filterId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a person name"
            className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm text-ink outline-none ring-gold focus:ring-2"
          />
        </div>
        <div className="min-w-[14rem] flex-1">
          <label htmlFor={personId} className="mb-1 block text-xs uppercase tracking-wider text-ink-soft">
            Person
          </label>
          <select
            id={personId}
            value={personFilter}
            onChange={(e) => setPersonFilter(e.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm text-ink outline-none ring-gold focus:ring-2"
          >
            <option value="all">All people ({reports.length})</option>
            {people.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
                {p.count > 1 ? ` · ${p.count} reports` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleVisible}
            disabled={visible.length === 0}
            className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {allVisibleSelected ? "Clear visible" : "Select visible"}
          </button>
          <button
            type="button"
            disabled={selected.size === 0}
            onClick={() => {
              setError(null);
              setPendingIds([...selected]);
            }}
            className="btn-tactile rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete selected ({selected.size})
          </button>
        </div>
      </div>

      <p className="mb-3 text-sm text-ink-soft">
        Showing {visible.length} of {reports.length} reading
        {reports.length === 1 ? "" : "s"}
        {personFilter !== "all" || query.trim()
          ? " · same person can have more than one report"
          : ""}
        .
      </p>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/40 px-6 py-10 text-center text-ink-soft">
          No readings match this name.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => {
            const name = displayName(r);
            const checked = selected.has(r.id);
            return (
              <div
                key={r.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4 ${
                  checked
                    ? "border-rose-200 bg-rose-50/70"
                    : "border-[var(--line)] bg-white/55"
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1.5"
                    checked={checked}
                    onChange={() => toggleOne(r.id)}
                    aria-label={`Select reading for ${name}`}
                  />
                  <Link
                    href={`/report/${r.id}/open`}
                    className="min-w-0 flex-1 transition hover:opacity-90"
                  >
                    <p className="text-lg text-ink">{name}</p>
                    <p className="text-sm text-ink-soft">
                      {r.date_of_birth} · Age {r.age} · {r.report_type}
                    </p>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/report/${r.id}/enhanced`}
                    className="btn-tactile rounded-full bg-ink px-3 py-1.5 text-sm text-paper"
                  >
                    Enhanced
                  </Link>
                  <Link
                    href={`/report/${r.id}`}
                    className="btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-sm text-ink"
                  >
                    Detailed
                  </Link>
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
                      setPendingIds([r.id]);
                    }}
                    className="btn-tactile rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm text-rose-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pendingIds ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          role="presentation"
          onClick={() => {
            if (!deleting) setPendingIds(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id={titleId} className="text-2xl text-ink">
              {pendingReports.length === 1
                ? "Delete this reading?"
                : `Delete ${pendingReports.length} readings?`}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              This will{" "}
              <span className="font-semibold text-rose-800">
                permanently delete
              </span>{" "}
              {pendingReports.length === 1 ? (
                <>
                  the report for{" "}
                  <span className="font-medium text-ink">
                    {displayName(pendingReports[0]!)}
                  </span>{" "}
                  ({pendingReports[0]?.date_of_birth}).
                </>
              ) : (
                <>
                  {pendingReports.length} saved reports. The same person can
                  appear more than once if you generated more than one reading.
                </>
              )}{" "}
              This is a hard delete — the reading
              {pendingReports.length === 1 ? "" : "s"} cannot be recovered.
            </p>
            {pendingReports.length > 1 ? (
              <ul className="mt-3 max-h-40 overflow-auto text-sm text-ink">
                {pendingReports.slice(0, 8).map((r) => (
                  <li key={r.id}>
                    {displayName(r)} · {r.date_of_birth}
                  </li>
                ))}
                {pendingReports.length > 8 ? (
                  <li className="text-ink-soft">
                    and {pendingReports.length - 8} more
                  </li>
                ) : null}
              </ul>
            ) : null}
            {error ? (
              <p className="mt-3 text-sm text-rose-700" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setPendingIds(null)}
                className="btn-tactile rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="btn-tactile rounded-full bg-rose-700 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting…"
                  : pendingReports.length === 1
                    ? "Delete permanently"
                    : `Delete ${pendingReports.length} permanently`}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
