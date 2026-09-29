"use client";

import * as React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { NativeSelect } from "@/components/native-select";
import { StatCard } from "@/components/stat-card";
import { JobCard } from "@/components/tracker/job-card";
import { JobFormDialog, type JobFormValues } from "@/components/tracker/job-form-dialog";
import { countByStatus, demoApplications, filterAndSort, groupByStatus, makeId } from "@/lib/jobs";
import { useApplications, useHydrated, usePrefs } from "@/lib/storage";
import {
  SORT_LABEL,
  STATUS_LABEL,
  STATUS_ORDER,
  type JobApplication,
  type JobStatus,
  type SortMode,
} from "@/lib/types";
import { TrackerSkeleton } from "./tracker-skeleton";

export function TrackerClient() {
  const hydrated = useHydrated();
  const [apps, setApps] = useApplications();
  const [prefs] = usePrefs();

  // Controls. `sort` stays null until the user picks one, so the saved default applies.
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<JobStatus | "all">("all");
  const [sortOverride, setSortOverride] = React.useState<SortMode | null>(null);
  const sort = sortOverride ?? prefs.defaultSort;

  // Add/edit dialog
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<JobApplication | null>(null);

  // Destructive dialogs
  const [deleteTarget, setDeleteTarget] = React.useState<JobApplication | null>(null);
  const [clearOpen, setClearOpen] = React.useState(false);

  const filtered = React.useMemo(
    () => filterAndSort(apps, { query, status: statusFilter, sort }),
    [apps, query, statusFilter, sort],
  );
  const grouped = React.useMemo(() => groupByStatus(filtered), [filtered]);
  const counts = React.useMemo(() => countByStatus(apps), [apps]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(app: JobApplication) {
    setEditing(app);
    setFormOpen(true);
  }

  function handleSubmit(values: JobFormValues) {
    const now = Date.now();
    if (editing) {
      setApps((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...values, updatedAt: now } : a)));
      toast.success("Application updated.");
    } else {
      setApps((prev) => [{ id: makeId(), createdAt: now, updatedAt: now, ...values }, ...prev]);
      toast.success("Application added.");
    }
    setFormOpen(false);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const removed = deleteTarget;
    setApps((prev) => prev.filter((a) => a.id !== removed.id));
    setDeleteTarget(null);
    toast.success("Deleted.", {
      description: `${removed.company} — ${removed.role}`,
      action: {
        label: "Undo",
        onClick: () => setApps((prev) => (prev.some((a) => a.id === removed.id) ? prev : [removed, ...prev])),
      },
    });
  }

  function seedDemo() {
    setApps(demoApplications());
    toast.success("Demo data loaded.");
  }

  function confirmClearAll() {
    setApps([]);
    setClearOpen(false);
    toast.success("All applications cleared.");
  }

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
    setSortOverride(null);
    toast.message("Filters reset.");
  }

  if (!hydrated) return <TrackerSkeleton />;

  const noData = apps.length === 0;
  const filteredToZero = !noData && filtered.length === 0;

  return (
    <div className="flex flex-col gap-(--jt-space)">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tracker</h1>
          <p className="mt-1 text-muted-foreground">
            Add applications, filter instantly, and keep your pipeline consistent — persisted in localStorage.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={seedDemo} disabled={!noData} title={noData ? undefined : "Clear data first to load the demo"}>
            Load demo data
          </Button>
          <Button variant="outline" onClick={() => setClearOpen(true)} disabled={noData}>
            Clear all
          </Button>
          <Button onClick={openAdd}>
            <PlusIcon /> Add application
          </Button>
        </div>
      </div>

      {/* Stats */}
      <section aria-label="Pipeline totals" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total" value={apps.length} />
        {STATUS_ORDER.map((s) => (
          <StatCard key={s} label={STATUS_LABEL[s]} value={counts[s]} />
        ))}
      </section>

      {/* Controls */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base">Controls</CardTitle>
          <CardDescription>Search by company, role, or notes; filter by status; and sort your results.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-6">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company, role, notes…"
              aria-label="Search applications"
            />
          </div>

          <div className="md:col-span-3">
            <NativeSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as JobStatus | "all")}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="md:col-span-3">
            <NativeSelect
              value={sort}
              onChange={(e) => setSortOverride(e.target.value as SortMode)}
              aria-label="Sort applications"
            >
              {(Object.keys(SORT_LABEL) as SortMode[]).map((m) => (
                <option key={m} value={m}>
                  {SORT_LABEL[m]}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="flex items-center justify-between pt-1 text-sm text-muted-foreground md:col-span-12">
            <p aria-live="polite">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
              <span className="font-semibold text-foreground">{apps.length}</span>
            </p>
            <Link className="rounded underline underline-offset-4 hover:text-foreground" href="/insights">
              View insights →
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Board / empty states */}
      {noData ? (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">No applications yet</CardTitle>
            <CardDescription>
              Add your first role — it will persist after refresh. Or load demo data for a quick showcase.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button onClick={openAdd}>Add application</Button>
            <Button variant="secondary" onClick={seedDemo}>
              Load demo data
            </Button>
          </CardContent>
        </Card>
      ) : filteredToZero ? (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">No results</CardTitle>
            <CardDescription>Your filters/search removed everything. Reset filters to see all items again.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={resetFilters}>
              Reset filters
            </Button>
            <Button onClick={openAdd}>Add application</Button>
          </CardContent>
        </Card>
      ) : (
        <section aria-label="Pipeline board" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUS_ORDER.map((status) => (
            <Card key={status} className="gap-3 rounded-3xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    <h2>{STATUS_LABEL[status]}</h2>
                  </CardTitle>
                  <span className="text-xs text-muted-foreground tabular-nums">{grouped[status].length}</span>
                </div>
              </CardHeader>

              <CardContent>
                {grouped[status].length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-4">
                    <p className="text-sm font-semibold">Empty</p>
                    <p className="mt-1 text-sm text-muted-foreground">No items in this column right now.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {grouped[status].map((app) => (
                      <JobCard key={app.id} app={app} onEdit={openEdit} onDelete={setDeleteTarget} />
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      <JobFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete application?"
        description={
          <>
            This will remove{" "}
            <span className="font-semibold text-foreground">
              {deleteTarget ? `${deleteTarget.company} — ${deleteTarget.role}` : "this item"}
            </span>{" "}
            from this browser.
          </>
        }
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Clear all applications?"
        description="This removes all saved applications from this browser. Preferences remain in Settings."
        confirmLabel="Clear all"
        onConfirm={confirmClearAll}
      />
    </div>
  );
}
