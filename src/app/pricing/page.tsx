import { SiteHeader } from "@/components/SiteHeader";
import { PLANS, SELLABLE_PLANS } from "@/lib/entitlements";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
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
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl text-ink">Plans</h1>
          <p className="mt-3 text-ink-soft">
            Checkout is not live yet. Soft-launch testing is open; paid packs
            will plug into these plans when billing ships.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SELLABLE_PLANS.map((id) => {
            const plan = PLANS[id];
            return (
              <div
                key={id}
                className="rounded-2xl border border-[var(--line)] bg-white/70 px-5 py-6"
              >
                <p className="text-sm uppercase tracking-wider text-gold-deep">
                  {plan.label}
                </p>
                <p className="mt-2 brand text-3xl text-ink">
                  {plan.priceUsd === 0
                    ? "Free"
                    : plan.priceUsd != null
                      ? `$${plan.priceUsd}`
                      : "—"}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  Up to {plan.maxPeople} profile
                  {plan.maxPeople === 1 ? "" : "s"}
                  {plan.features.business ? " · Business tools" : ""}
                  {plan.features.pdf ? " · PDF when ready" : " · View-only"}
                </p>
                <p className="mt-4 text-sm leading-6 text-ink-soft">
                  {plan.blurb}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-sm text-ink-soft">
          Name, family, trivia, and mobile explorers are included on Free.
          Business company-name tools and PDF export unlock with paid packs.{" "}
          <Link href="/" className="text-gold-deep underline">
            Back home
          </Link>
        </p>
      </main>
    </div>
  );
}
