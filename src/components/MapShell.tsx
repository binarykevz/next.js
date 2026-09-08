"use client";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useVoyageStore } from "@/lib/store";
import CountryDiscovery from "./CountryDiscovery";
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });
export default function MapShell() {
  const countriesCount = useVoyageStore((s) => s.countriesCount); const voyageCount = useVoyageStore((s) => s.voyageCount); const totalDistance = useVoyageStore((s) => s.totalDistance); const discoveryOpen = useVoyageStore((s) => s.discoveryOpen);
  return (<section className="map-shell"><LeafletMap /><div className="map-hud"><div className="hud-card"><span className="hud-label">Lands Charted</span><span className="hud-value">{countriesCount.toLocaleString()}</span></div><div className="hud-card"><span className="hud-label">Voyages</span><span className="hud-value">{voyageCount.toLocaleString()}</span></div><div className="hud-card"><span className="hud-label">Distance</span><span className="hud-value">{Math.round(totalDistance).toLocaleString()} km</span></div></div><div className="map-compass"><div className="compass-outer" /><div className="compass-middle" /><div className="compass-inner" /><span className="compass-letter compass-n">N</span><span className="compass-letter compass-e">E</span><span className="compass-letter compass-s">S</span><span className="compass-letter compass-w">W</span></div><AnimatePresence>{discoveryOpen && <CountryDiscovery />}</AnimatePresence></section>);
}
