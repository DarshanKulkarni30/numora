import {
  missingNumberEffect,
  repeatedNumberEffect,
} from "@/lib/numerology/loShuEffects";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import type { LoShuResult } from "@/lib/numerology/types";

export type LoShuLivedItem = {
  kind: "strong" | "repeated" | "missing";
  number: number;
  effect: string;
};

export type LoShuLived = {
  items: LoShuLivedItem[];
  planes: { mental: string; emotional: string; practical: string };
  summary: string;
};

const LIVED_MISSING: Record<number, string> = {
  1: "Starting waits for a nudge from outside. Do one independent first step this week instead of waiting for a pep talk.",
  2: "Partnership signals are easy to miss. Name a feeling in plain language — that is the practice, not a personality change.",
  3: "Expression stalls until the room feels safe. A low-stakes sketch, note, or joke reopens the channel.",
  4: "Plans live in the head longer than on paper. Write one repeating task as steps. That is the fix.",
  5: "Decisions lean on other people confirming first. Run one small, reversible trial yourself.",
  6: "Care spills past what is yours. Choose what you will hold this week, and what you will not.",
  7: "Quiet analysis gets skipped under social noise. Protect a thinking slot. That is maintenance, not withdrawal.",
  8: "Follow-through on money, files, or organisation feels heavy. Steward one number (a bill, a file, a promise) to completion.",
  9: "Endings linger. Complete one small cycle on purpose so the larger release has a rehearsal.",
};

export function buildLoShuLived(loShu: LoShuResult | undefined | null): LoShuLived {
  const items: LoShuLivedItem[] = [];
  if (!loShu) {
    return {
      items,
      planes: { mental: "", emotional: "", practical: "" },
      summary: assertSafeCopy(
        "Lo Shu planes are not stored on this older report, so lived-effect lines are skipped.",
        "enhanced.loshu.summary",
      ),
    };
  }

  for (const r of loShu.repeated_numbers ?? []) {
    if (r.count < 2) continue;
    items.push({
      kind: "repeated",
      number: r.number,
      effect: assertSafeCopy(
        `${repeatedNumberEffect(r.number, r.count)} Because this digit repeats, the behaviour runs automatically rather than by choice. Do it on purpose once this week and notice whether the situation actually called for it.`,
        `enhanced.loshu.rep.${r.number}`,
      ),
    });
  }

  for (const n of loShu.missing_numbers ?? []) {
    items.push({
      kind: "missing",
      number: n,
      effect: assertSafeCopy(
        LIVED_MISSING[n] ?? missingNumberEffect(n),
        `enhanced.loshu.miss.${n}`,
      ),
    });
  }

  const present = loShu.present_numbers ?? [];
  const summary = assertSafeCopy(
    `From the birth date: thinking digits ${loShu.mental_plane || "not listed"}, feeling digits ${loShu.emotional_plane || "not listed"}, doing digits ${loShu.practical_plane || "not listed"}. Present numbers: ${present.join(", ") || "none listed"}. Quiet numbers below are practice, not a hole.`,
    "enhanced.loshu.summary",
  );

  return {
    items: items.slice(0, 8),
    planes: {
      mental: loShu.mental_plane,
      emotional: loShu.emotional_plane,
      practical: loShu.practical_plane,
    },
    summary,
  };
}

export function loShuItemLines(lived: LoShuLived): string[] {
  return assertSafeList(
    lived.items.map((i) => `${i.kind === "missing" ? "Quiet" : "Loud"} ${i.number}: ${i.effect}`),
    "enhanced.loshu.lines",
  );
}
