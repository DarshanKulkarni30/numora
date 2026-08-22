"use client";

import { useState } from "react";

type Props = {
  student?: string;
  expert?: string;
  dark?: boolean;
};

export function LayeredNote({ student, expert, dark }: Props) {
  // Both layers can be open at once: a practitioner often wants the working and
  // the method notes side by side, and the old single-slot state hid one to
  // show the other.
  const [showStudent, setShowStudent] = useState(false);
  const [showExpert, setShowExpert] = useState(false);
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
            aria-expanded={showStudent}
            onClick={() => setShowStudent((v) => !v)}
          >
            {showStudent ? "Hide the maths" : "How this is calculated"}
          </button>
        ) : null}
        {expert ? (
          <button
            type="button"
            className={btn}
            aria-expanded={showExpert}
            onClick={() => setShowExpert((v) => !v)}
          >
            {showExpert ? "Hide method notes" : "Method notes"}
          </button>
        ) : null}
      </div>
      {showStudent && student ? <p className={box}>{student}</p> : null}
      {showExpert && expert ? <p className={box}>{expert}</p> : null}
    </div>
  );
}
