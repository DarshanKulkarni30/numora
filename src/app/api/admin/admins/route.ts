import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const gate = await requireAdmin("manage_admins");
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
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const role = String(body.role || "operator");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }
  if (!["superadmin", "operator", "support", "billing"].includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const svc = createServiceClient();
  const { error } = await svc.from("admin_users").upsert({
    email,
    role,
    active: true,
    created_by: gate.admin.email,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    actorEmail: gate.admin.email,
    action: "admin.upsert",
    meta: { email, role },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  const gate = await requireAdmin("manage_admins");
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
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const active = Boolean(body.active);

  const svc = createServiceClient();
  const { error } = await svc
    .from("admin_users")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("email", email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await writeAuditLog({
    actorEmail: gate.admin.email,
    action: active ? "admin.reactivate" : "admin.deactivate",
    meta: { email },
  });

  return NextResponse.json({ ok: true });
}
