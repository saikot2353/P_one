import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import { MarketingTargetPlanningView } from "../components/marketing-merchandising/MarketingTargetPlanningView";

export const Route = createFileRoute("/mm-marketing-target-planning")({
  head: () => ({
    meta: [
      { title: "Marketing Target Planning — CriptonHRIS" },
      {
        name: "description",
        content: "Buyer-wise annual target setup, recurring monthly baselines, Target Qty, Target FOB, and 15% extra calculations.",
      },
    ],
  }),
  component: MMMarketingTargetPlanningPage,
});

function MMMarketingTargetPlanningPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-marketing-target-planning"
      breadcrumbs={[
        { label: "Marketing & Merchandising", to: "/mm-dashboard" },
        { label: "Marketing Planning & Performance", to: "/mm-marketing-target-planning" },
        { label: "Marketing Target Planning", to: "/mm-marketing-target-planning" },
      ]}
      title="Marketing Target Planning"
    >
      <MarketingTargetPlanningView />
    </MarketingMerchandisingLayout>
  );
}

export default MMMarketingTargetPlanningPage;
