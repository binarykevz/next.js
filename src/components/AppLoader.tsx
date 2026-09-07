"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";

interface Props {
  onReady: () => void;
}

export default function AppLoader({ onReady }: Props) {
  const progressRef = useRef<HTMLDivElement>(null);
  const sigilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(progressRef.current, { width: "100%", duration: 3, ease: "none" })
        .to(sigilRef.current, { scale: 1.1, duration: 0.3, yoyo: true, repeat: 1 });

      const timer = setTimeout(() => onReady(), 3000);
      return () => clearTimeout(timer);
    });
    return () => ctx.revert();
  }, [onReady]);

  return (
    <motion.div
      id="appLoader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[10000] grid place-items-center"
      style={{
        background: `radial-gradient(circle at center, rgba(82,52,25,0.25), transparent 42%), linear-gradient(135deg, #110803, #2a170b, #100704)`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.75, rotate: -2, y: 40 }}
        animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[min(700px,90vw)] min-h-[470px] flex flex-col items-center justify-center px-12 py-16"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255,238,183,0.65), transparent 62%), linear-gradient(90deg, #9e7545, #ead09a 8%, #f1dfad 50%, #d6b777 92%, #8e6337)`,
          clipPath: `polygon(2% 4%, 7% 1%, 15% 4%, 24% 2%, 35% 5%, 46% 2%, 57% 5%, 69% 1%, 81% 4%, 93% 2%, 98% 7%, 96% 17%, 99% 29%, 96% 42%, 99% 55%, 96% 70%, 99% 83%, 94% 97%, 82% 94%, 70% 98%, 57% 95%, 45% 98%, 33% 95%, 20% 98%, 7% 94%, 2% 97%, 4% 84%, 1% 72%, 4% 57%, 1% 44%, 4% 30%, 1% 16%)`,
          boxShadow: "0 30px 80px rgba(0,0,0,.7), inset 0 0 60px rgba(72,38,13,.35)",
        }}
      >
        <div className="absolute inset-[18px] border border-[rgba(91,56,25,0.55)] pointer-events-none"
             style={{ boxShadow: "inset 0 0 0 5px rgba(255,225,154,0.18), inset 0 0 35px rgba(62,34,14,0.2)" }} />

        <div ref={sigilRef} className="relative w-[150px] h-[150px] grid place-items-center mb-6"
             style={{ filter: "drop-shadow(0 0 10px rgba(216,170,80,0.5))" }}>
          {[8, 22, 36].map((inset, i) => (
            <div key={i} className="absolute rounded-full"
                 style={{
                   inset: `${inset}px`,
                   border: i === 1 ? "1px dashed #806026" : `2px solid ${i === 0 ? "rgba(119,78,27,0.65)" : "rgba(112,73,23,0.45)"}`,
                   borderTopColor: i === 0 ? "#fff0ae" : undefined,
                   borderBottomColor: i === 2 ? "#e3ae4f" : undefined,
                   animation: i === 1 ? "spinReverse 8s linear infinite" : `spin ${i === 0 ? 5 : 3.8}s linear infinite`,
                 }} />
          ))}
          {["top-0 left-1/2", "right-1 top-1/2", "bottom-0 left-1/2", "left-1 top-1/2"].map((pos, i) => (
            <span key={i} className={`absolute ${pos} text-[#6a4218] font-uncial text-base animate-[runePulse_2s_ease-in-out_infinite]`}>
              {i % 2 === 0 ? "✦" : "✧"}
            </span>
          ))}

          <div className="relative w-[50px] h-[70px] flex items-center justify-center">
            <div className="absolute left-1/2 -translate-x-1/2 top-[3px] w-10 h-6 border-2 border-[#6b4318]"
                 style={{ clipPath: "polygon(0 0, 100% 0, 62% 100%, 38% 100%)" }} />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[3px] w-10 h-6 border-2 border-[#6b4318]"
                 style={{ clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)" }} />
            <div className="absolute w-1.5 h-7 top-5"
                 style={{
                   background: "linear-gradient(to bottom, #c88829, #ffe4a0, #c88829)",
                   clipPath: "polygon(0 0, 100% 0, 65% 50%, 100% 100%, 0 100%, 35% 50%)",
                   animation: "sandFlow 2.1s linear infinite",
                 }} />
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="m-0 text-[#4a2b13] font-uncial text-[clamp(30px,5vw,56px)] text-center"
          style={{ textShadow: "1px 1px 0 rgba(255,235,174,0.8), 3px 4px 7px rgba(53,29,10,0.35)" }}
        >
          The Great Voyage
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 mb-8 text-[#6b4828] text-[clamp(15px,2vw,20px)] italic"
        >
          Unfolding the mysteries of the ancient world...
        </motion.p>

        <div className="relative w-[min(430px,75vw)] h-3 bg-gradient-to-b from-[#563519] to-[#2c190c] border-2 border-[#7b511e]"
             style={{ boxShadow: "inset 0 2px 5px rgba(0,0,0,0.55), 0 0 15px rgba(215,166,76,0.2)" }}>
          <div ref={progressRef}
               className="h-full w-0"
               style={{
                 background: "linear-gradient(90deg, #7e5119, #d5a346, #ffe2a0, #b87922)",
                 boxShadow: "0 0 12px rgba(255,204,98,0.7)",
               }} />
        </div>

        <div className="mt-4 text-[#6b4828] text-sm tracking-widest text-center animate-pulse">
          Consulting the old charts...
        </div>
      </motion.div>
    </motion.div>
  );
}
