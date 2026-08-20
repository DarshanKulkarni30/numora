import { redirect } from "next/navigation";
import { PairCompatibility } from "@/components/family/PairCompatibility";
import { SiteHeader } from "@/components/SiteHeader";
import { guessNameFromUser, type PersonRecord } from "@/lib/profile/options";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function FamilyPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/family");

  const { data } = await supabase
    .from("people")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

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
      },
      ...people,
    ];
  }

  return (
    <div>
      <SiteHeader email={user.email} />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl text-ink">Pair compatibility</h1>
          <p className="mt-3 text-ink-soft">
            Pick any two people from your profile. Optional marriage /
            together-since date unlocks a bond number and a dual Personal Year
            timeline—before vs after in digits, not generic advice. Live view
            only.
          </p>
        </div>
        <div className="mt-10">
          <PairCompatibility people={people} />
        </div>
      </main>
    </div>
  );
}
