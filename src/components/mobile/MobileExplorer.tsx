"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MobileFitPanel } from "@/components/mobile/MobileFitPanel";
import {
  lifePathFromDob,
  reduceToSingleDigit,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import type { PersonRecord } from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";

type Props = {
  people: PersonRecord[];
};

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

function personKey(p: PersonRecord) {
  return `${p.sort_order}-${p.full_name}`;
}

export function MobileExplorer({ people }: Props) {
  const selectable = useMemo(
    () =>
      people.filter(
        (p) => (p.full_name || p.preferred_name) && isValidDob(p.date_of_birth),
      ),
    [people],
  );

  const [selectedKey, setSelectedKey] = useState(() => {
    const self = selectable.find((p) => p.is_self);
    const first = self ?? selectable[0];
    return first ? personKey(first) : "";
  });
  const [personal, setPersonal] = useState("");
  const [business, setBusiness] = useState("");

  const selected = selectable.find((p) => personKey(p) === selectedKey);
  const dob = selected?.date_of_birth ?? "";
  const birthNumber = selected ? vedicPsychicFromDob(dob) : null;
  const destiny = selected ? vedicDestinyFromDob(dob) : null;
  const lifePath = selected
    ? reduceToSingleDigit(lifePathFromDob(dob))
    : null;

  return (
    <div className="space-y-6">
      {selectable.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-8 text-center text-sm text-ink-soft">
          Save at least one complete profile person (name + date of birth) to
          check a number.{" "}
          <Link href="/profile" className="text-gold-deep underline">
            Open profile
          </Link>
        </div>
      ) : (
        <>
          <div>
            <label
              htmlFor="mobile-person"
              className="mb-1 block text-sm text-ink-soft"
            >
              Person from your profile
            </label>
            <select
              id="mobile-person"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full max-w-xl rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
            >
              {selectable.map((p) => (
                <option key={personKey(p)} value={personKey(p)}>
                  {personLabel(p)}
                </option>
              ))}
            </select>
            {selected && birthNumber != null && destiny != null ? (
              <p className="mt-2 text-sm text-ink-soft">
                From {selected.date_of_birth}: birth number{" "}
                <span className="brand text-ink">{birthNumber}</span> · destiny{" "}
                <span className="brand text-ink">{destiny}</span>
                {lifePath != null ? (
                  <>
                    {" "}
                    · Life Path{" "}
                    <span className="brand text-ink">{lifePath}</span>
                  </>
                ) : null}
                .
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <MobileFitPanel
              title="Personal mobile"
              use="personal"
              dob={dob}
              value={personal}
              onChange={setPersonal}
            />
            <MobileFitPanel
              title="Business mobile"
              use="business"
              dob={dob}
              value={business}
              onChange={setBusiness}
            />
          </div>
        </>
      )}
    </div>
  );
}
