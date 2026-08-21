import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { DailyLoopCard } from "@/components/today/DailyLoopCard";
import { guessNameFromUser, type PersonRecord } from "@/lib/profile/options";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isValidDob } from "@/lib/profile/date";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  if (!isSupabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/today");

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

  const self =
    people.find((p) => p.is_self && isValidDob(p.date_of_birth)) ??
    people.find((p) => isValidDob(p.date_of_birth));

  return (
    <div>
      <SiteHeader email={user.email} />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl text-ink">Today</h1>
          <p className="mt-3 text-ink-soft">
            Personal Day already lives on your chart. This page is the habit
            loop: today&apos;s number, seven days ahead, and Essence as slower
            weather. Not a daily horoscope product.
          </p>
        </div>
        <div className="mt-10">
          {self ? (
            <DailyLoopCard
              natalName={self.full_name || self.preferred_name}
              dateOfBirth={self.date_of_birth}
            />
          ) : (
            <p className="text-sm text-ink-soft">
              Add a date of birth on your{" "}
              <Link href="/profile" className="text-gold-deep underline">
                profile
              </Link>{" "}
              to read today&apos;s Personal Day.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
