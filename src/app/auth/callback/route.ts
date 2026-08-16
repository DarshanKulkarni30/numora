import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSiteUrl } from "@/lib/site";
import { CURRENT_TERMS_VERSION } from "@/lib/legal/terms";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/")) next = "/dashboard";

  const site = getSiteUrl();

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", site));
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.redirect(new URL("/login?error=config", site));
  }

  // Default post-login destination; may switch to Terms accept.
  let redirectTo = new URL(next, site);

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
          response.cookies.set(name, value, {
            ...options,
            path: options?.path ?? "/",
            sameSite: options?.sameSite ?? "lax",
            secure:
              options?.secure ?? process.env.NODE_ENV === "production",
          });
        });
      },
    },
  });

  const { data: sessionData, error } =
    await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, site),
    );
  }

  try {
    const { recordActivity } = await import("@/lib/admin/audit");
    await recordActivity({
      userId: sessionData.user?.id,
      eventType: "login",
      path: "/auth/callback",
    });
  } catch {
    // non-fatal
  }

  // If Terms not accepted, send to accept while keeping session cookies.
  try {
    const uid = sessionData.user?.id;
    if (uid) {
      const { data: terms } = await supabase
        .from("user_terms_acceptance")
        .select("terms_version")
        .eq("user_id", uid)
        .maybeSingle();
      if (terms?.terms_version !== CURRENT_TERMS_VERSION) {
        redirectTo = new URL("/legal/accept", site);
        redirectTo.searchParams.set("next", next);
        const cookies = response.cookies.getAll();
        response = NextResponse.redirect(redirectTo);
        cookies.forEach((c) => {
          response.cookies.set(c.name, c.value);
        });
      }
    }
  } catch {
    // Table missing — continue to app; run migration to enable gate.
  }

  return response;
}
