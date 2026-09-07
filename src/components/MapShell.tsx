"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useVoyageStore } from "@/lib/store";

// Leaflet must only run client-side
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function MapShell() {
  const { countriesCount, voyageCount, totalDistance } = useVoyageStore();

  return (
    <section className="relative w-full p-3"
             style={{
               background: "linear-gradient(135deg, #2b160b, #70471f 16%, #2e170b 35%, #875c29 50%, #2d160b 68%, #75491e)",
               border: "4px solid #170b05",
               boxShadow: "0 15px 45px rgba(0,0,0,0.48), 0 0 0 2px #b1823c, inset 0 0 0 4px rgba(222,174,80,0.18)",
             }}>
      <div className="absolute inset-[5px] border border-[rgba(245,208,124,0.5)] pointer-events-none z-10" />
      <div className="absolute left-1/2 top-[-15px] -translate-x-1/2 z-20 px-5 text-[#d8ae5c] bg-[#29140a] text-2xl">✦</div>

      <LeafletMap />

      {/* HUD */}
      <div className="absolute top-7 left-7 z-[500] grid grid-cols-[repeat(3,auto)] gap-1.5 pointer-events-none">
        {[
          { label: "Lands Charted", value: countriesCount.toLocaleString() },
          { label: "Voyages", value: voyageCount.toLocaleString() },
          { label: "Distance", value: `${Math.round(totalDistance).toLocaleString()} km` },
        ].map((h) => (
          <div key={h.label} className="min-w-[105px] p-2.5 px-3 text-[#f1d594] border border-[rgba(215,170,80,0.75)]"
               style={{ background: "linear-gradient(180deg, rgba(40,23,12,0.92), rgba(23,12,7,0.92))", boxShadow: "0 4px 12px rgba(0,0,0,0.4)", backdropFilter: "blur(5px)" }}>
            <span className="block text-[#a98249] font-cinzel text-[9px] tracking-widest uppercase">{h.label}</span>
            <span className="block mt-0.5 font-cinzel text-base font-bold">{h.value}</span>
          </div>
        ))}
      </div>

      {/* Compass */}
      <div className="absolute right-9 top-9 z-[500] w-[130px] h-[130px] pointer-events-none hidden md:block">
        <div className="absolute inset-0 rounded-full border-2 border-[rgba(235,194,108,0.75)] animate-[spin_35s_linear_infinite]"
             style={{ boxShadow: "0 0 0 7px rgba(58,31,12,0.25), 0 0 25px rgba(214,170,76,0.16)" }} />
        <div className="absolute inset-[13px] rounded-full border border-dashed border-[rgba(240,204,125,0.7)] animate-[spin_24s_linear_infinite_reverse]" />
        <div className="absolute inset-[31px] rounded-full border-2 border-[rgba(225,184,94,0.65)]">
          <div className="absolute inset-2"
               style={{
                 background: "linear-gradient(45deg, transparent 47%, #e7be6d 48% 52%, transparent 53%), linear-gradient(-45deg, transparent 47%, #8c6026 48% 52%, transparent 53%)",
                 clipPath: "polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)",
               }} />
        </div>
        {[
          { cls: "-top-4 left-1/2 -translate-x-1/2", letter: "N" },
          { cls: "-right-4 top-1/2 -translate-y-1/2", letter: "E" },
          { cls: "-bottom-4 left-1/2 -translate-x-1/2", letter: "S" },
          { cls: "-left-4 top-1/2 -translate-y-1/2", letter: "W" },
        ].map((d) => (
          <span key={d.letter} className={`absolute ${d.cls} text-[#e5c379] font-cinzel font-bold text-sm`}
                style={{ textShadow: "0 2px 3px #1a0d06" }}>{d.letter}</span>
        ))}
      </div>
    </section>
  );
}
