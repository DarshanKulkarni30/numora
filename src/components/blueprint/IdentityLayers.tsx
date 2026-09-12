"use client";

import { useState } from "react";
import { NameJourney } from "@/components/blueprint/NameJourney";
import type { IdentityReading } from "@/lib/numerology/blueprint/identity";
import type { NameCycle } from "@/lib/numerology/blueprint/nameCycle";
import { formatCompoundRoot } from "@/lib/numerology/chaldeanName";

type Seat = {
  code: string;
  label: string;
  digit: number;
  display: string;
  hint: string;
  inspect: string;
  compound?: number;
};

function SeatGrid({
  seats,
  spelling,
  onDigit,
}: {
  seats: Seat[];
  spelling: string;
  onDigit?: (
    digit: number,
    label: string,
    extra?: { compound?: number; spelling?: string },
  ) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {seats.map((seat) => (
        <button
          key={seat.code}
          type="button"
          className="btn-tactile rounded-xl border border-[var(--line)] bg-white/80 p-3 text-left"
          onClick={() =>
            onDigit?.(seat.digit, seat.inspect, {
              compound: seat.compound,
              spelling,
            })
          }
        >
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            {seat.code}
          </p>
          <p className="brand mt-1 text-2xl text-ink">{seat.display}</p>
          <p className="mt-1 text-xs text-ink">{seat.label}</p>
          <p className="mt-1 text-xs leading-5 text-ink-soft">{seat.hint}</p>
        </button>
      ))}
    </div>
  );
}

function architectureSeats(
  layer: IdentityReading["active"],
  prefix: string,
): Seat[] {
  return [
    {
      code: `${prefix}NN`,
      label: "Name Number",
      digit: layer.nn,
      display: layer.nnDisplay,
      hint: "All letters of this spelling",
      inspect: "Name Number",
      compound: layer.nnCompound,
    },
    {
      code: `${prefix}SN`,
      label: "Soul Number",
      digit: layer.sn,
      display: formatCompoundRoot(layer.snCompound, layer.sn),
      hint: "Vowels of the same spelling",
      inspect: "Soul",
      compound: layer.snCompound,
    },
    {
      code: `${prefix}PN`,
      label: "Personality Number",
      digit: layer.pn,
      display: formatCompoundRoot(layer.pnCompound, layer.pn),
      hint: "Consonants of the same spelling",
      inspect: "Personality",
      compound: layer.pnCompound,
    },
  ];
}

type Props = {
  bn: number;
  dn: number;
  py: number;
  identity: IdentityReading;
  activeCycle: NameCycle | null;
  natalCycle: NameCycle | null;
  onDigit?: (
    digit: number,
    label: string,
    extra?: { compound?: number; letter?: string; calc?: string[] },
  ) => void;
};

export function IdentityLayers({
  bn,
  dn,
  py,
  identity,
  activeCycle,
  natalCycle,
  onDigit,
}: Props) {
  const [showNatalCycle, setShowNatalCycle] = useState(false);
  const identityTitle = identity.sameSpelling
    ? "Identity"
    : "Active identity";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
          Foundation
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Date only. A later name never rewrites these.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="btn-tactile rounded-2xl border border-[var(--line)] bg-white/80 p-4 text-left"
            onClick={() => onDigit?.(bn, "Birth Number")}
          >
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              BN · Birth Number
            </p>
            <p className="brand mt-1 text-3xl text-ink">{bn}</p>
            <p className="mt-1 text-sm text-ink">How you start</p>
            <p className="mt-1 text-xs text-ink-soft">
              The calendar day, reduced. Not the name.
            </p>
          </button>
          <button
            type="button"
            className="btn-tactile rounded-2xl border border-[var(--line)] bg-white/80 p-4 text-left"
            onClick={() => onDigit?.(dn, "Destiny Number")}
          >
            <p className="text-[10px] uppercase tracking-wider text-ink-soft">
              DN · Destiny Number
            </p>
            <p className="brand mt-1 text-3xl text-ink">{dn}</p>
            <p className="mt-1 text-sm text-ink">Where life keeps pointing</p>
            <p className="mt-1 text-xs text-ink-soft">
              The full birth date, reduced. Not the name.
            </p>
          </button>
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
          {identityTitle}
        </p>
        <p className="mt-1 text-sm text-ink">
          {identity.sameSpelling
            ? identity.active.spelling
            : `${identity.active.spelling}${identity.eraLabel ? ` · ${identity.eraLabel}` : ""}`}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          NN, SN, and PN all use this same spelling. Name Cycle uses the given /
          first name only.
        </p>
        <div className="mt-3">
          <SeatGrid
            seats={architectureSeats(identity.active, "")}
            spelling={identity.active.spelling}
            onDigit={onDigit}
          />
        </div>
      </div>

      {!identity.sameSpelling ? (
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
            Natal identity
          </p>
          <p className="mt-1 text-sm text-ink">{identity.natal.spelling}</p>
          <p className="mt-1 text-sm text-ink-soft">
            Birth-certificate spelling. Locked. Not overwritten by the name you
            use now.
          </p>
          <div className="mt-3">
            <SeatGrid
              seats={architectureSeats(identity.natal, "N-")}
              spelling={identity.natal.spelling}
              onDigit={onDigit}
            />
          </div>
        </div>
      ) : null}

      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-gold-deep">
          Time
        </p>
        <button
          type="button"
          className="btn-tactile mt-3 rounded-2xl border border-[var(--line)] bg-white/80 p-4 text-left"
          onClick={() => onDigit?.(py, "Personal Year")}
        >
          <p className="text-[10px] uppercase tracking-wider text-ink-soft">
            PY · Personal Year
          </p>
          <p className="brand mt-1 text-3xl text-ink">{py}</p>
          <p className="mt-1 text-sm text-ink-soft">
            Date + this year. NN and SN do not rewrite this digit.
          </p>
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-4">
        <p className="text-[10px] uppercase tracking-wider text-gold-deep">
          The question
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">{identity.question}</p>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          {identity.supportLine}
        </p>
      </div>

      {activeCycle ? (
        <NameJourney
          cycle={activeCycle}
          eyebrow={
            identity.showNatalCycle ? "Active Name Cycle" : "Name Cycle"
          }
          intro={
            identity.showNatalCycle
              ? `Everyday given name (${activeCycle.firstName}). One letter per Personal Year. Active NN ${activeCycle.nameDisplay} stays the whole-spelling vibration.`
              : undefined
          }
          onSelectLetter={(letter, value) =>
            onDigit?.(value, "Name Cycle", {
              letter,
              calc: activeCycle.calcLines,
            })
          }
        />
      ) : (
        <p className="text-sm text-ink-soft">
          Add a Latin first name to read the annual Name Cycle.
        </p>
      )}

      {identity.showNatalCycle && natalCycle ? (
        <div>
          <button
            type="button"
            className="btn-tactile rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-ink"
            onClick={() => setShowNatalCycle((v) => !v)}
            aria-expanded={showNatalCycle}
          >
            {showNatalCycle
              ? "Hide natal Name Cycle"
              : "Advanced: natal Name Cycle"}
          </button>
          {showNatalCycle ? (
            <div className="mt-3">
              <NameJourney
                cycle={natalCycle}
                eyebrow="Natal Name Cycle"
                intro={`Birth given name (${natalCycle.firstName}). Shown only because it differs from the name you use now.`}
                onSelectLetter={(letter, value) =>
                  onDigit?.(value, "Name Cycle", {
                    letter,
                    calc: natalCycle.calcLines,
                  })
                }
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
