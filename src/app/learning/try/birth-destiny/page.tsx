import { DobPsychicDestinyDemo } from "@/components/learning/DobPsychicDestinyDemo";
import { LearningPager } from "@/components/learning/LearningPager";

export const dynamic = "force-dynamic";

export default function BirthDestinyTryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-4xl text-ink">Psychic &amp; Destiny</h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          Free interactive. Enter any date of birth to see how Vedic
          (Indian-style) Psychic and Destiny numbers are built—day alone versus
          day + month + year—then reduced to 1–9 with keyword themes. Full
          Learning unlocks every method and the name master tables. Use Previous
          / Next to keep walking the curriculum.
        </p>
      </header>
      <DobPsychicDestinyDemo />
      <LearningPager pathname="/learning/try/birth-destiny" />
    </div>
  );
}
