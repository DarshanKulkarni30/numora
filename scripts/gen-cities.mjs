/**
 * Curated popular world cities → src/lib/trivia/cities.ts
 * Ordered by rough global recognition / metro prominence (rank 1 = most familiar).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const PYTH = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

function nameNumber(name) {
  const letters = name
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z]/g, "");
  const sum = letters.split("").reduce((s, c) => s + (PYTH[c] || 0), 0);
  let n = sum || 9;
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return n;
}

/** Popular cities only — order = familiarity (best first). */
const POPULAR = [
  ["Tokyo", "Japan"],
  ["Delhi", "India"],
  ["Shanghai", "China"],
  ["Sao Paulo", "Brazil"],
  ["Mexico City", "Mexico"],
  ["Cairo", "Egypt"],
  ["Mumbai", "India"],
  ["Beijing", "China"],
  ["Dhaka", "Bangladesh"],
  ["Osaka", "Japan"],
  ["New York", "United States"],
  ["Karachi", "Pakistan"],
  ["Buenos Aires", "Argentina"],
  ["Chongqing", "China"],
  ["Istanbul", "Turkey"],
  ["Kolkata", "India"],
  ["Manila", "Philippines"],
  ["Lagos", "Nigeria"],
  ["Rio de Janeiro", "Brazil"],
  ["Tianjin", "China"],
  ["Kinshasa", "DR Congo"],
  ["Guangzhou", "China"],
  ["Los Angeles", "United States"],
  ["Moscow", "Russia"],
  ["Shenzhen", "China"],
  ["Lahore", "Pakistan"],
  ["Bangalore", "India"],
  ["Paris", "France"],
  ["Bogota", "Colombia"],
  ["Jakarta", "Indonesia"],
  ["Chennai", "India"],
  ["Lima", "Peru"],
  ["Bangkok", "Thailand"],
  ["Seoul", "South Korea"],
  ["Nagoya", "Japan"],
  ["Hyderabad", "India"],
  ["London", "United Kingdom"],
  ["Tehran", "Iran"],
  ["Chicago", "United States"],
  ["Chengdu", "China"],
  ["Nanjing", "China"],
  ["Wuhan", "China"],
  ["Ho Chi Minh City", "Vietnam"],
  ["Luanda", "Angola"],
  ["Ahmedabad", "India"],
  ["Kuala Lumpur", "Malaysia"],
  ["Hong Kong", "China"],
  ["Dongguan", "China"],
  ["Hangzhou", "China"],
  ["Foshan", "China"],
  ["Shenyang", "China"],
  ["Riyadh", "Saudi Arabia"],
  ["Baghdad", "Iraq"],
  ["Santiago", "Chile"],
  ["Surat", "India"],
  ["Madrid", "Spain"],
  ["Suzhou", "China"],
  ["Pune", "India"],
  ["Harbin", "China"],
  ["Houston", "United States"],
  ["Dallas", "United States"],
  ["Toronto", "Canada"],
  ["Miami", "United States"],
  ["Singapore", "Singapore"],
  ["Philadelphia", "United States"],
  ["Atlanta", "United States"],
  ["Washington", "United States"],
  ["Barcelona", "Spain"],
  ["Saint Petersburg", "Russia"],
  ["Khartoum", "Sudan"],
  ["Sydney", "Australia"],
  ["Melbourne", "Australia"],
  ["Cape Town", "South Africa"],
  ["Johannesburg", "South Africa"],
  ["Casablanca", "Morocco"],
  ["Algiers", "Algeria"],
  ["Nairobi", "Kenya"],
  ["Addis Ababa", "Ethiopia"],
  ["Accra", "Ghana"],
  ["Dar es Salaam", "Tanzania"],
  ["Alexandria", "Egypt"],
  ["Berlin", "Germany"],
  ["Rome", "Italy"],
  ["Milan", "Italy"],
  ["Naples", "Italy"],
  ["Vienna", "Austria"],
  ["Warsaw", "Poland"],
  ["Budapest", "Hungary"],
  ["Prague", "Czechia"],
  ["Amsterdam", "Netherlands"],
  ["Brussels", "Belgium"],
  ["Lisbon", "Portugal"],
  ["Athens", "Greece"],
  ["Stockholm", "Sweden"],
  ["Copenhagen", "Denmark"],
  ["Oslo", "Norway"],
  ["Helsinki", "Finland"],
  ["Dublin", "Ireland"],
  ["Zurich", "Switzerland"],
  ["Geneva", "Switzerland"],
  ["Munich", "Germany"],
  ["Frankfurt", "Germany"],
  ["Hamburg", "Germany"],
  ["Cologne", "Germany"],
  ["Lyon", "France"],
  ["Marseille", "France"],
  ["Montreal", "Canada"],
  ["Vancouver", "Canada"],
  ["San Francisco", "United States"],
  ["Seattle", "United States"],
  ["Boston", "United States"],
  ["Denver", "United States"],
  ["Phoenix", "United States"],
  ["Las Vegas", "United States"],
  ["San Diego", "United States"],
  ["Detroit", "United States"],
  ["Minneapolis", "United States"],
  ["Dubai", "United Arab Emirates"],
  ["Abu Dhabi", "United Arab Emirates"],
  ["Doha", "Qatar"],
  ["Kuwait City", "Kuwait"],
  ["Jeddah", "Saudi Arabia"],
  ["Tel Aviv", "Israel"],
  ["Jerusalem", "Israel"],
  ["Amman", "Jordan"],
  ["Beirut", "Lebanon"],
  ["Damascus", "Syria"],
  ["Ankara", "Turkey"],
  ["Izmir", "Turkey"],
  ["Islamabad", "Pakistan"],
  ["Rawalpindi", "Pakistan"],
  ["Faisalabad", "Pakistan"],
  ["Kathmandu", "Nepal"],
  ["Colombo", "Sri Lanka"],
  ["Yangon", "Myanmar"],
  ["Hanoi", "Vietnam"],
  ["Phnom Penh", "Cambodia"],
  ["Taipei", "Taiwan"],
  ["Busan", "South Korea"],
  ["Kyoto", "Japan"],
  ["Fukuoka", "Japan"],
  ["Sapporo", "Japan"],
  ["Perth", "Australia"],
  ["Brisbane", "Australia"],
  ["Auckland", "New Zealand"],
  ["Wellington", "New Zealand"],
  ["Honolulu", "United States"],
  ["Havana", "Cuba"],
  ["Panama City", "Panama"],
  ["San Jose", "Costa Rica"],
  ["Guatemala City", "Guatemala"],
  ["Caracas", "Venezuela"],
  ["Quito", "Ecuador"],
  ["La Paz", "Bolivia"],
  ["Montevideo", "Uruguay"],
  ["Asuncion", "Paraguay"],
  ["Brasilia", "Brazil"],
  ["Salvador", "Brazil"],
  ["Fortaleza", "Brazil"],
  ["Recife", "Brazil"],
  ["Porto Alegre", "Brazil"],
  ["Medellin", "Colombia"],
  ["Cali", "Colombia"],
  ["Guadalajara", "Mexico"],
  ["Monterrey", "Mexico"],
  ["Cancun", "Mexico"],
  ["Jaipur", "India"],
  ["Lucknow", "India"],
  ["Kanpur", "India"],
  ["Nagpur", "India"],
  ["Indore", "India"],
  ["Bhopal", "India"],
  ["Patna", "India"],
  ["Vadodara", "India"],
  ["Varanasi", "India"],
  ["Chandigarh", "India"],
  ["Thiruvananthapuram", "India"],
  ["Kochi", "India"],
  ["Coimbatore", "India"],
  ["Visakhapatnam", "India"],
  ["Guwahati", "India"],
  ["Shimla", "India"],
  ["Goa", "India"],
  ["Agra", "India"],
  ["Amritsar", "India"],
  ["Udaipur", "India"],
  ["Mysore", "India"],
  ["Venice", "Italy"],
  ["Florence", "Italy"],
  ["Edinburgh", "United Kingdom"],
  ["Manchester", "United Kingdom"],
  ["Birmingham", "United Kingdom"],
  ["Glasgow", "United Kingdom"],
  ["Liverpool", "United Kingdom"],
  ["Oxford", "United Kingdom"],
  ["Cambridge", "United Kingdom"],
  ["Nice", "France"],
  ["Cannes", "France"],
  ["Seville", "Spain"],
  ["Valencia", "Spain"],
  ["Porto", "Portugal"],
  ["Krakow", "Poland"],
  ["Bucharest", "Romania"],
  ["Sofia", "Bulgaria"],
  ["Belgrade", "Serbia"],
  ["Zagreb", "Croatia"],
  ["Sarajevo", "Bosnia and Herzegovina"],
  ["Reykjavik", "Iceland"],
  ["Marrakech", "Morocco"],
  ["Tunis", "Tunisia"],
  ["Dakar", "Senegal"],
  ["Abidjan", "Ivory Coast"],
  ["Kampala", "Uganda"],
  ["Kigali", "Rwanda"],
  ["Harare", "Zimbabwe"],
  ["Maputo", "Mozambique"],
  ["Port Louis", "Mauritius"],
  ["Male", "Maldives"],
  ["Bali", "Indonesia"],
  ["Surabaya", "Indonesia"],
  ["Bandung", "Indonesia"],
  ["Medan", "Indonesia"],
  ["Cebu", "Philippines"],
  ["Davao", "Philippines"],
  ["Chiang Mai", "Thailand"],
  ["Phuket", "Thailand"],
  ["Macau", "China"],
  ["Xiamen", "China"],
  ["Qingdao", "China"],
  ["Xi'an", "China"],
  ["Kunming", "China"],
  ["Dalian", "China"],
  ["Changsha", "China"],
  ["Zhengzhou", "China"],
  ["Jinan", "China"],
  ["Ningbo", "China"],
];

