"use client";

import { useEffect } from "react";
import { usePrefs } from "@/lib/storage";

/**
 * PrefsSync
 * - Subscribes to saved prefs (shared store, so Settings changes apply instantly)
 * - Applies global attributes (density) to <html>
 */
export function PrefsSync() {
  const [prefs] = usePrefs();

  useEffect(() => {
    document.documentElement.dataset.density = prefs.density;
  }, [prefs.density]);

  return null;
}
