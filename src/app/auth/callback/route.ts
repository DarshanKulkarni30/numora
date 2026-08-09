import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSiteUrl } from "@/lib/site";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/")) next = "/dashboard";

  const site = getSiteUrl();
  const redirectTo = new URL(next, site);

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", site));
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.redirect(new URL("/login?error=config", site));
  }

  // Build the redirect first, then attach auth cookies onto THAT response.
  // Using cookies() alone often drops the session on redirect in App Router.
  let response = NextResponse.redirect(redirectTo);

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.redirect(redirectTo);
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, site),
    );
  }

  return response;
}
