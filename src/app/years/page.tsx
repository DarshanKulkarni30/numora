import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { YearOutlookExplorer } from "@/components/years/YearOutlookExplorer";
import { guessNameFromUser, type PersonRecord } from "@/lib/profile/options";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { YearSystemTab } from "@/lib/numerology/yearPage";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ tab?: string; dob?: string; name?: string }>;
};

export default async function YearsPage({ searchParams }: Props) {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/years");

  const { tab, dob, name } = await searchParams;
  const initialTab: YearSystemTab = tab === "vedic" ? "vedic" : "western";

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
          <h1 className="text-4xl text-ink">Personal year</h1>
          <p className="mt-3 text-ink-soft">
            See the year number from birth through age 70. Personal Year is the
            Western cycle; Vedic uses the weekday of that year’s birthday.
            Click a year for the longer reading. For name and mobile fit, open{" "}
            <Link href="/name" className="text-gold-deep underline">
              What&apos;s my name
            </Link>
            .
          </p>
        </div>
        <div className="mt-10">
          <YearOutlookExplorer
            people={people}
            initialTab={initialTab}
            initialDob={dob}
            initialName={name}
          />
        </div>
      </main>
    </div>
  );
}
