import type { Derivation } from "@/lib/numerology/chartDerivations";
import type { SchoolRow } from "@/lib/numerology/enhanced/schoolCompare";
import type { StudentWalkthrough } from "@/lib/numerology/enhanced/studentWalkthrough";

type Props = {
  student: StudentWalkthrough;
  schoolCompare: SchoolRow[];
  derivations?: Derivation[];
};

export function StudentCalcDrawer({
  student,
  schoolCompare,
  derivations = [],
}: Props) {
  return (
    <section className="space-y-3">
      <details className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <summary className="cursor-pointer text-lg text-ink">
          How these numbers were worked out
        </summary>
        <div className="mt-4 space-y-4 text-sm text-ink-soft">
          <p className="font-medium text-ink">Life Path steps</p>
          <ol className="list-decimal space-y-1 pl-5">
            {student.lifePathSteps.map((s) => (
              <li key={s.label}>
                <span className="text-ink">{s.label}:</span> {s.detail}
              </li>
            ))}
          </ol>
          <p className="font-medium text-ink">Name mapping</p>
          <ul className="list-disc space-y-1 pl-5">
            {student.nameSteps.map((s) => (
              <li key={s.label}>
                <span className="text-ink">{s.label}:</span> {s.detail}
              </li>
            ))}
          </ul>
          <p className="font-medium text-ink">Master-number rules</p>
          <ul className="list-disc space-y-1 pl-5">
            {student.masterRules.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </details>
      {derivations.length ? (
        <details className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
          <summary className="cursor-pointer text-lg text-ink">
            Working for the remaining chart numbers
          </summary>
          <p className="mt-2 text-sm text-ink-soft">
            The numbers below are usually printed as a result with no arithmetic
            attached. Each one is worked through here so you can check it by
            hand.
          </p>
          <div className="mt-4 space-y-4">
            {derivations.map((d) => (
              <article
                key={d.id}
                className="rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4 text-sm"
              >
                <h4 className="text-ink">{d.title}</h4>
                <p className="mt-1 leading-6 text-ink-soft">{d.purpose}</p>
                <p className="mt-2 text-[13px] leading-6 text-ink-soft">
                  <span className="text-ink">Starts from: </span>
                  {d.inputs}
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-soft">
                  {d.steps.map((s, i) => (
                    <li key={`${d.id}-${i}`}>
                      <span className="text-ink">{s.label}:</span> {s.detail}
                    </li>
                  ))}
                </ol>
                <p className="mt-2 rounded-lg bg-mist/60 px-3 py-2 text-ink">
                  {d.result}
                </p>
                {d.note ? (
                  <p className="mt-2 text-[13px] leading-6 text-ink-soft">
                    {d.note}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </details>
      ) : null}
      <details className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
        <summary className="cursor-pointer text-lg text-ink">Compare schools</summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="text-ink-soft">
                <th className="pb-2 pr-3 font-medium">Topic</th>
                <th className="pb-2 pr-3 font-medium">Pythagorean</th>
                <th className="pb-2 pr-3 font-medium">Chaldean</th>
                <th className="pb-2 font-medium">Vedic</th>
              </tr>
            </thead>
            <tbody>
              {schoolCompare.map((row) => (
                <tr key={row.topic} className="border-t border-[var(--line)] align-top">
                  <td className="py-2 pr-3 text-ink">{row.topic}</td>
                  <td className="py-2 pr-3 text-ink-soft">{row.pythagorean}</td>
                  <td className="py-2 pr-3 text-ink-soft">{row.chaldean}</td>
                  <td className="py-2 text-ink-soft">{row.vedic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
