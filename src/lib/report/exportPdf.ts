import { jsPDF } from "jspdf";
import type { NumerologyReport } from "@/lib/numerology/types";
import { BRAND_NAME } from "@/lib/site";

function wrapLines(
  doc: jsPDF,
  text: string,
  maxWidth: number,
): string[] {
  return doc.splitTextToSize(text.replace(/\s+/g, " ").trim(), maxWidth);
}

/**
 * Build and download a multi-page PDF summary of a saved report.
 */
export function downloadReportPdf(report: NumerologyReport): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const addTitle = (text: string) => {
    ensureSpace(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 107);
    doc.text(text, margin, y);
    y += 20;
  };

  const addBody = (text: string, size = 10) => {
    if (!text?.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(40, 50, 70);
    const lines = wrapLines(doc, text, maxW);
    for (const line of lines) {
      ensureSpace(14);
      doc.text(line, margin, y);
      y += 13;
    }
    y += 6;
  };

  const addBullet = (text: string) => {
    addBody(`• ${text}`);
  };

  const person = report.person;
  const snap = report.numerology_snapshot;
  const name = person.preferred_name || person.full_name;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(35, 79, 150);
  doc.text(BRAND_NAME, margin, y);
  y += 22;
  doc.setFontSize(16);
  doc.setTextColor(20, 30, 50);
  doc.text("Personal numerology reading", margin, y);
  y += 24;

  addBody(
    `${name} · DOB ${person.date_of_birth} · age ${person.age} · ${person.report_type}`,
  );
  if (snap.sun_sign_label) {
    addBody(`Sun sign: ${snap.sun_sign_label}`);
  }
  addBody(
    `Generated for private reflection. Belief-based content only—not medical, legal, or financial advice.`,
    9,
  );
  y += 4;

  addTitle("Core snapshot");
  const snapRows: [string, string][] = [
    ["Life Path", snap.life_path],
    ["Birth Day", snap.birth_day],
    ["Expression", snap.expression_number],
    ["Soul Urge", snap.soul_urge_number],
    ["Personality", snap.personality_number],
    ["Maturity", snap.maturity_number],
    ["Chaldean name", snap.chaldean_name_number],
    ["Vedic Psychic", snap.vedic_psychic],
    ["Vedic Destiny", snap.vedic_destiny],
    ["Vedic Name", snap.vedic_name],
    ["Personal Year", snap.personal_year],
    ["Personal Month", snap.personal_month],
  ];
  if (snap.projected_year) {
    snapRows.push([
      "Projected Year",
      `${snap.projected_year}${snap.projected_year_calendar ? ` (${snap.projected_year_calendar})` : ""}`,
    ]);
  }
  for (const [label, value] of snapRows) {
    addBody(`${label}: ${value}`);
  }

  addTitle("Pythagorean");
  addBody(
    `Life Path ${report.pythagorean.life_path.number}: ${report.pythagorean.life_path.meaning}`,
  );
  addBody(
    `Expression ${report.pythagorean.expression.number}: ${report.pythagorean.expression.meaning}`,
  );
  addBody(
    `Soul Urge ${report.pythagorean.soul_urge.number}: ${report.pythagorean.soul_urge.meaning}`,
  );

  addTitle("Chaldean name");
  addBody(
    `Name ${report.chaldean.name_number} (compound ${report.chaldean.compound_number} → ${report.chaldean.reduced_number})`,
  );
  addBody(report.chaldean.analysis);

  addTitle("Vedic");
  addBody(
    `Psychic ${report.vedic.psychic_number.number}: ${report.vedic.psychic_number.meaning}`,
  );
  addBody(
    `Destiny ${report.vedic.destiny_number.number}: ${report.vedic.destiny_number.meaning}`,
  );
  addBody(
    `Name ${report.vedic.name_number.number}: ${report.vedic.name_number.meaning}`,
  );
  addBody(report.vedic.analysis);

  addTitle("Lo Shu");
  addBody(
    `Present: ${report.lo_shu.present_numbers.join(", ") || "—"}. Missing: ${report.lo_shu.missing_numbers.join(", ") || "—"}.`,
  );
  addBody(
    `Planes — mental: ${report.lo_shu.mental_plane}; emotional: ${report.lo_shu.emotional_plane}; practical: ${report.lo_shu.practical_plane}.`,
  );
  addBody(report.lo_shu.analysis);

  addTitle("Personality themes");
  addBody(report.personality.core_personality);
  addBody(`Communication: ${report.personality.communication_style}`);
  addBody(`Relationships: ${report.personality.relationship_style}`);
  addBody(`Career style: ${report.personality.career_style}`);

  if (report.career_suggestions?.professions?.length) {
    addTitle("Career reflections");
    for (const p of report.career_suggestions.professions.slice(0, 12)) {
      addBullet(p);
    }
  }

  if (report.strengths?.length) {
    addTitle("Strengths");
    for (const s of report.strengths.slice(0, 10)) addBullet(s);
  }

  if (report.growth_opportunities?.length) {
    addTitle("Growth opportunities");
    for (const g of report.growth_opportunities.slice(0, 10)) addBullet(g);
  }

  if (report.growth_areas?.length) {
    addTitle("Areas to work on");
    for (const g of report.growth_areas.slice(0, 8)) {
      addBody(`${g.title}: ${g.suggestion}`);
    }
  }

  addTitle("Timing");
  addBody(
    `Personal year ${report.personal_year.number}: ${report.personal_year.theme}. ${report.personal_year.advice}`,
  );
  addBody(
    `Personal month ${report.personal_month.number}: ${report.personal_month.theme}. ${report.personal_month.advice}`,
  );
  if (report.projected_year) {
    addBody(
      `Projected year ${report.projected_year.number} (${report.projected_year.calendar_year}): ${report.projected_year.theme}. ${report.projected_year.advice}`,
    );
  }

  addTitle("Age guidance");
  addBody(
    `${report.age_guidance.category}: ${report.age_guidance.guidance}`,
  );

  addTitle("Disclaimer");
  addBody(report.disclaimer, 9);
  for (const notice of report.safety_notices ?? []) {
    addBody(notice, 8);
  }
  addBody(
    `${BRAND_NAME} PDF export · Reflective use only · ${new Date().toISOString().slice(0, 10)}`,
    8,
  );

  const safeName = name.replace(/[^\w\-]+/g, "_").slice(0, 40) || "reading";
  doc.save(`${BRAND_NAME}_${safeName}.pdf`);
}
