"use client";
import { motion } from "framer-motion";
export default function SiteHeader() { return (<motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="site-header"><div className="brand"><div className="brand-compass" /><div><h1 className="brand-title">The Great Voyage</h1><p className="brand-subtitle">Chronicles of an Ancient Adventurer</p></div></div></motion.header>); }
