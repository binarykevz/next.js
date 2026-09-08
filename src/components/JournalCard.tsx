"use client";
import { motion } from "framer-motion";
const ROT = [-0.7, 0.55, -0.4, 0.8];
export default function JournalCard({ item, index }) {
  const rot = ROT[index % 4];
  return (<motion.article initial={{ opacity: 0, y: 35, rotate: rot, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, rotate: rot, scale: 1 }} whileHover={{ y: -9, rotate: 0, scale: 1.015 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: (index % 4) * 0.07 }} className="journal-card"><div className="journal-frame"><div className="journal-frame-rune" /><div className="journal-media">{item.type === "video" ? <video controls playsInline src={item.url} /> : <img src={item.url} alt={item.title} />}</div></div><div className="journal-meta"><h3>{item.title}</h3><p>{item.description || "A fragment..."}</p><span className="journal-type">{item.type === "video" ? "MOVING RECORD" : "ILLUSTRATED RECORD"}</span></div></motion.article>);
}
