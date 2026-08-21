import type { LoShuLived } from "@/lib/numerology/enhanced/loShuLived";

type Props = {
  lived: LoShuLived;
};

export function LoShuLivedNotes({ lived }: Props) {
  if (!lived.items.length) return null;
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-ink">Lived effects</p>
      <p className="mt-1 text-sm leading-6 text-ink-soft">{lived.summary}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-soft">
        {lived.items.map((item) => (
          <li key={`${item.kind}-${item.number}`}>
            <span className="font-medium text-ink">
              {item.kind === "missing" ? "Edge" : "Emphasis"} {item.number}.
            </span>{" "}
            {item.effect}
          </li>
        ))}
      </ul>
    </div>
  );
}
