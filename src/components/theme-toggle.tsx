"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useHydrated } from "@/lib/storage";

/** Header light/dark switch. Shares state with the Theme select in Settings. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      // The theme is unknown during SSR, so use a neutral label until hydrated.
      aria-label={hydrated ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      title={hydrated ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
    >
      {/* Icons swap purely via the .dark class, so there's no flash or hydration mismatch. */}
      <SunIcon className="scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
