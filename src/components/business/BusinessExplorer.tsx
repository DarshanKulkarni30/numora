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
import { MobileDigitSplit } from "@/components/mobile/MobileDigitSplit";
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

type FeatureTab = "mobile" | "company";

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

const FIT_BANNER_STYLE: Record<DomainFit, string> = {
  favourable: BAND_STYLE.amazing,
  neutral: BAND_STYLE.neutral,
  careful: BAND_STYLE.friction,
};

function personKey(p: PersonRecord) {
  return `${p.sort_order}-${p.full_name}`;
}

function personLabel(p: PersonRecord) {
  const name = p.preferred_name || p.full_name || "Unnamed";
  return p.is_self ? `${name} (You)` : `${name} · ${p.relationship || "Family"}`;
}

function FitChip({
  fit,
  label,
  emphasize,
}: {
  fit: DomainFit;
  label: string;
  emphasize?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${DOMAIN_FIT_STYLE[fit]} ${
        emphasize ? "ring-2 ring-sea/35 shadow-sm" : ""
      }`}
    >
      {DOMAIN_FIT_WORD[fit]} · {label}
      {emphasize ? " · primary" : ""}
    </span>
  );
}

function PrimaryDigitBanner({
  digitLabel,
  digit,
  prominence,
  fit,
}: {
  digitLabel: string;
  digit: number;
  prominence: OwnerProminence;
  fit: DomainFit;
}) {
  return (
    <div
      className={`rounded-2xl border-2 px-5 py-4 shadow-sm ${FIT_BANNER_STYLE[fit]}`}
    >
      <p className="text-[10px] uppercase tracking-wider opacity-80">
        Age-led · {prominence.primaryLabel} {prominence.primaryCore} ×{" "}
        {digitLabel} {digit}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
        {DOMAIN_FIT_WORD[fit]}
      </p>
      <p className="mt-1 text-sm leading-6 opacity-90">
        Pairwise fit of the age-priority number against this digit. Reflective
        branding note only.
      </p>
      <p className="mt-2 text-xs opacity-80">{prominence.caption}</p>
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
  const [featureTab, setFeatureTab] = useState<FeatureTab>("mobile");
  const [domainId, setDomainId] = useState("general");
  const [mobileRaw, setMobileRaw] = useState("");
  const [companyRaw, setCompanyRaw] = useState("");

  const showCompanyUpgrade = featureTab === "company" && !canUseCompany;
  const tabHighlight: FeatureTab = featureTab;
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
  const companyMobileLast4 =
    companyLayers && mobile.ok && mobile.last4
      ? companyMobileHarmony(
          companyLayers.vedicCore,
          mobile.last4.core,
          domain,
        )
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
      {selectable.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/50 px-5 py-8 text-center text-sm text-ink-soft">
          Save at least one complete profile person (name + DOB) to explore
          business numbers.{" "}
          <Link href="/profile" className="text-gold-deep underline">
            Open profile
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="mb-1 text-sm text-ink-soft">
                Owners from your profile
              </p>
              <div className="space-y-2">
                {selectedKeys.map((key, index) => {
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
                      {selectedKeys.length > 1 ? (
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
                <button
                  type="button"
                  onClick={addOwnerSlot}
                  disabled={unusedOwners.length === 0}
                  className="rounded-xl border border-dashed border-[var(--line)] bg-white/60 px-3 py-2 text-sm text-ink transition duration-200 hover:-translate-y-px hover:border-sea/40 hover:bg-mist/60 hover:shadow-sm active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  Add owner
                </button>
              </div>
              <p className="mt-2 text-xs text-ink-soft">
                Each owner gets their own compatibility section. Use Add owner
                for co-founders or family on the same venture.
              </p>
              {owners.length > 0 ? (
                <ul className="mt-2 space-y-1 text-xs text-ink-soft">
                  {owners.map((o) => (
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
          </div>

          <div className="flex flex-wrap gap-1 rounded-full border border-[var(--line)] bg-white/50 p-1">
            {(
              [
                ["mobile", "Mobile number"],
                ["company", "Company name"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setFeatureTab(id)}
                className={`btn-tactile flex-1 rounded-full px-3 py-2 text-sm ${
                  tabHighlight === id
                    ? "bg-ink text-paper shadow-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {label}
                {id === "company" && !canUseCompany ? " · Pro" : ""}
              </button>
            ))}
          </div>

          {showCompanyUpgrade ? (
            <UpgradeRequired feature="Company / brand-name scoring" />
          ) : featureTab === "mobile" ? (
            <section className="space-y-4">
              <label className="block text-sm text-ink">
                Mobile number (national, no country code)
                <input
                  type="text"
                  inputMode="tel"
                  value={mobileRaw}
                  onChange={(e) => setMobileRaw(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink outline-none ring-gold focus:ring-2"
                  autoComplete="tel-national"
                />
              </label>
              {!mobile.ok && mobileRaw.trim() ? (
                <p className="text-sm text-rose-800">{mobile.error}</p>
              ) : null}

              {mobile.ok ? (
                <>
                  <MobileDigitSplit
                    mobile={mobile}
                    emphasizeLast4
                    part="split"
                  />

                  <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
                    <p className="text-sm font-medium text-ink">
                      Domain fit (shared)
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <FitChip
                        fit={domainFit(mobile.core, domain, "mobile")}
                        label={`full ${mobile.core} · domain`}
                      />
                      {mobile.last4 ? (
                        <FitChip
                          fit={domainFit(mobile.last4.core, domain, "mobile")}
                          label={`last-4 ${mobile.last4.core} · domain`}
                        />
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-ink-soft">
                      Preferred mobile digits for this domain:{" "}
                      {domain.preferredMobileDigits.join(", ")}. Careful:{" "}
                      {domain.carefulMobileDigits.join(", ") || "—"}.
                    </p>
                  </div>

                  {owners.map((o) => {
                    const primaryFit = coreDigitFit(
                      mobile.core,
                      o.prominence.primaryCore,
                    );
                    const fullTrio = vedicTrio(o.psychic, o.destiny, mobile.core);
                    const last4Trio =
                      mobile.last4 != null
                        ? vedicTrio(o.psychic, o.destiny, mobile.last4.core)
                        : null;
                    const last4PrimaryFit =
                      mobile.last4 != null
                        ? coreDigitFit(
                            mobile.last4.core,
                            o.prominence.primaryCore,
                          )
                        : null;
                    const psychicEmph =
                      o.prominence.phase !== "destiny_led";
                    const destinyEmph =
                      o.prominence.phase !== "psychic_led";
                    return (
                      <div
                        key={o.key}
                        className="space-y-3 rounded-2xl border border-[var(--line)] bg-white/70 p-4"
                      >
                        <h3 className="text-lg text-ink">
                          Compatibility · {o.label}
                        </h3>
                        <p className="text-xs text-ink-soft">
                          Psychic {o.psychic} · Destiny {o.destiny}
                          {o.personalName != null
                            ? ` · Name ${o.personalName}`
                            : ""}
                        </p>
                        <PrimaryDigitBanner
                          digitLabel="full core"
                          digit={mobile.core}
                          prominence={o.prominence}
                          fit={primaryFit}
                        />
                        {last4PrimaryFit && mobile.last4 ? (
                          <div
                            className={`rounded-2xl border px-5 py-4 ${FIT_BANNER_STYLE[last4PrimaryFit]}`}
                          >
                            <p className="text-[10px] uppercase tracking-wider opacity-80">
                              Age-led · {o.prominence.primaryLabel}{" "}
                              {o.prominence.primaryCore} × last-4{" "}
                              {mobile.last4.core}
                            </p>
                            <p className="mt-1 text-xl font-semibold">
                              {DOMAIN_FIT_WORD[last4PrimaryFit]}
                            </p>
                          </div>
                        ) : null}
                        <div
                          className={`rounded-xl border px-4 py-3 ${BAND_STYLE[fullTrio.band]}`}
                        >
                          <p className="text-[10px] uppercase tracking-wider opacity-80">
                            Full chart · Psychic {o.psychic} × Destiny{" "}
                            {o.destiny} × full {mobile.core}
                          </p>
                          <p className="mt-1 font-medium">
                            {TRIO_BAND_ICON[fullTrio.band]}{" "}
                            {BAND_WORD[fullTrio.band]} · {fullTrio.label}
                          </p>
                          <p className="mt-1 text-xs opacity-80">
                            {TRIO_BAND_HINT[fullTrio.band]}
                          </p>
                        </div>
                        {last4Trio && mobile.last4 ? (
                          <div
                            className={`rounded-xl border px-4 py-3 ${BAND_STYLE[last4Trio.band]}`}
                          >
                            <p className="text-[10px] uppercase tracking-wider opacity-80">
                              Full chart · last-4 {mobile.last4.core}
                            </p>
                            <p className="mt-1 text-sm font-medium">
                              {TRIO_BAND_ICON[last4Trio.band]}{" "}
                              {BAND_WORD[last4Trio.band]} · {last4Trio.label}
                            </p>
                          </div>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          <FitChip
                            fit={coreDigitFit(mobile.core, o.psychic)}
                            label={`full vs Psychic ${o.psychic}`}
                            emphasize={psychicEmph}
                          />
                          {mobile.last4 ? (
                            <FitChip
                              fit={coreDigitFit(mobile.last4.core, o.psychic)}
                              label={`last-4 vs Psychic ${o.psychic}`}
                              emphasize={psychicEmph}
                            />
                          ) : null}
                          <FitChip
                            fit={coreDigitFit(mobile.core, o.destiny)}
                            label={`full vs Destiny ${o.destiny}`}
                            emphasize={destinyEmph}
                          />
                          {mobile.last4 ? (
                            <FitChip
                              fit={coreDigitFit(mobile.last4.core, o.destiny)}
                              label={`last-4 vs Destiny ${o.destiny}`}
                              emphasize={destinyEmph}
                            />
                          ) : null}
                          {o.personalName != null ? (
                            <>
                              <FitChip
                                fit={coreDigitFit(mobile.core, o.personalName)}
                                label={`full vs Name ${o.personalName}`}
                              />
                              {mobile.last4 ? (
                                <FitChip
                                  fit={coreDigitFit(
                                    mobile.last4.core,
                                    o.personalName,
                                  )}
                                  label={`last-4 vs Name ${o.personalName}`}
                                />
                              ) : null}
                            </>
                          ) : null}
                        </div>
                        <p className="text-xs text-ink-soft">
                          Primary banner follows BN→DN age shift. Full-chart trio
                          stays as a secondary read.
                        </p>
                      </div>
                    );
                  })}

                  <p className="text-xs text-ink-soft">
                    Full method tables:{" "}
                    <Link
                      href="/mobile"
                      className="text-gold-deep underline underline-offset-2 hover:text-ink"
                    >
                      classic Mobile fit
                    </Link>
                    .
                  </p>

                  <MobileDigitSplit
                    mobile={mobile}
                    emphasizeLast4
                    part="detail"
                  />
                </>
              ) : (
                <p className="text-sm text-ink-soft">
                  Type a national mobile number to score it against each owner
                  and domain.
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
                    after the late-20s / early-30s shift. Each owner card below
                    follows that owner’s age: Psychic before 30, transition
                    30–34, Destiny from 35.
                  </p>

                  <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                    <div className="space-y-3 lg:sticky lg:top-4">
                      <CompanyChaldeanMatrix
                        companyName={companyRaw}
                        bridgePsychic={owners[0]?.psychic}
                        bridgeDestiny={owners[0]?.destiny}
                      />
                      <div className="overflow-x-auto rounded-xl border border-[var(--line)] bg-white/70">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-mist/60 text-ink-soft">
                            <tr>
                              <th className="px-3 py-2 font-medium">Layer</th>
                              <th className="px-3 py-2 font-medium">Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-[var(--line)]">
                              <td className="px-3 py-2 text-ink-soft">
                                Vedic / Chaldean-aligned name
                              </td>
                              <td className="brand px-3 py-2 text-ink">
                                {companyLayers.vedicName}
                                {companyLayers.vedicName !==
                                companyLayers.vedicCore
                                  ? ` → ${companyLayers.vedicCore}`
                                  : ""}
                              </td>
                            </tr>
                            <tr className="border-t border-[var(--line)]">
                              <td className="px-3 py-2 text-ink-soft">
                                Unit name map
                              </td>
                              <td className="brand px-3 py-2 text-ink">
                                {companyLayers.unitName}
                              </td>
                            </tr>
                            <tr className="border-t border-[var(--line)]">
                              <td className="px-3 py-2 text-ink-soft">
                                Chaldean name
                              </td>
                              <td className="brand px-3 py-2 text-ink">
                                {companyLayers.chaldean}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
                      <p className="text-sm font-medium text-ink">
                        Domain fit
                        {mobileCore != null ? " + company × mobile" : ""}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <FitChip
                          fit={domainFit(
                            companyLayers.vedicCore,
                            domain,
                            "name",
                          )}
                          label={`domain · name ${companyLayers.vedicCore}`}
                        />
                        {mobileCore != null ? (
                          <FitChip
                            fit={coreDigitFit(
                              companyLayers.vedicCore,
                              mobileCore,
                            )}
                            label={`vs full mobile ${mobileCore}`}
                          />
                        ) : null}
                        {mobile.ok && mobile.last4 ? (
                          <FitChip
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
                      {companyMobileLast4 && mobile.ok && mobile.last4 ? (
                        <div
                          className={`mt-2 rounded-2xl border px-4 py-3 ${BAND_STYLE[companyMobileLast4.band]}`}
                        >
                          <p className="text-[10px] uppercase tracking-wider opacity-80">
                            Company × last-4 ({mobile.last4.core})
                          </p>
                          <p className="mt-1 font-medium">
                            {TRIO_BAND_ICON[companyMobileLast4.band]}{" "}
                            {BAND_WORD[companyMobileLast4.band]} ·{" "}
                            {companyMobileLast4.label}
                          </p>
                        </div>
                      ) : null}
                      <p className="mt-2 text-xs text-ink-soft">
                        Preferred company-name digits for {domain.label}:{" "}
                        {domain.preferredNameDigits.join(", ")}. Careful:{" "}
                        {domain.carefulNameDigits.join(", ") || "—"}.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {owners.map((o) => {
                      const trio = vedicTrio(
                        o.psychic,
                        o.destiny,
                        companyLayers.vedicCore,
                      );
                      const primaryFit = coreDigitFit(
                        companyLayers.vedicCore,
                        o.prominence.primaryCore,
                      );
                      const breakdown = analyzeCompanyNameChaldean(
                        companyRaw,
                        o.psychic,
                        o.destiny,
                      );
                      const psychicEmph =
                        o.prominence.phase !== "destiny_led";
                      const destinyEmph =
                        o.prominence.phase !== "psychic_led";
                      return (
                        <div
                          key={o.key}
                          className="space-y-3 rounded-2xl border border-[var(--line)] bg-white/70 p-4"
                        >
                          <h3 className="text-lg text-ink">
                            Compatibility · {o.label}
                          </h3>
                          <PrimaryDigitBanner
                            digitLabel="company"
                            digit={companyLayers.vedicCore}
                            prominence={o.prominence}
                            fit={primaryFit}
                          />
                          <div
                            className={`rounded-xl border px-4 py-3 ${BAND_STYLE[trio.band]}`}
                          >
                            <p className="text-[10px] uppercase tracking-wider opacity-80">
                              Full chart · Psychic {o.psychic} × Destiny{" "}
                              {o.destiny} × company {companyLayers.vedicCore}
                            </p>
                            <p className="mt-1 font-medium">
                              {TRIO_BAND_ICON[trio.band]} {BAND_WORD[trio.band]}{" "}
                              · {trio.label}
                            </p>
                            <p className="mt-1 text-sm leading-6 opacity-90">
                              {trio.summary}
                            </p>
                            <p className="mt-1 text-xs opacity-80">
                              {TRIO_BAND_HINT[trio.band]}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <FitChip
                              fit={coreDigitFit(
                                companyLayers.vedicCore,
                                o.psychic,
                              )}
                              label={`vs Psychic ${o.psychic}`}
                              emphasize={psychicEmph}
                            />
                            <FitChip
                              fit={coreDigitFit(
                                companyLayers.vedicCore,
                                o.destiny,
                              )}
                              label={`vs Destiny ${o.destiny}`}
                              emphasize={destinyEmph}
                            />
                            {o.personalName != null ? (
                              <FitChip
                                fit={coreDigitFit(
                                  companyLayers.vedicCore,
                                  o.personalName,
                                )}
                                label={`vs Name ${o.personalName}`}
                              />
                            ) : null}
                          </div>
                          <p className="text-xs text-ink-soft">
                            Chips are pairwise digit distance. Primary banner
                            follows this owner’s BN→DN age phase.
                          </p>
                          {breakdown ? (
                            <div className="rounded-xl border border-[var(--line)] bg-mist/40 px-4 py-3 text-sm">
                              <p className="font-medium text-ink">
                                Chaldean math · {o.label}
                              </p>
                              <p className="mt-2 text-ink-soft">
                                {breakdown.ownerBridge}
                              </p>
                              <p className="mt-2 text-xs text-ink-soft">
                                {breakdown.compoundNote}
                              </p>
                            </div>
                          ) : null}
                          <p className="text-sm leading-6 text-ink-soft">
                            For {domain.label}, company digit{" "}
                            <span className="brand text-ink">
                              {companyLayers.vedicCore}
                            </span>{" "}
                            with {o.label}’s {o.prominence.primaryLabel} reads{" "}
                            <span className="font-medium text-ink">
                              {DOMAIN_FIT_WORD[primaryFit]}
                            </span>
                            . Full-chart trio: {BAND_WORD[trio.band]} (
                            {trio.label}). Reflective branding notes only.
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
