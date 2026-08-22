import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const MAX_IDS = 80;

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured on this server." },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const ids = Array.isArray(body.ids)
    ? [...new Set(body.ids.map((id: unknown) => String(id || "").trim()).filter(Boolean))]
    : [];

  if (!ids.length) {
    return NextResponse.json({ error: "Select at least one report." }, { status: 400 });
  }
  if (ids.length > MAX_IDS) {
    return NextResponse.json(
      { error: `You can delete up to ${MAX_IDS} reports at a time.` },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("reports")
    .delete()
    .eq("user_id", user.id)
    .in("id", ids)
    .select("id");

  if (error) {
    return NextResponse.json(
      { error: error.message || "Could not delete reports." },
      { status: 500 },
    );
  }

  const deleted = (data ?? []).map((row) => row.id);
  return NextResponse.json({ ok: true, deleted, count: deleted.length });
}
