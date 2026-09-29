import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({ label, value, loading }: { label: string; value: number | string; loading?: boolean }) {
  return (
    <Card className="gap-2 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-semibold tabular-nums">
        {loading ? <Skeleton className="h-9 w-12" /> : value}
      </CardContent>
    </Card>
  );
}
