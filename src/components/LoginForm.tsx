"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "register";

type Props = {
  nextPath?: string;
  siteUrl?: string;
};

export function LoginForm({ nextPath = "/dashboard", siteUrl }: Props) {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  function origin() {
    return (
      siteUrl ||
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      window.location.origin
    );
  }

  function redirectTo() {
    return `${origin()}/auth/callback?next=${encodeURIComponent(nextPath)}`;
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectTo(),
          // Sign-in: existing accounts only. Register: allow new users.
          shouldCreateUser: mode === "register",
        },
      });
      if (error) throw error;
      setStatus("sent");
      setMessage(
        mode === "register"
          ? "Check your email for a magic link to finish creating your account."
          : "Check your email for a magic link to sign in.",
      );
    } catch (err) {
      setStatus("error");
      const raw =
        err instanceof Error
          ? err.message
          : "Could not send magic link. Check Supabase configuration.";
      const nicer =
        mode === "signin" &&
        /signups not allowed|user not found|unable to validate/i.test(raw)
          ? "No account found for that email. Switch to Register, or try Google."
          : raw;
      setMessage(nicer);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setOauthLoading(true);
    setStatus("idle");
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo(),
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (error) throw error;
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Enable the Google provider in Supabase Auth.",
      );
      setOauthLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      <div className="flex rounded-full border border-[var(--line)] bg-white/50 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setStatus("idle");
            setMessage("");
          }}
          className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
            mode === "signin"
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("register");
            setStatus("idle");
            setMessage("");
          }}
          className={`flex-1 rounded-full px-4 py-2 text-sm transition ${
            mode === "register"
              ? "bg-ink text-paper"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Register
        </button>
      </div>

      <p className="text-center text-sm text-ink-soft">
        {mode === "signin"
          ? "Existing users — email a magic link, or continue with Google."
          : "New users — register with email (magic link) or Google."}
      </p>

      <button
        type="button"
        disabled={oauthLoading || loading}
        onClick={onGoogle}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-6 py-3 text-ink transition hover:bg-mist/80 disabled:opacity-60"
      >
        <GoogleMark />
        {oauthLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 text-xs text-ink-soft">
        <span className="h-px flex-1 bg-[var(--line)]" />
        or email
        <span className="h-px flex-1 bg-[var(--line)]" />
      </div>

      <form onSubmit={onEmailSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm text-ink-soft">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-gold focus:ring-2"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading || oauthLoading}
          className="w-full rounded-full bg-ink px-6 py-3 text-paper transition hover:bg-sea-deep disabled:opacity-60"
        >
          {loading
            ? "Sending…"
            : mode === "register"
              ? "Email me a register link"
              : "Email me a sign-in link"}
        </button>
      </form>

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
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.5 5.7l6.2 5.2C39.2 36.3 44 31 44 24c0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
