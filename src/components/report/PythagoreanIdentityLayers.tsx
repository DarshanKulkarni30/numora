"use client";

import Link from "next/link";
import { useId, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import { LayeredNote } from "@/components/report/LayeredNote";
import type { GuideTopic } from "@/lib/guides/content";
import {
  buildPythagoreanIdentityLayers,
  identityTrait,
  identityTraitBullets,
  type ExpressionPattern,
  type IdentityLayerCard,
  type InnerOuterAlignment,
} from "@/lib/numerology/pythagoreanIdentityLayers";

type Props = {
  birthDay: string;
  lifePath: string;
  expression: string;
  soulUrge: string;
  personality: string;
  maturity: string;
};

type FocusNode = {
  id: string;
  code: string;
  role: string;
  value: string;
  tip: string;
  detail: string;
  guide?: { topic: GuideTopic; label: string; value: string };
  traitLine?: string;
};

function toggleFocus(
  cur: string | null,
  id: string,
  set: (v: string | null) => void,
) {
  set(cur === id ? null : id);
}

function nodeKeyDown(
  e: KeyboardEvent,
  id: string,
  focus: string | null,
  setFocus: (v: string | null) => void,
) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleFocus(focus, id, setFocus);
  }
}

function NodeFocusStrip({ focus }: { focus: FocusNode | null }) {
  if (!focus) {
    return (
      <p className="mt-2 text-center text-[11px] text-ink-soft">
        Hover or tap a node for a closer look
      </p>
    );
  }
  return (
    <div className="mt-2 rounded-xl border border-[var(--line)] bg-mist/45 px-3 py-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
        {focus.code} · {focus.role}
      </p>
      <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        {focus.guide ? (
          <GuideNumberLink
            topic={focus.guide.topic}
            value={focus.guide.value}
            label={focus.guide.label}
            display={focus.guide.value}
            className="brand text-lg text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
          />
        ) : (
          <span className="brand text-lg text-ink">{focus.value}</span>
        )}
        <span className="text-sm text-ink-soft">
          {focus.traitLine ??
            (focus.guide ? identityTraitBullets(focus.guide.value) : null)}
        </span>
      </p>
      <p className="mt-1 max-w-[65ch] text-sm leading-5 text-ink">{focus.detail}</p>
    </div>
  );
}

type HotspotProps = {
  nodeId: string;
  tip: string;
  focus: string | null;
  setFocus: (v: string | null) => void;
  children: ReactNode;
};

function SvgHotspot({ nodeId, tip, focus, setFocus, children }: HotspotProps) {
  const active = focus === nodeId;
  const opacity = focus && !active ? 0.32 : 1;
  return (
    <g
      opacity={opacity}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={tip}
      aria-pressed={active}
      onClick={() => toggleFocus(focus, nodeId, setFocus)}
      onMouseEnter={() => setFocus(nodeId)}
      onKeyDown={(e) => nodeKeyDown(e, nodeId, focus, setFocus)}
    >
      <title>{tip}</title>
      {children}
    </g>
  );
}

