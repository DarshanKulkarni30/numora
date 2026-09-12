"use client";

import {
  type InteractionEase,
  type InteractionMap,
  type NumberInteraction,
  type PatternNode,
} from "@/lib/numerology/blueprint/interactions";

const EASE_CLASS: Record<InteractionEase, string> = {
  "Very Easy": "border-teal-200 bg-teal-50 text-teal-950",
  Easy: "border-teal-200 bg-teal-50 text-teal-950",
  Moderate: "border-amber-200 bg-amber-50 text-amber-950",
  "Productive tension": "border-orange-200 bg-orange-50 text-orange-950",
};

function EaseChip({ ease, label }: { ease: InteractionEase; label: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${EASE_CLASS[ease]}`}
    >
      {label}
    </span>
  );
}

function NodeCard({
  node,
  onDigit,
}: {
  node: PatternNode;
  onDigit?: (digit: number, label: string) => void;
}) {
  return (
    <button
      type="button"
      className="btn-tactile flex h-full min-w-[8.5rem] flex-1 flex-col rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-left"
      onClick={() => onDigit?.(node.digit, node.seat)}
    >
      <p className="text-[10px] uppercase tracking-wider text-ink-soft">
        {node.seat}
      </p>
      <p className="brand mt-1 text-3xl text-ink">{node.digit}</p>
      <p className="mt-1 text-sm font-medium text-ink">{node.verb}</p>
      <p className="mt-1 text-xs text-ink">{node.role}</p>
      <p className="mt-1 text-xs leading-5 text-ink-soft">{node.hint}</p>
    </button>
  );
}

function FlowArrow({
  item,
  direction,
}: {
  item: NumberInteraction;
  direction: "right" | "down";
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center gap-1 ${
        direction === "down" ? "flex-col py-1" : "flex-col px-1 min-w-[5.5rem]"
      }`}
      aria-label={`${item.pair}: ${item.easeLabel}`}
    >
      <EaseChip ease={item.ease} label={item.easeLabel} />
      <span className="text-lg text-ink-soft" aria-hidden>
        {direction === "down" ? "↓" : "→"}
      </span>
    </div>
  );
}

type Props = {
  map: InteractionMap;
  onDigit?: (digit: number, label: string) => void;
};

export function LifePatternFlow({ map, onDigit }: Props) {
  const soul = map.nodes.find((n) => n.id === "soul")!;
  const bn = map.nodes.find((n) => n.id === "bn")!;
  const dn = map.nodes.find((n) => n.id === "dn")!;
  const name = map.nodes.find((n) => n.id === "name")!;
  const soulBn = map.items.find((i) => i.id === "soul-bn")!;
  const bnDn = map.items.find((i) => i.id === "bn-dn")!;
  const dnName = map.items.find((i) => i.id === "dn-name")!;

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-ink">{map.naturalFlow}</p>

      <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
          Your path this lifetime
        </p>
        <p className="brand mt-2 text-2xl text-ink">{map.energyFlow}</p>
        <p className="mt-1 text-sm text-ink-soft">{map.caption}</p>

        <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Inside — Soul {soul.digit}
          </p>
          <p className="mt-1 text-sm text-ink">
            {soul.verb} · {soul.role}
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{soul.hint}</p>
          <div className="mt-2 flex items-center gap-2">
            <EaseChip ease={soulBn.ease} label={soulBn.easeLabel} />
            <span className="text-xs text-ink-soft">
              with how you start (Birth {bn.digit})
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-stretch md:flex-row md:items-center">
          <NodeCard node={bn} onDigit={onDigit} />
          <div className="flex justify-center md:hidden">
            <FlowArrow item={bnDn} direction="down" />
          </div>
          <div className="hidden md:flex">
            <FlowArrow item={bnDn} direction="right" />
          </div>
          <NodeCard node={dn} onDigit={onDigit} />
          <div className="flex justify-center md:hidden">
            <FlowArrow item={dnName} direction="down" />
          </div>
          <div className="hidden md:flex">
            <FlowArrow item={dnName} direction="right" />
          </div>
          <NodeCard node={name} onDigit={onDigit} />
        </div>
      </div>

      <div>
        <h3 className="text-lg text-ink">How the connections feel</h3>
        <p className="mt-1 text-sm text-ink-soft">
          Each row is one relationship between two seats. The chip is the feel —
          Smooth, works together, takes turns, or useful stretch — not a grade.
        </p>
        <ul className="mt-3 space-y-3">
          {map.items.map((row) => (
            <li
              key={row.id}
              className="grid gap-3 rounded-xl border border-[var(--line)] bg-white/70 px-3 py-3 sm:grid-cols-[minmax(9rem,11rem)_minmax(8rem,10rem)_1fr] sm:items-start"
            >
              <p className="text-sm text-ink">
                <span className="font-medium">{row.pair}</span>
                <span className="mt-1 block text-xs text-ink-soft">
                  {row.leftLabel} {row.left} ↔ {row.rightLabel} {row.right}
                </span>
              </p>
              <p>
                <EaseChip ease={row.ease} label={row.easeLabel} />
                <span className="mt-1 block text-xs text-ink-soft">
                  {row.ease === "Moderate"
                    ? "Both show up in a week"
                    : row.ease === "Productive tension"
                      ? "Different aims, still usable"
                      : row.ease === "Easy"
                        ? "They support each other"
                        : "Usually the same direction"}
                </span>
              </p>
              <div>
                <p className="text-sm font-medium text-ink">{row.headline}</p>
                <p className="mt-1 text-sm leading-6 text-ink-soft">
                  {row.meaning}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
