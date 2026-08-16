"use client";

import { useMemo, useState } from "react";
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

export function ProfileForm({
  email,
  initialPeople,
  initialEntitlements,
}: Props) {
  const [people, setPeople] = useState<PersonRecord[]>(initialPeople);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const entitlements =
    initialEntitlements ?? resolveEntitlements(email);

  const familyLimit = entitlements.maxFamily;
  const familyCount = people.filter((p) => !p.is_self).length;
  const editLimit = entitlements.identityEditLimit;

  const canSave = useMemo(
    () => people.length > 0 && people.every(personComplete) && identityConfirmed,
    [people, identityConfirmed],
  );

  function updatePerson(index: number, patch: Partial<PersonRecord>) {
    setPeople((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    );
  }

  function addFamily() {
    if (people.filter((p) => !p.is_self).length >= familyLimit) return;
    if (people.length >= entitlements.maxPeople) return;
    setPeople((prev) => [...prev, blankFamily(prev.length)]);
  }

  function removeFamily(index: number) {
    setPeople((prev) => prev.filter((p, i) => i !== index || p.is_self));
  }

  function identityLocked(p: PersonRecord): boolean {
    if (editLimit == null) return false;
    return (p.identity_edit_count ?? 0) >= editLimit;
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

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      {email ? (
        <p className="text-sm text-ink-soft">
          Signed in as <span className="text-ink">{email}</span>
          {entitlements.isAdmin
            ? " · Admin testing access"
            : entitlements.planId === "open_beta"
              ? " · Open beta (limits soft)"
              : ` · Plan: ${entitlements.label}`}
          . Up to {entitlements.maxPeople} profile
          {entitlements.maxPeople === 1 ? "" : "s"}.
        </p>
      ) : null}

      {people.map((person, index) => {
        const locked = identityLocked(person);
        const editsUsed = person.identity_edit_count ?? 0;
        return (
          <section
            key={person.id || `${person.is_self ? "self" : "family"}-${index}`}
            className="space-y-4 rounded-2xl border border-[var(--line)] bg-white/50 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl text-ink">
                {person.is_self
                  ? "You (Self)"
                  : `Family member ${people.slice(0, index + 1).filter((p) => !p.is_self).length}`}
              </h2>
              {!person.is_self ? (
                <button
                  type="button"
                  onClick={() => removeFamily(index)}
                  className="text-sm text-ink-soft hover:text-ink"
                >
                  Remove
                </button>
              ) : null}
            </div>

            {!person.is_self ? (
              <div>
                <label className="mb-1 block text-sm text-ink-soft">
                  Relationship *
                </label>
                <select
                  className={fieldClass}
                  value={person.relationship}
                  onChange={(e) =>
                    updatePerson(index, { relationship: e.target.value })
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
                  updatePerson(index, { full_name: e.target.value })
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
                  updatePerson(index, { preferred_name: e.target.value })
                }
              />
            </div>

            <DobInput
              id={`dob-${index}`}
              value={person.date_of_birth}
              disabled={locked}
              onChange={(date_of_birth) =>
                updatePerson(index, { date_of_birth })
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
                <label className="mb-1 block text-sm text-ink-soft">
                  Gender *
                </label>
                <select
                  className={fieldClass}
                  value={person.gender}
                  onChange={(e) =>
                    updatePerson(index, { gender: e.target.value })
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
                <label className="mb-1 block text-sm text-ink-soft">
                  Purpose *
                </label>
                <select
                  className={fieldClass}
                  value={person.purpose}
                  onChange={(e) =>
                    updatePerson(index, { purpose: e.target.value })
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
        );
      })}

      {familyCount < familyLimit ? (
        <button
          type="button"
          onClick={addFamily}
          className="rounded-full border border-[var(--line)] bg-white/60 px-5 py-2.5 text-ink hover:bg-white"
        >
          Add family member
        </button>
      ) : (
        <p className="text-sm text-ink-soft">
          {entitlements.maxPeople === 1 ? (
            <>
              Free plan includes Self only.{" "}
              <Link href="/pricing" className="text-gold-deep underline">
                See plans
              </Link>{" "}
              for family profiles.
            </>
          ) : (
            <>Maximum of {familyLimit} family members on your plan.</>
          )}
        </p>
      )}

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3 text-sm text-ink">
        <input
          type="checkbox"
          className="mt-1"
          checked={identityConfirmed}
          onChange={(e) => setIdentityConfirmed(e.target.checked)}
        />
        <span>
          I double-checked each full name spelling (and date of birth). Identity
          fields can only be corrected a limited number of times after save.
        </span>
      </label>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl bg-gold/15 px-4 py-3 text-sm text-ink">
          {message}
        </p>
      ) : null}

      <button
        type="button"
        disabled={!canSave || saving}
        onClick={onSave}
        className="w-full rounded-full bg-sea px-6 py-3 text-paper transition hover:bg-sea-deep disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </div>
  );
}
