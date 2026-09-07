"use client";

import { motion } from "motion/react";

export default function MagicalShip() {
  return (
    <div className="ship-marker">
      <motion.div
        className="ship-wake"
        animate={{
          scaleX: [0.7, 1.1, 0.7],
          opacity: [0.35, 0.9, 0.35],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />

      <div className="ship-hull" />

      <div className="ship-mast" />

      <motion.div
        className="ship-sail"
        animate={{
          rotate: [-2, 3, -2],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
        }}
      />

      <div className="ship-flag" />
    </div>
  );
}
