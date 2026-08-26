"use client";

import { useEffect, useMemo, useState } from "react";
import {
  contextMixLine,
  growthDevelopmentLine,
  growthFocusKicker,
  howToUseFocusThisWeek,
  type GrowthArea,
} from "@/lib/numerology/growthAreas";
import { reduceToSingleDigit } from "@/lib/numerology/dateNumbers";
import { DIGIT_SEASON, seasonUserCue } from "@/lib/numerology/yearRhythm";

type Props = {
  areas: GrowthArea[];
  growthMode?: boolean;
  personalYear?: string;
  personalMonth?: string;
  lifePath?: string;
  reportId?: string;
};

const SEGMENT_STYLE = [
  { stroke: "rgb(56 120 170)", fill: "rgb(56 120 170 / 0.12)", glyph: "○○" },
  { stroke: "rgb(45 122 120)", fill: "rgb(45 122 120 / 0.12)", glyph: "∿" },
  { stroke: "rgb(79 70 150)", fill: "rgb(79 70 150 / 0.12)", glyph: "◉" },
  { stroke: "rgb(45 122 90)", fill: "rgb(45 122 90 / 0.12)", glyph: "♡" },
  { stroke: "rgb(180 100 50)", fill: "rgb(180 100 50 / 0.12)", glyph: "✎" },
  { stroke: "rgb(120 90 60)", fill: "rgb(120 90 60 / 0.12)", glyph: "⟷" },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
) {
  const p0 = polar(cx, cy, r1, a0);
  const p1 = polar(cx, cy, r1, a1);
  const p2 = polar(cx, cy, r0, a1);
  const p3 = polar(cx, cy, r0, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return [
    `M ${p0.x} ${p0.y}`,
    `A ${r1} ${r1} 0 ${large} 1 ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${r0} ${r0} 0 ${large} 0 ${p3.x} ${p3.y}`,
    "Z",
  ].join(" ");
}

function wedgeLabel(title: string): string {
  return title
    .replace(/^Develop\s+/i, "")
    .replace(/\s+(catalyst|engine|balance|craft|awareness)$/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .join(" ");
}

function isoWeekKey(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

type WeekPractice = {
  what: string;
  target: string;
  deadline: string;
  completed: "" | "yes" | "partly" | "no";
  useful: "" | "very" | "somewhat" | "not";
  notice: string;
};

const EMPTY_PRACTICE: WeekPractice = {
  what: "",
  target: "",
  deadline: "",
  completed: "",
  useful: "",
  notice: "",
};

function storageKey(reportId: string, areaId: string): string {
  return `numora:growth-practice:${reportId}:${areaId}:${isoWeekKey()}`;
}

function loadPractice(reportId: string, areaId: string): WeekPractice {
  if (typeof window === "undefined") return { ...EMPTY_PRACTICE };
  try {
    const raw = window.localStorage.getItem(storageKey(reportId, areaId));
    if (!raw) return { ...EMPTY_PRACTICE };
    const parsed = JSON.parse(raw) as Partial<WeekPractice>;
    return { ...EMPTY_PRACTICE, ...parsed };
  } catch {
    return { ...EMPTY_PRACTICE };
  }
}

function savePractice(reportId: string, areaId: string, value: WeekPractice) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(reportId, areaId), JSON.stringify(value));
}

function WeekExperiment({
  reportId,
  area,
}: {
  reportId?: string;
  area: GrowthArea;
}) {
  const canStore = Boolean(reportId);
  const [draft, setDraft] = useState<WeekPractice>(EMPTY_PRACTICE);
  const [savedAt, setSavedAt] = useState(false);

  useEffect(() => {
    if (!reportId) {
      setDraft({ ...EMPTY_PRACTICE });
      return;
    }
    setDraft(loadPractice(reportId, area.id));
    setSavedAt(false);
  }, [reportId, area.id]);

  const persist = (next: WeekPractice) => {
    setDraft(next);
    if (reportId) savePractice(reportId, area.id, next);
    setSavedAt(true);
  };

  return (
    <div className="mt-4 rounded-xl border border-[var(--line)] bg-white/80 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
        Your 7-day experiment
      </p>
      <p className="mt-1 text-sm text-ink">
        <span className="font-medium">{area.actions?.[0] ?? "Choose one small practice."}</span>{" "}
        Define it, then spend a few minutes each day moving it forward.
      </p>
      {area.examples?.length ? (
        <ul className="mt-2 list-disc space-y-0.5 pl-4 text-[12px] leading-5 text-ink-soft">
          {area.examples.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-3 grid gap-2">
        <label className="block text-[11px] text-ink-soft">
          What
          <input
            type="text"
            value={draft.what}
            onChange={(e) => setDraft({ ...draft, what: e.target.value })}
            placeholder="The one outcome"
            className="mt-0.5 w-full rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>
        <label className="block text-[11px] text-ink-soft">
          Target
          <input
            type="text"
            value={draft.target}
            onChange={(e) => setDraft({ ...draft, target: e.target.value })}
            placeholder="How you will know it is done"
            className="mt-0.5 w-full rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>
        <label className="block text-[11px] text-ink-soft">
          Deadline
          <input
            type="text"
            value={draft.deadline}
            onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
            placeholder="Within seven days"
            className="mt-0.5 w-full rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>
      </div>
      <button
        type="button"
        disabled={!canStore}
        onClick={() => persist(draft)}
        className="btn-tactile mt-2 rounded-full border border-gold/40 bg-gold/15 px-3 py-1.5 text-xs text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {savedAt ? "Saved for this week" : "Save this week's experiment"}
      </button>
      {!canStore ? (
        <p className="mt-1 text-[11px] text-ink-soft">
          Open a saved report to keep this experiment on this device.
        </p>
      ) : null}

      <div className="mt-4 border-t border-[var(--line)] pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
          After 7 days
        </p>
        <p className="mt-1 text-sm text-ink">
          {area.reflectPrompt ??
            "Did one measurable target change how I used my time?"}
        </p>
        <p className="mt-2 text-[11px] text-ink-soft">Did you complete it?</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {(["yes", "partly", "no"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              disabled={!canStore}
              aria-pressed={draft.completed === opt}
              onClick={() => persist({ ...draft, completed: opt })}
              className={`btn-tactile rounded-full border px-2.5 py-1 text-[11px] capitalize ${
                draft.completed === opt
                  ? "border-ink bg-ink text-paper"
                  : "border-[var(--line)] bg-white text-ink"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-ink-soft">Did this practice help?</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {(
            [
              ["very", "Very useful"],
              ["somewhat", "Somewhat"],
              ["not", "Not useful"],
            ] as const
            ).map(([opt, label]) => (
            <button
              key={opt}
              type="button"
              disabled={!canStore}
              aria-pressed={draft.useful === opt}
              onClick={() => persist({ ...draft, useful: opt })}
              className={`btn-tactile rounded-full border px-2.5 py-1 text-[11px] ${
                draft.useful === opt
                  ? "border-ink bg-ink text-paper"
                  : "border-[var(--line)] bg-white text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="mt-2 block text-[11px] text-ink-soft">
          What did you notice?
          <textarea
            value={draft.notice}
            onChange={(e) => setDraft({ ...draft, notice: e.target.value })}
            onBlur={() => persist(draft)}
            rows={2}
            className="mt-0.5 w-full rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>
      </div>
    </div>
  );
}

export function GrowthAreasPanel({
  areas,
  growthMode = true,
  personalYear,
  personalMonth,
  lifePath,
  reportId,
}: Props) {
  const catalysts = areas.slice(0, 6);
  const [pin, setPin] = useState(0);
  const [peek, setPeek] = useState<number | null>(null);
  const shownIndex = peek ?? pin;
  const active = catalysts[shownIndex] ?? catalysts[0] ?? null;

  const yearN = personalYear
    ? reduceToSingleDigit(Number(personalYear))
    : null;
  const monthN = personalMonth
    ? reduceToSingleDigit(Number(personalMonth))
    : null;
  const yearSeason = yearN != null ? DIGIT_SEASON[yearN] : null;
  const monthSeason = monthN != null ? DIGIT_SEASON[monthN] : null;

  const deployLine = useMemo(() => {
    if (!active) return "";
    return howToUseFocusThisWeek(active, yearN, monthN);
  }, [active, yearN, monthN]);

  if (!areas.length) return null;

  const n = Math.max(catalysts.length, 1);
  const sweep = 360 / n;
  const gap = 3;
  const shownStyle = SEGMENT_STYLE[shownIndex % SEGMENT_STYLE.length];
  const development = active ? growthDevelopmentLine(active) : null;

  if (!growthMode) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-ink-soft">
          Themes that showed up across more than one part of this reading.
        </p>
        <ol className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white/70">
          {areas.map((a, i) => (
            <li
              key={a.id}
              className="border-b border-[var(--line)] px-4 py-4 last:border-0"
            >
              <div className="flex gap-3">
                <span className="brand text-lg text-gold-deep tabular-nums">
                  {i + 1}.
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-ink">{a.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-ink-soft">
                    {a.whyLine ?? a.suggestion}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-ink-soft">
        One practice that can move you forward this week. The wheel is a
        compass, not a score of what is missing.
      </p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,1fr)] lg:items-stretch">
        <div className="rounded-xl border border-[var(--line)] bg-white/60 p-3">
          <svg
            viewBox="0 0 220 220"
            className="mx-auto h-auto w-full max-w-md"
            role="img"
            aria-label="Growth focus wheel. Tap a wedge for this week's practice."
          >
            {catalysts.map((c, i) => {
              const style = SEGMENT_STYLE[i % SEGMENT_STYLE.length];
              const a0 = i * sweep + gap / 2;
              const a1 = (i + 1) * sweep - gap / 2;
              const mid = (a0 + a1) / 2;
              const icon = polar(110, 110, 78, mid);
              const label = polar(110, 110, 62, mid);
              const isPin = pin === i;
              const isShown = shownIndex === i;
              return (
                <g key={c.id}>
                  <path
                    d={wedgePath(110, 110, 36, 96, a0, a1)}
                    fill={isShown ? style.fill.replace("0.12", "0.22") : style.fill}
                    stroke={style.stroke}
                    strokeWidth={isPin ? 2.6 : isShown ? 1.8 : 1.2}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`${wedgeLabel(c.title)}${isPin ? " (current focus)" : ""}`}
                    aria-pressed={isPin}
                    onClick={() => setPin(i)}
                    onMouseEnter={() => setPeek(i)}
                    onMouseLeave={() => setPeek(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setPin(i);
                      }
                    }}
                  />
                  <text
                    x={icon.x}
                    y={icon.y - 6}
                    textAnchor="middle"
                    fontSize="9"
                    fill={style.stroke}
                    style={{ pointerEvents: "none" }}
                  >
                    {style.glyph}
                  </text>
                  <text
                    x={label.x}
                    y={label.y + 8}
                    textAnchor="middle"
                    fontSize="7"
                    fontWeight={isShown ? 700 : 600}
                    fill="rgb(24 40 70)"
                    style={{ pointerEvents: "none" }}
                  >
                    {wedgeLabel(c.title)}
                  </text>
                  {isPin ? (
                    <text
                      x={label.x}
                      y={label.y + 17}
                      textAnchor="middle"
                      fontSize="4.5"
                      fill={style.stroke}
                      style={{ pointerEvents: "none" }}
                    >
                      now
                    </text>
                  ) : null}
                </g>
              );
            })}
            <circle
              cx="110"
              cy="110"
              r="30"
              fill="rgb(250 248 243)"
              stroke="rgb(30 58 107)"
              strokeWidth="1.4"
            />
            <text
              x="110"
              y="100"
              textAnchor="middle"
              fontSize="6"
              fill="rgb(70 82 98)"
            >
              {yearSeason ? yearSeason.verb : "This year"}
            </text>
            <text
              x="110"
              y="116"
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="rgb(30 58 107)"
            >
              {yearN ?? "—"}
            </text>
            <text
              x="110"
              y="128"
              textAnchor="middle"
              fontSize="5.5"
              fill="rgb(70 82 98)"
            >
              This year
            </text>
          </svg>
        </div>

        {active ? (
          <article
            className="flex flex-col rounded-xl border bg-white/70 px-4 py-4"
            style={{ borderColor: shownStyle.stroke }}
          >
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft">
              {growthFocusKicker()}
            </p>
            <h3 className="brand mt-1 text-2xl uppercase tracking-wide text-ink">
              {active.title}
            </h3>
            {development ? (
              <p className="mt-0.5 text-sm font-medium text-ink">{development}</p>
            ) : null}
            <p className="mt-2 text-sm leading-6 text-ink">
              {active.whyLine || active.suggestion}
            </p>
            {active.whyLine ? (
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {active.suggestion}
              </p>
            ) : null}
            {deployLine ? (
              <p className="mt-3 text-sm leading-6 text-ink">
                <span className="font-medium">How to use this week. </span>
                {deployLine}
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              You are practising a behaviour, not trying to change your
              personality
              {lifePath ? ` — including Life Path ${lifePath}` : ""}.
            </p>
            <WeekExperiment reportId={reportId} area={active} />
            {active.sources.length ? (
              <p className="mt-auto pt-3 text-[11px] text-ink-soft">
                Seen in {active.sources.join(" · ")}
              </p>
            ) : null}
          </article>
        ) : null}
      </div>

      {yearN != null && monthN != null && yearSeason && monthSeason ? (
        <div className="grid gap-3 rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Year
            </p>
            <p className="brand mt-1 text-2xl text-ink">
              {yearSeason.verb} {yearN}
            </p>
            <p className="text-[11px] text-ink-soft">{seasonUserCue(yearN)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Month
            </p>
            <p className="brand mt-1 text-2xl text-ink">
              {monthSeason.verb} {monthN}
            </p>
            <p className="text-[11px] text-ink-soft">{seasonUserCue(monthN)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              Combined
            </p>
            <p className="mt-2 text-sm leading-6 text-ink">
              {contextMixLine(yearN, monthN)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
