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
      ? "In plain terms: you work things out by living through them rather than by being told. That makes your conclusions well tested and slow to arrive. Watch the point where researching becomes a way of not deciding."
      : theme === "leadership"
        ? "In plain terms: you end up in charge, and you take the consequences seriously rather than passing them on. That earns trust and quietly loads you up. Watch carrying decisions that were never actually yours."
        : theme === "service"
          ? "In plain terms: people bring you their problems because you deal with them properly. The skill worth building is helping with a stated limit, so that being useful does not become being available to everyone."
          : theme === "structure"
            ? "In plain terms: you are the one who turns a loose idea into something that actually runs — a plan, a system, a finished thing. Watch refusing to start until the plan is perfect."
            : theme === "freedom"
              ? "In plain terms: you learn by trying things, and you need room to change your mind. The useful discipline is finishing one of the experiments before starting the next three."
              : "In plain terms: you are good at putting into words what other people only half feel. Watch starting many conversations, pieces or projects and completing none of them.";

  return { title, throughline };
}
