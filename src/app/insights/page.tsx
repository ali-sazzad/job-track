import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/site";
import { InsightsClient } from "./insights-client";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/insights") },
  title: "Insights",
  description: "Lightweight analytics from your saved job applications — frontend-only.",
};

export default function InsightsPage() {
  return <InsightsClient />;
}
