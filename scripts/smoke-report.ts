import { estimateWordCount, generateReport } from "../src/lib/numerology/report";

const report = generateReport({
  fullName: "Aarav Mehta",
  preferredName: "Aarav",
  dateOfBirth: "15/08/1995",
  purpose: "Self-reflection",
});

const words = estimateWordCount(report);
console.log("sections", report.sections.length);
console.log("life_path", report.numerology_snapshot.life_path);
console.log("vedic", report.numerology_snapshot.vedic_psychic, report.numerology_snapshot.vedic_destiny);
console.log("words", words);
if (words < 1200) {
  console.error("Word count below target band");
  process.exit(1);
}
console.log("ok");
