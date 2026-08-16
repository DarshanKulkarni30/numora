import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export async function writeAuditLog(input: {
  actorEmail: string;
  action: string;
  targetUserId?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  if (!hasServiceRole()) return;
  try {
    const svc = createServiceClient();
    await svc.from("admin_audit_log").insert({
      actor_email: input.actorEmail,
      action: input.action,
      target_user_id: input.targetUserId ?? null,
      meta: input.meta ?? {},
    });
  } catch {
    // non-fatal
  }
}

export async function recordActivity(input: {
  userId?: string | null;
  eventType: string;
  path?: string;
  meta?: Record<string, unknown>;
}): Promise<void> {
  if (!hasServiceRole()) return;
  try {
    const svc = createServiceClient();
    await svc.from("app_activity_events").insert({
      user_id: input.userId ?? null,
      event_type: input.eventType,
      path: input.path ?? null,
      meta: input.meta ?? {},
    });
  } catch {
    // non-fatal
  }
}
