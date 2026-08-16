import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AccountRestrictedPage() {
  let email: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      email = user?.email ?? null;
    } catch {
      email = null;
    }
  }

  return (
    <div>
      <SiteHeader email={email} />
      <main className="mx-auto max-w-lg px-5 py-20 text-center">
        <h1 className="text-3xl text-ink">Account restricted</h1>
        <p className="mt-4 text-ink-soft">
          This account has been blocked by an administrator. If you believe this
          is a mistake, contact support with the email you use to sign in.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-sea px-6 py-3 text-paper hover:bg-sea-deep"
        >
          Home
        </Link>
      </main>
    </div>
  );
}
