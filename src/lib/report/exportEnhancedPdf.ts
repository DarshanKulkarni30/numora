import { jsPDF } from "jspdf";
import { buildEnhancedReading } from "@/lib/numerology/enhanced";
import { pythagoreanChartPdfLines } from "@/lib/numerology/pythagoreanChart";
import {
  buildYearForecast,
  yearForecastPdfLines,
} from "@/lib/numerology/yearForecast";
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

export async function downloadEnhancedPdf(
  report: NumerologyReport,
  reportId: string,
): Promise<void> {
  const reading = buildEnhancedReading(report, { reportId });
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
  const name = reading.hero.displayName;
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
    doc.text(`${name} · Enhanced reading`, margin + (logo ? 36 : 0), 36);
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
    doc.text(`${pageNum} / ${total}`, pageW - margin, footerY, { align: "right" });
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
    const lines = wrapLines(doc, text, maxW);
    for (const line of lines) {
      ensureSpace(14);
      doc.text(line, margin, y);
      y += 13;
    }
    y += 5;
  };

  const addH = (text: string) => {
    ensureSpace(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(text, margin, y);
    y += 16;
  };

  const addBullet = (text: string) => addBody(`• ${text}`);

  drawHeader();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...INK);
  doc.text(name, margin, y);
  y += 22;
  addBody(reading.hero.archetype, 14);
  addBody(reading.hero.throughline);
  addBody(`Current focus: ${reading.hero.currentFocus.join(" · ")}`);
  addBody(`Season as of ${reading.season.asOf}`);
  if (reading.hero.nameEra) addBody(reading.hero.nameEra);

  addBanner("How to read this");
  for (const line of reading.howToRead) addBullet(line);

  addBanner("Core numbers");
  addBody(
    reading.coreStrip.map((c) => `${c.label} ${c.value}`).join("  ·  "),
    9,
  );

  addBanner("Recurring themes");
  for (const t of reading.themes) {
    addBody(`${t.label} — ${t.count} seats. Appears in: ${t.appearsIn.join(", ")}`);
  }

  addBanner("Numerological story");
  addBody(reading.narrative.teaser);
  for (const para of reading.narrative.full.split("\n\n")) addBody(para);

  addBanner("Current season");
  addBody(
    `Personal Year ${reading.season.yearNumber} (${reading.season.yearTitle}). ${reading.season.combined}`,
  );
  addH("Practise");
  for (const x of reading.season.doThis) addBullet(x);
  addH("Ease off");
  for (const x of reading.season.easeOff) addBullet(x);

  addBanner("Twelve-month chapter");
  for (const line of yearForecastPdfLines(
    buildYearForecast(report.person.date_of_birth),
  )) {
    addBody(line, 9);
  }

  addBanner("How numbers work together");
  addBody(
    reading.flow.primary.map((n) => `${n.label} ${n.number}`).join(" → "),
  );
  addBody(reading.flow.primaryNarrative);
  addBody(
    `${reading.flow.secondary.map((n) => `${n.label} ${n.number}`).join(" ↔ ")}. ${reading.flow.secondaryNarrative}`,
  );

  addBanner("Chaldean name vibration");
  addBody(`${reading.chaldean.compound} → ${reading.chaldean.reduced}`);
  addBody(reading.chaldean.texture);
  addBody(reading.chaldean.essence);
  addBody(reading.chaldean.compare);

  addBanner("Lo Shu lived effects");
  addBody(reading.loShuLived.summary);
  for (const item of reading.loShuLived.items) {
    addBullet(`${item.kind === "missing" ? "Quiet" : "Loud"} ${item.number}: ${item.effect}`);
  }

  addBanner("Pythagorean chart");
  for (const line of pythagoreanChartPdfLines(reading.pythagoreanChart)) {
    addBody(line, 9);
  }

  addBanner("Lifestyle tendencies");
  addBody(`Learning: ${reading.lifestyle.learning}`);
  addBody(`Leadership: ${reading.lifestyle.leadership}`);
  addBody(`Communication: ${reading.lifestyle.communication}`);
  addBody(`Under strain: ${reading.lifestyle.stress}`);
  addBody(`Recovery: ${reading.lifestyle.recovery}`);

  addBanner("Personal energies");
  addBody(reading.trivia.note);
  addBody(`Motto: ${reading.trivia.motto}`);
  addBody(`Colors: ${[...reading.trivia.colorsPrimary, ...reading.trivia.colorsSupport].map((c) => c.name).join(", ")}`);
  addBody(
    reading.trivia.weekdays.map((w) => `${w.label}: ${w.day}`).join(" · "),
  );
  addBody(`Recurring digits: ${reading.trivia.recurringDigits.join(", ")}`);
  addBody(`Element tones: ${reading.trivia.elements.join(", ")}`);
  addBody(`Workspaces: ${reading.trivia.workspaces.join("; ")}`);

  addBanner("Action plan");
  addBody(reading.actionPlan.purposeNote);
  addH(reading.actionPlan.days30.title);
  for (const x of reading.actionPlan.days30.items) addBullet(x);
  addH(reading.actionPlan.days90.title);
  for (const x of reading.actionPlan.days90.items) addBullet(x);
  addH(reading.actionPlan.year.title);
  addBody(`Primary: ${reading.actionPlan.year.primary}`);
  addBody(`Secondary: ${reading.actionPlan.year.secondary}`);
  for (const x of reading.actionPlan.year.items) addBullet(x);

  addBanner("Expert — calculations");
  for (const s of reading.student.lifePathSteps) addBody(`${s.label}: ${s.detail}`, 9);
  for (const s of reading.student.nameSteps) addBody(`${s.label}: ${s.detail}`, 9);
  addH("Master-number rules");
  for (const s of reading.student.masterRules) addBullet(s);

  addBanner("Expert — school compare");
  for (const row of reading.schoolCompare) {
    addH(row.topic);
    addBody(`Pythagorean: ${row.pythagorean}`, 9);
    addBody(`Chaldean: ${row.chaldean}`, 9);
    addBody(`Vedic: ${row.vedic}`, 9);
  }

  addBanner("Chart presence");
  addBody(
    `Themes: ${reading.radar.map((a) => `${a.label} ${a.count}`).join(" · ")}`,
  );
  for (const p of reading.planets) {
    addBody(`${p.name} — ${p.count} seats: ${p.seats.join(", ")}`, 9);
  }

  addBanner("Notes");
  addBody(reading.disclaimer);
  for (const n of report.safety_notices ?? []) addBody(n);

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawHeader();
    drawFooter(i, total);
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "reading";
  doc.save(`${slug}-enhanced-numora.pdf`);
}
