import type { MetadataRoute } from "next";
import { SITE_DESC, SITE_NAME } from "@/lib/site";

// Generated at build time (required for the GitHub Pages static export).
export const dynamic = "force-static";

// Paths are relative to the manifest, so they work on Vercel (/) and GitHub Pages (/job-track/).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESC,
    id: "./",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#171717",
    icons: [
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
