import Link from "next/link";
import { DobPsychicDestinyDemo } from "@/components/learning/DobPsychicDestinyDemo";

export const dynamic = "force-dynamic";

export default function BirthDestinyTryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-4xl text-ink">Psychic &amp; Destiny</h1>
        <p className="mt-3 text-ink-soft">
          Free interactive. Enter any date of birth to see how Vedic
          (Indian-style) Psychic and Destiny numbers are built. Full Learning
          unlocks every method and the name master tables.
        </p>
      </header>
      <DobPsychicDestinyDemo />
      <p className="text-sm text-ink-soft">
        <Link href="/learning" className="text-gold-deep underline">
          Back to Learning
        </Link>
        {" · "}
        <Link href="/pricing" className="text-gold-deep underline">
          Unlock full Learning
        </Link>
      </p>
    </div>
  );
}
