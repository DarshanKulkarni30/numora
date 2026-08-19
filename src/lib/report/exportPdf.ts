import { jsPDF } from "jspdf";
import type { NumerologyReport } from "@/lib/numerology/types";
import {
  normalizeCompatTone,
  type CompatTone,
} from "@/lib/numerology/compatibility";
import {
  buildPythagoreanWheel,
  pythagoreanWheelPdfLines,
} from "@/lib/numerology/pythagoreanWheel";
import {
  auraIdentityPdfLines,
  buildAuraIdentity,
} from "@/lib/numerology/auraIdentity";
import { buildLoShuArchitecture } from "@/lib/numerology/loShuArchitecture";
import { vedicSquareReportBlueprintLines } from "@/lib/numerology/vedicSquareArchitecture";
import { BRAND_NAME } from "@/lib/site";

const NAVY: [number, number, number] = [30, 58, 107];
const INK: [number, number, number] = [28, 35, 48];
const SOFT: [number, number, number] = [70, 82, 98];
const SAND: [number, number, number] = [196, 164, 108];
const TEAL: [number, number, number] = [45, 122, 120];
const MIST: [number, number, number] = [236, 241, 246];

const TONE_RGB: Record<CompatTone, [number, number, number]> = {
  Amazing: [209, 250, 229],
  Favourable: [204, 251, 241],
  Neutral: [241, 245, 249],
  Challenging: [254, 243, 199],
};

const TONE_INK: Record<CompatTone, [number, number, number]> = {
  Amazing: [6, 78, 59],
  Favourable: [19, 78, 74],
  Neutral: [51, 65, 85],
  Challenging: [120, 53, 15],
};

type MatrixRow = {
  partnerLifePath: number;
  romantic: string;
  business: string;
  friendship: string;
};

function wrapLines(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text.replace(/\s+/g, " ").trim(), maxWidth);
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/nw-mark.png?v=6");
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Build and download a branded multi-page PDF of a saved report.
 */
