import Link from "next/link";
import { learningNeighbors } from "@/lib/learning/curriculum";

type Props = {
  /** Current path without query, e.g. /learning/vedic/psychic */
  pathname: string;
};

export function LearningPager({ pathname }: Props) {
  const { prev, next, index, total } = learningNeighbors(pathname);
  if (index < 0) return null;

  return (
    <nav
      className="mt-10 flex flex-wrap items-stretch justify-between gap-3 border-t border-[var(--line)] pt-6"
      aria-label="Learning page navigation"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="btn-tactile min-w-[10rem] flex-1 rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-left hover:-translate-y-px hover:shadow-sm sm:max-w-xs"
        >
          <span className="block text-[10px] uppercase tracking-wider text-ink-soft">
            Previous
          </span>
          <span className="mt-0.5 block text-sm font-medium text-ink">
            {prev.title}
          </span>
          {prev.subtitle ? (
            <span className="mt-0.5 block text-xs text-ink-soft">
              {prev.subtitle}
            </span>
          ) : null}
        </Link>
      ) : (
        <span className="min-w-[10rem] flex-1 sm:max-w-xs" />
      )}

      <p className="self-center text-center text-xs text-ink-soft">
        {index + 1} / {total}
      </p>

      {next ? (
        <Link
          href={next.href}
          className="btn-tactile min-w-[10rem] flex-1 rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 text-right hover:-translate-y-px hover:shadow-sm sm:max-w-xs"
        >
          <span className="block text-[10px] uppercase tracking-wider text-ink-soft">
            Next
          </span>
          <span className="mt-0.5 block text-sm font-medium text-ink">
            {next.title}
          </span>
          {next.subtitle ? (
            <span className="mt-0.5 block text-xs text-ink-soft">
              {next.subtitle}
            </span>
          ) : null}
        </Link>
      ) : (
        <span className="min-w-[10rem] flex-1 sm:max-w-xs" />
      )}
    </nav>
  );
}
