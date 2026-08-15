"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RuneStone from "./RuneStone";
import { RUNE_IDS } from "@/lib/runeGlyphs";

/** Three featured stones turning slowly in the hero, cycling through the futhark. */
export default function HeroStones() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((t) => t + 1), 3800);
    return () => window.clearInterval(interval);
  }, []);

  const offsets = [0, 8, 16];

  return (
    <div className="flex items-center justify-center gap-5 md:gap-9">
      {offsets.map((offset, i) => {
        const runeId = RUNE_IDS[(tick * 3 + offset + i) % RUNE_IDS.length];
        return (
          <motion.div
            key={i}
            animate={{ rotateY: [0, 14, 0, -14, 0], y: [0, -7, 0] }}
            transition={{
              duration: 13 + i * 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.9,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              key={runeId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <RuneStone runeId={runeId} lit size={i === 1 ? 124 : 96} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
