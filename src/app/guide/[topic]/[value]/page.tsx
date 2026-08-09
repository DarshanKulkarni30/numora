import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import {
  GUIDE_TOPICS,
  getGuidePage,
  isValidGuideValue,
  topicLabel,
  type GuideTopic,
} from "@/lib/guides/content";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ topic: string; value: string }>;
};

export default async function GuidePage({ params }: Props) {
  const { topic: topicRaw, value } = await params;
  const topic = topicRaw as GuideTopic;
  if (!GUIDE_TOPICS.some((t) => t.topic === topic) || !isValidGuideValue(topic, value)) {
    notFound();
  }

  const page = getGuidePage(topic, value);
  if (!page) notFound();

  let email: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      email = user?.email ?? null;
    } catch {
      email = null;
    }
  }

  return (
    <div>
      <SiteHeader email={email} />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-6">
        <p className="text-sm uppercase tracking-[0.2em] text-gold-deep">
          Numora guide · {topicLabel(topic)}
        </p>
        <h1 className="mt-2 text-4xl text-ink md:text-5xl">{page.title}</h1>
        <p className="mt-3 text-lg text-ink-soft">{page.subtitle}</p>

        <div className="mt-8 space-y-4 text-[1.05rem] leading-8 text-ink-soft">
          {page.paragraphs.map((p) => (
            <p key={p.slice(0, 48)}>{p}</p>
          ))}
        </div>

        <ul className="mt-8 list-disc space-y-2 pl-5 text-ink-soft">
          {page.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="rounded-full bg-ink px-5 py-2.5 text-paper hover:bg-sea-deep"
          >
            Back to dashboard
          </Link>
        </div>

        <p className="mt-10 text-sm text-ink-soft">
          Belief-based reflective material only — not scientific, medical,
          legal, financial, or psychological advice.
        </p>
      </main>
    </div>
  );
}
