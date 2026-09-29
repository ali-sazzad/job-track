import type { NextConfig } from "next";

// GitHub Pages serves a static export from https://<user>.github.io/job-track/.
// Only the Pages workflow sets GITHUB_PAGES, so Vercel builds are unaffected.
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/job-track";

const nextConfig: NextConfig = {
  reactCompiler: true,
  ...(isGitHubPages && {
    output: "export",
    basePath: repoBasePath,
    // Emit /tracker/index.html so Pages serves /job-track/tracker/ without rewrites.
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
