import Link from "next/link";
import { LEARNING_METHODS } from "@/lib/learning/curriculum";
import { BRAND_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function WhatIsNumerologyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <h1 className="text-4xl text-ink">What is numerology?</h1>
        <p className="mt-3 text-ink-soft">
          Numerology is a reflective tradition that maps letters and dates to
          numbers. {BRAND_NAME} shows several systems side by side so you can
          compare—not so one system “wins.” Nothing here diagnoses, treats, or
          predicts events.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl text-ink">Methods in this product</h2>
        <ul className="space-y-3">
          {LEARNING_METHODS.map((m) => (
            <li
              key={m.id}
              className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3"
            >
              <p className="font-medium text-ink">
                {m.title}
                <span className="ml-2 text-xs font-normal text-ink-soft">
                  {m.subtitle}
                </span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">{m.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-ink-soft">
        Ready to try math?{" "}
        <Link
          href="/learning/try/birth-destiny"
          className="text-gold-deep underline"
        >
          Calculate Psychic &amp; Destiny
        </Link>{" "}
        (free), or return to{" "}
        <Link href="/learning" className="text-gold-deep underline">
          Learning home
        </Link>
        .
      </p>
    </div>
  );
}
