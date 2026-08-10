/**
 * Wikipedia Commons orthographic locator maps (green-on-globe style),
 * via Special:Redirect/file — same family as Wikipedia “location” maps.
 */

/** ISO2 → Commons filename when it differs from "{Name}_(orthographic_projection).svg" */
const WIKI_MAP_FILE_BY_ISO: Record<string, string> = {
  ae: "United_Arab_Emirates_(orthographic_projection).svg",
  cd: "Democratic_Republic_of_the_Congo_(orthographic_projection).svg",
  cg: "Republic_of_the_Congo_(orthographic_projection).svg",
  ci: "Côte_d'Ivoire_(orthographic_projection).svg",
  cz: "Czech_Republic_(orthographic_projection).svg",
  gb: "United_Kingdom_(orthographic_projection).svg",
  kp: "North_Korea_(orthographic_projection).svg",
  kr: "South_Korea_(orthographic_projection).svg",
  la: "Laos_(orthographic_projection).svg",
  mk: "North_Macedonia_(orthographic_projection).svg",
  mm: "Myanmar_(orthographic_projection).svg",
  ru: "Russia_(orthographic_projection).svg",
  sy: "Syria_(orthographic_projection).svg",
  tl: "East_Timor_(orthographic_projection).svg",
  us: "United_States_(orthographic_projection).svg",
  va: "Vatican_City_(orthographic_projection).svg",
  vn: "Vietnam_(orthographic_projection).svg",
  sz: "Eswatini_(orthographic_projection).svg",
  cv: "Cape_Verde_(orthographic_projection).svg",
  fm: "Federated_States_of_Micronesia_(orthographic_projection).svg",
  st: "São_Tomé_and_Príncipe_(orthographic_projection).svg",
  bq: "Caribbean_Netherlands_(orthographic_projection).svg",
};

function defaultFileFromName(name: string): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `${slug}_(orthographic_projection).svg`;
}

export function wikiOrthographicMapUrl(
  name: string,
  iso2: string,
  width = 200,
): string {
  const file =
    WIKI_MAP_FILE_BY_ISO[iso2.toLowerCase()] ?? defaultFileFromName(name);
  return `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(file)}&width=${width}`;
}
