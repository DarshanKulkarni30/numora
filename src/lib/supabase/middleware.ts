import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { CURRENT_TERMS_VERSION } from "@/lib/legal/terms";

async function isUserBlocked(userId: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  try {
    const svc = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await svc
      .from("user_moderation")
      .select("blocked_at")
      .eq("user_id", userId)
      .maybeSingle();
    return Boolean(data?.blocked_at);
  } catch {
    return false;
  }
}

async function hasAcceptedCurrentTerms(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
): Promise<boolean | "unknown"> {
  try {
    const { data, error } = await supabase
      .from("user_terms_acceptance")
      .select("terms_version")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      // Table missing or RLS — do not lock the whole app before migration.
      return "unknown";
    }
    return data?.terms_version === CURRENT_TERMS_VERSION;
  } catch {
    return "unknown";
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            path: options?.path ?? "/",
            sameSite: options?.sameSite ?? "lax",
            secure:
              options?.secure ?? process.env.NODE_ENV === "production",
          }),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const code = request.nextUrl.searchParams.get("code");

  if (code && path !== "/auth/callback") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/callback";
    const next = request.nextUrl.searchParams.get("next") || "/dashboard";
    redirectUrl.searchParams.set("next", next);
    return NextResponse.redirect(redirectUrl);
  }

  const protectedPaths = [
    "/dashboard",
    "/report",
    "/profile",
    "/trivia",
    "/family",
    "/name",
    "/years",
    "/business",
    "/mobile",
    "/learning",
    "/admin",
  ];
  const isProtected = protectedPaths.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  const appPaths = [
    "/dashboard",
    "/report",
    "/profile",
    "/trivia",
    "/family",
    "/name",
    "/years",
    "/business",
    "/mobile",
    "/learning",
    "/api/profile",
    "/api/reports",
  ];
  const isAppPath = appPaths.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );

  if (
    user &&
    isAppPath &&
    path !== "/account-restricted" &&
    !path.startsWith("/admin")
  ) {
    if (await isUserBlocked(user.id)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/account-restricted";
      return NextResponse.redirect(redirectUrl);
    }

    const termsOk = await hasAcceptedCurrentTerms(supabase, user.id);
    if (termsOk === false) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/legal/accept";
      redirectUrl.searchParams.set("next", path);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (path === "/login" && user) {
    const termsOk = await hasAcceptedCurrentTerms(supabase, user.id);
    const redirectUrl = request.nextUrl.clone();
    if (termsOk === false) {
      redirectUrl.pathname = "/legal/accept";
      redirectUrl.searchParams.set("next", "/dashboard");
    } else {
      redirectUrl.pathname = "/dashboard";
    }
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
