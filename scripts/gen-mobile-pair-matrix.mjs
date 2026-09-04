/**
 * Writes src/lib/numerology/data/mobilePairMatrix.json
 * Compact rows: class, score, purpose tags.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rows = {
  "00": ["neutral", 0, [], "low"],
  "01": ["positive", 4, ["career"], "low"],
  "02": ["positive", 4, ["relationship"], "low"],
  "03": ["positive", 4, ["career", "business", "networking"], "low"],
  "04": ["neutral", 2, ["career"], "low"],
  "05": ["positive", 4, ["business", "networking"], "low"],
  "06": ["positive", 4, ["relationship"], "low"],
  "07": ["neutral", 2, [], "low"],
  "08": ["caution", 0, [], "medium"],
  "09": ["positive", 4, ["career"], "low"],
  "10": ["positive", 4, ["career"], "low"],
  "11": ["caution", 0, ["career"], "medium"],
  "12": ["positive", 5, ["relationship", "business"], "low"],
  "13": ["strong_positive", 5, ["business", "career"], "low"],
  "14": ["strong_conflict", -5, [], "high"],
  "15": ["strong_positive", 5, ["business", "wealth", "relationship"], "low"],
  "16": ["severe_conflict", -5, [], "very_high"],
  "17": ["positive", 4, ["career"], "low"],
  "18": ["severe_conflict", -5, [], "very_high"],
  "19": ["strong_positive", 5, ["career", "business"], "low"],
  "20": ["neutral", 2, [], "low"],
  "21": ["positive", 4, ["relationship"], "low"],
  "22": ["caution", 0, ["business"], "medium"],
  "23": ["positive", 5, ["business", "wealth", "career"], "low"],
  "24": ["positive", 5, ["relationship"], "low"],
  "25": ["strong_positive", 5, ["career", "business"], "low"],
  "26": ["severe_conflict", -5, [], "very_high"],
  "27": ["caution", 0, [], "medium"],
  "28": ["severe_conflict", -5, [], "very_high"],
  "29": ["positive", 5, ["relationship"], "low"],
  "30": ["neutral", 2, [], "low"],
  "31": ["strong_positive", 5, ["business", "career"], "low"],
  "32": ["contextual", 2, ["networking", "relationship"], "low"],
  "33": ["positive", 4, ["networking"], "low"],
  "34": ["severe_conflict", -5, [], "very_high"],
  "35": ["positive", 5, ["business", "networking"], "low"],
  "36": ["conflict", -3, [], "medium"],
  "37": ["strong_positive", 5, ["career", "business"], "low"],
  "38": ["positive", 4, ["business"], "medium"],
  "39": ["strong_positive", 5, ["business", "wealth", "career"], "low"],
  "40": ["neutral", 2, ["business", "career"], "low"],
  "41": ["strong_conflict", -5, [], "high"],
  "42": ["contextual", 2, ["relationship"], "low"],
  "43": ["severe_conflict", -5, [], "very_high"],
  "44": ["severe_conflict", -5, [], "very_high"],
  "45": ["strong_conflict", -5, [], "high"],
  "46": ["severe_conflict", -5, [], "very_high"],
  "47": ["positive", 4, ["career"], "low"],
  "48": ["severe_conflict", -5, [], "very_high"],
  "49": ["severe_conflict", -5, [], "very_high"],
  "50": ["neutral", 2, ["networking"], "low"],
  "51": ["strong_positive", 5, ["business", "wealth", "networking"], "low"],
  "52": ["strong_positive", 5, ["business", "career"], "low"],
  "53": ["strong_positive", 5, ["business", "networking"], "low"],
  "54": ["strong_conflict", -5, [], "high"],
  "55": ["caution", 2, ["business", "networking"], "medium"],
  "56": ["positive", 4, ["business", "relationship", "networking"], "low"],
  "57": ["strong_positive", 5, ["business"], "low"],
  "58": ["caution", 0, [], "medium"],
  "59": ["positive", 4, ["business", "career"], "low"],
  "60": ["neutral", 2, ["relationship"], "low"],
  "61": ["severe_conflict", -5, [], "very_high"],
  "62": ["severe_conflict", -5, [], "very_high"],
  "63": ["conflict", -3, [], "medium"],
  "64": ["severe_conflict", -5, [], "very_high"],
  "65": ["positive", 4, ["business", "relationship", "networking"], "low"],
  "66": ["positive", 4, ["wealth", "relationship"], "low"],
  "67": ["contextual", 2, ["relationship"], "low"],
  "68": ["severe_conflict", -5, [], "very_high"],
  "69": ["positive", 4, ["wealth", "relationship"], "low"],
  "70": ["caution", 0, [], "medium"],
  "71": ["positive", 4, ["career"], "low"],
  "72": ["caution", 0, ["relationship"], "medium"],
  "73": ["strong_positive", 5, ["business", "career"], "low"],
  "74": ["positive", 4, ["career"], "low"],
  "75": ["strong_positive", 5, ["business", "networking"], "low"],
  "76": ["caution", 0, ["relationship"], "medium"],
  "77": ["strong_caution", -2, [], "high"],
  "78": ["caution", 0, [], "medium"],
  "79": ["contextual", 2, ["career"], "low"],
  "80": ["caution", 0, [], "medium"],
  "81": ["severe_conflict", -5, [], "very_high"],
  "82": ["severe_conflict", -5, [], "very_high"],
  "83": ["positive", 4, ["business"], "medium"],
  "84": ["severe_conflict", -5, [], "very_high"],
  "85": ["caution", 0, [], "medium"],
  "86": ["severe_conflict", -5, [], "very_high"],
  "87": ["caution", 0, [], "medium"],
  "88": ["severe_conflict", -5, [], "very_high"],
  "89": ["severe_conflict", -5, [], "very_high"],
  "90": ["neutral", 2, ["career"], "low"],
  "91": ["strong_positive", 5, ["career", "business"], "low"],
  "92": ["positive", 4, ["relationship"], "low"],
  "93": ["positive", 4, ["career"], "low"],
  "94": ["severe_conflict", -5, [], "very_high"],
  "95": ["strong_positive", 5, ["business", "networking"], "low"],
  "96": ["positive", 4, ["wealth", "relationship"], "low"],
  "97": ["positive", 4, ["career"], "low"],
  "98": ["severe_conflict", -5, [], "very_high"],
  "99": ["severe_conflict", -5, [], "very_high"],
};

function affinity(tags, score) {
  const hit = (k) => (tags.includes(k) ? (score >= 5 ? 5 : score >= 4 ? 4 : 2) : 0);
  return {
    business: hit("business"),
    career: hit("career"),
    relationship: hit("relationship"),
    wealth: hit("wealth"),
    networking: hit("networking"),
  };
}

const pairs = {};
for (const [key, [cls, score, tags, risk]] of Object.entries(rows)) {
  pairs[key] = {
    class: cls,
    base_score: score,
    risk,
    purpose: affinity(tags, score),
    source_type: "traditional_numerology",
  };
}

const out = {
  version: "1.0",
  methodology: "NumoraOracle Mobile Numerology",
  pair_count: 100,
  directional: true,
  pairs,
};

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "lib", "numerology", "data");
writeFileSync(join(dir, "mobilePairMatrix.json"), `${JSON.stringify(out, null, 2)}\n`);
console.log("wrote", Object.keys(pairs).length, "pairs");
