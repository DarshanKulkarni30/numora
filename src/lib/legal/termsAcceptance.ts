import type { User } from "@supabase/supabase-js";
import { CURRENT_TERMS_VERSION } from "@/lib/legal/terms";

export const TERMS_META_VERSION_KEY = "numora_terms_version";
export const TERMS_META_ACCEPTED_AT_KEY = "numora_terms_accepted_at";

function isMissingTableError(message: string | undefined): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes("schema cache") ||
    m.includes("does not exist") ||
    m.includes("could not find the table")
  );
}

export function termsAcceptedInMetadata(
  user: User | { user_metadata?: Record<string, unknown> } | null,
): boolean {
  const meta = user?.user_metadata as Record<string, unknown> | undefined;
  return meta?.[TERMS_META_VERSION_KEY] === CURRENT_TERMS_VERSION;
}

/** True if current terms are on file (auth metadata and/or SQL table). */
export async function hasAcceptedCurrentTerms(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  user: User | { id: string; user_metadata?: Record<string, unknown> },
): Promise<boolean> {
  if (termsAcceptedInMetadata(user)) return true;
  try {
    const { data, error } = await supabase
      .from("user_terms_acceptance")
      .select("terms_version")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) return false;
    return data?.terms_version === CURRENT_TERMS_VERSION;
  } catch {
    return false;
  }
}

export async function recordTermsAcceptance(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  version: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const iso = new Date().toISOString();
  const { error: metaError } = await supabase.auth.updateUser({
    data: {
      [TERMS_META_VERSION_KEY]: version,
      [TERMS_META_ACCEPTED_AT_KEY]: iso,
    },
  });
  if (metaError) {
    return { ok: false, error: metaError.message };
  }

  const { error: tableError } = await supabase.from("user_terms_acceptance").upsert(
    {
      user_id: userId,
      terms_version: version,
      accepted_at: iso,
    },
    { onConflict: "user_id" },
  );

  // Metadata is the login gate. The SQL table is optional audit when migrated.
  if (tableError && !isMissingTableError(tableError.message)) {
    console.warn("user_terms_acceptance upsert skipped:", tableError.message);
  }

  return { ok: true };
}
