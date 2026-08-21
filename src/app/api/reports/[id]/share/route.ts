import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  createShareToken,
  shareLinksConfigured,
} from "@/lib/report/shareToken";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured on this server." },
      { status: 503 },
    );
  }
  if (!shareLinksConfigured()) {
    return NextResponse.json(
      { error: "Share links are not configured on this server." },
      { status: 503 },
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Report id is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("reports")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message || "Could not create a share link." },
      { status: 500 },
    );
  }
  if (!data) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const { token, expiresAt } = createShareToken(id);
  const origin = new URL(request.url).origin;
  const url = `${origin}/s/${token}`;
  return NextResponse.json({ url, expiresAt, days: 7 });
}
