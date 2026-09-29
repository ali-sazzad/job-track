"use client";

import { useCallback, useSyncExternalStore } from "react";

import {
  DEFAULT_PREFS,
  EMPTY_APPS,
  parseApps,
  parsePrefs,
  type JobApplication,
  type UserPrefs,
} from "@/lib/types";

export const STORAGE_KEYS = {
  apps: "jobtrack.apps.v1",
  prefs: "jobtrack.prefs.v1",
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * A tiny external store over localStorage.
 *
 * - Every component reading the same key shares one source of truth, so a
 *   change in Settings is reflected immediately in the header / PrefsSync.
 * - The server snapshot is always the fallback, so SSR and the first client
 *   render agree (no hydration mismatch); React swaps in the stored value
 *   right after hydration.
 * - Other tabs stay in sync through the native `storage` event.
 * - Parsed values are cached by raw string so snapshots are referentially
 *   stable, which useSyncExternalStore requires.
 */

const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // private mode / blocked storage
  }
}

function read<T>(key: string, fallback: T, parse: (raw: unknown) => T): T {
  const raw = readRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;

  let value = fallback;
  if (raw) {
    try {
      value = parse(JSON.parse(raw));
    } catch {
      value = fallback; // corrupted JSON: recover silently
    }
  }
  cache.set(key, { raw, value });
  return value;
}

function emit(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

function subscribe(key: string, fn: () => void) {
  let set = listeners.get(key);
  if (!set) listeners.set(key, (set = new Set()));
  set.add(fn);

  const onStorage = (e: StorageEvent) => {
    if (e.key === key || e.key === null) fn();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

export function writeStorage(key: StorageKey, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded / blocked storage: keep the app usable.
  }
  emit(key);
}

export function removeStorage(key: StorageKey) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
  emit(key);
}

type SetState<T> = (next: T | ((prev: T) => T)) => void;

function useStoredValue<T>(
  key: StorageKey,
  fallback: T,
  parse: (raw: unknown) => T,
): readonly [T, SetState<T>] {
  const value = useSyncExternalStore(
    (fn) => subscribe(key, fn),
    () => read(key, fallback, parse),
    () => fallback,
  );

  const setValue = useCallback<SetState<T>>(
    (next) => {
      const prev = read(key, fallback, parse);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeStorage(key, resolved);
    },
    [key, fallback, parse],
  );

  return [value, setValue] as const;
}

export function useApplications() {
  return useStoredValue<JobApplication[]>(STORAGE_KEYS.apps, EMPTY_APPS, parseApps);
}

export function usePrefs() {
  return useStoredValue<UserPrefs>(STORAGE_KEYS.prefs, DEFAULT_PREFS, parsePrefs);
}

const noopSubscribe = () => () => {};

/** false during SSR + hydration, true afterwards. Used to avoid flashing empty states. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
