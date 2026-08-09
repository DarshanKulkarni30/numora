import { SiteHeader } from "@/components/SiteHeader";
import { LoginForm } from "@/components/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-4xl text-ink">Sign in to Numerora</h1>
          <p className="mt-3 text-ink-soft">
            We&apos;ll email you a magic link—no password to remember.
          </p>
        </div>
        <div className="mt-10">
          {configured ? (
            <LoginForm nextPath={next || "/dashboard"} />
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border border-[var(--line)] bg-white/60 p-6 text-sm leading-7 text-ink-soft">
              <p className="font-medium text-ink">Supabase setup needed</p>
              <p className="mt-2">
                Copy <code>.env.local.example</code> to{" "}
                <code>.env.local</code>, add your project URL and anon key, run{" "}
                <code>supabase/schema.sql</code> in the SQL editor, then enable
                Email magic-link auth.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
