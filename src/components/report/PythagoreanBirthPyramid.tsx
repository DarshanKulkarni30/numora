"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildPythagoreanBirthPyramid,
  pyramidNodePositions,
  type PyramidNode,
} from "@/lib/numerology/pythagoreanBirthPyramid";

type Props = {
  dateOfBirth: string;
  className?: string;
};

const LEVEL_STROKE: Record<string, string> = {
  foundation: "rgb(45 122 90)",
  interaction: "rgb(45 122 120)",
  polarity: "rgb(45 90 140)",
  synthesis: "rgb(90 70 140)",
};

const LEVEL_FILL: Record<string, string> = {
  foundation: "rgb(45 122 90 / 0.12)",
  interaction: "rgb(45 122 120 / 0.12)",
  polarity: "rgb(45 90 140 / 0.12)",
  synthesis: "rgb(90 70 140 / 0.14)",
};

function formatBadge(node: PyramidNode): string {
  return node.compound !== node.value
    ? `${node.compound}/${node.value}`
    : String(node.value);
}

export function PythagoreanBirthPyramid({
  dateOfBirth,
  className = "",
}: Props) {
  const model = useMemo(
    () => buildPythagoreanBirthPyramid(dateOfBirth),
    [dateOfBirth],
  );
  const positions = useMemo(
    () => pyramidNodePositions(model.levels),
    [model.levels],
  );
  const [focus, setFocus] = useState(model.apex.value ? model.levels[3]?.nodes[0]?.id : "");
  const [reveal, setReveal] = useState(0);

  useEffect(() => {
    const apexId = model.levels[model.levels.length - 1]?.nodes[0]?.id ?? "";
    setFocus(apexId);
    setReveal(0);
    const timers = [
      window.setTimeout(() => setReveal(1), 60),
      window.setTimeout(() => setReveal(2), 220),
      window.setTimeout(() => setReveal(3), 380),
      window.setTimeout(() => setReveal(4), 540),
    ];
    return () => timers.forEach(clearTimeout);
  }, [dateOfBirth, model.levels]);

  const active =
    model.nodes.find((n) => n.id === focus) ??
    model.levels[model.levels.length - 1]?.nodes[0];

  const relatedIds = useMemo(() => {
    if (!active) return new Set<string>();
    const set = new Set<string>([active.id]);
    for (const e of model.edges) {
      if (e.to === active.id) set.add(e.from);
      if (e.from === active.id) set.add(e.to);
    }
    return set;
  }, [active, model.edges]);

  const stageFor = (levelIndex: number) => levelIndex + 1;

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Birth Pyramid
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Upright cascade from day · month · year halves — compound sums rise to
          a synthesis apex. Distinct from Trigonum and Life Path.
        </p>
      </div>

      {/* Reduction strip */}
      <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-soft">
          Birth date reduction
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {model.segments.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-[var(--line)] bg-gradient-to-b from-white to-mist/40 px-3 py-2 text-center"
            >
              <p className="text-[9px] uppercase tracking-wider text-ink-soft">
                {s.label}
              </p>
              <p className="text-sm text-ink-soft">
                {String(s.raw).padStart(2, "0")}
              </p>
              <p className="brand text-lg text-ink">→ {s.reduced}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
          <svg
            viewBox="0 0 320 260"
            className="mx-auto h-auto w-full max-w-md"
            role="img"
            aria-label={`Birth Pyramid apex ${model.apex.compound}/${model.apex.value}`}
          >
            {/* Level labels */}
            {model.levels.map((level, li) => {
              const sample = level.nodes[0];
              const y = positions[sample.id]?.y ?? 0;
              return (
                <text
                  key={`lbl-${level.id}`}
                  x="12"
                  y={y + 3}
                  fontSize="7"
                  fill="rgb(70 82 98)"
                >
                  {li + 1}. {level.label}
                </text>
              );
            })}

            {model.edges.map((e) => {
              const a = positions[e.from];
              const b = positions[e.to];
              if (!a || !b) return null;
              const child = model.nodes.find((n) => n.id === e.to);
              const show = child ? reveal >= stageFor(child.levelIndex) : false;
              const lit =
                relatedIds.has(e.from) && relatedIds.has(e.to) && show;
              return (
                <line
                  key={`${e.from}-${e.to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={lit ? "rgb(180 83 9)" : "rgb(196 164 108 / 0.4)"}
                  strokeWidth={lit ? 2 : 1.2}
                  opacity={show ? 1 : 0.12}
                  strokeLinecap="round"
                />
              );
            })}

            {model.nodes.map((node) => {
              const p = positions[node.id];
              if (!p) return null;
              const show = reveal >= stageFor(node.levelIndex);
              const isFocus = focus === node.id;
              const dim = reveal >= 4 && !relatedIds.has(node.id);
              const stroke = LEVEL_STROKE[node.level] ?? LEVEL_STROKE.foundation;
              const fill = LEVEL_FILL[node.level] ?? LEVEL_FILL.foundation;
              return (
                <g
                  key={node.id}
                  opacity={show ? (dim ? 0.28 : 1) : 0.1}
                  className="cursor-pointer"
                  onClick={() => setFocus(node.id)}
                  onMouseEnter={() => setFocus(node.id)}
                >
                  {node.compound !== node.value ? (
                    <text
                      x={p.x}
                      y={p.y - (isFocus ? 26 : 22)}
                      textAnchor="middle"
                      fontSize="7"
                      fill="rgb(70 82 98)"
                    >
                      {node.compound}/{node.value}
                    </text>
                  ) : null}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isFocus ? 20 : 16}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isFocus ? 2.2 : 1.4}
                    className={
                      node.level === "synthesis"
                        ? "motion-safe:animate-pulse"
                        : undefined
                    }
                  />
                  <text
                    x={p.x}
                    y={p.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isFocus ? 15 : 13}
                    fontWeight="700"
                    fill="rgb(30 58 107)"
                  >
                    {node.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-3">
          {active ? (
            <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-3 py-3">
              <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                {LEVEL_STROKE[active.level] ? active.level : "Node"} ·{" "}
                {formatBadge(active)}
              </p>
              <p className="mt-1 text-lg font-medium text-ink">
                {active.archetype}{" "}
                <span className="text-sm font-normal text-ink-soft">
                  ({active.value})
                </span>
              </p>
              <p className="mt-2 inline-block rounded-full border border-[var(--line)] bg-white/80 px-2.5 py-1 text-[11px] text-ink">
                {active.formula}
              </p>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                {active.narrative}
              </p>
            </div>
          ) : null}

          {/* Meanings for digits that appear */}
          <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3">
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Numbers in this pyramid
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-ink-soft">
              {[
                ...new Set(model.nodes.map((n) => n.value)),
              ]
                .sort((a, b) => a - b)
                .map((n) => {
                  const a =
                    model.nodes.find((x) => x.value === n)?.archetype ?? "";
                  return (
                    <li key={n}>
                      <span className="font-medium text-ink">{n}</span> — {a}
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>

      {/* At a glance */}
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3 text-sm text-ink">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            At a glance
          </p>
          <ul className="mt-2 space-y-1.5 text-ink-soft">
            <li>
              Apex synthesis:{" "}
              <span className="font-medium text-ink">
                {model.apex.compound}/{model.apex.value}
              </span>{" "}
              ({model.apex.archetype})
            </li>
            <li>
              Core balance:{" "}
              <span className="font-medium text-ink">
                {model.polarity.left} ↔ {model.polarity.right}
              </span>
            </li>
            <li>
              Foundation:{" "}
              <span className="font-medium text-ink">
                {model.dominant.join(" · ")}
              </span>
            </li>
            <li>
              Theme:{" "}
              <span className="font-medium text-ink">{model.keyTheme}</span>
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-3 py-3 text-sm text-ink">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Decoding levels
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-ink-soft">
            {model.levels.map((l) => (
              <li key={l.id}>
                <span className="font-medium text-ink">{l.label}</span> —{" "}
                {l.nodes.map((n) => formatBadge(n)).join(" · ")}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-xs leading-5 text-ink-soft">{model.disclaimer}</p>
    </div>
  );
}
