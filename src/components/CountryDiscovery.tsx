"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { useVoyageStore } from "@/lib/store";

export default function CountryDiscovery() {
  const {
    discoveryCountry,
    discoveryMedia,
    discoveryIndex,
    closeDiscovery,
    nextMedia,
    prevMedia,
  } = useVoyageStore();

  const item = discoveryMedia[discoveryIndex];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDiscovery();
      if (e.key === "ArrowRight") nextMedia();
      if (e.key === "ArrowLeft") prevMedia();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDiscovery, nextMedia, prevMedia]);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed right-4 top-20 z-[900] w-[min(360px,32vw)] min-h-[220px] p-2.5 text-[#dffcff] overflow-hidden border border-[rgba(93,231,255,0.8)]"
      style={{
        background: "linear-gradient(145deg, rgba(8,22,28,0.95), rgba(11,32,40,0.92))",
        boxShadow: "0 0 0 1px rgba(171,111,255,0.35), 0 0 25px rgba(64,219,255,0.2), 0 15px 45px rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* scan line */}
      <div className="absolute inset-0 pointer-events-none animate-scan"
           style={{ background: "repeating-linear-gradient(0deg, transparent 0 5px, rgba(94,230,255,0.04) 6px 7px)" }} />
      <div className="absolute right-3 top-2 text-[rgba(98,228,255,0.8)] animate-magic-twinkle">✦</div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <h2 className="m-0 text-[#c9f9ff] font-cinzel text-sm tracking-widest uppercase"
            style={{ textShadow: "0 0 10px rgba(75,221,255,0.55)" }}>
          {discoveryCountry}
        </h2>
        <button onClick={closeDiscovery}
                className="w-7 h-7 grid place-items-center text-[#9befff] bg-black/30 border border-[rgba(91,226,255,0.45)]">
          ×
        </button>
      </div>

      <div className="relative w-full h-[210px] flex items-center justify-center overflow-hidden border border-[rgba(98,226,255,0.5)]"
           style={{
             background: "radial-gradient(circle, rgba(61,155,177,0.16), rgba(3,13,18,0.9))",
             boxShadow: "inset 0 0 25px rgba(45,204,239,0.12), 0 0 15px rgba(75,205,255,0.12)",
           }}>
        {item ? (
          item.type === "video" ? (
            <video src={item.url} controls preload="metadata" playsInline className="w-full h-full object-contain relative z-[2]" />
          ) : (
            <img src={item.url} alt={item.title} className="w-full h-full object-contain relative z-[2]" loading="lazy" />
          )
        ) : (
          <div className="text-center text-[#91cbd4] p-5 font-cinzel text-xs">
            ✦<br /><br />No records were found for this land.
          </div>
        )}
      </div>

      <div className="p-2 pt-2">
        <h3 className="m-0 text-[#e5fbff] font-cinzel text-xs">{item?.title || "Discovering..."}</h3>
        <p className="mt-1 text-[#91c9d2] text-[11px] line-clamp-2">{item?.description || "The expedition records are being consulted."}</p>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        <button onClick={prevMedia} aria-label="Previous media"
                className="min-w-[34px] min-h-[29px] text-[#c6f8ff] bg-[rgba(24,76,86,0.65)] border border-[rgba(98,227,255,0.45)] hover:bg-[rgba(45,131,145,0.7)]">
          ◀
        </button>
        <button onClick={nextMedia} aria-label="Next media"
                className="min-w-[34px] min-h-[29px] text-[#c6f8ff] bg-[rgba(24,76,86,0.65)] border border-[rgba(98,227,255,0.45)] hover:bg-[rgba(45,131,145,0.7)]">
          ▶
        </button>
      </div>
    </motion.aside>
  );
}
