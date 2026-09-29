import {
  STATUS_ORDER,
  parseApps,
  parsePrefs,
  type JobApplication,
  type JobStatus,
  type SortMode,
  type UserPrefs,
} from "@/lib/types";

const DAY = 1000 * 60 * 60 * 24;

export function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function isValidUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const dateFmt = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

export function formatYMD(ymd: string) {
  const d = new Date(`${ymd}T00:00:00`);
  return Number.isNaN(d.getTime()) ? ymd : dateFmt.format(d);
}

export function formatTimestamp(ts: number) {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? String(ts) : dateFmt.format(d);
}

export function filterAndSort(
  apps: JobApplication[],
  { query, status, sort }: { query: string; status: JobStatus | "all"; sort: SortMode },
) {
  const q = query.trim().toLowerCase();

  const list = apps.filter((a) => {
    if (status !== "all" && a.status !== status) return false;
    if (!q) return true;
    return `${a.company} ${a.role} ${a.notes ?? ""}`.toLowerCase().includes(q);
  });

  return list.sort((a, b) => {
    switch (sort) {
      case "company":
        return a.company.localeCompare(b.company) || b.createdAt - a.createdAt;
      case "status":
        return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || b.createdAt - a.createdAt;
      case "oldest":
        return a.createdAt - b.createdAt;
      default:
        return b.createdAt - a.createdAt;
    }
  });
}

export function groupByStatus(apps: JobApplication[]) {
  const map: Record<JobStatus, JobApplication[]> = {
    applied: [],
    interview: [],
    offer: [],
    rejected: [],
  };
  for (const app of apps) map[app.status].push(app);
  return map;
}

export function countByStatus(apps: JobApplication[]) {
  const counts: Record<JobStatus, number> = { applied: 0, interview: 0, offer: 0, rejected: 0 };
  for (const app of apps) counts[app.status]++;
  return counts;
}

export function demoApplications(now = Date.now()): JobApplication[] {
  const mk = (
    daysAgo: number,
    a: Omit<JobApplication, "id" | "createdAt" | "updatedAt">,
  ): JobApplication => ({
    id: makeId(),
    createdAt: now - daysAgo * DAY,
    updatedAt: now - daysAgo * DAY,
    ...a,
  });

  return [
    mk(2, {
      company: "Canva",
      role: "Junior Frontend Developer",
      status: "interview",
      notes: "Prepare accessibility examples + explain state handling.",
    }),
    mk(5, {
      company: "Atlassian",
      role: "Software Engineer (Grad)",
      status: "applied",
      link: "https://example.com",
    }),
    mk(10, {
      company: "Shopify",
      role: "Frontend Engineer (Junior)",
      status: "offer",
      notes: "Document tradeoffs + deploy to Vercel.",
    }),
    mk(14, {
      company: "Canva",
      role: "Design Systems Engineer",
      status: "rejected",
      notes: "Ask for feedback; reapply in 6 months.",
    }),
    mk(1, {
      company: "Xero",
      role: "Graduate Web Developer",
      status: "applied",
    }),
  ];
}

export function toCsv(apps: JobApplication[]) {
  const headers = ["company", "role", "status", "appliedDate", "link", "notes", "createdAt", "updatedAt"];

  // Quote every cell and double inner quotes. Prefix formula-like values to
  // stop spreadsheet apps from executing them (CSV injection).
  const escape = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replaceAll(`"`, `""`)}"`;
  };

  const rows = apps.map((a) => [
    a.company,
    a.role,
    a.status,
    a.appliedDate ?? "",
    a.link ?? "",
    a.notes ?? "",
    new Date(a.createdAt).toISOString(),
    new Date(a.updatedAt).toISOString(),
  ]);

  return [headers.join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
}

export function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // Revoke on the next tick so the download has started in every browser.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Parse a JobTrack JSON export (the `{ exportedAt, apps, prefs }` shape from
 * Settings, or a bare array of applications). Invalid entries are dropped by
 * the same guards used for localStorage. Throws if the file isn't usable.
 */
export function parseImport(text: string): { apps: JobApplication[]; prefs: UserPrefs | null } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("That file isn't valid JSON.");
  }

  const isExport = !!raw && typeof raw === "object" && !Array.isArray(raw);
  const rawApps = isExport ? (raw as Record<string, unknown>).apps : raw;
  if (!Array.isArray(rawApps)) throw new Error("No applications found in that file.");

  const apps = parseApps(rawApps);
  if (rawApps.length > 0 && apps.length === 0) throw new Error("None of the applications in that file were valid.");

  const rawPrefs = isExport ? (raw as Record<string, unknown>).prefs : undefined;
  return { apps, prefs: rawPrefs ? parsePrefs(rawPrefs) : null };
}

/** Merge imported applications by id; on a clash the most recently updated copy wins. */
export function mergeApplications(current: JobApplication[], incoming: JobApplication[]) {
  const byId = new Map(current.map((a) => [a.id, a]));
  let added = 0;
  let updated = 0;
  for (const app of incoming) {
    const existing = byId.get(app.id);
    if (!existing) {
      byId.set(app.id, app);
      added++;
    } else if (app.updatedAt > existing.updatedAt) {
      byId.set(app.id, app);
      updated++;
    }
  }
  return { merged: [...byId.values()], added, updated };
}
