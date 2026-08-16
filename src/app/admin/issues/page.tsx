import {
  IssueCreateForm,
  IssueStatusButtons,
} from "@/components/admin/IssueForms";
import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

export default async function AdminIssuesPage() {
  if (!hasServiceRole()) {
    return (
      <p className="text-sm text-amber-900">
        Set SUPABASE_SERVICE_ROLE_KEY for issues.
      </p>
    );
  }
  const svc = createServiceClient();
  const { data, error } = await svc
    .from("admin_issues")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-ink">Issues</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Support tickets and operational follow-ups.
        </p>
      </div>
      <IssueCreateForm />
      {error ? <p className="text-sm text-rose-800">{error.message}</p> : null}
      <ul className="space-y-3">
        {(data ?? []).map((i) => (
          <li
            key={i.id}
            className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-ink">{i.title}</p>
                <p className="text-xs text-ink-soft">
                  {i.status} · {i.priority}
                  {i.user_id ? (
                    <>
                      {" "}
                      ·{" "}
                      <a
                        href={`/admin/users/${i.user_id}`}
                        className="underline"
                      >
                        user
                      </a>
                    </>
                  ) : null}{" "}
                  · {i.created_by}
                </p>
              </div>
              <IssueStatusButtons id={i.id} status={i.status} />
            </div>
            {i.body ? (
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink-soft">
                {i.body}
              </p>
            ) : null}
          </li>
        ))}
        {!data?.length ? (
          <li className="text-sm text-ink-soft">No issues yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
