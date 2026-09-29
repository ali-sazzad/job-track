import { ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { formatTimestamp, formatYMD } from "@/lib/jobs";
import type { JobApplication } from "@/lib/types";

type JobCardProps = {
  app: JobApplication;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
};

export function JobCard({ app, onEdit, onDelete }: JobCardProps) {
  const label = `${app.company} — ${app.role}`;

  return (
    <li className="rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold" title={app.company}>
            {app.company}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{app.role}</p>
        </div>

        <div className="flex shrink-0 gap-1">
          <Button size="icon-sm" variant="ghost" onClick={() => onEdit(app)} aria-label={`Edit ${label}`}>
            <PencilIcon />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(app)}
            aria-label={`Delete ${label}`}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={app.status} />
        <span className="text-xs text-muted-foreground">
          {app.appliedDate ? `Applied ${formatYMD(app.appliedDate)}` : `Added ${formatTimestamp(app.createdAt)}`}
        </span>
      </div>

      {app.link ? (
        <a
          className="mt-2 inline-flex items-center gap-1 rounded text-xs font-semibold underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          href={app.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open link <ExternalLinkIcon className="size-3" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : null}

      {app.notes ? <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{app.notes}</p> : null}
    </li>
  );
}
