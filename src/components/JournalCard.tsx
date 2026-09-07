"use client";

import { motion } from "motion/react";
import type { CountryMedia } from "@/lib/api";

const rotations = [-0.7, 0.55, -0.4, 0.8];

interface Props {
  item: CountryMedia;
  index: number;
}

export default function JournalCard({ item, index }: Props) {
  const rotation = rotations[index % 4];

  return (
    <motion.article
      initial={{ opacity: 0, y: 35, scale: 0.96, rotate: rotation }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: rotation }}
      whileHover={{ y: -9, rotate: 0, scale: 1.015 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-w-0 p-3.5 border-2 border-[#583619] overflow-visible"
      style={{
        background: "radial-gradient(circle at 30% 20%, rgba(255,241,193,0.5), transparent 35%), linear-gradient(135deg, #c49b60, #ebd49b 25%, #d2ae72 65%, #a57a43)",
        boxShadow: "0 13px 30px rgba(0,0,0,0.42), inset 0 0 0 3px rgba(255,225,156,0.23), inset 0 0 20px rgba(88,52,19,0.25)",
      }}
    >
      {/* top scroll cut */}
      <div className="absolute -left-1 -right-1 -top-[11px] h-[23px] border border-[#4d2c15] z-[5] -rotate-1"
           style={{
             background: "linear-gradient(180deg, #9a6d39, #e4c88c 35%, #bd8e51 70%, #70451f)",
             borderRadius: "42% 55% 48% 38% / 75% 60% 70% 55%",
             boxShadow: "0 4px 7px rgba(0,0,0,0.25)",
           }} />
      {/* bottom scroll cut */}
      <div className="absolute -left-1.5 -right-1.5 -bottom-[11px] h-[23px] border border-[#4d2c15] z-[5] rotate-[0.8deg]"
           style={{
             background: "linear-gradient(180deg, #a37541, #e4c88c 35%, #c19457 70%, #6d431f)",
             borderRadius: "45% 40% 70% 55% / 60% 72% 55% 75%",
             boxShadow: "0 5px 8px rgba(0,0,0,0.3)",
           }} />

      <div className="relative p-3 border-[3px] border-[#d2a44e] overflow-hidden"
           style={{
             background: "radial-gradient(circle at center, rgba(61,127,131,0.2), transparent 65%), #1b120c",
             boxShadow: "0 0 0 2px #5c391b, 0 0 0 5px rgba(237,203,130,0.18), 0 0 18px rgba(73,215,229,0.12)",
           }}>
        <div className="absolute inset-[5px] pointer-events-none border border-dashed border-[rgba(110,225,232,0.27)] animate-rune-border" />
        <span className="absolute top-0.5 left-1 z-[8] text-[#ffe29b] text-lg animate-magic-twinkle"
              style={{ textShadow: "0 0 8px rgba(255,210,104,0.8)" }}>✦</span>
        <span className="absolute right-1 bottom-0.5 z-[8] text-[#ffe29b] text-lg animate-magic-twinkle"
              style={{ textShadow: "0 0 8px rgba(255,210,104,0.8)" }}>✧</span>

        <div className="relative h-[255px] flex items-center justify-center overflow-hidden"
             style={{ background: "radial-gradient(ellipse at center, rgba(51,110,115,0.22), transparent 65%), #080e10" }}>
          {/* scan line */}
          <div className="absolute inset-x-0 -top-1/5 h-2/5 pointer-events-none z-[4] animate-media-scan"
               style={{ background: "linear-gradient(transparent, rgba(105,235,239,0.08), transparent)" }} />

          {item.type === "video" ? (
            <video src={item.url} controls preload="metadata" playsInline
                   className="w-full h-full object-contain relative z-[2] transition-transform duration-700 hover:scale-[1.025]" />
          ) : (
            <img src={item.url} alt={item.title} loading="lazy" decoding="async"
                 className="w-full h-full object-contain relative z-[2] transition-transform duration-700 hover:scale-[1.025]" />
          )}
        </div>
      </div>

      <div className="pt-3.5 px-1 pb-1">
        <h3 className="m-0 text-[#4a2c15] font-cinzel text-[15px] leading-snug">{item.title}</h3>
        <p className="mt-1 mb-0 text-[#6a4726] text-[13px] leading-relaxed line-clamp-3">
          {item.description || "A fragment preserved within the expedition chronicles."}
        </p>
        <span className="inline-flex items-center mt-2 px-2 py-0.5 text-[#6a431d] font-cinzel text-[8px] font-bold tracking-wider bg-[rgba(255,228,161,0.35)] border border-[rgba(102,67,29,0.5)]">
          {item.type === "video" ? "MOVING RECORD" : "ILLUSTRATED RECORD"}
        </span>
      </div>
    </motion.article>
  );
}
