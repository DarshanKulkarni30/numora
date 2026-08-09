"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/dashboard" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      });
      if (error) throw error;
      setStatus("sent");
      setMessage("Check your email for the magic link to continue.");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Could not send magic link. Check Supabase configuration.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm text-ink-soft">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-gold focus:ring-2"
          placeholder="you@example.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-ink px-6 py-3 text-paper transition hover:bg-sea-deep disabled:opacity-60"
      >
        {loading ? "Sending…" : "Email me a magic link"}
      </button>
      {message ? (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            status === "error"
              ? "bg-red-50 text-red-800"
              : "bg-gold/15 text-ink"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
