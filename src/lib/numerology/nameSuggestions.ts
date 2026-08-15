/** Curated first names for reflective name-fit suggestions (not legal naming advice). */

export type SuggestedNameGender = "female" | "male" | "unisex";

export type SuggestedName = {
  name: string;
  gender: SuggestedNameGender;
  note?: string;
};

/** Short bank: Indian + widely used international first names. */
export const SUGGESTED_NAMES: SuggestedName[] = [
  // Female
  { name: "Aanya", gender: "female" },
  { name: "Aditi", gender: "female" },
  { name: "Aisha", gender: "female" },
  { name: "Amara", gender: "female" },
  { name: "Ananya", gender: "female" },
  { name: "Anika", gender: "female" },
  { name: "Aria", gender: "female" },
  { name: "Avni", gender: "female" },
  { name: "Diya", gender: "female" },
  { name: "Elena", gender: "female" },
  { name: "Emma", gender: "female" },
  { name: "Fatima", gender: "female" },
  { name: "Gauri", gender: "female" },
  { name: "Isha", gender: "female" },
  { name: "Ishita", gender: "female" },
  { name: "Jia", gender: "female" },
  { name: "Kavya", gender: "female" },
  { name: "Kiara", gender: "female" },
  { name: "Lara", gender: "female" },
  { name: "Leela", gender: "female" },
  { name: "Maya", gender: "female" },
  { name: "Meera", gender: "female" },
  { name: "Mira", gender: "female" },
  { name: "Myra", gender: "female" },
  { name: "Naina", gender: "female" },
  { name: "Nisha", gender: "female" },
  { name: "Noor", gender: "female" },
  { name: "Olivia", gender: "female" },
  { name: "Priya", gender: "female" },
  { name: "Radha", gender: "female" },
  { name: "Riya", gender: "female" },
  { name: "Roshni", gender: "female" },
  { name: "Saanvi", gender: "female" },
  { name: "Sara", gender: "female" },
  { name: "Shreya", gender: "female" },
  { name: "Sia", gender: "female" },
  { name: "Sofia", gender: "female" },
  { name: "Suhana", gender: "female" },
  { name: "Tara", gender: "female" },
  { name: "Zara", gender: "female" },
  // Male
  { name: "Aarav", gender: "male" },
  { name: "Aditya", gender: "male" },
  { name: "Aryan", gender: "male" },
  { name: "Dev", gender: "male" },
  { name: "Dhruv", gender: "male" },
  { name: "Ethan", gender: "male" },
  { name: "Farhan", gender: "male" },
  { name: "Harry", gender: "male" },
  { name: "Imran", gender: "male" },
  { name: "Ishaan", gender: "male" },
  { name: "Kabir", gender: "male" },
  { name: "Kai", gender: "male" },
  { name: "Kian", gender: "male" },
  { name: "Krish", gender: "male" },
  { name: "Leo", gender: "male" },
  { name: "Liam", gender: "male" },
  { name: "Milan", gender: "male" },
  { name: "Neil", gender: "male" },
  { name: "Noah", gender: "male" },
  { name: "Omar", gender: "male" },
  { name: "Rahul", gender: "male" },
  { name: "Raj", gender: "male" },
  { name: "Reyansh", gender: "male" },
  { name: "Rohan", gender: "male" },
  { name: "Ryan", gender: "male" },
  { name: "Sam", gender: "male" },
  { name: "Shaurya", gender: "male" },
  { name: "Siddharth", gender: "male" },
  { name: "Vihaan", gender: "male" },
  { name: "Vivaan", gender: "male" },
  { name: "Yash", gender: "male" },
  { name: "Zayn", gender: "male" },
  // Unisex
  { name: "Alex", gender: "unisex" },
  { name: "Avery", gender: "unisex" },
  { name: "Blake", gender: "unisex" },
  { name: "Casey", gender: "unisex" },
  { name: "Jordan", gender: "unisex" },
  { name: "Kiran", gender: "unisex" },
  { name: "Morgan", gender: "unisex" },
  { name: "Quinn", gender: "unisex" },
  { name: "Reese", gender: "unisex" },
  { name: "Robin", gender: "unisex" },
  { name: "Samir", gender: "unisex" },
  { name: "Sky", gender: "unisex" },
];

export function gendersForProfile(gender: string): SuggestedNameGender[] {
  const g = gender.trim().toLowerCase();
  if (g === "female") return ["female", "unisex"];
  if (g === "male") return ["male", "unisex"];
  return ["female", "male", "unisex"];
}
