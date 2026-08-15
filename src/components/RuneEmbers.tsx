"use client";

import { useMemo } from "react";
import RuneGlyph from "./RuneGlyph";
import { RUNE_IDS } from "@/lib/runeGlyphs";

/**
 * All 24 Elder Futhark runes drifting upward like embers behind the hero.
 * Positions come from a fixed integer hash, not Math.random, so the server and
 * client markup agree and nothing flickers on hydration.
 */
function pseudo(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export default function RuneEmbers({ count = 24 }: { count?: number }) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: RUNE_IDS[i % RUNE_IDS.length],
        left: pseudo(i + 1) * 100,
        size: 26 + pseudo(i + 11) * 44,
        duration: 26 + pseudo(i + 23) * 34,
        delay: -pseudo(i + 37) * 50,
        drift: (pseudo(i + 53) - 0.5) * 60,
      })),
    [count],
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {embers.map((e, i) => (
        <span
          key={i}
          className="ember"
          style={{
            left: `${e.left}%`,
            bottom: "-15vh",
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
            marginLeft: `${e.drift}px`,
          }}
        >
          {/*
            The keyframes fade each ember 0 -> 1 -> 0 over its drift, so the
            steady-state faintness lives here instead. Amber at a literal 2% on
            #111318 resolves to under two RGB levels and disappears entirely;
            0.06 is the lowest value that still reads as a rune on a dark panel.
          */}
          <span style={{ display: "block", opacity: 0.06 }}>
            <RuneGlyph
              id={e.id}
              size={e.size}
              color="var(--accent-amber-light)"
              strokeWidth={0.9}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
