"use client";

import { DobInput } from "@/components/DobInput";
import { isValidDob } from "@/lib/profile/date";
import {
  blankNameEra,
  MAX_NAME_ERAS,
  NAME_ERA_REASON_LABEL,
  NAME_ERA_REASONS,
  type NameEra,
} from "@/lib/profile/nameHistory";

type Props = {
  dateOfBirth: string;
  natalName: string;
  eras: NameEra[];
  onChange: (eras: NameEra[]) => void;
  disabled?: boolean;
};

export function NameHistoryEditor({
  dateOfBirth,
  natalName,
  eras,
  onChange,
  disabled = false,
}: Props) {
  const canAdd = !disabled && eras.length < MAX_NAME_ERAS && isValidDob(dateOfBirth);

  function patch(index: number, next: Partial<NameEra>) {
    onChange(eras.map((era, i) => (i === index ? { ...era, ...next } : era)));
  }

  function addEra() {
    if (!canAdd) return;
    onChange([...eras, blankNameEra()]);
  }

  function removeEra(index: number) {
    onChange(eras.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/40 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-ink">Later names</h3>
          <p className="mt-1 text-xs leading-5 text-ink-soft">
            Optional. Birth-certificate name stays{" "}
            <span className="text-ink">{natalName.trim() || "above"}</span>.
            Add a marriage, legal, or chosen name with the date it started.
            This does not use the identity-edit budget.
          </p>
        </div>
        <button
          type="button"
          onClick={addEra}
          disabled={!canAdd}
          className="btn-tactile shrink-0 rounded-full border border-gold/50 bg-gold/15 px-3 py-1.5 text-xs text-ink hover:bg-gold/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gold/15"
        >
          Add a later name
        </button>
      </div>
      {!isValidDob(dateOfBirth) ? (
        <p className="mt-2 text-xs text-ink-soft">
          Save a valid date of birth first so later names can be dated.
        </p>
      ) : null}

      {eras.length ? (
        <ul className="mt-3 space-y-3">
          {eras.map((era, index) => (
            <li
              key={era.id}
              className="rounded-xl border border-[var(--line)] bg-white/70 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wider text-ink-soft">
                  Name {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeEra(index)}
                  disabled={disabled}
                  className="btn-tactile rounded-full px-2 py-1 text-xs text-ink-soft hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
              <div className="mt-2 space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">
                    Full name as written *
                  </label>
                  <input
                    value={era.full_name}
                    disabled={disabled}
                    onChange={(e) => patch(index, { full_name: e.target.value })}
                    placeholder="e.g. ABCD YYYY"
                    className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-sm outline-none ring-gold focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-ink-soft">
                    Why it changed
                  </label>
                  <select
                    value={era.reason}
                    disabled={disabled}
                    onChange={(e) =>
                      patch(index, {
                        reason: e.target.value as NameEra["reason"],
                      })
                    }
                    className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-sm outline-none ring-gold focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {NAME_ERA_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {NAME_ERA_REASON_LABEL[reason]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <DobInput
                    id={`name-era-start-${era.id}`}
                    value={era.started_on}
                    required
                    label="In use from"
                    onChange={(started_on) => patch(index, { started_on })}
                  />
                  <DobInput
                    id={`name-era-end-${era.id}`}
                    value={era.ended_on}
                    required={false}
                    label="In use until (blank if still using)"
                    onChange={(ended_on) => patch(index, { ended_on })}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-ink-soft">
          Example: born 10/10/1980 as ABCD XYZ, then ABCD YYYY from 22/10/2005.
        </p>
      )}
    </div>
  );
}
