import { NextResponse } from "next/server";
import {
  GENDER_OPTIONS,
  PURPOSE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  guessNameFromUser,
  type PersonRecord,
} from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";
import { normalizeNameHistory } from "@/lib/profile/nameHistory";
import {
  resolveEntitlements,
  type EntitlementRow,
} from "@/lib/entitlements";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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
    name_history: [],
    identity_edit_count: 0,
  };
}

async function loadEntitlementRow(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
): Promise<EntitlementRow | null> {
  try {
    const { data } = await supabase
      .from("user_entitlements")
      .select("plan_id, status, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();
    return (data as EntitlementRow) ?? null;
  } catch {
    return null;
  }
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

  let people: PersonRecord[] = ((data ?? []) as PersonRecord[]).map((p) => ({
    ...p,
    name_history: Array.isArray(p.name_history) ? p.name_history : [],
  }));
  if (!people.some((p) => p.is_self)) {
    people = [emptySelf(user), ...people];
  }

  const row = await loadEntitlementRow(supabase, user.id);
  const entitlements = resolveEntitlements(user.email, row);

  return NextResponse.json({
    email: user.email,
    people,
    maxFamily: entitlements.maxFamily,
    maxPeople: entitlements.maxPeople,
    entitlements,
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
  const confirmed = Boolean(body.identityConfirmed);

  const selfRows = incoming.filter((p: PersonRecord) => p.is_self);
  if (selfRows.length !== 1) {
    return NextResponse.json(
      { error: "Profile must include exactly one Self entry." },
      { status: 400 },
    );
  }

  const row = await loadEntitlementRow(supabase, user.id);
  const entitlements = resolveEntitlements(user.email, row);

  if (incoming.length > entitlements.maxPeople) {
    return NextResponse.json(
      {
        error: `Your plan allows up to ${entitlements.maxPeople} profile${entitlements.maxPeople === 1 ? "" : "s"} (including Self).`,
      },
      { status: 400 },
    );
  }

  const { data: existingRows } = await supabase
    .from("people")
    .select("*")
    .eq("user_id", user.id);
  const existingById = new Map(
    ((existingRows ?? []) as PersonRecord[])
      .filter((p) => p.id)
      .map((p) => [p.id as string, p]),
  );

  const normalized: Array<
    PersonRecord & {
      identity_edit_count: number;
      identity_confirmed_at: string | null;
    }
  > = [];
  const nowIso = new Date().toISOString();

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

    const historyNorm = normalizeNameHistory(p.name_history, date_of_birth);
    if (historyNorm.error) {
      return NextResponse.json({ error: historyNorm.error }, { status: 400 });
    }

    const prev = p.id ? existingById.get(p.id) : undefined;
    let identity_edit_count = prev?.identity_edit_count ?? 0;
    let identity_confirmed_at = prev?.identity_confirmed_at ?? null;

    const identityChanged =
      prev &&
      (prev.full_name.trim() !== full_name ||
        prev.date_of_birth.trim() !== date_of_birth);

    if (!prev) {
      if (!confirmed) {
        return NextResponse.json(
          {
            error:
              "Confirm each person’s full name spelling before saving new profiles.",
          },
          { status: 400 },
        );
      }
      identity_edit_count = 0;
      identity_confirmed_at = nowIso;
    } else if (identityChanged) {
      const limit = entitlements.identityEditLimit;
      if (limit != null && identity_edit_count >= limit) {
        return NextResponse.json(
          {
            error: `Identity fields (full name and date of birth) for ${prev.full_name || "this person"} can only be changed ${limit} times. Preferred name and other fields can still be edited.`,
          },
          { status: 400 },
        );
      }
      if (!confirmed) {
        return NextResponse.json(
          {
            error:
              "Confirm spelling when changing full name or date of birth.",
          },
          { status: 400 },
        );
      }
      identity_edit_count += 1;
      identity_confirmed_at = nowIso;
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
      name_history: historyNorm.eras,
      identity_edit_count,
      identity_confirmed_at,
    });
  }

  const payload = normalized.map((p) => ({
    user_id: user.id,
    ...p,
    updated_at: nowIso,
  }));

  type InsertResult = {
    data: PersonRecord[] | null;
    error: { message: string } | null;
  };

  const insertRows = async (rows: object[]): Promise<InsertResult> => {
    const result = await supabase
      .from("people")
      .insert(rows)
      .select("*")
      .order("sort_order", { ascending: true });
    return {
      data: (result.data ?? null) as PersonRecord[] | null,
      error: result.error,
    };
  };

  let inserted = await insertRows(payload);
  let historyStripped = false;

  if (inserted.error && /name_history/i.test(inserted.error.message)) {
    historyStripped = true;
    inserted = await insertRows(
      payload.map((row) => {
        const copy = { ...row } as Record<string, unknown>;
        delete copy.name_history;
        return copy;
      }),
    );
  }

  if (
    inserted.error &&
    /identity_edit_count|identity_confirmed_at/i.test(inserted.error.message)
  ) {
    inserted = await insertRows(
      payload.map((row) => {
        const copy = { ...row } as Record<string, unknown>;
        delete copy.identity_edit_count;
        delete copy.identity_confirmed_at;
        if (historyStripped) delete copy.name_history;
        return copy;
      }),
    );
  }

  if (inserted.error || !inserted.data?.length) {
    return NextResponse.json(
      {
        error:
          inserted.error?.message ||
          "Could not save profile. Existing people were left unchanged.",
      },
      { status: 500 },
    );
  }

  const keepIds = inserted.data
    .map((p) => p.id)
    .filter((id): id is string => Boolean(id));
  const staleIds = ((existingRows ?? []) as PersonRecord[])
    .map((p) => p.id)
    .filter((id): id is string => typeof id === "string" && !keepIds.includes(id));
  if (staleIds.length) {
    const { error: delError } = await supabase
      .from("people")
      .delete()
      .eq("user_id", user.id)
      .in("id", staleIds);
    if (delError) {
      return NextResponse.json(
        {
          people: inserted.data,
          entitlements,
          warning:
            "Profile saved, but older duplicate rows could not be removed. Save once more if you see extra people.",
        },
      );
    }
  }

  const { recordActivity } = await import("@/lib/admin/audit");
  await recordActivity({
    userId: user.id,
    eventType: "profile_saved",
    path: "/api/profile",
    meta: { count: normalized.length },
  });

  const hadHistory = normalized.some((p) => (p.name_history?.length ?? 0) > 0);
  return NextResponse.json({
    people: inserted.data,
    entitlements,
    warning:
      historyStripped && hadHistory
        ? "Profile saved. Later names were not stored yet — add the name_history column in Supabase (supabase/migrations/20260820_name_history.sql) and save again."
        : undefined,
  });
}
