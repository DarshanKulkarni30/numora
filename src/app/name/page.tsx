import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { NamePageTabs } from "@/components/name/NamePageTabs";
import { guessNameFromUser, type PersonRecord } from "@/lib/profile/options";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function NamePage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/name");

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
          <h1 className="text-4xl text-ink">What&apos;s my name</h1>
          <p className="mt-3 text-ink-soft">
            <span className="font-medium text-ink">My name</span> — try
            first/last spellings for someone on your profile.{" "}
            <span className="font-medium text-ink">Ranked spellings</span> —
            variants of this given name ranked against Birth×Destiny.{" "}
            <span className="font-medium text-ink">Name compatibility</span> —
            pair two people (profile or custom partner) with method matrices and
            Amazing / Favourable summary tones. Reflective only, not legal naming
            advice. For mobile and company branding, open{" "}
            <Link href="/business" className="text-gold-deep underline">
              Business numbers
            </Link>
            .
          </p>
        </div>
        <div className="mt-8">
          <NamePageTabs people={people} />
        </div>
      </main>
    </div>
  );
}
