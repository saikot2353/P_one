import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import BuyerStyleManager from "../components/marketing-merchandising/master-data/BuyerStyleManager";

export const Route = createFileRoute("/mm-master-buyer-style")({
  head: () => ({
    meta: [
      { title: "Buyer Style Master — CriptonHRIS" },
      {
        name: "description",
        content: "Manage buyer styles with multi-entry creation and buyer relationship tracking.",
      },
    ],
  }),
  component: MMBuyerStylePage,
});

function MMBuyerStylePage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-buyer-style"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "Buyer Style" },
      ]}
      title="Buyer Style Master"
    >
      <BuyerStyleManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMBuyerStylePage;

