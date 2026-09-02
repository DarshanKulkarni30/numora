import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileExplorer } from "@/components/mobile/MobileExplorer";
import { guessNameFromUser, type PersonRecord } from "@/lib/profile/options";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function MobilePage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/mobile");

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
      <main className="mx-auto max-w-6xl px-5 pb-20 pt-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl text-ink">Mobile numbers</h1>
          <p className="mt-3 text-ink-soft">
            Pick someone from your profile and check a personal number and a
            business number side by side. Each panel scores the total against
            birth number and destiny, covers quiet Lo Shu cells, reads adjacent
            digit pairs, and flags repeats. Reflective only—not telecom or legal
            advice. For company name + domain + mobile together, use{" "}
            <a href="/business" className="text-gold-deep underline">
              Business numbers
            </a>
            .
          </p>
        </div>
        <div className="mt-10">
          <MobileExplorer people={people} />
        </div>
      </main>
    </div>
  );
}
