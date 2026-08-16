"use client";

import { formatDobInput, dobError, isValidDob } from "@/lib/profile/date";

type Props = {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  disabled?: boolean;
};

export function DobInput({
  id,
  name = "dateOfBirth",
  value,
  onChange,
  required = true,
  label = "Date of birth (DD/MM/YYYY)",
  disabled = false,
}: Props) {
  const error = value ? dobError(value) : required ? "Date of birth is required." : null;
  const showError = value.length > 0 && !isValidDob(value);

  return (
    <div>
      <label className="mb-1 block text-sm text-ink-soft" htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={id}
        name={name}
        inputMode="numeric"
        autoComplete="bday"
        placeholder="DD/MM/YYYY"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(formatDobInput(e.target.value))}
        className="w-full rounded-xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none ring-gold focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
        aria-invalid={showError}
      />
      {showError ? (
        <p className="mt-1 text-xs text-red-700">{error}</p>
      ) : (
        <p className="mt-1 text-xs text-ink-soft">Slashes are added as you type.</p>
      )}
    </div>
  );
}
