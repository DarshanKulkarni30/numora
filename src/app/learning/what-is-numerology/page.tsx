import Link from "next/link";
import { DobPsychicDestinyDemo } from "@/components/learning/DobPsychicDestinyDemo";
import { LearningPager } from "@/components/learning/LearningPager";
import { LEARNING_METHODS } from "@/lib/learning/curriculum";
import { BRAND_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Intro page — original NumoraWisdom teaching copy.
 * Themes reviewed from common public numerology primers (history, reduction,
 * name+date, multiple schools) and rewritten for reflective product use—
 * not verbatim third-party text; not predictive or medical claims.
 * Reference backdrop: https://www.occultscience.in/what-is-numerology/
 */
export default function WhatIsNumerologyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <h1 className="text-4xl text-ink">What is numerology?</h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          Numerology is a reflective tradition that studies how numbers drawn
          from birth dates and names are given symbolic meaning. Practitioners
          treat digits 1–9 (and sometimes master numbers like 11, 22, and 33) as
          lenses on temperament, craft, and life pacing—not as laboratory
          science. {BRAND_NAME} shows several schools side by side so you can
          compare charts. Nothing here diagnoses, treats, or predicts events.
        </p>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          The usual craft is simple arithmetic: add parts of a date or letter
          values in a name, then reduce until you reach a teaching digit. Birth
          day, full date, vowels, consonants, and whole-name totals each answer
          a different reflective question. Cultures from India and the Near East
          through Greece and later Western practice developed overlapping maps;
          Pythagorean, Chaldean, Indian-style Vedic, and grid systems like Lo Shu
          remain common today.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl text-ink">How the math usually works</h2>
        <p className="text-sm leading-7 text-ink-soft">
          For dates, you often reduce the day alone (a “birth” or Psychic-style
          number) or add day + month + year and reduce again (Life Path or
          Destiny-style themes, depending on school). For names, each letter is
          assigned a value on a chart—Pythagorean uses 1–9; classic Chaldean uses
          1–8 for letters—then the sum is reduced. Master numbers may be kept
          without folding when a tradition says so.
        </p>
        <p className="text-sm leading-7 text-ink-soft">
          People reach for numerology for self-reflection, relationship
          comparison, naming experiments, and timing “weather.” In a digital
          age, calculators make the arithmetic easy; wisdom still means holding
          results lightly. {BRAND_NAME} keeps language reflective on purpose.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl text-ink">Methods in this product</h2>
        <ul className="space-y-4">
          {LEARNING_METHODS.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl border border-[var(--line)] bg-white/55 px-5 py-4"
            >
              <p className="font-medium text-ink">
                {m.title}
                <span className="ml-2 text-xs font-normal text-ink-soft">
                  {m.subtitle}
                </span>
              </p>
              <p className="mt-2 text-sm leading-7 text-ink-soft">{m.detail}</p>
              <p className="mt-3 text-xs">
                <Link
                  href={`/learning/${m.id}`}
                  className="text-gold-deep underline"
                >
                  Open {m.title} lessons
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl text-ink">Try the math yourself</h2>
        <p className="text-sm leading-7 text-ink-soft">
          Psychic uses the birth day; Destiny uses the full date—both reduced to
          1–9 in the Indian-style map taught here. Enter a date to see each step,
          then continue into method lessons with Previous / Next.
        </p>
        <DobPsychicDestinyDemo />
      </section>

      <LearningPager pathname="/learning/what-is-numerology" />
    </div>
  );
}
