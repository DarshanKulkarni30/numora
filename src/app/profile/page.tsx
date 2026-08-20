import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ProfileForm } from "@/components/ProfileForm";
import { resolveEntitlements, type EntitlementRow } from "@/lib/entitlements";
import { guessNameFromUser, type PersonRecord } from "@/lib/profile/options";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("people")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

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

  let people = (data ?? []) as PersonRecord[];
  if (!people.some((p) => p.is_self)) {
    const guessed = guessNameFromUser(user);
    people = [
      {
        is_self: true,
        relationship: "Self",
        full_name: guessed.fullName,
        preferred_name: guessed.preferredName,
        date_of_birth: "",
        gender: "",
        purpose: "",
        sort_order: 0,
        name_history: [],
        identity_edit_count: 0,
      },
      ...people,
    ];
  }

  return (
    <div>
      <SiteHeader email={user.email} />
      <main className="mx-auto max-w-6xl px-5 pb-36 pt-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl text-ink sm:text-4xl">Profile settings</h1>
          <p className="mt-2 text-sm text-ink-soft sm:text-base">
            Save yourself
            {entitlements.maxFamily > 0
              ? ` and up to ${entitlements.maxFamily} family member${entitlements.maxFamily === 1 ? "" : "s"}`
              : ""}
            . Switch people with the tabs — Add and Save stay on screen.
          </p>
        </div>
        <div className="mt-10">
          <ProfileForm
            email={user.email}
            initialPeople={people}
            initialEntitlements={entitlements}
          />
        </div>
      </main>
    </div>
  );
}
