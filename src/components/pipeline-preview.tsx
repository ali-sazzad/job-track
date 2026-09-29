"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { countByStatus } from "@/lib/jobs";
import { useApplications, useHydrated } from "@/lib/storage";
import { STATUS_LABEL, STATUS_ORDER } from "@/lib/types";

/** Home page card showing the visitor's real pipeline counts. */
export function PipelinePreview() {
  const hydrated = useHydrated();
  const [apps] = useApplications();
  const counts = countByStatus(apps);

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-base">Your pipeline</CardTitle>
        <CardDescription>
          {!hydrated ? "Loading…" : apps.length === 0 ? "Nothing tracked yet — add your first application." : `${apps.length} application${apps.length === 1 ? "" : "s"} saved in this browser.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
            <p className="text-sm font-semibold">{STATUS_LABEL[s]}</p>
            {hydrated ? (
              <span className="text-xs text-muted-foreground tabular-nums">{counts[s]}</span>
            ) : (
              <Skeleton className="h-4 w-4" />
            )}
          </div>
        ))}
        <Button asChild variant="secondary" className="w-full">
          <Link href="/tracker">Go to tracker</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
