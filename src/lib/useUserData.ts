"use client";

import { useMemo, useSyncExternalStore } from "react";
import { STORAGE_KEY, type UserData } from "./topics";
import type { TopicId } from "./runes";

/**
 * localStorage is an external store, so it is read through useSyncExternalStore
 * rather than copied into state from an effect. The server snapshot is null,
 * which keeps the prerendered markup and the first client render identical.
 */
function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getSnapshot(): string | null {
  return window.localStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot(): string | null {
  return null;
}

function parse(raw: string | null): UserData | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<UserData>;
    if (!parsed.name || !parsed.email) return null;
    return {
      name: parsed.name,
      email: parsed.email,
      topic: (parsed.topic ?? "path") as TopicId,
      question: parsed.question ?? "",
    };
  } catch {
    return null;
  }
}

export function useUserData(): UserData | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parse(raw), [raw]);
}
