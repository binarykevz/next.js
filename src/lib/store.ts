import { create } from "zustand";
import type { LatLngExpression } from "leaflet";

interface CountryMedia {
  url: string;
  title: string;
  description: string;
  type: "image" | "video";
}

interface VoyageState {
  countriesCount: number;
  voyageCount: number;
  totalDistance: number;
  selectedCountry: string | null;
  discoveryOpen: boolean;
  discoveryCountry: string;
  discoveryMedia: CountryMedia[];
  discoveryIndex: number;
  discoveryLatLng: LatLngExpression | null;

  setCountriesCount: (n: number) => void;
  incrementVoyage: (distance: number) => void;
  resetVoyage: () => void;
  openDiscovery: (country: string, media: CountryMedia[], latlng: LatLngExpression) => void;
  closeDiscovery: () => void;
  nextMedia: () => void;
  prevMedia: () => void;
  setSelectedCountry: (name: string | null) => void;
}

export const useVoyageStore = create<VoyageState>((set) => ({
  countriesCount: 0,
  voyageCount: 0,
  totalDistance: 0,
  selectedCountry: null,
  discoveryOpen: false,
  discoveryCountry: "",
  discoveryMedia: [],
  discoveryIndex: 0,
  discoveryLatLng: null,

  setCountriesCount: (n) => set({ countriesCount: n }),
  incrementVoyage: (distance) =>
    set((s) => ({
      voyageCount: s.voyageCount + 1,
      totalDistance: s.totalDistance + distance,
    })),
  resetVoyage: () =>
    set({
      voyageCount: 0,
      totalDistance: 0,
      selectedCountry: null,
      discoveryOpen: false,
    }),
  openDiscovery: (country, media, latlng) =>
    set({
      discoveryOpen: true,
      discoveryCountry: country,
      discoveryMedia: media,
      discoveryIndex: 0,
      discoveryLatLng: latlng,
    }),
  closeDiscovery: () => set({ discoveryOpen: false, discoveryMedia: [], discoveryIndex: 0 }),
  nextMedia: () =>
    set((s) =>
      s.discoveryMedia.length > 1
        ? { discoveryIndex: (s.discoveryIndex + 1) % s.discoveryMedia.length }
        : s
    ),
  prevMedia: () =>
    set((s) =>
      s.discoveryMedia.length > 1
        ? { discoveryIndex: (s.discoveryIndex - 1 + s.discoveryMedia.length) % s.discoveryMedia.length }
        : s
    ),
  setSelectedCountry: (name) => set({ selectedCountry: name }),
}));
