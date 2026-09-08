"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useVoyageStore } from "@/lib/store";
import { mapActions } from "@/lib/mapActions";
export default function CountryDiscovery() {
  const ref = useRef(null); const { discoveryCountry, discoveryMedia, discoveryIndex, discoveryLatLng, closeDiscovery, nextMedia, prevMedia } = useVoyageStore(); const item = discoveryMedia[discoveryIndex];
  useEffect(() => { const el = ref.current; if (!el) return; const place = () => mapActions.positionDiscovery(el, discoveryLatLng); place(); const off = mapActions.onMapEvent(place); window.addEventListener("resize", place); return () => { off(); window.removeEventListener("resize", place); }; }, [discoveryLatLng]);
  return (<motion.aside ref={ref} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }} className="country-discovery"><div className="discovery-header"><h2 className="discovery-title">{discoveryCountry}</h2><button className="discovery-close" onClick={closeDiscovery}>×</button></div><div className="discovery-media-frame">{item ? (item.type === "video" ? <video src={item.url} controls playsInline /> : <img src={item.url} alt={item.title} />) : discoveryMedia.length === 0 ? (<div>✦ Summoning records ✦</div>) : (<div>No records found.</div>)}</div><div className="discovery-info"><h3>{item?.title ?? "Discovering..."}</h3><p>{item?.description || "Consulting..."}</p></div><div className="discovery-controls"><button onClick={prevMedia}>◀</button><button onClick={nextMedia}>▶</button></div></motion.aside>);
}
