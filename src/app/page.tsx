"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import SiteHeader from "@/components/SiteHeader";
import AppLoader from "@/components/AppLoader";
import ControlPanel from "@/components/ControlPanel";
import MapShell from "@/components/MapShell";
import JournalSection from "@/components/JournalSection";
import CountryDiscovery from "@/components/CountryDiscovery";
import Footer from "@/components/Footer";
import { useVoyageStore } from "@/lib/store";

export default function Home() {
  const [ready, setReady] = useState(false);
  const discoveryOpen = useVoyageStore((s) => s.discoveryOpen);

  useEffect(() => {
    // Minimum cinematic loader duration
    const start = performance.now();
    const minDuration = 3000;
    return () => {};
  }, []);

  return (
    <>
      <AnimatePresence>
        {!ready && <AppLoader onReady={() => setReady(true)} />}
      </AnimatePresence>

      <div className={`min-h-screen transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
           style={{ transitionTimingFunction: "var(--ease)" }}>
        <SiteHeader />
        <main className="w-full max-w-[1700px] mx-auto px-6 md:px-8 pt-8 pb-20">
          <ControlPanel />
          <MapShell />
          <JournalSection />
        </main>
        <Footer />
      </div>

      <AnimatePresence>{discoveryOpen && <CountryDiscovery />}</AnimatePresence>
    </>
  );
}
