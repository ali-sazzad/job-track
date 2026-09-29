import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, type JobStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

// Consistent, subtle tones (no loud colors), readable in both themes.
export const STATUS_TONE: Record<JobStatus, { badge: string; bar: string }> = {
  applied: {
    badge: "bg-muted text-foreground border-border",
    bar: "bg-foreground/70",
  },
  interview: {
    badge: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-900",
    bar: "bg-amber-500",
  },
  offer: {
    badge: "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-900",
    bar: "bg-emerald-500",
  },
  rejected: {
    badge: "bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-900",
    bar: "bg-rose-500",
  },
};

export function StatusBadge({ status, className }: { status: JobStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn("rounded-full px-2 py-0.5 text-xs", STATUS_TONE[status].badge, className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
