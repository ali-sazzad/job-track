import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/settings") },
  title: "Settings",
  description: "Preferences and data controls for JobTrack (stored locally).",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
