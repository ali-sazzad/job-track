import type { Metadata } from "next";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = {
  title: "Settings",
  description: "Preferences and data controls for JobTrack (stored locally).",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
