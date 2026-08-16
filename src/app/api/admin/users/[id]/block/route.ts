import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const gate = await requireAdmin("block_users");
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }
  if (!hasServiceRole()) {
    return NextResponse.json(
      { error: "Service role not configured." },
      { status: 503 },
    );
  }

  const { id } = await ctx.params;
  const body = await request.json();
  const blocked = Boolean(body.blocked);
  const reason = String(body.reason || "").trim();

  const svc = createServiceClient();
  const payload = {
    user_id: id,
    blocked_at: blocked ? new Date().toISOString() : null,
    blocked_reason: blocked ? reason || "Blocked by admin" : null,
    blocked_by: blocked ? gate.admin.email : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await svc.from("user_moderation").upsert(payload);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    actorEmail: gate.admin.email,
    action: blocked ? "user.block" : "user.unblock",
    targetUserId: id,
    meta: { reason: reason || null },
  });

  return NextResponse.json({ ok: true });
}
