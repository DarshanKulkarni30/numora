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
import { parseMobile } from "@/lib/numerology/mobileNumber";
import { MobileDigitSplit } from "@/components/mobile/MobileDigitSplit";
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

function FitChip({ fit, label }: { fit: DomainFit; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${DOMAIN_FIT_STYLE[fit]}`}
    >
      {DOMAIN_FIT_WORD[fit]} · {label}
    </span>
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
    const keys = new Set(selectedKeys);
    return selectable
      .filter((p) => keys.has(personKey(p)))
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

  const toggleOwner = (key: string) => {
    setSelectedKeys((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 1) return prev;
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
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
                Owners from your profile (select one or more)
              </p>
              <ul className="max-h-48 space-y-1.5 overflow-y-auto rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2">
                {selectable.map((p) => {
                  const key = personKey(p);
                  const checked = selectedKeys.includes(key);
                  return (
                    <li key={key}>
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-ink hover:bg-mist/50">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOwner(key)}
                          className="rounded border-[var(--line)]"
                        />
                        <span>{personLabel(p)}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-xs text-ink-soft">
                Compatibility below is shown for each selected owner. At least
                one owner is required.
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
                      ) : null}
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
                    const fullTrio = vedicTrio(o.psychic, o.destiny, mobile.core);
                    const last4Trio =
                      mobile.last4 != null
                        ? vedicTrio(o.psychic, o.destiny, mobile.last4.core)
                        : null;
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
                        <div
                          className={`rounded-2xl border-2 px-5 py-4 shadow-sm ${BAND_STYLE[fullTrio.band]}`}
                        >
                          <p className="text-[10px] uppercase tracking-wider opacity-80">
                            Birth × Destiny × full core {mobile.core}
                          </p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                            {TRIO_BAND_ICON[fullTrio.band]}{" "}
                            {BAND_WORD[fullTrio.band]}
                          </p>
                          <p className="mt-1 text-base font-medium opacity-90">
                            {fullTrio.label}
                          </p>
                          <p className="mt-2 text-sm leading-6">
                            {fullTrio.summary}
                          </p>
                        </div>
                        {last4Trio && mobile.last4 ? (
                          <div
                            className={`rounded-2xl border px-5 py-4 ${BAND_STYLE[last4Trio.band]}`}
                          >
                            <p className="text-[10px] uppercase tracking-wider opacity-80">
                              Birth × Destiny × last-4 core {mobile.last4.core}
                            </p>
                            <p className="mt-1 text-xl font-semibold">
                              {TRIO_BAND_ICON[last4Trio.band]}{" "}
                              {BAND_WORD[last4Trio.band]}
                            </p>
                            <p className="mt-1 text-sm font-medium opacity-90">
                              {last4Trio.label}
                            </p>
                          </div>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          <FitChip
                            fit={coreDigitFit(mobile.core, o.psychic)}
                            label={`full vs Psychic ${o.psychic}`}
                          />
                          {mobile.last4 ? (
                            <FitChip
                              fit={coreDigitFit(mobile.last4.core, o.psychic)}
                              label={`last-4 vs Psychic ${o.psychic}`}
                            />
                          ) : null}
                          <FitChip
                            fit={coreDigitFit(mobile.core, o.destiny)}
                            label={`full vs Destiny ${o.destiny}`}
                          />
                          {mobile.last4 ? (
                            <FitChip
                              fit={coreDigitFit(mobile.last4.core, o.destiny)}
                              label={`last-4 vs Destiny ${o.destiny}`}
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
                Mobile for cross-check (shared with Mobile tab)
                <input
                  type="text"
                  inputMode="tel"
                  value={mobileRaw}
                  onChange={(e) => setMobileRaw(e.target.value)}
                  placeholder="Same number used on the Mobile tab"
                  className="mt-1.5 w-full rounded-xl border border-[var(--line)] bg-white/80 px-3 py-2 text-ink outline-none ring-gold focus:ring-2"
                  autoComplete="tel-national"
                />
              </label>

              {companyLayers ? (
                <>
                  <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
                    <table className="w-full min-w-[28rem] text-left text-sm">
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
                            {companyLayers.vedicName !== companyLayers.vedicCore
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

                  <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3">
                    <p className="text-sm font-medium text-ink">
                      Domain + company × mobile (shared)
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
                          {BAND_WORD[companyMobile.band]} · {companyMobile.label}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-ink-soft">
                        Add a valid mobile to score company × mobile.
                      </p>
                    )}
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
                        className="space-y-3 rounded-2xl border border-[var(--line)] bg-white/70 p-4"
                      >
                        <h3 className="text-lg text-ink">
                          Compatibility · {o.label}
                        </h3>
                        <div
                          className={`rounded-2xl border-2 px-5 py-4 shadow-sm ${BAND_STYLE[trio.band]}`}
                        >
                          <p className="text-[10px] uppercase tracking-wider opacity-80">
                            Birth × Destiny × company name
                          </p>
                          <p className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                            {TRIO_BAND_ICON[trio.band]} {BAND_WORD[trio.band]}
                          </p>
                          <p className="mt-1 text-base font-medium opacity-90">
                            {trio.label}
                          </p>
                          <p className="mt-2 text-sm leading-6">{trio.summary}</p>
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
                          />
                          <FitChip
                            fit={coreDigitFit(
                              companyLayers.vedicCore,
                              o.destiny,
                            )}
                            label={`vs Destiny ${o.destiny}`}
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
                          with {o.label} reads{" "}
                          <span className="font-medium text-ink">
                            {BAND_WORD[trio.band]}
                          </span>{" "}
                          ({trio.label}). Reflective branding notes only.
                        </p>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p className="text-sm text-ink-soft">
                  Type a company or brand name (at least 2 letters) to compare
                  against each owner, mobile, and domain.
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
