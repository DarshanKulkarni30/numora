"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReportForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          preferredName: form.get("preferredName"),
          dateOfBirth: form.get("dateOfBirth"),
          gender: form.get("gender"),
          purpose: form.get("purpose"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create report");
      router.push(`/report/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl space-y-5">
      <div>
        <label className="mb-1 block text-sm text-ink-soft" htmlFor="fullName">
          Full name (as per birth certificate) *
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-sea focus:ring-2"
          placeholder="e.g. Aarav Mehta"
        />
      </div>
      <div>
        <label
          className="mb-1 block text-sm text-ink-soft"
          htmlFor="preferredName"
        >
          Preferred name
        </label>
        <input
          id="preferredName"
          name="preferredName"
          className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-sea focus:ring-2"
        />
      </div>
      <div>
        <label
          className="mb-1 block text-sm text-ink-soft"
          htmlFor="dateOfBirth"
        >
          Date of birth (DD/MM/YYYY) *
        </label>
        <input
          id="dateOfBirth"
          name="dateOfBirth"
          required
          pattern="\d{2}/\d{2}/\d{4}"
          placeholder="DD/MM/YYYY"
          className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-sea focus:ring-2"
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-ink-soft" htmlFor="gender">
            Gender (optional)
          </label>
          <input
            id="gender"
            name="gender"
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-sea focus:ring-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-ink-soft" htmlFor="purpose">
            Purpose (optional)
          </label>
          <input
            id="purpose"
            name="purpose"
            placeholder="Self-reflection"
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-sea focus:ring-2"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-sea px-6 py-3 font-medium text-paper transition hover:bg-sea-deep disabled:opacity-60"
      >
        {loading ? "Generating your reading…" : "Generate reading"}
      </button>
      <p className="text-center text-xs text-ink-soft">
        Belief-based reflective guidance only — not scientific, medical, legal,
        or financial advice.
      </p>
    </form>
  );
}
