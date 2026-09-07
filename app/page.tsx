"use client";

import { useEffect, useState } from "react";
import VoyageLoader from "@/components/voyage-loader";
import VoyageHeader from "@/components/voyage-header";
import VoyageControls from "@/components/voyage-controls";
import VoyageMap from "@/components/voyage-map";
import ExpeditionJournal from "@/components/expedition-journal";

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setReady(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className={ready ? "voyage-app ready" : "voyage-app"}>
      <VoyageLoader visible={!ready} />

      <div className="voyage-content">
        <VoyageHeader />

        <div className="voyage-main">
          <VoyageControls />

          <VoyageMap />

          <ExpeditionJournal />
        </div>

        <footer className="voyage-footer">
          <span className="footer-rune">✦ ✧ ✦ ✧ ✦</span>

          <span>
            The Great Voyage · Cartography of the Known World
          </span>
        </footer>
      </div>
    </main>
  );
}
