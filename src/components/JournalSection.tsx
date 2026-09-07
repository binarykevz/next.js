"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fetchJournalMedia, removeDuplicates, type CountryMedia } from "@/lib/api";
import JournalCard from "./JournalCard";

export default function JournalSection() {
  const [media, setMedia] = useState<CountryMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [images, videos] = await Promise.allSettled([
          fetchJournalMedia("image"),
          fetchJournalMedia("video"),
        ]);
        const combined = [
          ...(images.status === "fulfilled" ? images.value : []),
          ...(videos.status === "fulfilled" ? videos.value : []),
        ];
        setMedia(removeDuplicates(combined));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="journal" className="relative mt-14 px-5 py-8 pb-12 overflow-hidden border-4 border-[#1b0d06]"
             style={{
               background: "linear-gradient(145deg, #59391e, #26140a 25%, #402511 75%, #1b0d06)",
               boxShadow: "0 15px 45px rgba(0,0,0,0.48), inset 0 0 0 2px #a77635",
             }}>
      <div className="absolute inset-2.5 border border-[rgba(228,182,87,0.42)] pointer-events-none" />

      <div className="relative z-[2] text-center mb-7">
        <div className="mb-2.5 text-[#d8ac59] text-xs tracking-[4px]">✦ ──────── ✧ ──────── ✦</div>
        <h2 className="m-0 text-[#f1d695] font-uncial text-[clamp(28px,5vw,48px)]"
            style={{ textShadow: "0 3px 8px rgba(0,0,0,0.7)" }}>
          Expedition Journal
        </h2>
        <p className="mt-2 mx-auto text-[#b99762] text-[15px] italic">
          Fragments, visions and records gathered from distant shores
        </p>
      </div>

      <div className="relative z-[2] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-[#caa96d] border border-dashed border-[rgba(208,166,80,0.45)] bg-[rgba(22,12,7,0.45)] p-10">
            <strong className="block mb-1 text-[#e8ca86] font-cinzel">Opening the expedition archives...</strong>
            Please wait while the old records are restored.
          </div>
        ) : media.length === 0 ? (
          <div className="col-span-full text-center text-[#caa96d] border border-dashed border-[rgba(208,166,80,0.45)] bg-[rgba(22,12,7,0.45)] p-10">
            <strong className="block mb-1 text-[#e8ca86] font-cinzel">The journal contains no visible records.</strong>
          </div>
        ) : (
          media.map((item, i) => <JournalCard key={item.url + i} item={item} index={i} />)
        )}
      </div>
    </section>
  );
}
