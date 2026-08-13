/** Reflective color / weekday / stone associations by number (belief-based). */

export type NumberAssociations = {
  number: number;
  colors: { name: string; hex: string }[];
  weekdays: string[];
  stones: string[];
  metals: string[];
};

const BY_DIGIT: Record<number, Omit<NumberAssociations, "number">> = {
  1: {
    colors: [
      { name: "Gold", hex: "#D4A017" },
      { name: "Orange", hex: "#E67E22" },
      { name: "Amber", hex: "#F59E0B" },
    ],
    weekdays: ["Sunday"],
    stones: ["Ruby", "Garnet"],
    metals: ["Gold"],
  },
  2: {
    colors: [
      { name: "Cream", hex: "#F5F0E6" },
      { name: "Soft green", hex: "#A8C5A0" },
      { name: "Silver", hex: "#C0C0C0" },
    ],
    weekdays: ["Monday"],
    stones: ["Pearl", "Moonstone"],
    metals: ["Silver"],
  },
  3: {
    colors: [
      { name: "Yellow", hex: "#E8C547" },
      { name: "Rose", hex: "#E8A0BF" },
      { name: "Sky blue", hex: "#7EB8D4" },
    ],
    weekdays: ["Thursday"],
    stones: ["Yellow sapphire", "Citrine"],
    metals: ["Gold"],
  },
  4: {
    colors: [
      { name: "Blue-grey", hex: "#6B7C8C" },
      { name: "Earth brown", hex: "#8B6914" },
    ],
    weekdays: ["Saturday"],
    stones: ["Hessonite", "Cat’s eye"],
    metals: ["Iron"],
  },
  5: {
    colors: [
      { name: "Light green", hex: "#8FBC8F" },
      { name: "Turquoise", hex: "#40E0D0" },
      { name: "Grey", hex: "#9CA3AF" },
    ],
    weekdays: ["Wednesday"],
    stones: ["Emerald", "Peridot"],
    metals: ["Bronze"],
  },
  6: {
    colors: [
      { name: "White", hex: "#F8F6F0" },
      { name: "Light blue", hex: "#B8D4E8" },
      { name: "Pink", hex: "#F2C4CE" },
    ],
    weekdays: ["Friday"],
    stones: ["Diamond", "White sapphire"],
    metals: ["Silver", "Platinum"],
  },
  7: {
    colors: [
      { name: "Sea green", hex: "#2E8B57" },
      { name: "Indigo", hex: "#4B0082" },
    ],
    weekdays: ["Thursday", "Saturday"],
    stones: ["Cat’s eye", "Amethyst"],
    metals: ["Silver"],
  },
  8: {
    colors: [
      { name: "Dark blue", hex: "#1E3A5F" },
      { name: "Black", hex: "#1A1A1A" },
      { name: "Purple", hex: "#5B4B8A" },
    ],
    weekdays: ["Saturday"],
    stones: ["Blue sapphire", "Amethyst"],
    metals: ["Iron", "Steel"],
  },
  9: {
    colors: [
      { name: "Red", hex: "#B91C1C" },
      { name: "Coral", hex: "#E07A5F" },
    ],
    weekdays: ["Tuesday"],
    stones: ["Red coral", "Carnelian"],
    metals: ["Copper"],
  },
};

function reduceKey(n: number): number {
  if (n === 11 || n === 22 || n === 33) {
    return n
      .toString()
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  if (n >= 1 && n <= 9) return n;
  let x = Math.abs(Math.trunc(n));
  while (x > 9) {
    x = x
      .toString()
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return x || 1;
}

export function associationsForNumber(n: number | string): NumberAssociations {
  const num = Number(n);
  const digit = reduceKey(Number.isFinite(num) ? num : 1);
  const base = BY_DIGIT[digit] ?? BY_DIGIT[1];
  return { number: digit, ...base };
}
