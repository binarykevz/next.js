const fs = require('fs');
const { execSync } = require('child_process');

const files = {
  'src/app/page.tsx': `"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ background: "#160c07", minHeight: "100vh" }} />;
  return (
    <>
      <h1 style={{color:"lime",fontSize:"30px",position:"fixed",top:0,left:0,zIndex:99999,background:"black",padding:"10px"}}>BUILD V100 SAFE MODE</h1>
      {!ready && <AppLoader onReady={() => setReady(true)} />}
      <div id="appShell" className={ready ? "ready" : ""}>
        <SiteHeader />
        <main className="main-wrap"><ControlPanel /><MapShell /><JournalSection /></main>
        <Footer />
      </div>
      <Toast />
    </>
  );
}`,
  'src/components/AppLoader.tsx': `"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
export default function AppLoader({ onReady }) {
  const barRef = useRef(null);
  useEffect(() => { const tl = gsap.timeline({ onComplete: onReady }); tl.to(barRef.current, { width: "100%", duration: 3, ease: "none" }); return () => tl.kill(); }, [onReady]);
  return (<div id="appLoader"><div className="loader-parchment"><div className="loader-sigil"><div className="loader-ring" /><div className="loader-ring" /><div className="loader-ring" /><span className="loader-rune">✦</span><span className="loader-rune">✧</span><span className="loader-rune">✦</span><span className="loader-rune">✧</span><div className="loader-hourglass"><div className="loader-sand" /></div></div><h1 className="loader-title">The Great Voyage</h1><p className="loader-subtitle">Unfolding the mysteries...</p><div className="loader-progress"><div ref={barRef} className="loader-progress-bar" /></div><div className="loader-status">Consulting the old charts...</div></div></div>);
}`,
  'src/components/SiteHeader.tsx': `"use client";
export default function SiteHeader() { return (<header className="site-header"><div className="brand"><div className="brand-compass" /><div><h1 className="brand-title">The Great Voyage</h1><p className="brand-subtitle">Chronicles of an Ancient Adventurer</p></div></div></header>); }`,
  'src/components/MapShell.tsx': `"use client";
import dynamic from "next/dynamic";
import { useVoyageStore } from "@/lib/store";
import CountryDiscovery from "./CountryDiscovery";
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });
export default function MapShell() {
  const countriesCount = useVoyageStore((s) => s.countriesCount); const voyageCount = useVoyageStore((s) => s.voyageCount); const totalDistance = useVoyageStore((s) => s.totalDistance); const discoveryOpen = useVoyageStore((s) => s.discoveryOpen);
  return (<section className="map-shell"><LeafletMap /><div className="map-hud"><div className="hud-card"><span className="hud-label">Lands Charted</span><span className="hud-value">{countriesCount.toLocaleString()}</span></div><div className="hud-card"><span className="hud-label">Voyages</span><span className="hud-value">{voyageCount.toLocaleString()}</span></div><div className="hud-card"><span className="hud-label">Distance</span><span className="hud-value">{Math.round(totalDistance).toLocaleString()} km</span></div></div><div className="map-compass"><div className="compass-outer" /><div className="compass-middle" /><div className="compass-inner" /><span className="compass-letter compass-n">N</span><span className="compass-letter compass-e">E</span><span className="compass-letter compass-s">S</span><span className="compass-letter compass-w">W</span></div>{discoveryOpen && <CountryDiscovery />}</section>);
}`,
  'src/components/CountryDiscovery.tsx': `"use client";
import { useEffect, useRef } from "react";
import { useVoyageStore } from "@/lib/store";
import { mapActions } from "@/lib/mapActions";
export default function CountryDiscovery() {
  const ref = useRef(null); const { discoveryCountry, discoveryMedia, discoveryIndex, discoveryLatLng, closeDiscovery, nextMedia, prevMedia } = useVoyageStore(); const item = discoveryMedia[discoveryIndex];
  useEffect(() => { const el = ref.current; if (!el) return; const place = () => mapActions.positionDiscovery(el, discoveryLatLng); place(); const off = mapActions.onMapEvent(place); window.addEventListener("resize", place); return () => { off(); window.removeEventListener("resize", place); }; }, [discoveryLatLng]);
  return (<aside ref={ref} className="country-discovery"><div className="discovery-header"><h2 className="discovery-title">{discoveryCountry}</h2><button className="discovery-close" onClick={closeDiscovery}>×</button></div><div className="discovery-media-frame">{item ? (item.type === "video" ? <video src={item.url} controls playsInline /> : <img src={item.url} alt={item.title} />) : discoveryMedia.length === 0 ? (<div>✦ Summoning records ✦</div>) : (<div>No records found.</div>)}</div><div className="discovery-info"><h3>{item?.title ?? "Discovering..."}</h3><p>{item?.description || "Consulting..."}</p></div><div className="discovery-controls"><button onClick={prevMedia}>◀</button><button onClick={nextMedia}>▶</button></div></aside>);
}`,
  'src/components/JournalCard.tsx': `"use client";
const ROT = [-0.7, 0.55, -0.4, 0.8];
export default function JournalCard({ item, index }) {
  const rot = ROT[index % 4];
  return (<article className="journal-card" style={{transform: "rotate(" + rot + "deg)"}}><div className="journal-frame"><div className="journal-frame-rune" /><div className="journal-media">{item.type === "video" ? <video controls playsInline src={item.url} /> : <img src={item.url} alt={item.title} />}</div></div><div className="journal-meta"><h3>{item.title}</h3><p>{item.description || "A fragment..."}</p><span className="journal-type">{item.type === "video" ? "MOVING RECORD" : "ILLUSTRATED RECORD"}</span></div></article>);
}`
};

for (const [f, c] of Object.entries(files)) { fs.writeFileSync(f, c); console.log('✅ Stripped framer-motion from:', f); }
console.log('\n⏳ Pushing Safe Mode to GitHub...');
execSync('git add . && git commit -m "Safe Mode V100: Remove framer-motion to fix client crash" && git push origin main', { stdio: 'inherit' });
