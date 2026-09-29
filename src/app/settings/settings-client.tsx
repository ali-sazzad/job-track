"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { NativeSelect } from "@/components/native-select";
import { downloadTextFile, toCsv } from "@/lib/jobs";
import { STORAGE_KEYS, removeStorage, useApplications, useHydrated, usePrefs } from "@/lib/storage";
import { SORT_LABEL, type Density, type SortMode } from "@/lib/types";

function Row({ title, description, children }: { title: string; description: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div className="flex shrink-0 gap-2">{children}</div>
    </div>
  );
}

export function SettingsClient() {
  const hydrated = useHydrated();
  const [apps, setApps] = useApplications();
  const [prefs, setPrefs] = usePrefs();
  const { theme, setTheme } = useTheme();

  const appCount = apps.length;

  function setDensity(density: Density) {
    setPrefs((p) => ({ ...p, density }));
    toast.success(`Density set to ${density}.`);
  }

  function setDefaultSort(defaultSort: SortMode) {
    setPrefs((p) => ({ ...p, defaultSort }));
    toast.success("Default sort saved.");
  }

  function exportJson() {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), apps, prefs }, null, 2);
    downloadTextFile("jobtrack-export.json", payload, "application/json");
    toast.success("Exported JSON.");
  }

  function exportCsv() {
    downloadTextFile("jobtrack-applications.csv", toCsv(apps), "text/csv;charset=utf-8");
    toast.success("Exported CSV.");
  }

  function clearAppsOnly() {
    setApps([]);
    toast.success("Applications cleared.");
  }

  function factoryReset() {
    // Remove keys entirely (clean reset); subscribers fall back to defaults.
    removeStorage(STORAGE_KEYS.apps);
    removeStorage(STORAGE_KEYS.prefs);
    setTheme("system");
    toast.success("All data cleared (apps + prefs).");
  }

  return (
    <div className="flex flex-col gap-(--jt-space)">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Preferences and data controls. Everything is stored locally in your browser.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Preferences */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">
              <h2>UI preferences</h2>
            </CardTitle>
            <CardDescription>Stored in localStorage so it persists across refresh.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-(--jt-space-sm)">
            <Row title="Density" description="Tighter spacing for smaller screens or long lists.">
              <div role="group" aria-label="Density" className="inline-flex rounded-md border p-0.5">
                {(["comfort", "compact"] as const).map((d) => {
                  const active = hydrated && prefs.density === d;
                  return (
                    <Button
                      key={d}
                      size="sm"
                      variant={active ? "secondary" : "ghost"}
                      aria-pressed={active}
                      onClick={() => setDensity(d)}
                      className="capitalize"
                    >
                      {d}
                    </Button>
                  );
                })}
              </div>
            </Row>

            <Row title="Theme" description="Follow your system or pick one.">
              {hydrated ? (
                <NativeSelect value={theme ?? "system"} onChange={(e) => setTheme(e.target.value)} aria-label="Theme" className="w-36">
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </NativeSelect>
              ) : (
                <Skeleton className="h-9 w-36" />
              )}
            </Row>

            <div className="flex flex-col gap-2 rounded-2xl border bg-card px-4 py-3">
              <div>
                <label htmlFor="default-sort" className="text-sm font-semibold">
                  Default sort
                </label>
                <p className="text-sm text-muted-foreground">Used as the starting sort on the Tracker page.</p>
              </div>
              <NativeSelect
                id="default-sort"
                value={prefs.defaultSort}
                onChange={(e) => setDefaultSort(e.target.value as SortMode)}
                disabled={!hydrated}
              >
                {(Object.keys(SORT_LABEL) as SortMode[]).map((m) => (
                  <option key={m} value={m}>
                    {SORT_LABEL[m]}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base">
              <h2>Data</h2>
            </CardTitle>
            <CardDescription>Export for backup or clear to reset your demo.</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-(--jt-space-sm)">
            <Row
              title="Export"
              description={
                hydrated ? `${appCount} application${appCount === 1 ? "" : "s"} stored` : <Skeleton className="mt-1 h-4 w-32" />
              }
            >
              <Button variant="secondary" onClick={exportJson} disabled={!hydrated}>
                JSON
              </Button>
              <Button variant="outline" onClick={exportCsv} disabled={!hydrated || appCount === 0}>
                CSV
              </Button>
            </Row>

            <Row title="Clear applications" description="Keeps preferences.">
              <ConfirmDialog
                trigger={
                  <Button variant="outline" disabled={!hydrated || appCount === 0}>
                    Clear
                  </Button>
                }
                title="Clear applications?"
                description="This removes all saved applications from this browser. Preferences will remain."
                confirmLabel="Clear applications"
                onConfirm={clearAppsOnly}
              />
            </Row>

            <Row title="Factory reset" description="Clears apps + prefs (full reset).">
              <ConfirmDialog
                trigger={
                  <Button variant="destructive" disabled={!hydrated}>
                    Reset
                  </Button>
                }
                title="Reset everything?"
                description="This clears applications and preferences from localStorage. This cannot be undone."
                confirmLabel="Reset"
                onConfirm={factoryReset}
              />
            </Row>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
