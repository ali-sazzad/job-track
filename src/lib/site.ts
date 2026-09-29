export const SITE_NAME = "JobTrack";

export const SITE_DESC =
  "A recruiter-friendly job application tracker with pipeline, filters, insights, and local persistence.";

/** Set NEXT_PUBLIC_SITE_URL in your deployment; falls back to the Vercel URL, then localhost. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/tracker", label: "Tracker" },
  { href: "/insights", label: "Insights" },
  { href: "/settings", label: "Settings" },
] as const;
