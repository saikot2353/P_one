import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import YarnRateManager from "../components/marketing-merchandising/master-data/YarnRateManager";

export const Route = createFileRoute("/mm-master-yarn-rate")({
  head: () => ({
    meta: [
      { title: "Weekly Yarn Rate Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Weekly Yarn Rate benchmark master with Grade A and Grade B breakdown, dynamic rows, copy from prior weeks, and certification upcharges.",
      },
    ],
  }),
  component: MMYarnRatePage,
});

function MMYarnRatePage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-yarn-rate"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-fabric-composition" },
        { label: "Yarn Rate" },
      ]}
      title="Weekly Yarn Rate Master"
      subtitle="Weekly Grade A & B benchmark spinning prices, dynamic row entry, previous-week copying, and certification upcharges."
    >
      <YarnRateManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMYarnRatePage;
