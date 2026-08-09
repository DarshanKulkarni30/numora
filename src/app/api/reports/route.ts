import { NextResponse } from "next/server";
import { generateReport } from "@/lib/numerology/report";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured on this server." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const fullName = String(body.fullName || "").trim();
    const dateOfBirth = String(body.dateOfBirth || "").trim();
    const gender = String(body.gender || "").trim();
    const purpose = String(body.purpose || "").trim();
    if (!fullName || !dateOfBirth || !gender || !purpose) {
      return NextResponse.json(
        {
          error:
            "Full name, date of birth, gender, and purpose are required.",
        },
        { status: 400 },
      );
    }

    const report = generateReport({
      fullName,
      preferredName: String(body.preferredName || ""),
      dateOfBirth,
      gender,
      purpose,
    });

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        full_name: report.person.full_name,
        preferred_name: report.person.preferred_name,
        date_of_birth: report.person.date_of_birth,
        age: report.person.age,
        report_type: report.person.report_type,
        snapshot: report.numerology_snapshot,
        report,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Could not save report." },
        { status: 500 },
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Could not generate report.",
      },
      { status: 400 },
    );
  }
}
