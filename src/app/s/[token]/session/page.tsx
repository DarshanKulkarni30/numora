import { notFound } from "next/navigation";
import { ReadingRoom } from "@/components/session/ReadingRoom";
import { applyLivingTiming } from "@/lib/numerology/livingTiming";
import { buildEnhancedReading } from "@/lib/numerology/enhanced";
import {
  decodeShareTokenParam,
  loadSharedReading,
} from "@/lib/report/loadSharedReading";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function SharedSessionPage({ params }: Props) {
  const { token: raw } = await params;
  const token = decodeShareTokenParam(raw);
  const shared = await loadSharedReading(token);
  if (!shared) notFound();

  const live = applyLivingTiming(shared.report);
  const reading = buildEnhancedReading(live, { reportId: shared.reportId });
  const name =
    live.person.preferred_name?.trim() || live.person.full_name;

  return (
    <ReadingRoom
      reading={reading}
      displayName={name}
      exitHref={`/s/${token}`}
      shared
      expiresAt={shared.expiresAt}
    />
  );
}
