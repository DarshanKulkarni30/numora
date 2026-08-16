"use client";

import { useEffect } from "react";

/** Server redirects cannot keep URL hashes; jump client-side to method#lesson. */
export function LearningHashRedirect({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);

  return (
    <p className="py-10 text-center text-sm text-ink-soft">
      Opening lesson…
    </p>
  );
}
