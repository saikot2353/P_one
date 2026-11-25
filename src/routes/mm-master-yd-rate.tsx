import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import YarnDyeingRateManager from "../components/marketing-merchandising/master-data/YarnDyeingRateManager";

export const Route = createFileRoute("/mm-master-yd-rate")({
  head: () => ({
    meta: [
      { title: "Yarn Dyeing (Y/D) Rate Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Manage Yarn Dyeing (Y/D) Rate master records by Y/D Type, Color Shade, and Dyeing Method with standard USD rates.",
      },
    ],
  }),
  component: MMYarnDyeingRatePage,
});

function MMYarnDyeingRatePage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-yd-rate"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-fabric-composition" },
        { label: "Yarn Dyeing (Y/D) Rate" },
      ]}
      title="Yarn Dyeing (Y/D) Rate Master"
      subtitle="Standardized process loss and rates for Feeder Stripe and Engineering Stripe yarn dyeing."
    >
      <YarnDyeingRateManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMYarnDyeingRatePage;
