export const SITE_NAME = "JobTrack";

export const SITE_DESC =
  "A recruiter-friendly job application tracker with pipeline, filters, insights, and local persistence.";

/**
 * Canonical public URL (GitHub Pages, the repo homepage). The Vercel deployment
 * points its canonical/sitemap here too, so search engines see one site.
 * Override with NEXT_PUBLIC_SITE_URL if the primary host changes.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ali-sazzad.github.io/job-track").replace(
  /\/+$/,
  "",
);

/** Absolute canonical URL for an app route, in the trailing-slash form GitHub Pages serves. */
export function canonicalUrl(route: string) {
  return `${SITE_URL}${route === "/" ? "/" : `${route.replace(/\/+$/, "")}/`}`;
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/tracker", label: "Tracker" },
  { href: "/insights", label: "Insights" },
  { href: "/settings", label: "Settings" },
] as const;
