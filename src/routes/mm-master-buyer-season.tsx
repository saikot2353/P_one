import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import BuyerSeasonManager from "../components/marketing-merchandising/master-data/BuyerSeasonManager";

export const Route = createFileRoute("/mm-master-buyer-season")({
  head: () => ({
    meta: [
      { title: "Buyer Season Master — CriptonHRIS" },
      {
        name: "description",
        content: "Manage buyer seasons with multi-entry creation and buyer relationship tracking.",
      },
    ],
  }),
  component: MMBuyerSeasonPage,
});

function MMBuyerSeasonPage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-buyer-season"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "Buyer Season" },
      ]}
      title="Buyer Season Master"
    >
      <BuyerSeasonManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMBuyerSeasonPage;

