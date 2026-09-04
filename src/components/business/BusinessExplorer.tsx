"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateChaldean } from "@/lib/numerology/chaldean";
import {
  BUSINESS_DOMAINS,
  DOMAIN_FIT_STYLE,
  DOMAIN_FIT_WORD,
  companyMobileHarmony,
  coreDigitFit,
  domainFit,
  getBusinessDomain,
  type DomainFit,
} from "@/lib/numerology/businessDomains";
import {
  reduceToSingleDigit,
  vedicDestinyFromDob,
  vedicPsychicFromDob,
} from "@/lib/numerology/dateNumbers";
import { analyzeCompanyNameChaldean } from "@/lib/numerology/companyNameBreakdown";
import { ownerProminenceFromDob } from "@/lib/numerology/ownerAgeProminence";
import { parseMobile } from "@/lib/numerology/mobileNumber";
import { MobileFitPanel } from "@/components/mobile/MobileFitPanel";
import { CompanyChaldeanMatrix } from "@/components/business/CompanyChaldeanMatrix";
import { UpgradeRequired } from "@/components/UpgradeRequired";
import {
  TRIO_BAND_HINT,
  TRIO_BAND_ICON,
  vedicTrio,
  type TrioBand,
} from "@/lib/numerology/trioMatrix";
import { calculateVedic } from "@/lib/numerology/vedic";
import type { PersonRecord } from "@/lib/profile/options";
import { isValidDob } from "@/lib/profile/date";
import type { OwnerProminence } from "@/lib/numerology/ownerAgeProminence";

type Props = {
  people: PersonRecord[];
  /** Company-name tab (paid). Mobile tab stays available on Free. */
  canUseCompany?: boolean;
};

type FeatureTab = "personal" | "business" | "company";

type OwnerBits = {
  key: string;
  person: PersonRecord;
  label: string;
  psychic: number;
  destiny: number;
  personalName: number | null;
  prominence: OwnerProminence;
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

function personKey(p: PersonRecord) {
  return `${p.sort_order}-${p.full_name}`;
}

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

function DomainFitChip({ fit, label }: { fit: DomainFit; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${DOMAIN_FIT_STYLE[fit]}`}
    >
      {DOMAIN_FIT_WORD[fit]} · {label}
    </span>
  );
}

function OwnerNumberChip({
  label,
  value,
  ageFocus,
}: {
  label: string;
  value: number;
  ageFocus?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
        ageFocus
          ? "border-sea/40 bg-sea/10 text-sea-deep ring-2 ring-sea/20"
          : "border-[var(--line)] bg-white/80 text-ink"
      }`}
    >
      {label} {value}
      {ageFocus ? " · age focus" : ""}
    </span>
  );
}

function OwnerNumberChips({ owner }: { owner: OwnerBits }) {
  const psychicFocus = owner.prominence.phase !== "destiny_led";
  const destinyFocus = owner.prominence.phase !== "psychic_led";
  return (
    <div className="flex flex-wrap gap-2">
      <OwnerNumberChip
        label="Psychic"
        value={owner.psychic}
        ageFocus={psychicFocus}
      />
      <OwnerNumberChip
        label="Destiny"
        value={owner.destiny}
        ageFocus={destinyFocus}
      />
      {owner.personalName != null ? (
        <OwnerNumberChip label="Name" value={owner.personalName} />
      ) : null}
    </div>
  );
}

