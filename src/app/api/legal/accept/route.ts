import { NextResponse, type NextRequest } from "next/server";
import { CURRENT_TERMS_VERSION } from "@/lib/legal/terms";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let version = CURRENT_TERMS_VERSION;
  try {
    const body = (await request.json()) as { version?: string };
    if (body.version && body.version === CURRENT_TERMS_VERSION) {
      version = body.version;
    }
  } catch {
    // empty body ok
  }

  const { error } = await supabase.from("user_terms_acceptance").upsert(
    {
      user_id: user.id,
      terms_version: version,
      accepted_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message.includes("schema cache") ||
          error.message.includes("does not exist")
            ? "Terms table missing — run the Supabase migration 20260816_terms_acceptance.sql"
            : error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, version });
}
