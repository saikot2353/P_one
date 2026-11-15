import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import CostHeadManager from "../components/marketing-merchandising/master-data/CostHeadManager";

export const Route = createFileRoute("/mm-master-cost-head")({
  head: () => ({
    meta: [
      { title: "Cost Head Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Manage costing heads across Fabric, Accessorie, Embellishment, and Other categories.",
      },
    ],
  }),
  component: MMCostHeadPage,
});

function MMCostHeadPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-cost-head"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "Cost Head" },
      ]}
      title="Cost Head Master"
    >
      <CostHeadManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMCostHeadPage;

