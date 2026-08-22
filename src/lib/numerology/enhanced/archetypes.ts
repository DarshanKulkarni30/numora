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
      ? "This chart often comes back to learning from real experience."
      : theme === "leadership"
        ? "This chart often comes back to leading while staying responsible."
        : theme === "service"
          ? "This chart often comes back to care that stays useful."
          : theme === "structure"
            ? "This chart often comes back to turning ideas into something you can use."
            : theme === "freedom"
              ? "This chart often comes back to trying new things, then choosing a shape."
              : "This chart often comes back to saying what is inside in a clear way.";

  return { title, throughline };
}
