import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://job-track-ruby.vercel.app/"; // replace after deploy

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