const fs = require('fs');
const path = require('path');

const files = {
  'src/app/page.tsx': `"use client";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
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
  return (<><AnimatePresence>{!ready && <AppLoader onReady={() => setReady(true)} />}</AnimatePresence><div id="appShell" className={ready ? "ready" : ""}><SiteHeader /><main className="main-wrap"><ControlPanel /><MapShell /><JournalSection /></main><Footer /></div><Toast /></>);
}`,
  'src/components/AppLoader.tsx': `"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
export default function AppLoader({ onReady }) {
  const barRef = useRef(null);
  useEffect(() => { const tl = gsap.timeline({ onComplete: onReady }); tl.to(barRef.current, { width: "100%", duration: 3, ease: "none" }); return () => tl.kill(); }, [onReady]);
  return (<motion.div id="appLoader" exit={{ opacity: 0 }} transition={{ duration: 0.9 }}><div className="loader-parchment"><div className="loader-sigil"><div className="loader-ring" /><div className="loader-ring" /><div className="loader-ring" /><span className="loader-rune">✦</span><span className="loader-rune">✧</span><span className="loader-rune">✦</span><span className="loader-rune">✧</span><div className="loader-hourglass"><div className="loader-sand" /></div></div><h1 className="loader-title">The Great Voyage</h1><p className="loader-subtitle">Unfolding the mysteries...</p><div className="loader-progress"><div ref={barRef} className="loader-progress-bar" /></div><div className="loader-status">Consulting the old charts...</div></div></motion.div>);
}`,
  'src/components/SiteHeader.tsx': `"use client";
import { motion } from "framer-motion";
export default function SiteHeader() { return (<motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="site-header"><div className="brand"><div className="brand-compass" /><div><h1 className="brand-title">The Great Voyage</h1><p className="brand-subtitle">Chronicles of an Ancient Adventurer</p></div></div></motion.header>); }`,
  'src/components/MapShell.tsx': `"use client";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useVoyageStore } from "@/lib/store";
import CountryDiscovery from "./CountryDiscovery";
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });
export default function MapShell() {
  const countriesCount = useVoyageStore((s) => s.countriesCount); const voyageCount = useVoyageStore((s) => s.voyageCount); const totalDistance = useVoyageStore((s) => s.totalDistance); const discoveryOpen = useVoyageStore((s) => s.discoveryOpen);
  return (<section className="map-shell"><LeafletMap /><div className="map-hud"><div className="hud-card"><span className="hud-label">Lands Charted</span><span className="hud-value">{countriesCount.toLocaleString()}</span></div><div className="hud-card"><span className="hud-label">Voyages</span><span className="hud-value">{voyageCount.toLocaleString()}</span></div><div className="hud-card"><span className="hud-label">Distance</span><span className="hud-value">{Math.round(totalDistance).toLocaleString()} km</span></div></div><div className="map-compass"><div className="compass-outer" /><div className="compass-middle" /><div className="compass-inner" /><span className="compass-letter compass-n">N</span><span className="compass-letter compass-e">E</span><span className="compass-letter compass-s">S</span><span className="compass-letter compass-w">W</span></div><AnimatePresence>{discoveryOpen && <CountryDiscovery />}</AnimatePresence></section>);
}`,
  'src/components/CountryDiscovery.tsx': `"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useVoyageStore } from "@/lib/store";
import { mapActions } from "@/lib/mapActions";
export default function CountryDiscovery() {
  const ref = useRef(null); const { discoveryCountry, discoveryMedia, discoveryIndex, discoveryLatLng, closeDiscovery, nextMedia, prevMedia } = useVoyageStore(); const item = discoveryMedia[discoveryIndex];
  useEffect(() => { const el = ref.current; if (!el) return; const place = () => mapActions.positionDiscovery(el, discoveryLatLng); place(); const off = mapActions.onMapEvent(place); window.addEventListener("resize", place); return () => { off(); window.removeEventListener("resize", place); }; }, [discoveryLatLng]);
  return (<motion.aside ref={ref} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }} className="country-discovery"><div className="discovery-header"><h2 className="discovery-title">{discoveryCountry}</h2><button className="discovery-close" onClick={closeDiscovery}>×</button></div><div className="discovery-media-frame">{item ? (item.type === "video" ? <video src={item.url} controls playsInline /> : <img src={item.url} alt={item.title} />) : discoveryMedia.length === 0 ? (<div>✦ Summoning records ✦</div>) : (<div>No records found.</div>)}</div><div className="discovery-info"><h3>{item?.title ?? "Discovering..."}</h3><p>{item?.description || "Consulting..."}</p></div><div className="discovery-controls"><button onClick={prevMedia}>◀</button><button onClick={nextMedia}>▶</button></div></motion.aside>);
}`,
  'src/components/JournalCard.tsx': `"use client";
import { motion } from "framer-motion";
const ROT = [-0.7, 0.55, -0.4, 0.8];
export default function JournalCard({ item, index }) {
  const rot = ROT[index % 4];
  return (<motion.article initial={{ opacity: 0, y: 35, rotate: rot, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, rotate: rot, scale: 1 }} whileHover={{ y: -9, rotate: 0, scale: 1.015 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: (index % 4) * 0.07 }} className="journal-card"><div className="journal-frame"><div className="journal-frame-rune" /><div className="journal-media">{item.type === "video" ? <video controls playsInline src={item.url} /> : <img src={item.url} alt={item.title} />}</div></div><div className="journal-meta"><h3>{item.title}</h3><p>{item.description || "A fragment..."}</p><span className="journal-type">{item.type === "video" ? "MOVING RECORD" : "ILLUSTRATED RECORD"}</span></div></motion.article>);
}`
};

for (const [filePath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log('Overwrote:', filePath);
}
console.log('\n✅ All animation files overwritten with framer-motion!');
