import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import MarketingMerchandisingLayout from "../components/marketing-merchandising/MarketingMerchandisingLayout";
import BuyerNameManager from "../components/marketing-merchandising/master-data/BuyerNameManager";

export const Route = createFileRoute("/mm-master-buyer-name")({
  head: () => ({
    meta: [
      { title: "Buyer Master — CriptonHRIS" },
      {
        name: "description",
        content:
          "Manage buyer master accounts, country of origin, account holders, and department configurations.",
      },
    ],
  }),
  component: MMBuyerNamePage,
});

function MMBuyerNamePage() {
  return (
    <MarketingMerchandisingLayout
      activePath="/mm-master-buyer-name"
      breadcrumbs={[
        { label: "Merchandising Master Data", to: "/mm-master-buyer-name" },
        { label: "Buyer" },
      ]}
      title="Buyer Master"
    >
      <BuyerNameManager />
    </MarketingMerchandisingLayout>
  );
}

export default MMBuyerNamePage;

