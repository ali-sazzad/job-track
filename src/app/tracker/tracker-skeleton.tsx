import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TrackerSkeleton() {
  return (
    <div className="flex flex-col gap-(--jt-space)" aria-busy="true" aria-label="Loading tracker">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-4 w-80 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-3xl" />
        ))}
      </div>

      <Card className="rounded-3xl">
        <CardHeader>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-12">
          <Skeleton className="h-9 md:col-span-6" />
          <Skeleton className="h-9 md:col-span-3" />
          <Skeleton className="h-9 md:col-span-3" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-3xl">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 2 }).map((__, j) => (
                <div key={j} className="rounded-2xl border p-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-2 h-3 w-40" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
