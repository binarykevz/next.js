"use client";

import { motion } from "motion/react";

interface Props {
  countries: number;
  voyages: number;
  distance: number;
}

export default function MapHUD({
  countries,
  voyages,
  distance,
}: Props) {
  const items = [
    [
      "Lands Charted",
      countries.toLocaleString(),
    ],
    [
      "Voyages",
      voyages.toLocaleString(),
    ],
    [
      "Distance",
      `${Math.round(distance).toLocaleString()} km`,
    ],
  ];

  return (
    <div className="map-hud">
      {items.map(([label, value], index) => (
        <motion.div
          className="hud-card"
          key={label}
          initial={{
            opacity: 0,
            y: -15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay:
              3.4 +
              index * 0.1,
          }}
        >
          <span className="hud-label">
            {label}
          </span>

          <motion.span
            className="hud-value"
            key={value}
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
          >
            {value}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
