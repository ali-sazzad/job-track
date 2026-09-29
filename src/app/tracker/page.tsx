import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site";
import { TrackerClient } from "./tracker-client";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/tracker") },
  title: "Tracker",
  description: "Track job applications with client-side search/filter/sort and local persistence.",
};

export default function TrackerPage() {
  return <TrackerClient />;
}
