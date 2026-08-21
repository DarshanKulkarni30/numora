import { createServiceClient, hasServiceRole } from "@/lib/supabase/service";
import { verifyShareToken } from "@/lib/report/shareToken";
import type { NumerologyReport } from "@/lib/numerology/types";

export type SharedReading = {
  report: NumerologyReport;
  reportId: string;
  expiresAt: string;
};

export async function loadSharedReading(
  token: string,
): Promise<SharedReading | null> {
  const parsed = verifyShareToken(token);
  if (!parsed) return null;
  if (!hasServiceRole()) return null;
  const svc = createServiceClient();
  const { data, error } = await svc
    .from("reports")
    .select("id, report")
    .eq("id", parsed.reportId)
    .maybeSingle();
  if (error || !data?.report) return null;
  return {
    report: data.report as NumerologyReport,
    reportId: data.id as string,
    expiresAt: parsed.expiresAt,
  };
}

export function decodeShareTokenParam(raw: string | string[]): string {
  const value = Array.isArray(raw) ? raw.join(".") : raw;
  return decodeURIComponent(value);
}
