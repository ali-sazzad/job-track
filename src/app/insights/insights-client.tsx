"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { STATUS_TONE } from "@/components/status-badge";
import { countByStatus } from "@/lib/jobs";
import { useApplications, useHydrated } from "@/lib/storage";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/types";
import { cn } from "@/lib/utils";

function pct(n: number, total: number) {
  return total === 0 ? 0 : Math.round((n / total) * 100);
}

export function InsightsClient() {
  const hydrated = useHydrated();
  const [apps] = useApplications();

  const counts = React.useMemo(() => countByStatus(apps), [apps]);
  const total = apps.length;

  const topCompanies = React.useMemo(() => {
    // Group case-insensitively so "Canva" and "canva " count together.
    const map = new Map<string, { name: string; count: number }>();
    for (const a of apps) {
      const key = a.company.trim().toLowerCase();
      const hit = map.get(key);
      if (hit) hit.count++;
      else map.set(key, { name: a.company.trim(), count: 1 });
    }
    return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 5);
  }, [apps]);

  // Anything past "applied" means the company responded.
  const responded = counts.interview + counts.offer + counts.rejected;

  return (
    <div className="flex flex-col gap-(--jt-space)">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
        <p className="mt-1 text-muted-foreground">Lightweight analytics from your locally saved applications.</p>
      </div>

      <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total" value={total} loading={!hydrated} />
        {STATUS_ORDER.map((s) => (
          <StatCard key={s} label={STATUS_LABEL[s]} value={counts[s]} loading={!hydrated} />
        ))}
        <StatCard label="Response rate" value={`${pct(responded, total)}%`} loading={!hydrated} />
      </section>

      {!hydrated ? null : total === 0 ? (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">No data yet</CardTitle>
            <CardDescription>Add some applications in the Tracker to see insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/tracker">Go to tracker</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">
                <h2>Status breakdown</h2>
              </CardTitle>
              <CardDescription>Share of all applications. Simple CSS bars (no chart libraries).</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {STATUS_ORDER.map((s) => {
                  const n = counts[s];
                  const p = pct(n, total);
                  return (
                    <li key={s} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{STATUS_LABEL[s]}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {n} <span className="text-xs">({p}%)</span>
                        </span>
                      </div>
                      <div
                        className="h-2 w-full overflow-hidden rounded-full bg-muted"
                        role="meter"
                        aria-label={`${STATUS_LABEL[s]} share`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={p}
                      >
                        <div
                          className={cn("h-full rounded-full transition-[width] duration-500", STATUS_TONE[s].bar)}
                          style={{ width: `${p}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base">
                <h2>Top companies</h2>
              </CardTitle>
              <CardDescription>Helps you spot patterns and focus your applications.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {topCompanies.map(({ name, count }) => (
                  <li key={name} className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
                    <span className="truncate text-sm font-semibold">{name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {count} application{count === 1 ? "" : "s"}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
