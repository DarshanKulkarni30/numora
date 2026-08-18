/**
 * Resolve which spelling feeds name-number / Birth×Destiny×Name reads.
 * Pythagorean Expression classically uses full name; Chaldean/Vedic Namank
 * often uses the name people speak—first name or a majority-use nickname.
 */

import { splitGivenAndSurname } from "./nameParts";

export type NameSpellingMode = "full" | "first" | "nickname";

export const NAME_SPELLING_LABEL: Record<NameSpellingMode, string> = {
  full: "Full name",
  first: "First / given name",
  nickname: "Nickname (called-by)",
};

export const NICKNAME_NOTE =
  "Use a nickname only when people call them by this name most of the time. Reflective branding / compatibility note—not legal naming advice.";

export function resolveNameSpelling(opts: {
  mode: NameSpellingMode;
  fullName: string;
  nickname?: string;
}): { spelling: string; label: string; ready: boolean } {
  const full = opts.fullName.trim().replace(/\s+/g, " ");
  if (opts.mode === "nickname") {
    const nick = (opts.nickname ?? "").trim();
    return {
      spelling: nick,
      label: NAME_SPELLING_LABEL.nickname,
      ready: nick.length >= 2,
    };
  }
  if (opts.mode === "first") {
    const { given } = splitGivenAndSurname(full);
    const first = (given || full.split(/\s+/)[0] || "").trim();
    return {
      spelling: first,
      label: NAME_SPELLING_LABEL.first,
      ready: first.length >= 2,
    };
  }
  return {
    spelling: full,
    label: NAME_SPELLING_LABEL.full,
    ready: full.length >= 2,
  };
}
