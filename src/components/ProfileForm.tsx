"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DobInput } from "@/components/DobInput";
import { isValidDob } from "@/lib/profile/date";
import {
  resolveEntitlements,
  type Entitlements,
} from "@/lib/entitlements";
import {
  GENDER_OPTIONS,
  PURPOSE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  type PersonRecord,
} from "@/lib/profile/options";

type Props = {
  email?: string | null;
  initialPeople: PersonRecord[];
  initialEntitlements?: Entitlements;
};

const fieldClass =
  "w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-gold focus:ring-2";

function blankFamily(sort_order: number): PersonRecord {
  return {
    is_self: false,
    relationship: "Spouse/Partner",
    full_name: "",
    preferred_name: "",
    date_of_birth: "",
    gender: "",
    purpose: "",
    sort_order,
    identity_edit_count: 0,
  };
}

function personComplete(p: PersonRecord): boolean {
  return Boolean(
    p.full_name.trim() &&
      isValidDob(p.date_of_birth) &&
      p.gender &&
      p.purpose &&
      (p.is_self || p.relationship),
  );
}

function missingFields(p: PersonRecord): string[] {
  const missing: string[] = [];
  if (!p.is_self && !p.relationship) missing.push("relationship");
  if (!p.full_name.trim()) missing.push("full name");
  if (!isValidDob(p.date_of_birth)) missing.push("date of birth");
  if (!p.gender) missing.push("gender");
  if (!p.purpose) missing.push("purpose");
  return missing;
}

function personLabel(p: PersonRecord, index: number, people: PersonRecord[]): string {
  if (p.is_self) return p.preferred_name.trim() || "You";
  const nick = p.preferred_name.trim() || p.full_name.trim();
  if (nick) return nick;
  const n = people.slice(0, index + 1).filter((x) => !x.is_self).length;
  return p.relationship || `Family ${n}`;
}

