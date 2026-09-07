"use client";

import { motion } from "motion/react";

export default function SiteHeader() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-50 min-h-[var(--header-height)] flex items-center justify-between gap-5 px-6 md:px-8 py-3 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #2e190c, #1c0e07)",
        borderBottom: "3px solid #8c5c23",
        boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
      }}
    >
      <div className="absolute inset-x-0 top-[5px] h-px"
           style={{ background: "linear-gradient(90deg, transparent, #f0ca73, transparent)", opacity: 0.65 }} />

      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-[54px] h-[54px] flex-shrink-0 grid place-items-center text-[#e9c574] border border-[rgba(220,175,84,0.6)] rounded-full animate-compass-float"
             style={{ boxShadow: "0 0 0 5px rgba(215,169,78,0.07), 0 0 15px rgba(215,169,78,0.15)" }}>
          <span className="text-[35px] rotate-45">✧</span>
        </div>
        <div>
          <h1 className="m-0 text-[#f1d58f] font-uncial text-[clamp(20px,3vw,31px)] leading-none"
              style={{ textShadow: "0 2px 6px rgba(0,0,0,0.7)" }}>
            The Great Voyage
          </h1>
          <p className="mt-1 mb-0 text-[#b89458] text-xs tracking-[2px] uppercase">
            Chronicles of an Ancient Adventurer
          </p>
        </div>
      </div>
    </motion.header>
  );
}
