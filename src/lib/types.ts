export type JobStatus = "applied" | "interview" | "offer" | "rejected";

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;

  // Optional fields
  appliedDate?: string; // yyyy-mm-dd
  link?: string;
  notes?: string;

  // Metadata for sorting
  createdAt: number; // Date.now()
  updatedAt: number; // Date.now()
};

export const STATUS_LABEL: Record<JobStatus, string> = {
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const STATUS_ORDER: JobStatus[] = ["applied", "interview", "offer", "rejected"];

export type Density = "comfort" | "compact";

export type SortMode = "newest" | "oldest" | "company" | "status";

export const SORT_LABEL: Record<SortMode, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  company: "Company A–Z",
  status: "Status (pipeline order)",
};

export type UserPrefs = {
  density: Density;
  defaultSort: SortMode;
};

export const DEFAULT_PREFS: UserPrefs = {
  density: "comfort",
  defaultSort: "newest",
};

export const EMPTY_APPS: JobApplication[] = [];

/* ------------------------------------------------------------------ */
/* Runtime guards: localStorage is user-editable, so never trust it.   */
/* ------------------------------------------------------------------ */

function isStatus(v: unknown): v is JobStatus {
  return typeof v === "string" && (STATUS_ORDER as string[]).includes(v);
}

function optString(v: unknown) {
  return typeof v === "string" && v.trim() ? v : undefined;
}

export function parseApps(raw: unknown): JobApplication[] {
  if (!Array.isArray(raw)) return EMPTY_APPS;
  const out: JobApplication[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const a = item as Record<string, unknown>;
    if (typeof a.id !== "string" || typeof a.company !== "string" || typeof a.role !== "string") continue;
    if (!isStatus(a.status)) continue;
    const createdAt = typeof a.createdAt === "number" ? a.createdAt : Date.now();
    out.push({
      id: a.id,
      company: a.company,
      role: a.role,
      status: a.status,
      appliedDate: optString(a.appliedDate),
      link: optString(a.link),
      notes: optString(a.notes),
      createdAt,
      updatedAt: typeof a.updatedAt === "number" ? a.updatedAt : createdAt,
    });
  }
  return out;
}

export function parsePrefs(raw: unknown): UserPrefs {
  if (!raw || typeof raw !== "object") return DEFAULT_PREFS;
  const p = raw as Record<string, unknown>;
  return {
    density: p.density === "compact" ? "compact" : "comfort",
    defaultSort:
      typeof p.defaultSort === "string" && p.defaultSort in SORT_LABEL
        ? (p.defaultSort as SortMode)
        : DEFAULT_PREFS.defaultSort,
  };
}
