import Link from "next/link";

type Props = {
  feature?: string;
};

export function UpgradeRequired({ feature = "This feature" }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 px-6 py-10 text-center">
      <h2 className="text-2xl text-ink">Premium feature</h2>
      <p className="mx-auto mt-3 max-w-md text-ink-soft">
        {feature} is included with Week Pass and prepaid packs. Free plans keep
        personal reports, name/family/trivia explorers, and mobile fit.
      </p>
      <Link
        href="/pricing"
        className="btn-tactile mt-6 inline-block rounded-full bg-sea px-6 py-3 text-paper hover:bg-sea-deep"
      >
        View plans
      </Link>
    </div>
  );
}
