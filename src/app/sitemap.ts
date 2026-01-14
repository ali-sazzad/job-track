import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://job-track-ruby.vercel.app/"; // replace after deploy

  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/tracker`, lastModified: new Date() },
    { url: `${base}/insights`, lastModified: new Date() },
    { url: `${base}/settings`, lastModified: new Date() },
  ];
}