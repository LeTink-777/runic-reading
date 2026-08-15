"use client";

import { useEffect, useState } from "react";
import { SPOTS_KEY, TIMER_KEY } from "./topics";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Time left in a 24h window anchored to the visitor's first draw. */
export function useCountdown(): string | null {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    let start = Number(window.localStorage.getItem(TIMER_KEY));
    if (!start || Number.isNaN(start)) {
      start = Date.now();
      window.localStorage.setItem(TIMER_KEY, String(start));
    }
    const end = start + DAY_MS;

    function tick() {
      const left = Math.max(0, end - Date.now());
      const h = Math.floor(left / 3_600_000);
      const m = Math.floor((left % 3_600_000) / 60_000);
      const s = Math.floor((left % 60_000) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setLabel(`${pad(h)}:${pad(m)}:${pad(s)}`);
    }

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return label;
}

interface SpotsState {
  value: number;
  nextAt: number;
}

/** Remaining-places counter that ticks down every 8-12 minutes, floored at 1. */
export function useSpots(): number | null {
  const [spots, setSpots] = useState<number | null>(null);

  useEffect(() => {
    function nextInterval() {
      return (8 + Math.random() * 4) * 60 * 1000;
    }

    function load(): SpotsState {
      try {
        const raw = window.localStorage.getItem(SPOTS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<SpotsState>;
          if (typeof parsed.value === "number" && typeof parsed.nextAt === "number") {
            return { value: parsed.value, nextAt: parsed.nextAt };
          }
        }
      } catch {
        /* fall through to a fresh counter */
      }
      const fresh: SpotsState = {
        value: 2 + Math.floor(Math.random() * 3),
        nextAt: Date.now() + nextInterval(),
      };
      window.localStorage.setItem(SPOTS_KEY, JSON.stringify(fresh));
      return fresh;
    }

    let state = load();

    function tick() {
      if (Date.now() >= state.nextAt && state.value > 1) {
        state = { value: state.value - 1, nextAt: Date.now() + nextInterval() };
        window.localStorage.setItem(SPOTS_KEY, JSON.stringify(state));
      }
      setSpots(state.value);
    }

    tick();
    const interval = window.setInterval(tick, 15_000);
    return () => window.clearInterval(interval);
  }, []);

  return spots;
}
