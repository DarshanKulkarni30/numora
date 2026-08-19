import { NextResponse, type NextRequest } from "next/server";
import { CURRENT_TERMS_VERSION } from "@/lib/legal/terms";
import { recordTermsAcceptance } from "@/lib/legal/termsAcceptance";
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

  const result = await recordTermsAcceptance(supabase, user.id, version);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await supabase.auth.refreshSession();

  return NextResponse.json({ ok: true, version });
}
