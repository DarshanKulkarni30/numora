import type { ThemeFamilyId, ThemeHit } from "./themeGraph";

const BY_THEME: Record<ThemeFamilyId, string> = {
  wisdom: "The Quiet Seeker",
  leadership: "The Steady Steward",
  service: "The Careful Harmoniser",
  structure: "The Pattern Builder",
  freedom: "The Adaptive Scout",
  expression: "The Voice of Completion",
};

/** Numora-original archetype from dominant theme + Life Path core. */
export function archetypeFor(opts: {
  dominant: ThemeHit | null;
  lifePath: number;
  hasStructure: boolean;
}): { title: string; throughline: string } {
  const { dominant, lifePath, hasStructure } = opts;
  const theme = dominant?.id ?? "wisdom";
  let title = BY_THEME[theme];

  if (theme === "wisdom" && hasStructure) {
    title = "The Wise Strategist";
  } else if (theme === "wisdom" && (lifePath === 8 || lifePath === 1)) {
    title = "The Insightful Director";
  } else if (theme === "leadership" && (lifePath === 4 || lifePath === 22)) {
    title = "The Practical Commander";
  } else if (theme === "service" && (lifePath === 7 || lifePath === 11)) {
    title = "The Thoughtful Guardian";
  } else if (theme === "structure" && (lifePath === 7 || lifePath === 11)) {
    title = "The Wise Strategist";
  } else if (theme === "freedom" && (lifePath === 4 || lifePath === 8)) {
    title = "The Grounded Explorer";
  }

  const throughline =
    theme === "wisdom"
      ? "The repeated theme throughout this profile is understanding earned through disciplined experience."
      : theme === "leadership"
        ? "The repeated theme throughout this profile is direction held with responsibility."
        : theme === "service"
          ? "The repeated theme throughout this profile is care that stays practical."
          : theme === "structure"
            ? "The repeated theme throughout this profile is making insight usable."
            : theme === "freedom"
              ? "The repeated theme throughout this profile is learning through movement, then choosing a form."
              : "The repeated theme throughout this profile is giving inner life a clear voice.";

  return { title, throughline };
}
