import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import { PrefsSync } from "@/components/prefs-sync";
import { SkipToContent } from "@/components/skip-to-content";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_DESC, SITE_NAME, SITE_URL } from "@/lib/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s • ${SITE_NAME}`,
  },
  description: SITE_DESC,
  robots: { index: true, follow: true },
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: next-themes / PrefsSync set attributes on <html> before hydration
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PrefsSync />

          {/* A11y: keyboard users can skip repeated navigation */}
          <SkipToContent />

          <SiteHeader />

          {/* A11y: main landmark with a stable skip target */}
          <main id="content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-10 outline-none sm:px-6">
            {children}
          </main>

          <SiteFooter />
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
