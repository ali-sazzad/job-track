import type { MetadataRoute } from "next";
import { NAV, SITE_URL } from "@/lib/site";

// Generated at build time (required for the GitHub Pages static export).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return NAV.map((item) => ({ url: `${SITE_URL}${item.href === "/" ? "" : item.href}`, lastModified }));
}
