"use client";

import { useState } from "react";
import { wikiOrthographicMapUrl } from "@/lib/trivia/wikiMaps";

type Props = {
  name: string;
  iso2: string;
  className?: string;
};

/** Wikipedia-style orthographic locator map with flag fallback. */
export function CountryWikiMap({ name, iso2, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const src = wikiOrthographicMapUrl(name, iso2, 200);

  if (failed) {
    return (
      <div
        className={`flex aspect-square w-full flex-col items-center justify-center rounded border border-[var(--line)] bg-gradient-to-b from-mist to-white p-1 ${className}`}
        title={`${name} map unavailable — showing flag`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://flagcdn.com/w80/${iso2}.png`}
          alt=""
          width={48}
          height={32}
          className="h-8 w-auto rounded-sm shadow-sm"
        />
        <span className="mt-1 text-[9px] uppercase tracking-wider text-ink-soft">
          {iso2}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Location of ${name} on the globe`}
      width={200}
      height={200}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`aspect-square w-full rounded border border-[var(--line)] bg-white object-contain ${className}`}
    />
  );
}
