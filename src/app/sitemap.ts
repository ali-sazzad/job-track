import type { MetadataRoute } from "next";
import { NAV, canonicalUrl } from "@/lib/site";

// Generated at build time (required for the GitHub Pages static export).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return NAV.map((item) => ({ url: canonicalUrl(item.href), lastModified }));
}
