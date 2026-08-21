type Props = {
  lines: string[];
};

export function ReadingLegend({ lines }: Props) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-white/55 p-5">
      <h2 className="text-xl text-ink">How to read this</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-ink-soft">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
