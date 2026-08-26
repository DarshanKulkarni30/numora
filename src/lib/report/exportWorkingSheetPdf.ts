/**
 * Working sheet: every number with the arithmetic behind it, laid out so a
 * practitioner can check the chart by hand away from the screen.
 */

import { jsPDF } from "jspdf";
import { buildChartDerivations } from "@/lib/numerology/chartDerivations";
import { buildStudentWalkthrough } from "@/lib/numerology/enhanced/studentWalkthrough";
import { SCHOOL_COMPARE } from "@/lib/numerology/enhanced/schoolCompare";
import { buildNameChangeDiff } from "@/lib/numerology/nameChangeDiff";
import { resolvePythagoreanChart } from "@/lib/numerology/pythagoreanChart";
import type { NumerologyReport } from "@/lib/numerology/types";
import { BRAND_NAME } from "@/lib/site";

const NAVY: [number, number, number] = [30, 58, 107];
const INK: [number, number, number] = [28, 35, 48];
const SOFT: [number, number, number] = [70, 82, 98];
const SAND: [number, number, number] = [196, 164, 108];
const MIST: [number, number, number] = [236, 241, 246];

function wrapLines(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text.replace(/\s+/g, " ").trim(), maxWidth);
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch("/nw-mark.png?v=7");
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

