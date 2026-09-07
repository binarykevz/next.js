"use client";

import { motion } from "motion/react";

interface Props {
  visible: boolean;
}

export default function VoyageLoader({
  visible,
}: Props) {
  return (
    <motion.div
      className="voyage-loader"
      animate={{
        opacity: visible ? 1 : 0,
        visibility: visible
          ? "visible"
          : "hidden",
      }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="loader-parchment"
        initial={{
          opacity: 0,
          scale: 0.72,
          rotate: -3,
          y: 40,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
          y: 0,
        }}
        transition={{
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="loader-sigil">
          <div className="loader-ring" />
          <div className="loader-ring" />
          <div className="loader-ring" />

          <span>✦</span>
          <span>✧</span>
          <span>✦</span>
          <span>✧</span>

          <div className="loader-hourglass">
            <div className="loader-sand" />
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
          }}
        >
          The Great Voyage
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.55,
          }}
        >
          Unfolding the mysteries of the
          ancient world...
        </motion.p>

        <div className="loader-progress">
          <motion.div
            initial={{
              width: "0%",
            }}
            animate={{
              width: "100%",
            }}
            transition={{
              duration: 3,
              ease: "linear",
            }}
          />
        </div>

        <div className="loader-status">
          Consulting the old charts...
        </div>
      </motion.div>
    </motion.div>
  );
}
