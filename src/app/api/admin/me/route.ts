import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return NextResponse.json({ admin: false }, { status: 200 });
  }
  return NextResponse.json({
    admin: true,
    role: gate.admin.role,
    email: gate.admin.email,
  });
}
