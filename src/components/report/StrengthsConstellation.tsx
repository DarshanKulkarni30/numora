"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { plainTrait } from "@/lib/numerology/layeredCopy";
import {
  buildStrengthConstellation,
  CONSTELLATION_CX,
  CONSTELLATION_CY,
  INNER_ORBIT,
  layoutStrengthMap,
  OUTER_ORBIT,
  strengthWeightLabel,
  type StrengthWeight,
} from "@/lib/numerology/strengthConstellation";

type Props = {
  strengths: string[];
  lifePath?: string;
  expression?: string;
  soulUrge?: string;
  vedicPsychic?: string;
};

function nodeRadius(weight: StrengthWeight) {
  if (weight === "core") return 15;
  if (weight === "supporting") return 12;
  return 10;
}

type Focus = { kind: "map"; i: number } | { kind: "extra"; i: number };

function nodeKeyDown(e: KeyboardEvent, select: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    select();
  }
}

export function StrengthsConstellation({
  strengths,
  lifePath,
  expression,
  soulUrge,
  vedicPsychic,
}: Props) {
  const model = useMemo(
    () =>
      buildStrengthConstellation({
        strengths,
        lifePath,
        expression,
        soulUrge,
        vedicPsychic,
      }),
    [strengths, lifePath, expression, soulUrge, vedicPsychic],
  );
  const [pin, setPin] = useState<Focus>({
    kind: "map",
    i: model.defaultIndex,
  });
  const [peek, setPeek] = useState<Focus | null>(null);
  const shown = peek ?? pin;

  /** A click must win over a lingering hover, or the panel keeps the hovered slot. */
  const select = (next: Focus) => {
    setPin(next);
    setPeek(null);
  };
  const lp = lifePath ? reduceToSingleDigit(Number(lifePath)) : null;
  const centerPlain = lp != null ? plainTrait(lp) : "your long-term direction";

  const layout = useMemo(() => layoutStrengthMap(model.map), [model.map]);

  if (!model.map.length) return null;

  const mapActive =
    shown.kind === "map" ? (layout[shown.i] ?? layout[0]!) : null;
  const extraActive =
    shown.kind === "extra" ? (model.extra[shown.i] ?? null) : null;
  const active = extraActive ?? mapActive ?? layout[0]!;
  const shownMapIndex = shown.kind === "map" ? shown.i : -1;
  const pinMapIndex = pin.kind === "map" ? pin.i : -1;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Five strengths next to Life Path {lifePath ?? "—"} ({centerPlain}).
        Dots nearer the centre are the ones you already use. Dots further out
        are still yours — you just don’t lead with them. Tap one. Use that one
        on a real task this week. This is not a full list of who you are.
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,1fr)] lg:items-start">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
          <svg
            viewBox="0 0 220 220"
            className="mx-auto h-auto w-full max-w-md"
            role="img"
            aria-label="Five strengths next to Life Path. Nearer dots are the ones you already use. Further dots are quieter. Tap one."
          >
            <circle
              cx={CONSTELLATION_CX}
              cy={CONSTELLATION_CY}
              r={OUTER_ORBIT}
              fill="none"
              stroke="rgb(30 58 107 / 0.18)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx={CONSTELLATION_CX}
              cy={CONSTELLATION_CY}
              r={INNER_ORBIT}
              fill="none"
              stroke="rgb(30 58 107 / 0.28)"
              strokeWidth="1"
            />
            {layout.map((n, i) => (
              <line
                key={`spoke-${n.title}-${i}`}
                x1={CONSTELLATION_CX}
                y1={CONSTELLATION_CY}
                x2={n.x}
                y2={n.y}
                stroke={n.color}
                strokeOpacity={n.weight === "stretch" ? 0.35 : 0.45}
                strokeWidth={n.weight === "core" ? 1.8 : 1.2}
                strokeDasharray={n.weight === "stretch" ? "3 3" : undefined}
              />
            ))}
            <circle
              cx={CONSTELLATION_CX}
              cy={CONSTELLATION_CY}
              r="28"
              fill="rgb(250 248 243)"
              stroke="rgb(30 58 107)"
              strokeWidth="1.4"
            />
            <text
              x={CONSTELLATION_CX}
              y="106"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="rgb(30 58 107)"
            >
              {lp ?? "·"}
            </text>
            <text
              x={CONSTELLATION_CX}
              y="120"
              textAnchor="middle"
              fontSize="6"
              fill="rgb(70 82 98)"
            >
              Life Path
            </text>
            {layout.map((n, i) => {
              const isPin = pinMapIndex === i;
              const isShown = shownMapIndex === i;
              const r = nodeRadius(n.weight) + (isPin ? 2 : 0);
              return (
                <g
                  key={n.title + i}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={n.title}
                  aria-pressed={isPin}
                  onClick={() => select({ kind: "map", i })}
                  onMouseEnter={() => setPeek({ kind: "map", i })}
                  onMouseLeave={() => setPeek(null)}
                  onKeyDown={(e) =>
                    nodeKeyDown(e, () => select({ kind: "map", i }))
                  }
                >
                  <title>{n.title}</title>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={r}
                    fill={n.color}
                    fillOpacity={
                      n.weight === "stretch"
                        ? isShown
                          ? 0.28
                          : 0.16
                        : isShown
                          ? 0.38
                          : 0.24
                    }
                    stroke={n.color}
                    strokeWidth={
                      isPin ? 2.8 : n.weight === "core" ? 2.2 : 1.8
                    }
                    strokeDasharray={
                      n.weight === "stretch" ? "3 2.5" : undefined
                    }
                  />
                </g>
              );
            })}
          </svg>
          <p className="mt-1 text-center text-xs text-ink-soft">
            Center · Life Path {lifePath ?? "—"} · {centerPlain}
          </p>
          <p className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full border-2"
                style={{
                  background: "rgb(45 122 120 / 0.22)",
                  borderColor: "rgb(45 122 120)",
                }}
                aria-hidden
              />
              Close: you already use this
            </span>
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full border border-dashed"
                style={{
                  background: "rgb(79 70 150 / 0.08)",
                  borderColor: "rgb(79 70 150)",
                }}
                aria-hidden
              />
              Further out: quieter, still yours
            </span>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {layout.map((n, i) => (
              <button
                key={n.title + i}
                type="button"
                aria-pressed={pin.kind === "map" && pin.i === i}
                onClick={() => select({ kind: "map", i })}
                onMouseEnter={() => setPeek({ kind: "map", i })}
                onMouseLeave={() => setPeek(null)}
                className={`btn-tactile rounded-lg border px-2 py-1.5 text-left text-[11px] leading-4 ${
                  pin.kind === "map" && pin.i === i
                    ? "border-ink bg-white text-ink shadow-sm"
                    : "border-[var(--line)] bg-white/70 text-ink-soft"
                }`}
              >
                <span
                  className="mr-1 inline-block h-2 w-2 rounded-full align-middle"
                  style={{ background: n.color }}
                />
                {n.title}
              </button>
            ))}
          </div>
        </div>

        <article className="flex flex-col rounded-xl border border-[var(--line)] bg-white/70 px-4 py-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            {strengthWeightLabel(active.weight)}
          </p>
          <h3 className="mt-1 text-lg text-ink">{active.title}</h3>
          {active.detail ? (
            <p className="mt-2 text-sm leading-6 text-ink-soft">{active.detail}</p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-ink">{active.meaning}</p>
          <p className="mt-2 text-xs text-ink-soft">{active.sourceLine}</p>
          <p className="mt-3 text-sm leading-6 text-ink">
            {active.tryLine} {active.watchLine}
          </p>
        </article>
      </div>

      {model.extra.length ? (
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Also on this chart
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            Quieter gifts that did not fit the five circles. Tap one to see
            what it means, one try, and one watch.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {model.extra.map((n, i) => {
              const pressed = pin.kind === "extra" && pin.i === i;
              return (
                <button
                  key={n.label}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => select({ kind: "extra", i })}
                  onMouseEnter={() => setPeek({ kind: "extra", i })}
                  onMouseLeave={() => setPeek(null)}
                  className={`btn-tactile rounded-full border px-3 py-1 text-xs ${
                    pressed
                      ? "border-ink bg-ink text-paper"
                      : "border-[var(--line)] bg-white/70 text-ink"
                  }`}
                >
                  {n.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
