"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BlockUserForm({
  userId,
  blocked,
}: {
  userId: string;
  blocked: boolean;
}) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(nextBlocked: boolean) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocked: nextBlocked,
          reason: reason.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
      <h3 className="font-medium text-ink">Moderation</h3>
      {!blocked ? (
        <>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Block reason"
            className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => submit(true)}
            className="rounded-full bg-rose-800 px-4 py-2 text-sm text-white hover:bg-rose-900 disabled:opacity-50"
          >
            Block user
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => submit(false)}
          className="rounded-full bg-sea px-4 py-2 text-sm text-paper hover:bg-sea-deep disabled:opacity-50"
        >
          Unblock user
        </button>
      )}
      {error ? <p className="text-sm text-rose-800">{error}</p> : null}
    </div>
  );
}

export function AdminNoteForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, body: body.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setBody("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Add support note…"
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
      />
      <button
        type="button"
        disabled={busy || !body.trim()}
        onClick={submit}
        className="rounded-full bg-sea px-4 py-2 text-sm text-paper hover:bg-sea-deep disabled:opacity-50"
      >
        Save note
      </button>
      {error ? <p className="text-sm text-rose-800">{error}</p> : null}
    </div>
  );
}

export function PlanOverrideForm({
  userId,
  currentPlan,
}: {
  userId: string;
  currentPlan: string;
}) {
  const router = useRouter();
  const [planId, setPlanId] = useState(currentPlan || "free");
  const [days, setDays] = useState("90");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          days: Number(days) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
      <h3 className="font-medium text-ink">Plan override (pre-Stripe)</h3>
      <select
        value={planId}
        onChange={(e) => setPlanId(e.target.value)}
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
      >
        {[
          "free",
          "week_pass",
          "pack_3mo",
          "pack_6mo",
          "pack_12mo",
          "pack_24mo",
        ].map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <input
        value={days}
        onChange={(e) => setDays(e.target.value)}
        placeholder="Days until period end (0 = clear)"
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
      />
      <button
        type="button"
        disabled={busy}
        onClick={submit}
        className="rounded-full bg-sea px-4 py-2 text-sm text-paper hover:bg-sea-deep disabled:opacity-50"
      >
        Save plan
      </button>
      {error ? <p className="text-sm text-rose-800">{error}</p> : null}
    </div>
  );
}
