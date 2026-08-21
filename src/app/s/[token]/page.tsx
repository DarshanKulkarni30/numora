import { notFound } from "next/navigation";
import Link from "next/link";
import { EnhancedReportView } from "@/components/enhanced/EnhancedReportView";
import {
  decodeShareTokenParam,
  loadSharedReading,
} from "@/lib/report/loadSharedReading";
import { BRAND_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function SharedReadingPage({ params }: Props) {
  const { token: raw } = await params;
  const token = decodeShareTokenParam(raw);
  const shared = await loadSharedReading(token);
  if (!shared) notFound();

  return (
    <div>
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5">
        <p className="brand text-xl text-ink">{BRAND_NAME}</p>
        <Link
          href={`/s/${token}/session`}
          className="btn-tactile rounded-full bg-ink px-4 py-2 text-sm text-paper"
        >
          Present in reading room
        </Link>
      </header>
      <EnhancedReportView
        report={shared.report}
        reportId={shared.reportId}
        mode="shared"
        expiresAt={shared.expiresAt}
        sessionHref={`/s/${token}/session`}
        allowCopy
        allowPdf={false}
      />
    </div>
  );
}
