import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://example.com"; // replace after deploy

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}