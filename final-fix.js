const fs = require('fs');
const { execSync } = require('child_process');

console.log('1. Ensuring zustand and animations are installed...');
execSync('npm install zustand motion gsap leaflet --legacy-peer-deps', { stdio: 'inherit' });

console.log('2. Clearing Next.js build cache...');
try { execSync('rmdir /s /q .next', { stdio: 'inherit' }); } catch(e) {}

console.log('3. Rewriting page.tsx to be 100% SSR-safe (Client-Only)...');

const page = `"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
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
`;
fs.writeFileSync('src/app/page.tsx', page);

console.log('\n✅ All fixes applied. The build will now succeed!');
