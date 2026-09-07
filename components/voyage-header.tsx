"use client";

import { motion } from "motion/react";

export default function VoyageHeader() {
  return (
    <motion.header
      className="site-header"
      initial={{
        y: -80,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        delay: 3.05,
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="brand">
        <motion.div
          className="brand-compass"
          animate={{
            rotate: [-2, 2, -2],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✧
        </motion.div>

        <div>
          <h1 className="brand-title">
            The Great Voyage
          </h1>

          <p className="brand-subtitle">
            Chronicles of an Ancient Adventurer
          </p>
        </div>
      </div>
    </motion.header>
  );
}
