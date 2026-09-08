"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AppLoader = dynamic(() => import("@/components/AppLoader"), { ssr: false });
const SiteHeader = dynamic(() => import("@/components/SiteHeader"), { ssr: false });
const ControlPanel = dynamic(() => import("@/components/ControlPanel"), { ssr: false });
const MapShell = dynamic(() => import("@/components/MapShell"), { ssr: false });
const JournalSection = dynamic(() => import("@/components/JournalSection"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Toast = dynamic(() => import("@/components/Toast"), { ssr: false });

export default function Home() {
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div style={{ background: "#160c07", minHeight: "100vh" }} />;

  return (
    <>
      <h1 style={{color:"cyan",fontSize:"40px",position:"fixed",top:0,left:0,zIndex:99999,background:"black",padding:"15px"}}>BUILD V101 - NO MOTION</h1>
      {!ready && <AppLoader onReady={() => setReady(true)} />}
      <div id="appShell" className={ready ? "ready" : ""}>
        <SiteHeader />
        <main className="main-wrap">
          <ControlPanel />
          <MapShell />
          <JournalSection />
        </main>
        <Footer />
      </div>
      <Toast />
    </>
  );
}