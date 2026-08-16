import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const gate = await requireAdmin("override_plan");
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
  const planId = String(body.planId || "free");
  const days = Number(body.days) || 0;
  const periodEnd =
    days > 0
      ? new Date(Date.now() + days * 864e5).toISOString()
      : null;

  const svc = createServiceClient();
  const { error } = await svc.from("user_entitlements").upsert({
    user_id: id,
    plan_id: planId,
    status: "active",
    current_period_end: periodEnd,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    actorEmail: gate.admin.email,
    action: "user.plan_override",
    targetUserId: id,
    meta: { planId, days, periodEnd },
  });

  return NextResponse.json({ ok: true });
}
