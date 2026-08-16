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
import { parseMobile } from "@/lib/numerology/mobileNumber";
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
};

type FeatureTab = "mobile" | "company";

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

function FitChip({ fit, label }: { fit: DomainFit; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${DOMAIN_FIT_STYLE[fit]}`}
    >
      {DOMAIN_FIT_WORD[fit]} · {label}
    </span>
  );
}

export function BusinessExplorer({ people }: Props) {
  const selectable = useMemo(
    () =>
      people.filter(
        (p) => (p.full_name || p.preferred_name) && isValidDob(p.date_of_birth),
      ),
    [people],
  );

  const [selectedKey, setSelectedKey] = useState(() => {
    const self = selectable.find((p) => p.is_self);
    const first = self ?? selectable[0];
    return first ? `${first.sort_order}-${first.full_name}` : "";
  });
  const [featureTab, setFeatureTab] = useState<FeatureTab>("mobile");
  const [domainId, setDomainId] = useState("general");
  const [mobileRaw, setMobileRaw] = useState("");
  const [companyRaw, setCompanyRaw] = useState("");

  const selected = selectable.find(
    (p) => `${p.sort_order}-${p.full_name}` === selectedKey,
  );
  const dob = selected?.date_of_birth ?? "";
  const fullName = selected?.full_name || selected?.preferred_name || "";
  const domain = getBusinessDomain(domainId);

  const psychic = selected ? vedicPsychicFromDob(dob) : null;
  const destiny = selected ? vedicDestinyFromDob(dob) : null;

  const personalName = useMemo(() => {
    if (!fullName || !dob) return null;
    const vedic = calculateVedic(fullName, dob);
    return reduceToSingleDigit(vedic.nameNumber);
  }, [fullName, dob]);

  const mobile = useMemo(() => parseMobile(mobileRaw), [mobileRaw]);
  const mobileCore = mobile.ok ? mobile.core : null;

  const companyLayers = useMemo(() => {
    const name = companyRaw.trim();
    if (name.length < 2 || !dob) return null;
    const vedic = calculateVedic(name, dob);
    const chald = calculateChaldean(name);
    return {
      vedicName: vedic.nameNumber,
      vedicCore: reduceToSingleDigit(vedic.nameNumber),
      unitName: vedic.unitSystemNameNumber,
      chaldean: chald.nameNumber,
      chaldeanCore: reduceToSingleDigit(chald.nameNumber),
    };
  }, [companyRaw, dob]);

  const companyTrio =
    psychic != null && destiny != null && companyLayers
      ? vedicTrio(psychic, destiny, companyLayers.vedicCore)
      : null;

  const companyMobile =
    companyLayers && mobileCore != null
      ? companyMobileHarmony(companyLayers.vedicCore, mobileCore, domain)
      : null;

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
              <label
                htmlFor="biz-person"
                className="mb-1 block text-sm text-ink-soft"
              >
                Person from your profile (owner)
              </label>
              <select
                id="biz-person"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-white/80 px-4 py-3 text-ink outline-none ring-gold focus:ring-2"
              >
                {selectable.map((p) => (
                  <option
                    key={`${p.sort_order}-${p.full_name}`}
                    value={`${p.sort_order}-${p.full_name}`}
                  >
                    {personLabel(p)}
                  </option>
                ))}
              </select>
              {selected && psychic != null && destiny != null ? (
                <p className="mt-2 text-sm text-ink-soft">
                  Psychic{" "}
                  <span className="brand text-ink">{psychic}</span> · Destiny{" "}
                  <span className="brand text-ink">{destiny}</span>
                  {personalName != null ? (
                    <>
                      {" "}
                      · Personal name{" "}
                      <span className="brand text-ink">{personalName}</span>
                    </>
                  ) : null}{" "}
                  (from {selected.date_of_birth}).
                </p>
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
                className={`flex-1 rounded-full px-3 py-2 text-sm transition-all duration-150 ${
                  featureTab === id
                    ? "bg-ink text-paper shadow-sm"
                    : "text-ink-soft hover:-translate-y-px hover:text-ink hover:shadow-sm active:translate-y-0 active:shadow-none"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {featureTab === "mobile" ? (
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

              {mobile.ok && psychic != null && destiny != null ? (
                <>
                  <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
                    <table className="w-full min-w-[24rem] text-left text-sm">
                      <tbody>
                        <tr className="border-b border-[var(--line)]">
                          <td className="px-3 py-2 text-ink-soft">Digits</td>
                          <td className="brand px-3 py-2 text-ink">
                            {mobile.digits}
                          </td>
                        </tr>
                        <tr className="border-b border-[var(--line)]">
                          <td className="px-3 py-2 text-ink-soft">
                            Compound sum
                          </td>
                          <td className="brand px-3 py-2 text-ink">
                            {mobile.compound}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-ink-soft">
                            Mobile core (1–9)
                          </td>
                          <td className="brand px-3 py-2 text-ink">
                            {mobile.core}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-ink">
                      Fit for {domain.label}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <FitChip
                        fit={domainFit(mobile.core, domain, "mobile")}
                        label={`domain · ${mobile.core}`}
                      />
                      <FitChip
                        fit={coreDigitFit(mobile.core, psychic)}
                        label={`vs Psychic ${psychic}`}
                      />
                      <FitChip
                        fit={coreDigitFit(mobile.core, destiny)}
                        label={`vs Destiny ${destiny}`}
                      />
                      {personalName != null ? (
                        <FitChip
                          fit={coreDigitFit(mobile.core, personalName)}
                          label={`vs Name ${personalName}`}
                        />
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-ink-soft">
                      Preferred mobile digits for this domain:{" "}
                      {domain.preferredMobileDigits.join(", ")}. Careful:{" "}
                      {domain.carefulMobileDigits.join(", ") || "—"}.
                    </p>
                  </div>

                  <p className="rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-sm text-ink-soft">
                    Birth×Destiny×mobile core{" "}
                    <span className="text-ink">
                      {BAND_WORD[vedicTrio(psychic, destiny, mobile.core).band]}
                    </span>{" "}
                    (
                    {vedicTrio(psychic, destiny, mobile.core).label}
                    ). For full method tables, see{" "}
                    <Link
                      href="/mobile"
                      className="text-gold-deep underline underline-offset-2 hover:text-ink"
                    >
                      classic Mobile fit
                    </Link>
                    .
                  </p>
                </>
              ) : (
                <p className="text-sm text-ink-soft">
                  Type a national mobile number to score it against this owner
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

              {companyLayers && psychic != null && destiny != null ? (
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

                  {companyTrio ? (
                    <div
                      className={`rounded-xl border px-4 py-3 ${BAND_STYLE[companyTrio.band]}`}
                    >
                      <p className="text-[10px] uppercase tracking-wider opacity-80">
                        Birth × Destiny × company name
                      </p>
                      <p className="mt-1 font-medium">
                        {TRIO_BAND_ICON[companyTrio.band]}{" "}
                        {BAND_WORD[companyTrio.band]} · {companyTrio.label}
                      </p>
                      <p className="mt-1 text-sm leading-6">
                        {companyTrio.summary}
                      </p>
                      <p className="mt-1 text-xs opacity-80">
                        {TRIO_BAND_HINT[companyTrio.band]}
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <p className="text-sm font-medium text-ink">
                      Compatibility matrix
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
                      <FitChip
                        fit={coreDigitFit(companyLayers.vedicCore, psychic)}
                        label={`vs Psychic ${psychic}`}
                      />
                      <FitChip
                        fit={coreDigitFit(companyLayers.vedicCore, destiny)}
                        label={`vs Destiny ${destiny}`}
                      />
                      {personalName != null ? (
                        <FitChip
                          fit={coreDigitFit(
                            companyLayers.vedicCore,
                            personalName,
                          )}
                          label={`vs personal Name ${personalName}`}
                        />
                      ) : null}
                      {mobileCore != null ? (
                        <FitChip
                          fit={coreDigitFit(
                            companyLayers.vedicCore,
                            mobileCore,
                          )}
                          label={`vs mobile ${mobileCore}`}
                        />
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-ink-soft">
                      Preferred company-name digits for {domain.label}:{" "}
                      {domain.preferredNameDigits.join(", ")}. Careful:{" "}
                      {domain.carefulNameDigits.join(", ") || "—"}.
                    </p>
                  </div>

                  {companyMobile ? (
                    <div
                      className={`rounded-xl border px-4 py-3 ${BAND_STYLE[companyMobile.band]}`}
                    >
                      <p className="text-[10px] uppercase tracking-wider opacity-80">
                        Company × mobile · {domain.label}
                      </p>
                      <p className="mt-1 font-medium">
                        {TRIO_BAND_ICON[companyMobile.band]}{" "}
                        {BAND_WORD[companyMobile.band]} · {companyMobile.label}
                      </p>
                      <p className="mt-1 text-sm leading-6">
                        {companyMobile.summary}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-ink-soft">
                      Add a valid mobile number above to score company × mobile
                      for this domain.
                    </p>
                  )}

                  <div className="rounded-xl border border-[var(--line)] bg-white/55 px-4 py-3 text-sm text-ink-soft">
                    <p className="font-medium text-ink">Executive summary</p>
                    <p className="mt-1 leading-6">
                      For {domain.label}, company name digit{" "}
                      <span className="brand text-ink">
                        {companyLayers.vedicCore}
                      </span>{" "}
                      is{" "}
                      {DOMAIN_FIT_WORD[
                        domainFit(companyLayers.vedicCore, domain, "name")
                      ].toLowerCase()}{" "}
                      on the domain map
                      {companyTrio
                        ? `, and the Vedic Birth×Destiny×name cell reads ${BAND_WORD[companyTrio.band]} (${companyTrio.label})`
                        : ""}
                      {companyMobile
                        ? `. Versus mobile ${mobileCore}, the pair is ${BAND_WORD[companyMobile.band]}.`
                        : "."}{" "}
                      Reflective branding notes only—not incorporation, trademark,
                      or financial advice.
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-ink-soft">
                  Type a company or brand name (at least 2 letters) to compare
                  against Psychic, Destiny, personal name, mobile, and domain.
                </p>
              )}
            </section>
          )}

          <p className="text-xs leading-5 text-ink-soft">
            Reflective experiment only—not telecom, legal, financial, or “lucky
            number” guarantees. Domain preferences are Numora synthesis for
            branding reflection.
          </p>
        </>
      )}
    </div>
  );
}
