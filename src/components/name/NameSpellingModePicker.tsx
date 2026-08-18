"use client";

import type { NameSpellingMode } from "@/lib/numerology/nameSpelling";
import {
  NAME_SPELLING_LABEL,
  NICKNAME_NOTE,
} from "@/lib/numerology/nameSpelling";

type Props = {
  idPrefix: string;
  mode: NameSpellingMode;
  onModeChange: (mode: NameSpellingMode) => void;
  nickname: string;
  onNicknameChange: (value: string) => void;
  /** Show nickname field only when mode is nickname (always true when nickname selected). */
  showNicknameField?: boolean;
};

const MODES: NameSpellingMode[] = ["full", "first", "nickname"];

export function NameSpellingModePicker({
  idPrefix,
  mode,
  onModeChange,
  nickname,
  onNicknameChange,
  showNicknameField = true,
}: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-ink-soft">Name spelling for analysis</p>
      <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={`rounded-full px-3 py-1.5 text-xs transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea ${
              mode === m
                ? "bg-ink text-paper shadow-sm"
                : "text-ink-soft hover:-translate-y-px hover:bg-mist/70 hover:text-ink active:translate-y-0"
            }`}
          >
            {NAME_SPELLING_LABEL[m]}
          </button>
        ))}
      </div>
      {mode === "nickname" && showNicknameField ? (
        <label className="block text-sm text-ink" htmlFor={`${idPrefix}-nick`}>
          Nickname / called-by name
          <input
            id={`${idPrefix}-nick`}
            type="text"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder="e.g. Alex"
            className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink outline-none ring-gold focus:ring-2"
            autoComplete="off"
          />
          <span className="mt-1.5 block text-xs text-ink-soft">
            {NICKNAME_NOTE}
          </span>
        </label>
      ) : null}
      {mode === "first" ? (
        <p className="text-xs text-ink-soft">
          Uses given name(s) before the last surname token from the profile (or
          custom) full name.
        </p>
      ) : null}
      {mode === "full" ? (
        <p className="text-xs text-ink-soft">
          Full spelling—closest to classical Pythagorean Expression; also used
          as the baseline Vedic/Chaldean name total.
        </p>
      ) : null}
    </div>
  );
}