/** BD · EX · LP as three views of one person (Expression = how you show up). */
function ExpressionBridge({
  birthDay,
  lifePath,
  expression,
  pattern,
}: {
  birthDay: string;
  lifePath: string;
  expression: string;
  pattern: ExpressionPattern;
}) {
  const uid = useId().replace(/:/g, "");
  const echoesBirth = pattern.kind === "ex-bd-repeat" || pattern.kind === "all-same";
  const [focus, setFocus] = useState<string | null>(null);

  const nodes: FocusNode[] = useMemo(
    () => [
      {
        id: "bd",
        code: "Birth Day",
        role: "your first instinct",
        value: birthDay,
        tip: `Birth Day ${birthDay} — your first habit`,
        detail: pattern.birthDetail,
        traitLine: "first habit",
        guide: { topic: "birth-day", label: "Birth Day", value: birthDay },
      },
      {
        id: "ex",
        code: "Expression",
        role: echoesBirth
          ? "same number as your birth day, so it doubles up"
          : "how you come across",
        value: expression,
        tip: `Expression ${expression} — how you show up`,
        detail: pattern.expressionDetail,
        traitLine: "how you show up",
        guide: { topic: "expression", label: "Expression", value: expression },
      },
      {
        id: "lp",
        code: "Life Path",
        role: "where you are headed",
        value: lifePath,
        tip: `Life Path ${lifePath} — your longer direction`,
        detail: pattern.pathDetail,
        traitLine: "longer direction",
        guide: { topic: "life-path", label: "Life Path", value: lifePath },
      },
    ],
    [birthDay, lifePath, expression, echoesBirth, pattern],
  );

  const active = nodes.find((n) => n.id === focus) ?? null;

  return (
    <div>
      <svg
        viewBox="0 0 280 88"
        className="mx-auto h-auto w-full max-w-[40rem]"
        role="img"
        aria-label="Birth Day, Expression, and Life Path. Hover or tap a number for what it means for this chart."
      >
        <defs>
          <linearGradient id={`bridge-${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(30 58 107)" stopOpacity="0.85" />
            <stop offset="45%" stopColor="rgb(180 83 9)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(45 122 120)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {[40, 80, 120, 160, 200, 240].map((x) => (
          <line
            key={x}
            x1={x}
            y1="48"
            x2={x}
            y2="54"
            stroke="rgb(70 82 98 / 0.25)"
            strokeWidth="1"
          />
        ))}
        <line
          x1="36"
          y1="44"
          x2="244"
          y2="44"
          stroke={`url(#bridge-${uid})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity={focus ? 0.55 : 1}
        />

        <SvgHotspot nodeId="bd" tip={nodes[0].tip} focus={focus} setFocus={setFocus}>
          <circle
            cx="36"
            cy="44"
            r={focus === "bd" ? 11 : 9}
            fill="rgb(30 58 107)"
            stroke={focus === "bd" ? "rgb(180 83 9)" : "transparent"}
            strokeWidth="2"
          />
          <text x="36" y="47" fontSize="8" fill="white" textAnchor="middle" fontWeight="700">
            {birthDay}
          </text>
          <text x="36" y="72" fontSize="8" fill="rgb(30 40 55)" textAnchor="middle" fontWeight="600">
            BD {birthDay}
          </text>
          <text x="36" y="84" fontSize="8" fill="rgb(70 82 98)" textAnchor="middle">
            Origin
          </text>
        </SvgHotspot>

        <SvgHotspot nodeId="ex" tip={nodes[1].tip} focus={focus} setFocus={setFocus}>
          <circle
            cx="140"
            cy="44"
            r={focus === "ex" ? 14 : 12}
            fill="rgb(250 248 243)"
            stroke="rgb(180 83 9)"
            strokeWidth={focus === "ex" ? 3 : 2.5}
          />
          <circle
            cx="140"
            cy="44"
            r="16"
            fill="none"
            stroke="rgb(180 83 9 / 0.35)"
            strokeWidth="1.5"
            className="motion-safe:animate-pulse"
          />
          <text x="140" y="47" fontSize="9" fill="rgb(180 83 9)" textAnchor="middle" fontWeight="700">
            {expression}
          </text>
          <text x="140" y="18" fontSize="8" fill="rgb(180 83 9)" textAnchor="middle" fontWeight="600">
            Expression {expression}
          </text>
          <text x="140" y="28" fontSize="8" fill="rgb(70 82 98)" textAnchor="middle">
            {echoesBirth ? "same as your birth day" : "how you come across"}
          </text>
        </SvgHotspot>

        <SvgHotspot nodeId="lp" tip={nodes[2].tip} focus={focus} setFocus={setFocus}>
          <circle
            cx="244"
            cy="44"
            r={focus === "lp" ? 11 : 9}
            fill="rgb(45 122 120)"
            stroke={focus === "lp" ? "rgb(180 83 9)" : "transparent"}
            strokeWidth="2"
          />
          <text x="244" y="47" fontSize="8" fill="white" textAnchor="middle" fontWeight="700">
            {lifePath}
          </text>
          <text x="244" y="72" fontSize="8" fill="rgb(30 40 55)" textAnchor="middle" fontWeight="600">
            Life Path {lifePath}
          </text>
          <text x="244" y="84" fontSize="8" fill="rgb(70 82 98)" textAnchor="middle">
            where you are headed
          </text>
        </SvgHotspot>
      </svg>
      <NodeFocusStrip focus={active} />
    </div>
  );
}

function InnerOuterOverlap({
  soulUrge,
  personality,
  alignment,
}: {
  soulUrge: string;
  personality: string;
  alignment: InnerOuterAlignment;
}) {
  const [focus, setFocus] = useState<string | null>(null);
  const bandColor =
    alignment.band === "aligned"
      ? "rgb(13 159 110)"
      : alignment.band === "tension"
        ? "rgb(180 83 9)"
        : "rgb(35 79 150)";

  const nodes: FocusNode[] = useMemo(
    () => [
      {
        id: "su",
        code: "Soul Urge",
        role: "what you privately want",
        value: soulUrge,
        tip: `Soul Urge ${soulUrge} · ${identityTrait(soulUrge)} — what you privately want`,
        detail: `Inner want ${soulUrge} (${identityTrait(soulUrge)}) is the pull others may not see first.`,
        guide: { topic: "soul-urge", label: "Soul Urge", value: soulUrge },
      },
      {
        id: "pe",
        code: "Personality",
        role: "what other people see first",
        value: personality,
        tip: `Personality ${personality} · ${identityTrait(personality)} — how you are seen`,
        detail: `Outer face ${personality} (${identityTrait(personality)}) is often the first impression in the room.`,
        guide: {
          topic: "personality",
          label: "Personality",
          value: personality,
        },
      },
      {
        id: "meet",
        code: "∩",
        role: "Where you meet the world",
        value:
          soulUrge === personality ? soulUrge : `${soulUrge} × ${personality}`,
        tip: `${alignment.label} — ${alignment.note}`,
        detail: alignment.note,
        traitLine: alignment.label,
      },
    ],
    [soulUrge, personality, alignment],
  );

  const active = nodes.find((n) => n.id === focus) ?? null;

  return (
    <div className="space-y-1">
      <svg
        viewBox="0 0 280 100"
        className="mx-auto h-auto w-full max-w-[40rem]"
        role="img"
        aria-label="Inner want and outer face overlapping lenses. Hover or tap for details."
      >
        <SvgHotspot nodeId="su" tip={nodes[0].tip} focus={focus} setFocus={setFocus}>
          <ellipse
            cx="108"
            cy="48"
            rx="52"
            ry="36"
            fill="rgb(30 58 107 / 0.16)"
            stroke="rgb(30 58 107)"
            strokeWidth={focus === "su" ? 2.4 : 1.6}
          />
          <text x="88" y="46" fontSize="14" fill="rgb(30 58 107)" textAnchor="middle" fontWeight="700">
            {soulUrge}
          </text>
          <text x="88" y="58" fontSize="8" fill="rgb(70 82 98)" textAnchor="middle">
            Soul Urge
          </text>
          <text x="70" y="94" fontSize="8.5" fill="rgb(30 40 55)" textAnchor="middle" fontWeight="600">
            What you want
          </text>
        </SvgHotspot>

        <SvgHotspot nodeId="pe" tip={nodes[1].tip} focus={focus} setFocus={setFocus}>
          <ellipse
            cx="172"
            cy="48"
            rx="52"
            ry="36"
            fill="rgb(45 122 120 / 0.14)"
            stroke="rgb(45 122 120)"
            strokeWidth={focus === "pe" ? 2.4 : 1.6}
          />
          <text x="192" y="46" fontSize="14" fill="rgb(45 122 120)" textAnchor="middle" fontWeight="700">
            {personality}
          </text>
          <text x="192" y="58" fontSize="8" fill="rgb(70 82 98)" textAnchor="middle">
            Personality
          </text>
          <text x="210" y="94" fontSize="8.5" fill="rgb(30 40 55)" textAnchor="middle" fontWeight="600">
            What others see
          </text>
        </SvgHotspot>

        <SvgHotspot nodeId="meet" tip={nodes[2].tip} focus={focus} setFocus={setFocus}>
          <ellipse
            cx="140"
            cy="48"
            rx="22"
            ry="28"
            fill="rgb(180 83 9 / 0.16)"
            stroke="rgb(180 83 9 / 0.75)"
            strokeWidth={focus === "meet" ? 2 : 1}
            strokeDasharray={focus === "meet" ? undefined : "3 2"}
          />
          <text x="140" y="50" fontSize="8" fill="rgb(180 83 9)" textAnchor="middle" fontWeight="600">
            Meet
          </text>
          <text x="140" y="12" fontSize="8.5" fill={bandColor} textAnchor="middle" fontWeight="600">
            Where you meet the world
          </text>
        </SvgHotspot>
      </svg>
      <NodeFocusStrip focus={active} />
      {!active ? (
        <p className="text-center text-[11px] leading-5 text-ink">
          <span className="font-medium" style={{ color: bandColor }}>
            {alignment.label}
          </span>
          <span className="text-ink-soft"> — {alignment.note}</span>
        </p>
      ) : null}
    </div>
  );
}

function MaturityConvergence({
  lifePath,
  expression,
  maturity,
}: {
  lifePath: string;
  expression: string;
  maturity: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [focus, setFocus] = useState<string | null>(null);

  const nodes: FocusNode[] = useMemo(
    () => [
      {
        id: "lp",
        code: "Life Path",
        role: "first ingredient",
        value: lifePath,
        tip: `Life Path ${lifePath} · ${identityTrait(lifePath)} — one of the two numbers added to get Maturity`,
        detail: `Life Path ${lifePath} (${identityTrait(lifePath)}) is one strand that integrates into Maturity ${maturity}.`,
        guide: { topic: "life-path", label: "Life Path", value: lifePath },
      },
      {
        id: "ex",
        code: "Expression",
        role: "second ingredient",
        value: expression,
        tip: `Expression ${expression} · ${identityTrait(expression)} — the other number added to get Maturity`,
        detail: `Expression ${expression} (${identityTrait(expression)}) is the craft strand that converges with the path.`,
        guide: { topic: "expression", label: "Expression", value: expression },
      },
      {
        id: "mat",
        code: "Maturity",
        role: "the two added together",
        value: maturity,
        tip: `Maturity ${maturity} · ${identityTrait(maturity)} — Life Path ${lifePath} plus Expression ${expression}, reduced`,
        detail: `Maturity ${maturity} (${identityTrait(maturity)}) is the synthesis of Life Path ${lifePath} and Expression ${expression} — not a calendar flip.`,
        guide: { topic: "maturity", label: "Maturity", value: maturity },
      },
    ],
    [lifePath, expression, maturity],
  );

  const active = nodes.find((n) => n.id === focus) ?? null;

  return (
    <div>
      <svg
        viewBox="0 0 280 118"
        className="mx-auto h-auto w-full max-w-[40rem]"
        role="img"
        aria-label="Maturity convergence of Life Path and Expression. Hover or tap nodes for details."
      >
        <defs>
          <linearGradient id={`conv-l-${uid}`} x1="0" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="rgb(45 122 120)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(180 83 9)" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={`conv-r-${uid}`} x1="1" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="rgb(30 58 107)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(180 83 9)" stopOpacity="0.75" />
          </linearGradient>
        </defs>
        <path
          d="M56 88 L140 36"
          fill="none"
          stroke={`url(#conv-l-${uid})`}
          strokeWidth="3"
          strokeLinecap="round"
          opacity={focus ? 0.5 : 1}
        />
        <path
          d="M224 88 L140 36"
          fill="none"
          stroke={`url(#conv-r-${uid})`}
          strokeWidth="3"
          strokeLinecap="round"
          opacity={focus ? 0.5 : 1}
        />
        <text
          x="140"
          y="62"
          fontSize="8"
          fill="rgb(70 82 98)"
          textAnchor="middle"
          opacity={focus ? 0.45 : 1}
        >
          Integration
        </text>

        <SvgHotspot nodeId="mat" tip={nodes[2].tip} focus={focus} setFocus={setFocus}>
          <rect
            x="104"
            y="8"
            width="72"
            height="28"
            rx="8"
            fill="rgb(250 248 243)"
            stroke="rgb(180 83 9)"
            strokeWidth={focus === "mat" ? 2.4 : 1.8}
          />
          <text x="140" y="20" fontSize="8.5" fill="rgb(180 83 9)" textAnchor="middle" fontWeight="600">
            Maturity
          </text>
          <text x="140" y="32" fontSize="11" fill="rgb(30 40 55)" textAnchor="middle" fontWeight="700">
            {maturity}
          </text>
        </SvgHotspot>

        <SvgHotspot nodeId="lp" tip={nodes[0].tip} focus={focus} setFocus={setFocus}>
          <circle
            cx="56"
            cy="88"
            r={focus === "lp" ? 16 : 14}
            fill="rgb(45 122 120)"
            stroke={focus === "lp" ? "rgb(180 83 9)" : "transparent"}
            strokeWidth="2"
          />
          <text x="56" y="92" fontSize="10" fill="white" textAnchor="middle" fontWeight="700">
            {lifePath}
          </text>
          <text x="56" y="108" fontSize="8.5" fill="rgb(30 40 55)" textAnchor="middle" fontWeight="600">
            Life Path
          </text>
        </SvgHotspot>

        <SvgHotspot nodeId="ex" tip={nodes[1].tip} focus={focus} setFocus={setFocus}>
          <circle
            cx="224"
            cy="88"
            r={focus === "ex" ? 16 : 14}
            fill="rgb(30 58 107)"
            stroke={focus === "ex" ? "rgb(180 83 9)" : "transparent"}
            strokeWidth="2"
          />
          <text x="224" y="92" fontSize="10" fill="white" textAnchor="middle" fontWeight="700">
            {expression}
          </text>
          <text x="224" y="108" fontSize="8.5" fill="rgb(30 40 55)" textAnchor="middle" fontWeight="600">
            Expression
          </text>
        </SvgHotspot>
      </svg>
      <NodeFocusStrip focus={active} />
    </div>
  );
}

function LayerGlyph({ id }: { id: IdentityLayerCard["id"] }) {
  if (id === "expression") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold-deep" aria-hidden>
        <path
          d="M4 12 H20 M8 12 L12 8 L16 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === "inner-outer") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-sea" aria-hidden>
        <circle cx="9" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="15" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-ink" aria-hidden>
      <path
        d="M6 18 L12 6 L18 18 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-white text-ink shadow-sm transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </span>
  );
}

function MetaChip({
  value,
  topic,
  label,
  job,
  tint,
}: {
  value: string;
  topic: "birth-day" | "life-path" | "expression";
  label: string;
  /** Plain words for what this number covers, so the chip is not just a code. */
  job: string;
  tint: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm ${tint}`}
      title={`${label} ${value} — ${job}`}
    >
      <span className="opacity-80">{label}</span>
      <GuideNumberLink
        topic={topic}
        value={value}
        label={label}
        display={value}
        className="brand text-ink underline decoration-gold/40 underline-offset-2 hover:text-gold-deep"
      />
      <span className="hidden opacity-70 sm:inline">· {job}</span>
    </span>
  );
}

function MetricCell({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />
        {label}
      </p>
      <p className="mt-1 text-sm leading-5 text-ink">{value}</p>
    </div>
  );
}

function LayerVisual({
  layer,
  numbers,
  alignment,
  pattern,
}: {
  layer: IdentityLayerCard;
  numbers: Props;
  alignment: InnerOuterAlignment;
  pattern: ExpressionPattern;
}) {
  if (layer.id === "expression") {
    return (
      <ExpressionBridge
        birthDay={numbers.birthDay}
        lifePath={numbers.lifePath}
        expression={numbers.expression}
        pattern={pattern}
      />
    );
  }
  if (layer.id === "inner-outer") {
    return (
      <InnerOuterOverlap
        soulUrge={numbers.soulUrge}
        personality={numbers.personality}
        alignment={alignment}
      />
    );
  }
  return (
    <MaturityConvergence
      lifePath={numbers.lifePath}
      expression={numbers.expression}
      maturity={numbers.maturity}
    />
  );
}

function ActionIcon({ kind }: { kind: "dynamics" | "growth" | "practice" }) {
  if (kind === "dynamics") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-sea" aria-hidden>
        <path
          d="M4 18 V10 M10 18 V6 M16 18 V12 M20 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (kind === "growth") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-deep" aria-hidden>
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-ink" aria-hidden>
      <path
        d="M6 4 H16 A2 2 0 0 1 18 6 V20 L12 17 L6 20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PythagoreanIdentityLayers({
  birthDay,
  lifePath,
  expression,
  soulUrge,
  personality,
  maturity,
}: Props) {
  const model = useMemo(
    () =>
      buildPythagoreanIdentityLayers({
        birthDay,
        lifePath,
        expression,
        soulUrge,
        personality,
        maturity,
      }),
    [birthDay, lifePath, expression, soulUrge, personality, maturity],
  );
  const [open, setOpen] = useState<string | null>("expression");

  const numbers = {
    birthDay,
    lifePath,
    expression,
    soulUrge,
    personality,
    maturity,
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white/85 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="brand text-lg text-ink sm:text-xl">Identity Layers</p>
          <p className="mt-1 max-w-[65ch] text-sm leading-6 text-ink-soft">
            Three comparisons, each answering one question. Does how you come
            across match what your birth date asks of you? Does what you
            privately want match what people see? And what tends to change as
            you get older? Tap any diagram for the detail.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <MetaChip
            value={birthDay}
            topic="birth-day"
            label="Birth Day"
            job="your first instinct"
            tint="border-ink/15 bg-[rgb(30_58_107/0.08)] text-ink"
          />
          <MetaChip
            value={lifePath}
            topic="life-path"
            label="Life Path"
            job="your long-term direction"
            tint="border-sea/30 bg-[rgb(45_122_120/0.1)] text-ink"
          />
          <MetaChip
            value={expression}
            topic="expression"
            label="Expression"
            job="how you come across"
            tint="border-gold/40 bg-[rgb(180_83_9/0.1)] text-ink"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {model.layers.map((layer) => {
          const expanded = open === layer.id;
          return (
            <div
              key={layer.id}
              className="overflow-hidden rounded-xl border border-[var(--line)] bg-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
            >
              <button
                type="button"
                onClick={() =>
                  setOpen((cur) => (cur === layer.id ? null : layer.id))
                }
                className="btn-tactile flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-white"
                aria-expanded={expanded}
              >
                <LayerGlyph id={layer.id} />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
                    {layer.kicker}
                  </p>
                  <p className="brand text-lg text-ink">{layer.title}</p>
                  <p className="mt-1 max-w-[65ch] text-sm leading-6 text-ink-soft">
                    {layer.insight}
                  </p>
                </div>
                <Chevron open={expanded} />
              </button>
              <div className="border-t border-[var(--line)] bg-mist/20 px-4 py-4">
                <LayerVisual
                  layer={layer}
                  numbers={numbers}
                  alignment={model.alignment}
                  pattern={model.expressionPattern}
                />
              </div>
              {/* The three cells are the actionable part of each layer, so they
                  stay visible instead of hiding behind the accordion. */}
              <div className="space-y-3 border-t border-[var(--line)] px-4 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                  In simple words
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <MetricCell
                    label="What this can look like"
                    value={layer.micro.tone}
                    dot="bg-sea"
                  />
                  <MetricCell
                    label="What to watch"
                    value={layer.micro.tension}
                    dot="bg-gold-deep"
                  />
                  <MetricCell
                    label="What can help"
                    value={layer.micro.gift}
                    dot="bg-ink"
                  />
                </div>
                {expanded ? (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                      More about this
                    </p>
                    <p className="mt-1 max-w-[65ch] text-sm leading-6 text-ink">
                      {layer.deeper}
                    </p>
                    <LayeredNote student={layer.student} expert={layer.expert} />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <ActionIcon kind="dynamics" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
              Layer dynamics
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">{model.dynamicsSummary}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <ActionIcon kind="growth" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
              Growth invitation
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">{model.growthInvitation}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <ActionIcon kind="practice" />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
              Reflective practice
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink">{model.reflectivePractice}</p>
          <p className="mt-2 text-[11px] text-ink-soft">
            Reflective only —{" "}
            <Link
              href={`/guide/expression/${expression}`}
              className="btn-tactile inline text-gold-deep underline underline-offset-2 hover:text-ink"
            >
              Expression guide
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