export function ProfileForm({
  email,
  initialPeople,
  initialEntitlements,
}: Props) {
  const [people, setPeople] = useState<PersonRecord[]>(initialPeople);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const entitlements =
    initialEntitlements ?? resolveEntitlements(email);

  const familyLimit = entitlements.maxFamily;
  const familyCount = people.filter((p) => !p.is_self).length;
  const editLimit = entitlements.identityEditLimit;
  const canAdd =
    familyCount < familyLimit && people.length < entitlements.maxPeople;

  const completeCount = people.filter(personComplete).length;

  const canSave = useMemo(
    () => people.length > 0 && people.every(personComplete) && identityConfirmed,
    [people, identityConfirmed],
  );

  useEffect(() => {
    if (activeIndex > people.length - 1) {
      setActiveIndex(Math.max(0, people.length - 1));
    }
  }, [people.length, activeIndex]);

  const person = people[activeIndex] ?? people[0];
  const locked = person ? identityLocked(person) : false;
  const editsUsed = person?.identity_edit_count ?? 0;
  const gaps = person ? missingFields(person) : [];

  const saveHint = useMemo(() => {
    const incomplete = people.filter((p) => !personComplete(p));
    if (incomplete.length) {
      const first = incomplete[0];
      const idx = people.indexOf(first);
      const label = personLabel(first, idx, people);
      const fields = missingFields(first).slice(0, 2).join(", ");
      return `Finish ${label}: ${fields}`;
    }
    if (!identityConfirmed) return "Tick the name & date check to save";
    return null;
  }, [people, identityConfirmed]);

  function identityLocked(p: PersonRecord): boolean {
    if (editLimit == null) return false;
    return (p.identity_edit_count ?? 0) >= editLimit;
  }

  function updatePerson(index: number, patch: Partial<PersonRecord>) {
    setPeople((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    );
  }

  function addFamily() {
    if (!canAdd) return;
    setPeople((prev) => {
      const next = [...prev, blankFamily(prev.length)];
      setActiveIndex(next.length - 1);
      return next;
    });
  }

  function removeFamily(index: number) {
    setPeople((prev) => prev.filter((p, i) => i !== index || p.is_self));
    setActiveIndex((cur) => {
      if (index === cur) return Math.max(0, cur - 1);
      if (index < cur) return cur - 1;
      return cur;
    });
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ people, identityConfirmed: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save profile");
      setPeople(data.people);
      setIdentityConfirmed(false);
      setMessage("Profile saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  if (!person) return null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {email ? (
        <p className="text-sm text-ink-soft">
          Signed in as <span className="text-ink">{email}</span>
          {entitlements.isAdmin
            ? " · Admin testing access"
            : entitlements.planId === "open_beta"
              ? " · Open beta (limits soft)"
              : ` · Plan: ${entitlements.label}`}
          . {completeCount}/{people.length} profile
          {people.length === 1 ? "" : "s"} ready.
        </p>
      ) : null}

      <div className="sticky top-0 z-20 -mx-1 mt-4 border-b border-[var(--line)] bg-paper/95 px-1 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex min-w-0 flex-1 flex-wrap gap-1.5"
            role="tablist"
            aria-label="Profiles"
          >
            {people.map((p, index) => {
              const done = personComplete(p);
              const selected = index === activeIndex;
              return (
                <button
                  key={p.id || `${p.is_self ? "self" : "family"}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveIndex(index)}
                  className={`btn-tactile inline-flex max-w-[11rem] items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                    selected
                      ? "border-ink bg-ink text-paper"
                      : "border-[var(--line)] bg-white/70 text-ink hover:bg-white"
                  }`}
                >
                  <span className="truncate">{personLabel(p, index, people)}</span>
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      done
                        ? selected
                          ? "bg-emerald-300"
                          : "bg-emerald-500"
                        : selected
                          ? "bg-amber-200"
                          : "bg-amber-400"
                    }`}
                    title={done ? "Complete" : "Needs details"}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>
          {canAdd ? (
            <button
              type="button"
              onClick={addFamily}
              className="btn-tactile shrink-0 rounded-full border border-gold/50 bg-gold/15 px-4 py-1.5 text-sm text-ink hover:bg-gold/25"
            >
              Add family
            </button>
          ) : entitlements.maxPeople === 1 ? (
            <Link
              href="/pricing"
              className="btn-tactile shrink-0 rounded-full border border-[var(--line)] bg-white/70 px-4 py-1.5 text-sm text-ink-soft hover:text-ink"
            >
              Plans for family
            </Link>
          ) : (
            <span className="text-xs text-ink-soft">Family limit reached</span>
          )}
        </div>
      </div>

      <section
        role="tabpanel"
        className="mt-5 space-y-4 rounded-2xl border border-[var(--line)] bg-white/50 p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl text-ink">
            {person.is_self
              ? "You (Self)"
              : person.relationship || "Family member"}
          </h2>
          {!person.is_self ? (
            <button
              type="button"
              onClick={() => removeFamily(activeIndex)}
              className="btn-tactile rounded-full px-3 py-1 text-sm text-ink-soft hover:text-ink"
            >
              Remove
            </button>
          ) : null}
        </div>

        {gaps.length ? (
          <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            Still needed: {gaps.join(", ")}.
          </p>
        ) : (
          <p className="text-xs text-ink-soft">This profile is ready to save.</p>
        )}

        {!person.is_self ? (
          <div>
            <label className="mb-1 block text-sm text-ink-soft">
              Relationship *
            </label>
            <select
              className={fieldClass}
              value={person.relationship}
              onChange={(e) =>
                updatePerson(activeIndex, { relationship: e.target.value })
              }
            >
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-sm text-ink-soft">
            Full name (as per birth certificate) *
          </label>
          <input
            className={fieldClass}
            value={person.full_name}
            disabled={locked}
            onChange={(e) =>
              updatePerson(activeIndex, { full_name: e.target.value })
            }
          />
          {editLimit != null ? (
            <p className="mt-1 text-xs text-ink-soft">
              {locked
                ? "Identity edit budget used (full name & DOB locked)."
                : `Identity edits left after save: ${Math.max(0, editLimit - editsUsed)} of ${editLimit}.`}
            </p>
          ) : null}
        </div>

        <div>
          <label className="mb-1 block text-sm text-ink-soft">
            Preferred name
          </label>
          <input
            className={fieldClass}
            value={person.preferred_name}
            onChange={(e) =>
              updatePerson(activeIndex, { preferred_name: e.target.value })
            }
          />
        </div>

        <DobInput
          id={`dob-${activeIndex}`}
          value={person.date_of_birth}
          disabled={locked}
          onChange={(date_of_birth) =>
            updatePerson(activeIndex, { date_of_birth })
          }
        />
        {locked ? (
          <p className="text-xs text-ink-soft">
            Date of birth is locked with full name after {editLimit} identity
            edits.
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-ink-soft">Gender *</label>
            <select
              className={fieldClass}
              value={person.gender}
              onChange={(e) =>
                updatePerson(activeIndex, { gender: e.target.value })
              }
            >
              <option value="">Select gender</option>
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-soft">Purpose *</label>
            <select
              className={fieldClass}
              value={person.purpose}
              onChange={(e) =>
                updatePerson(activeIndex, { purpose: e.target.value })
              }
            >
              <option value="">Select purpose</option>
              {PURPOSE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-4 rounded-xl bg-gold/15 px-4 py-3 text-sm text-ink">
          {message}
        </p>
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-paper/95 px-5 py-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              className="mt-1"
              checked={identityConfirmed}
              onChange={(e) => setIdentityConfirmed(e.target.checked)}
            />
            <span className="leading-snug">
              I checked each full name and date of birth. Identity fields can
              only be corrected a limited number of times after save.
            </span>
          </label>
          <div className="flex shrink-0 flex-col items-stretch gap-1 sm:w-48">
            <button
              type="button"
              disabled={!canSave || saving}
              onClick={onSave}
              className="btn-tactile rounded-full bg-sea px-6 py-3 text-paper hover:bg-sea-deep disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
            {!canSave && saveHint ? (
              <p className="text-center text-[11px] text-ink-soft">{saveHint}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
