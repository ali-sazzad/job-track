"use client";

import { useEffect, useState } from "react";

export const STORAGE_KEYS = {
  apps: "jobtrack.apps.v1",
  prefs: "jobtrack.prefs.v1",
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    // If JSON is corrupted, return fallback (safe recovery)
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * useLocalStorageState
 * - Beginner-friendly persistence hook
 * - Reads once on mount (safe)
 * - Writes whenever state changes
 */
export function useLocalStorageState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => loadJson<T>(key, initial));

  useEffect(() => {
    // Keep storage in sync with React state
    saveJson(key, state);
  }, [key, state]);

  return [state, setState] as const;
}