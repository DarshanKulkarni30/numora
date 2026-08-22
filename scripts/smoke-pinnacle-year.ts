/**
 * Smoke: Pinnacle Year mountain model (School A ages + reflective copy).
 */
import { pinnaclesForDob, pinnacleAtAge } from "../src/lib/numerology/pinnacles";
import {
  buildPinnacleYearModel,
  pinnacleYearPdfLines,
} from "../src/lib/numerology/pinnacleYear";

function eq(actual: unknown, expected: unknown, label: string) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    console.error(`FAIL ${label}\n  expected ${e}\n  actual   ${a}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function has(text: string, needle: string, label: string) {
  if (!text.toLowerCase().includes(needle.toLowerCase())) {
    console.error(`FAIL ${label}: missing "${needle}" in:\n${text}`);
    process.exit(1);
  }
  console.log("ok", label);
}

function lacks(text: string, needle: string, label: string) {
  if (text.toLowerCase().includes(needle.toLowerCase())) {
    console.error(`FAIL ${label}: unexpected "${needle}"`);
    process.exit(1);
  }
  console.log("ok", label);
}

const DOB = "13/10/1990";
const asOf = new Date(2026, 7, 20);
const pins = pinnaclesForDob(DOB);
eq(pins.firstEndsAtAge, 30, "first pinnacle ends at 30");
eq(pinnacleAtAge(pins, 35).id, 2, "age 35 is chapter 2");
eq(pinnacleAtAge(pins, 35).number, 5, "age 35 number is 5");

const model = buildPinnacleYearModel({
  dob: DOB,
  lifePath: "6",
  personalYear: "5",
  expression: "3",
  asOf,
});
eq(model.age, 35, "age on 20 Aug 2026");
eq(model.current.pinnacle.id, 2, "current chapter is partnership terrace");
eq(model.current.pinnacle.number, 5, "current number 5");
eq(model.current.chapterTitle, "Partnership", "chapter 2 title");
eq(model.current.title, "Change", "number 5 title");
has(model.current.coreTone, "movement", "core tone for 5");
lacks(model.current.manifestation.join(" "), "rooms open", "no room metaphor");
eq(model.current.manifestation.length, 2, "two how-it-shows bullets");
has(model.current.practiceCue, "pick one change", "practice cue is imperative");
has(model.current.narrative, "this chapter asks", "one-line narrative");
eq(model.chapters.length, 4, "four terraces");
eq(model.current.synergies.length, 3, "LP · PY · Expression chips");
eq(model.chapters[0]?.palette.name, "Gold", "chapter 1 gold");
eq(model.chapters[2]?.palette.name, "Orange", "chapter 3 orange");

const blob = pinnacleYearPdfLines(model).join("\n");
has(blob, "Practice cue", "pdf includes practice cue");
has(blob, "current", "pdf marks current terrace");
lacks(blob, "will become", "no predictive will-become");
lacks(blob, "guaranteed", "no guaranteed language");
eq(model.chapters[2]?.pinnacle.number, 1, "third pinnacle number is 1 for this DOB");
eq(model.chapters[2]?.title, "Leadership", "number 1 copy on chapter 3");

console.log("pinnacle year smoke passed");
