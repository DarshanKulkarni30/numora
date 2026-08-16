import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) redirect("/login");

  const gate = await requireAdmin();
  if (!gate.ok) {
    if (gate.status === 401) redirect("/login?next=/admin");
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <SiteHeader email={user?.email} />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 pb-20 pt-6 lg:flex-row">
        <AdminNav role={gate.admin.role} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