export async function downloadReportPdf(
  report: NumerologyReport,
): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const footerY = pageH - 28;
  const headerH = 52;
  const maxW = pageW - margin * 2;
  const contentTop = margin + headerH;
  const contentBottom = footerY - 18;

  let y = contentTop;
  const year = new Date().getFullYear();
  const person = report.person;
  const snap = report.numerology_snapshot;
  const name = person.preferred_name || person.full_name;
  const logo = await loadLogoDataUrl();

  const destinations: Record<string, number> = {};

  const drawHeader = () => {
    doc.setFillColor(...MIST);
    doc.rect(0, 0, pageW, headerH + 8, "F");
    if (logo) {
      try {
        doc.addImage(logo, "PNG", margin, 10, 28, 28);
      } catch {
        /* ignore bad image */
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(BRAND_NAME, margin + (logo ? 36 : 0), 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SOFT);
    doc.text(`${name} · Personal reading`, margin + (logo ? 36 : 0), 36);
    doc.setDrawColor(...SAND);
    doc.setLineWidth(1.2);
    doc.line(margin, headerH + 4, pageW - margin, headerH + 4);
  };

  const drawFooter = (pageNum: number, total: number) => {
    doc.setDrawColor(...SAND);
    doc.setLineWidth(0.8);
    doc.line(margin, footerY - 10, pageW - margin, footerY - 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SOFT);
    doc.text(
      `© ${year} ${BRAND_NAME} · Reflective use only`,
      margin,
      footerY,
    );
    doc.text(`${pageNum} / ${total}`, pageW - margin, footerY, {
      align: "right",
    });
  };

  const ensureSpace = (need: number) => {
    if (y + need > contentBottom) {
      doc.addPage();
      y = contentTop;
    }
  };

  const markDestination = (id: string) => {
    destinations[id] = doc.getCurrentPageInfo().pageNumber;
  };

  const addBanner = (text: string, id?: string) => {
    ensureSpace(36);
    if (id) markDestination(id);
    doc.setFillColor(...NAVY);
    doc.roundedRect(margin, y - 4, maxW, 24, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(text, margin + 10, y + 12);
    y += 34;
  };

  const addBody = (text: string, size = 10) => {
    if (!text?.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...INK);
    const lines = wrapLines(doc, text, maxW);
    for (const line of lines) {
      ensureSpace(14);
      doc.text(line, margin, y);
      y += 13;
    }
    y += 5;
  };

  const addBullet = (text: string) => addBody(`• ${text}`);

  const addToneCell = (
    x: number,
    cellY: number,
    w: number,
    h: number,
    toneRaw: string,
  ) => {
    const tone = normalizeCompatTone(toneRaw);
    const known = tone in TONE_RGB ? (tone as CompatTone) : null;
    const bg = known ? TONE_RGB[known] : MIST;
    const fg = known ? TONE_INK[known] : SOFT;
    doc.setFillColor(...bg);
    doc.roundedRect(x, cellY, w, h, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...fg);
    doc.text(String(tone).slice(0, 12), x + w / 2, cellY + h / 2 + 2, {
      align: "center",
    });
  };

  const addCompatTable = (
    title: string,
    rawNumber: string,
    matrix: MatrixRow[] | undefined,
  ) => {
    if (!matrix?.length) return;
    ensureSpace(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...TEAL);
    doc.text(`${title} · core ${rawNumber}`, margin, y);
    y += 14;

    const colW = [36, (maxW - 36) / 3, (maxW - 36) / 3, (maxW - 36) / 3];
    const rowH = 16;
    ensureSpace(rowH + 4);
    doc.setFillColor(...NAVY);
    doc.rect(margin, y, maxW, rowH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    const headers = ["Digit", "Romantic", "Business", "Friendship"];
    let x = margin;
    headers.forEach((h, i) => {
      doc.text(h, x + colW[i]! / 2, y + 11, { align: "center" });
      x += colW[i]!;
    });
    y += rowH;

    for (const row of matrix) {
      ensureSpace(rowH + 2);
      const baseY = y;
      doc.setDrawColor(220, 226, 234);
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, baseY, colW[0]!, rowH, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...INK);
      doc.text(String(row.partnerLifePath), margin + colW[0]! / 2, baseY + 11, {
        align: "center",
      });
      addToneCell(margin + colW[0]!, baseY + 1, colW[1]! - 2, rowH - 2, row.romantic);
      addToneCell(
        margin + colW[0]! + colW[1]!,
        baseY + 1,
        colW[2]! - 2,
        rowH - 2,
        row.business,
      );
      addToneCell(
        margin + colW[0]! + colW[1]! + colW[2]!,
        baseY + 1,
        colW[3]! - 2,
        rowH - 2,
        row.friendship,
      );
      y += rowH;
    }
    y += 12;
  };

  // —— Cover ——
  drawHeader();
  y = contentTop + 40;
  if (logo) {
    try {
      doc.addImage(logo, "PNG", pageW / 2 - 36, y, 72, 72);
      y += 88;
    } catch {
      y += 10;
    }
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...NAVY);
  doc.text(BRAND_NAME, pageW / 2, y, { align: "center" });
  y += 28;
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text("Personal numerology reading", pageW / 2, y, { align: "center" });
  y += 24;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...SOFT);
  doc.text(
    `${name} · DOB ${person.date_of_birth} · age ${person.age} · ${person.report_type}`,
    pageW / 2,
    y,
    { align: "center" },
  );
  y += 18;
  if (snap.sun_sign_label) {
    doc.text(`Sun sign: ${snap.sun_sign_label}`, pageW / 2, y, {
      align: "center",
    });
    y += 16;
  }
  y += 12;
  addBody(
    "Generated for private reflection. Belief-based content only—not medical, legal, or financial advice.",
    9,
  );

  // —— Contents ——
  doc.addPage();
  y = contentTop;
  addBanner("Contents", "toc");
  const tocEntries: { id: string; label: string }[] = [
    { id: "snapshot", label: "Core snapshot" },
    { id: "pythagorean", label: "Pythagorean" },
    { id: "chaldean", label: "Chaldean name" },
    { id: "vedic", label: "Vedic" },
    { id: "lo-shu", label: "Lo Shu grid" },
    { id: "aura", label: "Aura identity" },
    { id: "compatibility", label: "Compatibility matrices" },
    { id: "personality", label: "Personality & career" },
    { id: "growth", label: "Strengths & growth" },
    { id: "timing", label: "Timing" },
    { id: "disclaimer", label: "Disclaimer" },
  ];
  const tocYs: { id: string; y: number; page: number }[] = [];
  for (const entry of tocEntries) {
    ensureSpace(18);
    tocYs.push({
      id: entry.id,
      y,
      page: doc.getCurrentPageInfo().pageNumber,
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(entry.label, margin + 8, y);
    y += 18;
  }

  // —— Snapshot ——
  doc.addPage();
  y = contentTop;
  addBanner("Core snapshot", "snapshot");
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
    ensureSpace(18);
    doc.setFillColor(...MIST);
    doc.roundedRect(margin, y - 10, maxW, 16, 3, 3, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...SOFT);
    doc.text(label, margin + 8, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...NAVY);
    doc.text(String(value), pageW - margin - 8, y, { align: "right" });
    y += 20;
  }

  // —— Pythagorean ——
  addBanner("Pythagorean", "pythagorean");
  addBody(
    `Life Path ${report.pythagorean.life_path.number}: ${report.pythagorean.life_path.meaning}`,
  );
  addBody(
    `Birth Day ${report.pythagorean.birth_day.number}: ${report.pythagorean.birth_day.meaning}`,
  );
  addBody(
    `Expression ${report.pythagorean.expression.number}: ${report.pythagorean.expression.meaning}`,
  );
  addBody(
    `Soul Urge ${report.pythagorean.soul_urge.number}: ${report.pythagorean.soul_urge.meaning}`,
  );
  addBody(
    `Personality ${report.pythagorean.personality.number}: ${report.pythagorean.personality.meaning}`,
  );
  addBody(
    `Maturity ${report.pythagorean.maturity.number}: ${report.pythagorean.maturity.meaning}`,
  );
  try {
    const wheel = buildPythagoreanWheel(person.date_of_birth, snap);
    for (const line of pythagoreanWheelPdfLines(wheel)) {
      addBody(line);
    }
  } catch {
    /* skip wheel lines if DOB cannot be parsed */
  }

  // —— Chaldean ——
  addBanner("Chaldean name", "chaldean");
  addBody(
    `Name ${report.chaldean.name_number} (compound ${report.chaldean.compound_number} → ${report.chaldean.reduced_number})`,
  );
  addBody(report.chaldean.analysis);

  // —— Vedic ——
  addBanner("Vedic", "vedic");
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

  addBanner("Vedic Square", "vedic");
  addBody(
    "9×9 digital-root multiplication lattice (not Ank Kundli). Footprints for Psychic, Destiny, and Name:",
    9,
  );
  for (const line of vedicSquareReportBlueprintLines({
    psychic: snap.vedic_psychic,
    destiny: snap.vedic_destiny,
    name: snap.vedic_name,
  })) {
    addBody(line, 9);
  }

  // —— Lo Shu ——
  addBanner("Lo Shu grid", "lo-shu");
  addBody(
    `Present: ${report.lo_shu.present_numbers.join(", ") || "—"}. Missing: ${report.lo_shu.missing_numbers.join(", ") || "—"}.`,
  );
  addBody(
    `Planes — mental: ${report.lo_shu.mental_plane}; emotional: ${report.lo_shu.emotional_plane}; practical: ${report.lo_shu.practical_plane}.`,
  );
  if (report.lo_shu.birth_number != null) {
    addBody(`BN (Psychic) in grid: ${report.lo_shu.birth_number}`);
  }
  if (report.lo_shu.destiny_number != null) {
    addBody(`DN (Destiny) in grid: ${report.lo_shu.destiny_number}`);
  }
  addBody(report.lo_shu.analysis);

  const architecture = buildLoShuArchitecture(report.lo_shu);
  addBanner(architecture.blueprint.title, "lo-shu");
  addBody(`Decision flow: ${architecture.decisionFlowLabel}.`);
  addBody(
    `Life-path tension: ${architecture.tension.label}. ${architecture.tension.narrative}`,
  );
  for (const line of architecture.blueprint.lines.slice(0, 14)) {
    addBody(line, 9);
  }

  addBanner("Aura identity", "aura");
  const aura = buildAuraIdentity({
    lifePath: snap.life_path,
    vedicDestiny: snap.vedic_destiny,
    chaldeanName: snap.chaldean_name_number,
  });
  for (const line of auraIdentityPdfLines(aura)) {
    addBody(line);
  }

  // —— Compatibility (full matrices) ——
  doc.addPage();
  y = contentTop;
  addBanner("Compatibility matrices", "compatibility");
  addBody(
    report.compatibility.disclaimer ||
      "Full partner-digit tables (1–9). Amazing / Favourable / Neutral / Challenging — reflective tones only.",
    9,
  );

  const py = report.compatibility.pythagorean;
  addCompatTable(
    "Pythagorean · Life Path",
    py?.raw_number ?? snap.life_path,
    py?.matrix ?? report.compatibility.matrix,
  );

  const ved = report.compatibility.vedic;
  if (ved?.moolank) {
    addCompatTable(
      "Vedic · Psychic (Moolank)",
      ved.moolank.raw_number,
      ved.moolank.matrix,
    );
  }
  if (ved?.bhagyank) {
    addCompatTable(
      "Vedic · Destiny (Bhagyank)",
      ved.bhagyank.raw_number,
      ved.bhagyank.matrix,
    );
  }
  if (ved?.namank) {
    addCompatTable(
      "Vedic · Name (Namank)",
      ved.namank.raw_number,
      ved.namank.matrix,
    );
  }

  // —— Personality ——
  addBanner("Personality & career", "personality");
  addBody(report.personality.core_personality);
  addBody(`Communication: ${report.personality.communication_style}`);
  addBody(`Relationships: ${report.personality.relationship_style}`);
  addBody(`Career style: ${report.personality.career_style}`);
  if (report.career_suggestions?.professions?.length) {
    addBody("Career reflections:", 10);
    for (const p of report.career_suggestions.professions.slice(0, 14)) {
      addBullet(p);
    }
  }

  // —— Growth ——
  addBanner("Strengths & growth", "growth");
  if (report.strengths?.length) {
    addBody("Strengths", 10);
    for (const s of report.strengths.slice(0, 12)) addBullet(s);
  }
  if (report.growth_opportunities?.length) {
    addBody("Growth opportunities", 10);
    for (const g of report.growth_opportunities.slice(0, 12)) addBullet(g);
  }
  if (report.growth_areas?.length) {
    addBody("Areas to work on", 10);
    for (const g of report.growth_areas.slice(0, 10)) {
      addBody(`${g.title}: ${g.suggestion}`);
    }
  }

  // —— Timing ——
  addBanner("Timing", "timing");
  addBody(
    `Personal year ${report.personal_year.number}${
      report.personal_year.nature ? ` · ${report.personal_year.nature}` : ""
    }${
      report.personal_year.range_label
        ? ` (${report.personal_year.range_label})`
        : ""
    }${
      report.personal_year.land ? `. ${report.personal_year.land}` : ""
    }: ${report.personal_year.theme}. ${report.personal_year.advice}`,
  );
  addBody(
    `Personal month ${report.personal_month.number}: ${report.personal_month.theme}. ${report.personal_month.advice}`,
  );
  if (report.projected_year) {
    addBody(
      `Projected year ${report.projected_year.number} (${
        report.projected_year.range_label ??
        report.projected_year.calendar_year
      }): ${report.projected_year.theme}. ${report.projected_year.advice}`,
    );
  }
  addBody(
    `Age guidance — ${report.age_guidance.category}: ${report.age_guidance.guidance}`,
  );

  // —— Disclaimer ——
  addBanner("Disclaimer", "disclaimer");
  addBody(report.disclaimer, 9);
  for (const notice of report.safety_notices ?? []) {
    addBody(notice, 8);
  }
  addBody(
    `${BRAND_NAME} PDF · ${new Date().toISOString().slice(0, 10)}`,
    8,
  );

  // Wire TOC clickable links now that destinations exist
  const totalPages = doc.getNumberOfPages();
  for (const item of tocYs) {
    const destPage = destinations[item.id];
    if (!destPage) continue;
    doc.setPage(item.page);
    doc.link(margin, item.y - 10, maxW, 14, { pageNumber: destPage });
  }

  // Headers/footers on all pages + outline bookmarks
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawHeader();
    drawFooter(p, totalPages);
  }

  for (const entry of tocEntries) {
    const page = destinations[entry.id];
    if (page) {
      doc.outline.add(null, entry.label, { pageNumber: page });
    }
  }

  const safeName = name.replace(/[^\w\-]+/g, "_").slice(0, 40) || "reading";
  doc.save(`${BRAND_NAME}_${safeName}.pdf`);
}
