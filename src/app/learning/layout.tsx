import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import {
  resolveEntitlements,
  type EntitlementRow,
} from "@/lib/entitlements";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/learning");

  let entitlementRow: EntitlementRow | null = null;
  try {
    const { data: ent } = await supabase
      .from("user_entitlements")
      .select("plan_id, status, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();
    entitlementRow = (ent as EntitlementRow) ?? null;
  } catch {
    entitlementRow = null;
  }
  const entitlements = resolveEntitlements(user.email, entitlementRow);

  return (
    <div>
      <SiteHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        <nav className="mb-6 text-sm text-ink-soft">
          <Link href="/learning" className="text-gold-deep underline">
            Learning
          </Link>
          {!entitlements.features.learningFull ? (
            <span className="ml-2 rounded-full border border-[var(--line)] bg-white/60 px-2 py-0.5 text-xs">
              Free intro
            </span>
          ) : null}
        </nav>
        {children}
      </main>
    </div>
  );
}
