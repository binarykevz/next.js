"use client";

import { useEffect, useRef } from "react";
import { mapActions } from "@/lib/mapActions";

export default function LeafletMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    mapActions.initMap(containerRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      id="map"
      className="w-full h-[clamp(520px,72dvh,820px)] min-h-[460px] relative overflow-hidden border-[5px] border-[#d0aa63]"
      style={{
        background: "radial-gradient(circle at 50% 50%, #24555a, #102f35 65%, #0b2025)",
        boxShadow: "inset 0 0 0 2px #4d3018, inset 0 0 70px rgba(0,0,0,0.5)",
      }}
    />
  );
}
