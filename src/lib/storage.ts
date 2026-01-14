"use client";

import { useEffect, useRef, useState } from "react";

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
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * useLocalStorageState
 * - Reads once on mount
 * - Avoids writing back immediately on first render
 * - Still writes whenever state changes after that
 */
export function useLocalStorageState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => loadJson<T>(key, initial));
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      return;
    }
    saveJson(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
