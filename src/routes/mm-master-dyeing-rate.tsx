import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import DyeingRateManager from "../components/marketing-merchandising/master-data/DyeingRateManager";

export const Route = createFileRoute("/mm-master-dyeing-rate")({
  head: () => ({
    meta: [
      { title: "Dyeing Rate Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Manage Dyeing Rate master records by Color Shade and Dyeing Method with standard USD rates.",
      },
    ],
  }),
  component: MMDyeingRatePage,
});

function MMDyeingRatePage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-dyeing-rate"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-fabric-composition" },
        { label: "Dyeing Rate" },
      ]}
      title="Dyeing Rate Master"
      subtitle="Standardized shade-wise and process-wise dyeing rates for fabric costing and supplier comparison."
    >
      <DyeingRateManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMDyeingRatePage;
