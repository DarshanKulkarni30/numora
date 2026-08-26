/**
 * Plain-words definitions for every term the reports use before explaining it.
 * Beginners need this before the first panel; practitioners can leave it shut.
 */

type Entry = {
  term: string;
  from: string;
  means: string;
};

const ENTRIES: Entry[] = [
  {
    term: "Life Path",
    from: "your full birth date, added up and reduced to one digit",
    means:
      "The direction your life keeps returning to. Usually treated as the single most important number in a Western reading.",
  },
  {
    term: "Birth Day",
    from: "the day of the month you were born",
    means:
      "How you react first, before you have thought about it. A talent that shows up without effort.",
  },
  {
    term: "Expression",
    from: "every letter of your full birth name",
    means:
      "How you come across when you are working — your natural style and the kind of work that suits it.",
  },
  {
    term: "Soul Urge",
    from: "the vowels in your name",
    means:
      "What you actually want, which is not always what you tell people you want.",
  },
  {
    term: "Personality",
    from: "the consonants in your name",
    means:
      "The impression people form of you before they know you well.",
  },
  {
    term: "Maturity",
    from: "Life Path plus Expression, reduced",
    means:
      "What tends to come forward in the second half of life. It is a slow direction, not a switch that flips at a certain birthday.",
  },
  {
    term: "Psychic number (Moolank)",
    from: "the day of the month, in the Indian system",
    means:
      "Your immediate instinct. The Indian equivalent of the Birth Day number.",
  },
  {
    term: "Destiny number (Bhagyank)",
    from: "your full birth date, in the Indian system",
    means:
      "The lesson that keeps coming back until you get good at it. Often differs from the Life Path because the reduction rules differ.",
  },
  {
    term: "Name number",
    from: "the letters of the spelling you use now",
    means:
      "How you register with people. This is the only number here that changes if you change your name.",
  },
  {
    term: "Personal Year",
    from: "your birth month and day plus the current year",
    means:
      "The theme of the current year. It describes what the year is for, not what will happen in it.",
  },
  {
    term: "Personal Month and Day",
    from: "your Personal Year plus the current month or date",
    means:
      "Shorter versions of the same idea. Useful for pacing the next few weeks, not for planning around.",
  },
  {
    term: "Pinnacle",
    from: "pairs of numbers from your birth date",
    means:
      "One of four age ranges, each with its own theme. Together they cover your whole life.",
  },
  {
    term: "Challenge",
    from: "the differences between parts of your birth date",
    means:
      "A recurring difficulty attached to an age range. It names a skill to build, not a punishment.",
  },
  {
    term: "Karmic lesson",
    from: "letter values missing from your birth name",
    means:
      "A quality you have to build deliberately because nothing in your name supplies it automatically.",
  },
  {
    term: "Karmic debt",
    from: "a total of 13, 14, 16 or 19 appearing while a number is added up",
    means:
      "A different thing from a karmic lesson. It marks one place where the quick version of a skill tends not to work for you, so the slower, deliberate version is the way through. Most charts have none.",
  },
  {
    term: "Master number",
    from: "totals of 11, 22 or 33",
    means:
      "Numbers that many schools leave unreduced. An 11 works broadly like a 2 with more intensity and more tiredness attached.",
  },
  {
    term: "Lo Shu grid",
    from: "the individual digits of your birth date, placed on a 3×3 square",
    means:
      "Shows which digits you have several times (automatic habits) and which are missing (skills to build). Missing digits are not faults.",
  },
  {
    term: "Compound and reduced",
    from: "any total before and after reducing to one digit",
    means:
      "The compound is the full total, which carries extra detail. The reduced digit is the short label most readings use.",
  },
];

export function ReportGlossary() {
  return (
    <details className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <summary className="cursor-pointer text-base text-ink">
        New to this? Plain-words meaning of every term used below
      </summary>
      <p className="mt-3 max-w-[75ch] text-sm leading-6 text-ink-soft">
        Each number in this report is worked out from either your birth date or
        your name. The date numbers never change. The name numbers change only
        if you change your name.
      </p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {ENTRIES.map((e) => (
          <div
            key={e.term}
            className="rounded-xl border border-[var(--line)] bg-white/70 px-3.5 py-3"
          >
            <dt className="text-sm font-medium text-ink">{e.term}</dt>
            <dd className="mt-1 text-xs leading-5 text-ink-soft">
              <span className="text-ink/70">Worked out from</span> {e.from}.{" "}
              {e.means}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
