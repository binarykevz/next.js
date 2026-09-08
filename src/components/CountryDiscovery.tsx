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
}