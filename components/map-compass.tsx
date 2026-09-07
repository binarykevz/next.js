"use client";

import { motion } from "motion/react";

export default function MapCompass() {
  return (
    <div className="map-compass">
      <motion.div
        className="compass-outer"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="compass-middle"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="compass-inner" />

      <span className="compass-letter n">
        N
      </span>

      <span className="compass-letter e">
        E
      </span>

      <span className="compass-letter s">
        S
      </span>

      <span className="compass-letter w">
        W
      </span>
    </div>
  );
}
