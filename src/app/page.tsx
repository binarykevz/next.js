"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Force Next.js to ONLY render these in the browser (skips server prerender crash)
const AppLoader = dynamic(() => import("@/components/AppLoader"), { ssr: false });
const SiteHeader = dynamic(() => import("@/components/SiteHeader"), { ssr: false });
const ControlPanel = dynamic(() => import("@/components/ControlPanel"), { ssr: false });
const MapShell = dynamic(() => import("@/components/MapShell"), { ssr: false });
const JournalSection = dynamic(() => import("@/components/JournalSection"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Toast = dynamic(() => import("@/components/Toast"), { ssr: false });

export default function Home() {
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleKey = async (e) => {
      const { useVoyageStore } = await import("@/lib/store");
      const st = useVoyageStore.getState();
      const tag = (document.activeElement?.tagName ?? "").toLowerCase();
      if (tag === "input" || tag === "textarea") { if (e.key === "Escape") document.activeElement?.blur(); return; }
      if (e.key === "/") { e.preventDefault(); document.getElementById("countrySearch")?.focus(); }
      else if (e.key === "Escape") st.closeDiscovery();
      else if (e.key === "ArrowLeft") st.prevMedia();
      else if (e.key === "ArrowRight") st.nextMedia();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Return empty dark background during server build
  if (!mounted) return <div style={{ background: '#160c07', minHeight: '100vh' }} />;

  return (
    <>
      <AnimatePresence>{!ready && <AppLoader onReady={() => setReady(true)} />}</AnimatePresence>
      <div id="appShell" className={ready ? "ready" : ""}>
        <SiteHeader />
        <main className="main-wrap"><ControlPanel /><MapShell /><JournalSection /></main>
        <Footer />
      </div>
      <Toast />
    </>
  );
}
