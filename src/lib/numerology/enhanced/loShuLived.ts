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
  1: "Starting may wait for a nudge from outside. A tiny self-start (one independent first step) is often more useful than a pep talk.",
  2: "Partnership cues may be easy to miss. Naming a feeling in plain language can be the practice, not a personality change.",
  3: "Expression may stall until the room feels safe. A low-stakes sketch, note, or joke can reopen the channel.",
  4: "Plans may live in the head longer than on paper. One written sequence for a repeating task is a lived fix.",
  5: "Decision-making may lean on external confirmation rather than inner trial-and-error. A small, reversible experiment can restore that muscle.",
  6: "Care may spill without a container. Choosing what is yours to hold—and what is not—is the practice.",
  7: "Quiet analysis may be skipped under social noise. A protected thinking slot is not withdrawal; it is maintenance.",
  8: "Follow-through on material or organizational tasks may feel heavy. Steward one number (a bill, a file, a promise) to completion.",
  9: "Endings may linger. Completing a small cycle on purpose trains the larger release.",
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
        `${repeatedNumberEffect(r.number, r.count)} In daily life this may look like a default gear—useful when chosen, tiring when it is the only gear.`,
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
    `Planes in this grid read as mental ${(loShu.mental_plane ?? "").toLowerCase() || "unlisted"}, emotional ${(loShu.emotional_plane ?? "").toLowerCase() || "unlisted"}, practical ${(loShu.practical_plane ?? "").toLowerCase() || "unlisted"}. Present digits: ${present.join(", ") || "none listed"}. The user-facing question is effect, not the missing digit itself.`,
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
    lived.items.map((i) => `${i.kind === "missing" ? "Edge" : "Emphasis"} ${i.number}: ${i.effect}`),
    "enhanced.loshu.lines",
  );
}
