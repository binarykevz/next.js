"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  fetchJournalMedia,
  type ExpeditionMedia,
} from "@/lib/media";

export default function ExpeditionJournal() {
  const [media, setMedia] = useState<
    ExpeditionMedia[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const result =
          await fetchJournalMedia();

        if (mounted) {
          setMedia(result);
        }
      } catch (error) {
        console.error(
          "Journal loading failed:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="journal"
      className="journal-section"
    >
      <motion.div
        className="journal-heading"
        initial={{
          opacity: 0,
          y: 35,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
      >
        <div className="journal-ornament">
          ✦ ─────── ✧ ─────── ✦
        </div>

        <h2>
          Expedition Journal
        </h2>

        <p>
          Fragments, visions and records
          gathered from distant shores
        </p>
      </motion.div>

      <div className="journal-grid">
        {loading ? (
          <div className="journal-empty">
            <strong>
              Opening the expedition archives...
            </strong>

            Please wait while the old
            records are restored.
          </div>
        ) : media.length === 0 ? (
          <div className="journal-empty">
            <strong>
              The journal contains no
              visible records.
            </strong>

            The expedition archive
            returned no media.
          </div>
        ) : (
          media.map((item, index) => (
            <motion.article
              key={`${item.url}-${index}`}
              className="journal-card"
              initial={{
                opacity: 0,
                y: 45,
                rotate:
                  index % 2 === 0
                    ? -2
                    : 2,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate:
                  index % 2 === 0
                    ? -0.7
                    : 0.7,
              }}
              viewport={{
                once: true,
                amount: 0.12,
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              whileHover={{
                y: -10,
                rotate: 0,
                scale: 1.015,
              }}
            >
              <div className="journal-scroll-top" />

              <div className="journal-frame">
                <div className="journal-frame-rune">
                  ✦
                </div>

                <div className="journal-media">
                  {item.type ===
                  "video" ? (
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      src={item.url}
                    />
                  ) : (
                    <img
                      loading="lazy"
                      src={item.url}
                      alt={item.title}
                    />
                  )}
                </div>
              </div>

              <div className="journal-meta">
                <h3>{item.title}</h3>

                <p>
                  {item.description ||
                    "A fragment preserved within the expedition chronicles."}
                </p>

                <span>
                  {item.type ===
                  "video"
                    ? "MOVING RECORD"
                    : "ILLUSTRATED RECORD"}
                </span>
              </div>

              <div className="journal-scroll-bottom" />
            </motion.article>
          ))
        )}
      </div>
    </section>
  );
}
