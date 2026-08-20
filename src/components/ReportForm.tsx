"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DobInput } from "@/components/DobInput";
import { isValidDob } from "@/lib/profile/date";
import {
  GENDER_OPTIONS,
  PURPOSE_OPTIONS,
  type PersonRecord,
} from "@/lib/profile/options";

type Props = {
  people: PersonRecord[];
};

const fieldClass =
  "w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-gold focus:ring-2";

export function ReportForm({ people }: Props) {
  const router = useRouter();
  const completePeople = useMemo(
    () =>
      people.filter(
        (p) =>
          p.full_name.trim() &&
          isValidDob(p.date_of_birth) &&
          p.gender &&
          p.purpose,
      ),
    [people],
  );

  const [personId, setPersonId] = useState(completePeople[0]?.id || "");
  const selected = completePeople.find((p) => p.id === personId) || completePeople[0];

  const [fullName, setFullName] = useState(selected?.full_name || "");
  const [preferredName, setPreferredName] = useState(selected?.preferred_name || "");
  const [nameHistory, setNameHistory] = useState(selected?.name_history ?? []);
  const [dateOfBirth, setDateOfBirth] = useState(selected?.date_of_birth || "");
  const [gender, setGender] = useState(selected?.gender || "");
  const [purpose, setPurpose] = useState(selected?.purpose || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function applyPerson(p: PersonRecord) {
    setPersonId(p.id || "");
    setFullName(p.full_name);
    setPreferredName(p.preferred_name);
    setNameHistory(p.name_history ?? []);
    setDateOfBirth(p.date_of_birth);
    setGender(p.gender);
    setPurpose(p.purpose);
  }

  const canGenerate = Boolean(
    fullName.trim() && isValidDob(dateOfBirth) && gender && purpose,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canGenerate) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          preferredName,
          dateOfBirth,
          gender,
          purpose,
          nameHistory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create report");
      router.push(`/report/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  if (completePeople.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-[var(--line)] bg-white/55 px-6 py-10 text-center">
        <p className="text-ink">
          Save at least one complete profile (you or a family member) before
          generating a reading.
        </p>
        <Link
          href="/profile"
          className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-paper hover:bg-sea-deep"
        >
          Go to profile settings
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl space-y-5">
      <div>
        <label className="mb-1 block text-sm text-ink-soft" htmlFor="person">
          Who is this reading for? *
        </label>
        <select
          id="person"
          className={fieldClass}
          value={selected?.id || ""}
          onChange={(e) => {
            const p = completePeople.find((x) => x.id === e.target.value);
            if (p) applyPerson(p);
          }}
        >
          {completePeople.map((p) => (
            <option key={p.id} value={p.id}>
              {p.is_self
                ? `${p.preferred_name || p.full_name} (Self)`
                : `${p.preferred_name || p.full_name} (${p.relationship})`}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-ink-soft">
          Manage people in{" "}
          <Link href="/profile" className="underline">
            Profile settings
          </Link>
          .
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm text-ink-soft" htmlFor="fullName">
          Full name (as per birth certificate) *
        </label>
        <input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className={fieldClass}
        />
        {nameHistory.length ? (
          <p className="mt-1 text-xs leading-5 text-ink-soft">
            This profile has {nameHistory.length} later name
            {nameHistory.length === 1 ? "" : "s"} (marriage / legal change).
            The reading keeps this birth-certificate spelling and uses the name
            in force today for current NN. Edit later names in{" "}
            <Link href="/profile" className="underline">
              Profile settings
            </Link>
            .
          </p>
        ) : (
          <p className="mt-1 text-xs text-ink-soft">
            Later names (marriage, legal change) are added in Profile settings.
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-1 block text-sm text-ink-soft"
          htmlFor="preferredName"
        >
          Preferred name
        </label>
        <input
          id="preferredName"
          value={preferredName}
          onChange={(e) => setPreferredName(e.target.value)}
          className={fieldClass}
        />
      </div>

      <DobInput
        id="dateOfBirth"
        value={dateOfBirth}
        onChange={setDateOfBirth}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-ink-soft" htmlFor="gender">
            Gender *
          </label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={fieldClass}
            required
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
          <label className="mb-1 block text-sm text-ink-soft" htmlFor="purpose">
            Purpose *
          </label>
          <select
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={fieldClass}
            required
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

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canGenerate || loading}
        className="w-full rounded-full bg-ink px-6 py-3 font-medium text-paper transition hover:bg-sea-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generating your reading…" : "Generate reading"}
      </button>
    </form>
  );
}
