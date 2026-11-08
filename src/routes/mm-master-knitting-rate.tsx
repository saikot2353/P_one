import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import KnittingRateManager from "../components/marketing-merchandising/master-data/KnittingRateManager";

export const Route = createFileRoute("/mm-master-knitting-rate")({
  head: () => ({
    meta: [
      { title: "Knitting Process Rate Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Manage Knitting Process Rate master records by Fitter Type, Fabric Type, Process Loss (%), and Knitting Rate.",
      },
    ],
  }),
  component: MMKnittingRatePage,
});

function MMKnittingRatePage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-knitting-rate"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-fabric-composition" },
        { label: "Knitting Process Rate" },
      ]}
      title="Knitting Process Rate Master"
      subtitle="Standardized knitting machine process rates and process loss percentages linked to active Fabric Types."
    >
      <KnittingRateManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMKnittingRatePage;
