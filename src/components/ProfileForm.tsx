"use client";

import { useMemo, useState } from "react";
import { DobInput } from "@/components/DobInput";
import { isValidDob } from "@/lib/profile/date";
import {
  GENDER_OPTIONS,
  PURPOSE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  type PersonRecord,
} from "@/lib/profile/options";

type Props = {
  email?: string | null;
  initialPeople: PersonRecord[];
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

export function ProfileForm({ email, initialPeople }: Props) {
  const [people, setPeople] = useState<PersonRecord[]>(initialPeople);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(
    () => people.length > 0 && people.every(personComplete),
    [people],
  );

  function updatePerson(index: number, patch: Partial<PersonRecord>) {
    setPeople((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    );
  }

  function addFamily() {
    if (people.filter((p) => !p.is_self).length >= 3) return;
    setPeople((prev) => [...prev, blankFamily(prev.length)]);
  }

  function removeFamily(index: number) {
    setPeople((prev) => prev.filter((p, i) => i !== index || p.is_self));
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ people }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save profile");
      setPeople(data.people);
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
          Signed in as <span className="text-ink">{email}</span>. Name was
          suggested from your account where possible.
        </p>
      ) : null}

      {people.map((person, index) => (
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
              onChange={(e) => updatePerson(index, { full_name: e.target.value })}
            />
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
            onChange={(date_of_birth) => updatePerson(index, { date_of_birth })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-ink-soft">Gender *</label>
              <select
                className={fieldClass}
                value={person.gender}
                onChange={(e) => updatePerson(index, { gender: e.target.value })}
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
                onChange={(e) => updatePerson(index, { purpose: e.target.value })}
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
      ))}

      {people.filter((p) => !p.is_self).length < 3 ? (
        <button
          type="button"
          onClick={addFamily}
          className="rounded-full border border-[var(--line)] bg-white/60 px-5 py-2.5 text-ink hover:bg-white"
        >
          Add family member
        </button>
      ) : (
        <p className="text-sm text-ink-soft">Maximum of 3 family members.</p>
      )}

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl bg-gold/15 px-4 py-3 text-sm text-ink">{message}</p>
      ) : null}

      <button
        type="button"
        disabled={!canSave || saving}
        onClick={onSave}
        className="w-full rounded-full bg-ink px-6 py-3 text-paper transition hover:bg-sea-deep disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save profile"}
      </button>
    </div>
  );
}
