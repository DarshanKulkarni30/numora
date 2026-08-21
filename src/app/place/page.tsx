import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { PlaceAnalyzer } from "@/components/place/PlaceAnalyzer";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function PlacePage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/place");

  return (
    <div>
      <SiteHeader email={user.email} />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl text-ink">Address &amp; phone</h1>
          <p className="mt-3 text-ink-soft">
            Reduce a street line or a phone number to 1–9. Addresses mix
            Pythagorean letters with digits; phones use digits only. Playful
            vibration, not property or telecom advice. For how a mobile sits on
            someone&apos;s chart, use{" "}
            <Link href="/mobile" className="text-gold-deep underline">
              Mobile number fit
            </Link>
            .
          </p>
        </div>
        <div className="mt-10">
          <PlaceAnalyzer />
        </div>
      </main>
    </div>
  );
}
