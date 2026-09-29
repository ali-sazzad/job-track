"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

const linkBase =
  "rounded-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          <span className="grid size-9 place-items-center rounded-xl border bg-card text-sm font-semibold tracking-tight shadow-sm">
            JT
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight">JobTrack</span>
            <span className="block text-xs text-muted-foreground">Application tracker</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(linkBase, "px-3 py-2 text-sm font-medium", active && "bg-muted text-foreground shadow-sm")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" className="hidden sm:inline-flex">
            <Link href="/insights">View insights</Link>
          </Button>
          <Button asChild>
            <Link href="/tracker">Open tracker</Link>
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav aria-label="Primary mobile" className="border-t bg-background md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-4 gap-1 px-2 py-2 sm:px-6">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(linkBase, "px-2 py-2 text-center text-xs font-semibold", active && "bg-muted text-foreground")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