export function BusinessExplorer({
  people,
  canUseCompany = true,
}: Props) {
  const selectable = useMemo(
    () =>
      people.filter(
        (p) => (p.full_name || p.preferred_name) && isValidDob(p.date_of_birth),
      ),
    [people],
  );

  const [selectedKeys, setSelectedKeys] = useState<string[]>(() => {
    const self = selectable.find((p) => p.is_self);
    const first = self ?? selectable[0];
    return first ? [personKey(first)] : [];
  });
  const [featureTab, setFeatureTab] = useState<FeatureTab>("personal");
  const [domainId, setDomainId] = useState("general");
  const [mobileRaw, setMobileRaw] = useState("");
  const [companyRaw, setCompanyRaw] = useState("");

  const showCompanyUpgrade = featureTab === "company" && !canUseCompany;
  const isPersonal = featureTab === "personal";
  const isBusinessSurface = featureTab === "business" || featureTab === "company";
  const domain = getBusinessDomain(domainId);

  const owners: OwnerBits[] = useMemo(() => {
    return selectedKeys
      .map((key) => selectable.find((p) => personKey(p) === key))
      .filter((p): p is PersonRecord => p != null)
      .map((p) => {
        const dob = p.date_of_birth;
        const fullName = p.full_name || p.preferred_name || "";
        const psychic = vedicPsychicFromDob(dob);
        const destiny = vedicDestinyFromDob(dob);
        let personalName: number | null = null;
        if (fullName) {
          personalName = reduceToSingleDigit(
            calculateVedic(fullName, dob).nameNumber,
          );
        }
        return {
          key: personKey(p),
          person: p,
          label: personLabel(p),
          psychic,
          destiny,
          personalName,
          prominence: ownerProminenceFromDob(dob, psychic, destiny),
        };
      });
  }, [selectable, selectedKeys]);

  const mobile = useMemo(() => parseMobile(mobileRaw), [mobileRaw]);
  const mobileCore = mobile.ok ? mobile.core : null;

  /** Company letter totals are spelling-only; DOB is only a calc carrier. */
  const companyLayers = useMemo(() => {
    const name = companyRaw.trim();
    if (name.length < 2) return null;
    const carrierDob = owners[0]?.person.date_of_birth ?? "01/01/2000";
    const vedic = calculateVedic(name, carrierDob);
    const chald = calculateChaldean(name);
    return {
      vedicName: vedic.nameNumber,
      vedicCore: reduceToSingleDigit(vedic.nameNumber),
      unitName: vedic.unitSystemNameNumber,
      chaldean: chald.nameNumber,
      chaldeanCore: reduceToSingleDigit(chald.nameNumber),
    };
  }, [companyRaw, owners]);

  const companyMobile =
    companyLayers && mobileCore != null
      ? companyMobileHarmony(companyLayers.vedicCore, mobileCore, domain)
      : null;

  const unusedOwners = useMemo(
    () => selectable.filter((p) => !selectedKeys.includes(personKey(p))),
    [selectable, selectedKeys],
  );

  const setOwnerAt = (index: number, key: string) => {
    setSelectedKeys((prev) => {
      const next = [...prev];
      if (next.includes(key) && next[index] !== key) return prev;
      next[index] = key;
      return next;
    });
  };

  const addOwnerSlot = () => {
    const next = unusedOwners[0];
    if (!next) return;
    setSelectedKeys((prev) => [...prev, personKey(next)]);
  };

  const removeOwnerAt = (index: number) => {
    setSelectedKeys((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <h1 className="text-4xl text-ink">
          {isPersonal ? "Personal number" : "Business numbers"}
        </h1>
        <p className="mt-3 text-ink-soft">
          {isPersonal
            ? "Check a personal national number against this person’s birth and destiny numbers. Area of business is not used here."
            : "Score a business mobile and a company or brand name against the owner’s Psychic, Destiny, and personal name—plus your area of business. Company × mobile fit is domain-aware. Reflective branding notes only, not legal or financial advice."}
        </p>
      </div>

      {selectable.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-8 text-center text-sm text-ink-soft">
          Save at least one complete profile person (name + DOB) to explore
          numbers.{" "}
          <Link href="/profile" className="text-gold-deep underline">
            Open profile
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
            {(
              [
                ["personal", "Personal number"],
                ["business", "Business mobile"],
                ["company", "Company name"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFeatureTab(id)}
                className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
                  featureTab === id
                    ? "bg-ink text-paper shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {label}
                {id === "company" && !canUseCompany ? " · Pro" : ""}
              </button>
            ))}
          </div>

          <div className={`grid gap-4 ${isBusinessSurface ? "lg:grid-cols-2" : ""}`}>
            <div>
              <p className="mb-1 text-sm text-ink-soft">
                {isPersonal ? "Person from your profile" : "Owners from your profile"}
              </p>
              <div className="space-y-2">
                {(isPersonal ? selectedKeys.slice(0, 1) : selectedKeys).map((key, index) => {
                  const current = selectable.find((p) => personKey(p) === key);
                  const options = selectable.filter(
                    (p) =>
                      personKey(p) === key ||
                      !selectedKeys.includes(personKey(p)),
                  );
                  return (
                    <div key={`owner-slot-${index}`} className="flex gap-2">
                      <label className="sr-only" htmlFor={`biz-owner-${index}`}>
                        Owner {index + 1}
                      </label>
                      <select
                        id={`biz-owner-${index}`}
                        value={key}
                        onChange={(e) => setOwnerAt(index, e.target.value)}
                        className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2.5 text-sm text-ink outline-none ring-gold focus:ring-2"
                      >
                        {options.map((p) => (
                          <option key={personKey(p)} value={personKey(p)}>
                            {personLabel(p)}
                          </option>
                        ))}
                      </select>
                      {isBusinessSurface && selectedKeys.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeOwnerAt(index)}
                          className="shrink-0 rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-sm text-ink-soft transition duration-200 hover:-translate-y-px hover:border-rose-300 hover:bg-rose-50 hover:text-rose-900 hover:shadow-sm active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
                          aria-label={`Remove ${current ? personLabel(current) : "owner"}`}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  );
                })}
                {isBusinessSurface ? (
                  <button
                    type="button"
                    onClick={addOwnerSlot}
                    disabled={unusedOwners.length === 0}
                    className="rounded-xl border border-dashed border-[var(--line)] bg-white/60 px-3 py-2 text-sm text-ink transition duration-200 hover:-translate-y-px hover:border-sea/40 hover:bg-mist/60 hover:shadow-sm active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    Add owner
                  </button>
                ) : null}
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                {isPersonal
                  ? "This reading uses one person from your profile."
                  : "Each owner gets their own compatibility section. Use Add owner for co-founders or family on the same venture."}
              </p>
              {owners.length > 0 ? (
                <ul className="mt-2 space-y-1 text-xs text-ink-soft">
                  {(isPersonal ? owners.slice(0, 1) : owners).map((o) => (
                    <li key={o.key}>
                      <span className="font-medium text-ink">{o.label}</span>
                      : Psychic{" "}
                      <span className="brand text-ink">{o.psychic}</span> ·
                      Destiny <span className="brand text-ink">{o.destiny}</span>
                      {o.personalName != null ? (
                        <>
                          {" "}
                          · Name{" "}
                          <span className="brand text-ink">{o.personalName}</span>
                        </>
                      ) : null}{" "}
                      · {o.prominence.caption}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {isBusinessSurface ? (
            <div>
              <label
                htmlFor="biz-domain"
                className="mb-1 block text-sm text-ink-soft"
              >
                Area of business
              </label>
              <select
                id="biz-domain"
                value={domainId}
                onChange={(e) => setDomainId(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
              >
                {BUSINESS_DOMAINS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-ink-soft">{domain.blurb}</p>
            </div>
            ) : null}
          </div>

          {showCompanyUpgrade ? (
            <UpgradeRequired feature="Company / brand-name scoring" />
          ) : featureTab === "personal" || featureTab === "business" ? (
            <section className="space-y-4">
              <MobileFitPanel
                title={isPersonal ? "Personal mobile" : "Business mobile"}
                use={isPersonal ? "personal" : "business"}
                dob={owners[0]?.person.date_of_birth ?? ""}
                value={mobileRaw}
                onChange={setMobileRaw}
              />

              {mobile.ok ? (
                <div className="space-y-3">
                  {featureTab === "business"
                    ? owners.map((o) => (
                        <div
                          key={`mobile-domain-${o.key}`}
                          className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3"
                        >
                          <p className="text-sm font-medium text-ink">
                            Domain fit · {o.label}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <DomainFitChip
                              fit={domainFit(mobile.core, domain, "mobile")}
                              label={`full ${mobile.core} · domain`}
                            />
                            {mobile.last4 ? (
                              <DomainFitChip
                                fit={domainFit(
                                  mobile.last4.core,
                                  domain,
                                  "mobile",
                                )}
                                label={`last-4 ${mobile.last4.core} · domain`}
                              />
                            ) : null}
                          </div>
                          <p className="mt-2 text-xs text-ink-soft">
                            {o.prominence.caption}
                          </p>
                        </div>
                      ))
                    : null}
                  {featureTab === "business" ? (
                    <p className="text-xs text-ink-soft">
                      Preferred mobile digits for this domain:{" "}
                      {domain.preferredMobileDigits.join(", ")}. Careful:{" "}
                      {domain.carefulMobileDigits.join(", ") || "—"}.
                    </p>
                  ) : null}
                  <p className="text-xs text-ink-soft">
                    Personal and business side by side:{" "}
                    <Link
                      href="/mobile"
                      className="text-gold-deep underline underline-offset-2 hover:text-ink"
                    >
                      Mobile numbers
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <p className="text-sm text-ink-soft">
                  {isPersonal
                    ? "Type a national mobile number to score it for this person."
                    : "Type a national mobile number to score it against domain and owners."}
                </p>
              )}
            </section>
          ) : (
            <section className="space-y-4">
              <label className="block text-sm text-ink">
                Company / brand name
                <input
                  type="text"
                  value={companyRaw}
                  onChange={(e) => setCompanyRaw(e.target.value)}
                  placeholder="e.g. Bright Path Labs"
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink outline-none ring-gold focus:ring-2"
                  autoComplete="organization"
                />
              </label>

              <label className="block text-sm text-ink">
                Mobile for cross-check{" "}
                <span className="font-normal text-ink-soft">(optional)</span>
                <input
                  type="text"
                  inputMode="tel"
                  value={mobileRaw}
                  onChange={(e) => setMobileRaw(e.target.value)}
                  placeholder="Optional — same number as the Mobile tab"
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink outline-none ring-gold focus:ring-2"
                  autoComplete="tel-national"
                />
              </label>

              {companyLayers ? (
                <>
                  <p className="rounded-xl border border-[var(--line)] bg-mist/40 px-4 py-3 text-xs leading-5 text-ink-soft">
                    For long-horizon brands, tradition often weights Destiny more
                    after the late-20s / early-30s shift. Each owner’s age focus
                    is marked on their number chips and in Chaldean math.
                  </p>

                  <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                    <div className="lg:sticky lg:top-4">
                      <CompanyChaldeanMatrix
                        companyName={companyRaw}
                        bridgePsychic={owners[0]?.psychic}
                        bridgeDestiny={owners[0]?.destiny}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
                        <p className="text-sm font-medium text-ink">
                          Overall domain fit · {domain.label}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <DomainFitChip
                            fit={domainFit(
                              companyLayers.vedicCore,
                              domain,
                              "name",
                            )}
                            label={`domain · name ${companyLayers.vedicCore}`}
                          />
                          {mobileCore != null ? (
                            <DomainFitChip
                              fit={coreDigitFit(
                                companyLayers.vedicCore,
                                mobileCore,
                              )}
                              label={`vs full mobile ${mobileCore}`}
                            />
                          ) : null}
                          {mobile.ok && mobile.last4 ? (
                            <DomainFitChip
                              fit={coreDigitFit(
                                companyLayers.vedicCore,
                                mobile.last4.core,
                              )}
                              label={`vs last-4 ${mobile.last4.core}`}
                            />
                          ) : null}
                        </div>
                        {companyMobile ? (
                          <div
                            className={`mt-3 rounded-2xl border px-4 py-3 ${BAND_STYLE[companyMobile.band]}`}
                          >
                            <p className="text-[10px] uppercase tracking-wider opacity-80">
                              Company × full mobile · {domain.label}
                            </p>
                            <p className="mt-1 font-medium">
                              {TRIO_BAND_ICON[companyMobile.band]}{" "}
                              {BAND_WORD[companyMobile.band]} ·{" "}
                              {companyMobile.label}
                            </p>
                          </div>
                        ) : null}
                        <p className="mt-2 text-xs text-ink-soft">
                          Preferred digits for {domain.label}:{" "}
                          {domain.preferredNameDigits.join(", ")}. Careful:{" "}
                          {domain.carefulNameDigits.join(", ") || "—"}.
                        </p>
                      </div>

                      {owners.map((o) => (
                        <div
                          key={`company-domain-${o.key}`}
                          className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3"
                        >
                          <p className="text-sm font-medium text-ink">
                            Domain fit · {o.label}
                          </p>
                          <OwnerNumberChips owner={o} />
                          <div className="mt-2 flex flex-wrap gap-2">
                            <DomainFitChip
                              fit={domainFit(
                                companyLayers.vedicCore,
                                domain,
                                "name",
                              )}
                              label={`name ${companyLayers.vedicCore} · domain`}
                            />
                          </div>
                          <p className="mt-2 text-xs text-ink-soft">
                            {o.prominence.caption}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-sm">
                    <span className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                      Layers
                    </span>
                    <span className="text-ink-soft">
                      Vedic{" "}
                      <span className="brand text-ink">
                        {companyLayers.vedicName}
                        {companyLayers.vedicName !== companyLayers.vedicCore
                          ? ` → ${companyLayers.vedicCore}`
                          : ""}
                      </span>
                    </span>
                    <span className="text-ink-soft/40" aria-hidden>
                      ·
                    </span>
                    <span className="text-ink-soft">
                      Unit{" "}
                      <span className="brand text-ink">
                        {companyLayers.unitName}
                      </span>
                    </span>
                    <span className="text-ink-soft/40" aria-hidden>
                      ·
                    </span>
                    <span className="text-ink-soft">
                      Chaldean{" "}
                      <span className="brand text-ink">
                        {companyLayers.chaldean}
                      </span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    {owners.map((o) => {
                      const trio = vedicTrio(
                        o.psychic,
                        o.destiny,
                        companyLayers.vedicCore,
                      );
                      const breakdown = analyzeCompanyNameChaldean(
                        companyRaw,
                        o.psychic,
                        o.destiny,
                      );
                      return (
                        <div
                          key={o.key}
                          className="w-full space-y-3 rounded-2xl border border-[var(--line)] bg-white/70 p-4 sm:p-5"
                        >
                          <h3 className="text-lg text-ink">
                            Compatibility · {o.label}
                          </h3>
                          <OwnerNumberChips owner={o} />
                          <div
                            className={`rounded-2xl border-2 px-5 py-4 shadow-sm ${BAND_STYLE[trio.band]}`}
                          >
                            <p className="text-[10px] uppercase tracking-wider opacity-80">
                              Full chart · Psychic {o.psychic} × Destiny{" "}
                              {o.destiny} × company {companyLayers.vedicCore}
                            </p>
                            <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                              {TRIO_BAND_ICON[trio.band]} {BAND_WORD[trio.band]}
                            </p>
                            <p className="mt-1 text-base font-medium opacity-90">
                              {trio.label}
                            </p>
                            <p className="mt-2 text-sm leading-6">
                              {trio.summary}
                            </p>
                            <p className="mt-1 text-xs opacity-80">
                              {TRIO_BAND_HINT[trio.band]}
                            </p>
                          </div>
                          {breakdown ? (
                            <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-4 py-3 text-sm">
                              <span className="inline-block rounded-md bg-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-paper">
                                Age focus note · {o.prominence.primaryLabel}{" "}
                                {o.prominence.primaryCore} × company{" "}
                                {companyLayers.vedicCore}
                              </span>
                              <p className="mt-3 font-medium text-ink">
                                Chaldean math · {o.label}
                              </p>
                              <p className="mt-2 text-ink-soft">
                                {breakdown.ownerBridge}
                              </p>
                              <p className="mt-2 text-xs text-ink-soft">
                                {breakdown.compoundNote}
                              </p>
                              <p className="mt-2 text-xs text-ink-soft">
                                {o.prominence.caption}
                              </p>
                            </div>
                          ) : null}
                          <p className="text-sm leading-6 text-ink-soft">
                            For {domain.label}, full-chart trio with {o.label}{" "}
                            reads{" "}
                            <span className="font-medium text-ink">
                              {BAND_WORD[trio.band]}
                            </span>{" "}
                            ({trio.label}). Reflective branding notes only.
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="text-sm text-ink-soft">
                  Type a company or brand name (at least 2 letters) to compare
                  against each owner and domain. Mobile is optional for a
                  company × number cross-check.
                </p>
              )}
            </section>
          )}

          <p className="text-xs leading-5 text-ink-soft">
            Reflective experiment only—not telecom, legal, financial, or “lucky
            number” guarantees. Domain preferences are NumoraWisdom synthesis for
            branding reflection.
          </p>
        </>
      )}
    </div>
  );
}
