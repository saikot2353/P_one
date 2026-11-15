import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import AopRateManager from "../components/marketing-merchandising/master-data/AopRateManager";

export const Route = createFileRoute("/mm-master-aop-rate")({
  head: () => ({
    meta: [
      { title: "AOP Process Rate Master — CriptonHRIS" },
      {
        name: "description",
        content: "Manage master AOP process rates, process loss percentages, and cost rates per kilogram.",
      },
    ],
  }),
  component: MMAopRatePage,
});

function MMAopRatePage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-aop-rate"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "AOP Process Rate" },
      ]}
      title="AOP Process Rate Master"
    >
      <AopRateManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMAopRatePage;

