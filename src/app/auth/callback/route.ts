import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const site = getSiteUrl();

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${site}${next.startsWith("/") ? next : `/${next}`}`);
    }
  }

  return NextResponse.redirect(`${site}/login?error=auth`);
}
