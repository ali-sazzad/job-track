import type { Metadata } from "next";
import { InsightsClient } from "./insights-client";

export const metadata: Metadata = {
  title: "Insights",
  description: "Lightweight analytics from your saved job applications — frontend-only.",
};

export default function InsightsPage() {
  return <InsightsClient />;
}
