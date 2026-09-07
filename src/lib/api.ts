import { CONFIG, COUNTRY_API_ALIASES } from "./config";

export type CountryMedia = {
  url: string;
  title: string;
  description: string;
  type: "image" | "video";
};

function extractArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function inferType(item: any, requested: "image" | "video"): "image" | "video" {
  const raw = String(item?.type || item?.mimeType || "").toLowerCase();
  if (/video|mp4|webm|mov/.test(raw)) return "video";
  if (/image|jpg|jpeg|png|webp|gif/.test(raw)) return "image";
  const url = String(item?.url || item?.src || "").toLowerCase();
  if (/\.(mp4|webm|mov|m4v|avi)(\?|$)/i.test(url)) return "video";
  return requested;
}

function normalizeMedia(item: any, requested: "image" | "video"): CountryMedia | null {
  const url = item?.url || item?.downloadUrl || item?.src || item?.mediaUrl;
  if (!url) return null;
  return {
    url,
    title: item?.title || item?.name || "Untitled Expedition Record",
    description: item?.description || item?.caption || "",
    type: inferType(item, requested),
  };
}

export async function fetchCountryMedia(type: "image" | "video", countryName: string): Promise<CountryMedia[]> {
  const endpoint = type === "video" ? "/api/videos/random" : "/api/images/random";
  const apiCountry = COUNTRY_API_ALIASES[countryName] || countryName;
  const params = new URLSearchParams({
    limit: String(CONFIG.COUNTRY_MEDIA_LIMIT),
    country: apiCountry,
  });
  const res = await fetch(`${CONFIG.API_BASE}${endpoint}?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Media API ${res.status}`);
  const payload = await res.json();
  return extractArray(payload)
    .map((i) => normalizeMedia(i, type))
    .filter((m): m is CountryMedia => !!m);
}

export async function fetchJournalMedia(type: "image" | "video"): Promise<CountryMedia[]> {
  const endpoint = type === "video" ? "/api/videos/random" : "/api/images/random";
  const res = await fetch(`${CONFIG.API_BASE}${endpoint}?limit=${CONFIG.JOURNAL_LIMIT}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Journal API ${res.status}`);
  const payload = await res.json();
  return extractArray(payload)
    .map((i) => normalizeMedia(i, type))
    .filter((m): m is CountryMedia => !!m);
}

export function removeDuplicates(items: CountryMedia[]): CountryMedia[] {
  const seen = new Set<string>();
  return items.filter((m) => {
    if (seen.has(m.url)) return false;
    seen.add(m.url);
    return true;
  });
}
