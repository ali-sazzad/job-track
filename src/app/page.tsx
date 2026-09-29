import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PipelinePreview } from "@/components/pipeline-preview";

export const metadata: Metadata = {
  title: { absolute: "JobTrack — Job application tracker" },
  description:
    "JobTrack helps you manage your job applications with a clean pipeline, fast filtering, and insights.",
};

const HIGHLIGHTS = [
  { title: "Pipeline UI", desc: "Clear statuses + scan-friendly layout" },
  { title: "Fast controls", desc: "Search + filter + sort client-side" },
  { title: "Good UX states", desc: "Empty / filtered / success handling" },
];

const STEPS = [
  { title: "1) Add applications", desc: "Company, role, status, link, notes — validated and clean." },
  { title: "2) Filter your pipeline", desc: "Search + filter + sort instantly (no backend)." },
  { title: "3) Review insights", desc: "Lightweight analytics to stay consistent and focused." },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="inline-flex items-center rounded-full border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
            Frontend-only • LocalStorage • Recruiter-readable
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            A job application tracker that feels like a real internal tool.
          </h1>

          <p className="mt-4 max-w-prose text-base text-pretty text-muted-foreground sm:text-lg">
            Add applications, update statuses, filter instantly, and review lightweight insights. Built with Next.js +
            TypeScript + Tailwind + shadcn/ui — no backend required.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="min-w-40">
              <Link href="/tracker">Start tracking</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-w-40">
              <Link href="/insights">See insights</Link>
            </Button>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {HIGHLIGHTS.map((x) => (
              <li key={x.title}>
                <Card className="h-full gap-2 rounded-2xl py-5">
                  <CardHeader className="px-5">
                    <CardTitle className="text-sm">{x.title}</CardTitle>
                    <CardDescription>{x.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <PipelinePreview />
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="sr-only">
          How it works
        </h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((x) => (
            <li key={x.title}>
              <Card className="h-full rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-base">{x.title}</CardTitle>
                  <CardDescription>{x.desc}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="rounded-3xl border bg-card p-8 shadow-sm sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">Ready to use the tracker?</h2>
            <p className="mt-2 text-muted-foreground">Everything saves locally — refresh-safe and demo-friendly.</p>
          </div>
          <Button asChild size="lg" className="min-w-44">
            <Link href="/tracker">Open tracker</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
