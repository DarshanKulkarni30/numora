"use client";

import { useState } from "react";
import { NameCompatibilityExplorer } from "@/components/name/NameCompatibilityExplorer";
import { NameExplorer } from "@/components/name/NameExplorer";
import type { PersonRecord } from "@/lib/profile/options";

type Tab = "mine" | "compat";

type Props = {
  people: PersonRecord[];
};

export function NamePageTabs({ people }: Props) {
  const [tab, setTab] = useState<Tab>("mine");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1 sm:max-w-xl">
        <button
          type="button"
          onClick={() => setTab("mine")}
          className={`btn-tactile flex-1 rounded-full px-4 py-2.5 text-sm ${
            tab === "mine"
              ? "bg-ink text-paper shadow-sm"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          My name
        </button>
        <button
          type="button"
          onClick={() => setTab("compat")}
          className={`btn-tactile flex-1 rounded-full px-4 py-2.5 text-sm ${
            tab === "compat"
              ? "bg-ink text-paper shadow-sm"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          Name compatibility
        </button>
      </div>

      {tab === "mine" ? (
        <NameExplorer people={people} />
      ) : (
        <NameCompatibilityExplorer people={people} />
      )}
    </div>
  );
}
