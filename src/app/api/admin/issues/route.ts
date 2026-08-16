import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const gate = await requireAdmin("manage_issues");
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }
  if (!hasServiceRole()) {
    return NextResponse.json(
      { error: "Service role not configured." },
      { status: 503 },
    );
  }

  const body = await request.json();
  const title = String(body.title || "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title required." }, { status: 400 });
  }

  const svc = createServiceClient();
  const { data, error } = await svc
    .from("admin_issues")
    .insert({
      title,
      body: String(body.body || ""),
      user_id: body.userId || null,
      priority: body.priority || "normal",
      status: "open",
      created_by: gate.admin.email,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    actorEmail: gate.admin.email,
    action: "issue.create",
    targetUserId: body.userId || null,
    meta: { id: data.id, title },
  });

  return NextResponse.json({ ok: true, id: data.id });
}
