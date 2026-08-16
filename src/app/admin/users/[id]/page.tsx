import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdminNoteForm,
  BlockUserForm,
  PlanOverrideForm,
} from "@/components/admin/UserAdminActions";
import { can } from "@/lib/admin/rbac";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  const gate = await requireAdmin("read_users");
  if (!gate.ok) notFound();

  if (!hasServiceRole()) {
    return (
      <p className="text-sm text-amber-900">
        Set SUPABASE_SERVICE_ROLE_KEY to load user detail.
      </p>
    );
  }

  const svc = createServiceClient();
  const { data: userData, error } = await svc.auth.admin.getUserById(id);
  if (error || !userData?.user) notFound();
  const user = userData.user;

  const [
    { data: people },
    { data: reports },
    { data: mod },
    { data: ent },
    { data: notes },
    { data: activity },
    { data: issues },
  ] = await Promise.all([
    svc
      .from("people")
      .select("*")
      .eq("user_id", id)
      .order("sort_order", { ascending: true }),
    svc
      .from("reports")
      .select("id, full_name, created_at, report_type")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    svc.from("user_moderation").select("*").eq("user_id", id).maybeSingle(),
    svc.from("user_entitlements").select("*").eq("user_id", id).maybeSingle(),
    svc
      .from("admin_notes")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
    svc
      .from("app_activity_events")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(40),
    svc
      .from("admin_issues")
      .select("*")
      .eq("user_id", id)
      .order("updated_at", { ascending: false })
      .limit(20),
  ]);

  const blocked = Boolean(mod?.blocked_at);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/users" className="text-sm text-gold-deep underline">
          ← Users
        </Link>
        <h1 className="mt-2 text-3xl text-ink">{user.email || id}</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {blocked ? "Blocked" : "Active"} · plan{" "}
          {ent?.plan_id || "free"}
          {ent?.current_period_end
            ? ` · until ${new Date(ent.current_period_end).toLocaleDateString()}`
            : ""}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {can(gate.admin.role, "block_users") ? (
          <BlockUserForm userId={id} blocked={blocked} />
        ) : null}
        {can(gate.admin.role, "override_plan") ? (
          <PlanOverrideForm
            userId={id}
            currentPlan={ent?.plan_id || "free"}
          />
        ) : (
          <div className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4 text-sm text-ink-soft">
            Billing read-only for your role. Plan: {ent?.plan_id || "free"}.
            Stripe checkout not connected yet.
          </div>
        )}
      </div>

      <section>
        <h2 className="text-lg text-ink">People ({people?.length ?? 0})</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {(people ?? []).map((p) => (
            <li
              key={p.id}
              className="rounded-lg border border-[var(--line)] bg-white/60 px-3 py-2"
            >
              <span className="text-ink">
                {p.full_name || "—"}
                {p.is_self ? " (Self)" : ` · ${p.relationship}`}
              </span>
              <span className="text-ink-soft"> · DOB {p.date_of_birth || "—"}</span>
              <span className="text-ink-soft">
                {" "}
                · identity edits {p.identity_edit_count ?? 0}
              </span>
            </li>
          ))}
          {!people?.length ? (
            <li className="text-ink-soft">No saved people.</li>
          ) : null}
        </ul>
      </section>

      <section>
        <h2 className="text-lg text-ink">Reports</h2>
        <ul className="mt-2 space-y-1 text-sm text-ink-soft">
          {(reports ?? []).map((r) => (
            <li key={r.id}>
              <Link
                href={`/report/${r.id}`}
                className="text-ink underline"
                target="_blank"
              >
                {r.full_name}
              </Link>{" "}
              · {r.report_type} ·{" "}
              {new Date(r.created_at).toLocaleString()}
            </li>
          ))}
          {!reports?.length ? <li>No reports.</li> : null}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-ink">Admin notes</h2>
        {can(gate.admin.role, "write_notes") ? (
          <AdminNoteForm userId={id} />
        ) : null}
        <ul className="space-y-2 text-sm">
          {(notes ?? []).map((n) => (
            <li
              key={n.id}
              className="rounded-lg border border-[var(--line)] bg-white/60 px-3 py-2"
            >
              <p className="text-[10px] text-ink-soft">
                {n.author_email} · {new Date(n.created_at).toLocaleString()}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-ink">{n.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg text-ink">Linked issues</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {(issues ?? []).map((i) => (
            <li key={i.id}>
              <Link href="/admin/issues" className="underline">
                {i.title}
              </Link>{" "}
              · {i.status} · {i.priority}
            </li>
          ))}
          {!issues?.length ? (
            <li className="text-ink-soft">None</li>
          ) : null}
        </ul>
      </section>

      <section>
        <h2 className="text-lg text-ink">Recent activity</h2>
        <ul className="mt-2 space-y-1 text-sm text-ink-soft">
          {(activity ?? []).map((a) => (
            <li key={a.id}>
              {a.event_type}
              {a.path ? ` · ${a.path}` : ""} ·{" "}
              {new Date(a.created_at).toLocaleString()}
            </li>
          ))}
          {!activity?.length ? <li>No events yet.</li> : null}
        </ul>
      </section>
    </div>
  );
}
