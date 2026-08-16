import { SiteHeader } from "@/components/SiteHeader";
import { LoginForm } from "@/components/LoginForm";
import { BRAND_NAME, getSiteUrl } from "@/lib/site";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;
  const configured = isSupabaseConfigured();
  const siteUrl = getSiteUrl();

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-4xl text-ink">Welcome to {BRAND_NAME}</h1>
          <p className="mt-3 text-ink-soft">
            Sign in if you already have an account, or register if you&apos;re
            new. Use Google (your Chrome profile) or an email magic link.
          </p>
          {error ? (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              Sign-in couldn&apos;t finish ({error}). Try Google again or request
              a new email link.
            </p>
          ) : null}
        </div>
        <div className="mt-10">
          {configured ? (
            <LoginForm nextPath={next || "/dashboard"} siteUrl={siteUrl} />
          ) : (
            <div className="mx-auto max-w-md rounded-2xl border border-[var(--line)] bg-white/60 p-6 text-sm leading-7 text-ink-soft">
              <p className="font-medium text-ink">Supabase setup needed</p>
              <p className="mt-2">
                Copy <code>.env.local.example</code> to{" "}
                <code>.env.local</code>, add your project URL and anon key, run{" "}
                <code>supabase/schema.sql</code> in the SQL editor, then enable
                Email magic-link auth and the Google provider.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
