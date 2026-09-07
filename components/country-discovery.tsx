"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import type { ExpeditionMedia } from "@/lib/media";

interface Props {
  country: string;
  media: ExpeditionMedia[];
  index: number;
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function CountryDiscovery({
  country,
  media,
  index,
  open,
  onClose,
  onNext,
  onPrevious,
}: Props) {
  const item = media[index];

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className="country-discovery"
          initial={{
            opacity: 0,
            scale: 0.92,
            y: 15,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
            y: 15,
          }}
        >
          <div className="discovery-header">
            <h2>{country}</h2>

            <button
              onClick={onClose}
              aria-label="Close discovery"
            >
              <X size={17} />
            </button>
          </div>

          <div className="discovery-media">
            {item ? (
              item.type === "video" ? (
                <video
                  controls
                  playsInline
                  preload="metadata"
                  src={item.url}
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                />
              )
            ) : (
              <div className="discovery-summoning">
                ✦
                <br />
                <br />
                Summoning records...
              </div>
            )}
          </div>

          <div className="discovery-info">
            <h3>
              {item?.title ??
                "Consulting the expedition archives..."}
            </h3>

            <p>
              {item?.description ??
                "Ancient records are being retrieved."}
            </p>
          </div>

          <div className="discovery-controls">
            <button onClick={onPrevious}>
              <ChevronLeft size={17} />
            </button>

            <button onClick={onNext}>
              <ChevronRight size={17} />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