export async function downloadWorkingSheetPdf(
  report: NumerologyReport,
): Promise<void> {
  const asOf = new Date();
  const chart = resolvePythagoreanChart(report, asOf);
  const derivations = buildChartDerivations(report, chart, asOf);
  const student = buildStudentWalkthrough(report);
  const nameDiff = buildNameChangeDiff(report);
  const debt = report.karmic_debt;

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
  const year = asOf.getFullYear();
  const person = report.person;
  const name = person.preferred_name || person.full_name;
  const logo = await loadLogoDataUrl();

  const drawHeader = () => {
    doc.setFillColor(...MIST);
    doc.rect(0, 0, pageW, headerH + 8, "F");
    if (logo) {
      try {
        doc.addImage(logo, "PNG", margin, 10, 28, 28);
      } catch {
        /* ignore */
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(BRAND_NAME, margin + (logo ? 36 : 0), 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SOFT);
    doc.text(`${name} · Working sheet`, margin + (logo ? 36 : 0), 36);
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
    doc.text(`© ${year} ${BRAND_NAME} · Reflective use only`, margin, footerY);
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

  const addBanner = (text: string) => {
    ensureSpace(36);
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
    for (const line of wrapLines(doc, text, maxW)) {
      ensureSpace(14);
      doc.text(line, margin, y);
      y += 13;
    }
    y += 5;
  };

  const addH = (text: string) => {
    ensureSpace(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(text, margin, y);
    y += 15;
  };

  const addStep = (index: number, label: string, detail: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    for (const line of wrapLines(doc, `${index}. ${label}: ${detail}`, maxW - 14)) {
      ensureSpace(13);
      doc.text(line, margin + 14, y);
      y += 12;
    }
  };

  const addQuiet = (text: string) => {
    if (!text?.trim()) return;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...SOFT);
    for (const line of wrapLines(doc, text, maxW)) {
      ensureSpace(13);
      doc.text(line, margin, y);
      y += 12;
    }
    y += 4;
  };

  const addRow = (cols: string[], widths: number[], bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.setTextColor(bold ? NAVY[0] : INK[0], bold ? NAVY[1] : INK[1], bold ? NAVY[2] : INK[2]);
    const wrapped = cols.map((c, i) => wrapLines(doc, c, widths[i]! - 8));
    const height = Math.max(...wrapped.map((w) => w.length)) * 11 + 4;
    ensureSpace(height + 2);
    let x = margin;
    wrapped.forEach((linesForCol, i) => {
      linesForCol.forEach((line, li) => {
        doc.text(line, x, y + li * 11);
      });
      x += widths[i]!;
    });
    y += height;
    doc.setDrawColor(...MIST);
    doc.setLineWidth(0.6);
    doc.line(margin, y - 2, pageW - margin, y - 2);
  };

  // —— Cover ——
  drawHeader();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text("Working sheet", margin, y);
  y += 24;
  addBody(
    `${person.full_name} · born ${person.date_of_birth}. Prepared ${asOf.toLocaleDateString()}.`,
    11,
  );
  addBody(
    "Every number in this sheet is shown with the arithmetic that produced it, so you can check the chart by hand. Where two traditions would reach different answers, the convention used here is stated next to the working.",
  );
  if (nameDiff) {
    addBody(
      `Two spellings are on file. Name-based numbers below use ${nameDiff.operatingName}; the birth-certificate spelling ${nameDiff.natalName} is compared at the end.`,
    );
  }

  // —— Core numbers ——
  addBanner("Life Path");
  student.lifePathSteps.forEach((s, i) => addStep(i + 1, s.label, s.detail));
  y += 6;

  addBanner("Name numbers");
  student.nameSteps.forEach((s, i) => addStep(i + 1, s.label, s.detail));
  y += 6;

  // —— The six that previously had no working ——
  addBanner("Remaining chart numbers");
  addQuiet(
    "These are the numbers most often printed as a bare result. Each is worked through in full.",
  );
  for (const d of derivations) {
    addH(d.title);
    addQuiet(d.purpose);
    addBody(`Starts from: ${d.inputs}`, 9);
    d.steps.forEach((s, i) => addStep(i + 1, s.label, s.detail));
    y += 4;
    addBody(`Result: ${d.result}`, 10);
    if (d.note) addQuiet(d.note);
    y += 2;
  }

  // —— Karmic debt ——
  addBanner("Karmic debt");
  if (!debt || debt.items.length === 0) {
    addBody(debt?.none_note ?? "No karmic debt totals appear in this chart.");
  } else {
    addQuiet(debt.intro);
    for (const item of debt.items) {
      addH(
        `${item.label} — found in your ${item.positions
          .map((p) => p.label.toLowerCase())
          .join(" and ")}`,
      );
      for (const position of item.positions) {
        addBody(`${position.label}: ${position.meaning}`, 9);
      }
      addBody(`What it looks like: ${item.shows_up_as}`, 9);
      addBody(`What to work on: ${item.work_on}`, 9);
    }
    if (debt.items.some((i) => i.positions.some((p) => !p.fixed))) {
      addQuiet(debt.name_note);
    }
  }

  // —— Name change ——
  if (nameDiff) {
    addBanner("Name change comparison");
    addBody(nameDiff.summary);
    addQuiet(nameDiff.intro);

    const widths = [maxW * 0.46, maxW * 0.18, maxW * 0.18, maxW * 0.18];
    addH("Numbers built from the name");
    addRow(["Number", "Birth name", "Name now", "Moved?"], widths, true);
    for (const row of nameDiff.nameRows) {
      addRow(
        [row.label, row.natal, row.operating, row.changed ? "Yes" : "No"],
        widths,
      );
    }
    y += 8;

    addH("Numbers built from the birth date");
    addQuiet("Unchanged by any name change.");
    addBody(
      nameDiff.dateRows.map((r) => `${r.label} ${r.operating}`).join("  ·  "),
      9,
    );

    addH("Karmic debts held in the name");
    addQuiet(nameDiff.debts.note);
    for (const d of nameDiff.debts.fellAway) {
      addBody(`${d.label} fell away with the old spelling. ${d.workOn}`, 9);
    }
    for (const d of nameDiff.debts.appeared) {
      addBody(`${d.label} appeared with the current spelling. ${d.showsUpAs}`, 9);
    }
    for (const d of nameDiff.debts.carriedOver) {
      addBody(`${d.label} is present in both spellings. ${d.workOn}`, 9);
    }
    if (
      !nameDiff.debts.fellAway.length &&
      !nameDiff.debts.appeared.length &&
      !nameDiff.debts.carriedOver.length
    ) {
      addBody("Neither spelling carries a karmic debt in its name totals.", 9);
    }
  }

  // —— Conventions ——
  addBanner("Conventions used");
  addH("Master numbers");
  for (const rule of student.masterRules) addBody(`• ${rule}`, 9);
  addH("Method notes");
  for (const note of student.methodNotes) addBody(`• ${note}`, 9);

  addH("Where the schools differ");
  const compareWidths = [maxW * 0.22, maxW * 0.26, maxW * 0.26, maxW * 0.26];
  addRow(["Topic", "Pythagorean", "Chaldean", "Vedic"], compareWidths, true);
  for (const row of SCHOOL_COMPARE) {
    addRow(
      [row.topic, row.pythagorean, row.chaldean, row.vedic],
      compareWidths,
    );
  }

  addBanner("Notes");
  addBody(report.disclaimer);
  for (const notice of report.safety_notices ?? []) addBody(notice, 9);

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawHeader();
    drawFooter(i, total);
  }

  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "chart";
  doc.save(`${slug}-working-sheet-numora.pdf`);
}
