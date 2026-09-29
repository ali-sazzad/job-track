"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { scrollToTop } from "@/lib/scroll";

const SHOW_AFTER_PX = 400;

/** Floating "back to top" button, shown once the user has scrolled down a bit. */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Button
      size="icon-lg"
      variant="outline"
      aria-label="Scroll to top"
      title="Scroll to top"
      onClick={() => {
        scrollToTop();
        // Keyboard users: move focus back to the top of the page too.
        document.getElementById("site-logo")?.focus({ preventScroll: true });
      }}
      className="fixed right-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 rounded-full bg-background/90 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-2"
    >
      <ArrowUpIcon />
    </Button>
  );
}
