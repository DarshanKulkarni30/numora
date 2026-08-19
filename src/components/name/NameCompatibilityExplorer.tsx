"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DobInput } from "@/components/DobInput";
import { CompatCompass } from "@/components/report/CompatCompass";
import { calculateChaldean } from "@/lib/numerology/chaldean";
import {
  buildCompatibilityMatrix,
  TONE_HINT,
  type CompatTone,
} from "@/lib/numerology/compatibility";
import {
  lifePathFromDob,
  reduceToSingleDigit,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import {
  joinGivenAndSurname,
  splitGivenAndSurname,
} from "@/lib/numerology/nameParts";
import {
  resolveNameSpelling,
  type NameSpellingMode,
} from "@/lib/numerology/nameSpelling";
import { ownerProminenceFromDob } from "@/lib/numerology/ownerAgeProminence";
import { AgeFocusNumberChips } from "@/components/AgeFocusNumberChips";
import { NameSpellingModePicker } from "@/components/name/NameSpellingModePicker";
import { calculatePythagorean } from "@/lib/numerology/pythagorean";
import {
  TRIO_BAND_HINT,
  TRIO_BAND_ICON,
  vedicTrio,
  type TrioBand,
} from "@/lib/numerology/trioMatrix";
import {
  buildVedicCompatibilityMatrix,
  VEDIC_COMPAT_NOTE,
} from "@/lib/numerology/vedicCompatibility";
import { calculateVedic } from "@/lib/numerology/vedic";
import { isValidDob } from "@/lib/profile/date";
import type { PersonRecord } from "@/lib/profile/options";

type Props = {
  people: PersonRecord[];
};

type RightMode = "profile" | "custom";
type MethodTab = "vedic" | "chaldean" | "pythagorean";

const TONE_COLOR: Record<CompatTone, string> = {
  Amazing: "bg-emerald-100 text-emerald-950 border-emerald-300",
  Favourable: "bg-teal-50 text-teal-900 border-teal-200",
  Neutral: "bg-slate-50 text-slate-800 border-slate-200",
  Challenging: "bg-amber-50 text-amber-950 border-amber-200",
};

const BAND_WORD: Record<TrioBand, string> = {
  amazing: "Amazing",
  favourable: "Favourable",
  neutral: "Neutral",
  friction: "Friction",
  block: "Heavy",
};

const BAND_STYLE: Record<TrioBand, string> = {
  amazing: "border-emerald-300 bg-emerald-50 text-emerald-950",
  favourable: "border-teal-200 bg-teal-50 text-teal-950",
  neutral: "border-slate-200 bg-slate-50 text-slate-800",
  friction: "border-amber-300 bg-amber-50 text-amber-950",
  block: "border-rose-200 bg-rose-50 text-rose-950",
};

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

function personKey(p: PersonRecord) {
  return `${p.sort_order}-${p.full_name}`;
}

function TonePill({ tone }: { tone: CompatTone }) {
  return (
    <span
      title={TONE_HINT[tone]}
      className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${TONE_COLOR[tone]}`}
    >
      {tone}
    </span>
  );
}

function pairTones(
  selfRaw: number,
  otherRaw: number,
  kind: "pythagorean" | "vedic",
) {
  const self = reduceToSingleDigit(selfRaw);
  const other = reduceToSingleDigit(otherRaw);
  const matrix =
    kind === "pythagorean"
      ? buildCompatibilityMatrix(self)
      : buildVedicCompatibilityMatrix(self);
  const row = matrix.find((r) => r.partnerLifePath === other);
  return (
    row ?? {
      partnerLifePath: other,
      romantic: "Neutral" as CompatTone,
      business: "Neutral" as CompatTone,
      friendship: "Neutral" as CompatTone,
    }
  );
}

function ChannelBlock({
  title,
  subtitle,
  selfNumber,
  partner,
  tones,
  vedicArcLabels = false,
}: {
  title: string;
  subtitle: string;
  selfNumber: number;
  partner: number;
  tones: {
    romantic: CompatTone;
    business: CompatTone;
    friendship: CompatTone;
  };
  vedicArcLabels?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/70 p-4">
      <h3 className="text-ink">{title}</h3>
      <p className="mt-1 text-xs text-ink-soft">{subtitle}</p>
      <div className="mt-3">
        <CompatCompass
          selfNumber={selfNumber}
          partner={partner}
          romantic={tones.romantic}
          business={tones.business}
          friendship={tones.friendship}
          size={200}
          compact
          vedicArcLabels={vedicArcLabels}
          vedicPlanet={vedicArcLabels}
          systemLabel="Compatibility Compass"
        />
      </div>
    </div>
  );
}

type SidePerson = {
  label: string;
  fullName: string;
  dob: string;
};

export function NameCompatibilityExplorer({ people }: Props) {
  const selectable = useMemo(
    () =>
      people.filter(
        (p) => (p.full_name || p.preferred_name) && isValidDob(p.date_of_birth),
      ),
    [people],
  );

  const [leftKey, setLeftKey] = useState(() => {
    const self = selectable.find((p) => p.is_self);
    const first = self ?? selectable[0];
    return first ? personKey(first) : "";
  });
  const [rightMode, setRightMode] = useState<RightMode>("profile");
  const [rightKey, setRightKey] = useState(() => {
    const self = selectable.find((p) => p.is_self);
    const other = selectable.find((p) => !p.is_self) ?? selectable[1];
    if (other && self && personKey(other) !== personKey(self)) {
      return personKey(other);
    }
    return other ? personKey(other) : "";
  });
  const [customName, setCustomName] = useState("");
  const [customDob, setCustomDob] = useState("");
  const [methodTab, setMethodTab] = useState<MethodTab>("vedic");

  /** Optional trial spelling for left (e.g. after marriage). */
  const [useLeftTrial, setUseLeftTrial] = useState(false);
  const [leftTrialFirst, setLeftTrialFirst] = useState("");
  const [leftTrialLast, setLeftTrialLast] = useState("");

  /** Optional trial spelling for right (groom/bride experiment). */
  const [useRightTrial, setUseRightTrial] = useState(false);
  const [rightTrialFirst, setRightTrialFirst] = useState("");
  const [rightTrialLast, setRightTrialLast] = useState("");

  const [leftSpellingMode, setLeftSpellingMode] =
    useState<NameSpellingMode>("full");
  const [leftNickname, setLeftNickname] = useState("");
  const [rightSpellingMode, setRightSpellingMode] =
    useState<NameSpellingMode>("full");
  const [rightNickname, setRightNickname] = useState("");

  const leftProfile = selectable.find((p) => personKey(p) === leftKey);

  const left: SidePerson | null = leftProfile
    ? {
        label: personLabel(leftProfile),
        fullName: leftProfile.full_name || leftProfile.preferred_name || "",
        dob: leftProfile.date_of_birth,
      }
    : null;

  const rightProfile =
    rightMode === "profile"
      ? selectable.find((p) => personKey(p) === rightKey)
      : null;

  const right: SidePerson | null = useMemo(() => {
    if (rightMode === "custom") {
      const name = customName.trim();
      if (name.length < 2 || !isValidDob(customDob)) return null;
      return { label: name, fullName: name, dob: customDob };
    }
    if (!rightProfile) return null;
    return {
      label: personLabel(rightProfile),
      fullName: rightProfile.full_name || rightProfile.preferred_name || "",
      dob: rightProfile.date_of_birth,
    };
  }, [rightMode, customName, customDob, rightProfile]);

  const leftEffectiveName = useMemo(() => {
    if (!left) return "";
    if (
      useLeftTrial &&
      leftSpellingMode !== "nickname" &&
      leftTrialFirst.trim()
    ) {
      return leftSpellingMode === "first"
        ? leftTrialFirst.trim()
        : joinGivenAndSurname(leftTrialFirst, leftTrialLast);
    }
    const resolved = resolveNameSpelling({
      mode: leftSpellingMode,
      fullName: left.fullName,
      nickname: leftNickname,
    });
    return resolved.ready ? resolved.spelling : "";
  }, [
    left,
    useLeftTrial,
    leftTrialFirst,
    leftTrialLast,
    leftSpellingMode,
    leftNickname,
  ]);

  const rightEffectiveName = useMemo(() => {
    if (!right) return "";
    if (
      useRightTrial &&
      rightSpellingMode !== "nickname" &&
      rightTrialFirst.trim()
    ) {
      return rightSpellingMode === "first"
        ? rightTrialFirst.trim()
        : joinGivenAndSurname(rightTrialFirst, rightTrialLast);
    }
    const resolved = resolveNameSpelling({
      mode: rightSpellingMode,
      fullName: right.fullName,
      nickname: rightNickname,
    });
    return resolved.ready ? resolved.spelling : "";
  }, [
    right,
    useRightTrial,
    rightTrialFirst,
    rightTrialLast,
    rightSpellingMode,
    rightNickname,
  ]);

  const analysis = useMemo(() => {
    if (!left || !right || !leftEffectiveName || !rightEffectiveName) return null;

    const lPsychic = vedicPsychicFromDob(left.dob);
    const lDestiny = vedicDestinyFromDob(left.dob);
    const rPsychic = vedicPsychicFromDob(right.dob);
    const rDestiny = vedicDestinyFromDob(right.dob);
    const lLp = lifePathFromDob(left.dob);
    const rLp = lifePathFromDob(right.dob);

    const lProminence = ownerProminenceFromDob(left.dob, lPsychic, lDestiny);
    const rProminence = ownerProminenceFromDob(right.dob, rPsychic, rDestiny);

    const lVedic = calculateVedic(leftEffectiveName, left.dob);
    const rVedic = calculateVedic(rightEffectiveName, right.dob);
    const lChald = calculateChaldean(leftEffectiveName);
    const rChald = calculateChaldean(rightEffectiveName);
    const lPyth = calculatePythagorean(leftEffectiveName, left.dob);
    const rPyth = calculatePythagorean(rightEffectiveName, right.dob);

    const lName = reduceToSingleDigit(lVedic.nameNumber);
    const rName = reduceToSingleDigit(rVedic.nameNumber);
    const lChName = reduceToSingleDigit(lChald.nameNumber);
    const rChName = reduceToSingleDigit(rChald.nameNumber);
    const lExpr = reduceToSingleDigit(lPyth.expression);
    const rExpr = reduceToSingleDigit(rPyth.expression);

    const psychic = pairTones(lPsychic, rPsychic, "vedic");
    const destiny = pairTones(lDestiny, rDestiny, "vedic");
    const namank = pairTones(lName, rName, "vedic");
    const chaldean = pairTones(lChName, rChName, "vedic");
    const lifePath = pairTones(lLp, rLp, "pythagorean");
    const expression = pairTones(lExpr, rExpr, "pythagorean");

    const leftTrio = vedicTrio(lPsychic, lDestiny, lName);
    const rightTrio = vedicTrio(rPsychic, rDestiny, rName);

    return {
      lPsychic,
      lDestiny,
      rPsychic,
      rDestiny,
      lLp,
      rLp,
      lName,
      rName,
      lChName,
      rChName,
      lExpr,
      rExpr,
      psychic,
      destiny,
      namank,
      chaldean,
      lifePath,
      expression,
      leftTrio,
      rightTrio,
      lProminence,
      rProminence,
      leftEffectiveName,
      rightEffectiveName,
    };
  }, [left, right, leftEffectiveName, rightEffectiveName]);

  if (selectable.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-10 text-center text-sm text-ink-soft">
        Add at least one profile person with a date of birth. Left side must
        come from your profile.{" "}
        <Link href="/profile" className="text-gold-deep underline">
          Open profile
        </Link>
      </div>
    );
  }

  const rightOptions = selectable.filter((p) => personKey(p) !== leftKey);

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-6 text-ink-soft">
        Compare two people for reflective name and date fit—partners, groom and
        bride, or a spelling change after marriage. Left person is always from
        your profile. Right can be another profile person or a custom full name
        + DOB (session only).
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
            Left · required (profile)
          </p>
          <label className="mt-2 block text-sm text-ink-soft" htmlFor="compat-left">
            Person
          </label>
          <select
            id="compat-left"
            value={leftKey}
            onChange={(e) => {
              setLeftKey(e.target.value);
              const p = selectable.find((x) => personKey(x) === e.target.value);
              if (p) {
                const parts = splitGivenAndSurname(
                  p.full_name || p.preferred_name || "",
                );
                setLeftTrialFirst(parts.given);
                setLeftTrialLast(parts.surname);
              }
            }}
            className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-ink outline-none ring-gold focus:ring-2"
          >
            {selectable.map((p) => (
              <option key={personKey(p)} value={personKey(p)}>
                {personLabel(p)}
              </option>
            ))}
          </select>
          {left ? (
            <p className="mt-2 text-xs text-ink-soft">
              DOB {left.dob} · using name{" "}
              <span className="font-medium text-ink">
                {leftEffectiveName || "—"}
              </span>
            </p>
          ) : null}

          {!useLeftTrial ? (
            <div className="mt-4">
              <NameSpellingModePicker
                idPrefix="compat-left"
                mode={leftSpellingMode}
                onModeChange={(m) => {
                  setLeftSpellingMode(m);
                  if (m === "nickname") setUseLeftTrial(false);
                }}
                nickname={leftNickname}
                onNicknameChange={setLeftNickname}
              />
            </div>
          ) : null}

          {leftSpellingMode !== "nickname" ? (
            <>
              <label className="mt-4 flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={useLeftTrial}
                  onChange={(e) => {
                    setUseLeftTrial(e.target.checked);
                    if (
                      e.target.checked &&
                      left &&
                      !leftTrialFirst &&
                      !leftTrialLast
                    ) {
                      const parts = splitGivenAndSurname(left.fullName);
                      setLeftTrialFirst(parts.given);
                      setLeftTrialLast(
                        leftSpellingMode === "full" ? parts.surname : "",
                      );
                    }
                  }}
                  className="rounded border-[var(--line)]"
                />
                Trial spelling
                {leftSpellingMode === "first" ? " (first name)" : ""}
              </label>
              {useLeftTrial ? (
                <div
                  className={`mt-2 grid gap-2 ${
                    leftSpellingMode === "full" ? "sm:grid-cols-2" : ""
                  }`}
                >
                  <input
                    type="text"
                    value={leftTrialFirst}
                    onChange={(e) => setLeftTrialFirst(e.target.value)}
                    placeholder="First name"
                    className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink outline-none ring-gold focus:ring-2"
                  />
                  {leftSpellingMode === "full" ? (
                    <input
                      type="text"
                      value={leftTrialLast}
                      onChange={(e) => setLeftTrialLast(e.target.value)}
                      placeholder="Last name"
                      className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink outline-none ring-gold focus:ring-2"
                    />
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white/55 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
            Right · partner / other
          </p>
          <div className="mt-2 flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
            {(
              [
                ["profile", "From profile"],
                ["custom", "Custom name + DOB"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setRightMode(id)}
                className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
                  rightMode === id
                    ? "bg-ink text-paper shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {rightMode === "profile" ? (
            <>
              <label
                className="mt-3 block text-sm text-ink-soft"
                htmlFor="compat-right"
              >
                Person
              </label>
              <select
                id="compat-right"
                value={rightKey}
                onChange={(e) => {
                  setRightKey(e.target.value);
                  const p = selectable.find(
                    (x) => personKey(x) === e.target.value,
                  );
                  if (p) {
                    const parts = splitGivenAndSurname(
                      p.full_name || p.preferred_name || "",
                    );
                    setRightTrialFirst(parts.given);
                    setRightTrialLast(parts.surname);
                  }
                }}
                className="mt-1 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-ink outline-none ring-gold focus:ring-2"
              >
                {rightOptions.length === 0 ? (
                  <option value="">Add another profile person</option>
                ) : (
                  rightOptions.map((p) => (
                    <option key={personKey(p)} value={personKey(p)}>
                      {personLabel(p)}
                    </option>
                  ))
                )}
              </select>
              {rightOptions.length === 0 ? (
                <p className="mt-2 text-xs text-ink-soft">
                  Only one complete person on your profile—use Custom, or{" "}
                  <Link href="/profile" className="text-gold-deep underline">
                    add someone
                  </Link>
                  .
                </p>
              ) : null}
            </>
          ) : (
            <div className="mt-3 space-y-3">
              <label className="block text-sm text-ink-soft" htmlFor="compat-custom-name">
                Full name
              </label>
              <input
                id="compat-custom-name"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-ink outline-none ring-gold focus:ring-2"
              />
              <DobInput
                id="compat-custom-dob"
                value={customDob}
                onChange={setCustomDob}
                label="Date of birth"
              />
            </div>
          )}

          {right ? (
            <p className="mt-2 text-xs text-ink-soft">
              DOB {right.dob} · using name{" "}
              <span className="font-medium text-ink">
                {rightEffectiveName || "—"}
              </span>
            </p>
          ) : null}

          {!useRightTrial ? (
            <div className="mt-4">
              <NameSpellingModePicker
                idPrefix="compat-right"
                mode={rightSpellingMode}
                onModeChange={(m) => {
                  setRightSpellingMode(m);
                  if (m === "nickname") setUseRightTrial(false);
                }}
                nickname={rightNickname}
                onNicknameChange={setRightNickname}
              />
            </div>
          ) : null}

          {rightSpellingMode !== "nickname" ? (
            <>
              <label className="mt-4 flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={useRightTrial}
                  onChange={(e) => {
                    setUseRightTrial(e.target.checked);
                    if (
                      e.target.checked &&
                      right &&
                      !rightTrialFirst &&
                      !rightTrialLast
                    ) {
                      const parts = splitGivenAndSurname(right.fullName);
                      setRightTrialFirst(parts.given);
                      setRightTrialLast(
                        rightSpellingMode === "full" ? parts.surname : "",
                      );
                    }
                  }}
                  className="rounded border-[var(--line)]"
                />
                Trial spelling
                {rightSpellingMode === "first" ? " (first name)" : ""}
              </label>
              {useRightTrial ? (
                <div
                  className={`mt-2 grid gap-2 ${
                    rightSpellingMode === "full" ? "sm:grid-cols-2" : ""
                  }`}
                >
                  <input
                    type="text"
                    value={rightTrialFirst}
                    onChange={(e) => setRightTrialFirst(e.target.value)}
                    placeholder="First name"
                    className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink outline-none ring-gold focus:ring-2"
                  />
                  {rightSpellingMode === "full" ? (
                    <input
                      type="text"
                      value={rightTrialLast}
                      onChange={(e) => setRightTrialLast(e.target.value)}
                      placeholder="Last name"
                      className="rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink outline-none ring-gold focus:ring-2"
                    />
                  ) : null}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {!analysis || !left || !right ? (
        <p className="text-sm text-ink-soft">
          Select a left profile person and complete the right side (profile or
          valid custom name + DOB) to see compatibility.
        </p>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-xl text-ink">Summary</h2>
            <p className="text-sm text-ink-soft">
              {left.label} × {right.label} — romantic / business / friendship
              tones (same legend as reports). Name digits from{" "}
              <span className="font-medium text-ink">
                {analysis.leftEffectiveName}
              </span>{" "}
              ×{" "}
              <span className="font-medium text-ink">
                {analysis.rightEffectiveName}
              </span>
              .
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
                <p className="text-sm font-medium text-ink">{left.label}</p>
                <div className="mt-2">
                  <AgeFocusNumberChips
                    psychic={analysis.lPsychic}
                    destiny={analysis.lDestiny}
                    nameNumber={analysis.lName}
                    prominence={analysis.lProminence}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-[var(--line)] bg-white/60 px-4 py-3">
                <p className="text-sm font-medium text-ink">{right.label}</p>
                <div className="mt-2">
                  <AgeFocusNumberChips
                    psychic={analysis.rPsychic}
                    destiny={analysis.rDestiny}
                    nameNumber={analysis.rName}
                    prominence={analysis.rProminence}
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white/70">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="bg-mist/60 text-ink-soft">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Layer</th>
                    <th className="px-3 py-2.5 font-medium">Digits</th>
                    <th className="px-3 py-2.5 font-medium">Romantic</th>
                    <th className="px-3 py-2.5 font-medium">Business</th>
                    <th className="px-3 py-2.5 font-medium">Friendship</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      [
                        "Vedic Psychic",
                        `${analysis.lPsychic} × ${analysis.rPsychic}`,
                        analysis.psychic,
                      ],
                      [
                        "Vedic Destiny",
                        `${analysis.lDestiny} × ${analysis.rDestiny}`,
                        analysis.destiny,
                      ],
                      [
                        "Vedic Name",
                        `${analysis.lName} × ${analysis.rName}`,
                        analysis.namank,
                      ],
                      [
                        "Chaldean name",
                        `${analysis.lChName} × ${analysis.rChName}`,
                        analysis.chaldean,
                      ],
                      [
                        "Life Path",
                        `${analysis.lLp} × ${analysis.rLp}`,
                        analysis.lifePath,
                      ],
                      [
                        "Expression",
                        `${analysis.lExpr} × ${analysis.rExpr}`,
                        analysis.expression,
                      ],
                    ] as const
                  ).map(([layer, digits, tones]) => (
                    <tr key={layer} className="border-t border-[var(--line)]">
                      <td className="px-3 py-2.5 font-medium text-ink">
                        {layer}
                      </td>
                      <td className="brand px-3 py-2.5 text-ink">{digits}</td>
                      <td className="px-3 py-2.5">
                        <TonePill tone={tones.romantic} />
                      </td>
                      <td className="px-3 py-2.5">
                        <TonePill tone={tones.business} />
                      </td>
                      <td className="px-3 py-2.5">
                        <TonePill tone={tones.friendship} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-ink-soft">
              {(Object.keys(TONE_HINT) as CompatTone[]).map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <TonePill tone={t} />
                  <span>{TONE_HINT[t]}</span>
                </span>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div
                className={`rounded-xl border px-4 py-3 ${BAND_STYLE[analysis.leftTrio.band]}`}
              >
                <p className="text-[10px] uppercase tracking-wider opacity-80">
                  Left Birth × Destiny × Name
                </p>
                <p className="mt-1 font-medium">
                  {TRIO_BAND_ICON[analysis.leftTrio.band]}{" "}
                  {BAND_WORD[analysis.leftTrio.band]} · {analysis.leftTrio.label}
                </p>
                <p className="mt-1 text-xs opacity-80">
                  {TRIO_BAND_HINT[analysis.leftTrio.band]}
                </p>
              </div>
              <div
                className={`rounded-xl border px-4 py-3 ${BAND_STYLE[analysis.rightTrio.band]}`}
              >
                <p className="text-[10px] uppercase tracking-wider opacity-80">
                  Right Birth × Destiny × Name
                </p>
                <p className="mt-1 font-medium">
                  {TRIO_BAND_ICON[analysis.rightTrio.band]}{" "}
                  {BAND_WORD[analysis.rightTrio.band]} ·{" "}
                  {analysis.rightTrio.label}
                </p>
                <p className="mt-1 text-xs opacity-80">
                  {TRIO_BAND_HINT[analysis.rightTrio.band]}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
              {(
                [
                  ["vedic", "Vedic"],
                  ["chaldean", "Chaldean"],
                  ["pythagorean", "Pythagorean"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethodTab(id)}
                  className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
                    methodTab === id
                      ? "bg-ink text-paper shadow-sm"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {methodTab === "vedic" ? (
              <div className="grid gap-4 md:grid-cols-3">
                <ChannelBlock
                  title="Psychic (Moolank)"
                  subtitle={`${analysis.lPsychic} × ${analysis.rPsychic}`}
                  selfNumber={analysis.lPsychic}
                  partner={analysis.rPsychic}
                  tones={analysis.psychic}
                  vedicArcLabels
                />
                <ChannelBlock
                  title="Destiny (Bhagyank)"
                  subtitle={`${analysis.lDestiny} × ${analysis.rDestiny}`}
                  selfNumber={analysis.lDestiny}
                  partner={analysis.rDestiny}
                  tones={analysis.destiny}
                  vedicArcLabels
                />
                <ChannelBlock
                  title="Name (Namank)"
                  subtitle={`${analysis.lName} × ${analysis.rName}`}
                  selfNumber={analysis.lName}
                  partner={analysis.rName}
                  tones={analysis.namank}
                  vedicArcLabels
                />
              </div>
            ) : null}

            {methodTab === "chaldean" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <ChannelBlock
                  title="Chaldean name"
                  subtitle={`${analysis.lChName} × ${analysis.rChName}`}
                  selfNumber={analysis.lChName}
                  partner={analysis.rChName}
                  tones={analysis.chaldean}
                />
                <div className="rounded-xl border border-[var(--line)] bg-mist/40 p-4 text-sm text-ink-soft">
                  <p className="font-medium text-ink">Note</p>
                  <p className="mt-2 leading-6">
                    Chaldean letter totals (often same map as Vedic name in
                    NumoraWisdom) are paired with the same reflective tone
                    matrix as other digit layers. Spelling trials above change
                    these digits without changing DOB.
                  </p>
                </div>
              </div>
            ) : null}

            {methodTab === "pythagorean" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <ChannelBlock
                  title="Life Path"
                  subtitle={`${analysis.lLp} × ${analysis.rLp}`}
                  selfNumber={analysis.lLp}
                  partner={analysis.rLp}
                  tones={analysis.lifePath}
                />
                <ChannelBlock
                  title="Expression"
                  subtitle={`${analysis.lExpr} × ${analysis.rExpr}`}
                  selfNumber={analysis.lExpr}
                  partner={analysis.rExpr}
                  tones={analysis.expression}
                />
              </div>
            ) : null}

            <p className="text-xs leading-5 text-ink-soft">{VEDIC_COMPAT_NOTE}</p>
          </section>
        </>
      )}
    </div>
  );
}
