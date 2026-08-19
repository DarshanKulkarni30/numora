"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { GuideNumberLink } from "@/components/report/GuideNumberLink";
import {
  buildPythagoreanIdentityLayers,
  type IdentityLayerCard,
} from "@/lib/numerology/pythagoreanIdentityLayers";

type Props = {
  birthDay: string;
  lifePath: string;
  expression: string;
  soulUrge: string;
  personality: string;
  maturity: string;
};

function ExpressionBrush({
  birthDay,
  lifePath,
  expression,
}: {
  birthDay: string;
  lifePath: string;
  expression: string;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 56" className="h-14 w-full" aria-hidden>
      <defs>
        <linearGradient id={`bd-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(30 58 107)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="rgb(30 58 107)" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`lp-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(45 122 120)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(45 122 120)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`ex-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgb(180 83 9)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(180 83 9)" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path
        d="M12 22 C48 18 72 20 96 24"
        fill="none"
        stroke={`url(#bd-${uid})`}
        strokeWidth="7"
        strokeLinecap="round"
        className="motion-safe:opacity-90"
      />
      <path
        d="M104 30 C128 28 156 26 188 28"
        fill="none"
        stroke={`url(#lp-${uid})`}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M40 40 C88 12 120 44 168 16"
        fill="none"
        stroke={`url(#ex-${uid})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        className="motion-safe:animate-pulse"
      />
      <text x="14" y="50" fontSize="7" fill="rgb(70 82 98)">
        BD {birthDay}
      </text>
      <text x="92" y="12" fontSize="7" fill="rgb(180 83 9)" textAnchor="middle">
        Ex {expression}
      </text>
      <text x="186" y="50" fontSize="7" fill="rgb(70 82 98)" textAnchor="end">
        LP {lifePath}
      </text>
    </svg>
  );
}

function DualMasks({
  soulUrge,
  personality,
}: {
  soulUrge: string;
  personality: string;
}) {
  return (
    <svg viewBox="0 0 200 64" className="h-16 w-full" aria-hidden>
      {/* Inner mask — indigo */}
      <ellipse
        cx="78"
        cy="32"
        rx="28"
        ry="24"
        fill="rgb(30 58 107 / 0.2)"
        stroke="rgb(30 58 107)"
        strokeWidth="1.4"
      />
      <circle cx="68" cy="28" r="2.2" fill="rgb(30 58 107)" />
      <circle cx="88" cy="28" r="2.2" fill="rgb(30 58 107)" />
      <path
        d="M68 40 Q78 36 88 40"
        fill="none"
        stroke="rgb(30 58 107)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Outer mask — teal, slightly forward */}
      <ellipse
        cx="122"
        cy="30"
        rx="28"
        ry="24"
        fill="rgb(45 122 120 / 0.18)"
        stroke="rgb(45 122 120)"
        strokeWidth="1.4"
        className="origin-center motion-safe:animate-pulse"
      />
      <circle cx="112" cy="26" r="2.2" fill="rgb(45 122 120)" />
      <circle cx="132" cy="26" r="2.2" fill="rgb(45 122 120)" />
      <path
        d="M112 40 Q122 44 132 40"
        fill="none"
        stroke="rgb(45 122 120)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <text x="78" y="62" fontSize="7" fill="rgb(70 82 98)" textAnchor="middle">
        SU {soulUrge}
      </text>
      <text x="122" y="62" fontSize="7" fill="rgb(70 82 98)" textAnchor="middle">
        PE {personality}
      </text>
    </svg>
  );
}

function RipeningArc({
  lifePath,
  expression,
  maturity,
}: {
  lifePath: string;
  expression: string;
  maturity: string;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 64" className="h-16 w-full" aria-hidden>
      <defs>
        <linearGradient id={`arc-${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(45 122 120)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="rgb(180 83 9)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="rgb(30 58 107)" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path
        d="M24 48 Q100 8 176 48"
        fill="none"
        stroke={`url(#arc-${uid})`}
        strokeWidth="5"
        strokeLinecap="round"
        className="motion-safe:opacity-95"
      />
      <circle cx="24" cy="48" r="4" fill="rgb(45 122 120)" />
      <circle cx="100" cy="18" r="4.5" fill="rgb(180 83 9)" />
      <circle
        cx="176"
        cy="48"
        r="5.5"
        fill="rgb(30 58 107)"
        className="motion-safe:animate-pulse"
      />
      {/* petal glyph at maturity */}
      <path
        d="M176 36 C172 40 172 44 176 48 C180 44 180 40 176 36 Z"
        fill="rgb(250 248 243)"
        stroke="rgb(180 83 9)"
        strokeWidth="0.8"
      />
      <text x="24" y="60" fontSize="7" fill="rgb(70 82 98)" textAnchor="middle">
        LP {lifePath}
      </text>
      <text x="100" y="12" fontSize="7" fill="rgb(180 83 9)" textAnchor="middle">
        Ex {expression}
      </text>
      <text x="176" y="60" fontSize="7" fill="rgb(70 82 98)" textAnchor="middle">
        Mat {maturity}
      </text>
    </svg>
  );
}

function LayerGlyph({ id }: { id: IdentityLayerCard["id"] }) {
  if (id === "expression") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold-deep" aria-hidden>
        <path
          d="M12 4 L20 18 H4 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
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
        d="M12 20 C8 16 8 10 12 6 C16 10 16 16 12 20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function LayerVisual({
  layer,
  numbers,
}: {
  layer: IdentityLayerCard;
  numbers: Props;
}) {
  if (layer.id === "expression") {
    return (
      <ExpressionBrush
        birthDay={numbers.birthDay}
        lifePath={numbers.lifePath}
        expression={numbers.expression}
      />
    );
  }
  if (layer.id === "inner-outer") {
    return (
      <DualMasks
        soulUrge={numbers.soulUrge}
        personality={numbers.personality}
      />
    );
  }
  return (
    <RipeningArc
      lifePath={numbers.lifePath}
      expression={numbers.expression}
      maturity={numbers.maturity}
    />
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
    <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-ink-soft">
            Identity Layers
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            How your name and birth tones interact — Expression, inner want vs
            outer face, and ripening Maturity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-ink-soft">
          <span>
            BD{" "}
            <GuideNumberLink
              topic="birth-day"
              value={birthDay}
              label="Birth Day"
              display={birthDay}
              className="brand text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
            />
          </span>
          <span>·</span>
          <span>
            LP{" "}
            <GuideNumberLink
              topic="life-path"
              value={lifePath}
              label="Life Path"
              display={lifePath}
              className="brand text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
            />
          </span>
          <span>·</span>
          <span>
            Ex{" "}
            <GuideNumberLink
              topic="expression"
              value={expression}
              label="Expression"
              display={expression}
              className="brand text-ink underline decoration-gold/50 underline-offset-2 hover:text-gold-deep"
            />
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {model.layers.map((layer) => {
          const expanded = open === layer.id;
          return (
            <div
              key={layer.id}
              className="overflow-hidden rounded-xl border border-[var(--line)] bg-white/60"
            >
              <button
                type="button"
                onClick={() =>
                  setOpen((cur) => (cur === layer.id ? null : layer.id))
                }
                className="btn-tactile flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-white/80"
                aria-expanded={expanded}
              >
                <LayerGlyph id={layer.id} />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-ink-soft">
                    {layer.kicker}
                  </p>
                  <p className="font-medium text-ink">{layer.title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {layer.insight}
                  </p>
                </div>
                <span className="text-xs text-ink-soft">
                  {expanded ? "Less" : "More"}
                </span>
              </button>
              <div className="border-t border-[var(--line)] px-4 py-3">
                <LayerVisual layer={layer} numbers={numbers} />
              </div>
              {expanded ? (
                <div className="space-y-3 border-t border-[var(--line)] px-4 py-3">
                  <dl className="grid gap-2 sm:grid-cols-3 text-xs">
                    <div>
                      <dt className="uppercase tracking-wider text-ink-soft">
                        Tone
                      </dt>
                      <dd className="mt-0.5 text-ink">{layer.micro.tone}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-wider text-ink-soft">
                        Tension
                      </dt>
                      <dd className="mt-0.5 text-ink">{layer.micro.tension}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-wider text-ink-soft">
                        Gift
                      </dt>
                      <dd className="mt-0.5 text-ink">{layer.micro.gift}</dd>
                    </div>
                  </dl>
                  <p className="text-sm leading-6 text-ink-soft">{layer.deeper}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3 md:col-span-1">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Layer dynamics
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {model.dynamicsSummary}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Growth invitation
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {model.growthInvitation}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            Reflective practice
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {model.reflectivePractice}
          </p>
          <p className="mt-2 text-[11px] text-ink-soft">
            Reflective only —{" "}
            <Link
              href={`/guide/expression/${expression}`}
              className="text-gold-deep underline underline-offset-2 hover:text-ink"
            >
              Expression guide
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
