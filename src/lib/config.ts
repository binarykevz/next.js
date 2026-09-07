export const CONFIG = {
  GEOJSON_URL: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
  GEOJSON_FALLBACK_URL: "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson",
  API_BASE: "https://media-api.markmykevin.workers.dev",
  MAP_CENTER: [20, 0] as [number, number],
  INITIAL_ZOOM: 2,
  MIN_ZOOM: 1,
  MAX_ZOOM: 6,
  SHIP_SPEED: 7000,
  JOURNAL_LIMIT: 8,
  COUNTRY_MEDIA_LIMIT: 8,
  LOADER_DURATION: 3000,
};

export const COUNTRY_API_ALIASES: Record<string, string> = {
  "United States of America": "United States",
  "Russian Federation": "Russia",
  "Viet Nam": "Vietnam",
  "Türkiye": "Turkey",
  "Czechia": "Czech Republic",
  "Korea, Republic of": "South Korea",
};
