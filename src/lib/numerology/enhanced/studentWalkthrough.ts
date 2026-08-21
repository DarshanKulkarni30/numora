import { CHALDEAN, PYTHAGOREAN, sumMappedLetters } from "@/lib/numerology/mappings";
import { isVowel, parseDob, reduceNumber } from "@/lib/numerology/reduce";
import { assertSafeCopy, assertSafeList } from "@/lib/numerology/safety";
import type { NumerologyReport } from "@/lib/numerology/types";
import { parseChartNumber } from "./digits";

export type CalcStep = { label: string; detail: string };

export type StudentWalkthrough = {
  lifePathSteps: CalcStep[];
  nameSteps: CalcStep[];
  masterRules: string[];
  methodNotes: string[];
};

export function buildStudentWalkthrough(report: NumerologyReport): StudentWalkthrough {
  const dob = report.person.date_of_birth;
  const name =
    report.numerology_snapshot.operating_name ||
    report.person.operating_name ||
    report.person.full_name ||
    "";
  const natal = report.numerology_snapshot.natal_name || report.person.full_name;

  let lifePathSteps: CalcStep[] = [
    { label: "Date of birth", detail: dob },
  ];
  try {
    const { day, month, year } = parseDob(dob);
    const d = reduceNumber(day);
    const m = reduceNumber(month);
    const y = reduceNumber(year);
    const sum = d + m + y;
    const lp = reduceNumber(sum);
    lifePathSteps = [
      { label: "Date of birth", detail: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}` },
      { label: "Reduce day", detail: `${day} → ${d}${d === 11 || d === 22 || d === 33 ? " (master kept in this part)" : ""}` },
      { label: "Reduce month", detail: `${month} → ${m}` },
      { label: "Reduce year", detail: `${year} → ${y}` },
      { label: "Sum parts", detail: `${d} + ${m} + ${y} = ${sum}` },
      { label: "Life Path", detail: `${sum} → ${lp} (11, 22, 33 kept if they appear)` },
    ];
  } catch {
    lifePathSteps.push({
      label: "Note",
      detail: "This saved report’s date could not be re-parsed; showing stored Life Path only.",
    });
  }

  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("");
  const shown = letters.slice(0, 18);
  const pythMap = shown.map((ch) => `${ch}=${PYTHAGOREAN[ch] ?? 0}`).join(" ");
  const chalMap = shown.map((ch) => `${ch}=${CHALDEAN[ch] ?? 0}`).join(" ");
  const pythSum = sumMappedLetters(name, PYTHAGOREAN);
  const chalSum = sumMappedLetters(name, CHALDEAN);
  const vowels = sumMappedLetters(name, PYTHAGOREAN, (ch) => isVowel(ch));
  const consonants = sumMappedLetters(name, PYTHAGOREAN, (ch) => !isVowel(ch));

  const nameSteps: CalcStep[] = [
    { label: "Spelling in force", detail: name },
    {
      label: "Pythagorean letters",
      detail: `${pythMap}${letters.length > 18 ? " …" : ""} (sum ${pythSum} → Expression ${reduceNumber(pythSum)})`,
    },
    {
      label: "Vowels / consonants",
      detail: `Soul Urge from vowels (sum ${vowels} → ${reduceNumber(vowels)}); Personality from consonants (sum ${consonants} → ${reduceNumber(consonants)})`,
    },
    {
      label: "Chaldean letters (no 9)",
      detail: `${chalMap}${letters.length > 18 ? " …" : ""} (sum ${chalSum} → ${reduceNumber(chalSum, [11, 22])})`,
    },
  ];

  if (natal && natal !== name) {
    nameSteps.push({
      label: "Natal spelling",
      detail: `${natal} remains the birth-certificate layer. Date numbers do not change with a later name.`,
    });
  }

  const lpStored = parseChartNumber(report.numerology_snapshot.life_path);
  const masterRules = assertSafeList(
    [
      "Pythagorean reductions keep 11, 22, and 33 when they appear in a part or a total.",
      "Vedic Psychic and Destiny reduce to 1–9 (masters are not kept in those two seats).",
      "Chaldean letter map uses 1–8; 9 is not assigned to a letter. Compounds are read as texture; the reduced digit is essence.",
      lpStored === 11 || lpStored === 22 || lpStored === 33
        ? `This profile stores Life Path ${lpStored} as a master number.`
        : "This profile’s Life Path is a single digit; master-number rules still apply to parts of the date when 11/22/33 appear there.",
    ],
    "enhanced.student.masters",
  );

  const methodNotes = assertSafeList(
    [
      "Three schools are shown because they answer different questions—not because one is secretly correct.",
      "Enhanced synthesis counts chart seats; it does not replace the detailed report’s full method notes.",
      "Pythagorean extras (Challenges, Period Cycles, Balance, Hidden Passion, missing-letter Lessons, name Planes, Personal Day, Essence) use the birth-certificate spelling. Name-letter planes are not Lo Shu date-grid planes.",
      report.disclaimer,
    ],
    "enhanced.student.notes",
  );

  return {
    lifePathSteps: lifePathSteps.map((s) => ({
      label: s.label,
      detail: assertSafeCopy(s.detail, `enhanced.student.lp.${s.label}`),
    })),
    nameSteps: nameSteps.map((s) => ({
      label: s.label,
      detail: assertSafeCopy(s.detail, `enhanced.student.name.${s.label}`),
    })),
    masterRules,
    methodNotes,
  };
}
