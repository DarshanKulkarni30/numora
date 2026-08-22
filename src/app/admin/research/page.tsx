import { redirect } from "next/navigation";
import { ResearchDashboard } from "@/components/admin/ResearchDashboard";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import gold from "@/data/research/public-figures.gold.json";
import type { PublicFigureGold } from "@/lib/research/publicFigures";

export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  const gate = await requireAdmin("read_research");
  if (!gate.ok) {
    if (gate.status === 401) redirect("/login?next=/admin/research");
    redirect("/admin");
  }
  return <ResearchDashboard gold={gold as PublicFigureGold} />;
}
