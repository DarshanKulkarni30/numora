import type { ChaldeanStory } from "@/lib/numerology/enhanced/chaldeanStory";

type Props = {
  story: ChaldeanStory;
};

export function ChaldeanEssenceStrip({ story }: Props) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <h2 className="text-xl text-ink">Chaldean texture and essence</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Compound is the grain of the spelling; the reduced digit is the essence.
        The Chaldean analysis in the catalog below still stands.
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
