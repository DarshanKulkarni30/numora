"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminInviteForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("operator");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setEmail("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
      <h2 className="font-medium text-ink">Add admin</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm"
      >
        {["superadmin", "operator", "support", "billing"].map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={busy || !email.trim()}
        onClick={submit}
        className="rounded-full bg-sea px-4 py-2 text-sm text-paper hover:bg-sea-deep disabled:opacity-50"
      >
        Invite / upsert
      </button>
      {error ? <p className="text-sm text-rose-800">{error}</p> : null}
    </div>
  );
}

export function AdminDeactivateButton({
  email,
  active,
}: {
  email: string;
  active: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, active: !active }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={toggle}
      className="text-xs text-ink-soft underline hover:text-ink"
    >
      {active ? "Deactivate" : "Reactivate"}
    </button>
  );
}
