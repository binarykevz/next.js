"use client";
export default function AppLoader({ onReady }) {
  setTimeout(() => onReady(), 3000);
  return (
    <div id="appLoader">
      <div className="loader-parchment">
        <div className="loader-sigil">
          <div className="loader-ring" /><div className="loader-ring" /><div className="loader-ring" />
          <span className="loader-rune">✦</span><span className="loader-rune">✧</span>
          <span className="loader-rune">✦</span><span className="loader-rune">✧</span>
          <div className="loader-hourglass"><div className="loader-sand" /></div>
        </div>
        <h1 className="loader-title">The Great Voyage</h1>
        <p className="loader-subtitle">Unfolding the mysteries...</p>
        <div className="loader-progress"><div className="loader-progress-bar" /></div>
        <div className="loader-status">Consulting the old charts...</div>
      </div>
    </div>
  );
}