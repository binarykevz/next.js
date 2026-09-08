const fs = require('fs');
const { execSync } = require('child_process');

const files = {
  'src/components/AppLoader.tsx': `
"use client";
export default function AppLoader({ onReady }) {
  setTimeout(() => onReady(), 3000);
  return (
    <div id="appLoader">
      <div className="loader-parchment">
        <div className="loader-sigil">
          <div className="loader-ring" /><div className="loader-ring" /><div className="loader-ring" />
          <span className="loader-rune">✦</span><span className="loader-rune">✧</span>
          <span className="loader-rune">✦</span><span className="loader-rune">✧</span>
          <div className="loader-hourglass"><div className="loader-sand" /></div>
        </div>
        <h1 className="loader-title">The Great Voyage</h1>
        <p className="loader-subtitle">Unfolding the mysteries...</p>
        <div className="loader-progress"><div className="loader-progress-bar" /></div>
        <div className="loader-status">Consulting the old charts...</div>
      </div>
    </div>
  );
}`,
  'src/components/SiteHeader.tsx': `
"use client";
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="brand">
        <div className="brand-compass" />
        <div>
          <h1 className="brand-title">The Great Voyage</h1>
          <p className="brand-subtitle">Chronicles of an Ancient Adventurer</p>
        </div>
      </div>
    </header>
  );
}`,
  'src/components/MapShell.tsx': `
"use client";
import dynamic from "next/dynamic";
import { useVoyageStore } from "@/lib/store";
import CountryDiscovery from "./CountryDiscovery";
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });
export default function MapShell() {
  const { countriesCount, voyageCount, totalDistance, discoveryOpen } = useVoyageStore();
  return (
    <section className="map-shell">
      <LeafletMap />
      <div className="map-hud">
        <div className="hud-card"><span className="hud-label">Lands Charted</span><span className="hud-value">{countriesCount.toLocaleString()}</span></div>
        <div className="hud-card"><span className="hud-label">Voyages</span><span className="hud-value">{voyageCount.toLocaleString()}</span></div>
        <div className="hud-card"><span className="hud-label">Distance</span><span className="hud-value">{Math.round(totalDistance).toLocaleString()} km</span></div>
      </div>
      <div className="map-compass">
        <div className="compass-outer" /><div className="compass-middle" /><div className="compass-inner" />
        <span className="compass-letter compass-n">N</span><span className="compass-letter compass-e">E</span>
        <span className="compass-letter compass-s">S</span><span className="compass-letter compass-w">W</span>
      </div>
      {discoveryOpen && <CountryDiscovery />}
    </section>
  );
}`,
  'src/components/CountryDiscovery.tsx': `
"use client";
import { useEffect, useRef } from "react";
import { useVoyageStore } from "@/lib/store";
import { mapActions } from "@/lib/mapActions";
export default function CountryDiscovery() {
  const ref = useRef(null);
  const { discoveryCountry, discoveryMedia, discoveryIndex, discoveryLatLng, closeDiscovery, nextMedia, prevMedia } = useVoyageStore();
  const item = discoveryMedia[discoveryIndex];
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const place = () => mapActions.positionDiscovery(el, discoveryLatLng);
    place();
    const off = mapActions.onMapEvent(place);
    window.addEventListener("resize", place);
    return () => { off(); window.removeEventListener("resize", place); };
  }, [discoveryLatLng]);
  return (
    <aside ref={ref} className="country-discovery open">
      <div className="discovery-header">
        <h2 className="discovery-title">{discoveryCountry}</h2>
        <button className="discovery-close" onClick={closeDiscovery}>×</button>
      </div>
      <div className="discovery-media-frame">
        {item ? (
          item.type === "video" ? <video src={item.url} controls playsInline /> : <img src={item.url} alt={item.title} />
        ) : discoveryMedia.length === 0 ? (
          <div style={{color:"#73eaff",fontFamily:"var(--font-cinzel)",fontSize:12,textAlign:"center"}}>✦ Summoning records ✦</div>
        ) : (
          <div style={{textAlign:"center",color:"#91cbd4",padding:20,fontSize:12}}>✦<br/><br/>No records found.</div>
        )}
      </div>
      <div className="discovery-info">
        <h3 className="discovery-media-title">{item?.title ?? "Discovering..."}</h3>
        <p className="discovery-media-description">{item?.description || "Consulting..."}</p>
      </div>
      <div className="discovery-controls">
        <button onClick={prevMedia}>◀</button>
        <button onClick={nextMedia}>▶</button>
      </div>
    </aside>
  );
}`,
  'src/components/JournalCard.tsx': `
"use client";
const ROT = [-0.7, 0.55, -0.4, 0.8];
export default function JournalCard({ item, index }) {
  const rot = ROT[index % 4];
  return (
    <article className="journal-card" style={{transform: \`rotate(\${rot}deg)\`}}>
      <div className="journal-frame">
        <div className="journal-frame-rune" />
        <div className="journal-media">
          {item.type === "video" ? <video controls playsInline src={item.url} /> : <img src={item.url} alt={item.title} />}
        </div>
      </div>
      <div className="journal-meta">
        <h3>{item.title}</h3>
        <p>{item.description || "A fragment..."}</p>
        <span className="journal-type">{item.type === "video" ? "MOVING RECORD" : "ILLUSTRATED RECORD"}</span>
      </div>
    </article>
  );
}`
};

for (const [f, c] of Object.entries(files)) {
  fs.writeFileSync(f, c.trim());
  console.log('✅ Pure CSS rewrite:', f);
}

console.log('\n⏳ Removing framer-motion completely...');
try { execSync('npm uninstall framer-motion gsap', { stdio: 'inherit' }); } catch(e) {}

console.log('\n⏳ Pushing Pure CSS V102...');
execSync('git add .', { stdio: 'inherit' });
execSync('git commit -m "Pure CSS V102: Completely remove animation libs"', { stdio: 'inherit' });
execSync('git push', { stdio: 'inherit' });