const seen = new Set();
const all = [];
for (let i = 0; i < POPULAR.length; i++) {
  const [name, country] = POPULAR[i];
  const key = `${name.toLowerCase()}|${country.toLowerCase()}`;
  if (seen.has(key)) continue;
  seen.add(key);
  all.push({
    name,
    country,
    nameNumber: nameNumber(name),
  });
}

const TARGET = 140;
const cities = all.slice(0, TARGET);
const present = new Set(cities.map((c) => c.nameNumber));
for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
  if (present.has(n)) continue;
  const filler = all.slice(TARGET).find((c) => c.nameNumber === n);
  if (!filler) {
    console.error(`Cannot cover name number ${n}`);
    process.exit(1);
  }
  cities.push(filler);
}

cities.forEach((c, i) => {
  c.rank = i + 1;
});

const dist = cities.reduce((m, c) => {
  m[c.nameNumber] = (m[c.nameNumber] || 0) + 1;
  return m;
}, {});

const missing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !dist[n]);
if (missing.length) {
  console.error("Missing name numbers:", missing, dist);
  process.exit(1);
}

const outPath = path.join(root, "src", "lib", "trivia", "cities.ts");
const header = `/** Popular world cities with Pythagorean-style name numbers for reflective trivia.
 * \`rank\` is familiarity order (1 = most widely recognized); used as tie-break in matching.
 */
export type TriviaCity = {
  name: string;
  country: string;
  nameNumber: number;
  /** Lower = more globally familiar (rough metro / recognition order). */
  rank: number;
};

export const TRIVIA_CITIES: TriviaCity[] = `;

fs.writeFileSync(outPath, header + JSON.stringify(cities, null, 2) + ";\n", "utf8");
console.log(`wrote ${cities.length} cities → ${outPath}`);
console.log("nameNumber distribution:", dist);
