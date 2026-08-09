import { NextResponse } from "next/server";
import {
  GENDER_OPTIONS,
  PURPOSE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  guessNameFromUser,
  type PersonRecord,
} from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const MAX_FAMILY = 3;

function emptySelf(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): PersonRecord {
  const guessed = guessNameFromUser(user);
  return {
    is_self: true,
    relationship: "Self",
    full_name: guessed.fullName,
    preferred_name: guessed.preferredName,
    date_of_birth: "",
    gender: "",
    purpose: "",
    sort_order: 0,
  };
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let people = (data ?? []) as PersonRecord[];
  if (!people.some((p) => p.is_self)) {
    people = [emptySelf(user), ...people];
  }

  return NextResponse.json({
    email: user.email,
    people,
    options: {
      gender: GENDER_OPTIONS,
      purpose: PURPOSE_OPTIONS,
      relationship: RELATIONSHIP_OPTIONS,
    },
  });
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const body = await request.json();
  const incoming = Array.isArray(body.people) ? body.people : [];

  const selfRows = incoming.filter((p: PersonRecord) => p.is_self);
  if (selfRows.length !== 1) {
    return NextResponse.json(
      { error: "Profile must include exactly one Self entry." },
      { status: 400 },
    );
  }

  const family = incoming.filter((p: PersonRecord) => !p.is_self);
  if (family.length > MAX_FAMILY) {
    return NextResponse.json(
      { error: `You can save up to ${MAX_FAMILY} family members.` },
      { status: 400 },
    );
  }

  const normalized: PersonRecord[] = [];
  for (let i = 0; i < incoming.length; i++) {
    const p = incoming[i] as PersonRecord;
    const full_name = String(p.full_name || "").trim();
    const date_of_birth = String(p.date_of_birth || "").trim();
    const gender = String(p.gender || "").trim();
    const purpose = String(p.purpose || "").trim();
    const relationship = p.is_self
      ? "Self"
      : String(p.relationship || "").trim();

    if (!full_name || !date_of_birth || !gender || !purpose) {
      return NextResponse.json(
        {
          error:
            "Each person needs full name, date of birth, gender, and purpose.",
        },
        { status: 400 },
      );
    }
    if (!isValidDob(date_of_birth)) {
      return NextResponse.json(
        { error: `Invalid date of birth for ${full_name}.` },
        { status: 400 },
      );
    }
    if (!GENDER_OPTIONS.includes(gender as (typeof GENDER_OPTIONS)[number])) {
      return NextResponse.json({ error: "Invalid gender option." }, { status: 400 });
    }
    if (!PURPOSE_OPTIONS.includes(purpose as (typeof PURPOSE_OPTIONS)[number])) {
      return NextResponse.json({ error: "Invalid purpose option." }, { status: 400 });
    }
    if (
      !p.is_self &&
      !RELATIONSHIP_OPTIONS.includes(
        relationship as (typeof RELATIONSHIP_OPTIONS)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Invalid relationship option." },
        { status: 400 },
      );
    }

    normalized.push({
      is_self: Boolean(p.is_self),
      relationship,
      full_name,
      preferred_name: String(p.preferred_name || "").trim(),
      date_of_birth,
      gender,
      purpose,
      sort_order: i,
    });
  }

  const { error: delError } = await supabase
    .from("people")
    .delete()
    .eq("user_id", user.id);
  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("people")
    .insert(
      normalized.map((p) => ({
        user_id: user.id,
        ...p,
        updated_at: new Date().toISOString(),
      })),
    )
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ people: data });
}
