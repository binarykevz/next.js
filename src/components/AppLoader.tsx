"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
export default function AppLoader({ onReady }) {
  const barRef = useRef(null);
  useEffect(() => { const tl = gsap.timeline({ onComplete: onReady }); tl.to(barRef.current, { width: "100%", duration: 3, ease: "none" }); return () => tl.kill(); }, [onReady]);
  return (<motion.div id="appLoader" exit={{ opacity: 0 }} transition={{ duration: 0.9 }}><div className="loader-parchment"><div className="loader-sigil"><div className="loader-ring" /><div className="loader-ring" /><div className="loader-ring" /><span className="loader-rune">✦</span><span className="loader-rune">✧</span><span className="loader-rune">✦</span><span className="loader-rune">✧</span><div className="loader-hourglass"><div className="loader-sand" /></div></div><h1 className="loader-title">The Great Voyage</h1><p className="loader-subtitle">Unfolding the mysteries...</p><div className="loader-progress"><div ref={barRef} className="loader-progress-bar" /></div><div className="loader-status">Consulting the old charts...</div></div></motion.div>);
}
