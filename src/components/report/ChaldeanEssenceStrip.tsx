import type { ChaldeanStory } from "@/lib/numerology/enhanced/chaldeanStory";

type Props = {
  story: ChaldeanStory;
};

export function ChaldeanEssenceStrip({ story }: Props) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <h2 className="text-xl text-ink">Name vibration (Chaldean)</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Letters add to a long total, then reduce to one digit. Both describe
        this spelling — not a second person.
      </p>
      <p className="brand mt-3 text-3xl text-ink">
        {story.compound || "—"}
        <span className="mx-2 text-lg text-ink-soft">→</span>
        {story.reduced}
      </p>
      <p className="mt-3 text-sm leading-7 text-ink-soft">{story.texture}</p>
      <p className="mt-2 text-sm leading-7 text-ink-soft">{story.essence}</p>
      <p className="mt-2 text-sm leading-7 text-ink-soft">{story.compare}</p>
    </section>
  );
}
