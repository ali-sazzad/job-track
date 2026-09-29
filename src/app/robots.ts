import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Generated at build time (required for the GitHub Pages static export).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
