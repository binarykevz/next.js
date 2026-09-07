import {
  CONFIG,
  getCountryApiName,
} from "./config";

export type MediaType =
  | "image"
  | "video";

export interface ExpeditionMedia {
  url: string;
  title: string;
  description: string;
  type: MediaType;
}

function extractMediaArray(
  payload: unknown
): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (
    payload &&
    typeof payload === "object"
  ) {
    const data =
      payload as Record<string, unknown>;

    if (Array.isArray(data.data)) {
      return data.data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    if (Array.isArray(data.items)) {
      return data.items;
    }
  }

  return [];
}

function inferMediaType(
  item: Record<string, unknown>,
  requested: MediaType
): MediaType {
  const rawType = String(
    item.type ??
      item.mimeType ??
      ""
  ).toLowerCase();

  if (
    rawType.includes("video") ||
    rawType.includes("mp4") ||
    rawType.includes("webm") ||
    rawType.includes("mov")
  ) {
    return "video";
  }

  const url = String(
    item.url ??
      item.src ??
      ""
  ).toLowerCase();

  if (
    /\.(mp4|webm|mov|m4v|avi)(\?|$)/i.test(
      url
    )
  ) {
    return "video";
  }

  return requested;
}

function normalizeMedia(
  item: unknown,
  requested: MediaType
): ExpeditionMedia | null {
  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }

  const value =
    item as Record<string, unknown>;

  const url =
    value.url ??
    value.downloadUrl ??
    value.src ??
    value.mediaUrl ??
    value.fileUrl;

  if (!url) {
    return null;
  }

  return {
    url: String(url),

    title: String(
      value.title ??
        value.name ??
        value.originalFilename ??
        value.filename ??
        "Untitled Expedition Record"
    ),

    description: String(
      value.description ??
        value.caption ??
        ""
    ),

    type: inferMediaType(
      value,
      requested
    ),
  };
}

function removeDuplicates(
  media: ExpeditionMedia[]
) {
  const seen = new Set<string>();

  return media.filter((item) => {
    if (seen.has(item.url)) {
      return false;
    }

    seen.add(item.url);

    return true;
  });
}

export async function fetchMedia(
  type: MediaType,
  country?: string,
  limit = CONFIG.JOURNAL_LIMIT
) {
  const endpoint =
    type === "video"
      ? "/api/videos/random"
      : "/api/images/random";

  const params =
    new URLSearchParams();

  params.set(
    "limit",
    String(limit)
  );

  if (country) {
    params.set(
      "country",
      getCountryApiName(country)
    );
  }

  const response =
    await fetch(
      `${CONFIG.API_BASE}${endpoint}?${params.toString()}`,
      {
        cache: "no-store",
      }
    );

  if (!response.ok) {
    throw new Error(
      `Media API returned ${response.status}`
    );
  }

  const payload =
    await response.json();

  const media =
    extractMediaArray(payload)
      .map((item) =>
        normalizeMedia(
          item,
          type
        )
      )
      .filter(
        (
          item
        ): item is ExpeditionMedia =>
          Boolean(item)
      );

  return removeDuplicates(media);
}

export async function fetchJournalMedia() {
  const results =
    await Promise.allSettled([
      fetchMedia("image"),
      fetchMedia("video"),
    ]);

  const media: ExpeditionMedia[] = [];

  for (const result of results) {
    if (
      result.status ===
      "fulfilled"
    ) {
      media.push(
        ...result.value
      );
    }
  }

  return removeDuplicates(media).slice(
    0,
    CONFIG.JOURNAL_LIMIT
  );
}
