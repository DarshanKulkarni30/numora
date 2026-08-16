import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const gate = await requireAdmin("write_notes");
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
  const userId = String(body.userId || "");
  const note = String(body.body || "").trim();
  if (!userId || !note) {
    return NextResponse.json({ error: "userId and body required." }, { status: 400 });
  }

  const svc = createServiceClient();
  const { error } = await svc.from("admin_notes").insert({
    user_id: userId,
    author_email: gate.admin.email,
    body: note,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    actorEmail: gate.admin.email,
    action: "user.note",
    targetUserId: userId,
    meta: { length: note.length },
  });

  return NextResponse.json({ ok: true });
}
