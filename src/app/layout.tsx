import type { Metadata } from "next";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { PrefsSync } from "@/components/prefs-sync";
import { SkipToContent } from "@/components/skip-to-content";

const SITE_NAME = "JobTrack";
const SITE_DESC =
  "A recruiter-friendly job application tracker with pipeline, filters, insights, and local persistence.";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // replace with your Vercel URL after deploy
  title: {
    default: SITE_NAME,
    template: `%s • ${SITE_NAME}`,
  },
  description: SITE_DESC,

  // Good default for SEO crawl
  robots: {
    index: true,
    follow: true,
  },

  // Nice share previews
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESC,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <PrefsSync />

        {/* A11y: keyboard users can skip repeated navigation */}
        <SkipToContent />

        <SiteHeader />

        {/* A11y: main landmark with a stable skip target */}
        <main id="content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {children}
        </main>

        <SiteFooter />
        <Toaster richColors />
      </body>
    </html>
  );
}
