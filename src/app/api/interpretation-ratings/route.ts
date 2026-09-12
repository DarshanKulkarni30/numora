import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const PANEL_ID = /^[a-z0-9._-]{2,80}$/i;

function cleanNumbers(raw: unknown): Record<string, string | number | null> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Record<string, string | number | null> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (key.length > 40) continue;
    if (typeof value === "number" && Number.isFinite(value)) {
      out[key] = value;
    } else if (typeof value === "string" && value.length <= 40) {
      out[key] = value;
    } else if (value == null) {
      out[key] = null;
    }
  }
  return out;
}

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

  let body: {
    panel_id?: unknown;
    interpretation_version?: unknown;
    numbers?: unknown;
    rating?: unknown;
    feedback_type?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const panelId = String(body.panel_id ?? "");
  if (!PANEL_ID.test(panelId)) {
    return NextResponse.json({ error: "Unknown panel" }, { status: 400 });
  }
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1 to 5" }, { status: 400 });
  }
  const interpretationVersion = String(body.interpretation_version ?? "1.0").slice(
    0,
    20,
  );
  const feedbackType = String(body.feedback_type ?? "panel").slice(0, 32);

  const { error } = await supabase.from("interpretation_ratings").insert({
    user_id: user.id,
    panel_id: panelId,
    interpretation_version: interpretationVersion,
    numbers: cleanNumbers(body.numbers),
    rating,
    feedback_type: feedbackType,
  });

  if (error) {
    const missing =
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      /interpretation_ratings/i.test(error.message);
    return NextResponse.json(
      { error: missing ? "Ratings table is not live yet" : error.message },
      { status: missing ? 503 : 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
