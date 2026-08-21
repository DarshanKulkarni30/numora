import { jsPDF } from "jspdf";
import { resolvePythagoreanChart } from "@/lib/numerology/pythagoreanChart";
import {
  buildYearForecast,
  yearForecastPdfLines,
} from "@/lib/numerology/yearForecast";
import { buildDailyLoop, dailyLoopPdfLines } from "@/lib/numerology/dailyLoop";
import type { NumerologyReport } from "@/lib/numerology/types";
import { BRAND_NAME } from "@/lib/site";

const NAVY: [number, number, number] = [30, 58, 107];
const INK: [number, number, number] = [28, 35, 48];
const SOFT: [number, number, number] = [70, 82, 98];
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

/**
 * Short 8–10 page teaser PDF for Free (and anyone who wants a preview).
 * Distinct from the full detailed / enhanced dumps.
 */
export async function downloadTeaserPdf(
  report: NumerologyReport,
): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 52;
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
  const chart = resolvePythagoreanChart(report);
  const forecast = buildYearForecast(person.date_of_birth);
  const daily = buildDailyLoop({
    natalName: snap.natal_name || person.full_name,
    dateOfBirth: person.date_of_birth,
  });

  const drawHeader = () => {
    doc.setFillColor(...MIST);
    doc.rect(0, 0, pageW, headerH + 8, "F");
    if (logo) {
      try {
        doc.addImage(logo, "PNG", margin, 12, 28, 28);
      } catch {
        /* skip */
      }
    }
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.setTextColor(...NAVY);
    doc.text(BRAND_NAME, margin + (logo ? 36 : 0), 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...SOFT);
    doc.text("Teaser reading", pageW - margin, 30, { align: "right" });
  };

  const drawFooter = (p: number, total: number) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...SOFT);
    doc.text(`${BRAND_NAME} teaser · ${year}`, margin, footerY);
    doc.text(`${p} / ${total}`, pageW - margin, footerY, { align: "right" });
  };

  const newPage = () => {
    doc.addPage();
    y = contentTop;
  };

  const ensure = (h: number) => {
    if (y + h > contentBottom) newPage();
  };

  const addBanner = (text: string) => {
    ensure(36);
    y += 8;
    doc.setFillColor(...NAVY);
    doc.roundedRect(margin, y - 14, maxW, 22, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(text, margin + 10, y + 2);
    y += 22;
  };

  const addBody = (text: string, size = 10) => {
    const lines = wrapLines(doc, text, maxW);
    const h = lines.length * (size + 4) + 8;
    ensure(h);
    doc.setFont("times", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...INK);
    doc.text(lines, margin, y);
    y += h;
  };

  // Cover
  drawHeader();
  y = contentTop + 24;
  doc.setFont("times", "italic");
  doc.setFontSize(28);
  doc.setTextColor(...NAVY);
  doc.text(name, margin, y);
  y += 36;
  addBody(
    `A short ${BRAND_NAME} teaser — core seats, Pythagorean extras, a twelve-month chapter, and today’s Personal Day. The full detailed and enhanced PDFs stay on paid plans.`,
    12,
  );
  addBody(
    `Born ${person.date_of_birth}. Life Path ${snap.life_path} · Expression ${snap.expression_number} · Soul Urge ${snap.soul_urge_number} · Personality ${snap.personality_number}.`,
    12,
  );

  newPage();
  addBanner("Core snapshot");
  addBody(
    `Life Path ${snap.life_path}. Birth Day ${snap.birth_day}. Expression (in force) ${snap.expression_number}. Minor Expression ${snap.minor_expression_number || snap.expression_number}${
      snap.natal_expression_number
        ? `. Natal Expression ${snap.natal_expression_number}`
        : " (same as Expression — no later name in force)"
    }. Soul Urge ${snap.soul_urge_number}. Personality ${snap.personality_number}. Maturity ${snap.maturity_number}.`,
  );
  addBody(
    `Vedic Psychic ${snap.vedic_psychic} · Destiny ${snap.vedic_destiny} · Name ${snap.vedic_name}. Chaldean ${snap.chaldean_name_number}. Personal Year ${snap.personal_year} · Month ${snap.personal_month}.`,
  );
  addBody(
    `Attitude ${chart.attitude.number}. Subconscious Self ${chart.subconsciousSelf.number}. Balance ${chart.balance.number}. Hidden Passion ${chart.hiddenPassion.numbers.join("/") || "—"}.`,
  );
  addBody(chart.attitude.summary);
  addBody(chart.subconsciousSelf.summary);

  newPage();
  addBanner("Pythagorean extras");
  addBody(chart.methodNote);
  addBody(chart.balance.summary);
  addBody(chart.balance.practice);
  addBody(chart.hiddenPassion.summary);
  addBody(chart.hiddenPassion.practice);
  addBody(chart.karmicLessons.summary);
  for (const item of chart.karmicLessons.items) {
    addBody(
      `Lesson ${item.number}${item.softened ? " (softened)" : ""}: ${item.practice}`,
      9,
    );
  }

  newPage();
  addBanner("Planes, Challenges, Periods");
  addBody(chart.planeNote);
  for (const p of chart.planes) addBody(p.summary, 9);
  for (const c of chart.challenges) {
    addBody(
      `Challenge ${c.id} · ${c.number} · ages ${c.ageStart}–${c.ageEnd ?? "on"}${c.isCurrent ? " (current)" : ""} — ${c.title}. ${c.practice}`,
      9,
    );
  }
  for (const p of chart.periodCycles) {
    addBody(
      `${p.label} cycle ${p.number} · ages ${p.ageStart}–${p.ageEnd ?? "on"}${p.isCurrent ? " (current)" : ""} — ${p.practice}`,
      9,
    );
  }
  addBody(
    `Personal year ${report.personal_year.number}: ${report.personal_year.theme} ${report.personal_year.advice}`,
  );

  newPage();
  addBanner("Twelve-month chapter");
  for (const line of yearForecastPdfLines(forecast)) addBody(line, 9);

  newPage();
  addBanner("Today’s Personal Day");
  for (const line of dailyLoopPdfLines(daily)) addBody(line, 10);

  newPage();
  addBanner("This is a teaser");
  addBody(
    `The full ${BRAND_NAME} reading adds identity layers, Lo Shu, compatibility matrices, insight cards, and the complete Pythagorean chart. Unlock PDF on a paid plan when checkout is live — or keep reading on screen.`,
    11,
  );
  addBody(report.disclaimer);
  for (const notice of report.safety_notices ?? []) addBody(notice, 9);
  addBody(`${BRAND_NAME} teaser PDF · ${new Date().toISOString().slice(0, 10)}`, 8);

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawHeader();
    drawFooter(p, totalPages);
  }

  const safeName = name.replace(/[^\w\-]+/g, "_").slice(0, 40) || "reading";
  doc.save(`${BRAND_NAME}_${safeName}_teaser.pdf`);
}
