"use client";

import { useState } from "react";

type Props = {
  student?: string;
  expert?: string;
  dark?: boolean;
};

export function LayeredNote({ student, expert, dark }: Props) {
  const [open, setOpen] = useState<"none" | "student" | "expert">("none");
  if (!student && !expert) return null;

  const box = dark
    ? "mt-2 rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-[11px] leading-5 text-paper/80"
    : "mt-2 rounded-lg border border-[var(--line)] bg-white/80 px-3 py-2 text-[11px] leading-5 text-ink-soft";
  const btn = dark
    ? "btn-tactile rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-sand"
    : "btn-tactile rounded-full border border-[var(--line)] bg-white px-3 py-1 text-[10px] uppercase tracking-wider text-ink";

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap gap-2">
        {student ? (
          <button
            type="button"
            className={btn}
            aria-expanded={open === "student"}
            onClick={() => setOpen((o) => (o === "student" ? "none" : "student"))}
          >
            More detail
          </button>
        ) : null}
        {expert ? (
          <button
            type="button"
            className={btn}
            aria-expanded={open === "expert"}
            onClick={() => setOpen((o) => (o === "expert" ? "none" : "expert"))}
          >
            For students and experts
          </button>
        ) : null}
      </div>
      {open === "student" && student ? <p className={box}>{student}</p> : null}
      {open === "expert" && expert ? <p className={box}>{expert}</p> : null}
    </div>
  );
}
