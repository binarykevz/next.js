"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoyageStore } from "@/lib/store";
import { mapActions } from "@/lib/mapActions";

export default function ControlPanel() {
  const searchRef = useRef<HTMLInputElement>(null);
  const resetVoyage = useVoyageStore((s) => s.resetVoyage);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      mapActions.searchCountry(searchRef.current?.value || "");
    }
    if (e.key === "Escape") {
      if (searchRef.current) searchRef.current.value = "";
      useVoyageStore.getState().closeDiscovery();
    }
  };

  const scrollToJournal = () => {
    document.getElementById("journal")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative flex flex-wrap items-center gap-3 mb-6 p-3.5 bg-gradient-to-b from-[rgba(237,215,164,0.96)] to-[rgba(190,151,88,0.96)] border-2 border-[#593617]"
             style={{
               clipPath: "polygon(0 8px, 7px 0, 22% 4px, 45% 0, 68% 5px, 90% 0, 100% 7px, 99% 93%, 91% 100%, 68% 96%, 45% 100%, 20% 96%, 0 100%)",
               boxShadow: "0 10px 25px rgba(0,0,0,0.35), inset 0 0 0 3px rgba(255,226,154,0.25)",
             }}>
      <div className="relative flex-1 min-w-[300px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6e471f] text-[22px] pointer-events-none">⌕</span>
        <Input
          ref={searchRef}
          type="search"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search a kingdom, nation or distant land..."
          onKeyDown={handleSearch}
          className="pl-10 h-11 bg-gradient-to-b from-[#f4e4b9] to-[#d4b675] border-2 border-[#6c461f] text-[#2d1a0c] rounded-none"
          style={{ boxShadow: "inset 0 2px 7px rgba(63,35,13,0.2)" }}
        />
      </div>

      <Button
        onClick={() => mapActions.resetVoyage()}
        variant="outline"
        className="h-11 px-4 text-[#f5d995] font-cinzel font-bold text-xs tracking-wider bg-gradient-to-b from-[#65401f] to-[#2e190c] border border-[#c99a45] rounded-none hover:-translate-y-0.5 hover:border-[#ffe0a0] hover:shadow-[0_0_18px_rgba(221,174,83,0.28),0_7px_15px_rgba(0,0,0,0.35)]"
      >
        ⟲ Reset Voyage
      </Button>

      <Button
        onClick={scrollToJournal}
        variant="outline"
        className="h-11 px-4 text-[#f5d995] font-cinzel font-bold text-xs tracking-wider bg-gradient-to-b from-[#65401f] to-[#2e190c] border border-[#c99a45] rounded-none hover:-translate-y-0.5 hover:border-[#ffe0a0]"
      >
        📜 Expedition Journal
      </Button>
    </section>
  );
}
