import type { MetadataRoute } from "next";
import { NAV, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return NAV.map((item) => ({ url: `${SITE_URL}${item.href === "/" ? "" : item.href}`, lastModified }));
}
