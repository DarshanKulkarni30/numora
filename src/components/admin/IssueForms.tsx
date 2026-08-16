"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function IssueCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");
  const [priority, setPriority] = useState("normal");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          userId: userId || null,
          priority,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setTitle("");
      setBody("");
      setUserId("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
      <h2 className="font-medium text-ink">New issue</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Details"
        rows={3}
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
      />
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Linked user id (optional)"
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
      >
        {["low", "normal", "high", "urgent"].map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={busy || !title.trim()}
        onClick={submit}
        className="rounded-full bg-sea px-4 py-2 text-sm text-paper hover:bg-sea-deep disabled:opacity-50"
      >
        Create
      </button>
      {error ? <p className="text-sm text-rose-800">{error}</p> : null}
    </div>
  );
}

export function IssueStatusButtons({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-1">
      {["open", "in_progress", "resolved", "closed"]
        .filter((s) => s !== status)
        .map((s) => (
          <button
            key={s}
            type="button"
            disabled={busy}
            onClick={() => setStatus(s)}
            className="rounded-full border border-[var(--line)] px-2 py-0.5 text-xs text-ink-soft hover:text-ink"
          >
            {s}
          </button>
        ))}
    </div>
  );
}
