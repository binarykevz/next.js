"use client";
const ROT = [-0.7, 0.55, -0.4, 0.8];
export default function JournalCard({ item, index }) {
  const rot = ROT[index % 4];
  return (
    <article className="journal-card" style={{transform: `rotate(${rot}deg)`}}>
      <div className="journal-frame">
        <div className="journal-frame-rune" />
        <div className="journal-media">
          {item.type === "video" ? <video controls playsInline src={item.url} /> : <img src={item.url} alt={item.title} />}
        </div>
      </div>
      <div className="journal-meta">
        <h3>{item.title}</h3>
        <p>{item.description || "A fragment..."}</p>
        <span className="journal-type">{item.type === "video" ? "MOVING RECORD" : "ILLUSTRATED RECORD"}</span>
      </div>
    </article>
  );
}