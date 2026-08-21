import type { ThemeHit } from "./themeGraph";
import { THEME_FAMILIES, type ThemeFamilyId } from "./themeGraph";

export type RadarAxis = {
  id: ThemeFamilyId;
  label: string;
  count: number;
};

/** Chart-presence radar from theme counts — not percentages of personality. */
export function buildRadarAxes(themes: ThemeHit[]): RadarAxis[] {
  return THEME_FAMILIES.map((f) => ({
    id: f.id,
    label: f.label,
    count: themes.find((t) => t.id === f.id)?.count ?? 0,
  }));
}
