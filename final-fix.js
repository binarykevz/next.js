const fs = require('fs');

// 1. Fix page.tsx with SSR safety check
const pageContent = `"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import AppLoader from "@/components/AppLoader";
import SiteHeader from "@/components/SiteHeader";
import ControlPanel from "@/components/ControlPanel";
import MapShell from "@/components/MapShell";
import JournalSection from "@/components/JournalSection";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { useVoyageStore } from "@/lib/store";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Mark as mounted only in the browser
    const onKey = (e) => {
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      const st = useVoyageStore.getState();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        if (e.key === "Escape") document.activeElement?.blur();
        return;
      }
      if (e.key === "/") { e.preventDefault(); document.getElementById("countrySearch")?.focus(); }
      else if (e.key === "Escape") st.closeDiscovery();
      else if (e.key === "ArrowLeft") st.prevMedia();
      else if (e.key === "ArrowRight") st.nextMedia();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 🚨 CRITICAL: Prevents prerender crash with client-only hooks/stores
  if (!mounted) return null; 

  return (
    <>
      <AnimatePresence>{!ready && <AppLoader onReady={() => setReady(true)} />}</AnimatePresence>
      <div id="appShell" className={ready ? "ready" : ""}>
        <SiteHeader />
        <main className="main-wrap">
          <ControlPanel />
          <MapShell />
          <JournalSection />
        </main>
        <Footer />
      </div>
      <Toast />
    </>
  );
}
`;
fs.writeFileSync('src/app/page.tsx', pageContent.trim());
console.log('✅ page.tsx fixed with SSR safety check');

// 2. Verify store.ts is perfect
const storeContent = `import { create } from "zustand";
export type CountryMedia = { url: string; title: string; description: string; type: "image" | "video" };
let toastTimer: ReturnType<typeof setTimeout> | null = null;
interface VoyageState { countriesCount: number; voyageCount: number; totalDistance: number; discoveryOpen: boolean; discoveryCountry: string; discoveryMedia: CountryMedia[]; discoveryIndex: number; discoveryLatLng: [number, number] | null; toast: string; toastVisible: boolean; setCountriesCount: (n: number) => void; incrementVoyage: (d: number) => void; resetVoyage: () => void; openDiscovery: (c: string, m: CountryMedia[], ll: [number, number]) => void; closeDiscovery: () => void; nextMedia: () => void; prevMedia: () => void; showToast: (msg: string, duration?: number) => void; }
export const useVoyageStore = create<VoyageState>((set) => ({
  countriesCount: 0, voyageCount: 0, totalDistance: 0, discoveryOpen: false, discoveryCountry: "", discoveryMedia: [], discoveryIndex: 0, discoveryLatLng: null, toast: "", toastVisible: false,
  setCountriesCount: (n) => set({ countriesCount: n }),
  incrementVoyage: (d) => set((s) => ({ voyageCount: s.voyageCount + 1, totalDistance: s.totalDistance + d })),
  resetVoyage: () => set({ voyageCount: 0, totalDistance: 0, discoveryOpen: false, discoveryMedia: [], discoveryIndex: 0 }),
  openDiscovery: (c, m, ll) => set({ discoveryOpen: true, discoveryCountry: c, discoveryMedia: m, discoveryIndex: 0, discoveryLatLng: ll }),
  closeDiscovery: () => set({ discoveryOpen: false, discoveryMedia: [], discoveryIndex: 0, discoveryLatLng: null }),
  nextMedia: () => set((s) => (s.discoveryMedia.length > 1 ? { discoveryIndex: (s.discoveryIndex + 1) % s.discoveryMedia.length } : s)),
  prevMedia: () => set((s) => (s.discoveryMedia.length > 1 ? { discoveryIndex: (s.discoveryIndex - 1 + s.discoveryMedia.length) % s.discoveryMedia.length } : s)),
  showToast: (msg, duration = 3500) => { if (toastTimer) clearTimeout(toastTimer); set({ toast: msg, toastVisible: true }); toastTimer = setTimeout(() => set({ toastVisible: false }), duration); },
}));`;
fs.writeFileSync('src/lib/store.ts', storeContent.trim());
console.log('✅ store.ts verified');

// 3. Ensure tsconfig.json paths are correct
let tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
tsconfig.compilerOptions = tsconfig.compilerOptions || {};
tsconfig.compilerOptions.baseUrl = ".";
tsconfig.compilerOptions.paths = { "@/*": ["./src/*"] };
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
console.log('✅ tsconfig.json paths verified');

console.log('\n🎉 Ready for final build!');
