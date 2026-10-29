import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import { TargetVsAchievementReportView } from "../components/marketing-merchandising/TargetVsAchievementReportView";

export const Route = createFileRoute("/mm-target-vs-achievement-report")({
  head: () => ({
    meta: [
      { title: "Target vs Achievement Report — CriptonHRIS" },
      {
        name: "description",
        content: "Monthly recurring marketing targets and actual achievements, quantity variance, FOB variance, achievement percentage, and yearly totals.",
      },
    ],
  }),
  component: MMTargetVsAchievementReportPage,
});

function MMTargetVsAchievementReportPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-target-vs-achievement-report"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Marketing Planning & Performance", to: "/mm-marketing-target-planning" },
        { label: "Target vs Achievement Report", to: "/mm-target-vs-achievement-report" },
      ]}
      title="Target vs Achievement Report"
    >
      <TargetVsAchievementReportView />
    </MarketingMerchandisingLayout>
  );
}

export default MMTargetVsAchievementReportPage;
