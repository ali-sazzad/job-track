import type { Metadata } from "next";
import { TrackerClient } from "./tracker-client";

export const metadata: Metadata = {
  title: "Tracker",
  description: "Track job applications with client-side search/filter/sort and local persistence.",
};

export default function TrackerPage() {
  return <TrackerClient />;
}
